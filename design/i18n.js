// Only interface copy is translated. Learning content and conversation names are user data.
const englishMessages = {
  '个人英语学习记录 · 微信风格双端设计': 'English Learning Notes · Mobile & Desktop Design',
  '把每天的英语练习，留在会话里。': 'Keep your English practice in conversations.',
  '个人学习记录 · 微信风格 · 中英双语 · v0.3': 'Personal learning notes · WeChat style · 中文 / English · v0.3',
  '设计稿视图': 'Design views', '双端总览': 'Overview', '手机': 'Mobile', '桌面': 'Desktop',
  '外观预览': 'Appearance preview', '跟随系统': 'System', '浅色': 'Light', '深色': 'Dark',
  '01 / 手机 App': '01 / Mobile app', '会话 / 设置': 'Chats / Settings',
  '02 / 桌面 App': '02 / Desktop app', '左下角设置入口': 'Settings at the bottom left',
  '英语学习记录': 'English Learning Notes',
  '微信风格 · 两种外观，中英双语': 'WeChat style · Two themes, two languages',
  '新建会话': 'New conversation', '文字 / 语音 / 图片': 'Text / Voice / Images',
  '回看记录': 'Review notes', '外观与语言': 'Appearance & Language',
  '手机：底部「会话 / 设置」，聊天详情隐藏 Tab。桌面：左下角齿轮打开设置。': 'Mobile: Chats and Settings tabs, hidden in a conversation. Desktop: settings at the bottom left.',
  '交互原型说明': 'About this prototype',
  '语音与播放为模拟，图片仅本地预览；记录刷新后重置，外观和语言选择保留在当前浏览器。': 'Recording and playback are simulated. Images stay in your browser. Notes reset on refresh; appearance and language preferences are saved.',
  '重置演示': 'Reset demo', '学习记录': 'Learning notes',
  '把练习一点点留下来': 'A little practice, every day',
  '搜索会话': 'Search conversations', '个人记录空间': 'Your personal space',
  '还没有记录，写下第一条吧': 'No notes yet. Add your first one.',
  '[语音]': '[Voice]', '[图片]': '[Image]',
  '打开会话：{name}': 'Open conversation: {name}',
  '没有找到会话': 'No conversations found',
  '暂停': 'Pause', '播放': 'Play', '语音': 'Voice', '图片': 'Image',
  '查看图片': 'View image', '学习图片': 'Learning image', '我': 'Me',
  '返回会话列表': 'Back to conversations',
  '文字、语音、图片，都留在这里': 'A place for text, voice and images',
  '个人记录': 'Personal notes', '今天': 'Today',
  '从第一条记录开始': 'Start with your first note',
  '写下一个表达，录一段口语，或存一张学习笔记。': 'Save an expression, record your speaking, or keep a photo of your notes.',
  '录制语音': 'Record voice', '选择图片': 'Choose image',
  '消息内容': 'Message', '写下一点今天的练习…': 'Save something from today’s practice…',
  '发送': 'Send', 'Enter 发送 · Shift + Enter 换行': 'Enter to send · Shift + Enter for a new line',
  '自动匹配系统的浅色或深色外观': 'Match your system appearance',
  '浅色模式': 'Light mode', '浅灰背景与绿色消息气泡': 'Light backgrounds and green bubbles',
  '深色模式': 'Dark mode', '深灰背景，适合夜间使用': 'Dark backgrounds for evening practice',
  '设置': 'Settings', '外观': 'Appearance', '语言': 'Language',
  '选择语言': 'Choose language', '返回设置': 'Back to settings',
  '外观设置保存在当前设备。选择跟随系统时，外观会随系统设置自动切换。': 'Appearance is saved on this device. System mode follows your system settings.',
  '界面语言切换后立即生效，学习内容保留原文。': 'Language changes apply immediately. Your learning content stays as written.',
  '会话': 'Chats', '手机主导航': 'Mobile navigation', '桌面主导航': 'Desktop navigation',
  '个人空间': 'Personal space', '查看会话': 'View conversations', '桌面设置': 'Desktop settings',
  '关闭': 'Close', '会话名称': 'Conversation name',
  '例如：雅思口语 · 旅行话题': 'e.g. IELTS speaking · Travel',
  '按话题或学习习惯，建立自己的记录空间。': 'Create a space for a topic or a daily practice routine.',
  '取消': 'Cancel', '创建会话': 'Create conversation', '新会话': 'New conversation',
  '刚刚': 'Just now', '昨天': 'Yesterday', '周一': 'Mon', '已加入当前会话': 'Added to this conversation',
  '录一段口语': 'Record your speaking', '准备好后，点击开始录音': 'When you’re ready, start recording',
  '开始录音': 'Start recording', '正在录音…': 'Recording…', '结束录音': 'Stop recording',
  '录制完成，试听后发送': 'Recording ready. Preview before sending.',
  '重录': 'Record again', '试听': 'Preview', '发送语音': 'Send voice',
  '正在试听…': 'Playing preview…', '语音已加入会话': 'Voice note added',
  '发送图片': 'Send image', '图片已加入会话': 'Image added',
  '已重置演示': 'Demo reset', '请选择图片文件': 'Please choose an image file',
  '待发送图片': 'Image preview', '图片读取失败，请重试': 'Could not read the image. Please try again.'
};
let locale = 'zh-CN';
try {
  const saved = localStorage.getItem('learning-language');
  if (['zh-CN', 'en'].includes(saved)) locale = saved;
} catch {}
document.documentElement.lang = locale;
function t(key, values = {}) {
  const message = locale === 'en' ? englishMessages[key] ?? key : key;
  return message.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
}
function translateShell() {
  document.documentElement.lang = locale;
  document.title = t('个人英语学习记录 · 微信风格双端设计');
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
}
