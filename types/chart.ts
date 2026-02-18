export type ChartType =
    | "line"
    | "bar"
    | "area"
    | "stacked-bar"
    | "pie"
    | "donut";
export type CSVHeaderMode = "row" | "column";

export interface ChartDataInput {
    label: string;
    value: number;
}

export interface MultiSeriesDataInput {
    label: string;
    values: Record<string, number>;
}

export const DEFAULT_COLORS = [
    "#6565FB", // Fren One Purple
    "#FFB637", // Fren One Orange
    "#FF336D", // Yamata Pink
    "#5FA9A7", // Yamata Green
    "#041336", // Voy Blue
    "#D8F500", // Voy Green
    "#5962FF", // Glint Purple
    "#B3FEA2", // Glint Green
];
