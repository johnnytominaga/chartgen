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
import { Trash2, Plus } from 'lucide-react'
import { ChartDataInput } from '@/types/chart'

interface DataTableProps {
  data: ChartDataInput[]
  onChange: (data: ChartDataInput[]) => void
  disabled?: boolean
}

export function DataTable({ data, onChange, disabled }: DataTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

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

  return (
    <div className="space-y-4">
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
                  No data yet. Click &quot;Add Row&quot; to get started.
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
    </div>
  )
}
