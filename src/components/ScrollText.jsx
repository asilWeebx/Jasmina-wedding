import { useEffect, useRef } from 'react'

// Matn scroll bilan so'zma-so'z "yonadi": xira so'zlar o'qilgan sari tiniqlashadi.
// --p (0..1) elementning ekrandagi o'rniga qarab hisoblanadi.
export default function ScrollText({ as: Tag = 'p', text, className = '' }) {
  const ref = useRef(null)
  const words = text.split(' ')

  useEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1')
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.92
      const end = vh * 0.45
      const p = (start - r.top) / (start - end + r.height * 0.6)
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [text])

  return (
    <Tag ref={ref} className={`scroll-text ${className}`} style={{ '--n': words.length }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="st-w" style={{ '--i': i }} aria-hidden>
          {w}{' '}
        </span>
      ))}
    </Tag>
  )
}
