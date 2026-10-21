export const MAX_TOTAL_GUESTS = 8
export type Attendance = 'accept' | 'decline'

export type ValidRsvp = {
  primaryGuestName: string
  phoneNumber: string
  phoneNumberNormalized: string
  attendance: Attendance
  additionalGuests: string[]
  dietaryNotes: string
}

const nameWhitespace = /\s+/g

export function normalizeName(value: string) {
  return value.trim().replace(nameWhitespace, ' ').toLocaleLowerCase()
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

export function cleanName(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(nameWhitespace, ' ') : ''
}

function isFullName(value: string) {
  const parts = value.split(' ').filter(Boolean)
  return value.length >= 3 && value.length <= 100 && parts.length >= 2
}

export function validateRsvp(input: Record<string, unknown>, options: { checkSpam?: boolean } = {}) : { value?: ValidRsvp; error?: string } {
  const checkSpam = options.checkSpam ?? true
  if (checkSpam && typeof input.website === 'string' && input.website.trim()) return { error: 'Unable to submit this RSVP.' }

  if (checkSpam) {
    const startedAt = Number(input.formStartedAt)
    const elapsed = Date.now() - startedAt
    if (!Number.isFinite(startedAt) || elapsed < 2000 || elapsed > 86_400_000) return { error: 'Please take a moment to complete the RSVP form before submitting.' }
  }

  const primaryGuestName = cleanName(input.primaryGuestName)
  if (!isFullName(primaryGuestName)) return { error: 'Please enter the primary guest’s full name.' }

  const phoneNumber = typeof input.phoneNumber === 'string' ? input.phoneNumber.trim() : ''
  const phoneNumberNormalized = normalizePhone(phoneNumber)
  if (phoneNumberNormalized.length < 7 || phoneNumberNormalized.length > 15) return { error: 'Please enter a valid phone number.' }

  const attendance = input.attendance
  if (attendance !== 'accept' && attendance !== 'decline') return { error: 'Please choose whether you will attend.' }

  if (attendance === 'decline') return { value: { primaryGuestName, phoneNumber, phoneNumberNormalized, attendance, additionalGuests: [], dietaryNotes: '' } }

  const rawAdditional = Array.isArray(input.additionalGuests) ? input.additionalGuests : []
  const additionalGuests = rawAdditional.map(cleanName)
  if (additionalGuests.some((name) => !isFullName(name))) return { error: 'Please enter the full name of each household member or remove the empty field.' }
  if (1 + additionalGuests.length > MAX_TOTAL_GUESTS) return { error: `A single RSVP can include up to ${MAX_TOTAL_GUESTS} guests.` }

  const normalizedNames = [primaryGuestName, ...additionalGuests].map(normalizeName)
  if (new Set(normalizedNames).size !== normalizedNames.length) return { error: 'Each guest can be listed only once on this RSVP.' }

  const dietaryNotes = typeof input.dietaryNotes === 'string' ? input.dietaryNotes.trim() : ''
  if (dietaryNotes.length > 1000) return { error: 'Dietary restrictions and special requests must be 1,000 characters or fewer.' }

  return { value: { primaryGuestName, phoneNumber, phoneNumberNormalized, attendance, additionalGuests, dietaryNotes } }
}
