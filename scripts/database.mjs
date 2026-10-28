import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import EmbeddedPostgres from 'embedded-postgres';
const directory=resolve('.data/postgres'),socket=resolve('.data/pg-socket');
const require=createRequire(import.meta.url);
const binaries=await import(pathToFileURL(join(dirname(require.resolve('embedded-postgres')),'binary.js')).href);
const native=await binaries.default();
const bin=process.env.PG_BIN || dirname(native.postgres);
const run=(name,args,options={})=>execFileSync(join(bin,process.platform==='win32'?name+'.exe':name),args,{stdio:'inherit',...options});
if(!existsSync(join(bin,process.platform==='win32'?'pg_ctl.exe':'pg_ctl')))throw new Error('Run pnpm install or set PG_BIN.');
mkdirSync(socket,{recursive:true});
if(process.argv[2]==='stop'){run('pg_ctl',['-D',directory,'stop','-m','fast']);process.exit(0);}
if(!existsSync(join(directory,'PG_VERSION')))run('initdb',['-D',directory,'-U','learning','-A','trust','--encoding=UTF8','--locale=C']);
let running=false;try{run('pg_ctl',['-D',directory,'status'],{stdio:'ignore'});running=true;}catch{}
const socketOptions=process.platform==='win32'?'':` -k "${socket}"`;
if(!running)run('pg_ctl',['-D',directory,'-l',resolve('.data/postgres.log'),'-o',`-p 54329 -h 127.0.0.1${socketOptions}`,'-w','start']);
const instance=new EmbeddedPostgres({user:'learning',password:'',port:54329,persistent:true});
const sql=instance.getPgClient('postgres','127.0.0.1');await sql.connect();
try{if(!(await sql.query("SELECT 1 FROM pg_database WHERE datname='learning'")).rowCount)await sql.query('CREATE DATABASE learning');}finally{await sql.end();}
console.log('PostgreSQL: 127.0.0.1:54329/learning');
