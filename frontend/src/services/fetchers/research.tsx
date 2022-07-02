import {
    ChartData,
    DataTableType,
    HorizontalBarData,
    HorizontalStackedBarData,
} from '../../components/charts/charts.model';
import { get } from '../http/get';
import { composeUrl, FEATURES, RESEARCH_FEATURES } from '../http/routes';
import { decompose } from './utilities';

////////////////////////////////////////////////////////
//               RESEARCH RELEVANCE                   //
////////////////////////////////////////////////////////

export const getResearchRelevanceDataTable = (): Promise<DataTableType> => {
    return get(
        composeUrl(
            FEATURES.RESEARCH,
            RESEARCH_FEATURES.TABLE_RESEARCH_RELEVANCE,
        ),
    );
};

export const getResearchRelevanceChartData = (): Promise<HorizontalBarData> => {
    return get(
        composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.CHART_SCOPE),
    ).then((data) => {
        const labels = [];
        const values = [];

        if (data.count) {
            Object.entries(data.count).forEach(([key, value]) => {
                labels.push(key);
                values.push(value);
            });
        }

        return {
            name: 'scope',
            labels,
            values,
        };
    });
};

export const getResearchRelevanceCitationsChartData = (
    sort: 'ASC' | 'DESC' = 'DESC',
): Promise<HorizontalBarData> => {
    return get(
        composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.CHART_CITATIONS),
    ).then((data) => {
        const { labels, values } = decompose(data.citations);

        return {
            name: 'citations',
            labels,
            values,
            sort,
        };
    });
};

////////////////////////////////////////////////////////
//                        PATENTS                     //
////////////////////////////////////////////////////////

export const getPatentsTableData = (): Promise<DataTableType> => {
    return get(composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.TABLE_PATENTS));
};

export const getNumberOfTypesPerUniversity =
    (): Promise<HorizontalStackedBarData> => {
        return get(
            composeUrl(
                FEATURES.RESEARCH,
                RESEARCH_FEATURES.CHART_PATENTS_TYPE_PER_UNIV,
            ),
        );
    };

export const getNumberOfPatentsPerType = (
    sort: 'ASC' | 'DESC' = 'DESC',
): Promise<HorizontalBarData> => {
    return get(
        composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.CHART_PATENTS_PER_TYPE),
    ).then((data) => {
        const { labels, values } = decompose(data.Count);
        return {
            name: 'Patents per Type',
            labels,
            values,
            sort,
        };
    });
};

export const getNumberOfPatentsPerStatus = (
    sort: 'ASC' | 'DESC' = 'DESC',
): Promise<HorizontalBarData> => {
    return get(
        composeUrl(
            FEATURES.RESEARCH,
            RESEARCH_FEATURES.CHART_PATENTS_PER_STATUS,
        ),
    ).then((data) => {
        const { labels, values } = decompose(data.Count);
        return {
            name: 'Patents per Status',
            labels,
            values,
            sort,
        };
    });
};

export const getPatentsForecastData = (): Promise<ChartData> => {
    return get(
        composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.CHART_PATENTS_FORECAST),
    ).then((data) => {
        const { labels, values } = decompose(data.Count);
        return {
            labels,
            values,
            name: 'Patent Count Forecast',
        };
    });
};

////////////////////////////////////////////////////////
//                        ABSTRACT                     //
////////////////////////////////////////////////////////

export const getResearchAbstractData = (): Promise<DataTableType> => {
    return get(composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.TABLE_ABSTRACT));
};

export const getResearchKeywordsData = (): Promise<DataTableType> => {
    return get(
        composeUrl(
            FEATURES.RESEARCH,
            RESEARCH_FEATURES.TABLE_RESEARCH_KEYWORDS,
        ),
    );
};

export const getResearchBySUCData = (): Promise<HorizontalStackedBarData> => {
    return get(
        composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.CHART_RESEARCH_BY_SUC),
    );
};

export const getResearchTopTopics = (): Promise<HorizontalBarData> => {
    return get(
        composeUrl(
            FEATURES.RESEARCH,
            RESEARCH_FEATURES.CHART_RESEARCH_TOP_TOPICS,
        ),
    ).then((data) => {
        const labels = [];
        const values = [];

        if (data['Topic Name']) {
            Object.entries(data['Topic Name']).forEach(([key, value]) => {
                labels.push(key);
                values.push(value);
            });
        }

        return {
            name: 'Top Topics',
            labels,
            values,
            sort: 'DESC',
        };
    });
};

export const getResearchBySDGData = (): Promise<HorizontalStackedBarData> => {
    return get(
        composeUrl(FEATURES.RESEARCH, RESEARCH_FEATURES.CHART_RESEARCH_BY_SDG),
    );
};

export const getResearchByRegionData =
    (): Promise<HorizontalStackedBarData> => {
        return get(
            composeUrl(
                FEATURES.RESEARCH,
                RESEARCH_FEATURES.CHART_RESEARCH_BY_REGION,
            ),
        );
    };

export const getResearchByAgency = (): Promise<HorizontalStackedBarData> => {
    return get(
        composeUrl(
            FEATURES.RESEARCH,
            RESEARCH_FEATURES.CHART_RESEARCH_BY_AGENCY,
        ),
    );
};

export const getResearchByBudgetData = (): Promise<HorizontalBarData> => {
    return get(
        composeUrl(
            FEATURES.RESEARCH,
            RESEARCH_FEATURES.CHART_RESEARCH_BY_BUDGET,
        ),
    ).then((data) => {
        const labels = [];
        const values = [];

        if (data['Total Allocated Budget']) {
            Object.entries(data['Total Allocated Budget']).forEach(
                ([key, value]) => {
                    labels.push(key);
                    values.push(value);
                },
            );
        }

        return {
            name: 'Total Allocated Budget',
            labels,
            values,
            sort: 'DESC',
        };
    });
};
