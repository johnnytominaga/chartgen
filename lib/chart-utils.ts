import { ChartDataInput, CSVHeaderMode } from '@/types/chart'

function parseNumericValue(rawValue: unknown): number {
  if (typeof rawValue === 'number') {
    return Number.isFinite(rawValue) ? rawValue : NaN
  }

  if (typeof rawValue !== 'string') {
    return NaN
  }

  const trimmed = rawValue.trim()
  if (!trimmed) {
    return NaN
  }

  let isNegative = false
  let cleaned = trimmed
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    isNegative = true
    cleaned = cleaned.slice(1, -1)
  }

  cleaned = cleaned.replace(/\s|\u00a0/g, '')
  if (cleaned.endsWith('-')) {
    isNegative = true
    cleaned = cleaned.slice(0, -1)
  }

  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')
  if (hasComma && !hasDot && /,\d{1,2}$/.test(cleaned)) {
    cleaned = cleaned.replace(',', '.')
  } else if (hasComma) {
    cleaned = cleaned.replace(/,/g, '')
  }

  cleaned = cleaned.replace(/[^0-9.+-Ee]/g, '')
  if (!cleaned) {
    return NaN
  }

  const parsed = Number(cleaned)
  if (!Number.isFinite(parsed)) {
    return NaN
  }

  return isNegative ? -parsed : parsed
}

function findHeaderRowIndex(
  rows: string[][],
  candidates: string[],
): number | null {
  for (let i = 0; i < rows.length; i++) {
    const headerCell = rows[i][0]?.toLowerCase() ?? ''
    if (candidates.some((candidate) => headerCell.includes(candidate))) {
      return i
    }
  }

  return null
}

function parseColumnHeaderCSVData(parsedData: unknown[]): ChartDataInput[] {
  if (!Array.isArray(parsedData) || parsedData.length === 0) {
    throw new Error('CSV file is empty or invalid')
  }

  const rows = parsedData
    .map((row) =>
      Array.isArray(row)
        ? row.map((cell) => String(cell ?? '').trim())
        : []
    )
    .filter((row) => row.some((cell) => cell.length > 0))

  if (rows.length < 2) {
    throw new Error('CSV must include at least two rows for labels and values')
  }

  const labelRowIndex =
    findHeaderRowIndex(rows, ['label', 'name', 'category']) ?? 0
  const valueRowIndex =
    findHeaderRowIndex(rows, ['value', 'amount', 'count']) ??
    (labelRowIndex === 0 ? 1 : 0)

  if (labelRowIndex === valueRowIndex) {
    throw new Error('CSV must include separate label and value rows')
  }

  const labelRow = rows[labelRowIndex]
  const valueRow = rows[valueRowIndex]
  const columnCount = Math.max(labelRow.length, valueRow.length)
  const result: ChartDataInput[] = []

  for (let i = 1; i < columnCount; i++) {
    const label = String(labelRow[i] ?? '').trim()
    const rawValue = valueRow[i]

    if (!label && (!rawValue || String(rawValue).trim().length === 0)) {
      continue
    }

    if (!label) {
      throw new Error(`Column ${i + 1}: Label is empty`)
    }

    const value = parseNumericValue(rawValue)
    if (isNaN(value)) {
      throw new Error(`Column ${i + 1}: Value is not a valid number`)
    }

    result.push({ label, value })
  }

  if (result.length === 0) {
    throw new Error('No valid label/value pairs found in CSV')
  }

  return result
}

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
    const value = parseNumericValue(row[valueKey])

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

export function parseCSVData(
  parsedData: unknown[],
  headerMode: CSVHeaderMode,
): ChartDataInput[] {
  return headerMode === 'column'
    ? parseColumnHeaderCSVData(parsedData)
    : validateCSVData(parsedData)
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
  // Use writeText for better browser compatibility
  await navigator.clipboard.writeText(svgString)
}
