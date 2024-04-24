<template>
    <div ref="chartContainer" style="position: relative; width: 100%; height: 100%;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from 'vue';
import { createChart, type IChartApi, type LineData, type ISeriesApi, type UTCTimestamp } from 'lightweight-charts';

const props = defineProps({
    foodData: { type: Object as PropType<LineData<UTCTimestamp>[]>, required: true },
    goldData: { type: Object as PropType<LineData<UTCTimestamp>[]>, required: true },
    woodData: { type: Object as PropType<LineData<UTCTimestamp>[]>, required: true },
    chartOptions: { type: Object, default: () => ({}) }
});

let chart: IChartApi | null = null;
let foodSeries: ISeriesApi<'Line'> | null = null;
let goldSeries: ISeriesApi<'Line'> | null = null;
let woodSeries: ISeriesApi<'Line'> | null = null;

const chartContainer = ref<HTMLElement | null>(null);

const initChart = () => {
    if (!chartContainer.value) return;

    chart = createChart(chartContainer.value, {
        width: chartContainer.value.clientWidth,
        height: chartContainer.value.clientHeight,
        ...props.chartOptions,
    });

    foodSeries = chart.addLineSeries({
        color: 'blue',
        lineWidth: 2,
        title: 'Food',
    });
    goldSeries = chart.addLineSeries({
        color: 'gold',
        lineWidth: 2,
        title: 'Gold',
    });
    woodSeries = chart.addLineSeries({
        color: 'green',
        lineWidth: 2,
        title: 'Wood',
    });

    foodSeries.setData(props.foodData);
    goldSeries.setData(props.goldData);
    woodSeries.setData(props.woodData);

    chart.timeScale().fitContent();
};

const updateChart = () => {
    if (!foodSeries || !goldSeries || !woodSeries) return;

    foodSeries.setData(props.foodData);
    goldSeries.setData(props.goldData);
    woodSeries.setData(props.woodData);
};


watch(
    () => [props.foodData, props.goldData, props.woodData],
    () => {
        updateChart();
    },
    { deep: true }
);

onMounted(() => {
    initChart();
});
</script>