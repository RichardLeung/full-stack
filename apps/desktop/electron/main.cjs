const { app, BrowserWindow, session, systemPreferences, shell, dialog } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { readApiUrl, contentSecurityPolicy } = require('./runtime-config.cjs');
let window;
const devUrl='http://127.0.0.1:5173';
function trustedFrame(frame) {
  if(!frame)return false;
  if(!app.isPackaged)return frame.url.startsWith(devUrl+'/');
  return frame.url.startsWith(pathToFileURL(path.join(__dirname,'../dist')+path.sep).href);
}
async function createWindow() {
  const apiUrl = readApiUrl(app);
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.resourceType !== 'mainFrame') return callback({ responseHeaders: details.responseHeaders });
    const headers = { ...details.responseHeaders };
    for (const key of Object.keys(headers)) if (key.toLowerCase() === 'content-security-policy') delete headers[key];
    headers['Content-Security-Policy'] = [contentSecurityPolicy(apiUrl, !app.isPackaged)];
    callback({ responseHeaders: headers });
  });
  window = new BrowserWindow({ width: 1180, height: 800, minWidth: 760, minHeight: 560, backgroundColor: '#ededed', webPreferences: { preload:path.join(__dirname,'preload.cjs'), contextIsolation:true, nodeIntegration:false, sandbox:true, additionalArguments:[`--learning-api-url=${apiUrl}`] } });
  session.defaultSession.setPermissionRequestHandler(async (contents,permission,callback,details) => {
    const own=contents.id===window?.webContents.id;
    const valid=own&&trustedFrame(contents.mainFrame)&&permission==='media'&&details.mediaTypes?.every(type=>type==='audio');
    if(valid&&process.platform==='darwin')return callback(await systemPreferences.askForMediaAccess('microphone'));
    callback(Boolean(valid));
  });
  session.defaultSession.setPermissionCheckHandler((contents,permission)=>Boolean(contents?.id===window?.webContents.id&&trustedFrame(contents.mainFrame)&&permission==='media'));
  window.webContents.setWindowOpenHandler(({url})=>{if(/^https?:/.test(url))shell.openExternal(url);return {action:'deny'};});
  window.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith(devUrl)&&!url.startsWith('file://'))event.preventDefault();});
  if(app.isPackaged)await window.loadFile(path.join(__dirname,'../dist/index.html'));
  else await window.loadURL(devUrl);
}
app.whenReady().then(createWindow).catch(error=>{dialog.showErrorBox('Learning Notes',error.message);app.quit();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
