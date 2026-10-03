import { useEffect, useRef, useState } from 'react'
import { wedding } from './config'
import Intro from './components/Intro.jsx'
import Controls from './components/Controls.jsx'
import Hero from './sections/Hero.jsx'
import Invitation from './sections/Invitation.jsx'
import DateSection from './sections/DateSection.jsx'
import Program from './sections/Program.jsx'
import Venue from './sections/Venue.jsx'
import Rsvp from './sections/Rsvp.jsx'
import Closing from './sections/Closing.jsx'
import Marquee from './components/Marquee.jsx'
import Cursor from './components/Cursor.jsx'
import GoldLeaf from './components/GoldLeaf.jsx'
import Lenis from 'lenis'
import { scrollState } from './lib/scroll'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [introGone, setIntroGone] = useState(false)
  const audio = useRef(null)
  const leaf = useRef(null)

  const startMusic = () => {
    const a = audio.current
    if (a && !a.error) {
      a.currentTime = wedding.musicStart || 0
      a.volume = 0
      a.play().catch(() => {})
      // Ovozni sekin, 3 soniyada balandlatish
      const t0 = performance.now()
      const fade = (now) => {
        const p = Math.min(1, Math.max(0, (now - t0) / 3000))
        a.volume = p * 0.8
        if (p < 1) requestAnimationFrame(fade)
      }
      requestAnimationFrame(fade)
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !introGone)
  }, [introGone])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Inersiyali silliq scroll — taklifnoma ochilgandan keyin yoqiladi
  useEffect(() => {
    if (!introGone || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
    lenis.on('scroll', (l) => (scrollState.velocity = l.velocity))
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      e.preventDefault()
      lenis.scrollTo(a.getAttribute('href'), { duration: 1.6 })
    }
    document.addEventListener('click', onAnchor)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onAnchor)
      lenis.destroy()
    }
  }, [introGone])

  return (
    <div className={`app ${opened ? 'is-opened' : ''}`}>
      <Hero />
      <main className="curtain">
        <Invitation />
        <Marquee text={`${wedding.bride.uz} & ${wedding.groom.uz} · 27.10.2026`} />
        <DateSection />
        <Program />
        <Venue />
        <Rsvp />
        <Closing />
      </main>
      {wedding.music && <audio ref={audio} src={wedding.music} loop preload="auto" playsInline />}
      <GoldLeaf ref={leaf} />
      <Cursor />
      <Controls visible audioRef={audio} />
      {!introGone && <Intro leaf={leaf} onFirstTap={startMusic} onOpen={() => setOpened(true)} onDone={() => setIntroGone(true)} />}
    </div>
  )
}
