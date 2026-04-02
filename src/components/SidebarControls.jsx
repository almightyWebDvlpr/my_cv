import { ToolbarIcon } from './icons'

const SidebarControls = ({
  isOwnerModeActive,
  analyticsValue,
  isAnalyticsLoading,
  estimatedReadMinutes,
  lang,
  current,
  ui,
  isExporting,
  navItems,
  activeSection,
  activeIndex,
  progressPercent,
  onLanguageChange,
  onExport,
  onJumpTo,
  onCloseMobileFab,
}) => {
  const languageOptions = [
    { code: 'uk', label: current.ui.langUa, shortLabel: 'UA' },
    { code: 'en', label: current.ui.langEn, shortLabel: 'EN' },
  ]

  const exportOptions = [
    { format: 'pdf', label: 'PDF' },
    { format: 'docx', label: 'Word' },
  ]

  return (
    <div className="mini-nav-scroll">
      <div className="mini-nav-controls">
        {isOwnerModeActive ? (
          <div className="control-card analytics-card mini-control corner-icon-card">
            <span className="corner-card-icon" aria-hidden="true">
              <ToolbarIcon name="views" />
            </span>
            <div className="analytics-badge analytics-badge-rich">
              <strong className="analytics-number">{analyticsValue || '—'}</strong>
              <span className="analytics-caption">
                {analyticsValue ? ui.analyticsLive : isAnalyticsLoading ? ui.analyticsPending : ui.analyticsFallback}
              </span>
            </div>
          </div>
        ) : null}

        <div className="control-card readtime-card mini-control corner-icon-card">
          <span className="corner-card-icon" aria-hidden="true">
            <ToolbarIcon name="time" />
          </span>
          <div className="readtime-badge">
            <strong>{estimatedReadMinutes}</strong>
            <span>{ui.readTimeValue}</span>
          </div>
        </div>

        <div className="control-card select-card mini-control compact-choice-card">
          <span className="compact-choice-icon" aria-hidden="true">
            <ToolbarIcon name="globe" />
          </span>
          <div className="language-toggle" role="tablist" aria-label={ui.language}>
            {languageOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`language-pill ${lang === option.code ? 'is-active' : ''}`.trim()}
                onClick={() => {
                  onLanguageChange(option.code)
                  onCloseMobileFab()
                }}
                aria-pressed={lang === option.code}
                title={option.label}
              >
                <span className="language-pill-code" aria-hidden="true">{option.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="control-card export-card mini-control compact-choice-card">
          <span className="compact-choice-icon" aria-hidden="true">
            <ToolbarIcon name="file" />
          </span>
          <div className="quick-export">
            {exportOptions.map((option) => (
              <button
                key={option.format}
                className="export-btn"
                type="button"
                onClick={() => {
                  onExport(option.format)
                  onCloseMobileFab()
                }}
                disabled={isExporting}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mini-nav-header">
        <span className="control-meta" aria-hidden="true">
          <ToolbarIcon name="progress" />
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
            className={`mini-nav-item ${activeSection === item.id ? 'active' : ''}`.trim()}
            onClick={() => onJumpTo(item.id)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SidebarControls
