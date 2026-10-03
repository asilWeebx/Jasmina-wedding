import { useRef } from 'react'

// Sichqoncha yaqinlashganda tugma unga qarab tortiladi
export default function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  const move = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
  }
  const leave = () => {
    ref.current.style.transform = ''
  }
  return (
    <span ref={ref} className="magnetic" onPointerMove={fine ? move : undefined} onPointerLeave={fine ? leave : undefined}>
      {children}
    </span>
  )
}
