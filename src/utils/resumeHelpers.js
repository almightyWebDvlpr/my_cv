export const getNavItems = (current) => [
  { id: 'summary', label: current.sections.summaryTitle },
  { id: 'expertise', label: current.sections.coreSkillsTitle },
  { id: 'experience', label: current.sections.experienceTitle },
  { id: 'impact', label: current.sections.technicalTitle },
  { id: 'education', label: current.sections.educationTitle },
  { id: 'languages', label: current.sections.languagesTitle },
]

export const estimateReadMinutes = (current) => {
  const textChunks = [
    ...current.sections.summary,
    ...current.sections.coreSkills.flatMap((item) => [item.title, item.text]),
    ...current.sections.jobs.flatMap((job) => [job.title, job.meta, ...job.bullets]),
    ...(current.sections.educationEntries || []).flatMap((item) => [item.institution, item.program, item.period]),
    ...current.sections.technicalBullets,
    ...current.sections.languageBullets,
  ]

  const wordCount = textChunks
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(wordCount / 220))
}

export const setMetaTag = (name, content, attribute = 'name') => {
  const element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (element) {
    element.setAttribute('content', content)
  }
}
