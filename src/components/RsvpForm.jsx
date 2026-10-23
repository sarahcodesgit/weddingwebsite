import { useMemo, useState } from 'react'
import { demoRsvpMessage, isLiveRsvpEnabled, supabase } from '../lib/supabase'

const MAX_TOTAL_GUESTS = 8

const createGuest = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  fullName: '',
})

const cleanName = (value) => value.trim().replace(/\s+/g, ' ')
const normalizePhone = (value) => value.replace(/\D/g, '')
const looksLikeFullName = (value) => cleanName(value).split(' ').filter(Boolean).length >= 2
const looksLikePhoneNumber = (value) => {
  const digits = normalizePhone(value)
  return digits.length >= 7 && digits.length <= 15
}

async function readFunctionError(error) {
  if (error?.context instanceof Response) {
    try {
      const payload = await error.context.clone().json()
      return payload.error || payload.message || error.message
    } catch {
      return error.message
    }
  }
  return error?.message || 'We could not submit your RSVP. Please try again later.'
}

export default function RsvpForm() {
  const [primaryGuestName, setPrimaryGuestName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [attendance, setAttendance] = useState('')
  const [additionalGuests, setAdditionalGuests] = useState([])
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const isAttending = attendance === 'accept'
  const totalAttending = isAttending ? 1 + additionalGuests.length : 0
  const canAddGuest = isAttending && totalAttending < MAX_TOTAL_GUESTS

  const confirmationSummary = useMemo(() => {
    if (!confirmation) return null
    return {
      primaryGuestName: confirmation.primaryGuestName || cleanName(primaryGuestName),
      phoneNumber: confirmation.phoneNumber || phoneNumber.trim(),
      attendance: confirmation.attendance || attendance,
      totalAttending: Number.isInteger(confirmation.totalAttending) ? confirmation.totalAttending : totalAttending,
      additionalGuests: confirmation.additionalGuests || additionalGuests.map((guest) => cleanName(guest.fullName)).filter(Boolean),
      dietaryNotes: confirmation.dietaryNotes ?? dietaryNotes.trim(),
      isDemo: Boolean(confirmation.isDemo),
    }
  }, [additionalGuests, attendance, confirmation, dietaryNotes, phoneNumber, primaryGuestName, totalAttending])

  function chooseAttendance(value) {
    setAttendance(value)
    setError('')
    if (value === 'decline') {
      setAdditionalGuests([])
      setDietaryNotes('')
    }
  }

  function updatePhoneNumber(value) {
    setPhoneNumber(value)
  }

  function addGuest() {
    if (canAddGuest) setAdditionalGuests((guests) => [...guests, createGuest()])
  }

  function updateGuest(id, fullName) {
    setAdditionalGuests((guests) => guests.map((guest) => (guest.id === id ? { ...guest, fullName } : guest)))
  }

  function removeGuest(id) {
    setAdditionalGuests((guests) => guests.filter((guest) => guest.id !== id))
  }

  function validateClientForm() {
    if (!looksLikeFullName(primaryGuestName)) return 'Please enter the primary guest’s first and last name.'
    if (!looksLikePhoneNumber(phoneNumber)) return 'Please enter a valid phone number.'
    if (!attendance) return 'Please choose whether you will attend.'
    if (isAttending && additionalGuests.some((guest) => !looksLikeFullName(guest.fullName))) return 'Please enter the full name of each household member or remove the empty field.'
    return ''
  }

  async function submitRsvp(event) {
    event.preventDefault()
    setError('')
    const validationError = validateClientForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const responseDetails = {
      primaryGuestName: cleanName(primaryGuestName),
      phoneNumber: phoneNumber.trim(),
      attendance,
      additionalGuests: isAttending ? additionalGuests.map((guest) => cleanName(guest.fullName)) : [],
      dietaryNotes: isAttending ? dietaryNotes.trim() : '',
      totalAttending,
    }

    if (!isLiveRsvpEnabled || !supabase) {
      setConfirmation({ ...responseDetails, isDemo: true })
      return
    }

    const guestToken = window.sessionStorage.getItem('sarah-jesus-wedding-guest-token')
    if (!guestToken) { setError('Please enter through the wedding password page again.'); return }
    setIsSubmitting(true)
    const { data, error: functionError } = await supabase.functions.invoke('rsvp-submit', {
      body: {
        ...responseDetails,
        website: honeypot,
        formStartedAt,
        guestToken,
      },
    })
    setIsSubmitting(false)

    if (functionError || data?.error) {
      setError(functionError ? await readFunctionError(functionError) : data.error)
      return
    }

    setConfirmation(data.response)
  }

  function resetForm() {
    setPrimaryGuestName('')
    updatePhoneNumber('')
    setAttendance('')
    setAdditionalGuests([])
    setDietaryNotes('')
    setHoneypot('')
    setFormStartedAt(Date.now())
    setError('')
    setConfirmation(null)
  }

  const submitLabel = isSubmitting ? 'Sending RSVP…' : isLiveRsvpEnabled ? 'Send RSVP' : 'Preview your RSVP'

  if (confirmationSummary) {
    const accepts = confirmationSummary.attendance === 'accept'
    return (
      <div className="rsvp-shell">
        <div className="rsvp-shell__heading">
          <span className="eyebrow eyebrow--light">{confirmationSummary.isDemo ? 'Demo RSVP preview' : 'RSVP received'}</span>
          <h2 id="rsvp-title">Thank<br /><em>you.</em></h2>
          <p>{confirmationSummary.isDemo ? 'Your demo reply is ready to review. It has not been sent to Sarah and Jesus.' : 'Your response has been recorded. We are grateful you took a moment to reply.'}</p>
        </div>
        <section className="rsvp-card rsvp-card--summary" aria-live="polite" aria-labelledby="rsvp-summary-title">
          <span className="rsvp-card__step">{confirmationSummary.isDemo ? 'Demo summary' : 'Confirmation'}</span>
          <h3 id="rsvp-summary-title">Your RSVP summary</h3>
          {confirmationSummary.isDemo && <p className="rsvp-card__notice rsvp-card__notice--setup" role="status">{demoRsvpMessage}</p>}
          <dl className="rsvp-review">
            <div><dt>Primary guest</dt><dd>{confirmationSummary.primaryGuestName}</dd></div>
            <div><dt>Phone</dt><dd>{confirmationSummary.phoneNumber}</dd></div>
            <div><dt>Response</dt><dd>{accepts ? 'Joyfully Accepts' : 'Respectfully Declines'}</dd></div>
            {accepts && <div><dt>Total attending</dt><dd>{confirmationSummary.totalAttending}</dd></div>}
            {accepts && confirmationSummary.additionalGuests.length > 0 && <div><dt>Household members</dt><dd>{confirmationSummary.additionalGuests.join(', ')}</dd></div>}
            {accepts && confirmationSummary.dietaryNotes && <div><dt>Requests</dt><dd>{confirmationSummary.dietaryNotes}</dd></div>}
          </dl>
          <div className="rsvp-summary-actions">
            <button className="text-button" type="button" onClick={() => setConfirmation(null)}>{confirmationSummary.isDemo ? 'Update this demo RSVP' : 'Update this RSVP'}</button>
            <button className="text-button" type="button" onClick={resetForm}>Start another RSVP</button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="rsvp-shell">
      <div className="rsvp-shell__heading">
        <span className="eyebrow eyebrow--light">A note for our guests</span>
        <h2 id="rsvp-title">Please<br /><em>reply.</em></h2>
        <p>We are so grateful you will share this day with us. Your response helps us prepare with care.</p>
      </div>

      <form className="rsvp-card rsvp-card--family" onSubmit={submitRsvp} noValidate>
        <span className="rsvp-card__step">Wedding RSVP</span>
        <h3>Will you be joining us?</h3>
        <p className="rsvp-card__intro">Please include only the family members or additional guests listed on your invitation.</p>
        {!isLiveRsvpEnabled && <p className="rsvp-card__notice rsvp-card__notice--setup" role="status">{demoRsvpMessage}</p>}
        {error && <p className="rsvp-card__notice rsvp-card__notice--error" role="alert">{error}</p>}

        <label htmlFor="primary-guest-name">Primary guest’s full name</label>
        <input id="primary-guest-name" name="primaryGuestName" value={primaryGuestName} onChange={(event) => setPrimaryGuestName(event.target.value)} placeholder="First and last name" autoComplete="name" required />
        <label htmlFor="primary-guest-phone">Phone number</label>
        <input id="primary-guest-phone" name="phoneNumber" type="tel" value={phoneNumber} onChange={(event) => updatePhoneNumber(event.target.value)} placeholder="+1 555 555 5555, +55 11 99999 9999, or +52 ..." autoComplete="tel" required />

        <fieldset className="attendance-options">
          <legend>Will you attend?</legend>
          <label className={`attendance-option ${attendance === 'accept' ? 'is-selected' : ''}`}>
            <input type="radio" name="attendance" value="accept" checked={attendance === 'accept'} onChange={() => chooseAttendance('accept')} required />
            <span><strong>Joyfully Accepts</strong><small>We can’t wait to celebrate together.</small></span>
          </label>
          <label className={`attendance-option ${attendance === 'decline' ? 'is-selected' : ''}`}>
            <input type="radio" name="attendance" value="decline" checked={attendance === 'decline'} onChange={() => chooseAttendance('decline')} required />
            <span><strong>Respectfully Declines</strong><small>We will miss you and send our love.</small></span>
          </label>
        </fieldset>

        {isAttending && (
          <div className="family-guests">
            <div className="family-guests__header">
              <div><span className="rsvp-card__step">Household &amp; additional guests</span><p>Add only the family members or additional guests named on your invitation.</p></div>
              <span className="guest-count" aria-live="polite">{totalAttending} attending</span>
            </div>
            {additionalGuests.map((guest, index) => (
              <div className="additional-guest" key={guest.id}>
                <label htmlFor={`additional-guest-${guest.id}`}>Household member or guest {index + 1} full name</label>
                <div className="additional-guest__control">
                  <input id={`additional-guest-${guest.id}`} value={guest.fullName} onChange={(event) => updateGuest(guest.id, event.target.value)} placeholder="First and last name" autoComplete="name" required />
                  <button className="remove-guest" type="button" onClick={() => removeGuest(guest.id)} aria-label={`Remove household member or guest ${index + 1}`}>Remove</button>
                </div>
              </div>
            ))}
            <button className="add-guest" type="button" onClick={addGuest} disabled={!canAddGuest}>+ Add Another Guest</button>
            {!canAddGuest && <p className="guest-limit">A single RSVP can include up to {MAX_TOTAL_GUESTS} guests.</p>}
            <label className="rsvp-field" htmlFor="dietary-notes">Dietary restrictions or special requests <span>(optional)</span><textarea id="dietary-notes" value={dietaryNotes} onChange={(event) => setDietaryNotes(event.target.value)} rows="3" maxLength="1000" placeholder="Please share anything helpful for the celebration." /></label>
          </div>
        )}

        <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex="-1" autoComplete="off" /></div>
        <button className="button button--ivory" type="submit" disabled={isSubmitting}>{submitLabel}</button>
      </form>
    </div>
  )
}
