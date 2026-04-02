import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const CONTACT_LINE_1 = 's.kurylenko.mail@gmail.com | +380 63 439 0602'
const CONTACT_LINE_2 = 'linkedin.com/in/сергій-куриленко-b25a52235 | @serhii_kurylenko'

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

const createCaptureNode = ({ sourceNode, captureWidth }) => {
  const exportNode = sourceNode.cloneNode(true)
  exportNode.classList.remove('export-source', 'lens-enabled')
  exportNode.classList.add('pdf-capture', 'pdf-clean')
  exportNode.querySelectorAll('.is-active, .is-dimmed').forEach((node) => {
    node.classList.remove('is-active', 'is-dimmed')
  })
  exportNode.style.width = `${captureWidth}px`
  exportNode.style.maxWidth = `${captureWidth}px`
  exportNode.style.opacity = '1'
  exportNode.style.position = 'static'
  exportNode.style.left = 'auto'
  exportNode.style.top = 'auto'

  const exportHost = document.createElement('div')
  exportHost.className = 'pdf-export-host'
  exportHost.style.width = `${captureWidth}px`
  exportHost.appendChild(exportNode)
  document.body.appendChild(exportHost)

  return { exportNode, exportHost }
}

export const exportStyledPdf = async ({
  sourceNode,
  current,
  lang,
  captureWidth = 1180,
  horizontalMargin = 5,
  verticalMargin = 5,
}) => {
  const { exportNode, exportHost } = createCaptureNode({ sourceNode, captureWidth })

  try {
    const canvas = await html2canvas(exportNode, {
      scale: 2.5,
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
    const maxWidth = pageWidth - horizontalMargin * 2
    const maxHeight = pageHeight - verticalMargin * 2

    let renderWidth = maxWidth
    let renderHeight = (canvas.height * renderWidth) / canvas.width

    if (renderHeight > maxHeight) {
      renderHeight = maxHeight
      renderWidth = (canvas.width * renderHeight) / canvas.height
    }

    const x = (pageWidth - renderWidth) / 2
    const y = (pageHeight - renderHeight) / 2
    const imageData = canvas.toDataURL('image/png')

    pdf.addImage(imageData, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST')
    pdf.save(`${current.ui.filePrefix}-${lang.toUpperCase()}-A4.pdf`)
  } finally {
    exportHost.remove()
  }
}

export const exportDocx = async ({ current, lang }) => {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    Packer,
    Paragraph,
    TextRun,
  } = await import('docx')

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
          text: `${current.contactPrefix} | ${CONTACT_LINE_1}` ,
          size: 20,
          color: '6B7280',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: CONTACT_LINE_2,
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

  children.push(sectionHeading(current.sections.educationTitle))
  current.sections.educationEntries.forEach((item, index) => {
    children.push(
      new Paragraph({
        spacing: { before: index === 0 ? 40 : 160, after: 30 },
        keepNext: true,
        children: [new TextRun({ text: item.institution, bold: true, size: 24, color: '1F2933' })],
      }),
    )
    children.push(
      new Paragraph({
        spacing: { after: 30 },
        children: [new TextRun({ text: item.program, size: 22 })],
      }),
    )
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: item.period, size: 20, color: '6B7280' })],
      }),
    )
  })

  ;[
    [current.sections.technicalTitle, current.sections.technicalBullets],
    [current.sections.languagesTitle, current.sections.languageBullets],
  ].forEach(([title, items]) => {
    children.push(sectionHeading(title))
    items.forEach((item) => {
      children.push(bulletParagraph(item))
    })
  })

  const doc = new Document({
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
            font: lang === 'uk' ? 'e-Ukraine' : 'Calibri',
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

  const blob = await Packer.toBlob(doc)
  saveBlob(blob, `${current.ui.filePrefix}-${lang.toUpperCase()}.docx`)
}
