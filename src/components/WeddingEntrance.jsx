import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SESSION_KEY = 'sarah-jesus-wedding-guest-token'

function wasUnlocked() {
  if (typeof window === 'undefined') return false
  try { return Boolean(window.sessionStorage.getItem(SESSION_KEY)) } catch { return false }
}

export default function WeddingEntrance({ children }) {
  const [unlocked, setUnlocked] = useState(wasUnlocked)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [checking, setChecking] = useState(wasUnlocked)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    const token = sessionStorage.getItem(SESSION_KEY)
    if (!token || !supabase) { setChecking(false); setUnlocked(false); return }
    supabase.functions.invoke('wedding-access', { body: { action: 'check', token } }).then(({ data, error }) => {
      if (!active) return
      if (error || !data?.valid) { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false) }
      setChecking(false)
    })
    return () => { active = false }
  }, [])

  async function enter(event) {
    event.preventDefault()
    if (!supabase) { setError('Wedding access is temporarily unavailable.'); return }
    setSubmitting(true)
    setError('')
    const { data, error: requestError } = await supabase.functions.invoke('wedding-access', {
      body: { action: 'unlock', password },
    })
    setSubmitting(false)
    if (requestError || !data?.token) {
      let message = data?.error || 'Unable to verify password. Please try again.'
      try { message = (await requestError.context.json()).error || message } catch { /* Network error */ }
      setError(message)
      return
    }
    try { window.sessionStorage.setItem(SESSION_KEY, data.token) } catch { /* Session storage may be unavailable. */ }
    setPassword('')
    try { window.sessionStorage.removeItem('sarah-jesus-opening-invitation-seen') } catch { /* ignore */ }
    document.documentElement.classList.remove('invitation-seen')
    setUnlocked(true)
  }

  if (checking) return <main className="wedding-gate"><p role="status">Checking wedding access…</p></main>
  if (unlocked) return children

  return (
    <main className="wedding-gate">
      <div className="wedding-gate__lace" aria-hidden="true" />
      <section className="wedding-gate__card" aria-labelledby="wedding-gate-title">
        <span className="wedding-gate__eyebrow">A private celebration</span>
        <div className="wedding-gate__monogram" aria-hidden="true">S <i>&amp;</i> J</div>
        <h1 id="wedding-gate-title">Sarah <em>&amp;</em> Jesus</h1>
        <p className="wedding-gate__date">NOVEMBER 27, 2027 · HOUSTON, TEXAS</p>
        <div className="wedding-gate__rule" aria-hidden="true">✦</div>
        <h2>Welcome, dear guest.</h2>
        <p className="wedding-gate__description">Our wedding website is reserved for our beloved family and friends. Please enter the password shared with your invitation.</p>
        <form onSubmit={enter} className="wedding-gate__form">
          <label htmlFor="wedding-gate-password">Wedding password</label>
          <div className="wedding-gate__input-row">
            <input id="wedding-gate-password" type={showPassword ? 'text' : 'password'} value={password}
              onChange={(event) => { setPassword(event.target.value); setError('') }}
              autoComplete="off" required aria-invalid={Boolean(error)}
              aria-describedby={error ? 'wedding-gate-error' : undefined} placeholder="Enter your password" />
            <button type="button" className="wedding-gate__show" onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {error && <p className="wedding-gate__error" id="wedding-gate-error" role="alert">{error}</p>}
          <button className="wedding-gate__enter" type="submit" disabled={submitting}>{submitting ? "Checking…" : "Enter Our Wedding" } <span aria-hidden="true">↗</span></button>
        </form>
        <p className="wedding-gate__footer">With love, Sarah &amp; Jesus</p>
      </section>
    </main>
  )
}
