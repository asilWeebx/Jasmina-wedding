import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { wedding } from '../config'
import SecHead from '../components/SecHead.jsx'
import MaskLines from '../components/MaskLines.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Rsvp() {
  const { lang, t } = useLang()
  const [name, setName] = useState('')
  const [attend, setAttend] = useState(true)
  const [guests, setGuests] = useState(1)
  const [state, setState] = useState('idle') // idle | sending | done
  const [err, setErr] = useState('')
  const max = wedding.rsvp.maxGuests

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setErr(t.nameErr)
    setErr('')
    const payload = { name: name.trim(), attend, guests: attend ? guests : 0, lang, at: new Date().toISOString() }
    setState('sending')
    try {
      if (wedding.rsvp.endpoint) {
        await fetch(wedding.rsvp.endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
      } else if (wedding.rsvp.telegram) {
        const user = wedding.rsvp.telegram.replace(/^@/, '')
        const text = encodeURIComponent(t.tgMsg(payload.name, attend, guests))
        window.open(`https://t.me/${user}?text=${text}`, '_blank')
      }
    } catch {}
    setState('done')
  }

  return (
    <section className="sec sec-rsvp">
      <div className="wrap rsvp-grid">
        <div>
          <SecHead num="05" label={t.rsvpKicker} />
          <MaskLines className="h2" lines={[t.rsvpTitle]} />
          <Reveal as="p" className="muted" delay={150}>
            {t.rsvpSub}
          </Reveal>
        </div>
        <Reveal className="rsvp-form" delay={200}>
        {state === 'done' ? (
          <div className="rsvp-thanks">
            <svg viewBox="0 0 52 52" aria-hidden>
              <circle cx="26" cy="26" r="24" pathLength="1" />
              <path d="M15 27 l8 8 l15 -17" pathLength="1" />
            </svg>
            <p>{attend ? t.thanksYes : t.thanksNo}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <label className="field">
              <span>{t.name}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePh} autoComplete="name" />
              {err && <em className="field-err">{err}</em>}
            </label>

            <div className="field">
              <span>{t.attend}</span>
              <div className="choice">
                <button type="button" className={attend ? 'is-on' : ''} onClick={() => setAttend(true)}>
                  {t.yes}
                </button>
                <button type="button" className={!attend ? 'is-on' : ''} onClick={() => setAttend(false)}>
                  {t.no}
                </button>
              </div>
            </div>

            <div className={`field guests ${attend ? '' : 'is-off'}`}>
              <span>{t.guests}</span>
              <div className="stepper">
                <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="−">
                  −
                </button>
                <output>{guests}</output>
                <button type="button" onClick={() => setGuests((g) => Math.min(max, g + 1))} aria-label="+">
                  +
                </button>
              </div>
            </div>

            <button className="btn btn-solid" disabled={state === 'sending'}>
              {state === 'sending' ? t.sending : t.send}
            </button>
          </form>
        )}
        </Reveal>
      </div>
    </section>
  )
}
