import { useEffect, useState } from 'react'

function getTimeRemaining(target) {
  const distance = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
    complete: distance === 0,
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
