import EqualizerIcon from '@mui/icons-material/Equalizer';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './UtilizationPage.module.scss';
import { useEffect, useState } from 'react';
import {
    ChartData,
    HorizontalBarData,
    HorizontalStackedBarData,
} from '../../../components/charts/charts.model';
import HorizontalBarChart from '../../../components/charts/horizontal-bar-chart/HorizontalBarChart';
import { DataTable } from '../../../components/data-table/DataTable';
import { Page } from '../../../components/layout/Page/Page';
import { Card } from '../../../components/layout/Card/Card';
import { TableData } from '../../../components/data-table/DataTable.model';
import {
    getNumberOfProductsPerUniversityData,
    getTopBeneficiariesData,
    getTopicsData,
    getYearlyUtilizationData,
    getUtilizationTableData,
} from '../../../services/fetchers/metrics';
import { HorizontalStackedBarChart } from '../../../components/charts/horizontal-stacked-bar-chart/HorizontalStackedBarChart';
import { LineChart } from '../../../components/charts/line-chart/LineChart';

export const UtilizationPage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });
    const [productTypesPerUniversityData, setProductTypesPerUniversityData] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);
    const [topTopicsData, setTopTopicsData] = useState<HorizontalBarData>({
        labels: [],
        values: [],
    });
    const [topBeneficiaries, setTopBeneficiaries] = useState<HorizontalBarData>(
        {
            labels: [],
            values: [],
        },
    );
    const [yearlyUtilizationData, setYearlyUtilizationData] =
        useState<ChartData>({
            labels: [],
            values: [],
        });

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        // set initial data here
        getUtilizationTableData().then((data) => {
            setTableData(data);
        });
        getNumberOfProductsPerUniversityData().then((data) => {
            setProductTypesPerUniversityData(data);
        });
        getTopicsData().then((data) => {
            setTopTopicsData(data);
        });
        getTopBeneficiariesData().then((data) => {
            setTopBeneficiaries(data);
        });
        getYearlyUtilizationData().then((data) => {
            setYearlyUtilizationData(data);
        });
    }, []);

    return (
        <Page
            mainTitle="Metrics"
            subtitle="Utilization"
            icon={
                <EqualizerIcon
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
                            title="Number of Products/Services per University"
                            data={productTypesPerUniversityData}
                            showLegends={true}
                            xName="Count of product and service"
                            yName="School"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Top Topics - Products and Services"
                            data={topTopicsData}
                            xName="Count of research"
                            yName="Product and service"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Top Beneficiaries per University"
                            data={topBeneficiaries}
                            xName="Count of beneficiaries"
                            yName="Beneficiaries"
                        />
                    </Card>
                    <Card>
                        <LineChart
                            title="Yearly Utilization"
                            data={yearlyUtilizationData}
                            xName="Year"
                            yName="Count of beneficiaries"
                        />
                    </Card>
                </div>
            </div>
        </Page>
    );
};
