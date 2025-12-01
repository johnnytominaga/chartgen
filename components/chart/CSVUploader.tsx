'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, X } from 'lucide-react'
import Papa from 'papaparse'
import { ChartDataInput } from '@/types/chart'
import { validateCSVData } from '@/lib/chart-utils'
import { toast } from 'sonner'

interface CSVUploaderProps {
  onDataParsed: (data: ChartDataInput[]) => void
  disabled?: boolean
}

export function CSVUploader({ onDataParsed, disabled }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setFileName(file.name)
    setIsLoading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const validatedData = validateCSVData(results.data)
          onDataParsed(validatedData)
          toast.success(`Successfully loaded ${validatedData.length} rows from CSV`)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to parse CSV')
          setFileName(null)
        } finally {
          setIsLoading(false)
        }
      },
      error: (error) => {
        toast.error(`Error reading CSV: ${error.message}`)
        setFileName(null)
        setIsLoading(false)
      },
    })
  }

  const handleClear = () => {
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!fileName ? (
        <Button
          onClick={handleFileSelect}
          disabled={disabled || isLoading}
          variant="outline"
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? 'Loading...' : 'Upload CSV File'}
        </Button>
      ) : (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">{fileName}</span>
          <Button
            onClick={handleClear}
            disabled={disabled}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        CSV should have columns for labels and values. First two columns will be used if no standard headers found.
      </p>
    </div>
  )
}
