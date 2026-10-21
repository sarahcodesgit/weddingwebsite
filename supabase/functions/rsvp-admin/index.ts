// @ts-nocheck -- Supabase Edge Functions are type-checked by the Deno runtime, not this Vite workspace.
import { withSupabase } from 'npm:@supabase/server@1'
import { isAllowedOrigin, json, optionsResponse, originDenied } from '../_shared/http.ts'
import { validateRsvp } from '../_shared/validation.ts'

async function requireWeddingAdmin(context) {
  const userId = context.userClaims?.sub
  if (!userId) return false
  const { data, error } = await context.supabaseAdmin
    .from('wedding_admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.error('Admin allowlist check failed', error.code)
    return false
  }
  return Boolean(data)
}

const handler = withSupabase({ auth: 'user' }, async (request, context) => {
  if (request.method !== 'POST') return json(request, { error: 'Method not allowed.' }, 405)
  if (!(await requireWeddingAdmin(context))) return json(request, { error: 'You are not authorized to access wedding RSVP data.' }, 403)

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return json(request, { error: 'Invalid admin request.' }, 400)
  }

  if (payload.action === 'list') {
    const { data, error } = await context.supabaseAdmin
      .from('rsvp_responses')
      .select('id, primary_guest_name, phone_number, attendance, dietary_notes, total_attending, created_at, updated_at, rsvp_additional_guests(full_name)')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Admin list failed', error.code)
      return json(request, { error: 'Unable to load RSVP responses.' }, 500)
    }
    return json(request, { responses: data })
  }

  if (payload.action === 'update') {
    const response = payload.response
    if (!response || typeof response !== 'object' || typeof response.id !== 'string') return json(request, { error: 'A response ID is required.' }, 400)
    const validation = validateRsvp(response, { checkSpam: false })
    if (!validation.value) return json(request, { error: validation.error }, 422)

    const rsvp = validation.value
    const { error } = await context.supabaseAdmin.rpc('update_rsvp_submission', {
      p_response_id: response.id,
      p_primary_guest_name: rsvp.primaryGuestName,
      p_phone_number: rsvp.phoneNumber,
      p_attendance: rsvp.attendance,
      p_dietary_notes: rsvp.dietaryNotes || null,
      p_additional_guests: rsvp.additionalGuests,
    })
    if (error) {
      console.error('Admin update failed', error.code)
      return json(request, { error: error.code === '23505' ? 'Another RSVP already uses that guest name and phone number.' : 'Unable to update this RSVP.' }, 500)
    }
    return json(request, { ok: true })
  }

  if (payload.action === 'delete') {
    if (typeof payload.id !== 'string') return json(request, { error: 'A response ID is required.' }, 400)
    const { error } = await context.supabaseAdmin.from('rsvp_responses').delete().eq('id', payload.id)
    if (error) {
      console.error('Admin delete failed', error.code)
      return json(request, { error: 'Unable to remove this RSVP.' }, 500)
    }
    return json(request, { ok: true })
  }

  return json(request, { error: 'Unknown admin action.' }, 400)
})

Deno.serve((request) => {
  if (request.method === 'OPTIONS') return optionsResponse(request)
  if (!isAllowedOrigin(request)) return originDenied(request)
  return handler(request)
})
