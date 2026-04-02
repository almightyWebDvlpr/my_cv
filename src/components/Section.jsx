const Section = ({
  domId,
  title,
  children,
  className = '',
  registerSection,
  isActive = false,
  isDimmed = false,
  isFlashing = false,
}) => (
  <section
    id={domId}
    ref={(node) => {
      if (registerSection && domId) registerSection(domId, node)
    }}
    className={`section section-card ${className} ${isActive ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''} ${isFlashing ? 'is-flashing' : ''}`.trim()}
  >
    <h2>{title}</h2>
    {children}
  </section>
)

export default Section
