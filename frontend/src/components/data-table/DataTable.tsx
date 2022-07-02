import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    styled,
    TableFooter,
} from '@mui/material';
import { COLOR_GROUPS, COLOR_MAPPING } from '../../services/colorService';
import { Chart } from '../charts/Chart';

import TablePagination from '@mui/material/TablePagination';
import { DataTableType, DataTableProps } from '../charts/charts.model';
import { SortMeta } from './DataTable.model';
import { Filters, FilterType } from '../layout/Filters/Filters';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: COLOR_MAPPING[COLOR_GROUPS.BASIC_GREEN][3],
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
        width: '10px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        whiteSpace: 'nowrap',
        width: '10px',
    },
}));

export const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(
        props.initialRow || 10,
    );
    const [displayedData, setDisplayedData] = React.useState(props.data);
    const [pagination, setPagination] = React.useState<DataTableType[]>([]); // chunks
    const [filters, setFilters] = React.useState<FilterType>({});
    const [totalNumberOfRecords, setTotalNumberOfRecords] = React.useState(0);
    const [openViewDialog, setOpenViewDialog] = React.useState(false);
    const [viewDialogData, setViewDialogData] = React.useState<{
        title: string;
        content: any;
    }>({ title: '', content: '' });

    // sort states
    const [activeSort, setActiveSort] = React.useState<SortMeta | null>(null);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (filters: FilterType) => {
        setFilters(filters);
    };

    React.useEffect(() => {
        setPagination(chunkArray(props.data, rowsPerPage)); // set chunks
        setTotalNumberOfRecords(props.data.rows.length);
    }, [props, rowsPerPage]);

    React.useEffect(() => {
        setDisplayedData(pagination[page]);
    }, [pagination, page]);

    React.useEffect(() => {
        setPagination((prevPagination) => {
            return activeSort
                ? chunkArray(
                      sortDataByColumn(
                          props.data,
                          activeSort.column,
                          activeSort.direction,
                      ),
                      rowsPerPage,
                  )
                : prevPagination;
        });
    }, [props, activeSort, rowsPerPage]);

    const filterData = (data: any, filters: FilterType) => {
        return {
            columns: data.columns,
            rows: data.rows.filter((row) => {
                return Object.entries(filters)
                    .map(([filter, validValues]) => {
                        return validValues.length
                            ? validValues.includes(row[filter])
                            : true;
                    })
                    .every(Boolean);
            }),
        };
    };

    const createFunctionViewMore = (title: string, content: string) => {
        return () => {
            setOpenViewDialog(true);
            setViewDialogData({ title, content });
        };
    };

    const contractedText = (
        text: string,
        seeMoreHandler,
        maxCharacters: number = 200,
    ) => {
        if (typeof text === typeof 'string') {
            if (text.length > maxCharacters) {
                return (
                    <span>
                        {`${text.slice(0, maxCharacters)}...`}
                        <a
                            style={{ color: 'blue', cursor: 'pointer' }}
                            onClick={seeMoreHandler}
                        >
                            more
                        </a>
                    </span>
                );
            } else {
                return text;
            }
        } else {
            return text;
        }
    };

    React.useEffect(() => {
        if (!!!Object.keys(filters).length) {
            setPagination(chunkArray(props.data, rowsPerPage));
            setTotalNumberOfRecords(props.data.rows.length);
        } else {
            const filteredData = filterData(props.data, filters);
            setPagination(chunkArray(filteredData, rowsPerPage));
            setTotalNumberOfRecords(filteredData.rows.length);
        }
        setPage(0);
    }, [filters]);

    // actions
    const sortDataAction = (column) => {
        return () => {
            setActiveSort((previousActiveSort) => {
                if (
                    previousActiveSort &&
                    previousActiveSort?.column === column
                ) {
                    return {
                        column,
                        direction:
                            previousActiveSort.direction === 'asc'
                                ? 'desc'
                                : 'asc',
                        active: true,
                    };
                }

                return {
                    column,
                    direction: 'asc',
                    active: true,
                };
            });
        };
    };

    // utilities
    const chunkArray = (
        arr: DataTableType,
        chunkSize: number,
    ): DataTableType[] => {
        if (chunkSize <= 1 || chunkSize >= arr.rows.length) {
            return [arr];
        }

        const chunks = [];

        for (let i = 0; i < arr.rows.length; i += chunkSize) {
            chunks.push(arr.rows.slice(i, i + chunkSize));
        }

        return chunks.map((chunk) => ({
            columns: arr.columns,
            rows: chunk,
        }));
    };

    const sortDataByColumn = (
        data: DataTableType,
        column: string,
        direction: 'asc' | 'desc',
    ): DataTableType => {
        return {
            columns: data.columns,
            rows: data.rows.sort((a, b) => {
                const aString = '' + a[column];
                const bString = '' + b[column];
                const aIsNaN = isNaN(parseInt(aString));
                const bIsNaN = isNaN(parseInt(bString));
                if (aIsNaN || bIsNaN) {
                    return direction === 'asc'
                        ? aString.localeCompare(bString)
                        : bString.localeCompare(aString);
                } else if (!aIsNaN && !bIsNaN) {
                    return direction === 'asc'
                        ? parseInt(aString) - parseInt(bString)
                        : parseInt(bString) - parseInt(aString);
                } else {
                    return 0;
                }
            }),
        };
    };

    return (
        <Chart {...props}>
            {props.showFilters && props.filters && (
                <Filters
                    data={props.data.rows}
                    filters={displayedData?.columns.filter((column) =>
                        props.filters?.includes(column),
                    )}
                    onFilterChange={handleFilterChange}
                ></Filters>
            )}
            <Dialog
                open={openViewDialog}
                onClose={handleCloseViewDialog}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}
                maxWidth={'xl'}
            >
                <DialogTitle>{viewDialogData.title}</DialogTitle>
                <DialogContent>
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                        {viewDialogData.content}
                    </p>
                </DialogContent>
            </Dialog>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {(displayedData as DataTableType)?.columns.map(
                                (column, index) => (
                                    <StyledTableCell key={`header-${index}`}>
                                        <p>
                                            {column.toUpperCase()}
                                            <TableSortLabel
                                                active={
                                                    activeSort?.column ===
                                                    column
                                                        ? activeSort.active
                                                        : false
                                                }
                                                direction={
                                                    activeSort?.column ===
                                                    column
                                                        ? activeSort.direction
                                                        : 'asc'
                                                }
                                                onClick={sortDataAction(column)}
                                            ></TableSortLabel>
                                        </p>
                                    </StyledTableCell>
                                ),
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(displayedData as DataTableType)?.rows.map(
                            (row, index) => (
                                <StyledTableRow key={index}>
                                    {(
                                        displayedData as DataTableType
                                    )?.columns.map((column) => (
                                        <TableCell key={`${index}-${column}`}>
                                            {row[column] !== '' && row[column]
                                                ? contractedText(
                                                      row[column],
                                                      createFunctionViewMore(
                                                          column,
                                                          row[column],
                                                      ),
                                                  )
                                                : '⁠—'}
                                        </TableCell>
                                    ))}
                                </StyledTableRow>
                            ),
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={
                                    (displayedData as DataTableType)?.columns
                                        .length
                                }
                            >
                                <TablePagination
                                    SelectProps={{
                                        disabled: !!Object.values(
                                            filters,
                                        ).filter((f) => !!f.length).length,
                                    }}
                                    component="div"
                                    count={totalNumberOfRecords || 0}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={
                                        handleChangeRowsPerPage
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Chart>
    );
};
