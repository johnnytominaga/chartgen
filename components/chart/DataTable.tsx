'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Plus, ClipboardPaste, Table as TableIcon } from 'lucide-react'
import { ChartDataInput } from '@/types/chart'
import { toast } from 'sonner'

interface DataTableProps {
  data: ChartDataInput[]
  onChange: (data: ChartDataInput[])=> void
  disabled?: boolean
}

export function DataTable({ data, onChange, disabled }: DataTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [mode, setMode] = useState<'manual' | 'paste'>('manual')
  const [pasteText, setPasteText] = useState('')

  const handleAddRow = () => {
    onChange([...data, { label: '', value: 0 }])
    setEditingIndex(data.length)
  }

  const handleRemoveRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index)
    onChange(newData)
    if (editingIndex === index) {
      setEditingIndex(null)
    }
  }

  const handleUpdateRow = (index: number, field: 'label' | 'value', value: string) => {
    const newData = [...data]
    if (field === 'label') {
      newData[index] = { ...newData[index], label: value }
    } else {
      const numValue = parseFloat(value)
      newData[index] = { ...newData[index], value: isNaN(numValue) ? 0 : numValue }
    }
    onChange(newData)
  }

  const parsePastedData = (text: string): ChartDataInput[] => {
    const lines = text.trim().split('\n').filter(line => line.trim())
    const result: ChartDataInput[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Skip potential header rows
      if (i === 0 && (line.toLowerCase().includes('label') || line.toLowerCase().includes('value'))) {
        continue
      }

      // Try different separators: tab, comma, pipe, semicolon, space
      let parts: string[] = []
      if (line.includes('\t')) {
        parts = line.split('\t')
      } else if (line.includes(',')) {
        parts = line.split(',')
      } else if (line.includes('|')) {
        parts = line.split('|')
      } else if (line.includes(';')) {
        parts = line.split(';')
      } else {
        parts = line.split(/\s+/)
      }

      parts = parts.map(p => p.trim()).filter(p => p)

      if (parts.length >= 2) {
        const label = parts[0]
        const value = parseFloat(parts[1])
        if (!isNaN(value)) {
          result.push({ label, value })
        }
      } else if (parts.length === 1) {
        const value = parseFloat(parts[0])
        if (!isNaN(value)) {
          result.push({ label: `Item ${i + 1}`, value })
        }
      }
    }

    return result
  }

  const handlePasteData = () => {
    if (!pasteText.trim()) {
      toast.error('Please paste some data first')
      return
    }

    try {
      const parsed = parsePastedData(pasteText)
      if (parsed.length === 0) {
        toast.error('No valid data found. Please check your format.')
        return
      }

      onChange(parsed)
      toast.success(`Successfully imported ${parsed.length} rows`)
      setMode('manual')
      setPasteText('')
    } catch (error) {
      toast.error('Failed to parse data. Please check the format.')
    }
  }

  const handleClearPaste = () => {
    setPasteText('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === 'manual' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('manual')}
          disabled={disabled}
          className="flex-1"
        >
          <TableIcon className="h-4 w-4 mr-2" />
          Manual Entry
        </Button>
        <Button
          variant={mode === 'paste' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('paste')}
          disabled={disabled}
          className="flex-1"
        >
          <ClipboardPaste className="h-4 w-4 mr-2" />
          Paste Data
        </Button>
      </div>

      {mode === 'paste' ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your data here...&#10;&#10;Examples:&#10;January	100&#10;February	150&#10;&#10;Or:&#10;January, 100&#10;February, 150"
              disabled={disabled}
              className="w-full min-h-[200px] p-3 text-sm border rounded-md resize-y font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Paste tab-separated, comma-separated, or space-separated data. Format: label, value (one per line)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePasteData}
              disabled={disabled || !pasteText.trim()}
              className="flex-1"
            >
              <ClipboardPaste className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button
              onClick={handleClearPaste}
              disabled={disabled || !pasteText.trim()}
              variant="outline"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No data yet. Click &quot;Add Row&quot; or use &quot;Paste Data&quot; to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={row.label}
                          onChange={(e) => handleUpdateRow(index, 'label', e.target.value)}
                          placeholder="Enter label"
                          disabled={disabled}
                          className="min-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.value}
                          onChange={(e) => handleUpdateRow(index, 'value', e.target.value)}
                          placeholder="Enter value"
                          disabled={disabled}
                          className="min-w-[120px]"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRow(index)}
                          disabled={disabled}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Button
            onClick={handleAddRow}
            disabled={disabled}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </>
      )}
    </div>
  )
}
