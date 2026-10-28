import { decodeEnvelope, encodeEnvelope, EventType, type Envelope, type Message, type Media } from '@learning/protocol';
export type ConversationRow={id:string;title:string;updatedAt:string;lastMessage:Message|null};
export type MessagePage={items:Message[];nextCursor:string|null};
export class ApiClient {
  readonly baseUrl:string;
  constructor(baseUrl:string){this.baseUrl=baseUrl.replace(/\/$/,'');}
  async request<T>(path:string,init?:RequestInit):Promise<T>{
    const response=await fetch(this.baseUrl+'/api'+path,init);
    if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(Array.isArray(body.message)?body.message.join('; '):body.message||`HTTP ${response.status}`);}
    return response.json();
  }
  conversations(){return this.request<ConversationRow[]>('/conversations');}
  createConversation(title:string){return this.request<ConversationRow>('/conversations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})});}
  messages(id:string,cursor?:string){return this.request<MessagePage>(`/conversations/${encodeURIComponent(id)}/messages${cursor?'?cursor='+encodeURIComponent(cursor):''}`);}
  upload(blob:Blob,name:string,durationMs=0):Promise<Media>{const form=new FormData();form.append('file',blob,name);form.append('durationMs',String(durationMs));return this.request<Media>('/media',{method:'POST',body:form});}
  mediaUrl(id:string){return this.baseUrl+'/api/media/'+encodeURIComponent(id);}
}
export type ConnectionState='connecting'|'connected'|'disconnected';
export class RealtimeClient {
  private socket?:WebSocket;
  private stopped=true;
  private retry?:ReturnType<typeof setTimeout>;
  private attempt=0;
  private generation=0;
  private pending=new Map<string,{resolve:(message:Message)=>void;reject:(error:Error)=>void;timer:ReturnType<typeof setTimeout>}>();
  private listeners=new Set<(event:Envelope)=>void>();
  private stateListeners=new Set<(state:ConnectionState)=>void>();
  state:ConnectionState='disconnected';
  constructor(private baseUrl:string){}
  subscribe(listener:(event:Envelope)=>void){this.listeners.add(listener);return ()=>{this.listeners.delete(listener);};}
  onState(listener:(state:ConnectionState)=>void){this.stateListeners.add(listener);listener(this.state);return ()=>{this.stateListeners.delete(listener);};}
  private setState(state:ConnectionState){this.state=state;for(const listener of this.stateListeners)listener(state);}
  connect(){
    if(this.socket&&(this.socket.readyState===WebSocket.CONNECTING||this.socket.readyState===WebSocket.OPEN))return;
    this.stopped=false;const generation=++this.generation;this.setState('connecting');
    const url=new URL('/ws',this.baseUrl);url.protocol=url.protocol==='https:'?'wss:':'ws:';
    const socket=new WebSocket(url);this.socket=socket;socket.binaryType='arraybuffer';
    socket.onmessage=event=>{
      if(generation!==this.generation)return;
      try{
        const value=decodeEnvelope(new Uint8Array(event.data));
        if(value.type===EventType.HELLO){this.attempt=0;this.setState('connected');}
        const request=value.requestId?this.pending.get(value.requestId):undefined;
        if(request&&(value.type===EventType.ACK||value.type===EventType.ERROR)){
          clearTimeout(request.timer);this.pending.delete(value.requestId!);
          if(value.type===EventType.ERROR)request.reject(new Error(value.error||'Message failed'));
          else if(value.message)request.resolve(value.message);else request.reject(new Error('Missing acknowledgement'));
        }
        for(const listener of this.listeners)listener(value);
      }catch{socket.close(1002,'Invalid server frame');}
    };
    socket.onclose=()=>{
      if(generation!==this.generation)return;this.socket=undefined;this.setState('disconnected');
      for(const pending of this.pending.values()){clearTimeout(pending.timer);pending.reject(new Error('Connection lost; retry the message'));}this.pending.clear();
      if(!this.stopped)this.retry=setTimeout(()=>this.connect(),Math.min(15000,500*2**this.attempt++)+Math.random()*300);
    };
    socket.onerror=()=>socket.close();
  }
  send(message:Message):Promise<Message>{
    if(this.state!=='connected'||this.socket?.readyState!==WebSocket.OPEN)return Promise.reject(new Error('Not connected'));
    const requestId=crypto.randomUUID();
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.pending.delete(requestId);reject(new Error('Acknowledgement timed out; retry safely'));},15000);
      this.pending.set(requestId,{resolve,reject,timer});
      try{this.socket!.send(encodeEnvelope({type:EventType.SEND_MESSAGE,requestId,message}));}
      catch(error){clearTimeout(timer);this.pending.delete(requestId);reject(error instanceof Error?error:new Error('Send failed'));}
    });
  }
  close(){
    this.stopped=true;++this.generation;clearTimeout(this.retry);this.socket?.close();this.socket=undefined;this.setState('disconnected');
    for(const request of this.pending.values()){clearTimeout(request.timer);request.reject(new Error('Connection closed'));}this.pending.clear();
  }
}
