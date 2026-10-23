import { useEffect, useRef, useState } from 'react'

const SESSION_KEY = 'sarah-jesus-opening-invitation-seen'
const OPENING_DURATION = 3650
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

function OrnamentalMonogram() {
  return (
    <svg className="opening-heritage__monogram" viewBox="0 0 180 126" aria-hidden="true">
      <path d="M31 63C31 34 56 16 90 16s59 18 59 47-25 47-59 47S31 92 31 63Z" fill="#4B4D39" />
      <path d="M24 63C24 27 53 7 90 7s66 20 66 56-29 56-66 56S24 99 24 63Z" fill="none" stroke="#EDE6D4" strokeWidth="2" />
      <path d="M17 53c-13 4-14 19 0 23M163 53c13 4 14 19 0 23M42 21c-2-13 13-18 20-8M138 21c2-13-13-18-20-8M42 105c-2 13 13 18 20 8M138 105c2 13-13 18-20 8" fill="none" stroke="#4B4D39" strokeWidth="2" strokeLinecap="round" />
      <path d="M51 28c8-7 18-11 30-12M129 28c-8-7-18-11-30-12M51 98c8 7 18 11 30 12M129 98c-8 7-18 11-30 12" fill="none" stroke="#EDE6D4" strokeWidth="1" opacity=".9" />
      <text x="90" y="72" fill="#EDE6D4" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="42" fontStyle="italic" letterSpacing="-6">S&amp;J</text>
    </svg>
  )
}

function EnvelopePocket() {
  return (
    <svg className="opening-heritage__pocket-art" viewBox="0 0 900 520" preserveAspectRatio="none" aria-hidden="true">
      <path d="M25 96C172 154 320 217 450 310 580 217 728 154 875 96v386c0 10-8 18-18 18H43c-10 0-18-8-18-18V96Z" fill="#E8DDC8" stroke="#402116" strokeOpacity=".38" strokeWidth="2" />
      <path d="M27 98 450 310 873 98" fill="none" stroke="#402116" strokeOpacity=".33" strokeWidth="2" />
      <path d="M25 480 328 244M875 480 572 244" fill="none" stroke="#402116" strokeOpacity=".24" strokeWidth="2" />
      <path d="M52 448c54-23 98-51 132-84M848 448c-54-23-98-51-132-84" fill="none" stroke="#4B4D39" strokeOpacity=".28" strokeWidth="1.4" />
      <path d="M365 376c20-13 42-20 65-22M535 376c-20-13-42-20-65-22" fill="none" stroke="#4B4D39" strokeOpacity=".24" strokeWidth="1.2" />
      <g fill="#4B4D39" opacity=".32">
        <ellipse cx="160" cy="385" rx="4" ry="11" transform="rotate(-42 160 385)" />
        <ellipse cx="180" cy="367" rx="4" ry="11" transform="rotate(-16 180 367)" />
        <ellipse cx="740" cy="385" rx="4" ry="11" transform="rotate(42 740 385)" />
        <ellipse cx="720" cy="367" rx="4" ry="11" transform="rotate(16 720 367)" />
      </g>
    </svg>
  )
}

function ScallopedFlap() {
  return (
    <svg className="opening-heritage__flap-art" viewBox="0 0 900 520" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="flap-paper" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F7F0E1" />
          <stop offset="1" stopColor="#E4D7BF" />
        </linearGradient>
      </defs>
      <path d="M25 26h850v102c-71 29-141 68-211 113-57 37-107 65-150 83-14 6-25 3-34-8-8 14-21 17-31 3-9 15-22 15-30 0-10 14-23 11-31-3-9 11-20 14-34 8-43-18-93-46-150-83-70-45-140-84-211-113V26Z" fill="url(#flap-paper)" stroke="#402116" strokeOpacity=".42" strokeWidth="2" />
      <path d="M25 26h850M64 55h772M69 72c37 8 69 3 99-16M831 72c-37 8-69 3-99-16" fill="none" stroke="#4B4D39" strokeOpacity=".46" strokeWidth="1.2" />
      <path d="M105 91c24 31 48 53 75 71M795 91c-24 31-48 53-75 71M346 211c14 5 25 1 34-8 8 14 21 17 31 3 9 15 22 15 30 0 10 14 23 11 31-3 9 11 20 14 34 8" fill="none" stroke="#4B4D39" strokeOpacity=".52" strokeWidth="1.45" strokeLinecap="round" />
      <g fill="#4B4D39" opacity=".42">
        <ellipse cx="121" cy="106" rx="5" ry="14" transform="rotate(-47 121 106)" />
        <ellipse cx="148" cy="137" rx="5" ry="14" transform="rotate(-17 148 137)" />
        <ellipse cx="779" cy="106" rx="5" ry="14" transform="rotate(47 779 106)" />
        <ellipse cx="752" cy="137" rx="5" ry="14" transform="rotate(17 752 137)" />
      </g>
      <path d="M432 314c5 9 12 14 18 14s13-5 18-14c6 9 13 14 20 13 7-1 10-8 13-18" fill="none" stroke="#402116" strokeOpacity=".46" strokeWidth="1.5" strokeLinecap="round" />
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
    <section className={`opening-invitation ${isOpening ? 'is-opening' : ''}`} role="dialog" aria-modal="true" aria-labelledby="opening-invitation-title" aria-describedby="opening-invitation-instruction" ref={dialogRef} tabIndex="-1">
      <div className="opening-heritage__paper" aria-hidden="true" />
      <h2 id="opening-invitation-title" className="sr-only">Sarah and Jesus’s wedding invitation</h2>
      <div className="opening-heritage__corner opening-heritage__corner--one" aria-hidden="true" />
      <div className="opening-heritage__corner opening-heritage__corner--two" aria-hidden="true" />

      <div className="opening-heritage__suite">
        <button className="opening-heritage__stationery" type="button" onClick={openInvitation} aria-label="Open Sarah and Jesus's wedding invitation">
          <span className="opening-heritage__shadow" aria-hidden="true" />
          <span className="opening-heritage__envelope-back" aria-hidden="true">
            <img src="/images/opening-envelope-lining.svg" alt="" />
            <span className="opening-heritage__back-border" />
          </span>
          <span className="opening-heritage__card" aria-hidden="true">
            <img className="opening-heritage__card-frame" src="/images/opening-botanical-frame.svg" alt="" />
            <span className="opening-heritage__card-kicker">Together with our families</span>
            <span className="opening-heritage__card-names"><span>Sarah</span><em>&amp;</em><span>Jesus</span></span>
            <span className="opening-heritage__card-rule" />
            <span className="opening-heritage__card-date">November 27, 2027</span>
            <span className="opening-heritage__card-place">Houston, Texas</span>
          </span>
          <span className="opening-heritage__pocket" aria-hidden="true"><EnvelopePocket /></span>
          <span className="opening-heritage__flap" aria-hidden="true"><ScallopedFlap /></span>
          <span className="opening-heritage__seal" aria-hidden="true"><OrnamentalMonogram /></span>
        </button>

        <button className="opening-heritage__hint" type="button" onClick={openInvitation} id="opening-invitation-instruction">
          <span className="opening-heritage__hint-line" aria-hidden="true" />
          {isOpening ? 'Unfolding your invitation' : 'Click to open'}
          <span className="opening-heritage__hint-line" aria-hidden="true" />
        </button>
      </div>

      <button className="opening-heritage__skip" type="button" onClick={closeInvitation}>Skip to the website</button>
    </section>
  )
}
