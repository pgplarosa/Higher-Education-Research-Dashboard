import { FilterType } from './Filters';

export interface FiltersProps {
    filters: string[];
    filtersToDisplay?: string[];
    data: any[];
    onFilterChange?: (filters: FilterType) => void;
}
