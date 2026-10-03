import { useEffect, useState } from 'react'
import { useLang } from '../i18n.jsx'
import { wedding } from '../config'

// audioRef — App ichidagi <audio>. Musiqa «Ochish» bosilganda App'da boshlanadi
// (iOS Safari faqat foydalanuvchi bosgan paytda ijroga ruxsat beradi).
export default function Controls({ visible, audioRef }) {
  const { lang, setLang, t } = useLang()
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(Boolean(wedding.music))

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const on = () => setPlaying(true)
    const off = () => setPlaying(false)
    const fail = () => setAvailable(false)
    a.addEventListener('play', on)
    a.addEventListener('pause', off)
    a.addEventListener('error', fail)
    if (a.error) fail()
    return () => {
      a.removeEventListener('play', on)
      a.removeEventListener('pause', off)
      a.removeEventListener('error', fail)
    }
  }, [audioRef])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }

  return (
    <div className={`controls ${visible ? 'is-visible' : ''}`}>
      <div className="lang-switch" role="group" aria-label="Til">
        {['uz', 'ru'].map((l) => (
          <button key={l} className={lang === l ? 'is-active' : ''} onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      {available && (
        <button className={`music-btn ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-label={t.music}>
          <span /><span /><span /><span />
        </button>
      )}
    </div>
  )
}
