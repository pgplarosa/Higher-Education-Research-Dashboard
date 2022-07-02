import { useEffect, useState } from 'react';
import { Multiselect } from '../../multiselect/Multiselect';
import { MultiSelectChange } from '../../multiselect/Multiselect.model';
import { FiltersProps } from './Filters.model';
import styles from './Filters.module.scss';

export type FilterType = Record<string, any[]>;

export const Filters: React.FunctionComponent<FiltersProps> = (props) => {
    const groupedOptions = groupOptions(props.filters, props.data);
    const [selectedFilters, setSelectedFilters] = useState<FilterType>({});

    useEffect(() => {
        if (props.onFilterChange) {
            props.onFilterChange(selectedFilters);
        }
    }, [selectedFilters]);

    const handleFilterChange = (change: MultiSelectChange) => {
        setSelectedFilters((prevFilter) => {
            return { ...prevFilter, [change.key]: change.selected };
        });
    };

    return (
        <div className={styles.component}>
            {props.filters?.map((filter) => (
                <Multiselect
                    className={styles.filter}
                    datakey={filter}
                    key={filter}
                    options={groupedOptions[filter] || []}
                    label={`${filter}`}
                    onSelectChange={handleFilterChange}
                ></Multiselect>
            ))}
        </div>
    );
};

const groupOptions = (
    keys: string[],
    data: any[],
): Record<string, string[]> => {
    return keys?.reduce((grouped, key) => {
        if (data?.length) {
            grouped[key] = [];
            data.forEach((datum) => {
                grouped[key].push(datum[key]);
            });
            grouped[key] = [...new Set(grouped[key])].filter(Boolean);
        }
        return grouped;
    }, {});
};
