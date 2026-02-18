'use client'

import { forwardRef } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
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
import { ChartType, MultiSeriesDataInput, DEFAULT_COLORS } from '@/types/chart'

interface ChartRendererProps {
    data: Array<{ label: string; value: number }>
    chartType: ChartType
    startAngle?: number
    endAngle?: number
    barRadius?: number
    colors?: string[]
    fontFamily?: string
    fontSize?: number
    textColor?: string
    multiSeriesData?: MultiSeriesDataInput[]
    seriesNames?: string[]
    className?: string
}

export const ChartRenderer = forwardRef<HTMLDivElement, ChartRendererProps>(
    ({ data, chartType, startAngle = 0, endAngle = 360, barRadius = 0, colors, fontFamily, fontSize, textColor, multiSeriesData, seriesNames, className = '' }, ref) => {
        const palette = colors && colors.length > 0 ? colors : DEFAULT_COLORS

        const textStyle: Record<string, string | number> = {}
        if (fontFamily) textStyle.fontFamily = fontFamily
        if (fontSize) textStyle.fontSize = fontSize
        if (textColor) textStyle.fill = textColor

        const hasTextStyle = Object.keys(textStyle).length > 0
        const tickStyle = hasTextStyle ? textStyle : undefined
        const legendStyle: Record<string, string | number> = {}
        if (fontFamily) legendStyle.fontFamily = fontFamily
        if (fontSize) legendStyle.fontSize = fontSize
        if (textColor) legendStyle.color = textColor
        const legendWrapperStyle = Object.keys(legendStyle).length > 0 ? legendStyle : undefined
        const tooltipStyle: Record<string, string | number> = {}
        if (fontFamily) tooltipStyle.fontFamily = fontFamily
        if (fontSize) tooltipStyle.fontSize = fontSize
        if (textColor) tooltipStyle.color = textColor
        const tooltipContentStyle = Object.keys(tooltipStyle).length > 0 ? tooltipStyle : undefined

        const isMultiSeries = chartType === 'stacked-bar' && multiSeriesData && multiSeriesData.length > 0 && seriesNames && seriesNames.length > 0
        const hasData = isMultiSeries || (data && data.length > 0)

        if (!hasData) {
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
                                <XAxis dataKey="label" tick={tickStyle} />
                                <YAxis tick={tickStyle} />
                                <Tooltip contentStyle={tooltipContentStyle} />
                                <Legend wrapperStyle={legendWrapperStyle} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={palette[0]}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )

                case 'area':
                    return (
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={tickStyle} />
                                <YAxis tick={tickStyle} />
                                <Tooltip contentStyle={tooltipContentStyle} />
                                <Legend wrapperStyle={legendWrapperStyle} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={palette[0]}
                                    fill={palette[0]}
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )

                case 'bar':
                    return (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={tickStyle} />
                                <YAxis tick={tickStyle} />
                                <Tooltip contentStyle={tooltipContentStyle} />
                                <Legend wrapperStyle={legendWrapperStyle} />
                                <Bar
                                    dataKey="value"
                                    fill={palette[0]}
                                    radius={[barRadius, barRadius, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )

                case 'stacked-bar': {
                    if (!isMultiSeries) {
                        return (
                            <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
                                <p className="text-muted-foreground">Add multi-series data for stacked bar chart</p>
                            </div>
                        )
                    }

                    const flatData = multiSeriesData!.map((item) => ({
                        label: item.label,
                        ...item.values,
                    }))

                    return (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={flatData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={tickStyle} />
                                <YAxis tick={tickStyle} />
                                <Tooltip contentStyle={tooltipContentStyle} />
                                <Legend wrapperStyle={legendWrapperStyle} />
                                {seriesNames!.map((name, index) => {
                                    const isLast = index === seriesNames!.length - 1
                                    return (
                                        <Bar
                                            key={name}
                                            dataKey={name}
                                            stackId="stack"
                                            fill={palette[index % palette.length]}
                                            radius={isLast ? [barRadius, barRadius, 0, 0] : [0, 0, 0, 0]}
                                        />
                                    )
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    )
                }

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
                                        <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipContentStyle} />
                                <Legend wrapperStyle={legendWrapperStyle} />
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
                                        <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipContentStyle} />
                                <Legend wrapperStyle={legendWrapperStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    )

                default:
                    return <p>Unsupported chart type</p>
            }
        }

        return (
            <div ref={ref} className={`w-full ${className}`} style={hasTextStyle ? { fontFamily, fontSize, color: textColor } : undefined}>
                {renderChart()}
            </div>
        )
    }
)

ChartRenderer.displayName = 'ChartRenderer'
