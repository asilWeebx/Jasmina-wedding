import { useInView } from './Reveal.jsx'

// Raqamlangan bo'lim sarlavhasi: 01 — TAKLIF ———————
export default function SecHead({ num, label }) {
  const [ref, inView] = useInView({ threshold: 0.6 })
  return (
    <header ref={ref} className={`sec-head ${inView ? 'is-in' : ''}`}>
      <span className="sh-num">{num}</span>
      <span className="sh-label">{label}</span>
      <span className="sh-rule" />
    </header>
  )
}
