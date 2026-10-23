import { useState } from 'react'

// Preview-only gate. Replace with server-side verification before publishing.
// Client-side passwords cannot protect website files or private information.
const PREVIEW_PASSWORD = 'SJGARCIA2027'
const SESSION_KEY = 'sarah-jesus-wedding-preview-unlocked'

function wasUnlocked() {
  if (typeof window === 'undefined') return false
  try { return window.sessionStorage.getItem(SESSION_KEY) === 'true' } catch { return false }
}

export default function WeddingEntrance({ children }) {
  const [unlocked, setUnlocked] = useState(wasUnlocked)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function enter(event) {
    event.preventDefault()
    if (password.trim() !== PREVIEW_PASSWORD) {
      setError('That password does not match. Please try again.')
      return
    }
    try { window.sessionStorage.setItem(SESSION_KEY, 'true') } catch { /* Session storage may be unavailable. */ }
    // Let the envelope play after each fresh password unlock.
    try { window.sessionStorage.removeItem('sarah-jesus-opening-invitation-seen') } catch { /* Storage may be unavailable. */ }
    document.documentElement.classList.remove('invitation-seen')
    setUnlocked(true)
  }

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
          <button className="wedding-gate__enter" type="submit">Enter Our Wedding <span aria-hidden="true">↗</span></button>
        </form>
        <p className="wedding-gate__footer">With love, Sarah &amp; Jesus</p>
      </section>
    </main>
  )
}
