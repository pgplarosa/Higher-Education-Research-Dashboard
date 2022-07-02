import { Bar } from 'react-chartjs-2';
import { CHART_HEIGHT, CHART_WIDTH } from '../chart.references';
import { HorizontalBarChartProps, HorizontalBarData } from '../charts.model';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    RadialLinearScale,
    DatasetChartOptions,
} from 'chart.js';
import { Chart } from '../Chart';
import { COLOR_GROUPS, COLOR_MAPPING } from '../../../services/colorService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const THEME_COLORS = COLOR_MAPPING[COLOR_GROUPS.BASIC_GREEN];

export const generateChartOptions = (
    showLegend: boolean = false,
    xName: string = null,
    yName: string = null,
): ChartOptions => ({
    indexAxis: 'y' as const,
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    scales: {
        y: {
            title: { display: !!yName, text: yName },
        },
        x: {
            title: { display: !!xName, text: xName },
        },
    },
    plugins: {
        legend: {
            display: showLegend,
            position: 'bottom' as const,
        },
    },
});

export const generateData = (dataset: HorizontalBarData): ChartData<'bar'> => {
    return dataset.sort
        ? sortData(dataset)
        : {
              labels: dataset.labels,
              datasets: [
                  {
                      data: dataset.values,
                      borderWidth: 0,
                      backgroundColor: THEME_COLORS[1],
                  },
              ],
          };
};

const sortData = (dataset: HorizontalBarData): ChartData<'bar'> => {
    const categorizedData = categorize(dataset.labels, dataset.values);
    const sortedData = categorizedData.sort((a, b) =>
        dataset.sort === 'ASC' ? a.value - b.value : b.value - a.value,
    );
    const uncategorizedData = uncategorize(sortedData);
    return {
        labels: uncategorizedData.labels,
        datasets: [
            {
                data: uncategorizedData.values,
                borderWidth: 0,
                backgroundColor: THEME_COLORS[1],
            },
        ],
    };
};

const categorize = (labels: string[], values: any[]): Record<string, any> => {
    return labels.map((label, index) => ({ label, value: values[index] }));
};

const uncategorize = (categorizedData: Record<string, any>[]) => {
    return categorizedData.reduce(
        (uncategorizedData, data) => {
            uncategorizedData.labels.push(data.label);
            uncategorizedData.values.push(data.value);
            return uncategorizedData;
        },
        { labels: [], values: [] },
    );
};

const HorizontalBarChart: React.FunctionComponent<HorizontalBarChartProps> = (
    props,
) => {
    return (
        <Chart {...props}>
            <Bar
                options={
                    generateChartOptions(
                        props.showLegends,
                        props.xName,
                        props.yName,
                    ) as DatasetChartOptions<'bar'>
                }
                data={generateData(props.data)}
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
            />
        </Chart>
    );
};

export default HorizontalBarChart;
