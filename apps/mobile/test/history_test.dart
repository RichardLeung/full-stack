import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:learning_notes/api.dart';
import 'package:learning_notes/state.dart';

class HistoryApi extends LearningApi {
  final requestedCursors = <String?>[];
  int latest = 1;

  @override
  void connect() {}

  @override
  Future<List<Map<String, dynamic>>> conversations() async => [];

  @override
  Future<Map<String, dynamic>> messages(String id, {String? cursor}) async {
    requestedCursors.add(cursor);
    final index = cursor == 'latest-3' ? 2 : latest;
    return {
      'items': [
        {
          'id': 'message-$index',
          'conversationId': id,
          'clientMessageId': 'client-$index',
          'kind': 0,
          'text': 'note $index',
          'createdAt': '2026-10-27T00:00:0${index}Z',
        },
      ],
      'nextCursor': cursor == null ? 'latest-$latest' : null,
    };
  }
}

void main() {
  test(
    'refresh resets the history cursor so an offline gap can be loaded',
    () async {
      final api = HistoryApi();
      final container = ProviderContainer(
        overrides: [apiProvider.overrideWithValue(api)],
      );
      addTearDown(() {
        container.dispose();
        api.dispose();
      });
      final controller = container.read(learningProvider.notifier);
      await controller.select('conversation');
      expect(
        container.read(learningProvider).cursors['conversation'],
        'latest-1',
      );

      api.latest = 3;
      await controller.loadMessages('conversation');
      expect(
        container.read(learningProvider).cursors['conversation'],
        'latest-3',
      );
      await controller.loadMessages('conversation', older: true);
      expect(api.requestedCursors.last, 'latest-3');
      expect(
        container
            .read(learningProvider)
            .messages['conversation']!
            .map((m) => m.id),
        ['message-1', 'message-2', 'message-3'],
      );
      expect(container.read(learningProvider).cursors['conversation'], isNull);
    },
  );
}
