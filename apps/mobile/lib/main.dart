import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:just_audio/just_audio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';
import 'package:uuid/uuid.dart';

import 'state.dart';
import 'generated/locales.dart';
import 'generated/learning.pb.dart';

void main() => runApp(const ProviderScope(child: LearningApp()));
String tr(WidgetRef ref, String key) =>
    translations[ref.watch(settingsProvider).language]?[key] ?? key;
String durationLabel(int milliseconds) {
  final seconds = milliseconds ~/ 1000;
  return '${(seconds ~/ 60).toString().padLeft(2, '0')}:${(seconds % 60).toString().padLeft(2, '0')}';
}

const brand = Color(0xff07c160);

class LearningApp extends ConsumerWidget {
  const LearningApp({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    ThemeData theme(Brightness brightness) {
      final dark = brightness == Brightness.dark;
      return ThemeData(
        useMaterial3: true,
        brightness: brightness,
        colorScheme: ColorScheme.fromSeed(
          seedColor: brand,
          primary: brand,
          brightness: brightness,
        ),
        scaffoldBackgroundColor: dark
            ? const Color(0xff111111)
            : const Color(0xffededed),
        appBarTheme: AppBarTheme(
          backgroundColor: dark
              ? const Color(0xff202020)
              : const Color(0xfff7f7f7),
          surfaceTintColor: Colors.transparent,
          centerTitle: true,
          elevation: 0,
        ),
        cardColor: dark ? const Color(0xff191919) : Colors.white,
        dividerColor: dark ? const Color(0xff303030) : const Color(0xffe0e0e0),
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: dark
              ? const Color(0xff202020)
              : const Color(0xfff7f7f7),
          surfaceTintColor: Colors.transparent,
          indicatorColor: Colors.transparent,
          labelTextStyle: WidgetStateProperty.resolveWith(
            (states) => TextStyle(
              fontSize: 11,
              color: states.contains(WidgetState.selected)
                  ? brand
                  : (dark ? Colors.white60 : Colors.black54),
            ),
          ),
        ),
      );
    }

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: tr(ref, 'app'),
      theme: theme(Brightness.light),
      darkTheme: theme(Brightness.dark),
      themeMode: settings.theme,
      locale: settings.language == 'en'
          ? const Locale('en')
          : const Locale('zh', 'CN'),
      supportedLocales: const [Locale('zh', 'CN'), Locale('en')],
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      home: const LearningHome(),
    );
  }
}

class LearningHome extends ConsumerStatefulWidget {
  const LearningHome({super.key});
  @override
  ConsumerState<LearningHome> createState() => _LearningHomeState();
}

