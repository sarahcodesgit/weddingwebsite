import { useState } from 'react'

const invitationSlots = [
  { id: 'guest-1', label: 'Invited guest 1' },
  { id: 'guest-2', label: 'Invited guest 2' },
]

export default function RsvpPrototype() {
  const [stage, setStage] = useState('lookup')
  const [lookup, setLookup] = useState('')
  const [attendance, setAttendance] = useState({ 'guest-1': 'attending', 'guest-2': 'attending' })
  const attendingCount = Object.values(attendance).filter((response) => response === 'attending').length

  const startPrototype = (event) => {
    event.preventDefault()
    setStage('response')
  }

  const showReview = (event) => {
    event.preventDefault()
    setStage('review')
  }

  const completePreview = () => {
    setStage('confirmation')
  }

  return (
    <div className="rsvp-shell">
      <div className="rsvp-shell__heading">
        <span className="eyebrow eyebrow--light">Reply with care</span>
        <h2>A private invitation<br /><em>for every guest.</em></h2>
        <p>This is a visual RSVP prototype. It does not search, transmit, or save a name, code, attendance choice, or dietary note.</p>
      </div>

      {stage === 'lookup' && (
        <form className="rsvp-card" onSubmit={startPrototype}>
          <span className="rsvp-card__step">01 · Find your invitation</span>
          <h3>Begin your reply</h3>
          <p>In the live version, a secure service will use this field to find only your invitation.</p>
          <label htmlFor="rsvp-lookup">Name or invitation code</label>
          <input id="rsvp-lookup" value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="Your name or code" autoComplete="off" />
          <button className="button button--ivory" type="submit">Preview the RSVP flow <span aria-hidden="true">→</span></button>
          <p className="rsvp-card__notice">No lookup occurs in this prototype. Do not enter a real invitation code here.</p>
        </form>
      )}

      {stage === 'response' && (
        <form className="rsvp-card rsvp-card--wide" onSubmit={showReview}>
          <div className="rsvp-card__topline">
            <span className="rsvp-card__step">02 · Your invitation</span>
            <button className="text-button" type="button" onClick={() => setStage('lookup')}>Start over</button>
          </div>
          <h3>Confirm your party</h3>
          <p className="rsvp-card__notice">Demo layout only: these generic slots are not guest data. A secure backend will return the exact names and number of guests named on your invitation.</p>
          <div className="rsvp-party" aria-label="Invitation party demonstration">
            {invitationSlots.map((guest) => (
              <fieldset className="rsvp-guest" key={guest.id}>
                <legend>{guest.label}</legend>
                <div className="rsvp-choices">
                  <label><input type="radio" name={guest.id} checked={attendance[guest.id] === 'attending'} onChange={() => setAttendance({ ...attendance, [guest.id]: 'attending' })} /> Joyfully attending</label>
                  <label><input type="radio" name={guest.id} checked={attendance[guest.id] === 'declining'} onChange={() => setAttendance({ ...attendance, [guest.id]: 'declining' })} /> Regretfully declining</label>
                </div>
                {attendance[guest.id] === 'attending' && <label className="rsvp-field">Confirm name<input placeholder="Confirmed guest name" /></label>}
              </fieldset>
            ))}
          </div>
          <label className="rsvp-field" htmlFor="dietary-notes">Dietary restrictions or accommodations <span>(optional)</span><textarea id="dietary-notes" rows="3" placeholder="Please share anything the hosts should know." /></label>
          <button className="button button--ivory" type="submit">Review RSVP preview <span aria-hidden="true">→</span></button>
        </form>
      )}

      {stage === 'review' && (
        <div className="rsvp-card rsvp-card--review" aria-live="polite">
          <div className="rsvp-card__topline">
            <span className="rsvp-card__step">03 · Review your reply</span>
            <button className="text-button" type="button" onClick={() => setStage('response')}>Edit RSVP</button>
          </div>
          <h3>One last look</h3>
          <p>This demo summary does not retain names, dietary notes, or invitation data. The live secure RSVP will show the exact invited names and selections for review before it sends a response.</p>
          <dl className="rsvp-review">
            <div><dt>Demo invitation slots</dt><dd>{invitationSlots.length}</dd></div>
            <div><dt>Selected attending</dt><dd>{attendingCount}</dd></div>
            <div><dt>Response storage</dt><dd>Not connected</dd></div>
          </dl>
          <button className="button button--ivory" type="button" onClick={completePreview}>Complete RSVP preview <span aria-hidden="true">→</span></button>
        </div>
      )}

      {stage === 'confirmation' && (
        <div className="rsvp-card rsvp-card--confirmation" role="status" aria-live="polite">
          <span className="rsvp-card__step">04 · Preview complete</span>
          <div className="rsvp-check" aria-hidden="true">✓</div>
          <h3>Your reply has not been sent.</h3>
          <p>This confirms the prototype flow only. When the secure RSVP service is connected, it will validate the invitation server-side, limit replies to invited guests, and send a real confirmation after saving the response.</p>
          <button className="text-button text-button--light" type="button" onClick={() => setStage('lookup')}>Return to RSVP start</button>
        </div>
      )}

      <aside className="rsvp-integration" aria-label="Future secure RSVP integration">
        <span>Planned secure RSVP</span>
        <p>Private invitation lookup · server-side household limits · authenticated response submission · host-only attendance dashboard</p>
      </aside>
    </div>
  )
}
