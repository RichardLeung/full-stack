const fs = require('node:fs');
const path = require('node:path');

function normalizeApiUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('apiUrl must be an HTTP(S) origin, for example http://192.168.1.10:4000');
  }
  return url.origin;
}

function readApiUrl(app) {
  if (process.env.LEARNING_API_URL) return normalizeApiUrl(process.env.LEARNING_API_URL);
  const executableDirectory = app.isPackaged ? path.dirname(app.getPath('exe')) : null;
  const directory = app.isPackaged
    ? (process.platform === 'darwin' ? path.join(executableDirectory, '..') : executableDirectory)
    : path.join(__dirname, '..');
  const configFile = path.join(directory, 'learning.config.json');
  if (fs.existsSync(configFile)) {
    return normalizeApiUrl(JSON.parse(fs.readFileSync(configFile, 'utf8')).apiUrl);
  }
  return normalizeApiUrl(process.env.VITE_API_URL || 'http://127.0.0.1:4000');
}

function contentSecurityPolicy(apiUrl, development) {
  const origin = normalizeApiUrl(apiUrl);
  const ws = origin.replace(/^http/, 'ws');
  return `default-src 'self'; script-src 'self'${development ? " 'unsafe-inline'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: ${origin}; media-src 'self' blob: ${origin}; connect-src 'self' ${origin} ${ws}${development ? ' http://127.0.0.1:5173 ws://127.0.0.1:5173' : ''};`;
}

module.exports = { normalizeApiUrl, readApiUrl, contentSecurityPolicy };
