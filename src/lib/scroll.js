// Umumiy scroll holati: Lenis tezligi (velocity) va scroll progress hisoblash
export const scrollState = { velocity: 0 }

// Element ekranda qancha o'tilganini 0..1 oralig'ida qaytaradi (pinned bo'limlar uchun)
export function pinProgress(el) {
  const r = el.getBoundingClientRect()
  const total = r.height - window.innerHeight
  if (total <= 0) return 0
  return Math.min(1, Math.max(0, -r.top / total))
}
