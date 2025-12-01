"use client";

import { ChartType } from "@/types/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ChartTypeSelectorProps {
    value: ChartType;
    onChange: (value: ChartType) => void;
    disabled?: boolean;
}

const chartTypeOptions: {
    value: ChartType;
    label: string;
    description: string;
}[] = [
    {
        value: "line",
        label: "Line Chart",
        description: "Show trends over time",
    },
    {
        value: "bar",
        label: "Bar Chart",
        description: "Compare values across categories",
    },
    {
        value: "pie",
        label: "Pie Chart",
        description: "Show proportions of a whole",
    },
    {
        value: "donut",
        label: "Donut Chart",
        description: "Show proportions with a center hole",
    },
];

export function ChartTypeSelector({
    value,
    onChange,
    disabled,
}: ChartTypeSelectorProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="chart-type">Chart Type</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger id="chart-type" className="w-full">
                    <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                    {chartTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col items-start">
                                <span className="font-medium">
                                    {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {option.description}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