class _LearningHomeState extends ConsumerState<LearningHome>
    with WidgetsBindingObserver {
  int tab = 0;
  final search = TextEditingController();
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    search.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      unawaited(ref.read(learningProvider.notifier).refresh());
      ref.read(apiProvider).connect();
    }
  }

  Future<void> open(Map<String, dynamic> row) async {
    unawaited(ref.read(learningProvider.notifier).select(row['id'] as String));
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ConversationPage(
          id: row['id'] as String,
          title: row['title'] as String,
        ),
      ),
    );
  }

  Future<void> create() async {
    final name = await showDialog<String>(
      context: context,
      builder: (_) => const NewConversationDialog(),
    );
    if (name == null || !mounted) return;
    try {
      final value = await ref
          .read(learningProvider.notifier)
          .create(name.trim().isEmpty ? tr(ref, 'newDefault') : name.trim());
      if (mounted) await open(value);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(tr(ref, 'createError'))));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final data = ref.watch(learningProvider);
    final rows = data.conversations
        .where(
          (row) => (row['title'] as String).toLowerCase().contains(
            search.text.toLowerCase(),
          ),
        )
        .toList();
    return Scaffold(
      appBar: AppBar(
        title: Text(tr(ref, tab == 0 ? 'app' : 'settings')),
        actions: tab == 0
            ? [
                IconButton(
                  onPressed: create,
                  tooltip: tr(ref, 'new'),
                  icon: const Icon(Icons.add_circle_outline),
                ),
              ]
            : null,
      ),
      body: tab == 1
          ? const SettingsPage()
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
                  child: TextField(
                    controller: search,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText: tr(ref, 'search'),
                      prefixIcon: const Icon(Icons.search, size: 19),
                      filled: true,
                      fillColor: Theme.of(context).cardColor,
                      isDense: true,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(7),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: ref.read(learningProvider.notifier).refresh,
                    child: data.loading
                        ? const Center(child: CircularProgressIndicator())
                        : data.error.isNotEmpty
                        ? ListView(
                            children: [
                              const SizedBox(height: 60),
                              Center(child: Text(tr(ref, data.error))),
                              TextButton(
                                onPressed: () => ref
                                    .read(learningProvider.notifier)
                                    .refresh(),
                                child: Text(tr(ref, 'retry')),
                              ),
                            ],
                          )
                        : rows.isEmpty
                        ? ListView(
                            children: [
                              const SizedBox(height: 80),
                              Center(
                                child: Text(
                                  tr(
                                    ref,
                                    search.text.isEmpty
                                        ? 'noChats'
                                        : 'noMatches',
                                  ),
                                ),
                              ),
                            ],
                          )
                        : ListView.separated(
                            itemCount: rows.length,
                            separatorBuilder: (_, _) => Divider(
                              height: 1,
                              indent: 72,
                              color: Theme.of(context).dividerColor,
                            ),
                            itemBuilder: (context, index) {
                              final row = rows[index],
                                  last =
                                      row['lastMessage']
                                          as Map<String, dynamic>?;
                              final summary = last == null
                                  ? tr(ref, 'emptySummary')
                                  : last['kind'] == 1
                                  ? tr(ref, 'voiceSummary')
                                  : last['kind'] == 2
                                  ? tr(ref, 'imageSummary')
                                  : last['text'] as String;
                              return ColoredBox(
                                color: Theme.of(context).cardColor,
                                child: ListTile(
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 17,
                                    vertical: 9,
                                  ),
                                  leading: Container(
                                    width: 43,
                                    height: 43,
                                    decoration: BoxDecoration(
                                      color: [
                                        const Color(0xffd6e7dc),
                                        const Color(0xffe1e7f3),
                                        const Color(0xffede3d6),
                                      ][index % 3],
                                      borderRadius: BorderRadius.circular(7),
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      (row['title'] as String).substring(0, 1),
                                      style: const TextStyle(
                                        color: Color(0xff42694f),
                                      ),
                                    ),
                                  ),
                                  title: Text(
                                    row['title'] as String,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  subtitle: Padding(
                                    padding: const EdgeInsets.only(top: 5),
                                    child: Text(
                                      summary,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Theme.of(context).hintColor,
                                      ),
                                    ),
                                  ),
                                  onTap: () => open(row),
                                ),
                              );
                            },
                          ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        data.connection == 'connected'
                            ? Icons.wifi
                            : Icons.wifi_off,
                        size: 13,
                        color: data.connection == 'connected'
                            ? brand
                            : Colors.grey,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        tr(ref, data.connection),
                        style: TextStyle(
                          fontSize: 10,
                          color: Theme.of(context).hintColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: tab,
        onDestinationSelected: (value) => setState(() => tab = value),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.chat_bubble_outline),
            selectedIcon: const Icon(Icons.chat_bubble_outline, color: brand),
            label: tr(ref, 'chats'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.settings_outlined),
            selectedIcon: const Icon(Icons.settings_outlined, color: brand),
            label: tr(ref, 'settings'),
          ),
        ],
      ),
    );
  }
}

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider),
        controller = ref.read(settingsProvider.notifier);
    Widget heading(String key) => Padding(
      padding: const EdgeInsets.fromLTRB(20, 25, 20, 10),
      child: Text(
        tr(ref, key),
        style: TextStyle(fontSize: 12, color: Theme.of(context).hintColor),
      ),
    );
    Widget choice({
      required String title,
      required String subtitle,
      required bool selected,
      required VoidCallback onTap,
    }) => ColoredBox(
      color: Theme.of(context).cardColor,
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 14)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 11)),
        trailing: selected
            ? const Icon(Icons.check_circle, color: brand, size: 21)
            : const Icon(
                Icons.radio_button_unchecked,
                color: Colors.grey,
                size: 21,
              ),
        onTap: onTap,
      ),
    );
    return ListView(
      children: [
        heading('language'),
        choice(
          title: '简体中文',
          subtitle: 'Chinese (Simplified)',
          selected: settings.language == 'zh-CN',
          onTap: () => controller.language('zh-CN'),
        ),
        const Divider(height: 1),
        choice(
          title: 'English',
          subtitle: '英语',
          selected: settings.language == 'en',
          onTap: () => controller.language('en'),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Text(
            tr(ref, 'languageHint'),
            style: TextStyle(fontSize: 10, color: Theme.of(context).hintColor),
          ),
        ),
        heading('appearance'),
        for (final value in ThemeMode.values) ...[
          choice(
            title: tr(ref, value.name),
            subtitle: tr(ref, '${value.name}Hint'),
            selected: settings.theme == value,
            onTap: () => controller.theme(value),
          ),
          const Divider(height: 1),
        ],
        Padding(
          padding: const EdgeInsets.all(20),
          child: Text(
            tr(ref, 'deviceHint'),
            style: TextStyle(fontSize: 10, color: Theme.of(context).hintColor),
          ),
        ),
      ],
    );
  }
}

