import 'reflect-metadata';
import { config } from 'dotenv';
config();
import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiController } from './api.controller';
import { LearningGateway } from './gateway';
import { Store } from './store';
import { isAllowedOrigin } from './origins';
@Module({controllers:[ApiController],providers:[Store,LearningGateway]})class AppModule{}
async function main(){
  const app=await NestFactory.create(AppModule,{bodyParser:true});
  app.enableShutdownHooks();app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({origin:(origin:string|undefined,callback:(error:Error|null,allow?:boolean)=>void)=>callback(null,isAllowedOrigin(origin)),methods:['GET','POST']});
  app.setGlobalPrefix('api');
  app.use((_req:any,res:any,next:any)=>{res.setHeader('X-Content-Type-Options','nosniff');next();});
  const doc=SwaggerModule.createDocument(app,new DocumentBuilder().setTitle('Learning Notes API').setVersion('1.0').setDescription('Local personal mode; REST queries/media, WebSocket + Protobuf messages.').build());
  SwaggerModule.setup('api/docs',app,doc);
  await app.listen(Number(process.env.PORT||4000),process.env.HOST||'127.0.0.1');
}
void main();
