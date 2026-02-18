"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart as BarChartIcon, Sparkles } from "lucide-react";
import {
    ChartType,
    ChartDataInput,
    MultiSeriesDataInput,
    CSVHeaderMode,
    DEFAULT_COLORS,
} from "@/types/chart";
import { ChartTypeSelector } from "@/components/chart/ChartTypeSelector";
import { CSVHeaderSelector } from "@/components/chart/CSVHeaderSelector";
import { ChartAngleControls } from "@/components/chart/ChartAngleControls";
import { BarChartControls } from "@/components/chart/BarChartControls";
import { DataTable } from "@/components/chart/DataTable";
import { MultiSeriesDataTable } from "@/components/chart/MultiSeriesDataTable";
import { CSVUploader } from "@/components/chart/CSVUploader";
import { ChartRenderer } from "@/components/chart/ChartRenderer";
import { ChartExporter } from "@/components/chart/ChartExporter";
import { ColorPicker } from "@/components/chart/ColorPicker";
import { FontSelector } from "@/components/chart/FontSelector";

export default function Home() {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartName, setChartName] = useState("My Chart");
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [chartData, setChartData] = useState<ChartDataInput[]>([]);
    const [multiSeriesData, setMultiSeriesData] = useState<
        MultiSeriesDataInput[]
    >([]);
    const [seriesNames, setSeriesNames] = useState<string[]>([
        "Series 1",
        "Series 2",
    ]);
    const [csvHeaderMode, setCsvHeaderMode] = useState<CSVHeaderMode>("row");
    const [startAngle, setStartAngle] = useState(0);
    const [endAngle, setEndAngle] = useState(360);
    const [barRadius, setBarRadius] = useState(0);
    const [chartColors, setChartColors] = useState<string[]>([
        ...DEFAULT_COLORS,
    ]);
    const [chartFont, setChartFont] = useState("");
    const [chartFontSize, setChartFontSize] = useState(12);
    const [chartTextColor, setChartTextColor] = useState("#374151");

    const handleCSVParsed = (data: ChartDataInput[]) => {
        setChartData(data);
    };

    const handleMultiSeriesCSVParsed = (
        data: MultiSeriesDataInput[],
        names: string[]
    ) => {
        setMultiSeriesData(data);
        setSeriesNames(names);
    };

    const handleGenerateSampleData = () => {
        const rand = (min: number, max: number) =>
            Math.round(min + Math.random() * (max - min));

        const labels = [
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            ["Product A", "Product B", "Product C", "Product D", "Product E"],
            ["Q1", "Q2", "Q3", "Q4"],
            ["Mon", "Tue", "Wed", "Thu", "Fri"],
            ["North", "South", "East", "West"],
        ];
        const picked = labels[Math.floor(Math.random() * labels.length)];

        if (isStackedBar) {
            const names = ["Revenue", "Costs", "Profit"];
            setSeriesNames(names);
            setMultiSeriesData(
                picked.map((label) => ({
                    label,
                    values: {
                        Revenue: rand(200, 600),
                        Costs: rand(100, 400),
                        Profit: rand(50, 250),
                    },
                }))
            );
        } else {
            setChartData(
                picked.map((label) => ({
                    label,
                    value: rand(20, 500),
                }))
            );
        }
    };

    const isPieOrDonut = chartType === "pie" || chartType === "donut";
    const isBar = chartType === "bar" || chartType === "stacked-bar";
    const isStackedBar = chartType === "stacked-bar";

    const hasData = isStackedBar
        ? multiSeriesData.length > 0
        : chartData.length > 0;

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-2">
                        <BarChartIcon className="h-8 w-8" />
                        <h1 className="text-2xl font-bold">
                            Kilonova ChartGen
                        </h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Create Charts for Figma
                    </h2>
                    <p className="text-muted-foreground">
                        Upload CSV files or manually enter data to create line,
                        bar, area, stacked bar, pie, and donut charts. Download
                        or copy them as SVG and paste them into Figma to edit
                        colors, fonts, etc.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chart Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="chart-name">
                                        Chart Name
                                    </Label>
                                    <Input
                                        id="chart-name"
                                        value={chartName}
                                        onChange={(e) =>
                                            setChartName(e.target.value)
                                        }
                                        placeholder="My Awesome Chart"
                                    />
                                </div>

                                <ChartTypeSelector
                                    value={chartType}
                                    onChange={(value) => setChartType(value)}
                                />
                                <CSVHeaderSelector
                                    value={csvHeaderMode}
                                    onChange={(value) =>
                                        setCsvHeaderMode(value)
                                    }
                                />

                                {isPieOrDonut && (
                                    <div className="pt-4 border-t">
                                        <ChartAngleControls
                                            startAngle={startAngle}
                                            endAngle={endAngle}
                                            onStartAngleChange={setStartAngle}
                                            onEndAngleChange={setEndAngle}
                                        />
                                    </div>
                                )}

                                {isBar && (
                                    <div className="pt-4 border-t">
                                        <BarChartControls
                                            barRadius={barRadius}
                                            onBarRadiusChange={setBarRadius}
                                        />
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <ColorPicker
                                        colors={chartColors}
                                        onChange={setChartColors}
                                    />
                                </div>

                                <div className="pt-4 border-t space-y-4">
                                    <FontSelector
                                        value={chartFont}
                                        onChange={setChartFont}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="font-size">
                                                Font Size
                                            </Label>
                                            <Input
                                                id="font-size"
                                                type="number"
                                                min={4}
                                                max={32}
                                                value={chartFontSize}
                                                onChange={(e) =>
                                                    setChartFontSize(
                                                        Number(
                                                            e.target.value
                                                        ) || 12
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="text-color">
                                                Text Color
                                            </Label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    id="text-color"
                                                    value={chartTextColor}
                                                    onChange={(e) =>
                                                        setChartTextColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-10 h-10 rounded cursor-pointer border border-border p-0"
                                                />
                                                <Input
                                                    value={chartTextColor}
                                                    onChange={(e) =>
                                                        setChartTextColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CSVUploader
                                    onDataParsed={handleCSVParsed}
                                    onMultiSeriesDataParsed={
                                        handleMultiSeriesCSVParsed
                                    }
                                    headerMode={csvHeaderMode}
                                    isMultiSeries={isStackedBar}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Chart Data</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateSampleData}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Sample Data
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isStackedBar ? (
                                    <MultiSeriesDataTable
                                        data={multiSeriesData}
                                        seriesNames={seriesNames}
                                        onChange={setMultiSeriesData}
                                        onSeriesNamesChange={setSeriesNames}
                                    />
                                ) : (
                                    <DataTable
                                        data={chartData}
                                        onChange={setChartData}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {hasData ? (
                                    <ChartRenderer
                                        ref={chartRef}
                                        data={chartData}
                                        chartType={chartType}
                                        startAngle={startAngle}
                                        endAngle={endAngle}
                                        barRadius={barRadius}
                                        colors={chartColors}
                                        fontFamily={chartFont || undefined}
                                        fontSize={chartFontSize}
                                        textColor={chartTextColor}
                                        multiSeriesData={multiSeriesData}
                                        seriesNames={seriesNames}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
                                        <p className="text-muted-foreground">
                                            Add data to see your chart
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {hasData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Export</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartExporter
                                        chartRef={chartRef}
                                        chartName={chartName}
                                        chartType={chartType}
                                        fontFamily={chartFont || undefined}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <footer className="border-t mt-16">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-sm text-muted-foreground">
                        Create charts instantly without any database or account
                        needed
                    </p>
                </div>
            </footer>
        </div>
    );
}
