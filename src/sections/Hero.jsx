import { useEffect, useRef } from 'react'
import { useLang, months, weekdaysLong } from '../i18n.jsx'
import { wedding } from '../config'
import { day, monthIndex, year, weekdayIndex } from '../lib/date'
import MeshGradient from '../components/MeshGradient.jsx'
import Letters from '../components/Letters.jsx'
import Badge from '../components/Badge.jsx'

// Bosh ekran ekranga "yopishib" turadi (sticky). Scroll qilinganda --hp (0..1)
// o'sadi: ismlar kichrayib, xiralashadi, keyingi bo'lim esa ustidan parda kabi chiqadi.
function useHeroProgress(ref) {
  useEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const hp = Math.min(1, window.scrollY / window.innerHeight)
      el.style.setProperty('--hp', hp.toFixed(3))
      if (hp >= 1) el.dataset.gone = ''
      else delete el.dataset.gone
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
}

export default function Hero() {
  const { lang, t } = useLang()
  const ref = useRef(null)
  useHeroProgress(ref)
  const bride = wedding.bride[lang]
  const groom = wedding.groom[lang]
  const city = wedding.venue.address[lang].split(',').find((p) => /Qarshi|Карши/.test(p))?.replace(/ sh\.$/, '').trim()

  return (
    <section className="hero" ref={ref}>
      <MeshGradient />
      <div className="hero-veil" aria-hidden />

      <div className="hero-body">
        <div className="wrap hero-top">
          <span className="h-label">{t.heroKicker}</span>
          <span className="h-rule" />
          <span className="h-label">{wedding.date.split('-').reverse().join('.')}</span>
        </div>


        <h1 className="wrap hero-names" aria-label={`${bride} & ${groom}`}>
          <Letters text={bride} className="hn hn-1" />
          <span className="hn-amp" aria-hidden>
            <span className="amp-glyph">&amp;</span>
            <span className="amp-line" />
            <Badge className="hero-badge" text={`${bride} · ${groom} · ${wedding.date.split('-').reverse().join('.')} · `.toUpperCase()} />
          </span>
          <Letters text={groom} start={bride.length + 2} className="hn hn-2" />
        </h1>

        <div className="wrap hero-meta">
          <div>
            <span className="m-lbl">{t.dateLbl}</span>
            <span className="m-val">
              {day} {months[lang][monthIndex]} {year}
            </span>
          </div>
          <div>
            <span className="m-lbl">{t.dayLbl}</span>
            <span className="m-val">
              {weekdaysLong[lang][weekdayIndex]}, {wedding.time}
            </span>
          </div>
          <div>
            <span className="m-lbl">{t.placeLbl}</span>
            <span className="m-val">
              {wedding.venue.name[lang]}
              {city ? `, ${city}` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden>
        <span>{t.scroll}</span>
        <i />
      </div>
    </section>
  )
}
