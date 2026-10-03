import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Oltin varaqlar (sus'al tilla): burst(x, y, n) chaqirilganda nuqtadan portlab
// chiqadi, 3D'da aylanadi (burilganda yaltiraydi), havoda tebranib pastga tushadi.
const GoldLeaf = forwardRef(function GoldLeaf(_, ref) {
  const canvas = useRef(null)
  const parts = useRef([])
  const raf = useRef(0)

  const loop = () => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    const w = c.clientWidth
    const h = c.clientHeight
    ctx.clearRect(0, 0, w, h)
    const ps = parts.current
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i]
      p.t += 1
      // havo qarshiligi + tebranish + og'irlik
      p.vx = p.vx * 0.965 + Math.sin(p.t * p.fq + p.ph) * 0.06
      p.vy = Math.min(p.vy * 0.965 + 0.045, 1.5)
      p.x += p.vx
      p.y += p.vy
      p.rx += p.vrx
      p.rz += p.vrz
      if (p.y > h + 30 || p.t > 900) {
        ps.splice(i, 1)
        continue
      }
      const flip = Math.cos(p.rx)
      const light = Math.abs(flip)
      const fade = Math.min(1, p.t / 6) * (p.t > 700 ? Math.max(0, 1 - (p.t - 700) / 200) : 1)
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rz)
      ctx.scale(1, Math.max(0.08, light) * Math.sign(flip || 1))
      // Rang: burilish burchagiga qarab to'q oltindan yorqin oltingacha
      const r = Math.round(150 + 100 * light)
      const g = Math.round(112 + 110 * light)
      const b = Math.round(55 + 120 * light * light)
      ctx.globalAlpha = fade
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.beginPath()
      const s = p.s
      ctx.moveTo(-s * p.k[0], -s * 0.6)
      ctx.lineTo(s * p.k[1], -s * 0.5)
      ctx.lineTo(s * p.k[2], s * 0.6)
      ctx.lineTo(-s * p.k[3], s * 0.5)
      ctx.closePath()
      ctx.fill()
      if (light > 0.92) {
        ctx.globalAlpha = fade * (light - 0.92) * 9
        ctx.fillStyle = '#fffaf0'
        ctx.fill()
      }
      ctx.restore()
    }
    raf.current = ps.length ? requestAnimationFrame(loop) : 0
  }

  useImperativeHandle(ref, () => ({
    burst(x, y, n = 140, power = 1, size = 1) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const c = canvas.current
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (c.width !== c.clientWidth * dpr) {
        c.width = c.clientWidth * dpr
        c.height = c.clientHeight * dpr
        c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      const count = window.innerWidth < 600 ? Math.round(n * 0.7) : n
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = (2 + Math.random() * 9) * power
        parts.current.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 4 * power,
          s: (3 + Math.random() * 7) * size,
          k: [0.6 + Math.random() * 0.5, 0.6 + Math.random() * 0.5, 0.6 + Math.random() * 0.5, 0.6 + Math.random() * 0.5],
          rx: Math.random() * Math.PI,
          vrx: 0.08 + Math.random() * 0.2,
          rz: Math.random() * Math.PI,
          vrz: (Math.random() - 0.5) * 0.12,
          fq: 0.03 + Math.random() * 0.04,
          ph: Math.random() * 6,
          t: 0,
        })
      }
      if (!raf.current) raf.current = requestAnimationFrame(loop)
    },
  }))

  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return <canvas ref={canvas} className="gold-leaf" aria-hidden />
})

export default GoldLeaf
