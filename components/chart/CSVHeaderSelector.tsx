'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CSVHeaderMode } from '@/types/chart'

interface CSVHeaderSelectorProps {
  value: CSVHeaderMode
  onChange: (value: CSVHeaderMode) => void
  disabled?: boolean
}

const headerOptions: {
  value: CSVHeaderMode
  label: string
  description: string
}[] = [
  {
    value: 'row',
    label: 'Header Row',
    description: 'First row contains column names (default)',
  },
  {
    value: 'column',
    label: 'Header Column',
    description: 'First column contains row names (transposed data)',
  },
]

export function CSVHeaderSelector({
  value,
  onChange,
  disabled,
}: CSVHeaderSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="csv-header-mode">CSV Headers</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="csv-header-mode" className="w-full">
          <SelectValue placeholder="Select header mode" />
        </SelectTrigger>
        <SelectContent>
          {headerOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
