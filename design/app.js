const paths={settings:'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3Zm6 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0',chat:'M21 11c0 5-5 8-10 8l-6 3 1-5C-1 12 3 3 12 3c5 0 9 3 9 8Z',plus:'M12 5v14M5 12h14',search:'m21 21-4.5-4.5M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0',back:'m14 5-7 7 7 7',mic:'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-6-4v1a6 6 0 0 0 12 0v-1M12 18v4M9 22h6',image:'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm-1 13 5-5 5 5 3-3 5 5M15 7h.01',note:'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',play:'m9 5 10 7-10 7V5Z',pause:'M8 5v14M16 5v14',close:'m6 6 12 12M18 6 6 18',lock:'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4',stop:'M6 6h12v12H6z',check:'m5 12 4 4L19 6'};
const icon=(name)=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.note}"/></svg>`;
const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sampleImage='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280"><rect width="440" height="280" fill="#e8ecdf"/><rect x="24" y="20" width="392" height="240" rx="8" fill="#fafbf7" stroke="#c8d1bc"/><text x="45" y="57" font-family="sans-serif" font-size="12" fill="#8a957e">SPEAKING NOTES / 01</text><text x="45" y="103" font-family="sans-serif" font-size="25" fill="#49573b">A place to remember</text><path d="M45 125h320M45 167h270M45 195h295M45 223h200" stroke="#d8decf" stroke-width="5"/><text x="45" y="151" font-family="sans-serif" font-size="13" fill="#7d8d6b">Where · When · Why it matters</text></svg>`);
function seed(){return[{id:'speaking',title:'雅思口语 · Part 2',mark:'S',time:'10:42',messages:[{kind:'text',text:'Describe a place you would like to visit again.\n\n今天先练习组织思路，再录一遍。'},{kind:'audio',duration:86},{kind:'image',src:sampleImage,label:'口语练习笔记'},{kind:'text',text:'复盘：少用 really 和 very，多补充具体的细节和感受。'}]},{id:'daily',title:'每日英语随记',mark:'D',time:'昨天',messages:[{kind:'text',text:'A little progress every day adds up.\n每天记录一点，也是一种进步。'}]},{id:'vocabulary',title:'生词与表达',mark:'V',time:'周一',messages:[{kind:'text',text:'off the beaten track\n远离热门路线；人迹罕至的地方'}]}]}
let sessions=seed(), selected='speaking', mobileScreen='list', drafts={}, query='';
let recordSeconds=0, recordInterval=null, playTimers=[], recordTarget=null, recordPlaying=false;
let pendingImage=null, playingId=null, activeView=null, modalKind=null;
const themeMedia=matchMedia('(prefers-color-scheme: dark)');
let themePreference=document.documentElement.dataset.appearance||'system';
const tx=(key,values)=>esc(t(key,values));
const current=()=>sessions.find(s=>s.id===selected);
const formatTime=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;
const waves=()=>'<span class="waves" aria-hidden="true">'+[7,12,8,18,11,16,7,13,18,10,6,14].map(h=>`<i style="height:${h}px"></i>`).join('')+'</span>';
function summary(s) {
  const m=s.messages.at(-1);
  if(!m)return t('还没有记录，写下第一条吧');
  if(m.kind==='audio')return t('[语音]')+' '+formatTime(m.duration);
  if(m.kind==='image')return t('[图片]');
  return m.text.replace(/\n/g,' ');
}
function listMarkup(view) {
  return `<aside class="sidebar"><div class="list-header"><div><h2>${tx('学习记录')}</h2><div class="subheading">${tx('把练习一点点留下来')}</div></div><button class="iconbtn" data-action="new" aria-label="${tx('新建会话')}">${icon('plus')}</button></div><label class="search">${icon('search')}<input type="search" aria-label="${tx('搜索会话')}" placeholder="${tx('搜索会话')}" value="${esc(query)}" data-view="${view}"></label><div class="conversation-list">${listRows()}</div><div class="list-footer">${icon('lock')} ${tx('个人记录空间')}</div></aside>`;
}
function listRows() {
  const rows=sessions.filter(s=>s.title.toLowerCase().includes(query.toLowerCase()));
  return rows.length ? rows.map(s=>`<button class="conversation ${selected===s.id?'selected':''}" data-session="${s.id}" aria-label="${tx('打开会话：{name}',{name:s.title})}"><span class="avatar">${esc(s.mark)}</span><span class="conversation-copy"><span class="conversation-top"><strong>${esc(s.title)}</strong><time>${esc(t(s.time))}</time></span><p>${esc(summary(s))}</p></span></button>`).join('') : `<div class="empty-chat" style="min-height:150px"><p>${tx('没有找到会话')}</p></div>`;
}
function messageMarkup(m,i) {
  let content='';
  if(m.kind==='text')content=`<div class="bubble">${esc(m.text)}</div>`;
  else if(m.kind==='audio') {
    const id=selected+'-'+i;
    content=`<button class="bubble audio" data-audio="${id}" aria-label="${tx(playingId===id?'暂停':'播放')} ${tx('语音')} ${formatTime(m.duration)}">${icon(playingId===id?'pause':'play')}${waves()}<small>${formatTime(m.duration)}</small></button>`;
  } else content=`<button class="bubble picture" data-image="${i}" aria-label="${tx('查看图片')}"><img src="${esc(m.src)}" alt="${esc(m.label||t('学习图片'))}"><span>${esc(m.label||t('学习图片'))}</span></button>`;
  return `<div class="message">${content}<span class="message-avatar" aria-label="${tx('我')}">${tx('我')}</span></div>`;
}
function chatMarkup(view) {
  const s=current();
  return `<section class="chat"><header class="chat-head">${view==='mobile'?`<button class="iconbtn" data-action="back" aria-label="${tx('返回会话列表')}">${icon('back')}</button>`:''}<div class="head-copy"><h2>${esc(s.title)}</h2><p>${tx('文字、语音、图片，都留在这里')}</p></div><span class="personal-tag">${tx('个人记录')}</span></header><div class="timeline">${s.messages.length?`<div class="date-divider">${tx('今天')}</div>`+s.messages.map(messageMarkup).join(''):`<div class="empty-chat">${icon('note')}<strong>${tx('从第一条记录开始')}</strong><p>${tx('写下一个表达，录一段口语，或存一张学习笔记。')}</p></div>`}</div><div class="composer"><div class="composer-tools"><button class="iconbtn" data-action="record" aria-label="${tx('录制语音')}">${icon('mic')}<span class="tool-name">${tx('语音')}</span></button><button class="iconbtn" data-action="image" aria-label="${tx('选择图片')}">${icon('image')}<span class="tool-name">${tx('图片')}</span></button></div><div class="composer-row"><textarea aria-label="${tx('消息内容')}" placeholder="${tx('写下一点今天的练习…')}" data-draft="${view}">${esc(drafts[selected]||'')}</textarea><button class="primary" data-action="send" ${!(drafts[selected]||'').trim()?'disabled':''}>${tx('发送')}</button></div><div class="composer-hint">${tx('Enter 发送 · Shift + Enter 换行')}</div></div></section>`;
}
function themeOptions(view) {
  const choices=[['system','跟随系统','自动匹配系统的浅色或深色外观'],['light','浅色模式','浅灰背景与绿色消息气泡'],['dark','深色模式','深灰背景，适合夜间使用']];
  return `<div class="appearance-options">${choices.map(([value,title,description])=>`<label class="appearance-option"><span class="theme-swatch" aria-hidden="true">${value==='system'?'<i class="light"></i><i class="dark"></i>':`<i class="${value}"></i>`}<i class="accent"></i></span><span class="appearance-copy"><strong>${tx(title)}</strong><small>${tx(description)}</small></span><input type="radio" name="appearance-${view}" value="${value}" data-theme-choice="${value}" aria-label="${tx(title)}" ${themePreference===value?'checked':''}></label>`).join('')}</div>`;
}
function languageRow(view) {
  return `<button class="language-row" data-action="language" data-origin="${view}" aria-label="${tx('选择语言')}"><span>${tx('语言')}</span><span class="language-current">${locale==='zh-CN'?'简体中文':'English'}</span>${icon('back')}</button>`;
}
function languageOptions(view) {
  return `<div class="appearance-options language-options">${[['zh-CN','简体中文','Chinese (Simplified)'],['en','English','英语']].map(([value,name,subtitle])=>`<label class="appearance-option"><span class="appearance-copy"><strong lang="${value}">${name}</strong><small>${subtitle}</small></span><input type="radio" name="language-${view}" value="${value}" data-language-choice="${value}" aria-label="${name}" ${locale===value?'checked':''}></label>`).join('')}</div><p class="settings-note">${tx('界面语言切换后立即生效，学习内容保留原文。')}</p>`;
}
function settingsMarkup() {
  return `<section class="settings-screen"><header class="settings-head"><h2>${tx('设置')}</h2></header><div class="settings-section-label">${tx('语言')}</div>${languageRow('mobile')}<div class="settings-section-label">${tx('外观')}</div>${themeOptions('mobile')}<p class="settings-note">${tx('外观设置保存在当前设备。选择跟随系统时，外观会随系统设置自动切换。')}</p><div class="settings-version">${tx('英语学习记录')}</div></section>`;
}
function languageMarkup() {
  return `<section class="settings-screen"><header class="settings-head language-head"><button class="iconbtn" data-mobile-tab="settings" aria-label="${tx('返回设置')}">${icon('back')}</button><h2>${tx('语言')}</h2></header><div class="settings-section-label">${tx('选择语言')}</div>${languageOptions('mobile')}</section>`;
}
function mobileTabs() {
  return `<nav class="mobile-tabs" aria-label="${tx('手机主导航')}"><button data-mobile-tab="list" class="${mobileScreen==='list'?'active':''}" aria-current="${mobileScreen==='list'?'page':'false'}">${icon('chat')}<span>${tx('会话')}</span></button><button data-mobile-tab="settings" class="${mobileScreen==='settings'?'active':''}" aria-current="${mobileScreen==='settings'?'page':'false'}">${icon('settings')}<span>${tx('设置')}</span></button></nav>`;
}
function railMarkup() {
  return `<nav class="desktop-rail" aria-label="${tx('桌面主导航')}"><div class="rail-avatar" aria-label="${tx('个人空间')}">${tx('我')}</div><button class="iconbtn active" data-action="desktop-home" aria-label="${tx('查看会话')}">${icon('chat')}</button><div class="rail-spacer"></div><button class="iconbtn rail-settings" data-action="desktop-settings" aria-label="${tx('桌面设置')}" aria-haspopup="dialog" aria-expanded="false" title="${tx('设置')}">${icon('settings')}</button></nav>`;
}
function applyTheme(preference,persist=true) {
  themePreference=['system','light','dark'].includes(preference)?preference:'system';
  document.documentElement.dataset.appearance=themePreference;
  document.documentElement.dataset.theme=themePreference==='system'?(themeMedia.matches?'dark':'light'):themePreference;
  if(persist){try{localStorage.setItem('learning-appearance',themePreference)}catch{}}
  document.querySelectorAll('[data-theme-choice]').forEach(input=>input.checked=input.dataset.themeChoice===themePreference);
  document.querySelectorAll('[data-theme-preview]').forEach(button=>{const active=button.dataset.themePreview===themePreference;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
}
themeMedia.addEventListener('change',()=>{if(themePreference==='system')applyTheme('system',false)});
function scrollKey(element) {
  return (element.closest('#mobile-app')?'mobile':'desktop')+(element.classList.contains('timeline')?'-timeline':'-settings');
}
function render(preserveScroll=false) {
  const scrollPositions=new Map([...document.querySelectorAll('.timeline,.settings-screen')].map(element=>[scrollKey(element),element.scrollTop]));
  const content=mobileScreen==='chat'?chatMarkup('mobile'):mobileScreen==='settings'?settingsMarkup():mobileScreen==='language'?languageMarkup():listMarkup('mobile');
  document.getElementById('mobile-app').innerHTML=`<div class="mobile-content">${content}</div>${['chat','language'].includes(mobileScreen)?'':mobileTabs()}`;
  document.getElementById('desktop-app').innerHTML=railMarkup()+listMarkup('desktop')+chatMarkup('desktop');
  document.querySelectorAll('.timeline,.settings-screen').forEach(element=>{
    element.scrollTop=preserveScroll?(scrollPositions.get(scrollKey(element))||0):(element.classList.contains('timeline')?element.scrollHeight:0);
  });
  applyTheme(themePreference,false);
}
function applyLanguage(value) {
  locale=['zh-CN','en'].includes(value)?value:'zh-CN';
  try{localStorage.setItem('learning-language',locale)}catch{}
  translateShell();
  render(true);
  if(modalKind==='language')showLanguageDialog();
  const scope=document.querySelector('.modal')||document.getElementById('mobile-app');
  scope?.querySelector(`[data-language-choice="${locale}"]`)?.focus();
}
function toast(text) {
  const element=document.getElementById('toast');element.textContent=text;element.hidden=false;
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>element.hidden=true,2200);
}
function closeModal() {
  clearInterval(recordInterval);recordInterval=null;recordPlaying=false;modalKind=null;
  document.getElementById('modal-host').innerHTML='';
  document.querySelector('.rail-settings')?.classList.remove('active');
  document.querySelector('.rail-settings')?.setAttribute('aria-expanded','false');
  if(activeView?.isConnected)activeView.focus();else document.querySelector('.rail-settings')?.focus();
  activeView=null;
}
function modal(title,body,buttons='',kind=null) {
  if(!document.querySelector('.modal'))activeView=document.activeElement;
  modalKind=kind;
  document.getElementById('modal-host').innerHTML=`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-title"><h2>${esc(title)}</h2><button class="iconbtn" data-action="close" aria-label="${tx('关闭')}">${icon('close')}</button></div>${body}${buttons}</section></div>`;
  const target=document.querySelector('.modal input:checked')||document.querySelector('.modal input')||document.querySelector('.modal button');target?.focus();
}
const actions=inner=>`<div class="modal-actions">${inner}</div>`;
function markDesktopSettings() {
  document.querySelector('.rail-settings')?.classList.add('active');
  document.querySelector('.rail-settings')?.setAttribute('aria-expanded','true');
}
function showDesktopSettings() {
  modal(t('设置'),`<div class="settings-section-label">${tx('语言')}</div>${languageRow('desktop')}<div class="settings-section-label">${tx('外观')}</div>${themeOptions('desktop')}`,'','settings');
  markDesktopSettings();
}
function showLanguageDialog() {
  modal(t('语言'),languageOptions('desktop'),actions(`<button class="secondary" data-action="desktop-settings">${tx('返回设置')}</button>`),'language');
  markDesktopSettings();
}
function newSession() {
  modal(t('新建会话'),`<label for="session-name">${tx('会话名称')}</label><input type="text" id="session-name" maxlength="40" placeholder="${tx('例如：雅思口语 · 旅行话题')}"><p>${tx('按话题或学习习惯，建立自己的记录空间。')}</p>`,actions(`<button class="secondary" data-action="close">${tx('取消')}</button><button class="primary" data-action="create">${tx('创建会话')}</button>`),'new');
}
function addMessage(message,target=selected) {
  const s=sessions.find(s=>s.id===target);s.messages.push(message);
  s.time=new Date().toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit',hour12:false});
  sessions=sessions.filter(x=>x.id!==target);sessions.unshift(s);render();
}
function recordPanel() {
  recordSeconds=0;recordTarget=selected;
  modal(t('录一段口语'),`<div class="record-panel"><div class="record-orb">${icon('mic')}</div><div class="record-time" id="record-time">00:00</div><div class="caption" id="record-caption">${tx('准备好后，点击开始录音')}</div></div>`,actions(`<button class="secondary" data-action="close">${tx('取消')}</button><button class="primary" data-action="start-record">${tx('开始录音')}</button>`),'record');
}
function startRecord() {
  clearInterval(recordInterval);recordSeconds=0;recordPlaying=false;
  document.getElementById('record-time').textContent='00:00';document.querySelector('.record-orb').innerHTML=icon('mic');
  document.querySelector('.record-orb').classList.add('pulse');document.getElementById('record-caption').textContent=t('正在录音…');
  document.querySelector('.modal-actions').innerHTML=`<button class="secondary" data-action="close">${tx('取消')}</button><button class="primary" data-action="stop-record">${tx('结束录音')}</button>`;
  recordInterval=setInterval(()=>{recordSeconds++;document.getElementById('record-time').textContent=formatTime(recordSeconds)},1000);
}
function stopRecord() {
  clearInterval(recordInterval);recordInterval=null;recordSeconds=Math.max(1,recordSeconds);
  document.getElementById('record-time').textContent=formatTime(recordSeconds);document.querySelector('.record-orb').classList.remove('pulse');
  document.getElementById('record-caption').textContent=t('录制完成，试听后发送');document.querySelector('.record-orb').innerHTML=icon('check');
  document.querySelector('.modal-actions').innerHTML=`<button class="secondary" data-action="start-record">${tx('重录')}</button><button class="secondary" data-action="preview-record">${tx('试听')}</button><button class="primary" data-action="send-record">${tx('发送语音')}</button>`;
}
document.addEventListener('click',e=>{
  const el=e.target.closest('button');if(!el)return;
  if(el.dataset.themePreview){applyTheme(el.dataset.themePreview);return}
  if(el.dataset.mobileTab){mobileScreen=el.dataset.mobileTab;render();return}
  if(el.dataset.mode){
    document.getElementById('workspace').className='workspace'+(el.dataset.mode==='both'?'':' mode-'+el.dataset.mode);
    document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b===el);b.setAttribute('aria-pressed',String(b===el))});return;
  }
  if(el.dataset.session){selected=el.dataset.session;mobileScreen='chat';playingId=null;render();return}
  if(el.dataset.image!==undefined){const m=current().messages[Number(el.dataset.image)];modal(t('学习图片'),`<img src="${esc(m.src)}" alt="${esc(m.label||t('学习图片'))}">`,'','image');return}
  if(el.dataset.audio){
    const id=el.dataset.audio;playingId=playingId===id?null:id;render(true);
    if(playingId)playTimers.push(setTimeout(()=>{if(playingId===id){playingId=null;render(true)}},3000));return;
  }
  switch(el.dataset.action){
    case 'desktop-home':document.querySelector('#desktop-app .conversation-list')?.scrollTo(0,0);break;
    case 'desktop-settings':showDesktopSettings();break;
    case 'language':if(el.dataset.origin==='mobile'){mobileScreen='language';render()}else showLanguageDialog();break;
    case 'new':newSession();break;
    case 'close':closeModal();break;
    case 'back':mobileScreen='list';render();break;
    case 'create':{
      const title=document.getElementById('session-name').value.trim()||t('新会话');
      const session={id:crypto.randomUUID(),title,mark:title[0].toUpperCase(),time:'刚刚',messages:[]};
      sessions.unshift(session);selected=session.id;mobileScreen='chat';closeModal();render();break;
    }
    case 'send':{
      const value=(drafts[selected]||'').trim();if(value){drafts[selected]='';addMessage({kind:'text',text:value});toast(t('已加入当前会话'))}break;
    }
    case 'record':recordPanel();break;
    case 'start-record':startRecord();break;
    case 'stop-record':stopRecord();break;
    case 'preview-record':recordPlaying=!recordPlaying;el.textContent=t(recordPlaying?'暂停':'试听');document.getElementById('record-caption').textContent=t(recordPlaying?'正在试听…':'录制完成，试听后发送');break;
    case 'send-record':{const duration=recordSeconds,target=recordTarget;closeModal();addMessage({kind:'audio',duration},target);toast(t('语音已加入会话'));break}
    case 'image':document.getElementById('image-picker').click();break;
    case 'send-image':if(pendingImage){const image=pendingImage;pendingImage=null;closeModal();addMessage({kind:'image',src:image.src,label:image.label},image.target);toast(t('图片已加入会话'))}break;
  }
  if(el.id==='reset-demo'){
    clearInterval(recordInterval);playTimers.forEach(clearTimeout);closeModal();sessions=seed();selected='speaking';mobileScreen='list';drafts={};query='';playingId=null;render();toast(t('已重置演示'));
  }
});
document.addEventListener('input',e=>{
  if(e.target.matches('[data-draft]')){
    drafts[selected]=e.target.value;document.querySelectorAll('[data-draft]').forEach(node=>{if(node!==e.target)node.value=e.target.value});
    document.querySelectorAll('[data-action="send"]').forEach(button=>button.disabled=!e.target.value.trim());
  }
  if(e.target.matches('input[type=search]')){
    query=e.target.value;document.querySelectorAll('input[type=search]').forEach(node=>{if(node!==e.target)node.value=query});
    document.querySelectorAll('.conversation-list').forEach(node=>node.innerHTML=listRows());
  }
});
document.addEventListener('keydown',e=>{
  if(e.isComposing)return;
  if(e.key==='Escape'){closeModal();return}
  if(e.key==='Enter'&&e.target.id==='session-name'){document.querySelector('[data-action="create"]').click();return}
  if(e.key==='Enter'&&!e.shiftKey&&e.target.matches('[data-draft]')){
    if(e.target.dataset.draft==='mobile')return;e.preventDefault();e.target.closest('.composer').querySelector('[data-action="send"]').click();
  }
  if(e.key==='Tab'&&document.querySelector('.modal')){
    const nodes=[...document.querySelector('.modal').querySelectorAll('button,input:not([type=radio]),input[type=radio]:checked,[tabindex="0"]')];
    const first=nodes[0],last=nodes.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
});
document.addEventListener('change',e=>{
  if(e.target.matches('[data-theme-choice]'))applyTheme(e.target.dataset.themeChoice);
  if(e.target.matches('[data-language-choice]'))applyLanguage(e.target.dataset.languageChoice);
});
document.getElementById('image-picker').addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  if(!file.type.startsWith('image/')){toast(t('请选择图片文件'));e.target.value='';return}
  const reader=new FileReader(),target=selected;
  reader.onload=()=>{
    pendingImage={src:reader.result,label:file.name,target};
    modal(t('发送图片'),`<img src="${esc(reader.result)}" alt="${tx('待发送图片')}"><p>${esc(file.name)}</p>`,actions(`<button class="secondary" data-action="close">${tx('取消')}</button><button class="primary" data-action="send-image">${tx('发送图片')}</button>`),'image');
  };
  reader.onerror=()=>toast(t('图片读取失败，请重试'));reader.readAsDataURL(file);e.target.value='';
});
translateShell();
render();
