import { ChartDataInput } from '@/types/chart'

export function validateCSVData(parsedData: unknown[]): ChartDataInput[] {
  if (!Array.isArray(parsedData) || parsedData.length === 0) {
    throw new Error('CSV file is empty or invalid')
  }

  const result: ChartDataInput[] = []

  for (let i = 0; i < parsedData.length; i++) {
    const row = parsedData[i] as Record<string, unknown>

    // Try to find label and value columns (flexible column names)
    const labelKey = Object.keys(row).find(key =>
      key.toLowerCase().includes('label') ||
      key.toLowerCase().includes('name') ||
      key.toLowerCase().includes('category')
    ) || Object.keys(row)[0]

    const valueKey = Object.keys(row).find(key =>
      key.toLowerCase().includes('value') ||
      key.toLowerCase().includes('amount') ||
      key.toLowerCase().includes('count')
    ) || Object.keys(row)[1]

    if (!labelKey || !valueKey) {
      throw new Error(`Row ${i + 1}: Could not find label and value columns`)
    }

    const label = String(row[labelKey] || '').trim()
    const value = Number(row[valueKey])

    if (!label) {
      throw new Error(`Row ${i + 1}: Label is empty`)
    }

    if (isNaN(value)) {
      throw new Error(`Row ${i + 1}: Value is not a valid number`)
    }

    result.push({ label, value })
  }

  return result
}

export function generateSVGString(svgElement: SVGSVGElement): string {
  const serializer = new XMLSerializer()
  let svgString = serializer.serializeToString(svgElement)

  // Add XML declaration
  svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString

  return svgString
}

export function downloadSVG(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function copySVGToClipboard(svgString: string): Promise<void> {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/svg+xml': blob })
  ])
}
