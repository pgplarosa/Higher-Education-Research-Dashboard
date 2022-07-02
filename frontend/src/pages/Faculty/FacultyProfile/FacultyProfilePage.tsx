import PeopleIcon from '@mui/icons-material/People';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './FacultyProfilePage.module.scss';
import { useEffect, useState } from 'react';
import { HorizontalStackedBarData } from '../../../components/charts/charts.model';
import { DataTable } from '../../../components/data-table/DataTable';
import { Page } from '../../../components/layout/Page/Page';
import {} from '../../../services/fakeData';
import { Card } from '../../../components/layout/Card/Card';
import { TableData } from '../../../components/data-table/DataTable.model';
import { HorizontalStackedBarChart } from '../../../components/charts/horizontal-stacked-bar-chart/HorizontalStackedBarChart';
import {
    getFacultyEducation,
    getFacultyNetworkData,
    getFacultyProfileTableData,
} from '../../../services/fetchers/faculty';
import { Autocomplete, TextField } from '@mui/material';
import {
    renderWholeNetworkAnalysis,
    renderWholeNetworkAnalysisImages,
    renderGeneralComponentAnalysis,
    renderGeneralComponentAnalysisImages,
    renderClosenessAnalysis,
    renderClosenessAnalysisImages,
    renderNetworkCommunityAnalysis,
    renderListOfCommunities,
    renderNetworkCommunityAnalysisImages,
} from '../Networks/NetworksPage';

export const FacultyProfilePage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });
    const [facultyEducation, setFacultyEducation] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);

    const [sucNetworkData, setSucNetworkData] = useState({});
    const [selectedSUC, setSelectedSUC] = useState(null);

    const handleChangeNetwork = (event, newValue) => {
        setSelectedSUC(sucNetworkData[newValue]);
    };

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        getFacultyNetworkData().then((data) => {
            setSucNetworkData(data);
        });
    }, []);

    useEffect(() => {
        getFacultyProfileTableData().then((data) => {
            setTableData(data);
        });
        getFacultyEducation().then((data) => {
            setFacultyEducation(data);
        });
    }, []);

    return (
        <Page
            mainTitle="Collaboration"
            subtitle="Faculty Profile"
            icon={
                <PeopleIcon
                    sx={{
                        fontSize: '5rem',
                        verticalAlign: 'center',
                    }}
                />
            }
        >
            <div className={styles.tabs}>
                <Tabs
                    value={selectedTab}
                    onChange={handleChangeTab}
                    aria-label="research tabs"
                >
                    <Tab label="Data" />
                    <Tab label="Charts" />
                    <Tab label="Network" />
                </Tabs>
            </div>
            <div className={styles.tab_panels}>
                <div className={styles.data_table} hidden={selectedTab !== 0}>
                    <Card>
                        <DataTable
                            title=""
                            description=""
                            data={tableData}
                            showFilters={true}
                            filters={tableData.columns}
                        />
                    </Card>
                </div>
                <div className={styles.data_charts} hidden={selectedTab !== 1}>
                    <Card>
                        <HorizontalStackedBarChart
                            title="Educational Attainment"
                            data={facultyEducation}
                            showLegends={true}
                            xName="Count of faculty"
                            yName="School"
                        />
                    </Card>
                </div>
                <div className={styles.data_charts} hidden={selectedTab !== 2}>
                    <Card>
                        <Autocomplete
                            disablePortal
                            id="university-network"
                            options={Object.keys(sucNetworkData) || []}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Network"
                                ></TextField>
                            )}
                            onChange={handleChangeNetwork}
                        ></Autocomplete>
                    </Card>
                    {selectedSUC && (
                        <>
                            {selectedSUC.Profile >= 1 && (
                                <>
                                    {renderWholeNetworkAnalysis(selectedSUC)}
                                    {renderWholeNetworkAnalysisImages(
                                        selectedSUC,
                                    )}
                                </>
                            )}
                            {selectedSUC.Profile >= 2 && (
                                <>
                                    {renderGeneralComponentAnalysis(
                                        selectedSUC,
                                    )}
                                    {renderGeneralComponentAnalysisImages(
                                        selectedSUC,
                                    )}
                                    {renderClosenessAnalysis(selectedSUC)}
                                    {renderClosenessAnalysisImages(selectedSUC)}
                                </>
                            )}
                            {selectedSUC.Profile >= 3 && (
                                <>
                                    {renderNetworkCommunityAnalysis(
                                        selectedSUC,
                                    )}
                                    {renderListOfCommunities(
                                        selectedSUC,
                                        'Groups',
                                        'Items',
                                    )}
                                    {renderNetworkCommunityAnalysisImages(
                                        selectedSUC,
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Page>
    );
};
