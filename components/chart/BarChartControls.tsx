'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

interface BarChartControlsProps {
  barRadius: number
  onBarRadiusChange: (radius: number) => void
}

export function BarChartControls({
  barRadius,
  onBarRadiusChange,
}: BarChartControlsProps) {
  const handleReset = () => {
    onBarRadiusChange(0)
  }

  const presets = [
    { label: 'Sharp', value: 0 },
    { label: 'Slightly Rounded', value: 4 },
    { label: 'Rounded', value: 8 },
    { label: 'Very Rounded', value: 16 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Bar Corner Radius</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Label htmlFor="bar-radius" className="text-xs whitespace-nowrap">
            Radius (0-20px)
          </Label>
          <Input
            id="bar-radius"
            type="range"
            min="0"
            max="20"
            value={barRadius}
            onChange={(e) => onBarRadiusChange(Number(e.target.value))}
            className="flex-1"
          />
          <Input
            type="number"
            min="0"
            max="20"
            value={barRadius}
            onChange={(e) => onBarRadiusChange(Number(e.target.value))}
            className="w-16 h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            onClick={() => onBarRadiusChange(preset.value)}
            className="h-8 text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Higher values create more rounded corners on the bars
      </p>
    </div>
  )
}
