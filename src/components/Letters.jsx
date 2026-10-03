// So'zni harflarga bo'ladi: har bir harf 3D aylanib chiqadi (--li — tartib raqami)
export default function Letters({ text, start = 0, className = '' }) {
  return (
    <span className={`letters ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span className="lt" key={i} aria-hidden style={{ '--li': start + i }}>
          <span>{ch === ' ' ? ' ' : ch}</span>
        </span>
      ))}
    </span>
  )
}
