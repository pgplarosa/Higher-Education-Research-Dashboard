import FolderIcon from '@mui/icons-material/Folder';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './ResearchRelevance.module.scss';
import { useEffect, useState } from 'react';
import {
    ChartTypes,
    HorizontalBarData,
} from '../../../components/charts/charts.model';
import HorizontalBarChart from '../../../components/charts/horizontal-bar-chart/HorizontalBarChart';
import { DataTable } from '../../../components/data-table/DataTable';
import { Page } from '../../../components/layout/Page/Page';
import { generateFakeChartData } from '../../../services/fakeData';
import { Card } from '../../../components/layout/Card/Card';
import { TableData } from '../../../components/data-table/DataTable.model';
import {
    getResearchRelevanceChartData,
    getResearchRelevanceCitationsChartData,
    getResearchRelevanceDataTable,
} from '../../../services/fetchers/research';

export const ResearchRelevancePage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });
    const [researchRelevanceData, setResearchRelevanceData] =
        useState<HorizontalBarData>({
            name: '',
            labels: [],
            values: [],
            sort: 'ASC',
        });
    const [citationsData, setCitationsData] = useState<HorizontalBarData>({
        name: '',
        labels: [],
        values: [],
    });

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        // set initial data here
        getResearchRelevanceDataTable().then((data) => {
            setTableData(data);
        });
        getResearchRelevanceChartData().then((data) => {
            setResearchRelevanceData(data);
        });
        getResearchRelevanceCitationsChartData().then((data) => {
            setCitationsData(data);
        });
    }, []);

    return (
        <Page
            mainTitle="Research"
            subtitle="Research Relevance"
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
                        <HorizontalBarChart
                            title="Research Relevance"
                            data={researchRelevanceData}
                            xName="Count of research"
                            yName="Scope"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Citations"
                            data={citationsData}
                            xName="Count of citations"
                            yName="SUC"
                        />
                    </Card>
                </div>
            </div>
        </Page>
    );
};
