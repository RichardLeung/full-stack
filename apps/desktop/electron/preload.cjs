const { contextBridge }=require('electron');
const apiUrl=process.argv.find(value=>value.startsWith('--learning-api-url='))?.slice('--learning-api-url='.length);
contextBridge.exposeInMainWorld('learningDesktop',Object.freeze({platform:process.platform,apiUrl}));
