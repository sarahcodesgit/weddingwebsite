// @ts-nocheck
import { withSupabase } from 'npm:@supabase/server@1'
import { isAllowedOrigin, json, optionsResponse, originDenied } from '../_shared/http.ts'
import { issueGuestToken, verifyWeddingPassword, verifyGuestToken } from '../_shared/guest-auth.ts'
const handler = withSupabase({ auth: 'none' }, async (request, context) => {
  if (request.method !== 'POST') return json(request, { error: 'Method not allowed.' }, 405)
  let body
  try { body = await request.json() } catch { return json(request, { error: 'Invalid request.' }, 400) }
  if (body?.action === 'check') {
    return json(request, { valid: await verifyGuestToken(body.token) })
  }
  if (body?.action !== 'unlock') return json(request, { error: 'Invalid request.' }, 400)
  const salt = Deno.env.get('RSVP_RATE_LIMIT_SALT')
  if (!salt) return json(request, { error: 'Wedding access is unavailable.' }, 503)
  const ip = request.headers.get('cf-connecting-ip') || 'unavailable-client-ip'
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':gate:' + ip))
  const hash = Array.from(new Uint8Array(digest)).map((x) => x.toString(16).padStart(2, '0')).join('')
  const { data: allowed, error } = await context.supabaseAdmin.rpc('consume_rsvp_rate_limit', {
    p_key_hash: hash, p_limit: 10, p_window_seconds: 3600,
  })
  if (error) return json(request, { error: 'Wedding access is temporarily unavailable.' }, 503)
  if (!allowed) return json(request, { error: 'Too many attempts. Please try again later.' }, 429)
  if (!await verifyWeddingPassword(body.password)) return json(request, { error: 'That password does not match. Please try again.' }, 401)
  return json(request, { token: await issueGuestToken() })
})
Deno.serve((request) => {
  if (request.method === 'OPTIONS') return optionsResponse(request)
  if (!isAllowedOrigin(request)) return originDenied(request)
  return handler(request)
})
