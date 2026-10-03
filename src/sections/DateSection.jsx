import { useEffect, useState } from 'react'
import { useLang, months, weekdaysLong } from '../i18n.jsx'
import { wedding } from '../config'
import { day, monthGrid, monthIndex, year, weekdayIndex, timeLeft } from '../lib/date'
import Reveal, { useInView } from '../components/Reveal.jsx'
import SecHead from '../components/SecHead.jsx'

const cells = monthGrid()
const pad = (n) => String(n).padStart(2, '0')

function Countdown() {
  const { t } = useLang()
  const [left, setLeft] = useState(timeLeft)
  useEffect(() => {
    const id = setInterval(() => setLeft(timeLeft()), 1000)
    return () => clearInterval(id)
  }, [])
  if (left.done) return <p className="cd-done">{t.today}</p>
  const items = [
    [left.d, t.days],
    [pad(left.h), t.hours],
    [pad(left.m), t.minutes],
    [pad(left.s), t.seconds],
  ]
  return (
    <div className="countdown">
      {items.map(([v, l]) => (
        <div className="cd-item" key={l}>
          <span className="cd-num">
            {String(v)
              .split('')
              .map((ch, i, arr) => (
                <span className="cd-digit" key={`${arr.length - i}-${ch}`}>
                  {ch}
                </span>
              ))}
          </span>
          <span className="cd-label">{l}</span>
        </div>
      ))}
    </div>
  )
}

export default function DateSection() {
  const { lang, t } = useLang()
  const [calRef, calIn] = useInView({ threshold: 0.35 })

  return (
    <section className="sec sec-date">
      <div className="wrap">
        <SecHead num="02" label={t.dateKicker} />

        <div className="date-hero">
          <Reveal className="dh-num">{day}</Reveal>
          <Reveal className="dh-side" delay={150}>
            <span className="dh-month">
              {months[lang][monthIndex]} {year}
            </span>
            <span className="dh-line">{weekdaysLong[lang][weekdayIndex]}</span>
            <span className="dh-line">{wedding.time}</span>
          </Reveal>
        </div>

        <div className="date-grid">
          <div ref={calRef} className={`cal ${calIn ? 'is-in' : ''}`}>
            <div className="cal-title">
              <span>{months[lang][monthIndex]}</span>
              <span>{year}</span>
            </div>
            <div className="cal-head">
              {t.weekdays.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="cal-grid">
              {cells.map((d, i) => (
                <span key={i} className={`cal-cell ${d === day ? 'is-day' : ''}`} style={{ '--i': i }}>
                  <span>{d}</span>
                </span>
              ))}
            </div>
          </div>

          <Reveal className="cd-wrap" delay={120}>
            <span className="cd-title">{t.countdownKicker}</span>
            <Countdown />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
