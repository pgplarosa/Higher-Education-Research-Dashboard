import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { MultiselectProps } from './Multiselect.model';

export const Multiselect: React.FunctionComponent<MultiselectProps> = (
    props,
) => {
    return (
        <Autocomplete
            {...props}
            multiple
            fullWidth
            id={props.datakey}
            options={props.options}
            filterSelectedOptions
            sx={{ boxSizing: 'content-box' }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                    placeholder={props.placeholder}
                    sx={{ boxSizing: 'content-box' }}
                />
            )}
            onChange={(event, newValue) => {
                if (props.onSelectChange) {
                    props.onSelectChange({
                        key: props.datakey,
                        selected: newValue,
                    });
                }
            }}
        />
    );
};
