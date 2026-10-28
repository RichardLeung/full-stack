import 'dart:async';
import 'dart:io';
import 'dart:convert';

import 'package:uuid/uuid.dart';

import 'package:learning_notes/api.dart';
import 'package:learning_notes/generated/learning.pb.dart';

Future<void> main() async {
  final api = LearningApi(), ready = Completer<void>();
  api.onConnection = (state) {
    if (state == 'connected' && !ready.isCompleted) ready.complete();
  };
  api.connect();
  try {
    await ready.future.timeout(const Duration(seconds: 15));
    final conversation = await api.createConversation(
      'Dart smoke ${const Uuid().v4()}',
    );
    final id = conversation['id'] as String;
    final message = ChatMessage(
      conversationId: id,
      clientMessageId: const Uuid().v4(),
      kind: MessageKind.TEXT,
      text: 'Flutter / Dart → Protobuf → NestJS ✓',
    );
    final ack = await api.send(message);
    final duplicate = await api.send(message);
    if (ack.id != duplicate.id) throw StateError('Idempotency failed');
    final rows = await api.messages(id);
    if ((rows['items'] as List).length != 1) {
      throw StateError('History does not match acknowledgement');
    }
    final directory = await Directory.systemTemp.createTemp('learning-smoke-');
    try {
      final file = File('${directory.path}/sample.png');
      await file.writeAsBytes(
        base64Decode(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',
        ),
      );
      final media = await api.upload(file.path);
      await api.send(
        ChatMessage(
          conversationId: id,
          clientMessageId: const Uuid().v4(),
          kind: MessageKind.IMAGE,
          mediaId: media.id,
        ),
      );
      if ((await api.messages(id))['items'].length != 2) {
        throw StateError('Image message missing');
      }
    } finally {
      await directory.delete(recursive: true);
    }
    stdout.writeln(
      'PASS Dart → NestJS: binary Protobuf, ACK, idempotency, HTTP history, image upload.',
    );
    stdout.writeln('Smoke conversation: $id');
  } finally {
    api.dispose();
  }
}
