<template>
    <div v-if="showModal" class="modal chart-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('priceCharts') }}</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="chartError && !chartPrices.length" class="alert alert-danger">{{ $t('chartError') }}</div>
            <div v-else>
              <div class="chart-container">
                <PriceChart :food-data="foodData" :gold-data="goldData" :wood-data="woodData" :fetch-more-data="fetchMoreData" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useModalsStore } from '@/stores/modals';
  import { useChartStore } from '@/stores/chart';
  import PriceChart from '@/components/PriceChart.vue';
  
  const { t: $t } = useI18n();
  const modalsStore = useModalsStore();
  const chartStore = useChartStore();
  
  const showModal = computed(() => modalsStore.showChartModal);
  const chartPrices = computed(() => chartStore.chartPrices);
  const chartError = computed(() => chartStore.chartError);
  const foodData = computed(() => chartStore.foodData);
  const goldData = computed(() => chartStore.goldData);
  const woodData = computed(() => chartStore.woodData);
  
  async function fetchMoreData() {
    return await chartStore.fetchMoreData();
  }
  
  function closeModal() {
    modalsStore.closeChartModal();
  }
  
  onMounted(async () => {
    if (showModal.value) {
      const result = await chartStore.fetchChartPrices();
      if (!result) {
        const prevDate = new Date(chartStore.currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        chartStore.currentDate = prevDate;
        chartStore.chartPrices = [];
        await chartStore.fetchChartPrices();
      }
    }
  });
  </script>