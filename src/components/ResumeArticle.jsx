import Section from './Section'
import { ContactIcon } from './icons'

const CONTACT_LINKS = {
  email: 'mailto:s.kurylenko.mail@gmail.com',
  linkedin: 'https://linkedin.com/in/сергій-куриленко-b25a52235',
  phone: 'tel:+380634390602',
  telegram: 'https://t.me/serhii_kurylenko',
}

const ResumeArticle = ({ current, lang, articleRef, hidden = false, registerSection, activeSectionId = '' }) => {
  const sectionState = (id) => ({
    isActive: !hidden && activeSectionId === id,
    isDimmed: !hidden && activeSectionId && activeSectionId !== id,
  })

  return (
    <article
      ref={articleRef}
      className={`resume paper-a4 lang-${lang} lens-enabled${hidden ? ' export-source' : ''}`}
      aria-label={current.sections.ariaLabel}
      aria-hidden={hidden ? 'true' : undefined}
    >
      <header className="header">
        <h1>{current.name}</h1>
        <p className="role">{current.role}</p>
        <div className="contact-grid">
          <span className="contact-item">
            <ContactIcon name="location" />
            <span>{current.contactPrefix}</span>
          </span>
          <a className="contact-item" href={CONTACT_LINKS.email}>
            <ContactIcon name="email" />
            <span>s.kurylenko.mail@gmail.com</span>
          </a>
          <a className="contact-item" href={CONTACT_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            <ContactIcon name="linkedin" />
            <span>linkedin.com/in/сергій-куриленко-b25a52235</span>
          </a>
          <a className="contact-item" href={CONTACT_LINKS.phone}>
            <ContactIcon name="phone" />
            <span>+380 63 439 0602</span>
          </a>
          <a className="contact-item" href={CONTACT_LINKS.telegram} target="_blank" rel="noopener noreferrer">
            <ContactIcon name="telegram" />
            <span>{current.ui.telegramLabel}: @serhii_kurylenko</span>
          </a>
        </div>
      </header>

      <Section domId={hidden ? undefined : 'summary'} title={current.sections.summaryTitle} registerSection={registerSection} {...sectionState('summary')}>
        {current.sections.summary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Section>

      <Section
        domId={hidden ? undefined : 'expertise'}
        title={current.sections.coreSkillsTitle}
        className="expertise-section"
        registerSection={registerSection}
        {...sectionState('expertise')}
      >
        <div className="expertise-grid">
          {current.sections.coreSkills.map((item) => (
            <div className="skill-group" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section domId={hidden ? undefined : 'experience'} title={current.sections.experienceTitle} registerSection={registerSection} {...sectionState('experience')}>
        {current.sections.jobs.map((job) => (
          <section className="job" key={`${job.title}-${job.meta}`}>
            <h3>{job.title}</h3>
            <p className="meta">{job.meta}</p>
            <ul>
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}
      </Section>

      <div className="pdf-bottom-grid">
        <Section domId={hidden ? undefined : 'impact'} title={current.sections.technicalTitle} className="compact-section" registerSection={registerSection} {...sectionState('impact')}>
          <ul>
            {current.sections.technicalBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section domId={hidden ? undefined : 'education'} title={current.sections.educationTitle} className="compact-section education-section" registerSection={registerSection} {...sectionState('education')}>
          <div className="education-list">
            {current.sections.educationEntries.map((item) => (
              <section className="education-item" key={`${item.institution}-${item.period}`}>
                <h3>{item.institution}</h3>
                <p>{item.program}</p>
                <p className="meta">{item.period}</p>
              </section>
            ))}
          </div>
        </Section>

        <Section domId={hidden ? undefined : 'languages'} title={current.sections.languagesTitle} className="compact-section" registerSection={registerSection} {...sectionState('languages')}>
          <ul>
            {current.sections.languageBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      </div>
    </article>
  )
}

export default ResumeArticle
