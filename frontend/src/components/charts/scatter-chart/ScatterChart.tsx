// import { Chart } from '../Chart';
// import { Scatter } from 'react-chartjs-2';
// import { CHART_HEIGHT_MEDIUM, CHART_WIDTH } from '../chart.references';
// import { HorizontalStackedBarData } from '../charts.model';
// import { COLOR_GROUPS, COLOR_MAPPING } from '../../../services/colorService';
// import { useRef } from 'react';

// export const generateData = (datasets?: HorizontalStackedBarData) => {
//     return {
//         labels: datasets[0].labels,
//         datasets: datasets.map((dataset, index) => {
//             const COLORS = COLOR_MAPPING[COLOR_GROUPS.BASIC_GREEN];
//             return {
//                 label: dataset.name,
//                 backgroundColor: COLORS[index % (COLORS.length - 1)],
//                 data: dataset.values,
//             };
//         }),
//     };
// };

// export const ScatterChart = (props) => {
//     const chartReference = useRef();

//     const chartData = generateData(props.data);

//     return (
//         <Chart {...props}>
//             <Scatter
//                 ref={chartReference}
//                 width={CHART_WIDTH}
//                 height={CHART_HEIGHT_MEDIUM}
//                 options={generateChartOptions(props.showLegends)}
//                 data={chartData}
//             />
//         </Chart>
//     );
// };

import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TooltipModel,
    TooltipItem,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import faker from '@faker-js/faker';
import { Chart } from '../Chart';
import { CHART_HEIGHT_MEDIUM, CHART_WIDTH } from '../chart.references';
import { COLOR_GROUPS, COLOR_MAPPING } from '../../../services/colorService';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const generateChartOptions = (
    showLegend: boolean = false,
    xName: string,
    yName: string,
) => ({
    plugins: {
        legend: {
            display: showLegend,
            position: 'bottom' as const,
        },
        tooltip: {
            callbacks: {
                label: function (
                    this: TooltipModel<'scatter'>,
                    tooltipItem: TooltipItem<'scatter'>,
                ) {
                    console.log(this);
                    console.log(tooltipItem);
                    return [
                        (
                            this.dataPoints[0].raw as {
                                x: any;
                                y: any;
                                name: any;
                            }
                        ).name,
                        `${xName}: ${
                            (
                                this.dataPoints[0].raw as {
                                    x: any;
                                    y: any;
                                    name: any;
                                }
                            ).x
                        }`,
                        `${yName}: ${
                            (
                                this.dataPoints[0].raw as {
                                    x: any;
                                    y: any;
                                    name: any;
                                }
                            ).y
                        }`,
                    ];
                },
            },
        },
    },
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: yName,
            },
        },
        x: {
            beginAtZero: true,
            title: {
                display: true,
                text: xName,
            },
        },
    },
});

export const generateData = (
    label: string,
    data: Array<{ x: number; y: number }>,
) => {
    const COLORS = COLOR_MAPPING[COLOR_GROUPS.BASIC_GREEN];

    // return {
    //     label,
    //     datasets: datasets.map((dataset, index) => {
    //         return {
    //             label: dataset.name,
    //             backgroundColor: COLORS[5],
    //             data: dataset.values,
    //         };
    //     }),
    // };

    // x is budget
    // y is count
    return {
        datasets: [
            {
                label,
                data,
                pointBackgroundColor: COLORS[3],
            },
        ],
    };
};

export const ScatterChart = (props) => {
    return (
        <Chart {...props}>
            <Scatter
                options={generateChartOptions(
                    props.showLegends,
                    props.xName,
                    props.yName,
                )}
                data={generateData('university', props.data || [])}
                width={CHART_WIDTH}
                height={CHART_HEIGHT_MEDIUM}
            />
        </Chart>
    );
};
