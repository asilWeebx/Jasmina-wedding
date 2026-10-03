import { useLang, months } from '../i18n.jsx'
import { wedding } from '../config'
import { day, monthIndex, year } from '../lib/date'
import Reveal from '../components/Reveal.jsx'
import SecHead from '../components/SecHead.jsx'
import MaskLines from '../components/MaskLines.jsx'
import Magnetic from '../components/Magnetic.jsx'

const Arrow = () => (
  <svg viewBox="0 0 12 12" aria-hidden>
    <path d="M3 9 L9 3 M4 3 H9 V8" />
  </svg>
)

export default function Venue() {
  const { lang, t } = useLang()
  const { lat, lng } = wedding.venue
  const google = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  const yandex = wedding.venue.yandexUrl || `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`
  const widget = `https://yandex.uz/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2blm&lang=${lang === 'ru' ? 'ru_RU' : 'uz_UZ'}`

  return (
    <section className="sec sec-venue">
      <div className="wrap">
        <SecHead num="04" label={t.venueKicker} />
        <div className="venue-grid">
          <div>
            <MaskLines className="h2" lines={[wedding.venue.name[lang]]} />
            <Reveal as="p" className="addr" delay={150}>
              {wedding.venue.address[lang]}
            </Reveal>
            <Reveal as="dl" className="facts" delay={220}>
              <div>
                <dt>{t.dateLbl}</dt>
                <dd>
                  {day} {months[lang][monthIndex]} {year}
                </dd>
              </div>
              <div>
                <dt>{t.timeLbl}</dt>
                <dd>{wedding.time}</dd>
              </div>
            </Reveal>
            <Reveal className="actions" delay={300}>
              <Magnetic>
                <a className="btn" href={google} target="_blank" rel="noreferrer">
                  {t.routeGoogle}
                  <Arrow />
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-line" href={yandex} target="_blank" rel="noreferrer">
                  {t.routeYandex}
                  <Arrow />
                </a>
              </Magnetic>
            </Reveal>
          </div>
          <Reveal className="map" delay={100}>
            <iframe title={wedding.venue.name[lang]} src={widget} loading="lazy" allowFullScreen />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
