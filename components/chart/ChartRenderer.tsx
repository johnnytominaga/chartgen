'use client'

import { forwardRef } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartType } from '@/types/chart'

interface ChartRendererProps {
  data: Array<{ label: string; value: number }>
  chartType: ChartType
  startAngle?: number
  endAngle?: number
  barRadius?: number
  className?: string
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
]

export const ChartRenderer = forwardRef<HTMLDivElement, ChartRendererProps>(
  ({ data, chartType, startAngle = 0, endAngle = 360, barRadius = 0, className = '' }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div className={`flex items-center justify-center h-[400px] bg-muted rounded-lg ${className}`}>
          <p className="text-muted-foreground">No data to display</p>
        </div>
      )
    }

    const renderChart = () => {
      switch (chartType) {
        case 'line':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )

        case 'bar':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill={COLORS[0]}
                  radius={[barRadius, barRadius, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )

        case 'pie':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  label
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )

        case 'donut':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  label
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )

        default:
          return <p>Unsupported chart type</p>
      }
    }

    return (
      <div ref={ref} className={`w-full ${className}`}>
        {renderChart()}
      </div>
    )
  }
)

ChartRenderer.displayName = 'ChartRenderer'
