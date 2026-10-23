import { useEffect, useRef, useState } from 'react'

const SESSION_KEY = 'sarah-jesus-opening-invitation-seen'
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
    // A disabled storage API should never prevent access to the invitation site.
  }
}

export default function OpeningInvitation() {
  const [isVisible, setIsVisible] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const dialogRef = useRef(null)
  const openButtonRef = useRef(null)

  const closeInvitation = () => {
    rememberInvitation()
    setIsVisible(false)
  }

  useEffect(() => {
    if (hasSeenInvitation()) {
      setIsVisible(false)
    }
  }, [])

  useEffect(() => {
    // The pre-mount class in main.jsx has already hidden this for repeat visits.
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

    const focusTimer = window.setTimeout(() => openButtonRef.current?.focus(), 0)
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
      if (!dialogRef.current.contains(document.activeElement)) {
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
    const finishTimer = window.setTimeout(closeInvitation, reducedMotion ? 0 : 1850)
    return () => window.clearTimeout(finishTimer)
  }, [isOpening])

  if (!isVisible) return null

  function openInvitation() {
    if (isOpening) return
    setIsOpening(true)
  }

  return (
    <section className={`opening-invitation ${isOpening ? 'is-opening' : ''}`} role="dialog" aria-modal="true" aria-labelledby="opening-invitation-title" ref={dialogRef}>
      <div className="opening-invitation__paper-grain" aria-hidden="true" />
      <div className="opening-invitation__envelope" aria-label="A cream wedding invitation envelope">
        <div className="opening-invitation__envelope-back" aria-hidden="true" />
        <div className="opening-invitation__card" aria-hidden="true">
          <span className="opening-invitation__card-mark">S&amp;J</span>
          <span>Sarah &amp; Jesus</span>
          <small>November 27, 2027</small>
        </div>
        <div className="opening-invitation__flap" aria-hidden="true" />
        <div className="opening-invitation__envelope-front" aria-hidden="true" />
        <div className="opening-invitation__seal" aria-hidden="true"><span>S</span><em>&amp;</em><span>J</span></div>
      </div>
      <div className="opening-invitation__copy">
        <span className="opening-invitation__eyebrow">A wedding invitation</span>
        <h1 id="opening-invitation-title">Sarah <em>&amp;</em> Jesus</h1>
        <p>November 27, 2027</p>
        <button className="opening-invitation__open" type="button" onClick={openInvitation} disabled={isOpening} ref={openButtonRef}>
          {isOpening ? 'Opening…' : 'Open Our Invitation'} <span aria-hidden="true">↗</span>
        </button>
        <button className="opening-invitation__skip" type="button" onClick={closeInvitation} disabled={isOpening}>Skip to the website</button>
      </div>
    </section>
  )
}
