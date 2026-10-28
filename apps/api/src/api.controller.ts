import { Controller, Get, Post, Body, Param, Query, UploadedFile, UseInterceptors, Res, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { resolve,join } from 'node:path';
import type { Response } from 'express';
import { Store } from './store';

@ApiTags('Learning notes')
@Controller()
export class ApiController {
  constructor(@Inject(Store)private readonly store:Store){}
  @Get('health') @ApiOperation({summary:'Database connectivity and service health'})
  async health(){await this.store.$queryRaw`SELECT 1`;return {status:'ok',mode:'local-personal',protocol:1};}
  @Get('conversations') list(){return this.store.listConversations();}
  @Post('conversations') @ApiBody({schema:{type:'object',required:['title'],properties:{title:{type:'string',maxLength:80}}}})
  create(@Body()body:unknown){return this.store.createConversation(body);}
  @Get('conversations/:id/messages') history(@Param('id')id:string,@Query()query:unknown){return this.store.listMessages(id,query);}
  @Post('media') @ApiConsumes('multipart/form-data')
  @ApiBody({schema:{type:'object',required:['file'],properties:{file:{type:'string',format:'binary'},durationMs:{type:'integer',maximum:600000}}}})
  @UseInterceptors(FileInterceptor('file',{storage:diskStorage({destination:(_req,_file,cb)=>cb(null,resolve(process.env.MEDIA_DIR||'../../.data/media','tmp')),filename:(_req,_file,cb)=>cb(null,randomUUID())}),limits:{fileSize:25*1024*1024,files:1,fields:1}}))
  upload(@UploadedFile()file:Express.Multer.File,@Body('durationMs')duration:unknown){return this.store.saveMedia(file,duration);}
  @Get('media/:id')
  async media(@Param('id')id:string,@Res()res:Response){
    const value=await this.store.findMedia(id);
    res.setHeader('Content-Type',value.mimeType);res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Content-Disposition',`inline; filename*=UTF-8''${encodeURIComponent(value.originalName)}`);
    res.sendFile(join(this.store.mediaDir,value.storageKey),{dotfiles:'allow'});
  }
}
