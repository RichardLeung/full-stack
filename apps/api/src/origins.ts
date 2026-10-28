// Packaged Electron sends file:// as its WebSocket Origin.
// This personal mode also supports browsers' opaque null origin.
export function isAllowedOrigin(origin: string | undefined): boolean {
  const configured = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173')
    .split(',').map(value => value.trim());
  return !origin || origin === 'null' || origin === 'file://' || configured.includes(origin);
}