class ConversationPage extends ConsumerStatefulWidget {
  final String id, title;
  const ConversationPage({super.key, required this.id, required this.title});
  @override
  ConsumerState<ConversationPage> createState() => _ConversationPageState();
}

class _ConversationPageState extends ConsumerState<ConversationPage> {
  final input = TextEditingController(), scroll = ScrollController();
  final recorder = AudioRecorder();
  Timer? timer;
  DateTime? started;
  String? imagePath, audioPath;
  int durationMs = 0;
  bool recording = false, preparing = false, uploading = false;
  String lastId = '';
  bool get busy =>
      recording ||
      preparing ||
      uploading ||
      imagePath != null ||
      audioPath != null;
  @override
  void initState() {
    super.initState();
    input.text = ref.read(learningProvider.notifier).drafts[widget.id] ?? '';
    input.addListener(
      () => ref.read(learningProvider.notifier).drafts[widget.id] = input.text,
    );
  }

  @override
  void dispose() {
    timer?.cancel();
    unawaited(recorder.dispose());
    input.dispose();
    scroll.dispose();
    super.dispose();
  }

  void notify(String key) {
    if (mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(tr(ref, key))));
    }
  }

  Future<void> leave() async {
    if (!busy) {
      Navigator.pop(context);
      return;
    }
    if (uploading) return;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        content: Text(tr(ref, 'leaveRecord')),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(tr(ref, 'cancel')),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text(tr(ref, 'back')),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    timer?.cancel();
    if (recording) await recorder.stop();
    if (!mounted) return;
    setState(() {
      recording = false;
      preparing = false;
      imagePath = null;
      audioPath = null;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) Navigator.pop(context);
    });
  }

  Future<void> chooseImage() async {
    try {
      final image = await ImagePicker().pickImage(source: ImageSource.gallery);
      if (image == null || !mounted) return;
      if (await image.length() > 25 * 1024 * 1024) {
        notify('fileTooLarge');
        return;
      }
      setState(() => imagePath = image.path);
    } catch (_) {
      notify('error');
    }
  }

  Future<void> startRecord() async {
    if (busy) return;
    setState(() => preparing = true);
    try {
      if (!await recorder.hasPermission()) {
        notify('recordError');
        return;
      }
      final directory = await getTemporaryDirectory(),
          path =
              '${(await getTemporaryDirectory()).path}/speaking-${const Uuid().v4()}.m4a';
      if (!directory.existsSync()) await directory.create(recursive: true);
      await recorder.start(
        const RecordConfig(encoder: AudioEncoder.aacLc),
        path: path,
      );
      if (!mounted) {
        await recorder.stop();
        return;
      }
      started = DateTime.now();
      setState(() {
        recording = true;
        durationMs = 0;
      });
      timer = Timer.periodic(const Duration(milliseconds: 200), (_) {
        if (!mounted) return;
        final elapsed = DateTime.now().difference(started!).inMilliseconds;
        setState(() => durationMs = elapsed.clamp(0, 600000));
        if (elapsed >= 600000) unawaited(stopRecord());
      });
    } catch (_) {
      notify('recordError');
    } finally {
      if (mounted) setState(() => preparing = false);
    }
  }

  Future<void> stopRecord() async {
    timer?.cancel();
    try {
      final path = await recorder.stop();
      if (mounted) {
        setState(() {
          recording = false;
          audioPath = path;
        });
      }
    } catch (_) {
      if (mounted) setState(() => recording = false);
      notify('recordError');
    }
  }

  void sendText() {
    final value = input.text.trim();
    if (value.isEmpty || ref.read(learningProvider).connection != 'connected') {
      return;
    }
    input.clear();
    setState(() {});
    unawaited(
      ref
          .read(learningProvider.notifier)
          .send(
            ChatMessage(
              conversationId: widget.id,
              clientMessageId: const Uuid().v4(),
              kind: MessageKind.TEXT,
              text: value,
              createdAt: DateTime.now().toUtc().toIso8601String(),
            ),
          ),
    );
  }

  Future<void> sendAttachment() async {
    final path = imagePath ?? audioPath;
    if (path == null ||
        uploading ||
        ref.read(learningProvider).connection != 'connected') {
      return;
    }
    setState(() => uploading = true);
    try {
      final isAudio = audioPath != null;
      final media = await ref
          .read(apiProvider)
          .upload(path, durationMs: isAudio ? durationMs : 0);
      if (!mounted) return;
      final message = ChatMessage(
        conversationId: widget.id,
        clientMessageId: const Uuid().v4(),
        kind: isAudio ? MessageKind.AUDIO : MessageKind.IMAGE,
        mediaId: media.id,
        media: media,
        createdAt: DateTime.now().toUtc().toIso8601String(),
      );
      setState(() {
        imagePath = null;
        audioPath = null;
      });
      unawaited(ref.read(learningProvider.notifier).send(message));
    } catch (_) {
      notify('uploadError');
    } finally {
      if (mounted) setState(() => uploading = false);
    }
  }

  Widget composer(bool connected) {
    Widget content;
    if (recording) {
      content = Row(
        children: [
          const Icon(Icons.mic, color: brand),
          const SizedBox(width: 8),
          Expanded(child: Text(tr(ref, 'recording'))),
          Text(durationLabel(durationMs)),
          IconButton(
            onPressed: stopRecord,
            tooltip: tr(ref, 'stopRecord'),
            icon: const Icon(Icons.stop_circle_outlined, color: brand),
          ),
        ],
      );
    } else if (imagePath != null || audioPath != null) {
      content = Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (imagePath != null)
            Image.file(File(imagePath!), height: 90)
          else
            AudioNote(source: audioPath!, local: true, durationMs: durationMs),
          Row(
            children: [
              TextButton(
                onPressed: uploading
                    ? null
                    : () => setState(() {
                        imagePath = null;
                        audioPath = null;
                      }),
                child: Text(tr(ref, 'remove')),
              ),
              const Spacer(),
              FilledButton(
                onPressed: uploading || !connected ? null : sendAttachment,
                child: uploading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text(tr(ref, 'send')),
              ),
            ],
          ),
        ],
      );
    } else {
      content = Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              TextButton.icon(
                onPressed: preparing ? null : startRecord,
                icon: const Icon(Icons.mic_none, size: 19),
                label: Text(
                  tr(ref, 'voice'),
                  style: const TextStyle(fontSize: 11),
                ),
              ),
              TextButton.icon(
                onPressed: chooseImage,
                icon: const Icon(Icons.image_outlined, size: 19),
                label: Text(
                  tr(ref, 'image'),
                  style: const TextStyle(fontSize: 11),
                ),
              ),
            ],
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: TextField(
                  controller: input,
                  minLines: 1,
                  maxLines: 4,
                  maxLength: 10000,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: tr(ref, 'placeholder'),
                    counterText: '',
                    filled: true,
                    fillColor: Theme.of(context).cardColor,
                    isDense: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(7),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  style: const TextStyle(fontSize: 13),
                ),
              ),
              const SizedBox(width: 10),
              FilledButton(
                style: FilledButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
                onPressed: connected && input.text.trim().isNotEmpty
                    ? sendText
                    : null,
                child: Text(tr(ref, 'send')),
              ),
            ],
          ),
        ],
      );
    }
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).appBarTheme.backgroundColor,
        border: Border(top: BorderSide(color: Theme.of(context).dividerColor)),
      ),
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
      child: SafeArea(top: false, child: content),
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = ref.watch(learningProvider);
    final messages = data.messages[widget.id] ?? <ChatMessage>[];
    final pending = data.pending
        .where(
          (item) =>
              item.message.conversationId == widget.id &&
              !messages.any(
                (m) => m.clientMessageId == item.message.clientMessageId,
              ),
        )
        .toList();
    final key = '${messages.lastOrNull?.id}/${pending.length}';
    if (key != lastId) {
      lastId = key;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && scroll.hasClients) {
          scroll.animateTo(
            scroll.position.maxScrollExtent,
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOut,
          );
        }
      });
    }
    final connected = data.connection == 'connected';
    final history = ListView(
      controller: scroll,
      padding: const EdgeInsets.all(14),
      children: [
        if (data.cursors[widget.id] != null)
          Center(
            child: TextButton(
              onPressed: () => ref
                  .read(learningProvider.notifier)
                  .loadMessages(widget.id, older: true),
              child: Text(tr(ref, 'loadOlder')),
            ),
          ),
        if (data.error.isNotEmpty)
          Center(
            child: TextButton(
              onPressed: () =>
                  ref.read(learningProvider.notifier).loadMessages(widget.id),
              child: Text(tr(ref, 'retry')),
            ),
          ),
        if (messages.isEmpty && pending.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 100),
            child: Column(
              children: [
                const Icon(
                  Icons.menu_book_outlined,
                  size: 40,
                  color: Colors.grey,
                ),
                const SizedBox(height: 15),
                Text(tr(ref, 'empty')),
                const SizedBox(height: 8),
                Text(
                  tr(ref, 'emptyHint'),
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ),
        ...messages.map(
          (message) => MessageTile(key: ValueKey(message.id), message: message),
        ),
        ...pending.map(
          (item) => Column(
            key: ValueKey(item.message.clientMessageId),
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              MessageTile(message: item.message),
              Padding(
                padding: const EdgeInsets.only(right: 38, bottom: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      tr(ref, item.failed ? 'failed' : 'sending'),
                      style: TextStyle(
                        fontSize: 10,
                        color: item.failed ? Colors.red : Colors.grey,
                      ),
                    ),
                    if (item.failed)
                      TextButton(
                        onPressed: () => ref
                            .read(learningProvider.notifier)
                            .send(item.message),
                        child: Text(tr(ref, 'retry')),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
    return PopScope(
      canPop: !busy,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) unawaited(leave());
      },
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            onPressed: leave,
            tooltip: tr(ref, 'back'),
            icon: const Icon(Icons.chevron_left),
          ),
          title: Column(
            children: [
              Text(widget.title, style: const TextStyle(fontSize: 16)),
              Text(
                tr(ref, data.connection),
                style: TextStyle(
                  fontSize: 10,
                  color: connected ? brand : Colors.grey,
                ),
              ),
            ],
          ),
        ),
        body: Column(
          children: [
            Expanded(
              child: RefreshIndicator(
                onRefresh: () =>
                    ref.read(learningProvider.notifier).loadMessages(widget.id),
                child: history,
              ),
            ),
            composer(connected),
          ],
        ),
      ),
    );
  }
}

class NewConversationDialog extends ConsumerStatefulWidget {
  const NewConversationDialog({super.key});
  @override
  ConsumerState<NewConversationDialog> createState() =>
      _NewConversationDialogState();
}

class _NewConversationDialogState extends ConsumerState<NewConversationDialog> {
  final controller = TextEditingController();
  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: Text(tr(ref, 'new')),
    content: TextField(
      controller: controller,
      autofocus: true,
      maxLength: 80,
      decoration: InputDecoration(
        labelText: tr(ref, 'name'),
        hintText: tr(ref, 'nameHint'),
      ),
      onSubmitted: (value) => Navigator.pop(context, value),
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: Text(tr(ref, 'cancel')),
      ),
      FilledButton(
        onPressed: () => Navigator.pop(context, controller.text),
        child: Text(tr(ref, 'create')),
      ),
    ],
  );
}

