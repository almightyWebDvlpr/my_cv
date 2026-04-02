import './App.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cvContent, defaultLanguage } from './data/cvContent'
import { exportDocx, exportStyledPdf } from './utils/exportResume'

const LANGUAGE_STORAGE_KEY = 'cv-language'
const OWNER_MODE_STORAGE_KEY = 'cv-owner-mode'
const ANALYTICS_STORAGE_KEY = 'cv-goatcounter-total'
const GOATCOUNTER_CODE = import.meta.env.VITE_GOATCOUNTER_CODE?.trim() ?? ''
const GOATCOUNTER_ENDPOINT = GOATCOUNTER_CODE ? `https://${GOATCOUNTER_CODE}.goatcounter.com` : ''
const GOATCOUNTER_JSON_URL = GOATCOUNTER_ENDPOINT ? `${GOATCOUNTER_ENDPOINT}/counter/TOTAL.json?no_branding=1` : ''
const GOATCOUNTER_SCRIPT_URL = 'https://gc.zgo.at/count.js'

const ENGINE_UI = {
  en: {
    language: 'Language',
    quickExport: 'Quick export',
    progress: 'Reading progress',
    jumpTo: 'Jump to section',
    analytics: 'Global visits',
    analyticsPending: 'Loading…',
    analyticsUnavailable: 'Connect GoatCounter',
    analyticsLive: 'Live total pageviews',
    analyticsFallback: 'Waiting for GoatCounter',
    share: 'Share',
    shareReady: 'Shared',
    shareCopied: 'Link copied',
  },
  uk: {
    language: 'Мова',
    quickExport: 'Експорт',
    progress: 'Прогрес перегляду',
    jumpTo: 'Перейти до секції',
    analytics: 'Глобальні візити',
    analyticsPending: 'Завантаження…',
    analyticsUnavailable: 'Підключіть GoatCounter',
    analyticsLive: 'Загальна кількість переглядів',
    analyticsFallback: 'Очікування відповіді GoatCounter',
    share: 'Поділитися',
    shareReady: 'Поширено',
    shareCopied: 'Посилання скопійовано',
  },
}

