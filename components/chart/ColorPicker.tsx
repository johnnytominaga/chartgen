'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, X, RotateCcw } from 'lucide-react'
import { DEFAULT_COLORS } from '@/types/chart'

interface ColorPickerProps {
    colors: string[]
    onChange: (colors: string[]) => void
    disabled?: boolean
}

const PRESETS: { name: string; colors: string[] }[] = [
    { name: 'Default', colors: DEFAULT_COLORS },
    { name: 'Warm', colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#d97706', '#dc2626', '#ea580c', '#ca8a04'] },
    { name: 'Cool', colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#06b6d4', '#0ea5e9', '#14b8a6', '#2dd4bf'] },
    { name: 'Pastel', colors: ['#93c5fd', '#86efac', '#fde68a', '#fca5a5', '#c4b5fd', '#f9a8d4', '#99f6e4', '#fdba74'] },
    { name: 'Monochrome', colors: ['#111827', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'] },
]

export function ColorPicker({ colors, onChange, disabled }: ColorPickerProps) {
    const handleColorChange = (index: number, color: string) => {
        const newColors = [...colors]
        newColors[index] = color
        onChange(newColors)
    }

    const handleAddColor = () => {
        onChange([...colors, '#6b7280'])
    }

    const handleRemoveColor = (index: number) => {
        if (colors.length <= 1) return
        onChange(colors.filter((_, i) => i !== index))
    }

    const handleReset = () => {
        onChange([...DEFAULT_COLORS])
    }

    return (
        <div className="space-y-3">
            <Label>Chart Colors</Label>

            <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                    <div key={index} className="relative group">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            disabled={disabled}
                            className="w-8 h-8 rounded cursor-pointer border border-border p-0"
                        />
                        {colors.length > 1 && (
                            <button
                                onClick={() => handleRemoveColor(index)}
                                disabled={disabled}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full items-center justify-center text-xs hidden group-hover:flex"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddColor}
                    disabled={disabled}
                    className="w-8 h-8"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((preset) => (
                    <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => onChange([...preset.colors])}
                        disabled={disabled}
                        className="h-7 text-xs"
                    >
                        <span
                            className="w-3 h-3 rounded-full mr-1.5 border border-border"
                            style={{ backgroundColor: preset.colors[0] }}
                        />
                        {preset.name}
                    </Button>
                ))}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={disabled}
                    className="h-7 text-xs"
                >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                </Button>
            </div>
        </div>
    )
}
