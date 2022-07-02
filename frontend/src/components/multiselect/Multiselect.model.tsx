export interface MultiselectProps {
    label?: string;
    options: any[];
    datakey: string;
    placeholder?: string;
    className?: any;
    onSelectChange?: (change: MultiSelectChange) => void;
}

export interface MultiSelectChange {
    key: string;
    selected: any[];
}
