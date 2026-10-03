import { useLang } from '../i18n.jsx'
import { wedding } from '../config'
import Reveal, { useInView } from '../components/Reveal.jsx'
import Letters from '../components/Letters.jsx'
import MeshGradient, { DARK } from '../components/MeshGradient.jsx'

export default function Closing() {
  const { lang, t } = useLang()
  const [ref, inView] = useInView({ threshold: 0.35 })
  const bride = wedding.bride[lang]
  const city = wedding.venue.address[lang].split(',').find((p) => /Qarshi|Карши/.test(p))?.replace(/ sh\.$/, '').trim()
  return (
    <section className="closing">
      <MeshGradient colors={DARK} className="mesh-dark" />
      <div className="wrap closing-body">
        <Reveal as="p" className="cl-kicker">
          {t.closingLine}
        </Reveal>
        <h2 ref={ref} className={`cl-names ${inView ? 'is-in' : ''}`} aria-label={`${bride} & ${wedding.groom[lang]}`}>
          <Letters text={bride} className="hn" />
          <span className="cl-amp" aria-hidden>
            &amp;
          </span>
          <Letters text={wedding.groom[lang]} start={bride.length + 2} className="hn hn-2" />
        </h2>
        <Reveal as="p" className="cl-sub" delay={300}>
          {t.closingSub}
        </Reveal>
        <footer className="cl-foot">
          <span>{wedding.date.split('-').reverse().join('.')}</span>
          <span>{city}</span>
        </footer>
      </div>
    </section>
  )
}
