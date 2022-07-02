import {
    ChartData,
    DataTableType,
    HorizontalBarData,
    HorizontalStackedBarData,
} from '../../components/charts/charts.model';
import { get } from '../http/get';
import { composeUrl, FEATURES, METRICS_FEATURES } from '../http/routes';
import { decompose } from './utilities';

////////////////////////////////////////////////////////
//               RESEARCH COST                        //
////////////////////////////////////////////////////////

export const getResearchCostTableData = (): Promise<DataTableType> => {
    return get(
        composeUrl(FEATURES.METRICS, METRICS_FEATURES.TABLE_RESEARCH_COST),
    );
};

export const getResearchCostUnivTableData = (): Promise<DataTableType> => {
    return get(
        composeUrl(FEATURES.METRICS, METRICS_FEATURES.TABLE_RESEARCH_COST_UNIV),
    );
};

export const getResearchCostRegionTableData = (): Promise<DataTableType> => {
    return get(
        composeUrl(
            FEATURES.METRICS,
            METRICS_FEATURES.TABLE_RESEARCH_COST_REGION,
        ),
    );
};

export const getResearchFundingData = (): Promise<HorizontalBarData> => {
    return get(
        composeUrl(
            FEATURES.METRICS,
            METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING,
        ),
    ).then((data) => {
        const { labels, values } = decompose(data.allocated_budget);
        return {
            labels,
            values,
            name: 'Research Funding',
        };
    });
};

export const getResearchFundingTypeData =
    (): Promise<HorizontalStackedBarData> => {
        return get(
            composeUrl(
                FEATURES.METRICS,
                METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING_TYPE,
            ),
        );
    };

export const getResearchFundingSourceData = (): Promise<HorizontalBarData> => {
    return get(
        composeUrl(
            FEATURES.METRICS,
            METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING_SOURCE,
        ),
    ).then((data) => {
        const { labels, values } = decompose(data.count);
        return {
            labels,
            values,
            name: 'Funding Source',
        };
    });
};

export const getResearchFundingForecastData =
    (): Promise<HorizontalBarData> => {
        return get(
            composeUrl(
                FEATURES.METRICS,
                METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING_FORECAST,
            ),
        ).then((data) => {
            const { labels, values } = decompose(data);
            return { labels, values, name: 'Funding Forecast' };
        });
    };

////////////////////////////////////////////////////////
//               UTILIZATION                          //
////////////////////////////////////////////////////////

export const getUtilizationTableData = (): Promise<DataTableType> => {
    return get(
        composeUrl(FEATURES.METRICS, METRICS_FEATURES.TABLE_UTILIZATION),
    );
};

export const getNumberOfProductsPerUniversityData =
    (): Promise<HorizontalStackedBarData> => {
        return get(
            composeUrl(
                FEATURES.METRICS,
                METRICS_FEATURES.CHART_UTILIZATION_PRODUCT_PER_UNIV,
            ),
        );
    };

export const getTopicsData = (
    sort: 'ASC' | 'DESC' = 'DESC',
): Promise<HorizontalBarData> => {
    return get(
        composeUrl(FEATURES.METRICS, METRICS_FEATURES.CHART_UTILIZATION_TOPICS),
    ).then((data) => {
        const { labels, values } = decompose(data.Count);
        return {
            labels,
            values,
            name: 'Top Topics',
            sort,
        };
    });
};

export const getTopBeneficiariesData = (
    sort: 'ASC' | 'DESC' = 'DESC',
): Promise<HorizontalBarData> => {
    return get(
        composeUrl(
            FEATURES.METRICS,
            METRICS_FEATURES.CHART_UTILIZATION_BENEFICIARIES,
        ),
    ).then((data) => {
        const { labels, values } = decompose(data.Count);
        return {
            labels,
            values,
            name: 'Beneficiaries',
            sort,
        };
    });
};

export const getYearlyUtilizationData = (): Promise<ChartData> => {
    return get(
        composeUrl(
            FEATURES.METRICS,
            METRICS_FEATURES.CHART_UTILIZATION_FORECAST,
        ),
    ).then((data) => {
        const { labels, values } = decompose(data.Count);

        return { labels, values, name: 'Yearly Utilization' };
    });
};

////////////////////////////////////////////////////////
//           REGIONAL DEVELOPMENT                     //
////////////////////////////////////////////////////////

export const getRegionalDevelopmentTableData = (): Promise<DataTableType> => {
    return get(
        composeUrl(
            FEATURES.METRICS,
            METRICS_FEATURES.TABLE_REGIONAL_DEVELOPMENT,
        ),
    );
};

export const getRegionalDevelopmentSDGTopicsData =
    (): Promise<DataTableType> => {
        return get(
            composeUrl(FEATURES.METRICS, METRICS_FEATURES.TABLE_SDG_TOPICS),
        );
    };
