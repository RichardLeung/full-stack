import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:learning_notes/state.dart';
import 'package:learning_notes/generated/learning.pb.dart';
import 'package:learning_notes/generated/locales.dart';

void main() {
  test(
    'device preferences restore and language changes preserve appearance',
    () async {
      SharedPreferences.setMockInitialValues({
        'learning-language': 'en',
        'learning-appearance': 'dark',
      });
      final container = ProviderContainer();
      addTearDown(container.dispose);
      final subscription = container.listen(settingsProvider, (_, _) {});
      addTearDown(subscription.close);
      await Future<void>.delayed(Duration.zero);
      expect(container.read(settingsProvider).language, 'en');
      expect(container.read(settingsProvider).theme, ThemeMode.dark);
      await container.read(settingsProvider.notifier).language('zh-CN');
      expect(container.read(settingsProvider).theme, ThemeMode.dark);
      expect(
        (await SharedPreferences.getInstance()).getString('learning-language'),
        'zh-CN',
      );
    },
  );
  test('translation catalogs have matching keys', () {
    expect(
      translations['en']!.keys.toSet(),
      translations['zh-CN']!.keys.toSet(),
    );
  });
  test('Protobuf preserves Unicode and optional media', () {
    final input = Envelope(
      version: 1,
      type: EventType.SEND_MESSAGE,
      requestId: 'req',
      message: ChatMessage(
        conversationId: 'conversation',
        clientMessageId: 'client',
        kind: MessageKind.TEXT,
        text: '学习 👋 hello',
      ),
    );
    final decoded = Envelope.fromBuffer(input.writeToBuffer());
    expect(decoded.message.text, input.message.text);
    expect(decoded.message.hasMedia(), false);
  });
}
