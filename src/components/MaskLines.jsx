import { useInView } from './Reveal.jsx'

// Har bir qator "parda" ortidan pastdan ko'tariladi
export default function MaskLines({ as: Tag = 'h2', lines, className = '', delay = 0, step = 110 }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  return (
    <Tag ref={ref} className={`mask-lines ${inView ? 'is-in' : ''} ${className}`}>
      {lines.map((line, i) => (
        <span className="ml" key={i}>
          <span style={{ transitionDelay: `${delay + i * step}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