const ToolbarIcon = ({ name }) => {
  const icons = {
    globe: <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18Zm6.92 8h-3.1a15.7 15.7 0 0 0-1.15-4.35A7.03 7.03 0 0 1 18.92 11ZM12 5.08c.7.92 1.75 2.92 2.18 5.92H9.82C10.25 8 11.3 6 12 5.08ZM9.33 6.65A15.7 15.7 0 0 0 8.18 11h-3.1a7.03 7.03 0 0 1 4.25-4.35ZM5.08 13h3.1c.16 1.56.56 3.04 1.15 4.35A7.03 7.03 0 0 1 5.08 13ZM12 18.92c-.7-.92-1.75-2.92-2.18-5.92h4.36c-.43 3-1.48 5-2.18 5.92Zm2.67-1.57c.59-1.31.99-2.79 1.15-4.35h3.1a7.03 7.03 0 0 1-4.25 4.35Z" />,
    file: <path d="M7 3.75A1.75 1.75 0 0 1 8.75 2h5.94c.46 0 .9.18 1.23.5l3.58 3.58c.32.33.5.77.5 1.23v10.94A1.75 1.75 0 0 1 18.25 20h-9.5A1.75 1.75 0 0 1 7 18.25V3.75Zm7 .75v2.75c0 .41.34.75.75.75h2.75L14 4.5ZM9.75 11a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" />,
    chevron: <path d="M7.47 9.97a.75.75 0 0 1 1.06 0L12 13.44l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06Z" />,
    pdf: <path d="M6.5 3.75A1.75 1.75 0 0 1 8.25 2h5.6c.46 0 .9.18 1.23.5l3.42 3.42c.32.33.5.77.5 1.23v10.6A2.25 2.25 0 0 1 16.75 20h-8.5A2.25 2.25 0 0 1 6 17.75v-12ZM14 4.56v2.19c0 .41.34.75.75.75h2.19L14 4.56ZM9 12.25h1.2c1.29 0 2.05-.69 2.05-1.82 0-1.12-.76-1.8-2.05-1.8H9v3.62Zm1.2-2.7c.53 0 .82.3.82.88 0 .59-.29.9-.82.9h-.04v-1.78h.04Zm2.76 2.7h1.18c1.39 0 2.2-.67 2.2-1.84 0-1.16-.81-1.78-2.2-1.78h-1.18v3.62Zm1.18-2.7c.6 0 .98.27.98.86 0 .62-.38.94-.98.94h-.02v-1.8h.02Zm-5.16 7.05h6.04a.75.75 0 0 0 0-1.5H8.98a.75.75 0 0 0 0 1.5Z" />,
    doc: <path d="M7 3.75A1.75 1.75 0 0 1 8.75 2h5.94c.46 0 .9.18 1.23.5l3.58 3.58c.32.33.5.77.5 1.23v10.94A1.75 1.75 0 0 1 18.25 20h-9.5A1.75 1.75 0 0 1 7 18.25V3.75Zm7 .75v2.75c0 .41.34.75.75.75h2.75L14 4.5ZM9.2 15.5h1.14c1.13 0 1.86-.69 1.86-1.86 0-1.16-.73-1.84-1.86-1.84H9.2v3.7Zm1.08-2.84c.48 0 .78.34.78.98 0 .66-.3 1.01-.78 1.01h-.06v-1.99h.06Zm2.51 2.84h1.9c1.02 0 1.66-.55 1.66-1.42 0-.87-.64-1.4-1.66-1.4h-.88v-.88h2.17V10.9h-3.19v4.6Zm1.02-.86v-1.1h.76c.42 0 .66.21.66.55 0 .35-.24.55-.66.55h-.76Z" />,
    progress: <path d="M5 4.75A1.75 1.75 0 0 1 6.75 3h10.5A1.75 1.75 0 0 1 19 4.75v14.5A1.75 1.75 0 0 1 17.25 21H6.75A1.75 1.75 0 0 1 5 19.25V4.75Zm1.5.25v14.5h10.5V5H6.5Zm2 2.25h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5Zm0 3.5h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5Zm0 3.5h4.5a.75.75 0 0 1 0 1.5H8.5a.75.75 0 0 1 0-1.5Z" />,
    views: <path d="M12 5c5.23 0 9.27 4.11 10 6.99C21.27 14.89 17.23 19 12 19s-9.27-4.11-10-7.01C2.73 9.11 6.77 5 12 5Zm0 2c-3.87 0-7.02 2.88-7.87 5 .85 2.12 4 5 7.87 5s7.02-2.88 7.87-5c-.85-2.12-4-5-7.87-5Zm0 1.75A3.25 3.25 0 1 1 8.75 12 3.25 3.25 0 0 1 12 8.75Zm0 1.5A1.75 1.75 0 1 0 13.75 12 1.75 1.75 0 0 0 12 10.25Z" />,
    share: <path d="M15.5 5a2.5 2.5 0 1 1 .22 1.03l-6.07 3.22a2.5 2.5 0 0 1 0 1.5l6.07 3.22a2.5 2.5 0 1 1-.7 1.3l-6.07-3.23a2.5 2.5 0 1 1 0-4.08l6.07-3.23A2.49 2.49 0 0 1 15.5 5Z" />,
  }

  return (
    <svg className="toolbar-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

const Section = ({ domId, title, children, className = '', registerSection, isActive = false, isDimmed = false }) => (
  <section
    id={domId}
    ref={(node) => {
      if (registerSection && domId) registerSection(domId, node)
    }}
    className={`section section-card ${className} ${isActive ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}`.trim()}
  >
    <h2>{title}</h2>
    {children}
  </section>
)

const ContactIcon = ({ name }) => {
  const icons = {
    location: <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />,
    email: <path d="M4 7.25A2.25 2.25 0 0 1 6.25 5h11.5A2.25 2.25 0 0 1 20 7.25v9.5A2.25 2.25 0 0 1 17.75 19H6.25A2.25 2.25 0 0 1 4 16.75v-9.5Zm1.8-.45 6.2 4.65 6.2-4.65H5.8Zm12.7 1.25-5.9 4.43a1 1 0 0 1-1.2 0L5.5 8.05v8.7c0 .41.34.75.75.75h11.5c.41 0 .75-.34.75-.75v-8.7Z" />,
    linkedin: <path d="M6.5 8.5A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3.5ZM5 10h3v9H5v-9Zm5 0h2.9v1.3h.04c.4-.77 1.38-1.58 2.85-1.58 3.05 0 3.61 2 3.61 4.61V19h-3v-4.1c0-.98-.02-2.24-1.36-2.24-1.36 0-1.57 1.06-1.57 2.17V19h-3v-9Z" />,
    phone: <path d="M7.2 4h3.1l1 4.1-1.9 1.9a14 14 0 0 0 4.7 4.7l1.9-1.9L20 13.8V17a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 5 6.2 2 2 0 0 1 7.2 4Z" />,
    telegram: <path d="M20.7 4.3 17.9 18c-.2 1-.8 1.2-1.6.8l-4.4-3.2-2.1 2c-.2.2-.4.4-.8.4l.3-4.5 8.3-7.5c.4-.3-.1-.5-.5-.2L6.9 12.2 2.5 10.8c-.9-.3-.9-.9.2-1.3L19.1 3c.8-.3 1.8.2 1.6 1.3Z" />,
  }

  return (
    <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return defaultLanguage
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return stored && cvContent[stored] ? stored : defaultLanguage
}

const getInitialOwnerMode = () => {
  if (typeof window === 'undefined') return false
  const rawValue = (window.localStorage.getItem(OWNER_MODE_STORAGE_KEY) || '').trim().toLowerCase()
  return rawValue === 'так'
}

const getInitialAnalyticsCount = () => {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(ANALYTICS_STORAGE_KEY) || ''
}

const setMetaTag = (name, content, attribute = 'name') => {
  const element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (element) {
    element.setAttribute('content', content)
  }
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

        <Section domId={hidden ? undefined : 'approach'} title={current.sections.testingApproachTitle} className="compact-section" registerSection={registerSection} {...sectionState('approach')}>
          <ul>
            {current.sections.testingApproachBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section domId={hidden ? undefined : 'domain'} title={current.sections.domainExperienceTitle} className="compact-section" registerSection={registerSection} {...sectionState('domain')}>
          <ul>
            {current.sections.domainExperienceBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage)
  const [isExporting, setIsExporting] = useState(false)
  const [activeSection, setActiveSection] = useState('summary')
  const [navLockId, setNavLockId] = useState('')
  const [isOwnerModeActive] = useState(getInitialOwnerMode)
  const [analyticsValue, setAnalyticsValue] = useState(getInitialAnalyticsCount)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(Boolean(GOATCOUNTER_JSON_URL) && getInitialOwnerMode() && !getInitialAnalyticsCount())
  const [shareStatus, setShareStatus] = useState('idle')
  const visibleResumeRef = useRef(null)
  const sectionNodesRef = useRef({})
  const navLockTimerRef = useRef(null)

  const current = cvContent[lang] ?? cvContent[defaultLanguage]
  const ui = ENGINE_UI[lang] ?? ENGINE_UI.en

  const navItems = useMemo(
    () => [
      { id: 'summary', label: current.sections.summaryTitle },
      { id: 'expertise', label: current.sections.coreSkillsTitle },
      { id: 'experience', label: current.sections.experienceTitle },
      { id: 'impact', label: current.sections.technicalTitle },
      { id: 'approach', label: current.sections.testingApproachTitle },
      { id: 'domain', label: current.sections.domainExperienceTitle },
      { id: 'languages', label: current.sections.languagesTitle },
    ],
    [current],
  )

  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === activeSection))
  const progressPercent = navItems.length ? ((activeIndex + 1) / navItems.length) * 100 : 0

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href
    const shareTitle = current.ui.seoTitle

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        })
        setShareStatus('shared')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setShareStatus('copied')
      } else {
        const input = document.createElement('input')
        input.value = shareUrl
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setShareStatus('copied')
      }
    } catch (error) {
      if (error?.name === 'AbortError') return
      setShareStatus('copied')
    }
  }, [current.ui.seoTitle])

  useEffect(() => {
    if (shareStatus === 'idle') return undefined

    const timer = window.setTimeout(() => setShareStatus('idle'), 1800)
    return () => window.clearTimeout(timer)
  }, [shareStatus])

  const registerSection = useCallback((id, node) => {
    if (!id) return
    if (node) {
      sectionNodesRef.current[id] = node
    } else {
      delete sectionNodesRef.current[id]
    }
  }, [])

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

  useEffect(() => {
    if (!GOATCOUNTER_ENDPOINT) return undefined

    window.goatcounter = { ...(window.goatcounter ?? {}), allow_local: true }

    const existingScript = document.querySelector(`script[data-goatcounter="${GOATCOUNTER_ENDPOINT}/count"]`)
    if (existingScript) return undefined

    const script = document.createElement('script')
    script.async = true
    script.dataset.goatcounter = `${GOATCOUNTER_ENDPOINT}/count`
    script.src = GOATCOUNTER_SCRIPT_URL
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isOwnerModeActive || !GOATCOUNTER_JSON_URL) {
      setIsAnalyticsLoading(false)
      return undefined
    }

    const controller = new AbortController()
    const cached = window.localStorage.getItem(ANALYTICS_STORAGE_KEY) || ''
    let attempts = 0
    let retryTimer
    let refreshTimer

    if (cached) {
      setAnalyticsValue(cached)
      setIsAnalyticsLoading(false)
    } else {
      setIsAnalyticsLoading(true)
    }

    const scheduleRefresh = () => {
      if (controller.signal.aborted) return
      refreshTimer = window.setTimeout(() => {
        attempts = 0
        loadCount(false)
      }, 30000)
    }

    const loadCount = async (showLoader = false) => {
      attempts += 1

      if (showLoader && !analyticsValue) {
        setIsAnalyticsLoading(true)
      }

      try {
        const response = await fetch(`${GOATCOUNTER_JSON_URL}&_=${Date.now()}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          mode: 'cors',
        })

        if (!response.ok) throw new Error(`GoatCounter responded with ${response.status}`)

        const data = await response.json()
        const rawCount = typeof data.count === 'number' ? String(data.count) : typeof data.count === 'string' ? data.count.trim() : ''
        if (!rawCount) throw new Error('GoatCounter returned an empty count')

        window.localStorage.setItem(ANALYTICS_STORAGE_KEY, rawCount)
        setAnalyticsValue(rawCount)
        setIsAnalyticsLoading(false)
        scheduleRefresh()
        return
      } catch (error) {
        if (error.name === 'AbortError') return

        if (cached) {
          setAnalyticsValue(cached)
        }

        if (attempts < 4) {
          retryTimer = window.setTimeout(() => loadCount(showLoader), 1500)
          return
        }

        setIsAnalyticsLoading(false)
        scheduleRefresh()
      }
    }

    loadCount(true)

    return () => {
      controller.abort()
      if (retryTimer) window.clearTimeout(retryTimer)
      if (refreshTimer) window.clearTimeout(refreshTimer)
    }
  }, [analyticsValue, isOwnerModeActive])

  useEffect(() => {
    let frameId = 0

    const syncActiveSection = () => {
      if (navLockId) return

      const sections = navItems
        .map((item) => ({ id: item.id, node: sectionNodesRef.current[item.id] }))
        .filter((item) => item.node)

      if (!sections.length) return

      const scrollTop = window.scrollY
      const scrollBottom = scrollTop + window.innerHeight
      const documentBottom = document.documentElement.scrollHeight

      if (documentBottom - scrollBottom <= 16) {
        setActiveSection('languages')
        return
      }

      const focusLine = scrollTop + Math.min(220, window.innerHeight * 0.28)
      let nextActive = sections[0].id

      for (const section of sections) {
        const absoluteTop = scrollTop + section.node.getBoundingClientRect().top
        if (absoluteTop <= focusLine) {
          nextActive = section.id
        } else {
          break
        }
      }

      setActiveSection(nextActive)
    }

    const scheduleSync = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        syncActiveSection()
      })
    }

    scheduleSync()
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
    }
  }, [navItems, navLockId])

  const handleExport = async (format) => {
    if (isExporting || !visibleResumeRef.current) return

    setIsExporting(true)
    try {
      if (format === 'pdf') {
        await exportStyledPdf({
          sourceNode: visibleResumeRef.current,
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

  const handleJumpTo = (id) => {
    const node = sectionNodesRef.current[id]
    if (!node) return

    if (navLockTimerRef.current) {
      window.clearTimeout(navLockTimerRef.current)
    }

    setNavLockId(id)
    setActiveSection(id)

    const absoluteTop = window.scrollY + node.getBoundingClientRect().top
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

    let targetTop
    if (id === 'languages') {
      targetTop = maxScroll
    } else {
      const offset = id === 'domain' ? 88 : 104
      targetTop = Math.min(Math.max(0, absoluteTop - offset), maxScroll)
    }

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    })

    navLockTimerRef.current = window.setTimeout(() => {
      setNavLockId('')
      setActiveSection(id)
    }, 950)
  }

  return (
    <div className="page">
      <aside className="mini-nav" aria-label={ui.jumpTo}>
        <div className="mini-nav-controls">
          {isOwnerModeActive ? (
            <div className="control-card analytics-card mini-control">
              <span className="control-meta">
                <ToolbarIcon name="views" />
                <span>{ui.analytics}</span>
              </span>
              <div className="analytics-badge analytics-badge-rich">
                <strong className="analytics-number">{analyticsValue || '—'}</strong>
                <span className="analytics-caption">
                  {analyticsValue ? ui.analyticsLive : isAnalyticsLoading ? ui.analyticsPending : ui.analyticsFallback}
                </span>
              </div>
            </div>
          ) : null}

          <div className="control-card select-card mini-control">
            <span className="control-meta">
              <ToolbarIcon name="globe" />
              <span>{ui.language}</span>
            </span>
            <div className="select-shell compact-select">
              <select id="lang-select" className="paper-select" value={lang} onChange={(event) => setLang(event.target.value)}>
                <option value="uk">{current.ui.langUa}</option>
                <option value="en">{current.ui.langEn}</option>
              </select>
              <span className="select-chevron">
                <ToolbarIcon name="chevron" />
              </span>
            </div>
          </div>

          <div className="control-card export-card mini-control">
            <span className="control-meta">
              <ToolbarIcon name="file" />
              <span>{ui.quickExport}</span>
            </span>
            <div className="quick-export">
              <button className="export-btn" type="button" onClick={() => handleExport('pdf')} disabled={isExporting}>
                <ToolbarIcon name="pdf" />
                <span>{current.ui.exportPdf}</span>
              </button>
              <button className="export-btn" type="button" onClick={() => handleExport('docx')} disabled={isExporting}>
                <ToolbarIcon name="doc" />
                <span>{current.ui.exportDocx}</span>
              </button>
            </div>
            <button className={`share-btn ${shareStatus !== 'idle' ? 'is-success' : ''}`.trim()} type="button" onClick={handleShare}>
              <ToolbarIcon name="share" />
              <span>{shareStatus === 'shared' ? ui.shareReady : shareStatus === 'copied' ? ui.shareCopied : ui.share}</span>
            </button>
          </div>
        </div>

        <div className="mini-nav-header">
          <span className="control-meta">
            <ToolbarIcon name="progress" />
            <span>{ui.progress}</span>
          </span>
          <strong>
            {activeIndex + 1}/{navItems.length}
          </strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="mini-nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`mini-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleJumpTo(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      <ResumeArticle current={current} lang={lang} articleRef={visibleResumeRef} registerSection={registerSection} activeSectionId={activeSection} />
      <div className="page-bottom-spacer" aria-hidden="true" />
    </div>
  )
}
