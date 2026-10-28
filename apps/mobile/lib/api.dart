import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:uuid/uuid.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import 'generated/learning.pb.dart';

const apiBase = String.fromEnvironment(
  'API_URL',
  defaultValue: 'http://127.0.0.1:4000',
);

class LearningApi {
  final http.Client _http = http.Client();
  WebSocketChannel? _channel;
  StreamSubscription<dynamic>? _subscription;
  Timer? _reconnect;
  bool _disposed = false;
  int _generation = 0;
  int _attempt = 0;
  final _pending = <String, Completer<ChatMessage>>{};
  void Function(Envelope)? onEvent;
  void Function(String)? onConnection;
  String status = 'disconnected';
  Uri _uri(String path) => Uri.parse('$apiBase/api$path');
  Future<dynamic> _response(http.Response response) async {
    final value = jsonDecode(utf8.decode(response.bodyBytes));
    if (response.statusCode >= 400) {
      throw Exception(value['message'] ?? 'Request failed');
    }
    return value;
  }

  Future<List<Map<String, dynamic>>> conversations() async {
    final data = await _response(
      await _http
          .get(_uri('/conversations'))
          .timeout(const Duration(seconds: 15)),
    );
    return (data as List).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createConversation(String title) async =>
      Map<String, dynamic>.from(
        await _response(
          await _http
              .post(
                _uri('/conversations'),
                headers: {'Content-Type': 'application/json'},
                body: jsonEncode({'title': title}),
              )
              .timeout(const Duration(seconds: 15)),
        ),
      );
  Future<Map<String, dynamic>> messages(String id, {String? cursor}) async {
    final uri = _uri('/conversations/$id/messages')
        .replace(queryParameters: cursor == null ? null : {'cursor': cursor});
    return Map<String, dynamic>.from(
      await _response(
        await _http.get(uri).timeout(const Duration(seconds: 15)),
      ),
    );
  }

  Future<Media> upload(String path, {int durationMs = 0}) async {
    final request = http.MultipartRequest('POST', _uri('/media'));
    request.fields['durationMs'] = durationMs.toString();
    request.files.add(await http.MultipartFile.fromPath('file', path));
    final response = await http.Response.fromStream(
      await _http.send(request).timeout(const Duration(seconds: 60)),
    );
    return mediaFromJson(Map<String, dynamic>.from(await _response(response)));
  }

  String mediaUrl(String id) => '$apiBase/api/media/$id';
  void _state(String value) {
    status = value;
    onConnection?.call(value);
  }

  void connect() {
    if (_disposed || _channel != null) return;
    final generation = ++_generation;
    _state('connecting');
    final base = Uri.parse(apiBase);
    final channel = WebSocketChannel.connect(
      base.replace(scheme: base.scheme == 'https' ? 'wss' : 'ws', path: '/ws'),
    );
    _channel = channel;
    _subscription = channel.stream.listen(
      (dynamic data) {
        if (generation != _generation || _disposed) return;
        try {
          final event = Envelope.fromBuffer((data as List).cast<int>());
          if (event.version != 1) throw StateError('Unsupported protocol');
          if (event.type == EventType.HELLO) {
            _attempt = 0;
            _state('connected');
          }
          final pending = _pending.remove(event.requestId);
          if (pending != null) {
            if (event.type == EventType.ACK && event.hasMessage()) {
              pending.complete(event.message);
            } else {
              pending.completeError(StateError(event.error));
            }
          }
          onEvent?.call(event);
        } catch (_) {
          channel.sink.close(1002, 'Invalid frame');
        }
      },
      onDone: () => _disconnected(generation),
      onError: (Object _) => _disconnected(generation),
      cancelOnError: true,
    );
  }

  void _disconnected(int generation) {
    if (generation != _generation || _disposed) return;
    ++_generation;
    _channel?.sink.close();
    _channel = null;
    _state('disconnected');
    for (final item in _pending.values) {
      if (!item.isCompleted) item.completeError(StateError('Connection lost'));
    }
    _pending.clear();
    final delay = (500 * (1 << _attempt.clamp(0, 5))).clamp(500, 15000);
    _attempt++;
    _reconnect?.cancel();
    _reconnect = Timer(Duration(milliseconds: delay), connect);
  }

  Future<ChatMessage> send(ChatMessage message) async {
    if (status != 'connected' || _channel == null) {
      throw StateError('Not connected');
    }
    final id = const Uuid().v4(), result = Completer<ChatMessage>();
    _pending[id] = result;
    _channel!.sink.add(
      Envelope(
        version: 1,
        type: EventType.SEND_MESSAGE,
        requestId: id,
        message: message,
      ).writeToBuffer(),
    );
    try {
      return await result.future.timeout(const Duration(seconds: 15));
    } finally {
      _pending.remove(id);
    }
  }

  void dispose() {
    _disposed = true;
    ++_generation;
    _reconnect?.cancel();
    _subscription?.cancel();
    _channel?.sink.close();
    _http.close();
    for (final item in _pending.values) {
      if (!item.isCompleted) item.completeError(StateError('Closed'));
    }
    _pending.clear();
  }
}

Media mediaFromJson(Map<String, dynamic> json) => Media(
  id: json['id'] as String?,
  mimeType: json['mimeType'] as String?,
  originalName: json['originalName'] as String?,
  size: json['size'] as int?,
  durationMs: json['durationMs'] as int?,
);
ChatMessage messageFromJson(Map<String, dynamic> json) => ChatMessage(
  id: json['id'] as String?,
  conversationId: json['conversationId'] as String?,
  clientMessageId: json['clientMessageId'] as String?,
  kind: MessageKind.valueOf(json['kind'] as int),
  text: json['text'] as String?,
  mediaId: json['mediaId'] as String?,
  createdAt: json['createdAt'] as String?,
  media: json['media'] == null
      ? null
      : mediaFromJson(Map<String, dynamic>.from(json['media'])),
);
