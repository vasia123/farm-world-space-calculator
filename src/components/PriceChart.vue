<template>
    <div ref="chartContainer" style="position: relative; width: 100%; height: 100%;">
        <Line :data="chartData" :options="chartOptions" />
    </div>
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
import zoomPlugin from 'chartjs-plugin-zoom'
import { watch, ref, type PropType, onMounted } from 'vue';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
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
const chartContainer = ref<HTMLElement | null>(null)

watch(
    () => props.chartOptions,
    (newOptions) => {
        chartOptions.value = {
            ...newOptions,
            plugins: {
                ...newOptions.plugins,
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        onPanStart: ({ event }: { event: Event }) => {
                            if (event instanceof TouchEvent && event.type === 'touchstart') {
                                event.preventDefault();
                            }
                            return false;
                        },
                        onPan: ({ chart }: { chart: ChartJS }) => {
                            if (chartContainer.value) {
                                const event = chart.canvas.parentElement?.parentElement?.ownerDocument?.defaultView?.event as TouchEvent | undefined;
                                if (event && event.type === 'touchmove') {
                                    event.preventDefault();
                                }
                            }
                        },
                    }
                }
            }
        }
    },
    { deep: true }
)

onMounted(() => {
    if (chartContainer.value) {
        chartContainer.value.addEventListener('wheel', (event) => {
            event.preventDefault();
        }, { passive: false });

        chartContainer.value.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                event.preventDefault();
            }
        }, { passive: false });

        chartContainer.value.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1) {
                event.preventDefault();
            }
        }, { passive: false });
    }
})
</script>