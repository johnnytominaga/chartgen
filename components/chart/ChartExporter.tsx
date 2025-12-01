'use client'

import { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Copy } from 'lucide-react'
import { generateSVGString, downloadSVG, copySVGToClipboard } from '@/lib/chart-utils'
import { toast } from 'sonner'

interface ChartExporterProps {
  chartRef: RefObject<HTMLDivElement | null>
  chartName: string
  chartType: string
  disabled?: boolean
}

export function ChartExporter({ chartRef, chartName, chartType, disabled }: ChartExporterProps) {
  const handleDownload = () => {
    if (!chartRef.current) {
      toast.error('Chart not found')
      return
    }

    try {
      const svgElement = chartRef.current.querySelector('svg')
      if (!svgElement) {
        toast.error('No SVG element found')
        return
      }

      const svgString = generateSVGString(svgElement)
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `${chartName.replace(/\s+/g, '-')}-${chartType}-${timestamp}.svg`

      downloadSVG(svgString, filename)
      toast.success('Chart downloaded successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download chart')
    }
  }

  const handleCopy = async () => {
    if (!chartRef.current) {
      toast.error('Chart not found')
      return
    }

    try {
      const svgElement = chartRef.current.querySelector('svg')
      if (!svgElement) {
        toast.error('No SVG element found')
        return
      }

      const svgString = generateSVGString(svgElement)
      await copySVGToClipboard(svgString)
      toast.success('Chart copied to clipboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to copy chart')
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleDownload}
        disabled={disabled}
        variant="outline"
        className="flex-1"
      >
        <Download className="h-4 w-4 mr-2" />
        Download SVG
      </Button>
      <Button
        onClick={handleCopy}
        disabled={disabled}
        variant="outline"
        className="flex-1"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy SVG
      </Button>
    </div>
  )
}
