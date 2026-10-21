import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase, supabaseSetupMessage } from '../lib/supabase'

const MAX_TOTAL_GUESTS = 8

const cleanGuests = (guests = []) => guests.map((guest) => typeof guest === 'string' ? guest : guest.full_name).filter(Boolean)

function csvCell(value) {
  const text = String(value ?? '')
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safeText.replaceAll('"', '""')}"`
}

function createGuest(fullName = '') {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, fullName }
}

function editState(response) {
  return {
    id: response.id,
    primaryGuestName: response.primary_guest_name,
    phoneNumber: response.phone_number,
    attendance: response.attendance,
    dietaryNotes: response.dietary_notes || '',
    additionalGuests: cleanGuests(response.rsvp_additional_guests).map(createGuest),
  }
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
  return error?.message || 'The admin request could not be completed.'
}

export default function AdminDashboard() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [responses, setResponses] = useState([])
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const invokeAdmin = useCallback(async (action, payload = {}) => {
    if (!supabase) throw new Error(supabaseSetupMessage)
    const { data, error: functionError } = await supabase.functions.invoke('rsvp-admin', { body: { action, ...payload } })
    if (functionError) throw new Error(await readFunctionError(functionError))
    if (data?.error) throw new Error(data.error)
    return data
  }, [])

  const loadResponses = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const data = await invokeAdmin('list')
      setResponses(data.responses || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [invokeAdmin, session])

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => { loadResponses() }, [loadResponses])

  const totalHeadcount = useMemo(() => responses.reduce((total, response) => total + Number(response.total_attending || 0), 0), [responses])
  const acceptedResponses = useMemo(() => responses.filter((response) => response.attendance === 'accept').length, [responses])

  async function signIn(event) {
    event.preventDefault()
    if (!supabase) return
    setLoading(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) setError(signInError.message)
  }

  async function signOut() {
    await supabase?.auth.signOut()
    setResponses([])
    setEditing(null)
    setMessage('Signed out.')
  }

  async function saveEdit(event) {
    event.preventDefault()
    if (!editing) return
    const totalAttending = editing.attendance === 'accept' ? 1 + editing.additionalGuests.length : 0
    setLoading(true)
    setError('')
    try {
      await invokeAdmin('update', {
        response: {
          id: editing.id,
          primaryGuestName: editing.primaryGuestName,
          phoneNumber: editing.phoneNumber,
          attendance: editing.attendance,
          additionalGuests: editing.attendance === 'accept' ? editing.additionalGuests.map((guest) => guest.fullName) : [],
          dietaryNotes: editing.attendance === 'accept' ? editing.dietaryNotes : '',
          totalAttending,
        },
      })
      setEditing(null)
      setMessage('RSVP updated.')
      await loadResponses()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeResponse(id, guestName) {
    if (!window.confirm(`Remove ${guestName}'s RSVP? This cannot be undone.`)) return
    setLoading(true)
    setError('')
    try {
      await invokeAdmin('delete', { id })
      setMessage('RSVP removed.')
      if (editing?.id === id) setEditing(null)
      await loadResponses()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function downloadCsv() {
    const header = ['Primary guest', 'Phone number', 'Response', 'Total attending', 'Additional guests', 'Dietary restrictions / special requests', 'Submitted at']
    const rows = responses.map((response) => [
      response.primary_guest_name,
      response.phone_number,
      response.attendance === 'accept' ? 'Joyfully Accepts' : 'Regretfully Declines',
      response.total_attending,
      cleanGuests(response.rsvp_additional_guests).join('; '),
      response.dietary_notes || '',
      response.created_at,
    ])
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'sarah-and-jesus-rsvp-list.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!isSupabaseConfigured) {
    return <main className="admin-page"><section className="admin-card"><span className="admin-eyebrow">Private RSVP dashboard</span><h1>Setup required</h1><p>{supabaseSetupMessage} Add the public Supabase URL and publishable key locally, then follow the README to deploy and test the protected Edge Functions before this dashboard is used.</p></section></main>
  }

  if (!session) {
    return (
      <main className="admin-page">
        <section className="admin-card admin-card--login">
          <span className="admin-eyebrow">Sarah &amp; Jesus · Private RSVP dashboard</span>
          <h1>Admin sign in</h1>
          <p>Use the email and password for an authorized Supabase Auth administrator. There is no public sign-up.</p>
          {error && <p className="admin-alert" role="alert">{error}</p>}
          <form onSubmit={signIn}>
            <label htmlFor="admin-email">Email<input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            <label htmlFor="admin-password">Password<input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
            <button className="admin-button" disabled={loading} type="submit">{loading ? 'Signing in…' : 'Sign in securely'}</button>
          </form>
        </section>
      </main>
    )
  }

  const editingTotal = editing?.attendance === 'accept' ? 1 + editing.additionalGuests.length : 0

  return (
    <main className="admin-page">
      <header className="admin-header"><div><span className="admin-eyebrow">Sarah &amp; Jesus · Private RSVP dashboard</span><h1>Guest responses</h1></div><div className="admin-header__actions"><span>{session.user.email}</span><button type="button" onClick={signOut}>Sign out</button></div></header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {message && <p className="admin-message" role="status">{message}</p>}

      <section className="admin-stats" aria-label="RSVP totals">
        <article><span>Responses</span><strong>{responses.length}</strong></article>
        <article><span>Joyfully accepting</span><strong>{acceptedResponses}</strong></article>
        <article><span>Total attending</span><strong>{totalHeadcount}</strong></article>
      </section>

      <section className="admin-table-section">
        <div className="admin-section-heading"><div><h2>Submitted replies</h2><p>Only authorized administrators can view or export this information.</p></div><div><button type="button" onClick={loadResponses} disabled={loading}>Refresh</button><button className="admin-button admin-button--outline" type="button" onClick={downloadCsv} disabled={!responses.length}>Export CSV</button></div></div>
        <div className="admin-table-wrap">
          <table>
            <thead><tr><th>Primary guest</th><th>Phone</th><th>Response</th><th>Attending</th><th>Additional guests</th><th>Requests</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && responses.length === 0 && <tr><td colSpan="7" className="admin-empty">No responses are available yet.</td></tr>}
              {responses.map((response) => <tr key={response.id}><td>{response.primary_guest_name}</td><td>{response.phone_number}</td><td>{response.attendance === 'accept' ? 'Joyfully Accepts' : 'Regretfully Declines'}</td><td>{response.total_attending}</td><td>{cleanGuests(response.rsvp_additional_guests).join(', ') || '—'}</td><td>{response.dietary_notes || '—'}</td><td className="admin-row-actions"><button type="button" onClick={() => setEditing(editState(response))}>Edit</button><button type="button" onClick={() => removeResponse(response.id, response.primary_guest_name)}>Remove</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      {editing && <section className="admin-edit"><div className="admin-section-heading"><div><span className="admin-eyebrow">Edit response</span><h2>{editing.primaryGuestName || 'RSVP'}</h2></div><button type="button" onClick={() => setEditing(null)}>Cancel</button></div><form onSubmit={saveEdit}>
        <label>Primary guest full name<input value={editing.primaryGuestName} onChange={(event) => setEditing({ ...editing, primaryGuestName: event.target.value })} required /></label>
        <label>Phone number<input type="tel" value={editing.phoneNumber} onChange={(event) => setEditing({ ...editing, phoneNumber: event.target.value })} required /></label>
        <fieldset className="admin-attendance"><legend>Response</legend><label><input type="radio" checked={editing.attendance === 'accept'} onChange={() => setEditing({ ...editing, attendance: 'accept' })} /> Joyfully Accepts</label><label><input type="radio" checked={editing.attendance === 'decline'} onChange={() => setEditing({ ...editing, attendance: 'decline', additionalGuests: [], dietaryNotes: '' })} /> Regretfully Declines</label></fieldset>
        {editing.attendance === 'accept' && <div className="admin-edit__guests"><p><strong>{editingTotal} attending</strong> · maximum {MAX_TOTAL_GUESTS}</p>{editing.additionalGuests.map((guest, index) => <div className="admin-guest-field" key={guest.id}><input aria-label={`Additional guest ${index + 1} full name`} value={guest.fullName} onChange={(event) => setEditing({ ...editing, additionalGuests: editing.additionalGuests.map((item) => item.id === guest.id ? { ...item, fullName: event.target.value } : item) })} required /><button type="button" onClick={() => setEditing({ ...editing, additionalGuests: editing.additionalGuests.filter((item) => item.id !== guest.id) })}>Remove</button></div>)}<button type="button" disabled={editingTotal >= MAX_TOTAL_GUESTS} onClick={() => setEditing({ ...editing, additionalGuests: [...editing.additionalGuests, createGuest()] })}>+ Add Another Guest</button><label>Dietary restrictions or special requests<textarea value={editing.dietaryNotes} onChange={(event) => setEditing({ ...editing, dietaryNotes: event.target.value })} rows="3" maxLength="1000" /></label></div>}
        <button className="admin-button" disabled={loading} type="submit">Save changes</button>
      </form></section>}
    </main>
  )
}
