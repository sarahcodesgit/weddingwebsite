// @ts-nocheck -- Supabase Edge Functions are type-checked by the Deno runtime, not this Vite workspace.
import { withSupabase } from 'npm:@supabase/server@1'
import { isAllowedOrigin, json, optionsResponse, originDenied } from '../_shared/http.ts'
import { normalizePhone, validateRsvp } from '../_shared/validation.ts'

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function clientIp(request: Request) {
  // Do not trust client-provided forwarding headers: a browser can supply them. If the trusted platform
  // header is unavailable, use one shared bucket rather than allowing header spoofing.
  return request.headers.get('cf-connecting-ip') || 'unavailable-client-ip'
}

const handler = withSupabase({ auth: 'user' }, async (request, context) => {
  if (request.method !== 'POST') return json(request, { error: 'Method not allowed.' }, 405)

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return json(request, { error: 'Invalid RSVP request.' }, 400)
  }

  const validation = validateRsvp(payload)
  if (!validation.value) return json(request, { error: validation.error }, 422)

  if (Deno.env.get('RSVP_SMS_VERIFICATION_ENABLED') !== 'true') {
    return json(request, { error: 'Online RSVP is not enabled until phone verification has been configured and tested.' }, 503)
  }

  const rsvp = validation.value
  const verifiedPhone = normalizePhone(String(context.userClaims?.phone || ''))
  if (!verifiedPhone || verifiedPhone !== rsvp.phoneNumberNormalized) {
    return json(request, { error: 'Please verify the phone number entered on this RSVP before submitting.' }, 403)
  }

  const rateLimitSalt = Deno.env.get('RSVP_RATE_LIMIT_SALT')
  if (!rateLimitSalt) return json(request, { error: 'RSVP is not configured yet.' }, 503)

  const keyHash = await sha256(`${rateLimitSalt}:${clientIp(request)}`)
  const { data: allowed, error: rateLimitError } = await context.supabaseAdmin.rpc('consume_rsvp_rate_limit', {
    p_key_hash: keyHash,
    p_limit: 5,
    p_window_seconds: 3600,
  })
  if (rateLimitError) {
    console.error('RSVP rate-limit check failed', rateLimitError.code)
    return json(request, { error: 'We could not process your RSVP right now. Please try again later.' }, 500)
  }
  if (!allowed) return json(request, { error: 'Please wait before submitting another RSVP.' }, 429)

  const { data, error } = await context.supabaseAdmin.rpc('create_rsvp_submission', {
    p_primary_guest_name: rsvp.primaryGuestName,
    p_phone_number: rsvp.phoneNumber,
    p_attendance: rsvp.attendance,
    p_dietary_notes: rsvp.dietaryNotes || null,
    p_additional_guests: rsvp.additionalGuests,
  })

  if (error) {
    console.error('RSVP submission failed', error.code)
    return json(request, { error: 'We could not save your RSVP right now. Please try again later.' }, 500)
  }

  const response = Array.isArray(data) ? data[0] : data
  return json(request, { response: {
    id: response.id,
    primaryGuestName: response.primary_guest_name,
    phoneNumber: response.phone_number,
    attendance: response.attendance,
    totalAttending: response.total_attending,
    additionalGuests: rsvp.additionalGuests,
    dietaryNotes: response.dietary_notes || '',
  } }, 201)
})

Deno.serve((request) => {
  if (request.method === 'OPTIONS') return optionsResponse(request)
  if (!isAllowedOrigin(request)) return originDenied(request)
  return handler(request)
})
