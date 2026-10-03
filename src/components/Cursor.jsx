import { useEffect, useRef } from 'react'

// Kompyuter uchun maxsus kursor: nuqta + kechikib ergashuvchi halqa.
// Havola va tugmalar ustida halqa kattalashadi.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      const hot = e.target.closest('a, button, input, iframe, [data-hot]')
      ring.current?.classList.toggle('is-hot', !!hot)
    }
    const tick = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])
  return (
    <>
      <span ref={ring} className="cursor-ring" aria-hidden>
        <i />
      </span>
      <span ref={dot} className="cursor-dot" aria-hidden />
    </>
  )
}
