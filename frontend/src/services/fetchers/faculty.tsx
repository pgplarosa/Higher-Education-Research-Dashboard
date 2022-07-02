import {
    DataTableType,
    HorizontalStackedBarData,
} from '../../components/charts/charts.model';
import { get } from '../http/get';
import { composeUrl, FACULTY_FEATURES, FEATURES } from '../http/routes';

////////////////////////////////////////////////////////
//                FACULTY PROFILE                     //
////////////////////////////////////////////////////////

export const getFacultyProfileTableData = (): Promise<DataTableType> => {
    return get(
        composeUrl(FEATURES.FACULTY, FACULTY_FEATURES.TABLE_FACULTY_PROFILE),
    );
};

export const getFacultyEducation = (): Promise<HorizontalStackedBarData> => {
    return get(
        composeUrl(
            FEATURES.FACULTY,
            FACULTY_FEATURES.CHART_FACULTY_PROFILE_EDUCATION,
        ),
    );
};

export const getFacultyNetworkData = (): Promise<DataTableType> => {
    return get(
        composeUrl(FEATURES.FACULTY, FACULTY_FEATURES.DATA_FACULTY_NETWORK),
    );
};

////////////////////////////////////////////////////////
//                COAUTHORSHIP                        //
////////////////////////////////////////////////////////

export const getSUCNetworkData = (): Promise<DataTableType> => {
    return get(composeUrl(FEATURES.FACULTY, FACULTY_FEATURES.DATA_SUC_NETWORK));
};
