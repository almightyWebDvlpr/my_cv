import './App.css'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { AlignmentType, BorderStyle, Document, Packer, Paragraph, TextRun } from 'docx'

const Section = ({ title, children }) => (
  <section className="section">
    <h2>{title}</h2>
    {children}
  </section>
)

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const buildDocxDocument = (current) => {
  const headingText = (text) =>
    new TextRun({
      text,
      bold: true,
      color: '1F2933',
      size: 23,
    })

    

  const sectionHeading = (title) =>
    new Paragraph({
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: 'E5E7EB',
          style: BorderStyle.SINGLE,
          size: 6,
          space: 1,
        },
      },
      children: [headingText(title)],
    })

  const bodyParagraph = (text, options = {}) =>
    new Paragraph({
      spacing: { after: 110, line: 320 },
      children: [new TextRun({ text, size: 22 })],
      ...options,
    })

  const bulletParagraph = (text) =>
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 70, line: 300 },
      indent: { left: 360, hanging: 180 },
      children: [new TextRun({ text, size: 22 })],
    })

  const children = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: current.name,
          bold: true,
          color: '2F5BD3',
          size: 42,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 90 },
      children: [
        new TextRun({
          text: current.role,
          bold: true,
          size: 25,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `${current.contactPrefix} | s.kurylenko.mail@gmail.com | +380 63 439 0602`,
          size: 20,
          color: '6B7280',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: 'linkedin.com/in/сергій-куриленко-b25a52235 | @serhii_kurylenko',
          size: 20,
          color: '6B7280',
        }),
      ],
    }),
  ]

  children.push(sectionHeading(current.sections.summaryTitle))
  current.sections.summary.forEach((paragraph) => {
    children.push(bodyParagraph(paragraph))
  })

  children.push(sectionHeading(current.sections.coreSkillsTitle))
  current.sections.coreSkills.forEach((item) => {
    children.push(
      bodyParagraph(item.text, {
        children: [
          new TextRun({ text: `${item.title}: `, bold: true, size: 22 }),
          new TextRun({ text: item.text, size: 22 }),
        ],
      }),
    )
  })

  children.push(sectionHeading(current.sections.experienceTitle))
  current.sections.jobs.forEach((job, index) => {
    children.push(
      new Paragraph({
        spacing: { before: index === 0 ? 40 : 180, after: 40 },
        keepNext: true,
        children: [new TextRun({ text: job.title, bold: true, size: 26, color: '1F2933' })],
      }),
    )
    children.push(
      new Paragraph({
        spacing: { after: 90 },
        keepNext: true,
        children: [new TextRun({ text: job.meta, italics: true, size: 20, color: '6B7280' })],
      }),
    )
    job.bullets.forEach((bullet) => {
      children.push(bulletParagraph(bullet))
    })
  })

  children.push(sectionHeading(current.sections.technicalTitle))
  current.sections.technicalBullets.forEach((item) => {
    children.push(bulletParagraph(item))
  })

  children.push(sectionHeading(current.sections.testingApproachTitle))
  current.sections.testingApproachBullets.forEach((item) => {
    children.push(bulletParagraph(item))
  })

  children.push(sectionHeading(current.sections.domainExperienceTitle))
  current.sections.domainExperienceBullets.forEach((item) => {
    children.push(bulletParagraph(item))
  })

  children.push(sectionHeading(current.sections.languagesTitle))
  current.sections.languageBullets.forEach((item) => {
    children.push(bulletParagraph(item))
  })

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080,
              right: 1080,
              bottom: 1080,
              left: 1080,
            },
          },
        },
        children,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: current.name === 'СЕРГІЙ КУРИЛЕНКО' ? 'e-Ukraine' : 'Calibri',
            size: 22,
            color: '2B2F36',
          },
          paragraph: {
            spacing: {
              line: 320,
            },
          },
        },
      },
    },
  })
}

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
      exportType: 'Export:',
      download: 'Export Resume',
      exporting: 'Exporting...',
      langUa: 'Ukrainian',
      langEn: 'English',
      exportPdf: 'PDF',
      exportDocx: 'DOCX',
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
        'QA Engineer with 5+ years of experience ensuring quality, reliability, and data integrity in distributed, regulated healthcare systems.',
        'Specialize in backend/API testing, frontend validation, cross-service data consistency, and building scalable automated regression pipelines.',
        'Focused on preventing production incidents, ensuring end-to-end system reliability, and reducing business risk through early defect detection.',
        'Act as a technical reference point for complex issues, accelerating root cause analysis and improving release stability across environments.',
        'Background in Node.js development enables deep understanding of backend architecture, integrations, and failure points in distributed systems.',
      ],
      coreSkillsTitle: 'TECHNICAL EXPERTISE',
      coreSkills: [
        {
          title: 'Backend & API Testing',
          text: 'REST, GraphQL, SOAP, authentication/authorization flows. Regression testing (functional & integration), negative testing, edge cases. Contract validation, API consistency checks',
        },
        {
          title: 'Frontend Testing & Validation',
          text: 'UI/UX validation, cross-browser testing, DevTools (network/debugging), integration testing (UI ↔ API), DOM inspection',
        },
        {
          title: 'Data Integrity & Validation',
          text: 'PostgreSQL, MongoDB, cross-service consistency checks, transactional validation',
        },
        {
          title: 'Automation & Engineering',
          text: 'Postman (advanced scripting for workflow automation, dynamic test flows, data-driven testing, Visualizer), Newman (CLI execution for automated runs), Python test automation frameworks (Cucumber / BDD), test framework maintenance and support, CI/CD integration and support for Python-based automation framework',
        },
        {
          title: 'Complex Scenario Testing & Simulation',
          text: 'Simulation of real-world business scenarios and edge conditions. Reproducing production-like situations to identify hidden defects. Testing non-standard and critical scenarios in distributed systems',
        },
        {
          title: 'Debugging & Observability',
          text: 'Log analysis (Kibana), network tracing, distributed systems debugging, root cause analysis',
        },
        {
          title: 'Architecture & Systems',
          text: 'Microservices (~8 services), distributed systems, async workflows, government integrations (Trembita)',
        },
        {
          title: 'Tools & Technologies',
          text: 'JavaScript (Node.js), Python (test automation), Git, Docker (basic), Chrome DevTools',
        },
      ],
      experienceTitle: 'PROFESSIONAL EXPERIENCE',
      jobs: [
        {
          title: 'QA Engineer',
          meta: 'State Enterprise "Electronic Health" (eZdorovya), National eHealth System of Ukraine | 2021 - Present',
          bullets: [
            'Owned backend/API and frontend quality across 30+ APIs and ~8 microservices, ensuring stable integrations and consistent user-facing behavior.',
            'Ensured release stability across STAGE / PREPROD / PROD, supporting up to 8 releases per cycle.',
            'Validated complex business logic in regulated and compliance-heavy environment.',
            'Performed end-to-end testing (UI ↔ API ↔ database), ensuring full system integrity.',
            'Performed regression testing (functional and integration) across backend services, ensuring stability of critical workflows.',
            'Simulated complex and edge-case scenarios to reproduce production-like conditions and identify hidden defects in distributed systems.',
            'Built API automation workflows using Postman (advanced scripting) and Newman for CLI execution, reducing manual regression by ~40%.',
            'Supported and maintained Python-based BDD automation framework (Cucumber), including CI/CD integration and stability improvements.',
            'Performed deep data validation across PostgreSQL and MongoDB, ensuring consistency between services.',
            'Investigated production-critical defects, performing root cause analysis across distributed systems.',
            'Improved logging and debugging workflows in Postman and browser DevTools, reducing investigation time.',
            'Developed internal tools/scripts for test data generation and validation, accelerating QA processes.',
            'Tested authentication and authorization mechanisms for secure API access.',
            'Acted as a go-to engineer for complex integration and production issues.',
            'Collaborated with developers and business analysts to challenge requirements and prevent defects early.',
            'Mentored junior QA engineers and contributed to QA process improvements.',
          ],
        },
        {
          title: 'Full Stack JavaScript Developer',
          meta: 'Healthcare Systems / Government Registries | ~1.5 years',
          bullets: [
            'Developed RESTful APIs using Node.js.',
            'Implemented backend business logic for regulated healthcare workflows.',
            'Worked with frontend components and integrations.',
            'Integrated SQL and NoSQL databases ensuring reliable and consistent data flows.',
            'Participated in system design and requirements analysis.',
          ],
        },
      ],
      technicalTitle: 'KEY IMPACT',
      technicalBullets: [
        'Reduced manual regression effort by ~40% through API automation',
        'Improved end-to-end system reliability (UI ↔ API ↔ DB)',
        'Improved data consistency across distributed services',
        'Increased release stability across STAGE / PREPROD / PROD environments',
        'Accelerated debugging and issue resolution',
        'Contributed to stability of BDD-based automation framework',
        'Acted as a go-to engineer for complex production and integration issues',
      ],
      testingApproachTitle: 'TESTING APPROACH',
      testingApproachBullets: [
        'Risk-based testing',
        'Integration & regression testing',
        'Exploratory testing',
        'Data-driven validation',
        'End-to-end system validation',
        'Production-focused quality assurance',
      ],
      domainExperienceTitle: 'DOMAIN EXPERIENCE',
      domainExperienceBullets: [
        'Healthcare systems',
        'GovTech platforms',
        'Regulated and high-reliability environments',
      ],
      languagesTitle: 'LANGUAGES',
      languageBullets: ['Ukrainian - Native', 'English - Intermediate (B1-B2)'],
      ariaLabel: 'Serhii Kurylenko CV',
    },
  },
  uk: {
    ui: {
      language: 'Мова:',
      exportType: 'Експорт:',
      download: 'Експортувати резюме',
      exporting: 'Експорт...',
      langUa: 'Українська',
      langEn: 'Англійська',
      exportPdf: 'PDF',
      exportDocx: 'DOCX',
      filePrefix: 'Serhii-Kurylenko-CV',
      phoneLabel: 'Телефон',
      telegramLabel: 'Telegram',
    },
    name: 'СЕРГІЙ КУРИЛЕНКО',
    role: 'Інженер із забезпечення якості - Backend / API / Дані та автоматизація',
    contactPrefix: 'Віддалено | Україна',
    sections: {
      summaryTitle: 'ПРОФЕСІЙНЕ РЕЗЮМЕ',
      summary: [
        'QA Engineer із понад 5 роками досвіду забезпечення якості, надійності та цілісності даних у розподілених регульованих системах охорони здоров’я.',
        'Спеціалізуюся на тестуванні backend/API, валідації frontend-рішень, перевірці узгодженості даних між сервісами та побудові масштабованих автоматизованих регресійних конвеєрів.',
        'Зосереджений на запобіганні інцидентам у продуктивному середовищі, забезпеченні наскрізної надійності системи та зниженні бізнес-ризиків завдяки ранньому виявленню дефектів.',
        'Виступаю технічною опорною точкою у вирішенні складних проблем, пришвидшую аналіз першопричин і підвищую стабільність релізів у різних середовищах.',
        'Досвід розробки на Node.js забезпечує глибоке розуміння архітектури backend-систем, інтеграцій і типових точок відмови в розподілених системах.',
      ],
      coreSkillsTitle: 'ТЕХНІЧНА ЕКСПЕРТИЗА',
      coreSkills: [
        {
          title: 'Backend та API-тестування',
          text: 'REST, GraphQL, SOAP, сценарії автентифікації та авторизації. Регресійне тестування (функціональне та інтеграційне), негативне тестування, граничні випадки. Валідація контрактів, перевірка узгодженості API',
        },
        {
          title: 'Frontend-тестування та валідація',
          text: 'Валідація UI/UX, кросбраузерне тестування, DevTools (мережа та налагодження), інтеграційне тестування (UI ↔ API), аналіз DOM',
        },
        {
          title: 'Цілісність даних та валідація',
          text: 'PostgreSQL, MongoDB, перевірка консистентності між сервісами, транзакційна валідація',
        },
        {
          title: 'Автоматизація та інженерія',
          text: 'Postman (розширене скриптування для автоматизації процесів тестування, динамічних сценаріїв, перевірок на основі даних, Visualizer), Newman (CLI-запуск автоматизованих прогонів), Python-фреймворки тестової автоматизації (Cucumber / BDD), підтримка й розвиток тестового фреймворку, інтеграція та супровід Python-фреймворку автоматизації в CI/CD',
        },
        {
          title: 'Тестування складних сценаріїв та моделювання',
          text: 'Моделювання реальних бізнес-сценаріїв і граничних умов. Відтворення умов, наближених до продуктивного середовища, для виявлення прихованих дефектів. Тестування нестандартних і критичних сценаріїв у розподілених системах',
        },
        {
          title: 'Налагодження та спостережуваність',
          text: 'Аналіз логів (Kibana), трасування мережевих взаємодій, налагодження розподілених систем, аналіз першопричин',
        },
        {
          title: 'Архітектура та системи',
          text: 'Мікросервіси (~8 сервісів), розподілені системи, асинхронні процеси, державні інтеграції (Трембіта)',
        },
        {
          title: 'Інструменти та технології',
          text: 'JavaScript (Node.js), Python (тестова автоматизація), Git, Docker (базовий рівень), Chrome DevTools',
        },
      ],
      experienceTitle: 'ПРОФЕСІЙНИЙ ДОСВІД',
      jobs: [
        {
          title: 'QA Engineer',
          meta: 'ДП "Електронне здоров’я" (eZdorovya), Національна електронна система охорони здоров’я України | 2021 - дотепер',
          bullets: [
            'Відповідав за якість backend/API та frontend-рішень у межах 30+ API і ~8 мікросервісів, забезпечуючи стабільність інтеграцій і послідовну поведінку користувацьких сценаріїв.',
            'Забезпечував стабільність релізів у середовищах STAGE / PREPROD / PROD, підтримуючи до 8 релізів у межах одного циклу.',
            'Валідував складну бізнес-логіку в регульованому середовищі з високими комплаєнс-вимогами.',
            'Проводив наскрізне тестування (UI ↔ API ↔ база даних), забезпечуючи повну цілісність системи.',
            'Виконував регресійне тестування (функціональне та інтеграційне) backend-сервісів, забезпечуючи стабільність критичних процесів.',
            'Моделював складні та граничні сценарії, відтворюючи умови, наближені до продуктивного середовища, для виявлення прихованих дефектів у розподілених системах.',
            'Побудував автоматизовані API-процеси на базі Postman (розширене скриптування) і Newman для CLI-запуску, скоротивши обсяг ручної регресії приблизно на 40%.',
            'Підтримував і розвивав BDD-фреймворк автоматизації на Python (Cucumber), включно з інтеграцією в CI/CD та підвищенням його стабільності.',
            'Проводив глибоку валідацію даних у PostgreSQL і MongoDB, забезпечуючи узгодженість між сервісами.',
            'Досліджував критичні дефекти продуктивного середовища, виконуючи аналіз першопричин у розподілених системах.',
            'Покращував процеси логування та налагодження в Postman і браузерних DevTools, скорочуючи час розслідування дефектів.',
            'Розробляв внутрішні інструменти та скрипти для генерації й валідації тестових даних, прискорюючи QA-процеси.',
            'Тестував механізми автентифікації та авторизації для безпечного доступу до API.',
            'Був основним технічним фахівцем для вирішення складних інтеграційних проблем та інцидентів у продуктивному середовищі.',
            'Працював разом із розробниками та бізнес-аналітиками над критичним переглядом вимог і раннім запобіганням дефектам.',
            'Менторив молодших QA-інженерів і долучався до вдосконалення QA-процесів.',
          ],
        },
        {
          title: 'Full Stack JavaScript Developer',
          meta: 'Системи охорони здоров’я / державні реєстри | ~1,5 року',
          bullets: [
            'Розробляв RESTful API на Node.js.',
            'Реалізовував backend-бізнес-логіку для регульованих процесів у сфері охорони здоров’я.',
            'Працював із frontend-компонентами та інтеграціями.',
            'Інтегрував SQL- і NoSQL-бази даних, забезпечуючи надійні та узгоджені потоки даних.',
            'Брав участь у проєктуванні системи та аналізі вимог.',
          ],
        },
      ],
      technicalTitle: 'КЛЮЧОВИЙ ВПЛИВ',
      technicalBullets: [
        'Скоротив обсяг ручної регресії приблизно на 40% завдяки API-автоматизації',
        'Покращив наскрізну надійність системи (UI ↔ API ↔ DB)',
        'Підвищив узгодженість даних між розподіленими сервісами',
        'Підвищив стабільність релізів у середовищах STAGE / PREPROD / PROD',
        'Прискорив налагодження та вирішення інцидентів',
        'Зробив внесок у стабільність BDD-фреймворку автоматизації',
        'Був ключовим технічним фахівцем у вирішенні складних виробничих та інтеграційних інцидентів',
      ],
      testingApproachTitle: 'ПІДХІД ДО ТЕСТУВАННЯ',
      testingApproachBullets: [
        'Ризик-орієнтоване тестування',
        'Інтеграційне та регресійне тестування',
        'Дослідницьке тестування',
        'Валідація на основі даних',
        'Наскрізна валідація системи',
        'Забезпечення якості з фокусом на продуктивне середовище',
      ],
      domainExperienceTitle: 'ДОМЕННИЙ ДОСВІД',
      domainExperienceBullets: [
        'Системи охорони здоров’я',
        'GovTech-платформи',
        'Регульовані та високонадійні середовища',
      ],
      languagesTitle: 'МОВИ',
      languageBullets: ['Українська - рідна', 'Англійська - середній рівень (B1-B2)'],
      ariaLabel: 'Резюме Сергія Куриленка',
    },
  },
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [exportFormat, setExportFormat] = useState('pdf')
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
      exportNode.style.width = '1320px'
      exportNode.style.maxWidth = '1320px'

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
      const horizontalMargin = 6
      const verticalMargin = 4
      let renderWidth = pageWidth - horizontalMargin * 2
      let renderHeight = (canvas.height * renderWidth) / canvas.width
      let x = horizontalMargin
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

  const handleExportDocx = async () => {
    const doc = buildDocxDocument(current)
    const blob = await Packer.toBlob(doc)
    saveBlob(blob, `${current.ui.filePrefix}-${lang.toUpperCase()}.docx`)
  }

  const handleExportResume = async () => {
    if (isExporting) return

    setIsExporting(true)
    try {
      if (exportFormat === 'pdf') {
        await handleExportPdf()
        return
      }

      if (exportFormat === 'docx') {
        await handleExportDocx()
        return
      }
    } finally {
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

        <label className="paper-label" htmlFor="export-format-select">
          {current.ui.exportType}
        </label>
        <select
          id="export-format-select"
          className="paper-select"
          value={exportFormat}
          onChange={(event) => setExportFormat(event.target.value)}
        >
          <option value="pdf">{current.ui.exportPdf}</option>
          <option value="docx">{current.ui.exportDocx}</option>
        </select>

        <button className="print-btn" type="button" onClick={handleExportResume} disabled={isExporting}>
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

        <Section title={current.sections.testingApproachTitle}>
          <ul>
            {current.sections.testingApproachBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={current.sections.domainExperienceTitle}>
          <ul>
            {current.sections.domainExperienceBullets.map((item) => (
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
