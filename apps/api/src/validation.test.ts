import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { conversationInput, messageInput, pagination, detectMedia } from './validation';
import { decodeEnvelope, encodeEnvelope, EventType, MessageKind } from '@learning/protocol';
import { isAllowedOrigin } from './origins';
test('personal mode accepts packaged Electron origin and rejects unrelated web origins',()=>{
  assert.equal(isAllowedOrigin('file://'),true);
  assert.equal(isAllowedOrigin('null'),true);
  assert.equal(isAllowedOrigin(undefined),true);
  assert.equal(isAllowedOrigin('file://attacker'),false);
  assert.equal(isAllowedOrigin('https://unrelated.invalid'),false);
});
test('external input enforces message variants and bounded pagination',()=>{
  const base={conversationId:randomUUID(),clientMessageId:randomUUID(),kind:0};
  assert.equal(messageInput.safeParse({...base,text:'hello'}).success,true);
  assert.equal(messageInput.safeParse({...base,text:'  '}).success,false);
  assert.equal(messageInput.safeParse({...base,kind:1,text:'',mediaId:randomUUID()}).success,true);
  assert.equal(messageInput.safeParse({...base,kind:2,text:'caption',mediaId:randomUUID()}).success,false);
  assert.equal(messageInput.safeParse({...base,kind:7,text:'hello'}).success,false);
  assert.equal(pagination.safeParse({limit:'1000'}).success,false);
  assert.equal(conversationInput.safeParse({title:'',ownerId:'other'}).success,false);
});
test('content sniffing rejects HTML regardless of declared filename',()=>{
  assert.equal(detectMedia(Buffer.from('<html>fake.png</html>')),null);
  assert.equal(detectMedia(Buffer.from([137,80,78,71,13,10,26,10]))?.mimeType,'image/png');
});
test('Protobuf preserves Unicode and client identity; unknown protocol versions are rejected',()=>{
  const value={type:EventType.SEND_MESSAGE,requestId:randomUUID(),message:{conversationId:randomUUID(),clientMessageId:randomUUID(),kind:MessageKind.TEXT,text:'英语练习 👋 hello'}};
  const decoded=decodeEnvelope(encodeEnvelope(value));assert.equal(decoded.message?.text,value.message.text);assert.equal(decoded.message?.clientMessageId,value.message.clientMessageId);
  const bytes=encodeEnvelope(value);bytes[1]=2;assert.throws(()=>decodeEnvelope(bytes),/version/);
});
