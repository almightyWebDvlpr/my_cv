import { ToolbarIcon } from './icons'

const MobileFabMenu = ({
  isOpen,
  lang,
  isExporting,
  current,
  ui,
  onLanguageChange,
  onExport,
  onShare,
  onClose,
}) => {
  const languageOptions = [
    { code: 'uk', label: current.ui.langUa, shortLabel: 'UA' },
    { code: 'en', label: current.ui.langEn, shortLabel: 'EN' },
  ]

  const exportOptions = [
    { format: 'pdf', label: 'PDF', ariaLabel: 'Export PDF' },
    { format: 'docx', label: 'Word', ariaLabel: 'Export Word' },
  ]

  return (
    <div className={`mobile-fab-menu ${isOpen ? 'is-open' : ''}`.trim()} aria-hidden={!isOpen}>
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          className={`mobile-fab-action ${lang === option.code ? 'is-active' : ''}`.trim()}
          onClick={() => {
            onLanguageChange(option.code)
            onClose()
          }}
          aria-label={option.label}
        >
          <span>{option.shortLabel}</span>
        </button>
      ))}

      {exportOptions.map((option) => (
        <button
          key={option.format}
          type="button"
          className="mobile-fab-action"
          onClick={() => {
            onExport(option.format)
            onClose()
          }}
          disabled={isExporting}
          aria-label={option.ariaLabel}
        >
          <span>{option.label}</span>
        </button>
      ))}

      <button
        type="button"
        className="mobile-fab-action mobile-fab-share"
        onClick={() => {
          onShare()
          onClose()
        }}
        aria-label={ui.share}
        title={ui.share}
      >
        <ToolbarIcon name="share" />
      </button>
    </div>
  )
}

export default MobileFabMenu
