'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'

interface ChartAngleControlsProps {
  startAngle: number
  endAngle: number
  onStartAngleChange: (angle: number) => void
  onEndAngleChange: (angle: number) => void
}

export function ChartAngleControls({
  startAngle,
  endAngle,
  onStartAngleChange,
  onEndAngleChange,
}: ChartAngleControlsProps) {
  const handleReset = () => {
    onStartAngleChange(0)
    onEndAngleChange(360)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Chart Angles</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-xs"
        >
          <RotateCw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-angle" className="text-xs">
            Start Angle (0-360°)
          </Label>
          <Input
            id="start-angle"
            type="number"
            min="0"
            max="360"
            value={startAngle}
            onChange={(e) => onStartAngleChange(Number(e.target.value))}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-angle" className="text-xs">
            End Angle (0-360°)
          </Label>
          <Input
            id="end-angle"
            type="number"
            min="0"
            max="360"
            value={endAngle}
            onChange={(e) => onEndAngleChange(Number(e.target.value))}
            className="h-9"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onStartAngleChange(0)
            onEndAngleChange(360)
          }}
          className="flex-1 h-8 text-xs"
        >
          Full Circle
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onStartAngleChange(0)
            onEndAngleChange(180)
          }}
          className="flex-1 h-8 text-xs"
        >
          Half Circle
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onStartAngleChange(0)
            onEndAngleChange(270)
          }}
          className="flex-1 h-8 text-xs"
        >
          3/4 Circle
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Angles are measured clockwise from the top (12 o&apos;clock position)
      </p>
    </div>
  )
}
