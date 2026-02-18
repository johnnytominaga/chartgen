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
import { Trash2, Plus, ClipboardPaste, Table as TableIcon, PlusCircle, X } from 'lucide-react'
import { MultiSeriesDataInput } from '@/types/chart'
import { toast } from 'sonner'

interface MultiSeriesDataTableProps {
    data: MultiSeriesDataInput[]
    seriesNames: string[]
    onChange: (data: MultiSeriesDataInput[]) => void
    onSeriesNamesChange: (names: string[]) => void
    disabled?: boolean
}

export function MultiSeriesDataTable({ data, seriesNames, onChange, onSeriesNamesChange, disabled }: MultiSeriesDataTableProps) {
    const [mode, setMode] = useState<'manual' | 'paste'>('manual')
    const [pasteText, setPasteText] = useState('')

    const handleAddRow = () => {
        const newValues: Record<string, number> = {}
        seriesNames.forEach((name) => { newValues[name] = 0 })
        onChange([...data, { label: '', values: newValues }])
    }

    const handleRemoveRow = (index: number) => {
        onChange(data.filter((_, i) => i !== index))
    }

    const handleUpdateLabel = (index: number, label: string) => {
        const newData = [...data]
        newData[index] = { ...newData[index], label }
        onChange(newData)
    }

    const handleUpdateValue = (index: number, seriesName: string, value: string) => {
        const newData = [...data]
        const numValue = parseFloat(value)
        newData[index] = {
            ...newData[index],
            values: { ...newData[index].values, [seriesName]: isNaN(numValue) ? 0 : numValue },
        }
        onChange(newData)
    }

    const handleAddSeries = () => {
        const newName = `Series ${seriesNames.length + 1}`
        onSeriesNamesChange([...seriesNames, newName])
        onChange(data.map((row) => ({
            ...row,
            values: { ...row.values, [newName]: 0 },
        })))
    }

    const handleRemoveSeries = (index: number) => {
        if (seriesNames.length <= 1) return
        const removedName = seriesNames[index]
        const newNames = seriesNames.filter((_, i) => i !== index)
        onSeriesNamesChange(newNames)
        onChange(data.map((row) => {
            const newValues = { ...row.values }
            delete newValues[removedName]
            return { ...row, values: newValues }
        }))
    }

    const handleRenameSeries = (index: number, newName: string) => {
        const oldName = seriesNames[index]
        if (oldName === newName) return
        const newNames = [...seriesNames]
        newNames[index] = newName
        onSeriesNamesChange(newNames)
        onChange(data.map((row) => {
            const newValues: Record<string, number> = {}
            for (const [key, val] of Object.entries(row.values)) {
                newValues[key === oldName ? newName : key] = val
            }
            return { ...row, values: newValues }
        }))
    }

    const parsePastedData = (text: string): { data: MultiSeriesDataInput[]; seriesNames: string[] } => {
        const lines = text.trim().split('\n').filter((line) => line.trim())
        if (lines.length < 2) throw new Error('Need at least a header row and one data row')

        const separator = lines[0].includes('\t') ? '\t' : lines[0].includes(',') ? ',' : lines[0].includes('|') ? '|' : lines[0].includes(';') ? ';' : /\s+/

        const headerParts = lines[0].split(separator).map((s) => s.trim()).filter(Boolean)
        const parsedSeriesNames = headerParts.slice(1)
        if (parsedSeriesNames.length === 0) throw new Error('No series columns found in header')

        const result: MultiSeriesDataInput[] = []
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(separator).map((s) => s.trim())
            const label = parts[0] || `Item ${i}`
            const values: Record<string, number> = {}
            parsedSeriesNames.forEach((name, j) => {
                const num = parseFloat(parts[j + 1] || '0')
                values[name] = isNaN(num) ? 0 : num
            })
            result.push({ label, values })
        }

        return { data: result, seriesNames: parsedSeriesNames }
    }

    const handlePasteData = () => {
        if (!pasteText.trim()) {
            toast.error('Please paste some data first')
            return
        }

        try {
            const parsed = parsePastedData(pasteText)
            if (parsed.data.length === 0) {
                toast.error('No valid data found')
                return
            }
            onChange(parsed.data)
            onSeriesNamesChange(parsed.seriesNames)
            toast.success(`Imported ${parsed.data.length} rows with ${parsed.seriesNames.length} series`)
            setMode('manual')
            setPasteText('')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to parse data')
        }
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
                    <textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder={"Paste multi-series data here...\n\nExample:\nCategory\tSeries A\tSeries B\nQ1\t100\t200\nQ2\t150\t180"}
                        disabled={disabled}
                        className="w-full min-h-[200px] p-3 text-sm border rounded-md resize-y font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                        First row should be headers. First column is labels, remaining columns are series values.
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={handlePasteData} disabled={disabled || !pasteText.trim()} className="flex-1">
                            <ClipboardPaste className="h-4 w-4 mr-2" />
                            Import Data
                        </Button>
                        <Button onClick={() => setPasteText('')} disabled={disabled || !pasteText.trim()} variant="outline">
                            Clear
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead className="min-w-[150px]">Label</TableHead>
                                    {seriesNames.map((name, i) => (
                                        <TableHead key={i} className="min-w-[140px]">
                                            <div className="flex items-center gap-1">
                                                <Input
                                                    value={name}
                                                    onChange={(e) => handleRenameSeries(i, e.target.value)}
                                                    disabled={disabled}
                                                    className="h-7 text-xs font-medium"
                                                />
                                                {seriesNames.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveSeries(i)}
                                                        disabled={disabled}
                                                        className="h-7 w-7 shrink-0"
                                                    >
                                                        <X className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                    <TableHead className="w-[50px]">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleAddSeries}
                                            disabled={disabled}
                                            className="h-7 w-7"
                                            title="Add series"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={seriesNames.length + 3} className="text-center text-muted-foreground py-8">
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
                                                    onChange={(e) => handleUpdateLabel(index, e.target.value)}
                                                    placeholder="Enter label"
                                                    disabled={disabled}
                                                />
                                            </TableCell>
                                            {seriesNames.map((name) => (
                                                <TableCell key={name}>
                                                    <Input
                                                        type="number"
                                                        value={row.values[name] ?? 0}
                                                        onChange={(e) => handleUpdateValue(index, name, e.target.value)}
                                                        placeholder="0"
                                                        disabled={disabled}
                                                        step="0.01"
                                                    />
                                                </TableCell>
                                            ))}
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

                    <Button onClick={handleAddRow} disabled={disabled} variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Row
                    </Button>
                </>
            )}
        </div>
    )
}

