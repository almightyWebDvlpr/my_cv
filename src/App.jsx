import './App.css'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const Section = ({ title, children }) => (
  <section className="section">
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

const content = {
  en: {
    ui: {
      language: 'Language:',
      download: 'Download PDF',
      exporting: 'Exporting...',
      langUa: 'Ukrainian',
      langEn: 'English',
      filePrefix: 'Serhii-Kurylenko-CV',
      phoneLabel: 'Phone',
      telegramLabel: 'Telegram',
    },
    name: 'SERHII KURYLENKO',
    role: 'QA Engineer - Backend / API / Data & Automation',
    contactPrefix: 'Remote | Ukraine',
    sections: {
      summaryTitle: 'PROFESSIONAL SUMMARY',
      summary: [
        'QA Engineer with 5+ years of experience in healthcare and regulated platforms, specializing in backend and API testing within distributed systems.',
        'Strong expertise in REST, GraphQL, and SOAP API validation, microservices-based architectures, database verification, and risk-based testing strategies.',
        'Experienced in environments requiring high levels of data integrity, transactional consistency, and release quality ownership. Background in backend development (Node.js), enabling a deep understanding of system architecture and business logic.',
      ],
      coreSkillsTitle: 'CORE SKILLS',
      coreSkills: [
        {
          title: 'Backend & API Testing',
          text: 'REST, GraphQL, SOAP APIs, JSON/XML validation, authentication flows, negative testing, edge-case scenarios.',
        },
        {
          title: 'Web & UI Testing',
          text: 'Cross-platform web applications, UI/UX validation, browser compatibility testing, functional UI testing, network request inspection using browser developer tools.',
        },
        {
          title: 'Automation',
          text: 'Postman, Newman, API regression automation, Selenium WebDriver (JavaScript), CI/CD integration.',
        },
        {
          title: 'Database & Data Validation',
          text: 'PostgreSQL, MongoDB, SQL queries, data consistency checks, data integrity verification.',
        },
        {
          title: 'Testing Methodologies',
          text: 'Risk-based testing, regression testing, integration testing, exploratory testing, release validation.',
        },
        {
          title: 'Tools & Technologies',
          text: 'JavaScript, Node.js, Git, Docker (basic), CI/CD pipelines, log analysis using Kibana.',
        },
        {
          title: 'Integrations & Platforms',
          text: 'Government interoperability platform (Trembita), distributed microservices architectures.',
        },
        {
          title: 'Domain Experience',
          text: 'Healthcare systems, GovTech platforms, regulated and high-reliability environments.',
        },
      ],
      experienceTitle: 'PROFESSIONAL EXPERIENCE',
      jobs: [
        {
          title: 'QA Engineer',
          meta: 'National Healthcare GovTech Platform | 2021 - Present',
          bullets: [
            'Performed backend and API testing across 30+ REST, GraphQL, and SOAP services within a distributed healthcare platform.',
            'Validated complex business logic aligned with regulatory and compliance requirements',
            'Performed quality assurance and validation of healthcare provider records within central registries (MIS), ensuring data accuracy, regulatory compliance, and integrity across integrated systems.',
            'Tested integrations with the Trembita government interoperability platform for secure cross-system data exchange.',
            'Designed and maintained a risk-based regression testing strategy for critical system workflows.',
            'Built automated API regression suites using Postman and Newman, integrated into CI/CD pipelines, reducing manual regression effort by ~40%.',
            'Executed database-level validation using PostgreSQL and MongoDB to ensure data integrity across services.',
            'Tested authentication and authorization flows for secure API access.',
            'Investigated production defects through log analysis in Kibana, tracing issues across distributed services and API interactions.',
            'Owned release quality across STAGE, PREPROD, and PROD environments.',
            'Collaborated closely with business analysts and developers to clarify requirements and mitigate quality risks.',
            'Provided mentoring and guidance to junior QA engineers.',
          ],
        },
        {
          title: 'Full Stack JavaScript Developer',
          meta: 'Medical Systems & Government Healthcare Registry | ~1.5 years',
          bullets: [
            'Developed RESTful APIs using Node.js for medical information systems.',
            'Implemented backend business logic supporting regulated healthcare workflows.',
            'Integrated SQL and NoSQL databases, ensuring reliable and consistent data flows.',
            'Participated in requirement analysis and technical design discussions with stakeholders.',
          ],
        },
      ],
      technicalTitle: 'TECHNICAL SKILLS',
      technicalBullets: [
        'Testing: Backend testing, web application testing, REST / GraphQL / SOAP APIs, regression, integration, exploratory, risk-based testing.',
        'Automation: Postman, Newman, Selenium WebDriver.',
        'Databases: PostgreSQL, MongoDB.',
        'Technologies: JavaScript, Node.js, REST APIs, Git, Docker (basic), CI/CD pipelines.',
        'Systems: Microservices architectures, distributed platforms, government integrations.',
        'Monitoring & Debugging: Log analysis using Kibana.',
      ],
      languagesTitle: 'LANGUAGES',
      languageBullets: ['Ukrainian - Native', 'English - Intermediate (B1-B2)'],
      ariaLabel: 'Serhii Kurylenko CV',
    },
  },
  uk: {
    ui: {
      language: 'Мова:',
      download: 'Завантажити PDF',
      exporting: 'Експорт...',
      langUa: 'Українська',
      langEn: 'English',
      filePrefix: 'Serhii-Kurylenko-CV',
      phoneLabel: 'Телефон',
      telegramLabel: 'Telegram',
    },
    name: 'СЕРГІЙ КУРИЛЕНКО',
    role: 'QA Engineer - Backend / API / Дані та автоматизація',
    contactPrefix: 'Віддалено | Україна',
    sections: {
      summaryTitle: 'ПРОФЕСІЙНЕ РЕЗЮМЕ',
      summary: [
        'QA Engineer із понад 5 роками досвіду в охороні здоров’я та на регульованих платформах, спеціалізуюся на backend- та API-тестуванні в межах розподілених систем.',
        'Маю сильну експертизу у валідації REST, GraphQL і SOAP API, тестуванні мікросервісних архітектур, перевірці баз даних і застосуванні ризик-орієнтованих стратегій тестування.',
        'Працюю в середовищах із високими вимогами до цілісності даних, транзакційної узгодженості та відповідальності за якість релізів. Досвід backend-розробки (Node.js) забезпечує глибоке розуміння системної архітектури та бізнес-логіки.',
      ],
      coreSkillsTitle: 'КЛЮЧОВІ НАВИЧКИ',
      coreSkills: [
        {
          title: 'Backend та API-тестування',
          text: 'REST, GraphQL, SOAP API, валідація JSON/XML, перевірка сценаріїв автентифікації, негативне тестування, тестування граничних випадків.',
        },
        {
          title: 'Web та UI-тестування',
          text: 'Кросплатформні вебзастосунки, валідація UI/UX, перевірка браузерної сумісності, функціональне UI-тестування, аналіз мережевих запитів через інструменти розробника браузера.',
        },
        {
          title: 'Автоматизація',
          text: 'Postman, Newman, автоматизація API-регресії, Selenium WebDriver (JavaScript), інтеграція з CI/CD.',
        },
        {
          title: 'Бази даних і валідація даних',
          text: 'PostgreSQL, MongoDB, SQL-запити, перевірка консистентності даних, верифікація цілісності даних.',
        },
        {
          title: 'Методології тестування',
          text: 'Ризик-орієнтоване тестування, регресійне тестування, інтеграційне тестування, дослідницьке тестування, валідація релізів.',
        },
        {
          title: 'Інструменти та технології',
          text: 'JavaScript, Node.js, Git, Docker (базовий рівень), CI/CD-пайплайни, аналіз логів у Kibana.',
        },
        {
          title: 'Інтеграції та платформи',
          text: 'Державна платформа взаємодії (Трембіта), розподілені мікросервісні архітектури.',
        },
        {
          title: 'Доменний досвід',
          text: 'Системи охорони здоров’я, GovTech-платформи, регульовані та високонадійні середовища.',
        },
      ],
      experienceTitle: 'ПРОФЕСІЙНИЙ ДОСВІД',
      jobs: [
        {
          title: 'QA Engineer',
          meta: 'National Healthcare GovTech Platform | 2021 - Present',
          bullets: [
            'Виконував backend- та API-тестування понад 30 REST, GraphQL і SOAP сервісів у межах розподіленої healthcare-платформи.',
            'Валідував складну бізнес-логіку відповідно до регуляторних і комплаєнс-вимог',
            'Забезпечував контроль якості та валідацію записів про надавачів медичних послуг у центральних реєстрах (MIS), гарантуючи точність даних, відповідність регуляторним вимогам і цілісність даних у межах інтегрованих систем.',
            'Тестував інтеграції з державною платформою взаємодії Трембіта для безпечного міжсистемного обміну даними.',
            'Розробив і підтримував ризик-орієнтовану стратегію регресійного тестування для критичних системних процесів.',
            'Побудував автоматизовані API-регресійні набори на Postman і Newman з інтеграцією в CI/CD, скоротивши обсяг ручної регресії приблизно на 40%.',
            'Проводив валідацію на рівні БД за допомогою PostgreSQL і MongoDB для забезпечення цілісності даних між сервісами.',
            'Тестував сценарії автентифікації та авторизації для захищеного доступу до API.',
            'Досліджував production-дефекти через аналіз логів у Kibana, відстежуючи проблеми між розподіленими сервісами та API-взаємодіями.',
            'Відповідав за якість релізів у середовищах STAGE, PREPROD та PROD.',
            'Тісно співпрацював із бізнес-аналітиками та розробниками для уточнення вимог і зниження якісних ризиків.',
            'Надавав менторську підтримку та практичні рекомендації молодшим QA-інженерам.',
          ],
        },
        {
          title: 'Full Stack JavaScript Developer',
          meta: 'Medical Systems & Government Healthcare Registry | ~1.5 years',
          bullets: [
            'Розробляв RESTful API на Node.js для медичних інформаційних систем.',
            'Імплементував backend-бізнес-логіку для регульованих процесів у сфері охорони здоров’я.',
            'Інтегрував SQL- і NoSQL-бази даних, забезпечуючи надійні та узгоджені потоки даних.',
            'Брав участь в аналізі вимог і технічному проєктуванні разом зі стейкхолдерами.',
          ],
        },
      ],
      technicalTitle: 'ТЕХНІЧНІ НАВИЧКИ',
      technicalBullets: [
        'Тестування: backend-тестування, тестування вебзастосунків, REST / GraphQL / SOAP API, регресійне, інтеграційне, дослідницьке, ризик-орієнтоване тестування.',
        'Автоматизація: Postman, Newman, Selenium WebDriver.',
        'Бази даних: PostgreSQL, MongoDB.',
        'Технології: JavaScript, Node.js, REST API, Git, Docker (базовий рівень), CI/CD-пайплайни.',
        'Системи: мікросервісні архітектури, розподілені платформи, державні інтеграції.',
        'Моніторинг і налагодження: аналіз логів у Kibana.',
      ],
      languagesTitle: 'МОВИ',
      languageBullets: ['Українська - рідна', 'Англійська - середній рівень (B1-B2)'],
      ariaLabel: 'Резюме Сергія Куриленка',
    },
  },
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [isExporting, setIsExporting] = useState(false)
  const [isPdfMode, setIsPdfMode] = useState(false)
  const resumeRef = useRef(null)

  const current = content[lang]

  const handleExportPdf = async () => {
    if (!resumeRef.current || isExporting) return

    setIsExporting(true)
    setIsPdfMode(true)
    let exportHost
    try {
      await new Promise((resolve) => requestAnimationFrame(() => resolve()))
      await new Promise((resolve) => requestAnimationFrame(() => resolve()))
      const exportNode = resumeRef.current.cloneNode(true)
      exportNode.classList.add('pdf-capture')
      exportNode.style.width = '1020px'
      exportNode.style.maxWidth = '1020px'

      exportHost = document.createElement('div')
      exportHost.className = 'pdf-export-host'
      exportHost.appendChild(exportNode)
      document.body.appendChild(exportHost)

      const canvas = await html2canvas(exportNode, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const verticalMargin = 4
      let renderWidth = pageWidth
      let renderHeight = (canvas.height * pageWidth) / canvas.width
      let x = 0
      let y = verticalMargin

      const maxHeight = pageHeight - verticalMargin * 2
      if (renderHeight > maxHeight) {
        renderHeight = maxHeight
        renderWidth = (canvas.width * maxHeight) / canvas.height
        x = (pageWidth - renderWidth) / 2
        y = verticalMargin
      }

      const imageData = canvas.toDataURL('image/png')

      pdf.addImage(imageData, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST')
      pdf.save(`${current.ui.filePrefix}-${lang.toUpperCase()}-A4.pdf`)
    } finally {
      if (exportHost?.parentNode) {
        exportHost.parentNode.removeChild(exportHost)
      }
      setIsPdfMode(false)
      setIsExporting(false)
    }
  }

  return (
    <div className="page">
      <div className="actions">
        <label className="paper-label" htmlFor="lang-select">
          {current.ui.language}
        </label>
        <select
          id="lang-select"
          className="paper-select"
          value={lang}
          onChange={(event) => setLang(event.target.value)}
        >
          <option value="uk">{current.ui.langUa}</option>
          <option value="en">{current.ui.langEn}</option>
        </select>

        <button className="print-btn" type="button" onClick={handleExportPdf} disabled={isExporting}>
          {isExporting ? current.ui.exporting : current.ui.download}
        </button>
      </div>

      <article
        ref={resumeRef}
        className={`resume paper-a4 lang-${lang} ${isPdfMode ? 'pdf-mode' : ''}`}
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

        <Section title={current.sections.coreSkillsTitle}>
          {current.sections.coreSkills.map((item) => (
            <div className="skill-group" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
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

        <Section title={current.sections.technicalTitle}>
          <ul>
            {current.sections.technicalBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={current.sections.languagesTitle}>
          <ul>
            {current.sections.languageBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      </article>
    </div>
  )
}
