import FolderIcon from '@mui/icons-material/Folder';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './PatentsPage.module.scss';
import { useEffect, useState } from 'react';
import {
    ChartTypes,
    HorizontalBarData,
    HorizontalStackedBarData,
} from '../../../components/charts/charts.model';
import HorizontalBarChart from '../../../components/charts/horizontal-bar-chart/HorizontalBarChart';
import { DataTable } from '../../../components/data-table/DataTable';
import { Page } from '../../../components/layout/Page/Page';
import { generateFakeChartData } from '../../../services/fakeData';
import { Card } from '../../../components/layout/Card/Card';
import { TableData } from '../../../components/data-table/DataTable.model';
import { HorizontalStackedBarChart } from '../../../components/charts/horizontal-stacked-bar-chart/HorizontalStackedBarChart';
import { LineChart } from '../../../components/charts/line-chart/LineChart';
import {
    getNumberOfPatentsPerStatus,
    getNumberOfPatentsPerType,
    getNumberOfTypesPerUniversity,
    getPatentsForecastData,
    getPatentsTableData,
} from '../../../services/fetchers/research';

export const PatentsPage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });
    const [patentNumberOfTypesPerUnivData, setPatentNumberOfTypesPerUnivData] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);
    const [patentsPerType, setPatentsPerType] = useState<HorizontalBarData>({
        labels: [],
        values: [],
    });
    const [patentsPerStatus, setPatentsPerStatus] = useState<HorizontalBarData>(
        {
            labels: [],
            values: [],
        },
    );
    const [patentsForecastData, setPatentsForecastData] =
        useState<HorizontalBarData>({
            labels: [],
            values: [],
        });

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        getPatentsTableData().then((data) => {
            setTableData(data);
        });
        getNumberOfTypesPerUniversity().then((data) => {
            setPatentNumberOfTypesPerUnivData(data);
        });
        getNumberOfPatentsPerType().then((data) => {
            setPatentsPerType(data);
        });
        getNumberOfPatentsPerStatus().then((data) => {
            setPatentsPerStatus(data);
        });
        getPatentsForecastData().then((data) => {
            setPatentsForecastData(data);
        });
    }, []);

    return (
        <Page
            mainTitle="Research"
            subtitle="Patents"
            icon={
                <FolderIcon
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
                            title="Number of Types per University"
                            data={patentNumberOfTypesPerUnivData}
                            showLegends={true}
                            xName="Patent type"
                            yName="School"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Number of Patents per Type"
                            data={patentsPerType}
                            xName="Count of research"
                            yName="Patent type"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Number of Patents per Status"
                            data={patentsPerStatus}
                            xName="Count of patents"
                            yName="Status"
                        />
                    </Card>
                    <Card>
                        <LineChart
                            title="Patent Count Forecast"
                            data={patentsForecastData}
                            xName="Year"
                            yName="Count of patents"
                        />
                    </Card>
                </div>
            </div>
        </Page>
    );
};