class MessageTile extends ConsumerWidget {
  final ChatMessage message;
  const MessageTile({super.key, required this.message});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dark = Theme.of(context).brightness == Brightness.dark,
        url = ref.read(apiProvider).mediaUrl(message.mediaId);
    final date = DateTime.tryParse(message.createdAt)?.toLocal();
    Widget content;
    if (message.kind == MessageKind.IMAGE) {
      content = GestureDetector(
        onTap: () => showDialog<void>(
          context: context,
          builder: (context) => Dialog(
            backgroundColor: Colors.transparent,
            child: Stack(
              children: [
                InteractiveViewer(child: Image.network(url)),
                Positioned(
                  right: 0,
                  top: 0,
                  child: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: Image.network(
            url,
            width: 190,
            fit: BoxFit.contain,
            errorBuilder: (_, _, _) => const Icon(Icons.broken_image_outlined),
          ),
        ),
      );
    } else if (message.kind == MessageKind.AUDIO) {
      content = AudioNote(
        key: ValueKey(url),
        source: url,
        durationMs: message.media.durationMs,
      );
    } else {
      content = SelectableText(
        message.text,
        style: const TextStyle(
          fontSize: 14,
          height: 1.6,
          color: Color(0xff10220c),
        ),
      );
    }
    return Padding(
      padding: const EdgeInsets.only(bottom: 17),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  constraints: BoxConstraints(
                    maxWidth: MediaQuery.sizeOf(context).width * .76,
                  ),
                  padding: message.kind == MessageKind.IMAGE
                      ? EdgeInsets.zero
                      : const EdgeInsets.symmetric(
                          horizontal: 13,
                          vertical: 10,
                        ),
                  decoration: BoxDecoration(
                    color: dark
                        ? const Color(0xff2acb82)
                        : const Color(0xff95ec69),
                    borderRadius: BorderRadius.circular(7),
                  ),
                  child: content,
                ),
                if (date != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 5),
                    child: Text(
                      '${date.month}/${date.day} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}',
                      style: const TextStyle(color: Colors.grey, fontSize: 9),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 9),
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: const Color(0xffd6e7dc),
              borderRadius: BorderRadius.circular(6),
            ),
            alignment: Alignment.center,
            child: Text(
              tr(ref, 'me'),
              style: const TextStyle(fontSize: 10, color: Color(0xff42694f)),
            ),
          ),
        ],
      ),
    );
  }
}

