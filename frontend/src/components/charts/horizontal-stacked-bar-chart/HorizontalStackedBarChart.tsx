import { Chart } from '../Chart';
import { Bar, getDatasetAtEvent, getElementAtEvent } from 'react-chartjs-2';
import { CHART_HEIGHT_MEDIUM, CHART_WIDTH } from '../chart.references';
import {
    HorizontalStackedBarChartProps,
    HorizontalStackedBarData,
} from '../charts.model';
import { COLOR_GROUPS, COLOR_MAPPING } from '../../../services/colorService';
import { useRef } from 'react';
import ScrollDialog from '../../dialog/ScrollDialog';
import React from 'react';

export const generateChartOptions = (
    showLegend: boolean = false,
    xName: string = null,
    yName: string = null,
) => ({
    plugins: {
        legend: {
            display: showLegend,
            position: 'bottom' as const,
        },
    },
    indexAxis: 'y' as const,
    responsive: true,
    scales: {
        x: {
            stacked: true,
            title: {
                display: !!xName,
                text: xName,
            },
        },
        y: {
            stacked: true,
            title: {
                display: !!yName,
                text: yName,
            },
        },
    },
});

export const generateData = (datasets?: HorizontalStackedBarData) => {
    return {
        labels: datasets[0].labels,
        datasets: datasets.map((dataset, index) => {
            const COLORS = COLOR_MAPPING[COLOR_GROUPS.BASIC_GREEN];
            return {
                label: dataset.name,
                backgroundColor: COLORS[index % (COLORS.length - 1)],
                data: dataset.values,
            };
        }),
    };
};

export const HorizontalStackedBarChart: React.FunctionComponent<
    HorizontalStackedBarChartProps
> = (props) => {
    const chartReference = useRef();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogData, setDialogData] = React.useState({
        title: '',
        data: { values: [], labels: [], name: '' },
    });

    const chartData = generateData(props.data);

    const onClickBar = (event) => {
        const element = getElementAtEvent(chartReference.current, event);
        const dataset = getDatasetAtEvent(chartReference.current, event);

        if (!!!element.length || !!!dataset.length) {
            return;
        }

        const index = element[0].index;

        setDialogData(generateDialogData(index));
        setOpenDialog(true);
    };

    const generateDialogData = (index: number) => {
        return {
            title: chartData.labels[index],
            data: {
                labels: chartData.datasets.map((dataset) => dataset.label),
                values: chartData.datasets.map(
                    (dataset) => dataset.data[index],
                ),
                name: chartData.labels[index],
                sort: 'DESC',
            },
        };
    };

    const handleOnCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Chart {...props}>
            <Bar
                ref={chartReference}
                width={CHART_WIDTH}
                height={CHART_HEIGHT_MEDIUM}
                options={generateChartOptions(
                    props.showLegends,
                    props.xName,
                    props.yName,
                )}
                data={chartData}
                onClick={onClickBar}
            />
            <ScrollDialog
                openDialog={openDialog}
                onClose={handleOnCloseDialog}
                dialogData={dialogData}
            />
        </Chart>
    );
};
