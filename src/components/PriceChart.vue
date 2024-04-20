<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    type ChartData,
    type ChartOptions
} from 'chart.js'
import { watch, ref, type PropType } from 'vue';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const props = defineProps({
    chartData: {
        type: Object as PropType<ChartData<'line'>>,
        required: true
    },
    chartOptions: {
        type: Object as PropType<ChartOptions<'line'>>,
        default: () => ({
            responsive: true,
            maintainAspectRatio: false
        })
    }
})

const chartOptions = ref(props.chartOptions)

watch(
    () => props.chartOptions,
    (newOptions) => {
        chartOptions.value = newOptions
    },
    { deep: true }
)
</script>