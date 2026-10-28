import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { join,resolve } from 'node:path';
import { unlink } from 'node:fs/promises';
import { encodeEnvelope,decodeEnvelope,EventType,MessageKind } from '../packages/protocol/dist/index.mjs';
const require=createRequire(new URL('../apps/api/package.json',import.meta.url));
const {WebSocket}=require('ws');
const {PrismaClient}=require('@prisma/client');
const db=new PrismaClient({datasources:{db:{url:process.env.DATABASE_URL||'postgresql://learning@127.0.0.1:54329/learning'}}});
const base=process.env.API_URL||'http://127.0.0.1:4000';
let conversationId,foreignId;const mediaIds=[];
async function request(path,init){return fetch(base+'/api'+path,init);}
async function json(path,init){const res=await request(path,init);assert.equal(res.ok,true,await res.clone().text());return res.json();}
async function client(origin){
  const socket=new WebSocket(base.replace(/^http/,'ws')+'/ws',origin?{origin}:undefined);const queue=[],waiters=[];
  socket.on('message',data=>{const event=decodeEnvelope(data);const index=waiters.findIndex(item=>item.predicate(event));if(index>=0){const [waiter]=waiters.splice(index,1);clearTimeout(waiter.timer);waiter.resolve(event);}else queue.push(event);});
  const next=predicate=>{const index=queue.findIndex(predicate);if(index>=0)return Promise.resolve(queue.splice(index,1)[0]);return new Promise((resolve,reject)=>{const entry={predicate,resolve,timer:setTimeout(()=>{const index=waiters.indexOf(entry);if(index>=0)waiters.splice(index,1);reject(new Error('Event timeout'));},10000)};waiters.push(entry);});};
  await next(event=>event.type===EventType.HELLO);
  return {socket,next,send(message){const requestId=randomUUID();socket.send(encodeEnvelope({type:EventType.SEND_MESSAGE,requestId,message}));return next(event=>event.requestId===requestId);}};
}
let a,b,c;
try{
  assert.equal((await json('/health')).status,'ok');
  const bad=await request('/conversations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:''})});assert.equal(bad.status,400);
  a=await client();b=await client('file://');
  const conversation=await json('/conversations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:'Integration '+randomUUID()})});conversationId=conversation.id;
  await b.next(event=>event.type===EventType.CONVERSATION_CHANGED&&event.conversation?.id===conversationId);
  const message={conversationId,clientMessageId:randomUUID(),kind:MessageKind.TEXT,text:'真实 Protobuf 双端同步 ✓'};
  const [ack1,ack2]=await Promise.all([a.send(message),b.send(message)]);
  assert.equal(ack1.type,EventType.ACK);assert.equal(ack2.type,EventType.ACK);assert.equal(ack1.message.id,ack2.message.id);
  await b.next(event=>event.type===EventType.MESSAGE_CREATED&&event.message?.id===ack1.message.id);
  assert.equal((await json(`/conversations/${conversationId}/messages`)).items.length,1);
  assert.equal((await a.send({...message,text:'conflict'})).type,EventType.ERROR);
  assert.equal((await a.send({...message,clientMessageId:randomUUID(),conversationId:randomUUID()})).type,EventType.ERROR);
  const foreign=await db.conversation.create({data:{ownerId:'another-owner',title:'must stay private'}});foreignId=foreign.id;
  assert.equal((await request(`/conversations/${foreignId}/messages`)).status,404);
  assert.equal((await a.send({...message,clientMessageId:randomUUID(),conversationId:foreignId})).type,EventType.ERROR);
  console.log('PASS real Protobuf broadcast, concurrent idempotency, conflict rejection, owner isolation');
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
  async function upload(bytes,name,durationMs=0){const form=new FormData();form.append('file',new Blob([bytes]),name);form.append('durationMs',String(durationMs));return json('/media',{method:'POST',body:form});}
  const image=await upload(png,'integration.png');mediaIds.push(image.id);assert.equal(image.mimeType,'image/png');
  assert.equal((await a.send({conversationId,clientMessageId:randomUUID(),kind:MessageKind.IMAGE,mediaId:image.id})).type,EventType.ACK);
  const full=await request('/media/'+image.id);assert.deepEqual(Buffer.from(await full.arrayBuffer()),png);
  const partial=await request('/media/'+image.id,{headers:{Range:'bytes=0-7'}});assert.equal(partial.status,206);assert.equal((await partial.arrayBuffer()).byteLength,8);
  const wav=Buffer.alloc(44+16000);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(16000,40);
  const audio=await upload(wav,'integration.wav',1000);mediaIds.push(audio.id);assert.equal(audio.mimeType,'audio/wav');
  assert.equal((await a.send({conversationId,clientMessageId:randomUUID(),kind:MessageKind.AUDIO,mediaId:audio.id})).type,EventType.ACK);
  assert.equal((await a.send({conversationId,clientMessageId:randomUUID(),kind:MessageKind.IMAGE,mediaId:audio.id})).type,EventType.ERROR);
  const fake=new FormData();fake.append('file',new Blob(['<html>bad</html>'],{type:'image/png'}),'fake.png');assert.equal((await request('/media',{method:'POST',body:fake})).status,400);
  console.log('PASS media upload, stored bytes, Range requests, MIME validation and message kind validation');
  b.socket.close();
  for(let index=0;index<42;index++){assert.equal((await a.send({conversationId,clientMessageId:randomUUID(),kind:MessageKind.TEXT,text:'history '+index})).type,EventType.ACK);}
  c=await client();
  const page=await json(`/conversations/${conversationId}/messages`);assert.equal(page.items.length,40);assert.ok(page.nextCursor);
  const older=await json(`/conversations/${conversationId}/messages?cursor=${page.nextCursor}`);assert.equal(older.items.length,5);
  assert.equal(new Set([...page.items,...older.items].map(item=>item.id)).size,45);
  assert.equal((await request(`/conversations/${conversationId}/messages?limit=9999`)).status,400);
  console.log('PASS history after reconnect and stable pagination without duplicates');
  console.log('All integration checks passed.');
}finally{
  a?.socket.close();b?.socket.close();c?.socket.close();
  if(conversationId)await db.conversation.deleteMany({where:{id:conversationId}});
  if(foreignId)await db.conversation.deleteMany({where:{id:foreignId}});
  for(const id of mediaIds){const row=await db.media.findUnique({where:{id}});if(row){await db.media.delete({where:{id}});await unlink(join(resolve('.data/media'),row.storageKey)).catch(()=>{});}}
  await db.$disconnect();
}
