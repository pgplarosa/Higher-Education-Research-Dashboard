type RouteType = Record<string, { route: string; children: RouteType }>;

export const ROUTES: RouteType = {
    research: {
        route: 'research',
        children: {
            table: {
                route: 'research-relevance',
                children: {},
            },
            scope: {
                route: 'scope',
                children: {},
            },
            citations: {
                route: 'citations',
                children: {},
            },
        },
    },
};

export const BASE_URL = 'http://localhost:8080';

export enum RESEARCH_FEATURES {
    TABLE_RESEARCH_RELEVANCE,
    CHART_SCOPE,
    CHART_CITATIONS,
    TABLE_PATENTS,
    CHART_PATENTS_TYPE_PER_UNIV,
    CHART_PATENTS_PER_TYPE,
    CHART_PATENTS_PER_STATUS,
    CHART_PATENTS_FORECAST,
    CUSTOM_ABSTRACT_CLASSIFICATION,
    TABLE_ABSTRACT,
    CHART_RESEARCH_BY_SUC,
    CHART_RESEARCH_TOP_TOPICS,
    CHART_RESEARCH_BY_SDG,
    CHART_RESEARCH_BY_REGION,
    CHART_RESEARCH_BY_AGENCY,
    CHART_RESEARCH_BY_BUDGET,
    TABLE_RESEARCH_KEYWORDS,
}

export enum FACULTY_FEATURES {
    TABLE_FACULTY_PROFILE,
    CHART_FACULTY_PROFILE_EDUCATION,
    CHART_FACULTY_PROFILE_EXPERTISE,
    CHART_FACULTY_PROFILE_RESEARCH_INTERESTS,
    DATA_SUC_NETWORK,
    DATA_FACULTY_NETWORK,
}

export enum METRICS_FEATURES {
    TABLE_RESEARCH_COST,
    CHART_RESEARCH_COST_FUNDING,
    CHART_RESEARCH_COST_FUNDING_TYPE,
    CHART_RESEARCH_COST_FUNDING_SOURCE,
    CHART_RESEARCH_COST_FUNDING_FORECAST,
    TABLE_UTILIZATION,
    CHART_UTILIZATION_PRODUCT_PER_UNIV,
    CHART_UTILIZATION_TOPICS,
    CHART_UTILIZATION_BENEFICIARIES,
    CHART_UTILIZATION_FORECAST,
    TABLE_REGIONAL_DEVELOPMENT,
    TABLE_SDG_TOPICS,
    TABLE_RESEARCH_COST_UNIV,
    TABLE_RESEARCH_COST_REGION,
}

export enum FEATURES {
    RESEARCH = 'research',
    FACULTY = 'faculty',
    METRICS = 'metrics',
}

export type Subfeature =
    | RESEARCH_FEATURES
    | FACULTY_FEATURES
    | METRICS_FEATURES;

export const RESEARCH_URLS: Record<RESEARCH_FEATURES, string> = {
    [RESEARCH_FEATURES.TABLE_RESEARCH_RELEVANCE]: 'research-relevance',
    [RESEARCH_FEATURES.CHART_SCOPE]: 'scope',
    [RESEARCH_FEATURES.CHART_CITATIONS]: 'citations',
    [RESEARCH_FEATURES.TABLE_PATENTS]: 'patents',
    [RESEARCH_FEATURES.CHART_PATENTS_TYPE_PER_UNIV]: 'patents/type-per-univ',
    [RESEARCH_FEATURES.CHART_PATENTS_PER_TYPE]: 'patents/per-type',
    [RESEARCH_FEATURES.CHART_PATENTS_PER_STATUS]: 'patents/per-status',
    [RESEARCH_FEATURES.CHART_PATENTS_FORECAST]: 'patents/forecast',
    [RESEARCH_FEATURES.CUSTOM_ABSTRACT_CLASSIFICATION]:
        'abstract/classification',
    [RESEARCH_FEATURES.TABLE_ABSTRACT]: 'abstract',
    [RESEARCH_FEATURES.CHART_RESEARCH_BY_SUC]: 'abstract/research-by-suc',
    [RESEARCH_FEATURES.CHART_RESEARCH_TOP_TOPICS]:
        'abstract/research-top-topics',
    [RESEARCH_FEATURES.CHART_RESEARCH_BY_SDG]: 'abstract/research-by-sdg',
    [RESEARCH_FEATURES.CHART_RESEARCH_BY_REGION]: 'abstract/research-by-region',
    [RESEARCH_FEATURES.CHART_RESEARCH_BY_AGENCY]: 'abstract/research-by-agency',
    [RESEARCH_FEATURES.CHART_RESEARCH_BY_BUDGET]: 'abstract/research-by-budget',
    [RESEARCH_FEATURES.TABLE_RESEARCH_KEYWORDS]: 'abstract/keywords',
};

export const FACULTY_URLS: Record<FACULTY_FEATURES, string> = {
    [FACULTY_FEATURES.TABLE_FACULTY_PROFILE]: 'profiles',
    [FACULTY_FEATURES.CHART_FACULTY_PROFILE_EDUCATION]: 'profiles/education',
    [FACULTY_FEATURES.CHART_FACULTY_PROFILE_EXPERTISE]: '',
    [FACULTY_FEATURES.CHART_FACULTY_PROFILE_RESEARCH_INTERESTS]: '',
    [FACULTY_FEATURES.DATA_SUC_NETWORK]: 'coauthorship/suc-network',
    [FACULTY_FEATURES.DATA_FACULTY_NETWORK]: 'profiles/network',
};

export const METRICS_URLS: Record<METRICS_FEATURES, string> = {
    [METRICS_FEATURES.TABLE_RESEARCH_COST]: 'research-cost',
    [METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING]: 'research-cost/funding',
    [METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING_TYPE]:
        'research-cost/funding-type',
    [METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING_SOURCE]:
        'research-cost/funding-source',
    [METRICS_FEATURES.TABLE_RESEARCH_COST_UNIV]: 'research-cost/univ',
    [METRICS_FEATURES.TABLE_RESEARCH_COST_REGION]: 'research-cost/region',
    [METRICS_FEATURES.CHART_RESEARCH_COST_FUNDING_FORECAST]:
        'research-cost/funding-forecast',
    [METRICS_FEATURES.TABLE_UTILIZATION]: 'utilization',
    [METRICS_FEATURES.CHART_UTILIZATION_PRODUCT_PER_UNIV]:
        'utilization/product-per-univ',
    [METRICS_FEATURES.CHART_UTILIZATION_TOPICS]: 'utilization/topics',
    [METRICS_FEATURES.CHART_UTILIZATION_BENEFICIARIES]:
        'utilization/beneficiaries',
    [METRICS_FEATURES.CHART_UTILIZATION_FORECAST]: 'utilization/forecast',
    [METRICS_FEATURES.TABLE_REGIONAL_DEVELOPMENT]: 'regional-development',
    [METRICS_FEATURES.TABLE_SDG_TOPICS]: 'regional-development/sdg-topics',
};

export const STATIC_ROOT = 'http://localhost:8080/static/';

export const composeUrl = (
    feature: FEATURES,
    subfeature: Subfeature,
): string => {
    return [
        BASE_URL,
        feature,
        {
            [FEATURES.RESEARCH]: RESEARCH_URLS,
            [FEATURES.FACULTY]: FACULTY_URLS,
            [FEATURES.METRICS]: METRICS_URLS,
        }[feature][subfeature],
    ].join('/');
};
