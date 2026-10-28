import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'api.dart';
import 'generated/learning.pb.dart';

class DeviceSettings {
  final String language;
  final ThemeMode theme;
  const DeviceSettings({
    this.language = 'zh-CN',
    this.theme = ThemeMode.system,
  });
}

final settingsProvider = NotifierProvider<SettingsController, DeviceSettings>(
  SettingsController.new,
);

class SettingsController extends Notifier<DeviceSettings> {
  bool _active = true;
  @override
  DeviceSettings build() {
    ref.onDispose(() => _active = false);
    Future.microtask(() async {
      final prefs = await SharedPreferences.getInstance();
      if (!_active) return;
      final language = prefs.getString('learning-language');
      final theme = prefs.getString('learning-appearance');
      state = DeviceSettings(
        language: language == 'en' ? 'en' : 'zh-CN',
        theme: theme == 'dark'
            ? ThemeMode.dark
            : theme == 'light'
            ? ThemeMode.light
            : ThemeMode.system,
      );
    });
    return const DeviceSettings();
  }

  Future<void> language(String value) async {
    state = DeviceSettings(language: value, theme: state.theme);
    await (await SharedPreferences.getInstance()).setString(
      'learning-language',
      value,
    );
  }

  Future<void> theme(ThemeMode value) async {
    state = DeviceSettings(language: state.language, theme: value);
    await (await SharedPreferences.getInstance()).setString(
      'learning-appearance',
      value.name,
    );
  }
}

class PendingMessage {
  final ChatMessage message;
  final bool failed;
  const PendingMessage(this.message, {this.failed = false});
}

class LearningState {
  final List<Map<String, dynamic>> conversations;
  final Map<String, List<ChatMessage>> messages;
  final Map<String, String?> cursors;
  final List<PendingMessage> pending;
  final String connection;
  final String error;
  final bool loading;
  const LearningState({
    this.conversations = const [],
    this.messages = const {},
    this.cursors = const {},
    this.pending = const [],
    this.connection = 'connecting',
    this.error = '',
    this.loading = true,
  });
  LearningState copyWith({
    List<Map<String, dynamic>>? conversations,
    Map<String, List<ChatMessage>>? messages,
    Map<String, String?>? cursors,
    List<PendingMessage>? pending,
    String? connection,
    String? error,
    bool? loading,
  }) => LearningState(
    conversations: conversations ?? this.conversations,
    messages: messages ?? this.messages,
    cursors: cursors ?? this.cursors,
    pending: pending ?? this.pending,
    connection: connection ?? this.connection,
    error: error ?? this.error,
    loading: loading ?? this.loading,
  );
}

final apiProvider = Provider<LearningApi>((ref) {
  final api = LearningApi();
  ref.onDispose(api.dispose);
  return api;
});
final learningProvider = NotifierProvider<LearningController, LearningState>(
  LearningController.new,
);

class LearningController extends Notifier<LearningState> {
  late LearningApi _api;
  bool _active = true;
  String? selected;
  int _listVersion = 0;
  final _messageVersions = <String, int>{};
  final drafts = <String, String>{};
  @override
  LearningState build() {
    _api = ref.watch(apiProvider);
    ref.onDispose(() => _active = false);
    _api.onConnection = (value) {
      if (_active) state = state.copyWith(connection: value);
    };
    _api.onEvent = (event) {
      if (!_active) return;
      if ([
        EventType.HELLO,
        EventType.CONVERSATION_CHANGED,
        EventType.MESSAGE_CREATED,
      ].contains(event.type)) {
        unawaited(refresh());
      }
      if (event.type == EventType.MESSAGE_CREATED &&
          event.conversationId == selected) {
        unawaited(loadMessages(event.conversationId));
      }
      if (event.type == EventType.HELLO && selected != null) {
        unawaited(loadMessages(selected!));
      }
    };
    Future.microtask(() {
      if (_active) {
        _api.connect();
        unawaited(refresh());
      }
    });
    return const LearningState();
  }

  Future<void> refresh() async {
    final version = ++_listVersion;
    try {
      final rows = await _api.conversations();
      if (_active && version == _listVersion) {
        state = state.copyWith(conversations: rows, loading: false, error: '');
      }
    } catch (_) {
      if (_active && version == _listVersion) {
        state = state.copyWith(loading: false, error: 'loadError');
      }
    }
  }

  Future<void> select(String id) async {
    selected = id;
    await loadMessages(id);
  }

  Future<void> loadMessages(String id, {bool older = false}) async {
    final version = (_messageVersions[id] ?? 0) + 1;
    _messageVersions[id] = version;
    try {
      final page = await _api.messages(
        id,
        cursor: older ? state.cursors[id] : null,
      );
      if (!_active || _messageVersions[id] != version) return;
      final values = (page['items'] as List)
          .map((item) => messageFromJson(Map<String, dynamic>.from(item)))
          .toList();
      final merged =
          {
            for (final item in state.messages[id] ?? <ChatMessage>[])
              item.id: item,
            for (final item in values) item.id: item,
          }.values.toList()..sort((a, b) {
            final time = a.createdAt.compareTo(b.createdAt);
            return time == 0 ? a.id.compareTo(b.id) : time;
          });
      state = state.copyWith(
        messages: {...state.messages, id: merged},
        cursors: {...state.cursors, id: page['nextCursor'] as String?},
        error: '',
      );
    } catch (_) {
      if (_active) state = state.copyWith(error: 'loadError');
    }
  }

  Future<Map<String, dynamic>> create(String title) async {
    final value = await _api.createConversation(title);
    await refresh();
    return value;
  }

  Future<void> send(ChatMessage message) async {
    state = state.copyWith(
      pending: [
        ...state.pending.where(
          (item) => item.message.clientMessageId != message.clientMessageId,
        ),
        PendingMessage(message),
      ],
    );
    try {
      await _api.send(message);
      await loadMessages(message.conversationId);
      await refresh();
      if (_active) {
        state = state.copyWith(
          pending: state.pending
              .where(
                (item) =>
                    item.message.clientMessageId != message.clientMessageId,
              )
              .toList(),
        );
      }
    } catch (_) {
      if (_active) {
        state = state.copyWith(
          pending: state.pending
              .map(
                (item) =>
                    item.message.clientMessageId == message.clientMessageId
                    ? PendingMessage(message, failed: true)
                    : item,
              )
              .toList(),
        );
      }
    }
  }
}
