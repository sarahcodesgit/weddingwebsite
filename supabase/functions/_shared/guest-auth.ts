// Server-only guest sessions. The shared password never enters the frontend bundle.
const encoder = new TextEncoder()
const TTL_SECONDS = 12 * 60 * 60
function b64url(bytes: Uint8Array) {
  let s = ''
  for (const byte of bytes) s += String.fromCharCode(byte)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function fromB64url(s: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(s)) throw new Error('Invalid token')
  const raw = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}
async function key() {
  const secret = Deno.env.get('WEDDING_ACCESS_PASSWORD')
  if (!secret || secret.length < 8) throw new Error('Wedding access secret is missing or too short')
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode('wedding-session-v1:' + secret))
  return crypto.subtle.importKey('raw', digest, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}
export async function issueGuestToken() {
  const payload = b64url(encoder.encode(JSON.stringify({ v: 1, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS, nonce: crypto.randomUUID() })))
  const signature = await crypto.subtle.sign('HMAC', await key(), encoder.encode(payload))
  return payload + '.' + b64url(new Uint8Array(signature))
}
export async function verifyGuestToken(token: unknown) {
  if (typeof token !== 'string' || token.length > 1024) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  try {
    const valid = await crypto.subtle.verify('HMAC', await key(), fromB64url(parts[1]), encoder.encode(parts[0]))
    if (!valid) return false
    const value = JSON.parse(new TextDecoder().decode(fromB64url(parts[0])))
    return value.v === 1 && Number.isSafeInteger(value.exp) && value.exp > Date.now() / 1000 && value.exp <= Date.now() / 1000 + TTL_SECONDS
  } catch { return false }
}
export async function verifyWeddingPassword(value: unknown) {
  const expected = Deno.env.get('WEDDING_ACCESS_PASSWORD')
  if (!expected || expected.length < 8 || typeof value !== 'string' || value.length > 256) return false
  const a = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
  const b = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(expected)))
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}
