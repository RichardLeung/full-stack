import { z } from 'zod';
export const ownerId='local-user';
export const conversationInput=z.object({title:z.string().trim().min(1).max(80)}).strict();
export const messageInput=z.object({conversationId:z.string().uuid(),clientMessageId:z.string().uuid(),kind:z.number().int().min(0).max(2),text:z.string().max(10000).optional().default(''),mediaId:z.string().uuid().optional().nullable()}).superRefine((value,ctx)=>{
  if(value.kind===0&&(!value.text.trim()||value.mediaId))ctx.addIssue({code:'custom',message:'Text messages require text and cannot contain an attachment'});
  if(value.kind!==0&&(!value.mediaId||value.text))ctx.addIssue({code:'custom',message:'Media messages require an attachment and no text'});
});
export const pagination=z.object({cursor:z.string().uuid().optional(),limit:z.coerce.number().int().min(1).max(100).default(40)});
export function detectMedia(bytes:Buffer):{mimeType:string;extension:string;kind:number}|null {
  if(bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return {mimeType:'image/jpeg',extension:'jpg',kind:2};
  if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {mimeType:'image/png',extension:'png',kind:2};
  if(['GIF87a','GIF89a'].includes(bytes.subarray(0,6).toString()))return {mimeType:'image/gif',extension:'gif',kind:2};
  if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')return {mimeType:'image/webp',extension:'webp',kind:2};
  if(bytes.subarray(0,4).equals(Buffer.from([26,69,223,163])))return {mimeType:'audio/webm',extension:'webm',kind:1};
  if(bytes.subarray(0,4).toString()==='OggS')return {mimeType:'audio/ogg',extension:'ogg',kind:1};
  if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WAVE')return {mimeType:'audio/wav',extension:'wav',kind:1};
  if(bytes.subarray(4,8).toString()==='ftyp')return {mimeType:'audio/mp4',extension:'m4a',kind:1};
  return null;
}
