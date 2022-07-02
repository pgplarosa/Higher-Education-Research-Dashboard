import FolderIcon from '@mui/icons-material/Folder';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './AbstractClassificationPage.module.scss';
import { useEffect, useState } from 'react';
import {
    ChartTypes,
    HorizontalBarData,
    HorizontalStackedBarData,
} from '../../../components/charts/charts.model';
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
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { classifyAbstract } from '../../../services/posters/abstract';
import {
    getResearchAbstractData,
    getResearchByAgency,
    getResearchByBudgetData,
    getResearchByRegionData,
    getResearchBySDGData,
    getResearchBySUCData,
    getResearchKeywordsData,
    getResearchTopTopics,
} from '../../../services/fetchers/research';
import { getAssetAddress } from '../../../services/fetchers/assets';

interface Classification {
    predicted_keyphrase: string;
    predicted_school: string;
    predicted_sdg: string;
    predicted_topic: string;
}
export const AbstractClassificationPage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [abstract, setAbstract] = useState('');
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });
    const [researchKeywordsData, setResearchKeywordsData] = useState<TableData>(
        {
            columns: [],
            rows: [],
        },
    );
    const [researchBySUCData, setResearchBySUCData] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);
    const [researchBySDGData, setResearchBySDGData] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);

    const [researchByRegionData, setResearchByRegionData] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);

    const [researchTopTopicsData, setResearchTopTopicsData] =
        useState<HorizontalBarData>({
            labels: [],
            values: [],
        });

    const [researchByAgencyData, setResearchByAgencyData] =
        useState<HorizontalStackedBarData>([
            {
                labels: [],
                values: [],
            },
        ]);

    const [researchByBudgetData, setResearchByBudgetData] =
        useState<HorizontalBarData>({
            labels: [],
            values: [],
        });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [classification, setClassification] = useState<Classification>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        getResearchAbstractData().then((tableData) => {
            setTableData(tableData);
        });

        getResearchKeywordsData().then((data) => setResearchKeywordsData(data));

        getResearchBySUCData().then((data) => setResearchBySUCData(data));

        getResearchTopTopics().then((data) => setResearchTopTopicsData(data));

        getResearchBySDGData().then((data) => setResearchBySDGData(data));

        getResearchByRegionData().then((data) => setResearchByRegionData(data));

        getResearchByAgency().then((data) => setResearchByAgencyData(data));

        getResearchByBudgetData().then((data) => setResearchByBudgetData(data));
    }, []);

    const handleSubmitAbstract = () => {
        if (isValidAbstract()) {
            // call API here
            setLoading(true);
            classifyAbstract(abstract).then((classification) => {
                setLoading(false);
                setClassification(classification as Classification);
                setOpenDialog(true);
            });
        }
    };

    const isValidAbstract = () => {
        const abstractLength = abstract.split(' ').length;
        if (abstractLength >= 150 && abstractLength <= 300) {
            setErrors([]);
            return true;
        }

        setErrors((prevErrors) => {
            return [
                // ...prevErrors,
                'Word count must be between 150 and 300 words.',
            ];
        });

        return false;
    };

    const handleChangeAbstract = (event) => {
        setAbstract(event.target.value);
    };

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
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}
                maxWidth={'md'}
            >
                <DialogTitle id="scroll-dialog-title">
                    Classification
                </DialogTitle>
                <DialogContent>
                    <div>
                        <table>
                            {classification !== null &&
                                Object.entries(classification).map(
                                    ([key, value]) => (
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>
                                                {key
                                                    .toUpperCase()
                                                    .split('_')
                                                    .join(' ')}
                                            </td>
                                            <td>{value}</td>
                                        </tr>
                                    ),
                                )}
                        </table>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <div className={styles.tabs}>
                <Tabs
                    value={selectedTab}
                    onChange={handleChangeTab}
                    aria-label="research tabs"
                >
                    <Tab label="Data" />
                    <Tab label="Keywords" />
                    <Tab label="Charts" />
                    <Tab label="Analysis" />
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

                <div className={styles.data_table} hidden={selectedTab !== 1}>
                    <Card>
                        <DataTable
                            title=""
                            description=""
                            data={researchKeywordsData}
                            showFilters={true}
                            filters={researchKeywordsData.columns}
                        />
                    </Card>
                </div>

                <div className={styles.data_charts} hidden={selectedTab !== 2}>
                    <Card>
                        <HorizontalStackedBarChart
                            title="Research by SUC"
                            data={researchBySUCData}
                            showLegends={true}
                            yName="SUC"
                            xName="Count of research"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Top 10 Research Topics"
                            data={researchTopTopicsData}
                            yName="Topic"
                            xName="Count of research"
                        />
                    </Card>
                    <Card>
                        <HorizontalStackedBarChart
                            title="Research by SDG"
                            data={researchBySDGData}
                            showLegends={true}
                            yName="SDG"
                            xName="Count of research"
                        />
                    </Card>
                    <Card>
                        <HorizontalStackedBarChart
                            title="Research by Region"
                            data={researchByRegionData}
                            showLegends={true}
                            xName="Count of research"
                            yName="Region"
                        />
                    </Card>
                    <Card>
                        <h2>Research Topics Over Time</h2>
                        <img
                            alt="research topics over time"
                            src={getAssetAddress(
                                'research_topics_over_time.png',
                            )}
                            style={{ width: '100%', margin: '20px 0px' }}
                        ></img>
                    </Card>
                    <Card>
                        <HorizontalStackedBarChart
                            title="Research by Agency"
                            data={researchByAgencyData}
                            showLegends={true}
                            xName="Count of research"
                            yName="Agency"
                        />
                    </Card>
                    <Card>
                        <HorizontalBarChart
                            title="Research by Budget"
                            data={researchByBudgetData}
                            xName="Amount in Pesos"
                            yName="Topic"
                        />
                    </Card>
                </div>
                <div className={styles.data_table} hidden={selectedTab !== 3}>
                    <Card>
                        <form>
                            <TextField
                                multiline
                                label="Abstract"
                                style={{ width: '100%' }}
                                rows={20}
                                variant="filled"
                                onChange={handleChangeAbstract}
                                disabled={loading}
                                placeholder="Abstract must contain between 150 and 300 words."
                            ></TextField>
                            {errors.map((error, index) => (
                                <p
                                    key={`error-${index}`}
                                    style={{ color: 'red' }}
                                >
                                    {error}
                                </p>
                            ))}
                            <Button
                                style={{
                                    margin: '10px 0px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                                size="large"
                                variant="contained"
                                color="success"
                                disabled={loading}
                                onClick={handleSubmitAbstract}
                            >
                                {loading && (
                                    <CircularProgress
                                        color="inherit"
                                        size={'1rem'}
                                    />
                                )}
                                Submit
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Page>
    );
};
