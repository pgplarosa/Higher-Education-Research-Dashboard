import EqualizerIcon from '@mui/icons-material/Equalizer';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './ResearchCost.module.scss';
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
    getResearchCostRegionTableData,
    getResearchCostTableData,
    getResearchCostUnivTableData,
    getResearchFundingData,
    getResearchFundingForecastData,
    getResearchFundingSourceData,
    getResearchFundingTypeData,
} from '../../../services/fetchers/metrics';
import { HorizontalStackedBarChart } from '../../../components/charts/horizontal-stacked-bar-chart/HorizontalStackedBarChart';
import { LineChart } from '../../../components/charts/line-chart/LineChart';
import { Autocomplete, TextField } from '@mui/material';
import { ScatterChart } from '../../../components/charts/scatter-chart/ScatterChart';

export const ResearchCostPage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });

    const [selectedRatioType, setSelectedRatioType] = useState(null);
    const [selectedRatioTypeChart, setSelectedRatioTypeChart] = useState(null);

    const [researchCostUnivData, setResearchCostUnivData] = useState<TableData>(
        {
            columns: [],
            rows: [],
        },
    );

    // x is budget
    // y is count
    const [scatterData, setScatterData] = useState<
        { x: number; y: number; name: any }[]
    >([]);

    const [researchCostRegionData, setResearchCostRegionData] =
        useState<TableData>({
            columns: [],
            rows: [],
        });

    useEffect(() => {
        // set scatter dataset
        if (selectedRatioTypeChart === 'University') {
            setScatterData(
                parseRatioData(
                    researchCostUnivData,
                    'Total Budget',
                    'Research Count',
                    'University',
                ),
            );
        } else if (selectedRatioTypeChart === 'Region') {
            setScatterData(
                parseRatioData(
                    researchCostRegionData,
                    'Total Budget',
                    'Research Count',
                    'Region',
                ),
            );
        }
    }, [selectedRatioTypeChart]);

    const parseRatioData = (data, x, y, name) => {
        return data.rows.map((row) => ({
            x: row[x],
            y: row[y],
            name: row[name],
        }));
    };

    const handleChangeRatioType = (event, newValue) => {
        setSelectedRatioType(newValue);
    };
    const handleChangeRatioTypeChart = (event, newValue) => {
        setSelectedRatioTypeChart(newValue);
    };

    const [researchFundingData, setResearchFundingData] =
        useState<HorizontalBarData>({
            labels: [],
            values: [],
        });
    const [researchFundingTypeData, setResearchFundingTypeData] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);
    const [researchFundingSourceData, setResearchFundingSourceData] =
        useState<HorizontalBarData>({
            labels: [],
            values: [],
        });
    const [researchFundingForecastData, setResearchFundingForecastData] =
        useState<ChartData>({
            labels: [],
            values: [],
        });

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        // set initial data here
        getResearchCostTableData().then((data) => {
            setTableData(data);
        });
        getResearchFundingData().then((data) => {
            setResearchFundingData(data);
        });
        getResearchFundingTypeData().then((data) => {
            setResearchFundingTypeData(data);
        });
        getResearchFundingSourceData().then((data) => {
            setResearchFundingSourceData(data);
        });
        getResearchFundingForecastData().then((data) => {
            setResearchFundingForecastData(data);
        });
        getResearchCostUnivTableData().then((data) =>
            setResearchCostUnivData(data),
        );
        getResearchCostRegionTableData().then((data) =>
            setResearchCostRegionData(data),
        );
    }, []);

    return (
        <Page
            mainTitle="Metrics"
            subtitle="Research Cost"
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
                    <Tab label="Ratio Data" />
                    <Tab label="Ratio Charts" />
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
                            title="Research Funding"
                            data={researchFundingData}
                            xName="Amount in Pesos"
                            yName="Research"
                        />
                    </Card>
                    <Card>
                        <HorizontalStackedBarChart
                            title="Funding Type"
                            data={researchFundingTypeData}
                            showLegends={true}
                            xName="Count of research"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Funding Source"
                            data={researchFundingSourceData}
                            xName="Count of research"
                            yName="Funding source"
                        />
                    </Card>
                    <Card>
                        <LineChart
                            title="Funding Forecast"
                            data={researchFundingForecastData}
                            xName="Year"
                            yName="Amount in Pesos"
                        />
                    </Card>
                </div>
                <div className={styles.data_table} hidden={selectedTab !== 2}>
                    <Card>
                        <Autocomplete
                            disablePortal
                            id="university-network"
                            options={['University', 'Region']}
                            renderInput={(params) => (
                                <TextField {...params} label="Type"></TextField>
                            )}
                            onChange={handleChangeRatioType}
                        ></Autocomplete>
                    </Card>
                    {selectedRatioType === 'University' && (
                        <Card>
                            <DataTable
                                title=""
                                description=""
                                data={researchCostUnivData}
                                showFilters={true}
                                filters={researchCostUnivData.columns}
                            />
                        </Card>
                    )}
                    {selectedRatioType === 'Region' && (
                        <Card>
                            <DataTable
                                title=""
                                description=""
                                data={researchCostRegionData}
                                showFilters={true}
                                filters={researchCostRegionData.columns}
                            />
                        </Card>
                    )}
                </div>
                <div className={styles.data_table} hidden={selectedTab !== 3}>
                    <Card>
                        <Autocomplete
                            disablePortal
                            id="university-network-chart"
                            options={['University', 'Region']}
                            renderInput={(params) => (
                                <TextField {...params} label="Type"></TextField>
                            )}
                            onChange={handleChangeRatioTypeChart}
                        ></Autocomplete>
                    </Card>
                    {selectedRatioTypeChart && (
                        <Card>
                            <ScatterChart
                                data={scatterData}
                                yName="Research Count"
                                xName="Total Budget"
                            />
                        </Card>
                    )}
                </div>
            </div>
        </Page>
    );
};
