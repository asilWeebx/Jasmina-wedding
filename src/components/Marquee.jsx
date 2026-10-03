import { useEffect, useRef } from 'react'
import { scrollState } from '../lib/scroll'

// Lenta: doimiy sekin suzadi, scroll tezligiga qarab tezlashadi va qiyshayadi
export default function Marquee({ text }) {
  const track = useRef(null)
  useEffect(() => {
    const el = track.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let x = 0
    let skew = 0
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(50, now - last)
      last = now
      const v = scrollState.velocity
      x -= (0.04 + Math.min(1.2, Math.abs(v) * 0.04)) * dt * (v < -0.5 ? -1 : 1)
      const half = el.scrollWidth / 2
      if (x <= -half) x += half
      if (x > 0) x -= half
      skew += (Math.max(-12, Math.min(12, v * 0.6)) - skew) * 0.12
      el.style.transform = `translate3d(${x}px,0,0) skewX(${-skew}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const row = (k) => (
    <div className="mq-row" key={k} aria-hidden={k > 0}>
      {[0, 1, 2, 3].map((i) => (
        <span className="mq-item" key={i}>
          {text}
          <span className="mq-sep">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="marquee">
      <div className="mq-track" ref={track}>
        {[0, 1].map(row)}
      </div>
    </div>
  )
}
