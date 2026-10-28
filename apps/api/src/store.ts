import { Injectable, NotFoundException, BadRequestException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { EventEmitter } from 'node:events';
import { mkdir, readFile, rename, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { EventType, Message, Envelope } from '@learning/protocol';
import { conversationInput, detectMedia, messageInput, ownerId, pagination } from './validation';

@Injectable()
export class Store extends PrismaClient implements OnModuleInit,OnModuleDestroy {
  readonly events=new EventEmitter();
  readonly mediaDir=resolve(process.env.MEDIA_DIR || '../../.data/media');
  async onModuleInit(){
    await this.$connect();await mkdir(join(this.mediaDir,'tmp'),{recursive:true});
    if(await this.conversation.count({where:{ownerId}})===0)await this.conversation.createMany({data:[{title:'雅思口语 · Part 2',ownerId},{title:'每日英语随记',ownerId},{title:'生词与表达',ownerId}]});
  }
  async onModuleDestroy(){await this.$disconnect();}
  emit(value:Envelope){this.events.emit('change',value);}
  serializeMessage(value:any):Message {
    return {id:value.id,conversationId:value.conversationId,clientMessageId:value.clientMessageId,kind:value.kind,text:value.text,mediaId:value.mediaId||'',createdAt:value.createdAt.toISOString(),media:value.media?this.serializeMedia(value.media):null};
  }
  serializeMedia(value:any){return {id:value.id,mimeType:value.mimeType,originalName:value.originalName,size:value.size,durationMs:value.durationMs};}
  async requireConversation(id:string,db:Prisma.TransactionClient|Store=this){
    const value=await db.conversation.findFirst({where:{id,ownerId}});if(!value)throw new NotFoundException('Conversation not found');return value;
  }
  async listConversations(){
    const rows=await this.conversation.findMany({where:{ownerId},orderBy:[{updatedAt:'desc'},{id:'desc'}],include:{messages:{take:1,orderBy:[{createdAt:'desc'},{id:'desc'}],include:{media:true}}}});
    return rows.map(({messages,...row})=>({...row,lastMessage:messages[0]?this.serializeMessage(messages[0]):null}));
  }
  async createConversation(input:unknown){
    const parsed=conversationInput.safeParse(input);if(!parsed.success)throw new BadRequestException(parsed.error.issues.map(x=>x.message).join('; '));
    const value=await this.conversation.create({data:{...parsed.data,ownerId}});
    this.emit({type:EventType.CONVERSATION_CHANGED,conversation:{id:value.id,title:value.title,updatedAt:value.updatedAt.toISOString()}});return value;
  }
  async listMessages(id:string,input:unknown){
    await this.requireConversation(id);
    const parsed=pagination.safeParse(input);if(!parsed.success)throw new BadRequestException('Invalid pagination');
    const {cursor,limit}=parsed.data;
    const cursorRow=cursor?await this.message.findFirst({where:{id:cursor,conversationId:id,ownerId}}):null;
    if(cursor&&!cursorRow)throw new BadRequestException('Invalid cursor');
    const rows=await this.message.findMany({where:{conversationId:id,ownerId,...(cursorRow?{OR:[{createdAt:{lt:cursorRow.createdAt}},{createdAt:cursorRow.createdAt,id:{lt:cursorRow.id}}]}:{})},orderBy:[{createdAt:'desc'},{id:'desc'}],take:limit+1,include:{media:true}});
    const hasMore=rows.length>limit;const page=rows.slice(0,limit);
    return {items:page.map(row=>this.serializeMessage(row)).reverse(),nextCursor:hasMore?page.at(-1)!.id:null};
  }
  private samePayload(existing:any,input:any){
    return existing.conversationId===input.conversationId&&existing.kind===input.kind&&existing.text===input.text&&(existing.mediaId||null)===(input.mediaId||null);
  }
  async createMessage(input:unknown){
    const parsed=messageInput.safeParse(input);if(!parsed.success)throw new BadRequestException(parsed.error.issues.map(x=>x.message).join('; '));
    const value={...parsed.data,text:parsed.data.kind===0?parsed.data.text.trim():'',mediaId:parsed.data.mediaId||null};
    const existing=await this.message.findUnique({where:{ownerId_clientMessageId:{ownerId,clientMessageId:value.clientMessageId}},include:{media:true}});
    if(existing){if(!this.samePayload(existing,value))throw new BadRequestException('Message ID reused with different content');return this.serializeMessage(existing);}
    try {
      const result=await this.$transaction(async db=>{
        await this.requireConversation(value.conversationId,db);
        if(value.mediaId){
          const media=await db.media.findFirst({where:{id:value.mediaId,ownerId}});
          if(!media||!media.mimeType.startsWith(value.kind===1?'audio/':'image/'))throw new BadRequestException('Attachment is missing or has the wrong type');
        }
        const row=await db.message.create({data:{...value,ownerId},include:{media:true}});
        await db.conversation.update({where:{id:value.conversationId},data:{updatedAt:new Date()}});
        return row;
      });
      const resultMessage=this.serializeMessage(result);
      this.emit({type:EventType.MESSAGE_CREATED,conversationId:value.conversationId,message:resultMessage});return resultMessage;
    }catch(error){
      if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==='P2002'){
        const row=await this.message.findUnique({where:{ownerId_clientMessageId:{ownerId,clientMessageId:value.clientMessageId}},include:{media:true}});
        if(row&&this.samePayload(row,value))return this.serializeMessage(row);
        throw new BadRequestException('Message ID reused with different content');
      }throw error;
    }
  }
  async saveMedia(file:Express.Multer.File|undefined,duration:unknown){
    if(!file)throw new BadRequestException('File is required');
    let target:string|undefined;
    try{
      const bytes=await readFile(file.path);const kind=detectMedia(bytes);
      if(!kind)throw new BadRequestException('Supported: JPEG, PNG, GIF, WebP, WebM, Ogg, WAV, M4A');
      const durationMs=Number(duration||0);
      if(!Number.isInteger(durationMs)||durationMs<0||durationMs>600000)throw new BadRequestException('Maximum recording duration is 10 minutes');
      const id=randomUUID(),storageKey=id+'.'+kind.extension;target=join(this.mediaDir,storageKey);
      await rename(file.path,target);
      const value=await this.media.create({data:{id,ownerId,storageKey,mimeType:kind.mimeType,originalName:file.originalname.slice(0,160),size:file.size,durationMs:kind.kind===1?durationMs:0}});
      return this.serializeMedia(value);
    }catch(error){if(target)await unlink(target).catch(()=>{});throw error;}
    finally{await unlink(file.path).catch(()=>{});}
  }
  async findMedia(id:string){const row=await this.media.findFirst({where:{id,ownerId}});if(!row)throw new NotFoundException('Media not found');return row;}
}
