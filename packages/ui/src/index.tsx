'use client';
import React, { useEffect, useMemo, useRef, useState, createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { ApiClient, RealtimeClient, type ConnectionState, type ConversationRow } from '@learning/client';
import { EventType, MessageKind, type Message, type Media } from '@learning/protocol';
import { Plus, Search, MessageCircle, Settings, Mic, Image as ImageIcon, ChevronLeft, X, Square, Check, LoaderCircle, Wifi, WifiOff, Play, BookOpen } from 'lucide-react';
import zh from '../../locales/zh-CN.json';
import en from '../../locales/en.json';

type Key=keyof typeof zh;
type Theme='system'|'light'|'dark';
type Language='zh-CN'|'en';
type Outbox={message:Message;status:'sending'|'failed'};
const I18n=createContext<{t:(key:Key)=>string;language:Language}>({t:key=>zh[key],language:'zh-CN'});
const useText=()=>useContext(I18n);
function useDeviceSettings(){
  const [theme,setTheme]=useState<Theme>('system');const [language,setLanguage]=useState<Language>('zh-CN');const [loaded,setLoaded]=useState(false);
  useEffect(()=>{try{const a=localStorage.getItem('learning-appearance'),l=localStorage.getItem('learning-language');if(['system','light','dark'].includes(a||''))setTheme(a as Theme);if(l==='en'||l==='zh-CN')setLanguage(l);}catch{}setLoaded(true);},[]);
  useEffect(()=>{if(!loaded)return;const media=matchMedia('(prefers-color-scheme: dark)');const apply=()=>document.documentElement.dataset.theme=theme==='system'?(media.matches?'dark':'light'):theme;apply();media.addEventListener('change',apply);try{localStorage.setItem('learning-appearance',theme);}catch{}return()=>media.removeEventListener('change',apply);},[theme,loaded]);
  useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;try{localStorage.setItem('learning-language',language);}catch{}},[language,loaded]);
  return {theme,setTheme,language,setLanguage};
}
export function LearningApp({apiUrl,desktop=false}:{apiUrl:string;desktop?:boolean}){
  const [cache]=useState(()=>new QueryClient({defaultOptions:{queries:{retry:1,staleTime:15000}}}));
  const api=useMemo(()=>new ApiClient(apiUrl),[apiUrl]);const realtime=useMemo(()=>new RealtimeClient(apiUrl),[apiUrl]);
  return <QueryClientProvider client={cache}><Workspace api={api} realtime={realtime} desktop={desktop}/></QueryClientProvider>;
}
function Workspace({api,realtime,desktop}:{api:ApiClient;realtime:RealtimeClient;desktop:boolean}){
  const preferences=useDeviceSettings();const {language}=preferences;
  const t=(key:Key)=>(language==='en'?en:zh)[key];
  const cache=useQueryClient();const [connection,setConnection]=useState<ConnectionState>('connecting');
  const [selected,setSelected]=useState<string|null>(null);const [mobileDetail,setMobileDetail]=useState(false);const [tab,setTab]=useState<'chats'|'settings'>('chats');
  const [query,setQuery]=useState('');const [creating,setCreating]=useState(false);const [title,setTitle]=useState('');const [busyCreate,setBusyCreate]=useState(false);const [error,setError]=useState('');
  const [drafts,setDrafts]=useState<Record<string,string>>({});const [outbox,setOutbox]=useState<Outbox[]>([]);const [attachmentBusy,setAttachmentBusy]=useState(false);
  const conversations=useQuery({queryKey:['conversations'],queryFn:()=>api.conversations()});
  useEffect(()=>{
    const off=realtime.subscribe(event=>{if(event.type===EventType.MESSAGE_CREATED||event.type===EventType.CONVERSATION_CHANGED||event.type===EventType.HELLO){void cache.invalidateQueries({queryKey:['conversations']});if(event.conversationId)void cache.invalidateQueries({queryKey:['messages',event.conversationId]});else if(event.type===EventType.HELLO)void cache.invalidateQueries({queryKey:['messages']});}});
    const offState=realtime.onState(setConnection);realtime.connect();return()=>{off();offState();realtime.close();};
  },[cache,realtime]);
  useEffect(()=>{if(!selected&&conversations.data?.length)setSelected(conversations.data[0].id);},[selected,conversations.data]);
  const rows=conversations.data||[];const active=rows.find(row=>row.id===selected);
  const navigate=(callback:()=>void)=>{if(attachmentBusy&&!window.confirm(t('leaveRecord')))return;setAttachmentBusy(false);callback();};
  const open=(id:string)=>navigate(()=>{setSelected(id);setMobileDetail(true);setTab('chats');});
  async function create(){if(busyCreate)return;setBusyCreate(true);setError('');try{const row=await api.createConversation(title.trim()||t('newDefault'));await cache.invalidateQueries({queryKey:['conversations']});setSelected(row.id);setMobileDetail(true);setTab('chats');setCreating(false);setTitle('');}catch{setError(t('createError'));}finally{setBusyCreate(false);}}
  async function send(message:Message){
    const id=message.clientMessageId!;setOutbox(items=>[...items.filter(item=>item.message.clientMessageId!==id),{message,status:'sending'}]);
    try{await realtime.send(message);await cache.invalidateQueries({queryKey:['messages',message.conversationId]});void cache.invalidateQueries({queryKey:['conversations']});setOutbox(items=>items.filter(item=>item.message.clientMessageId!==id));}
    catch{setOutbox(items=>items.map(item=>item.message.clientMessageId===id?{...item,status:'failed'}:item));}
  }
  const settings=<SettingsPanel {...preferences}/>;
  return <I18n.Provider value={{t,language}}><div className={`learning-app ${desktop?'is-desktop':''} ${mobileDetail?'detail-open':''} ${tab==='settings'?'settings-open':''}`}>
    <nav className="desktop-rail" aria-label={t('chats')}><div className="account-avatar">{t('me')}</div><button className={tab==='chats'?'active':''} onClick={()=>navigate(()=>setTab('chats'))} aria-label={t('chats')}><MessageCircle/></button><div className="rail-spacer"/><button className={tab==='settings'?'active':''} onClick={()=>navigate(()=>{setTab('settings');setMobileDetail(false);})} aria-label={t('settings')}><Settings/></button></nav>
    <aside className="conversation-sidebar"><header className="list-heading"><div><h1>{t('app')}</h1><p>{t('subtitle')}</p></div><button className="icon-button" aria-label={t('new')} onClick={()=>navigate(()=>{setError('');setCreating(true);})}><Plus/></button></header><label className="search-box"><Search size={16}/><input aria-label={t('search')} placeholder={t('search')} value={query} onChange={event=>setQuery(event.target.value)}/></label>
    <div className="conversation-list">{conversations.isPending?<p className="quiet center">{t('loading')}</p>:conversations.isError?<div className="error-box">{t('loadError')}<button onClick={()=>void conversations.refetch()}>{t('retry')}</button></div>:rows.filter(row=>row.title.toLowerCase().includes(query.toLowerCase())).map((row,index)=><ConversationButton key={row.id} row={row} active={row.id===selected} index={index} onClick={()=>open(row.id)}/>)}{!conversations.isPending&&!conversations.isError&&rows.filter(row=>row.title.toLowerCase().includes(query.toLowerCase())).length===0&&<p className="quiet center">{t(query?'noMatches':'noChats')}</p>}</div>
    <div className={`connection-state ${connection}`} role="status">{connection==='connected'?<Wifi size={13}/>:<WifiOff size={13}/>} {t(connection)}</div></aside>
    <main className="workspace-main">{tab==='settings'?settings:selected&&active?<Chat key={selected} api={api} conversation={active} connection={connection} draft={drafts[selected]||''} setDraft={value=>setDrafts(items=>({...items,[selected]:value}))} outbox={outbox.filter(item=>item.message.conversationId===selected)} onSend={send} onBack={()=>navigate(()=>setMobileDetail(false))} onAttachmentBusy={setAttachmentBusy}/>:<div className="empty-state"><BookOpen/><p>{t('noSelection')}</p></div>}</main>
    <section className="mobile-settings">{tab==='settings'&&settings}</section>
    <nav className="mobile-tabs"><button className={tab==='chats'?'active':''} onClick={()=>navigate(()=>{setTab('chats');setMobileDetail(false);})}><MessageCircle/><span>{t('chats')}</span></button><button className={tab==='settings'?'active':''} onClick={()=>navigate(()=>{setTab('settings');setMobileDetail(false);})}><Settings/><span>{t('settings')}</span></button></nav>
    {creating&&<div className="modal-backdrop"><section className="dialog" role="dialog" aria-modal="true" aria-label={t('new')}><div className="dialog-heading"><h2>{t('new')}</h2><button className="icon-button" onClick={()=>setCreating(false)} aria-label={t('close')}><X/></button></div><label htmlFor="conversation-title">{t('name')}</label><input id="conversation-title" autoFocus maxLength={80} placeholder={t('nameHint')} value={title} onChange={event=>setTitle(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.nativeEvent.isComposing)void create();}}/>{error&&<p role="alert" className="error-text">{error}</p>}<div className="dialog-actions"><button className="secondary" disabled={busyCreate} onClick={()=>setCreating(false)}>{t('cancel')}</button><button className="primary" disabled={busyCreate} onClick={()=>void create()}>{busyCreate?<LoaderCircle className="spin" size={16}/>:t('create')}</button></div></section></div>}
  </div></I18n.Provider>;
}
function ConversationButton({row,active,index,onClick}:{row:ConversationRow;active:boolean;index:number;onClick:()=>void}){
  const {t,language}=useText();const message=row.lastMessage;
  const summary=!message?t('emptySummary'):message.kind===MessageKind.IMAGE?t('imageSummary'):message.kind===MessageKind.AUDIO?t('voiceSummary'):message.text;
  return <button className={`conversation-row ${active?'active':''}`} onClick={onClick}><span className={`conversation-avatar tone-${index%3}`}>{row.title.slice(0,1).toUpperCase()}</span><span className="conversation-copy"><span className="conversation-top"><strong>{row.title}</strong><time>{new Date(row.updatedAt).toLocaleDateString(language,{month:'numeric',day:'numeric'})}</time></span><span className="conversation-summary">{summary}</span></span></button>;
}
function SettingsPanel({theme,setTheme,language,setLanguage}:{theme:Theme;setTheme:(value:Theme)=>void;language:Language;setLanguage:(value:Language)=>void}){
  const {t}=useText();const group=React.useId();return <section className="settings-panel"><header><h2>{t('settings')}</h2></header><div className="settings-body"><h3>{t('language')}</h3><div className="settings-group">{(['zh-CN','en'] as const).map(value=><label className="setting-option" key={value}><span><strong lang={value}>{value==='zh-CN'?'简体中文':'English'}</strong><small>{value==='zh-CN'?'Chinese (Simplified)':'英语'}</small></span><input type="radio" name={`${group}-language`} checked={language===value} onChange={()=>setLanguage(value)} aria-label={value==='zh-CN'?'简体中文':'English'}/></label>)}</div><p className="settings-note">{t('languageHint')}</p><h3>{t('appearance')}</h3><div className="settings-group">{(['system','light','dark'] as const).map(value=><label key={value} className="setting-option"><span className={`theme-thumbnail ${value}`}><i/><i/></span><span><strong>{t(value)}</strong><small>{t((value+'Hint') as Key)}</small></span><input type="radio" name={`${group}-theme`} checked={theme===value} onChange={()=>setTheme(value)} aria-label={t(value)}/></label>)}</div><p className="settings-note">{t('deviceHint')}</p><p className="settings-footer">{t('restartHint')}</p></div></section>;
}
function useRecording(t:(key:Key)=>string){
  const [state,setState]=useState<'idle'|'requesting'|'recording'|'preview'>('idle');const [blob,setBlob]=useState<Blob|null>(null);const [duration,setDuration]=useState(0);const [error,setError]=useState('');
  const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null),started=useRef(0),mounted=useRef(true),requesting=useRef(false);
  const stop=()=>{if(recorder.current?.state==='recording')recorder.current.stop();if(timer.current)clearInterval(timer.current);};
  const discard=()=>{stop();setBlob(null);setDuration(0);setState('idle');};
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(timer.current)clearInterval(timer.current);if(recorder.current){recorder.current.onstop=null;if(recorder.current.state==='recording')recorder.current.stop();}stream.current?.getTracks().forEach(track=>track.stop());};},[]);
  useEffect(()=>{if(state==='idle')return;const warn=(event:BeforeUnloadEvent)=>event.preventDefault();window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[state]);
  async function start(){
    if(requesting.current||state!=='idle')return;
    setError('');setBlob(null);
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError(t('recordUnsupported'));return;}
    requesting.current=true;setState('requesting');
    try{
      const media=await navigator.mediaDevices.getUserMedia({audio:true});if(!mounted.current){media.getTracks().forEach(track=>track.stop());return;}stream.current=media;
      const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(type=>MediaRecorder.isTypeSupported(type));
      const instance=new MediaRecorder(media,mime?{mimeType:mime}:undefined);recorder.current=instance;const parts:BlobPart[]=[];
      instance.ondataavailable=event=>{if(event.data.size)parts.push(event.data);};
      instance.onerror=()=>{setError(t('recordError'));stop();};
      instance.onstop=()=>{media.getTracks().forEach(track=>track.stop());if(timer.current)clearInterval(timer.current);if(!mounted.current)return;const result=new Blob(parts,{type:instance.mimeType});setDuration(Math.min(600000,Math.max(1,Math.round(performance.now()-started.current))));if(result.size){setBlob(result);setState('preview');}else{setState('idle');setError(t('recordError'));}};
      started.current=performance.now();setDuration(0);instance.start(200);setState('recording');timer.current=setInterval(()=>{const elapsed=performance.now()-started.current;setDuration(Math.round(elapsed));if(elapsed>=600000)stop();},200);
    }catch{stream.current?.getTracks().forEach(track=>track.stop());if(mounted.current){setState('idle');setError(t('recordError'));}}
    finally{requesting.current=false;}
  }
  return {state,blob,duration,error,start,stop,discard};
}
function Chat({api,conversation,connection,draft,setDraft,outbox,onSend,onBack,onAttachmentBusy}:{api:ApiClient;conversation:ConversationRow;connection:ConnectionState;draft:string;setDraft:(value:string)=>void;outbox:Outbox[];onSend:(message:Message)=>Promise<void>;onBack:()=>void;onAttachmentBusy:(value:boolean)=>void}){
  const {t,language}=useText();const history=useInfiniteQuery({queryKey:['messages',conversation.id],queryFn:({pageParam})=>api.messages(conversation.id,pageParam),initialPageParam:undefined as string|undefined,getNextPageParam:last=>last.nextCursor||undefined});
  const messages=[...(history.data?.pages||[])].reverse().flatMap(page=>page.items);
  const pending=outbox.filter(item=>!messages.some(message=>message.clientMessageId===item.message.clientMessageId));
  const [image,setImage]=useState<File|null>(null),[zoom,setZoom]=useState<string|null>(null),[uploading,setUploading]=useState(false),[uploadError,setUploadError]=useState('');
  const fileInput=useRef<HTMLInputElement>(null),timeline=useRef<HTMLDivElement>(null);const recording=useRecording(t);
  const previewBlob=image||recording.blob;const previewUrl=useMemo(()=>previewBlob?URL.createObjectURL(previewBlob):null,[previewBlob]);
  useEffect(()=>()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);},[previewUrl]);
  const busy=recording.state!=='idle'||Boolean(image)||uploading;
  useEffect(()=>{onAttachmentBusy(busy);return()=>onAttachmentBusy(false);},[busy,onAttachmentBusy]);
  const lastId=messages.at(-1)?.id;
  useEffect(()=>{if(timeline.current)timeline.current.scrollTop=timeline.current.scrollHeight;},[lastId,pending.length]);
  const canSend=connection==='connected'&&!uploading&&recording.state==='idle'&&!image;
  function sendText(){if(!draft.trim()||!canSend)return;const message={conversationId:conversation.id,clientMessageId:crypto.randomUUID(),kind:MessageKind.TEXT,text:draft.trim(),createdAt:new Date().toISOString()};setDraft('');void onSend(message);}
  function chooseImage(event:React.ChangeEvent<HTMLInputElement>){const file=event.target.files?.[0];event.target.value='';if(!file)return;setUploadError('');if(!['image/jpeg','image/png','image/gif','image/webp'].includes(file.type)){setUploadError(t('invalidImage'));return;}if(file.size>25*1024*1024){setUploadError(t('fileTooLarge'));return;}setImage(file);}
  async function sendAttachment(){
    if(!previewBlob||uploading||connection!=='connected')return;setUploading(true);setUploadError('');
    try{
      const audio=Boolean(recording.blob);const extension=recording.blob?.type.includes('mp4')?'m4a':'webm';
      const media=await api.upload(previewBlob,image?.name||`speaking-${Date.now()}.${extension}`,audio?recording.duration:0);
      const message={conversationId:conversation.id,clientMessageId:crypto.randomUUID(),kind:audio?MessageKind.AUDIO:MessageKind.IMAGE,mediaId:media.id,media,createdAt:new Date().toISOString()};
      setImage(null);recording.discard();void onSend(message);
    }catch{setUploadError(t('uploadError'));}finally{setUploading(false);}
  }
  return <section className="chat-panel"><header className="chat-heading"><button className="icon-button mobile-back" onClick={onBack} aria-label={t('back')}><ChevronLeft/></button><div><h2>{conversation.title}</h2><p>{t('personal')}</p></div><span className="chat-status"><i className={connection}/>{t(connection)}</span></header>
    <div className="message-timeline" ref={timeline}>{history.hasNextPage&&<button className="load-older" disabled={history.isFetchingNextPage} onClick={()=>void history.fetchNextPage()}>{t(history.isFetchingNextPage?'loading':'loadOlder')}</button>}{history.isPending?<div className="quiet center">{t('loading')}</div>:history.isError?<div className="error-box">{t('loadError')}<button onClick={()=>void history.refetch()}>{t('retry')}</button></div>:!messages.length&&!pending.length?<div className="empty-state"><BookOpen/><h3>{t('empty')}</h3><p>{t('emptyHint')}</p></div>:null}
    {messages.map(message=><MessageBubble key={message.id} message={message} api={api} language={language} onImage={setZoom}/>)}
    {pending.map(item=><div className="outbox-item" key={item.message.clientMessageId}><MessageBubble message={item.message} api={api} language={language} onImage={setZoom}/><div className={`delivery-status ${item.status}`} role="status">{t(item.status)}{item.status==='failed'&&<button onClick={()=>void onSend(item.message)}>{t('retry')}</button>}</div></div>)}</div>
    <div className="composer">{uploadError&&<p className="error-text" role="alert">{uploadError}</p>}{recording.error&&<p className="error-text" role="alert">{recording.error}</p>}
    {recording.state==='recording'?<div className="recording-bar"><span className="record-dot"/><strong>{t('recording')}</strong><time>{formatDuration(recording.duration)}</time><button className="secondary" onClick={recording.stop}><Square size={14}/>{t('stopRecord')}</button></div>:previewUrl?<div className="attachment-preview">{image?<img src={previewUrl} alt={image.name}/>:<audio controls src={previewUrl}/>}<div className="attachment-details"><strong>{image?image.name:t('recordReady')}</strong>{recording.blob&&<small>{formatDuration(recording.duration)}</small>}<button className="text-button" disabled={uploading} onClick={()=>{setImage(null);recording.discard();}}>{t('remove')}</button></div><button className="primary" disabled={uploading||connection!=='connected'} onClick={()=>void sendAttachment()}>{uploading?<LoaderCircle size={16} className="spin"/>:t('send')}</button></div>:<><div className="composer-tools"><button disabled={uploading||recording.state!=='idle'} onClick={()=>void recording.start()} aria-label={t('startRecord')}><Mic size={19}/><span>{t('voice')}</span></button><button disabled={recording.state!=='idle'} onClick={()=>fileInput.current?.click()} aria-label={t('image')}><ImageIcon size={19}/><span>{t('image')}</span></button><input type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden ref={fileInput} onChange={chooseImage}/></div><div className="composer-row"><textarea aria-label={t('placeholder')} maxLength={10000} value={draft} placeholder={t('placeholder')} onChange={event=>setDraft(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();sendText();}}}/><button className="primary" disabled={!draft.trim()||!canSend} onClick={sendText}>{t('send')}</button></div><p className="composer-hint">{connection==='connected'?t('sendHint'):t('notConnected')}</p></>}
    </div>{zoom&&<div className="modal-backdrop image-viewer" role="dialog" aria-modal="true" aria-label={t('mediaPreview')} onClick={()=>setZoom(null)}><button className="icon-button" aria-label={t('close')} onClick={()=>setZoom(null)}><X/></button><img src={zoom} alt={t('image')} onClick={event=>event.stopPropagation()}/></div>}
  </section>;
}
function MessageBubble({message,api,language,onImage}:{message:Message;api:ApiClient;language:Language;onImage:(value:string)=>void}){
  const {t}=useText();const url=message.mediaId?api.mediaUrl(message.mediaId):'';
  return <article className="message-row"><div className="message-content"><div className={`message-bubble kind-${message.kind}`}>{message.kind===MessageKind.IMAGE?<button className="image-message" onClick={()=>onImage(url)} aria-label={t('mediaPreview')}><img loading="lazy" src={url} alt={message.media?.originalName||t('image')}/></button>:message.kind===MessageKind.AUDIO?<div className="audio-message"><audio controls preload="metadata" src={url}/><small>{formatDuration(message.media?.durationMs||0)}</small></div>:message.text}</div><time className="message-time">{message.createdAt?new Date(message.createdAt).toLocaleString(language,{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}):''}</time></div><span className="message-avatar">{t('me')}</span></article>;
}
function formatDuration(ms:number){const seconds=Math.floor(ms/1000);return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;}
