import PeopleIcon from '@mui/icons-material/People';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './NetworksPage.module.scss';
import { useEffect, useState } from 'react';
import { Page } from '../../../components/layout/Page/Page';
import {} from '../../../services/fakeData';
import { Card } from '../../../components/layout/Card/Card';
import { getSUCNetworkData } from '../../../services/fetchers/faculty';
import { Autocomplete, TextField } from '@mui/material';
import { DataTable } from '../../../components/data-table/DataTable';
import { getAssetAddress } from '../../../services/fetchers/assets';

///////////////////////////////////////////////////
// RENDERING PARTS
///////////////////////////////////////////////////

export const reduceToSingleString = (values: Array<Record<string, any>>) => {
    return values
        .reduce((parsed, value) => {
            parsed.push(`${value.name}: ${value.value}`);
            return parsed;
        }, [])
        .join(' | ');
};

export const parseCommunityList = (
    list: Record<number, string[]>,
    groupName: string = 'Group',
    itemsName: string = 'Members',
) => {
    return {
        columns: [groupName, itemsName],
        rows: Object.entries(list).map(([Group, Members]) => ({
            [groupName]: `Group ${parseInt(Group) + 1}`,
            [itemsName]: Members.join(', '),
        })),
    };
};

export const parseToDisplayWithAttributes = (
    profile: Record<string, any>,
    attributes: string[],
) => {
    return {
        columns: ['Property', 'Value'],
        rows: Object.entries(profile)
            .filter(([key, value]) => attributes.includes(key) && value)
            .map(([Property, Value]) => ({
                Property,
                Value:
                    typeof Value === typeof []
                        ? reduceToSingleString(Value)
                        : Value,
            })),
    };
};

export const renderTable = (
    profile: Record<string, any>,
    tableName: string,
    attributes: string[],
) => {
    return (
        <Card>
            <DataTable
                initialRow={100}
                title={tableName}
                data={parseToDisplayWithAttributes(profile, attributes)}
            ></DataTable>
        </Card>
    );
};

export const renderWholeNetworkAnalysis = (profile: Record<string, any>) => {
    const WHOLE_NETWORK_ANALYSIS_TABLE_ELEMENTS = [
        'Profile',
        'Nodes',
        'Edges',
        'Average Degree',
        'Maximum Degree',
        'Node-Component Ratio',
    ];

    return renderTable(
        profile,
        'Whole Network Analysis',
        WHOLE_NETWORK_ANALYSIS_TABLE_ELEMENTS,
    );
};

export const renderImages = (images: string[]) => {
    return (
        <Card>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    width: '100%',
                }}
                className={styles.imageContainer}
            >
                <>
                    {images.map((key) => (
                        <img
                            key={key}
                            alt="alttext"
                            src={getAssetAddress(key)}
                            style={{
                                width: '70%',
                                flexWrap: 'wrap',
                            }}
                        ></img>
                    ))}
                </>
            </div>
        </Card>
    );
};

export const renderWholeNetworkAnalysisImages = (
    profile: Record<string, any>,
) => {
    return renderImages(
        ['degree_distrib', 'network_plot'].map((key) => profile[key]),
    );
};

export const renderGeneralComponentAnalysis = (
    profile: Record<string, any>,
) => {
    const ATTRIBUTES = [
        'Profile',
        'Nodes',
        'Edges',
        'Average Degree',
        'Maximum Degree',
        'Shortest Path Length',
        'Clustering Coefficient',
    ];

    return renderTable(profile, 'General Component Analysis', ATTRIBUTES);
};

export const renderGeneralComponentAnalysisImages = (
    profile: Record<string, any>,
) => {
    const SRC = ['gc_degree_distrib', 'gc_network_plot'];
    return renderImages(SRC.map((src) => profile[src]));
};

export const renderClosenessAnalysis = (profile: Record<string, any>) => {
    const ATTRIBUTES = [
        'Top 3 Degree Centrality',
        'Top 3 Betweenness Centrality',
        'Top 3 Closeness Centrality',
    ];
    return renderTable(profile, 'Centrality Analysis', ATTRIBUTES);
};

export const renderClosenessAnalysisImages = (profile: Record<string, any>) => {
    return renderImages(
        ['dc_plot', 'bc_plot', 'cc_plot'].map((key) => profile[key]),
    );
};

export const renderNetworkCommunityAnalysis = (
    profile: Record<string, any>,
) => {
    const ATTRIBUTES = ['Modularity', 'Number of Communities'];
    return renderTable(profile, 'Network Community Analysis', ATTRIBUTES);
};

export const renderListOfCommunities = (
    profile: Record<string, any>,
    groupName: string = 'Group',
    itemsName: string = 'Members',
) => {
    return (
        <Card>
            <DataTable
                title="List of Communities"
                initialRow={100}
                data={
                    parseCommunityList(
                        profile['Community List'],
                        groupName,
                        itemsName,
                    ) || {
                        rows: [],
                        columns: [],
                    }
                }
            ></DataTable>
        </Card>
    );
};

export const renderNetworkCommunityAnalysisImages = (
    profile: Record<string, any>,
) => {
    return renderImages(['community_plot'].map((key) => profile[key]));
};

export const NetworksPage = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [sucNetworkData, setSucNetworkData] = useState({});
    const [selectedSUC, setSelectedSUC] = useState(null);

    const handleChangeTab = (event: React.SyntheticEvent, tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    useEffect(() => {
        getSUCNetworkData().then((data) => {
            setSucNetworkData(data);
        });
    }, []);

    const handleChangeUniversity = (event, newValue) => {
        setSelectedSUC(sucNetworkData[newValue]);
    };

    return (
        <Page
            mainTitle="Collaboration"
            subtitle="Co-authorship"
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
                    <Tab label="Co-Authorship" />
                </Tabs>
            </div>
            <div className={styles.tab_panels}>
                <div className={styles.data_table} hidden={selectedTab !== 0}>
                    <Card>
                        <Autocomplete
                            disablePortal
                            id="university-network"
                            options={Object.keys(sucNetworkData) || []}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="University"
                                ></TextField>
                            )}
                            onChange={handleChangeUniversity}
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
                                    {renderListOfCommunities(selectedSUC)}
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
