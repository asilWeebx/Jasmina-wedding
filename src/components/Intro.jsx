import { useEffect, useRef, useState } from 'react'
import { useLang, weekdaysLong } from '../i18n.jsx'
import { wedding } from '../config'
import { weekdayIndex } from '../lib/date'
import MeshGradient from './MeshGradient.jsx'
import Letters from './Letters.jsx'
import Badge from './Badge.jsx'

// Kino-titr sahnasi vaqtlari (ms)
const CINE = { reveal: 4700, open: 4400, done: 5900 }

// Muqova — ikkala qanotda bir xil chiziladi, har biri o'z yarmini ko'rsatadi.
// Ismlar harfma-harf 3D chiqadi; sana pastdagi aylanuvchi muhrda.
function Cover({ lang, t, city }) {
  const bride = wedding.bride[lang]
  return (
    <div className="cover">
      <span className="cv-frame" />
      <span className="cv-top">{t.cardKicker}</span>
      <div className="cv-names">
        <Letters text={bride} />
        <i>&amp;</i>
        <Letters text={wedding.groom[lang]} start={bride.length + 1} />
      </div>
      {city && <span className="cv-place">{city}</span>}
      <span className="card-glare" aria-hidden />
    </div>
  )
}

// Karta orqasida ikki qatorda qarama-qarshi suzuvchi ulkan kontur yozuv
function BackdropType({ text }) {
  const row = (dir) => (
    <div className={`bt-row bt-${dir}`}>
      {[0, 1].map((k) => (
        <span key={k}>
          {text} <i>✦</i> {text} <i>✦</i>{' '}
        </span>
      ))}
    </div>
  )
  return (
    <div className="backdrop-type" aria-hidden>
      {row('l')}
      {row('r')}
    </div>
  )
}

// Ikki qanotli taklifnoma. Bosilganda muhr uchib ketadi, qanotlar ochiladi va
// ichki sahifa paydo bo'ladi. «Ko'rish» bosilganda karta kattalashib, sayt ochiladi.
export default function Intro({ onFirstTap, onOpen, onDone, leaf }) {
  const { lang, t } = useLang()
  const [phase, setPhase] = useState('idle') // idle | open | enter
  const [ready, setReady] = useState(false)
  const [reveal, setReveal] = useState(false)
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const cardRef = useRef(null)
  const rootRef = useRef(null)
  const sealRef = useRef(null)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const openCard = () => {
    if (phase !== 'idle') return
    setPhase('open')
    onFirstTap?.()
    // Muhr turgan joydan oltin varaqlar portlaydi
    const r = sealRef.current?.getBoundingClientRect()
    if (r) leaf.current?.burst(r.left + r.width / 2, r.top + r.height / 2, 90, 0.5, 0.32)
    setTimeout(() => setReady(true), reduce ? 0 : 3800)
  }

  // Kino-titr: pardalar yopiladi → titrlar → pardalar ochilib sayt chiqadi
  const finish = () => {
    timers.current.forEach(clearTimeout)
    setReveal(true)
    onOpen?.()
    timers.current = [setTimeout(() => onDone?.(), 1300)]
  }
  const enter = (e) => {
    e.stopPropagation()
    if (phase !== 'open' || !ready) return
    setPhase('enter')
    if (reduce) {
      onOpen?.()
      onDone?.()
      return
    }
    const later = (ms, fn) => timers.current.push(setTimeout(fn, ms))
    later(1300, () => leaf.current?.burst(window.innerWidth / 2, window.innerHeight / 2, 60, 0.35, 0.25))
    later(CINE.open, () => onOpen?.())
    later(CINE.reveal, () => setReveal(true))
    later(CINE.done, () => onDone?.())
  }
  const skip = (e) => {
    e.stopPropagation()
    if (phase === 'enter' && !reveal) finish()
  }

  const onMove = (e) => {
    const el = cardRef.current
    if (!el || reduce) return
    el.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
    el.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
  }

  const bride = wedding.bride[lang]
  const groom = wedding.groom[lang]
  const date = wedding.date.split('-').reverse().join('.')
  const city = wedding.venue.address[lang].split(',').find((p) => /Qarshi|Карши/.test(p))?.replace(/ sh\.$/, '').trim()

  return (
    <div ref={rootRef} className={`intro phase-${phase} ${ready ? 'is-ready' : ''} ${reveal ? 'is-reveal' : ''}`} onClick={openCard} onPointerMove={onMove}>
      <span className="iris-ring" aria-hidden />
      <MeshGradient />
      <BackdropType text={`${bride} & ${groom}`} />
      <span className="open-rays" aria-hidden />
      <div className="scene">
        <span className="card-shadow" aria-hidden />
        <div className="card" ref={cardRef}>
          <div className="card-inner">
            <span className="ci-frame" />
            <div className="ci-content">
              <p className="ic ic-1 ci-bism" lang="ar" dir="rtl">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="ic ic-2 ci-kicker">{t.cardKicker}</p>
              <div className="ci-names">
                <Letters text={bride} />
                <span className="ic ic-4 ci-amp">&amp;</span>
                <Letters text={groom} start={bride.length + 1} />
              </div>
              <p className="ic ic-5 ci-text">{t.cardText}</p>
              <div className="ic ic-6 ci-meta">
                <span>{weekdaysLong[lang][weekdayIndex]}</span>
                <strong>{date}</strong>
                <span>{wedding.time}</span>
              </div>
              <p className="ic ic-7 ci-venue">
                {wedding.venue.name[lang]}
                {city ? ` · ${city}` : ''}
              </p>
              <button className="ic ic-8 enter-btn" onClick={enter} tabIndex={ready ? 0 : -1}>
                <span>{t.enter}</span>
                <svg viewBox="0 0 14 10" aria-hidden>
                  <path d="M0 5 H12.5 M8.5 1 L12.5 5 L8.5 9" />
                </svg>
              </button>
            </div>
            <span className="inner-shade" />
            <span className="inner-sweep" />
          </div>

          {['l', 'r'].map((side) => (
            <div key={side} className={`flap flap-${side}`}>
              <div className="face face-front">
                <Cover lang={lang} t={t} city={city} />
              </div>
              <div className="face face-back">
                <span className="lining">
                  <span className="lining-name">{side === 'l' ? bride : groom}</span>
                </span>
              </div>
            </div>
          ))}

          <span className="open-ripple" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <button ref={sealRef} className="intro-seal" onClick={(e) => (e.stopPropagation(), openCard())} aria-label={t.introOpen}>
            <Badge id="seal-path" text={`${date} · ${t.heroKicker} · `.toUpperCase()} center={`${bride[0]}&${groom[0]}`} />
          </button>
        </div>
        <div className="intro-hint">{t.introHint}</div>
      </div>
      <span className="open-flash" aria-hidden />
      {phase === 'enter' && (
        <div className="cine" onClick={skip}>
          <span className="bar bar-t" />
          <span className="bar bar-b" />
          <div className="cine-stage">
            <span className="ct ct-date">{wedding.date.split('-').reverse().join(' · ')}</span>
            <span className="ct ct-name ct-1">{bride}</span>
            <span className="ct ct-mid">
              <i />
              <b>&amp;</b>
              <i />
            </span>
            <span className="ct ct-name ct-2">{groom}</span>
            <span className="ct ct-place">
              {wedding.venue.name[lang]}
              {city ? ` · ${city}` : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
