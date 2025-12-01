"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart as BarChartIcon } from "lucide-react";
import { ChartType, ChartDataInput } from "@/types/chart";
import { ChartTypeSelector } from "@/components/chart/ChartTypeSelector";
import { ChartAngleControls } from "@/components/chart/ChartAngleControls";
import { BarChartControls } from "@/components/chart/BarChartControls";
import { DataTable } from "@/components/chart/DataTable";
import { CSVUploader } from "@/components/chart/CSVUploader";
import { ChartRenderer } from "@/components/chart/ChartRenderer";
import { ChartExporter } from "@/components/chart/ChartExporter";

export default function Home() {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartName, setChartName] = useState("My Chart");
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [chartData, setChartData] = useState<ChartDataInput[]>([]);
    const [startAngle, setStartAngle] = useState(0);
    const [endAngle, setEndAngle] = useState(360);
    const [barRadius, setBarRadius] = useState(0);

    const handleCSVParsed = (data: ChartDataInput[]) => {
        setChartData(data);
    };

    const isPieOrDonut = chartType === "pie" || chartType === "donut";
    const isBar = chartType === "bar";

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
                        Create Beautiful Charts
                    </h2>
                    <p className="text-muted-foreground">
                        Upload CSV files or manually enter data to create line,
                        bar, pie, and donut charts. Download or copy them as SVG
                        for use anywhere.
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CSVUploader onDataParsed={handleCSVParsed} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Chart Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={chartData}
                                    onChange={setChartData}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {chartData.length > 0 ? (
                                    <ChartRenderer
                                        ref={chartRef}
                                        data={chartData}
                                        chartType={chartType}
                                        startAngle={startAngle}
                                        endAngle={endAngle}
                                        barRadius={barRadius}
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

                        {chartData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Export</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartExporter
                                        chartRef={chartRef}
                                        chartName={chartName}
                                        chartType={chartType}
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
