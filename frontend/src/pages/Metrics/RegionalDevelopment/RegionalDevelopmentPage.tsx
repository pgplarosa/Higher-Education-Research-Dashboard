import EqualizerIcon from '@mui/icons-material/Equalizer';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './RegionalDevelopmentPage.module.scss';
import { useEffect, useState } from 'react';
import { DataTable } from '../../../components/data-table/DataTable';
import { Page } from '../../../components/layout/Page/Page';
import { Card } from '../../../components/layout/Card/Card';
import { TableData } from '../../../components/data-table/DataTable.model';
import {
    getRegionalDevelopmentSDGTopicsData,
    getRegionalDevelopmentTableData,
} from '../../../services/fetchers/metrics';

export const RegionalDevelopmentPage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableData, setTableData] = useState<TableData>({
        columns: [],
        rows: [],
    });
    const [sdgTopicsData, setSdgTopicsData] = useState<TableData>({
        columns: [],
        rows: [],
    });

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        // set initial data here
        getRegionalDevelopmentTableData().then((data) => {
            setTableData(data);
        });

        getRegionalDevelopmentSDGTopicsData().then((data) =>
            setSdgTopicsData(data),
        );
    }, []);

    return (
        <Page
            mainTitle="Metrics"
            subtitle="Regional Development"
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
                    <Tab label="Keywords" />
                    {/* <Tab label="Charts" /> */}
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
                        <DataTable
                            title=""
                            description=""
                            data={sdgTopicsData}
                            showFilters={true}
                            filters={sdgTopicsData.columns}
                        />
                    </Card>
                </div>
            </div>
        </Page>
    );
};
