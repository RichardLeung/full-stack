import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
const zh=JSON.parse(readFileSync('packages/locales/zh-CN.json','utf8'));
const en=JSON.parse(readFileSync('packages/locales/en.json','utf8'));
if(JSON.stringify(Object.keys(zh).sort())!==JSON.stringify(Object.keys(en).sort()))throw new Error('Locale keys differ');
mkdirSync('apps/mobile/lib/generated',{recursive:true});
writeFileSync('apps/mobile/lib/generated/locales.dart',`// Generated from packages/locales. Do not edit.\nconst translations = <String, Map<String, String>>${JSON.stringify({'zh-CN':zh,en},null,2).replace(/\$/g,'\\$')};\n`);
console.log('Shared language catalogs generated for Flutter.');
