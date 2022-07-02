import faker from '@faker-js/faker';

import { ChartData, ChartTypes } from '../components/charts/charts.model';
import { TableData } from '../components/data-table/DataTable.model';

export const generateFakeChartData = (
    chartType: ChartTypes,
    count: number = 1,
): any => {
    return {
        [ChartTypes.BAR]: () => {
            const data = generateGenericChartData([
                'Topics 1',
                'Topics 2',
                'Topics 3',
                'Topics 4',
                'Topics 5',
                'Topics 6',
                'Topics 7',
            ]);
            data['sort'] = 'DESC';
            return data;
        },
        [ChartTypes.STACKED_BAR]: () => {
            return [...Array(count).keys()].map((index) =>
                generateGenericChartData(
                    [
                        'SUC 1',
                        'SUC 2',
                        'SUC 3',
                        'SUC 4',
                        'SUC 5',
                        'SUC 6',
                        'SUC 7',
                        'SUC 8',
                        'SUC 9',
                        'SUC 10',
                    ],
                    0,
                    1000,
                    `Topic ${index}`,
                ),
            );
        },
        [ChartTypes.LINE]: () => {
            return generateGenericChartData(
                [...Array(10).keys()].map((index) => `${index + 2000}`),
                0,
                10000,
            );
        },
    }[chartType]();
};

const generateGenericChartData = (
    labels: string[],
    min: number = 0,
    max: number = 1000,
    name?: string,
): ChartData => {
    return {
        labels,
        values: labels.map(() => faker.datatype.number({ min, max })),
        name,
    };
};

export const generateFakeTableData = (
    columns: string[],
    rowCount: number,
): TableData => {
    const rows = [...Array(rowCount).keys()].map((index) =>
        columns.reduce((newData, column) => {
            newData[column] = generateFakeValue(column.toLowerCase());
            return newData;
        }, {}),
    );

    return {
        columns,
        rows,
    };
};

const generateFakeValue = (identifier: string) => {
    return {
        title: () => `${faker.company.bsAdjective()} ${faker.company.bsNoun()}`,
        author: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
        field: () => faker.company.bsNoun(),
        keywords: () =>
            [...Array(5).keys()].map((index) => faker.random.word()),
        year: () => faker.datatype.number({ min: 2000, max: 2022 }),
        university: () => `University of ${faker.company.companyName()}`,
        journal: () => `Journal of ${faker.animal.fish()}`,
        'year published': () => faker.datatype.number({ min: 1900, max: 2022 }),
        'local/international': () =>
            ['Local', 'International'][Math.random() >= 0.5 ? 0 : 1],
        citations: () => faker.datatype.number({ min: 0, max: 1000 }),
        'patent field': () => faker.company.bsNoun(),
        'patent type': () => `${faker.word.adjective()} ${faker.word.noun()}`,
        status: () => ['Pending', 'Awarded'][Math.ceil(Math.random() * 1)],
        'year of registration': () =>
            faker.datatype.number({ min: 1900, max: 2022 }),
        name: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
        education: () =>
            ["Bachelor's Degree", "Master's Degree", 'PhD'][
                Math.ceil(Math.random() * 2)
            ],
        position: () =>
            ['Teacher 1', 'Researcher', 'Teacher II'][
                Math.ceil(Math.random() * 2)
            ],
        expertise: () => faker.word.noun(),
        interests: () =>
            [...Array(5).keys()].map((index) => faker.word.noun()).join(', '),
        'publication count': () => faker.datatype.number({ min: 0, max: 1000 }),
        budget: () => faker.datatype.number({ min: 0, max: 1000000 }),
        agency: () => faker.company.companyName(),
        source: () => faker.address,
        type: () => faker.word,
        product: () => faker.company.bsNoun(),
        beneficiary: () => faker.address,
        neda: () => faker.datatype.number({ min: 0, max: 100000 }),
        sgd: () => faker.datatype.number({ min: 0, max: 100000 }),
    }[identifier]();
};
