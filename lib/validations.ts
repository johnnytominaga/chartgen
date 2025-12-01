import { z } from 'zod'

export const chartTypeSchema = z.enum(['line', 'bar', 'pie', 'donut'])

export const chartDataInputSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.number().min(0, 'Value must be non-negative'),
})

export type ChartTypeSchema = z.infer<typeof chartTypeSchema>
export type ChartDataInputSchema = z.infer<typeof chartDataInputSchema>
