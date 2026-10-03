import { useLang } from '../i18n.jsx'
import { wedding } from '../config'
import Reveal from '../components/Reveal.jsx'
import ScrollText from '../components/ScrollText.jsx'
import SecHead from '../components/SecHead.jsx'

export default function Invitation() {
  const { lang, t } = useLang()
  return (
    <section className="sec sec-invite" id="invite">
      <div className="wrap">
        <SecHead num="01" label={t.secInvite} />
        <div className="inv-grid">
          <ScrollText className="statement" text={t.inviteText} />
          <div className="inv-side">
            <Reveal as="p" className="body-lg">
              {t.inviteText2}
            </Reveal>
            <Reveal as="dl" className="couple" delay={120}>
              <div>
                <dt>{t.brideLbl}</dt>
                <dd>
                  {wedding.bride[lang]} {wedding.bride.surname[lang]}
                </dd>
              </div>
              <div>
                <dt>{t.groomLbl}</dt>
                <dd>
                  {wedding.groom[lang]} {wedding.groom.surname[lang]}
                </dd>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal as="blockquote" className="ayah">
          <p>{t.ayah}</p>
          <cite>{t.ayahSrc}</cite>
        </Reveal>
      </div>
    </section>
  )
}