class AudioNote extends ConsumerStatefulWidget {
  final String source;
  final bool local;
  final int durationMs;
  const AudioNote({
    super.key,
    required this.source,
    this.local = false,
    required this.durationMs,
  });
  @override
  ConsumerState<AudioNote> createState() => _AudioNoteState();
}

class _AudioNoteState extends ConsumerState<AudioNote> {
  final player = AudioPlayer();
  bool failed = false, loading = false;
  @override
  void dispose() {
    unawaited(player.dispose());
    super.dispose();
  }

  Future<void> toggle() async {
    if (loading) return;
    if (player.playing) {
      await player.pause();
      return;
    }
    setState(() {
      loading = true;
      failed = false;
    });
    try {
      if (player.audioSource == null) {
        if (widget.local) {
          await player.setFilePath(widget.source);
        } else {
          await player.setUrl(widget.source);
        }
      }
      if (player.processingState == ProcessingState.completed) {
        await player.seek(Duration.zero);
      }
      unawaited(
        player.play().catchError((Object error) {
          if (mounted) setState(() => failed = true);
        }),
      );
    } catch (_) {
      if (mounted) setState(() => failed = true);
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 220,
    child: StreamBuilder<PlayerState>(
      stream: player.playerStateStream,
      builder: (context, snapshot) {
        final playing =
            snapshot.data?.playing == true &&
            snapshot.data?.processingState != ProcessingState.completed;
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                IconButton(
                  onPressed: toggle,
                  tooltip: tr(ref, playing ? 'stopRecord' : 'voice'),
                  icon: loading
                      ? const SizedBox(
                          width: 17,
                          height: 17,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Icon(
                          playing ? Icons.pause : Icons.play_arrow,
                          color: const Color(0xff10220c),
                        ),
                ),
                const Expanded(
                  child: Icon(Icons.graphic_eq, color: Color(0xff42694f)),
                ),
                Text(
                  durationLabel(widget.durationMs),
                  style: const TextStyle(
                    fontSize: 11,
                    color: Color(0xff10220c),
                  ),
                ),
              ],
            ),
            if (failed)
              Text(
                tr(ref, 'error'),
                style: const TextStyle(color: Colors.red, fontSize: 10),
              ),
          ],
        );
      },
    ),
  );
}
