export type ChartType = 'line' | 'bar' | 'pie' | 'donut'
export type CSVHeaderMode = 'row' | 'column'

export interface ChartDataInput {
  label: string
  value: number
}
