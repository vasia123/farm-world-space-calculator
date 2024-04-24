<template>
    <div class="chart-date-header">
        {{ formattedDate }}
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    date: {
        type: Date,
        required: true,
    },
});

const formattedDate = computed(() => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return props.date.toLocaleDateString(undefined, options);
});
</script>

<style scoped>
.chart-date-header {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
}
</style>