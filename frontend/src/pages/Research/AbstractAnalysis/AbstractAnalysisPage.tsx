import FolderIcon from '@mui/icons-material/Folder';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './AbstractAnalysisPage.module.scss';
import { useEffect, useState } from 'react';
import { ChartTypes } from '../../../components/charts/charts.model';
import HorizontalBarChart from '../../../components/charts/horizontal-bar-chart/HorizontalBarChart';
import { HorizontalStackedBarChart } from '../../../components/charts/horizontal-stacked-bar-chart/HorizontalStackedBarChart';
import { DataTable } from '../../../components/data-table/DataTable';
import { Page } from '../../../components/layout/Page/Page';
import {
    generateFakeTableData,
    generateFakeChartData,
} from '../../../services/fakeData';
import { Card } from '../../../components/layout/Card/Card';
import { TableData } from '../../../components/data-table/DataTable.model';

export const AbstractAnalysisPage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        setTableData(
            generateFakeTableData(
                ['title', 'author', 'field', 'keywords', 'year', 'university'],
                50,
            ),
        );
    }, []);

    return (
        <Page
            mainTitle="Research"
            subtitle="Abstract Analysis"
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
                        <DataTable title="" description="" data={tableData} />
                    </Card>
                </div>
                <div className={styles.data_charts} hidden={selectedTab !== 1}>
                    <Card>
                        <HorizontalStackedBarChart
                            title="Research by SUC"
                            data={generateFakeChartData(
                                ChartTypes.STACKED_BAR,
                                5,
                            )}
                            showLegends={true}
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Top 10 Research Topics"
                            data={generateFakeChartData(ChartTypes.BAR, 10)}
                        />
                    </Card>
                </div>
            </div>
        </Page>
    );
};
