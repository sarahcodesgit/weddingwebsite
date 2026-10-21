import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && publishableKey)
export const rsvpMode = import.meta.env.VITE_RSVP_MODE === 'live' ? 'live' : 'demo'
export const isLiveRsvpEnabled = rsvpMode === 'live' && isSupabaseConfigured

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const demoRsvpMessage = 'Demo mode is active. This RSVP stays only in your current browser session and is not sent or stored.'
export const supabaseSetupMessage = 'Online RSVP is not connected yet. Please check back soon.'
