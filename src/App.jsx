import './App.css'
import { useEffect, useRef, useState } from 'react'
import { cvContent, defaultLanguage } from './data/cvContent'
import { exportDocx, exportStyledPdf } from './utils/exportResume'

const LANGUAGE_STORAGE_KEY = 'cv-language'

const ToolbarIcon = ({ name }) => {
  const icons = {
    globe: <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18Zm6.92 8h-3.1a15.7 15.7 0 0 0-1.15-4.35A7.03 7.03 0 0 1 18.92 11ZM12 5.08c.7.92 1.75 2.92 2.18 5.92H9.82C10.25 8 11.3 6 12 5.08ZM9.33 6.65A15.7 15.7 0 0 0 8.18 11h-3.1a7.03 7.03 0 0 1 4.25-4.35ZM5.08 13h3.1c.16 1.56.56 3.04 1.15 4.35A7.03 7.03 0 0 1 5.08 13ZM12 18.92c-.7-.92-1.75-2.92-2.18-5.92h4.36c-.43 3-1.48 5-2.18 5.92Zm2.67-1.57c.59-1.31.99-2.79 1.15-4.35h3.1a7.03 7.03 0 0 1-4.25 4.35Z" />,
    file: <path d="M7 3.75A1.75 1.75 0 0 1 8.75 2h5.94c.46 0 .9.18 1.23.5l3.58 3.58c.32.33.5.77.5 1.23v10.94A1.75 1.75 0 0 1 18.25 20h-9.5A1.75 1.75 0 0 1 7 18.25V3.75Zm7 .75v2.75c0 .41.34.75.75.75h2.75L14 4.5ZM9.75 11a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" />,
    chevron: <path d="M7.47 9.97a.75.75 0 0 1 1.06 0L12 13.44l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06Z" />,
    export: <path d="M12 3.75a.75.75 0 0 1 .75.75v7.69l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l2.72 2.72V4.5a.75.75 0 0 1 .75-.75ZM5 18.25c0-.41.34-.75.75-.75h12.5a.75.75 0 0 1 0 1.5H5.75a.75.75 0 0 1-.75-.75Z" />,
  }

  return (
    <svg className="toolbar-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

const Section = ({ title, children, className = '' }) => (
  <section className={`section ${className}`.trim()}>
    <h2>{title}</h2>
    {children}
  </section>
)

const ContactIcon = ({ name }) => {
  const icons = {
    location: (
      <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    ),
    email: (
      <path d="M4 7.25A2.25 2.25 0 0 1 6.25 5h11.5A2.25 2.25 0 0 1 20 7.25v9.5A2.25 2.25 0 0 1 17.75 19H6.25A2.25 2.25 0 0 1 4 16.75v-9.5Zm1.8-.45 6.2 4.65 6.2-4.65H5.8Zm12.7 1.25-5.9 4.43a1 1 0 0 1-1.2 0L5.5 8.05v8.7c0 .41.34.75.75.75h11.5c.41 0 .75-.34.75-.75v-8.7Z" />
    ),
    linkedin: (
      <path d="M6.5 8.5A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3.5ZM5 10h3v9H5v-9Zm5 0h2.9v1.3h.04c.4-.77 1.38-1.58 2.85-1.58 3.05 0 3.61 2 3.61 4.61V19h-3v-4.1c0-.98-.02-2.24-1.36-2.24-1.36 0-1.57 1.06-1.57 2.17V19h-3v-9Z" />
    ),
    phone: (
      <path d="M7.2 4h3.1l1 4.1-1.9 1.9a14 14 0 0 0 4.7 4.7l1.9-1.9L20 13.8V17a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 5 6.2 2 2 0 0 1 7.2 4Z" />
    ),
    telegram: (
      <path d="M20.7 4.3 17.9 18c-.2 1-.8 1.2-1.6.8l-4.4-3.2-2.1 2c-.2.2-.4.4-.8.4l.3-4.5 8.3-7.5c.4-.3-.1-.5-.5-.2L6.9 12.2 2.5 10.8c-.9-.3-.9-.9.2-1.3L19.1 3c.8-.3 1.8.2 1.6 1.3Z" />
    ),
  }

  return (
    <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return defaultLanguage
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return stored && cvContent[stored] ? stored : defaultLanguage
}

const setMetaTag = (name, content, attribute = 'name') => {
  const element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (element) {
    element.setAttribute('content', content)
  }
}

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const resumeRef = useRef(null)

  const current = cvContent[lang] ?? cvContent[defaultLanguage]

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    document.documentElement.lang = lang
    document.title = current.ui.seoTitle
    setMetaTag('description', current.ui.seoDescription)
    setMetaTag('og:title', current.ui.seoTitle, 'property')
    setMetaTag('og:description', current.ui.seoDescription, 'property')
    setMetaTag('twitter:title', current.ui.seoTitle)
    setMetaTag('twitter:description', current.ui.seoDescription)
  }, [current, lang])

  const handleExportResume = async () => {
    if (isExporting) return

    setIsExporting(true)
    try {
      if (exportFormat === 'pdf') {
        if (!resumeRef.current) return
        await exportStyledPdf({
          sourceNode: resumeRef.current,
          current,
          lang,
        })
        return
      }

      await exportDocx({ current, lang })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="page">
      <div className="actions">
        <label className="sr-only" htmlFor="lang-select">
          {current.ui.language}
        </label>
        <div className="select-shell">
          <span className="select-icon">
            <ToolbarIcon name="globe" />
          </span>
          <select
            id="lang-select"
            className="paper-select"
            value={lang}
            onChange={(event) => setLang(event.target.value)}
          >
            <option value="uk">{current.ui.langUa}</option>
            <option value="en">{current.ui.langEn}</option>
          </select>
          <span className="select-chevron">
            <ToolbarIcon name="chevron" />
          </span>
        </div>

        <label className="sr-only" htmlFor="export-format-select">
          {current.ui.exportType}
        </label>
        <div className="select-shell">
          <span className="select-icon">
            <ToolbarIcon name="file" />
          </span>
          <select
            id="export-format-select"
            className="paper-select"
            value={exportFormat}
            onChange={(event) => setExportFormat(event.target.value)}
          >
            <option value="pdf">{current.ui.exportPdf}</option>
            <option value="docx">{current.ui.exportDocx}</option>
          </select>
          <span className="select-chevron">
            <ToolbarIcon name="chevron" />
          </span>
        </div>

        <button className="print-btn action-button" type="button" onClick={handleExportResume} disabled={isExporting}>
          <ToolbarIcon name="export" />
          <span>{isExporting ? current.ui.exporting : current.ui.download}</span>
        </button>
      </div>

      <article
        ref={resumeRef}
        className={`resume paper-a4 lang-${lang}`}
        aria-label={current.sections.ariaLabel}
      >
        <header className="header">
          <h1>{current.name}</h1>
          <p className="role">{current.role}</p>
          <div className="contact-grid">
            <span className="contact-item">
              <ContactIcon name="location" />
              <span>{current.contactPrefix}</span>
            </span>
            <a className="contact-item" href="mailto:s.kurylenko.mail@gmail.com">
              <ContactIcon name="email" />
              <span>s.kurylenko.mail@gmail.com</span>
            </a>
            <a
              className="contact-item"
              href="https://linkedin.com/in/сергій-куриленко-b25a52235"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactIcon name="linkedin" />
              <span>linkedin.com/in/сергій-куриленко-b25a52235</span>
            </a>
            <a className="contact-item" href="tel:+380634390602">
              <ContactIcon name="phone" />
              <span>+380 63 439 0602</span>
            </a>
            <a
              className="contact-item"
              href="https://t.me/serhii_kurylenko"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactIcon name="telegram" />
              <span>{current.ui.telegramLabel}: @serhii_kurylenko</span>
            </a>
          </div>
        </header>

        <Section title={current.sections.summaryTitle}>
          {current.sections.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>

        <Section title={current.sections.coreSkillsTitle} className="expertise-section">
          <div className="expertise-grid">
            {current.sections.coreSkills.map((item) => (
              <div className="skill-group" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title={current.sections.experienceTitle}>
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
          <Section title={current.sections.technicalTitle} className="compact-section">
            <ul>
              {current.sections.technicalBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={current.sections.testingApproachTitle} className="compact-section">
            <ul>
              {current.sections.testingApproachBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={current.sections.domainExperienceTitle} className="compact-section">
            <ul>
              {current.sections.domainExperienceBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={current.sections.languagesTitle} className="compact-section">
            <ul>
              {current.sections.languageBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        </div>
      </article>
    </div>
  )
}
