import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Chart } from '../Chart';
import { CHART_HEIGHT, CHART_WIDTH } from '../chart.references';
import { LineData } from '../charts.model';
import { COLOR_GROUPS, COLOR_MAPPING } from '../../../services/colorService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export const generateChartOptions = (
    showLegends: boolean = false,
    xName: string = null,
    yName: string = null,
) => ({
    responsive: true,
    scales: {
        x: {
            title: {
                display: !!xName,
                text: xName,
            },
        },
        y: {
            title: {
                display: !!yName,
                text: yName,
            },
        },
    },
    plugins: {
        legend: {
            display: showLegends,
            position: 'bottom' as const,
        },
    },
});

export const generateData = (dataset?: LineData) => {
    const COLOR = COLOR_MAPPING[COLOR_GROUPS.BASIC_GREEN][2];
    return {
        labels: dataset.labels,
        datasets: [
            {
                data: dataset.values,
                backgroundColor: COLOR,
                borderColor: COLOR,
                borderWidth: 3,
            },
        ],
    };
};

export const LineChart = (props) => {
    return (
        <Chart {...props}>
            <Line
                options={generateChartOptions(
                    props.showLegends,
                    props.xName,
                    props.yName,
                )}
                data={generateData(props.data)}
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
            />
        </Chart>
    );
};
