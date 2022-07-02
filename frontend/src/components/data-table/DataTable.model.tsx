export interface TableData {
    columns: string[];
    rows: Record<string, any>[];
}

export interface SortMeta {
    column: string;
    direction: 'asc' | 'desc';
    active: boolean;
}
