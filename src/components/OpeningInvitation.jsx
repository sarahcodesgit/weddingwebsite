import { useEffect, useRef, useState } from 'react'

const SESSION_KEY = 'sarah-jesus-opening-invitation-seen'
const OPENING_DURATION = 2600
const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function hasSeenInvitation() {
  try { return window.sessionStorage.getItem(SESSION_KEY) === 'true' } catch { return false }
}
function rememberInvitation() {
  try { window.sessionStorage.setItem(SESSION_KEY, 'true') } catch { /* Storage may be disabled. */ }
}

export default function OpeningInvitation() {
  const [isVisible, setIsVisible] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const dialogRef = useRef(null)

  const closeInvitation = () => {
    rememberInvitation()
    document.documentElement.classList.add('invitation-seen')
    setIsVisible(false)
  }

  useEffect(() => {
    if (hasSeenInvitation()) setIsVisible(false)
  }, [])

  useEffect(() => {
    if (!isVisible || hasSeenInvitation()) return undefined
    const siteShell = document.querySelector('.site-shell')
    const previousOverflow = document.body.style.overflow
    const previouslyInert = siteShell?.inert ?? false
    const previousAriaHidden = siteShell?.getAttribute('aria-hidden')
    document.body.style.overflow = 'hidden'
    if (siteShell) {
      siteShell.inert = true
      siteShell.setAttribute('aria-hidden', 'true')
    }
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 0)
    const trapFocus = (event) => {
      if (event.key === 'Escape') { closeInvitation(); return }
      if (event.key !== 'Tab') return
      const focusable = [...(dialogRef.current?.querySelectorAll(focusableSelector) ?? [])]
      if (!focusable.length) return
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (document.activeElement === dialogRef.current || !dialogRef.current.contains(document.activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', trapFocus)
      window.clearTimeout(focusTimer)
      if (siteShell) {
        siteShell.inert = previouslyInert
        if (previousAriaHidden === null) siteShell.removeAttribute('aria-hidden')
        else siteShell.setAttribute('aria-hidden', previousAriaHidden)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isOpening) return undefined
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(closeInvitation, reducedMotion ? 0 : OPENING_DURATION)
    return () => window.clearTimeout(timer)
  }, [isOpening])

  if (!isVisible) return null

  return (
    <section className={`opening-invitation vintage-intro ${isOpening ? 'is-opening' : ''}`}
      role="dialog" aria-modal="true" aria-labelledby="opening-invitation-title"
      aria-describedby="opening-invitation-instruction" aria-busy={isOpening}
      ref={dialogRef} tabIndex="-1">
      <h2 id="opening-invitation-title" className="sr-only">Sarah and Jesus's wedding invitation</h2>
      <button className="vintage-intro__artwork" type="button"
        onClick={() => { if (!isOpening) setIsOpening(true) }}
        aria-label="Open Sarah and Jesus's wedding website">
        <span className="vintage-intro__scene" aria-hidden="true">
          <img className="vintage-intro__base" src="/images/vintage-envelope-underlay.jpg" alt="" />
          <span className="vintage-intro__paper" aria-hidden="true">
            <span className="vintage-intro__paper-edge" />
          </span>
          <img className="vintage-intro__flap" src="/images/vintage-envelope-flap.png" alt="" />
        </span>
      </button>
      <p className="sr-only" id="opening-invitation-instruction">Select the envelope to open it and enter the wedding website, or skip.</p>
      <p className="vintage-intro__hint" aria-hidden="true">CLICK TO OPEN</p>
      <button className="vintage-intro__skip" type="button" onClick={closeInvitation}>Skip to the website</button>
    </section>
  )
}
