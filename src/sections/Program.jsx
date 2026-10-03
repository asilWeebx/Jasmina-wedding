import { useEffect, useRef } from 'react'
import { useLang } from '../i18n.jsx'
import { wedding } from '../config'
import SecHead from '../components/SecHead.jsx'
import MaskLines from '../components/MaskLines.jsx'
import MeshGradient, { DARK } from '../components/MeshGradient.jsx'

// Kun tartibi — oddiy scroll. Har bir qator ekranga kirganda paydo bo'ladi va
// yonidagi kichik soatning millari o'sha vaqtga aylanadi. Chapdagi chiziq
// pastga tushgan sari to'ladi.

function MiniClock({ time }) {
  const [h, m] = time.split(':').map(Number)
  const hour = ((h % 12) + m / 60) * 30
  const minute = m * 6
  return (
    <svg className="mclock" viewBox="0 0 60 60" style={{ '--ha': `${hour + 360}deg`, '--ma': `${minute + 720}deg` }} aria-hidden>
      <circle cx="30" cy="30" r="28" className="mc-face" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="30" y1="4.5" x2="30" y2={i % 3 ? 7 : 9} transform={`rotate(${i * 30} 30 30)`} className="mc-tick" />
      ))}
      <line x1="30" y1="30" x2="30" y2="15" className="mc-h" />
      <line x1="30" y1="30" x2="30" y2="9" className="mc-m" />
      <circle cx="30" cy="30" r="2" className="mc-pin" />
    </svg>
  )
}

export default function Program() {
  const { lang, t } = useLang()
  const list = useRef(null)
  const rows = useRef([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.45 }
    )
    rows.current.forEach((r) => r && io.observe(r))

    let raf = 0
    const update = () => {
      raf = 0
      const r = list.current.getBoundingClientRect()
      const mark = window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, (mark - r.top) / r.height))
      list.current.style.setProperty('--tp', p.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="agenda-sec">
      <MeshGradient colors={DARK} className="mesh-dark" />
      <div className="wrap agenda-wrap">
        <SecHead num="03" label={t.programKicker} />
        <MaskLines className="h2" lines={[t.programTitle]} />

        <ol className="agenda2" ref={list}>
          <span className="ag2-line" aria-hidden>
            <i />
          </span>
          {wedding.timeline.map((item, i) => (
            <li key={i} ref={(el) => (rows.current[i] = el)}>
              <MiniClock time={item.time} />
              <div className="ag2-body">
                <span className="ag2-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="ag2-time">{item.time}</span>
                <span className="ag2-title">{item.title[lang]}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
