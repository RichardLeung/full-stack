import { Inject, HttpException, OnModuleDestroy } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket, RawData } from 'ws';
import type { IncomingMessage } from 'node:http';
import { decodeEnvelope, encodeEnvelope, EventType, Envelope } from '@learning/protocol';
import { Store } from './store';
import { isAllowedOrigin } from './origins';
@WebSocketGateway({path:'/ws',maxPayload:65536})
export class LearningGateway implements OnGatewayConnection,OnGatewayInit,OnModuleDestroy {
  @WebSocketServer()server:Server;
  private timer:ReturnType<typeof setInterval>;
  private alive=new WeakMap<WebSocket,boolean>();
  private broadcast=(value:Envelope)=>{for(const client of this.server.clients)this.send(client,value);};
  constructor(@Inject(Store)private readonly store:Store){}
  afterInit(server:Server){
    this.server=server;this.store.events.on('change',this.broadcast);
    this.timer=setInterval(()=>{for(const client of server.clients){if(this.alive.get(client)===false){client.terminate();continue;}this.alive.set(client,false);client.ping();}},25000);
  }
  handleConnection(client:WebSocket,request:IncomingMessage){
    const origin=request.headers.origin;
    if(!isAllowedOrigin(origin)){client.close(1008,'Origin not allowed');return;}
    this.alive.set(client,true);client.on('pong',()=>this.alive.set(client,true));
    client.on('message',(data,binary)=>void this.receive(client,data,binary));
    client.on('error',()=>client.terminate());
    this.send(client,{type:EventType.HELLO});
  }
  private send(client:WebSocket,value:Envelope){if(client.readyState===WebSocket.OPEN)client.send(encodeEnvelope(value));}
  private async receive(client:WebSocket,data:RawData,binary:boolean){
    let requestId='';
    try{
      if(!binary)throw new Error('Binary Protobuf frames are required');
      const bytes=Buffer.isBuffer(data)?data:Buffer.from(data as ArrayBuffer);
      const envelope=decodeEnvelope(bytes);requestId=envelope.requestId||'';
      if(!requestId||requestId.length>80)throw new Error('Request ID is required');
      if(envelope.type!==EventType.SEND_MESSAGE||!envelope.message)throw new Error('Unsupported event');
      const m=envelope.message;
      const message=await this.store.createMessage({conversationId:m.conversationId,clientMessageId:m.clientMessageId,kind:m.kind??0,text:m.text||'',mediaId:m.mediaId||null});
      this.send(client,{type:EventType.ACK,requestId,message});
    }catch(error){
      const text=error instanceof HttpException||error instanceof Error?error.message:'Request failed';
      this.send(client,{type:EventType.ERROR,requestId,error:text});
    }
  }
  onModuleDestroy(){clearInterval(this.timer);this.store.events.off('change',this.broadcast);if(this.server)for(const client of this.server.clients)client.terminate();}
}
