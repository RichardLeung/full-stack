const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeApiUrl, contentSecurityPolicy } = require('./runtime-config.cjs');

test('LAN and HTTPS server addresses normalize to an origin', () => {
  assert.equal(normalizeApiUrl('http://192.168.1.13:4000/'), 'http://192.168.1.13:4000');
  assert.equal(normalizeApiUrl('https://learning.example.com'), 'https://learning.example.com');
});
test('invalid or ambiguous server addresses are rejected', () => {
  for (const value of ['file:///etc/passwd', 'javascript:alert(1)', 'http://user:pass@localhost:4000', 'http://localhost:4000/api', 'http://localhost:4000/?x=1', undefined]) {
    assert.throws(() => normalizeApiUrl(value));
  }
});
test('CSP permits the configured HTTP and WS origins with strict production scripts', () => {
  const policy = contentSecurityPolicy('http://192.168.1.13:4000', false);
  assert.match(policy, /connect-src 'self' http:\/\/192\.168\.1\.13:4000 ws:\/\/192\.168\.1\.13:4000;/);
  assert.match(policy, /script-src 'self';/);
  assert.doesNotMatch(policy, /script-src 'self' 'unsafe-inline'/);
  assert.match(contentSecurityPolicy('https://learning.example.com', true), /wss:\/\/learning\.example\.com/);
});
