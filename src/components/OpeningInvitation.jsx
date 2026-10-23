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

function OrnamentalWaxSeal() {
  return (
    <svg className="opening-heritage__monogram" viewBox="0 0 180 180" aria-hidden="true">
      <defs>
        <radialGradient id="wax-tone" cx="35%" cy="26%" r="78%">
          <stop stopColor="#676954" />
          <stop offset=".58" stopColor="#4B4D39" />
          <stop offset="1" stopColor="#343628" />
        </radialGradient>
      </defs>
      <path d="M90 12c8-11 22-6 25 5 12-8 24 1 22 14 14-3 22 10 15 21 13 5 14 20 2 27 9 11 4 24-9 27 4 13-7 23-19 18-4 13-19 16-27 5-9 11-24 8-28-5-13 5-24-5-19-18-13-3-17-17-8-27-12-7-10-22 3-27-7-11 2-24 15-21-2-13 10-22 22-14 3-11 17-16 25-5Z" fill="url(#wax-tone)" stroke="#402116" strokeOpacity=".65" strokeWidth="2" />
      <ellipse cx="90" cy="90" rx="49" ry="58" fill="none" stroke="#EDE6D4" strokeOpacity=".8" strokeWidth="1.6" />
      <ellipse cx="90" cy="90" rx="42" ry="51" fill="none" stroke="#EDE6D4" strokeOpacity=".42" strokeWidth="1" />
      <path d="M45 55c9-14 20-23 34-27M135 55c-9-14-20-23-34-27M45 125c9 14 20 23 34 27M135 125c-9 14-20 23-34 27" fill="none" stroke="#EDE6D4" strokeOpacity=".65" strokeWidth="1.1" strokeLinecap="round" />
      <text x="90" y="104" fill="#F8F2E5" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="52" fontStyle="italic" letterSpacing="-8">S&amp;J</text>
    </svg>
  )
}

function EnvelopePocket() {
  return (
    <svg className="opening-heritage__pocket-art" viewBox="0 0 1000 580" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="pocket-paper" x1=".12" y1="0" x2=".88" y2="1">
          <stop stopColor="#F7F0E1" />
          <stop offset=".58" stopColor="#EDE6D4" />
          <stop offset="1" stopColor="#D9CDB8" />
        </linearGradient>
      </defs>
      <path d="M55 240c119 34 246 52 379 54 133-2 260-20 381-54v275c0 17-14 31-31 31H86c-17 0-31-14-31-31V240Z" fill="url(#pocket-paper)" stroke="#402116" strokeOpacity=".42" strokeWidth="2" />
      <path d="M84 259c116 30 254 45 416 45s300-15 416-45" fill="none" stroke="#402116" strokeOpacity=".2" strokeWidth="1.2" />
      <path d="M85 503c88-18 155-43 202-75M915 503c-88-18-155-43-202-75" fill="none" stroke="#4B4D39" strokeOpacity=".24" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M96 480c17-11 31-25 42-43m-24 45c19-3 36-11 49-25M904 480c-17-11-31-25-42-43m24 45c-19-3-36-11-49-25" fill="none" stroke="#4B4D39" strokeOpacity=".32" strokeWidth="1.15" strokeLinecap="round" />
      <g fill="#4B4D39" opacity=".27">
        <ellipse cx="148" cy="430" rx="4" ry="12" transform="rotate(-38 148 430)" />
        <ellipse cx="173" cy="451" rx="4" ry="12" transform="rotate(28 173 451)" />
        <ellipse cx="852" cy="430" rx="4" ry="12" transform="rotate(38 852 430)" />
        <ellipse cx="827" cy="451" rx="4" ry="12" transform="rotate(-28 827 451)" />
      </g>
    </svg>
  )
}

function ScallopedFlap() {
  return (
    <svg className="opening-heritage__flap-art" viewBox="0 0 1000 580" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="flap-paper" x1=".12" y1="0" x2=".88" y2="1">
          <stop stopColor="#FCF6E9" />
          <stop offset=".55" stopColor="#EDE6D4" />
          <stop offset="1" stopColor="#D8CBB3" />
        </linearGradient>
      </defs>
      <path d="M66 66C233 27 767 27 934 66v191c-61 16-116 42-166 73-43 28-83 42-120 43-26 1-45-8-63-25-15 17-36 19-52 1-15 19-36 19-52 0-17 18-38 16-52-1-18 17-37 26-63 25-37-1-77-15-120-43-50-31-105-57-166-73V66Z" fill="url(#flap-paper)" stroke="#402116" strokeOpacity=".46" strokeWidth="2" />
      <path d="M102 87c161-30 635-30 796 0M122 110c131-19 625-19 756 0" fill="none" stroke="#4B4D39" strokeOpacity=".28" strokeWidth="1.15" />
      <path d="M137 139c25 2 46-7 65-28m-35 57c15-4 29-13 40-27M863 139c-25 2-46-7-65-28m35 57c-15-4-29-13-40-27" fill="none" stroke="#4B4D39" strokeOpacity=".42" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M351 314c12 4 23 0 32-11 13 18 34 19 49 1 16 19 37 19 52 0 16 18 37 17 52-1 9 11 20 15 32 11" fill="none" stroke="#4B4D39" strokeOpacity=".54" strokeWidth="1.5" strokeLinecap="round" />
      <g fill="#4B4D39" opacity=".28">
        <ellipse cx="173" cy="150" rx="5" ry="13" transform="rotate(-36 173 150)" />
        <ellipse cx="197" cy="128" rx="4" ry="11" transform="rotate(24 197 128)" />
        <ellipse cx="827" cy="150" rx="5" ry="13" transform="rotate(36 827 150)" />
        <ellipse cx="803" cy="128" rx="4" ry="11" transform="rotate(-24 803 128)" />
      </g>
    </svg>
  )
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
    <section className={`opening-invitation ${isOpening ? 'is-opening' : ''}`} role="dialog" aria-modal="true" aria-labelledby="opening-invitation-title" aria-describedby="opening-invitation-instruction" aria-busy={isOpening} ref={dialogRef} tabIndex="-1">
      <div className="opening-heritage__paper" aria-hidden="true" />
      <h2 id="opening-invitation-title" className="sr-only">Sarah and Jesus’s wedding invitation</h2>
      <div className="opening-heritage__corner opening-heritage__corner--one" aria-hidden="true" />
      <div className="opening-heritage__corner opening-heritage__corner--two" aria-hidden="true" />

      <div className="opening-heritage__suite">
        <button className="opening-heritage__stationery" type="button" onClick={openInvitation} aria-label="Open Sarah and Jesus's wedding invitation">
          <span className="opening-heritage__shadow" aria-hidden="true" />
          <span className="opening-heritage__envelope-base" aria-hidden="true" />
          <span className="opening-heritage__lining" aria-hidden="true"><img src="/images/opening-envelope-lining.svg" alt="" /></span>
          <span className="opening-heritage__pocket" aria-hidden="true"><EnvelopePocket /></span>
          <span className="opening-heritage__flap" aria-hidden="true"><ScallopedFlap /></span>
          <span className="opening-heritage__seal" aria-hidden="true"><OrnamentalWaxSeal /></span>
        </button>

        <p className="opening-heritage__hint" id="opening-invitation-instruction">
          <span className="opening-heritage__hint-line" aria-hidden="true" />
          Click to open
          <span className="opening-heritage__hint-line" aria-hidden="true" />
        </p>
      </div>

      <button className="opening-heritage__skip" type="button" onClick={closeInvitation}>Skip to the website</button>
    </section>
  )
}
