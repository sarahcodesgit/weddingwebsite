import { useEffect, useState } from 'react'

const HOUSTON_TIME_ZONE = 'America/Chicago'
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: HOUSTON_TIME_ZONE,
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
})

function houstonParts(date) {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, Number(value)]),
  )
  return {
    year: parts.year, month: parts.month, day: parts.day,
    hour: parts.hour, minute: parts.minute, second: parts.second,
  }
}

function getTimeRemaining(target) {
  const end = new Date(target)
  const now = new Date()
  if (now >= end) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, complete: true }

  const current = houstonParts(now)
  const finish = houstonParts(end)
  const currentWallTime = Date.UTC(current.year, current.month - 1, current.day, current.hour, current.minute, current.second)
  const targetWallTime = Date.UTC(finish.year, finish.month - 1, finish.day, finish.hour, finish.minute, finish.second)

  // Count whole calendar months, then break down the remaining interval.
  let months = (finish.year - current.year) * 12 + finish.month - current.month
  const addMonths = (count) => {
    const monthIndex = current.month - 1 + count
    const year = current.year + Math.floor(monthIndex / 12)
    const month = ((monthIndex % 12) + 12) % 12
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    return Date.UTC(year, month, Math.min(current.day, lastDay), current.hour, current.minute, current.second)
  }
  while (months > 0 && addMonths(months) > targetWallTime) months--
  const remainder = targetWallTime - addMonths(months)

  return {
    months,
    days: Math.floor(remainder / 86400000),
    hours: Math.floor((remainder / 3600000) % 24),
    minutes: Math.floor((remainder / 60000) % 60),
    seconds: Math.floor((remainder / 1000) % 60),
    complete: false,
  }
}

export default function Countdown({ target }) {
  const [time, setTime] = useState(() => getTimeRemaining(target))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTimeRemaining(target)), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  if (time.complete) {
    return <p className="countdown__celebration" role="status">Today, we celebrate.</p>
  }

  const parts = [
    ['Months', time.months],
    ['Days', time.days],
    ['Hours', time.hours],
    ['Minutes', time.minutes],
    ['Seconds', time.seconds],
  ]

  return (
    <div className="countdown" aria-label="Countdown to the wedding day">
      {parts.map(([label, value]) => (
        <div className="countdown__unit" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
