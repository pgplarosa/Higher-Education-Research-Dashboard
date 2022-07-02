export enum ChartTypes {
    BAR,
    STACKED_BAR,
    LINE,
}

export interface ChartProps {
    readonly title?: string;
    readonly showFilters?: boolean;
    readonly showLegends?: boolean;
    readonly filters?: string[];
    readonly description?: string;
    readonly xName?: string;
    readonly yName?: string;
}

export interface HorizontalBarChartProps extends ChartProps {
    readonly data?: any;
}

export interface HorizontalStackedBarChartProps extends ChartProps {
    readonly data?: any;
}

export interface DataTableProps extends ChartProps {
    readonly data?: any;
    readonly initialRow?: number;
}

export interface DataTableType {
    columns: string[];
    rows: [];
}

export interface ChartData {
    labels: any[]; // positional values
    values: any[]; // positional values - will correspond to the label position
    name?: string;
}

export interface HorizontalBarData extends ChartData {
    sort?: 'ASC' | 'DESC';
}

export type HorizontalStackedBarData = ChartData[]; // Stacked bar receives multiple data with static labels
export type LineData = ChartData;
