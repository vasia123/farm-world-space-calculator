<template>
    <div ref="chartContainer" style="position: relative; width: 100%; height: 100%;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from 'vue';
import { createChart, type IChartApi, type LineData, type ISeriesApi, type UTCTimestamp, PriceScaleMode, type Time, TickMarkType } from 'lightweight-charts';

const props = defineProps({
    foodData: { type: Object as PropType<LineData<UTCTimestamp>[]>, required: true },
    goldData: { type: Object as PropType<LineData<UTCTimestamp>[]>, required: true },
    woodData: { type: Object as PropType<LineData<UTCTimestamp>[]>, required: true },
    fetchMoreData: {
        type: Function as PropType<() => Promise<boolean>>,
        required: true,
    },
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
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
            rightBarStaysOnScroll: true,
            barSpacing: 3,
            // lockVisibleTimeRangeOnResize: true,
            tickMarkFormatter: (timeRaw: UTCTimestamp, tickMarkType: TickMarkType, locale: string) => {
                const time = timeRaw * 1000;
                const date = new Date(time);
                if (tickMarkType === TickMarkType.DayOfMonth) {
                    const formattedDate = date.toLocaleString(locale, { day: '2-digit', month: 'short' });
                    return formattedDate;
                }
                if (tickMarkType === TickMarkType.Month) {
                    const formattedMonth = date.toLocaleString(locale, { month: 'long', year: 'numeric' });
                    return formattedMonth;
                }
                if (tickMarkType === TickMarkType.Year) {
                    const year = date.getUTCFullYear().toString();
                    return year;
                }
                if (tickMarkType === TickMarkType.Time) {
                    const hours = date.getUTCHours().toString().padStart(2, '0');
                    const minutes = Math.floor(date.getUTCMinutes() / 10) * 10;
                    const formattedMinutes = minutes.toString().padStart(2, '0');
                    return `${hours}:${formattedMinutes}`;
                }
                return time;
            },

        },
        localization: {
            // timeFormatter: (time: UTCTimestamp) => {
            //     const date = new Date(time);
            //     const hours = date.getUTCHours().toString().padStart(2, '0');
            //     const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            //     return `${hours}:${minutes}`;
            // },
            priceFormatter: (price: number) => price.toFixed(4),
        },
        // rightPriceScale: {
        //     mode: PriceScaleMode.Normal,
        //     autoScale: false,
        //     ticksVisible: true,
        //     scaleMargins: {
        //         top: 0.1,
        //         bottom: 0.2,
        //     },
        //     borderVisible: false,
        // },
        layout: {
            background: { color: '#fff' },
            textColor: '#333333',
        },
        grid: {
            vertLines: {
                color: 'rgba(197, 203, 206, 0.5)',
            },
            horzLines: {
                color: 'rgba(197, 203, 206, 0.5)',
            },
        },
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


    let loadedDataCount = 0;
    let isLoading = false;
    let lastLogicalRange: { from: number; to: number } | null = null;
    let isOver = false;

    const loadMoreData = async () => {
        if (isLoading || isOver) return;
        isLoading = true;

        const success = await props.fetchMoreData();
        if (!success) isOver = true;
        loadedDataCount += props.foodData.length;

        isLoading = false;

        if (lastLogicalRange && lastLogicalRange.to > loadedDataCount) {
            loadMoreData();
        }
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
        lastLogicalRange = logicalRange;
        if (!isLoading && logicalRange && logicalRange.from < 0) {
            console.log('logicalRange', logicalRange)
            loadMoreData();
        }
    });
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