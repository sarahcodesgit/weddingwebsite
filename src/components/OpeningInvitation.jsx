import { useEffect, useRef, useState } from 'react'

const SESSION_KEY = 'sarah-jesus-opening-invitation-seen'
const OPENING_DURATION = 1250
const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function hasSeenInvitation() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

function rememberInvitation() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, 'true')
  } catch {
    // A disabled storage API should never prevent access to the celebration.
  }
}

export default function OpeningInvitation() {
  const [isVisible, setIsVisible] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const dialogRef = useRef(null)

  const closeInvitation = () => {
    rememberInvitation()
    setIsVisible(false)
  }

  useEffect(() => {
    if (hasSeenInvitation()) setIsVisible(false)
  }, [])

  useEffect(() => {
    // The pre-mount class in main.jsx already hides this for repeat visits.
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
      if (event.key === 'Escape') {
        closeInvitation()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = [...(dialogRef.current?.querySelectorAll(focusableSelector) ?? [])]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (document.activeElement === dialogRef.current || !dialogRef.current.contains(document.activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
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
      window.setTimeout(() => document.querySelector('#main')?.focus(), 0)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isOpening) return undefined
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const finishTimer = window.setTimeout(closeInvitation, reducedMotion ? 0 : OPENING_DURATION)
    return () => window.clearTimeout(finishTimer)
  }, [isOpening])

  if (!isVisible) return null

  function openInvitation() {
    if (!isOpening) setIsOpening(true)
  }

  return (
    <section className={`opening-invitation vintage-intro ${isOpening ? 'is-opening' : ''}`} role="dialog" aria-modal="true" aria-labelledby="opening-invitation-title" aria-describedby="opening-invitation-instruction" aria-busy={isOpening} ref={dialogRef} tabIndex="-1">
      <h2 id="opening-invitation-title" className="sr-only">Sarah and Jesus's wedding invitation</h2>
      <button className="vintage-intro__artwork" type="button" onClick={openInvitation} aria-label="Open Sarah and Jesus's wedding website">
        <img src="/images/vintage-envelope.png" alt="An ivory vintage wedding envelope with an olive-green S and J wax seal" />
      </button>
      <p className="sr-only" id="opening-invitation-instruction">Select the envelope to enter the wedding website, or skip the introduction.</p>
      <button className="vintage-intro__skip" type="button" onClick={closeInvitation}>Skip to the website</button>
    </section>
  )
}
