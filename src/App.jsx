import { useEffect, useState } from 'react'
import Accordion from './components/Accordion'
import Countdown from './components/Countdown'
import Monogram from './components/Monogram'
import OpeningInvitation from './components/OpeningInvitation'
import RsvpForm from './components/RsvpForm'
import { faqs, navigation, storyChapters, weddingDetails } from './data/weddingData'

function PlaceholderImage({ label, number, className = '' }) {
  return (
    <div className={`photo-placeholder ${className}`} role="img" aria-label={`${label} photo placeholder`}>
      <span className="photo-placeholder__sun" aria-hidden="true">✦</span>
      <span className="photo-placeholder__index">{number}</span>
      <span className="photo-placeholder__label">{label}</span>
      <span className="photo-placeholder__note">Photograph to be added</span>
    </div>
  )
}

function SectionMark({ children }) {
  return <span className="section-mark"><i aria-hidden="true" />{children}<i aria-hidden="true" /></span>
}

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const revealed = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    revealed.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <OpeningInvitation />
      <div className="site-shell">
        <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="site-header__brand" href="#home" onClick={closeMenu} aria-label="Sarah and Jesus, home"><Monogram compact /></a>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} id="main-navigation" aria-label="Primary navigation">
          {navigation.map((item) => <a href={item.href} key={item.href} onClick={closeMenu}>{item.label}</a>)}
        </nav>
        <a className="site-header__rsvp" href="#rsvp">RSVP <span aria-hidden="true">↗</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span /><span />
        </button>
      </header>

      <main id="main" tabIndex="-1">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero__photo-wrap" data-reveal>
            <div className="hero__frame hero__frame--outer" aria-hidden="true" />
            <img className="hero__photo" src={weddingDetails.hero.image.src} alt={weddingDetails.hero.image.alt} fetchpriority="high" />
            <a className="photo-credit" href={weddingDetails.hero.image.creditUrl} target="_blank" rel="noreferrer">{weddingDetails.hero.image.credit}</a>
          </div>
          <div className="hero__invite" data-reveal>
            <div className="hero__corner hero__corner--top" aria-hidden="true">✦</div>
            <p className="hero__kicker">Together with our families</p>
            <Monogram />
            <h1 id="hero-title"><span>Sarah</span><em>&</em><span>Jesus</span></h1>
            <p className="hero__message">we joyfully invite you to celebrate our marriage.</p>
            <div className="hero__date-rule"><span>Saturday</span><strong>November 27, 2027</strong><span>Houston, Texas</span></div>
            <div className="hero__countdown-block">
              <span>Counting down to our wedding day</span>
              <Countdown target={weddingDetails.countdownTarget} />
            </div>
            <a className="hero__scroll" href="#the-wedding">Discover the day <span aria-hidden="true">↓</span></a>
            <div className="hero__corner hero__corner--bottom" aria-hidden="true">✦</div>
          </div>
        </section>

        <section className="intro" aria-label="Wedding invitation introduction">
          <p data-reveal>With hearts full of gratitude, we cannot wait to gather with the people who have loved us, guided us, and made our lives brighter.</p>
        </section>

        <section className="wedding-section section-space" id="the-wedding" aria-labelledby="wedding-title">
          <div className="section-heading section-heading--center" data-reveal>
            <SectionMark>The celebration</SectionMark>
            <h2 id="wedding-title">The Wedding</h2>
            <p>One day, held close. The details below will be updated as they are confirmed.</p>
          </div>
          <div className="event-spread" data-reveal>
            <article className="event-card event-card--ceremony">
              <div className="event-card__art">
                <img src={weddingDetails.hero.image.src} alt="Bell tower of The Church of the Annunciation in Houston" loading="lazy" />
              </div>
              <div className="event-card__body">
                <span className="event-card__index">01 · The ceremony</span>
                <h3>The Church of<br />the Annunciation</h3>
                <p className="event-card__place">{weddingDetails.church.location}</p>
                <dl className="event-facts">
                  <div><dt>Date</dt><dd>Saturday, November 27, 2027</dd></div>
                  <div><dt>Time</dt><dd>{weddingDetails.church.time}</dd></div>
                  <div><dt>Address</dt><dd>{weddingDetails.church.address}</dd></div>
                </dl>
                <a className="button button--outline" href={weddingDetails.church.mapsUrl} target="_blank" rel="noreferrer">Get directions <Arrow /></a>
              </div>
            </article>
            <article className="event-card event-card--reception">
              <div className="event-card__body">
                <span className="event-card__index">02 · The reception</span>
                <h3>To Be<br />Announced</h3>
                <p className="event-card__place">November 27, 2027</p>
                <dl className="event-facts">
                  <div><dt>Venue</dt><dd>Details coming soon</dd></div>
                  <div><dt>Address</dt><dd>To be announced</dd></div>
                  <div><dt>Time</dt><dd>To be announced</dd></div>
                  <div><dt>Cocktail hour</dt><dd>To be announced</dd></div>
                  <div><dt>Reception</dt><dd>Schedule to be announced</dd></div>
                </dl>
              </div>
              <div className="event-card__art"><img src="/images/ashtongardens.webp" alt="Stone chapel surrounded by greenery at Ashton Gardens" loading="lazy" /></div>
            </article>
          </div>
          <p className="details-note" data-reveal>All reception information, including venue, address, photograph, cocktail hour, and evening schedule, will be shared here once finalized.</p>
        </section>

        <section className="story-section section-space" id="our-story" aria-labelledby="story-title">
          <div className="section-heading" data-reveal>
            <SectionMark>A few pages in</SectionMark>
            <h2 id="story-title">Our Love Story</h2>
            <p>From an unexpected beginning to a forever kind of love, here are a few chapters of our story.</p>
          </div>
          <div className="story-chapters">
            {storyChapters.map((chapter, index) => (
              <article className={`story-chapter story-chapter--${index + 1}`} data-reveal key={chapter.title}>
                <PlaceholderImage number={chapter.number} label={chapter.imageLabel} />
                <div className="story-chapter__words">
                  <span>{chapter.accent}</span>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.body}</p>
                </div>
              </article>
            ))}
          </div>
          <aside className="message-card" data-reveal>
            <span className="eyebrow">A message from us</span>
            <p>To our family and friends: thank you for being part of our lives, for the memories we carry, and for the love that has brought us to this moment. Having you with us as we begin this next chapter means more than we can say.</p>
            <div className="message-card__signature">Sarah <em>&</em> Jesus</div>
          </aside>
        </section>

        <section className="faq-section section-space" id="faq" aria-labelledby="faq-title">
          <div className="faq-layout">
            <div className="section-heading" data-reveal>
              <SectionMark>Helpful details</SectionMark>
              <h2 id="faq-title">Frequently<br /><em>asked.</em></h2>
              <p>We will keep this page updated as arrangements are finalized.</p>
            </div>
            <div data-reveal><Accordion items={faqs} /></div>
          </div>
          <aside className="travel-card" data-reveal>
            <div><span className="eyebrow">A note for our guests</span><h3>We hope to see you!</h3></div>
            <div><p>RSVP below or by contacting Jesus and Sarah.</p><a className="travel-card__pending" href="#rsvp">RSVP below ↓</a></div>
          </aside>
        </section>

        <section className="rsvp-section section-space" id="rsvp" aria-labelledby="rsvp-title">
          <RsvpForm />
        </section>

        <section className="registry-section section-space" id="registry" aria-labelledby="registry-title">
          <div className="registry-section__frame" data-reveal>
            <div className="registry-section__motif" aria-hidden="true">❦</div>
            <SectionMark>With gratitude</SectionMark>
            <h2 id="registry-title">Your presence is<br /><em>our greatest gift.</em></h2>
            <p>Your presence at our wedding is the greatest gift we could ask for. For those who have expressed an interest, we have created a Honeymoon Fund page.</p>
            <a className="button button--olive" href={weddingDetails.registryUrl} target="_blank" rel="noreferrer">Our Honeymoon Fund <Arrow /></a>
          </div>
        </section>
      </main>

        <footer className="site-footer">
        <div className="site-footer__line" />
        <Monogram inverse />
        <p>Sarah &amp; Jesus</p>
        <span>November 27, 2027 · Houston, Texas</span>
        <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </>
  )
}
