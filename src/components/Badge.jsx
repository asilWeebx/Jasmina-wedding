import { useEffect, useRef } from 'react'
import { scrollState } from '../lib/scroll'

// Aylanuvchi yozuvli muhr: sekin aylanadi, scroll tezligi bilan tezlashadi
export default function Badge({ text, center = '&', className = '', id = 'badge-path' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let a = 0
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(50, now - last)
      last = now
      a += dt * (0.012 + Math.min(0.5, Math.abs(scrollState.velocity) * 0.02)) * (scrollState.velocity < -0.5 ? -1 : 1)
      if (ref.current) ref.current.style.transform = `rotate(${a}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className={`badge ${className}`} aria-hidden>
      <svg ref={ref} viewBox="0 0 100 100">
        <defs>
          <path id={id} d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="250" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="badge-center">{center}</span>
    </div>
  )
}
