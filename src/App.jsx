import './App.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ResumeArticle from './components/ResumeArticle'
import SidebarControls from './components/SidebarControls'
import MobileFabMenu from './components/MobileFabMenu'
import { ToolbarIcon } from './components/icons'
import {
  ENGINE_UI,
  GOATCOUNTER_JSON_URL,
  LANGUAGE_STORAGE_KEY,
  OWNER_MODE_STORAGE_KEY,
} from './constants/appConfig'
import { cvContent, defaultLanguage } from './data/cvContent'
import { useAnalyticsCounter } from './hooks/useAnalyticsCounter'
import { useSectionNavigation } from './hooks/useSectionNavigation'
import { useShareAction } from './hooks/useShareAction'
import { estimateReadMinutes, getNavItems, setMetaTag } from './utils/resumeHelpers'

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

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage)
  const [isExporting, setIsExporting] = useState(false)
  const [isMobileFabOpen, setIsMobileFabOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isOwnerModeActive] = useState(getInitialOwnerMode)
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(false)
  const [sectionFlashId, setSectionFlashId] = useState('')
  const visibleResumeRef = useRef(null)
  const sectionFlashTimerRef = useRef(null)

  const current = cvContent[lang] ?? cvContent[defaultLanguage]
  const ui = ENGINE_UI[lang] ?? ENGINE_UI.en
  const navItems = useMemo(() => getNavItems(current), [current])
  const estimatedReadMinutes = useMemo(() => estimateReadMinutes(current), [current])
  const { activeSection, registerSection, handleJumpTo } = useSectionNavigation(navItems)
  const { analyticsValue, isAnalyticsLoading } = useAnalyticsCounter({ enabled: isOwnerModeActive && Boolean(GOATCOUNTER_JSON_URL) })
  const { shareStatus, handleShare } = useShareAction(current.ui.seoTitle)

  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === activeSection))
  const progressPercent = navItems.length ? ((activeIndex + 1) / navItems.length) * 100 : 0

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const sync = () => {
      const next = media.matches
      setIsMobileViewport(next)
      if (!next) setIsMobileFabOpen(false)
    }

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
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

  const handleLanguageChange = useCallback((nextLang) => {
    if (nextLang === lang) return
    setLang(nextLang)
  }, [lang])

  const triggerSectionFlash = useCallback((id) => {
    if (sectionFlashTimerRef.current) {
      window.clearTimeout(sectionFlashTimerRef.current)
    }

    setSectionFlashId(id)
    sectionFlashTimerRef.current = window.setTimeout(() => {
      setSectionFlashId('')
    }, 820)
  }, [])

  const handleExport = useCallback(async (format) => {
    if (isExporting || !visibleResumeRef.current) return

    setIsExporting(true)
    try {
      const { exportDocx, exportStyledPdf } = await import('./utils/exportResume')

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
  }, [current, isExporting, lang])

  const handleCloseMobileFab = useCallback(() => setIsMobileFabOpen(false), [])

  const handleJumpToSection = useCallback((id) => {
    triggerSectionFlash(id)
    handleJumpTo(id)
    if (isMobileViewport) setIsMobileFabOpen(false)
  }, [handleJumpTo, isMobileViewport, triggerSectionFlash])

  useEffect(() => {
    if (!isMobileViewport) {
      setIsMobileHeaderVisible(false)
      return
    }

    let frameId = 0

    const syncHeader = () => {
      frameId = 0
      const headerNode = visibleResumeRef.current?.querySelector('.header')
      if (!headerNode) return

      const shouldShow = headerNode.getBoundingClientRect().bottom <= 72
      setIsMobileHeaderVisible((currentValue) => (currentValue === shouldShow ? currentValue : shouldShow))
    }

    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(syncHeader)
    }

    syncHeader()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isMobileViewport])

  useEffect(() => () => {
    if (sectionFlashTimerRef.current) {
      window.clearTimeout(sectionFlashTimerRef.current)
    }
  }, [])

  const shareAriaLabel = isMobileViewport
    ? (isMobileFabOpen ? 'Close mobile actions' : 'Open mobile actions')
    : shareStatus === 'shared'
      ? ui.shareReady
      : shareStatus === 'copied'
        ? ui.shareCopied
        : ui.share

  return (
    <div className="page">
      <aside className="mini-nav" aria-label={ui.jumpTo}>
        <div className={`mobile-compact-header ${isMobileHeaderVisible ? 'is-visible' : ''}`.trim()} aria-hidden={!isMobileHeaderVisible}>
          <span className="mobile-compact-title">{current.name}</span>
          <div className="mobile-compact-actions">
            <button
              className="mobile-compact-action"
              type="button"
              onClick={handleShare}
              aria-label={ui.share}
              title={ui.share}
            >
              <ToolbarIcon name="share" />
            </button>
            <button
              className={`mobile-compact-action ${isMobileFabOpen ? 'is-active' : ''}`.trim()}
              type="button"
              onClick={() => setIsMobileFabOpen((open) => !open)}
              aria-label={shareAriaLabel}
              title={shareAriaLabel}
              aria-expanded={isMobileFabOpen}
            >
              <ToolbarIcon name={isMobileFabOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
        <button
          className={`share-fab ${shareStatus !== 'idle' ? 'is-success' : ''} ${isMobileFabOpen ? 'is-open' : ''}`.trim()}
          type="button"
          onClick={isMobileViewport ? () => setIsMobileFabOpen((open) => !open) : handleShare}
          aria-label={shareAriaLabel}
          title={shareAriaLabel}
          aria-expanded={isMobileViewport ? isMobileFabOpen : undefined}
        >
          <ToolbarIcon name={isMobileViewport ? (isMobileFabOpen ? 'close' : 'menu') : 'share'} />
        </button>

        <MobileFabMenu
          isOpen={isMobileFabOpen}
          lang={lang}
          isExporting={isExporting}
          current={current}
          ui={ui}
          onLanguageChange={handleLanguageChange}
          onExport={handleExport}
          onShare={handleShare}
          onClose={handleCloseMobileFab}
        />

        <SidebarControls
          isOwnerModeActive={isOwnerModeActive}
          analyticsValue={analyticsValue}
          isAnalyticsLoading={isAnalyticsLoading}
          estimatedReadMinutes={estimatedReadMinutes}
          lang={lang}
          current={current}
          ui={ui}
          isExporting={isExporting}
          navItems={navItems}
          activeSection={activeSection}
          activeIndex={activeIndex}
          progressPercent={progressPercent}
          onLanguageChange={handleLanguageChange}
          onExport={handleExport}
          onJumpTo={handleJumpToSection}
          onCloseMobileFab={handleCloseMobileFab}
        />
      </aside>

      <div className="resume-stage">
        <ResumeArticle
          current={current}
          lang={lang}
          articleRef={visibleResumeRef}
          registerSection={registerSection}
          activeSectionId={activeSection}
          sectionFlashId={sectionFlashId}
        />
      </div>
      <div className="page-bottom-spacer" aria-hidden="true" />
    </div>
  )
}
