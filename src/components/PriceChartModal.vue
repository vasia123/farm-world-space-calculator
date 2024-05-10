<template>
  <div v-show="showModal" class="modal chart-modal">
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
            <div class="chart-buttons">
              <button type="button" class="chart-button btn btn-link"
                :class="{ 'chart-button-active': selectedResourcesType === 'simple' }"
                @click="chooseResourcesGraph('simple')">
                <img src="/img/wood.png" width="40px" height="40px" />
                <img src="/img/food.png" width="40px" height="40px" />
                <img src="/img/gold.png" width="40px" height="40px" />
                <img src="/img/stone.png" width="40px" height="40px" />
              </button>
              <button type="button" class="chart-button btn btn-link"
                :class="{ 'chart-button-active': selectedResourcesType === 'factories' }"
                @click="chooseResourcesGraph('factories')">
                <img src="/img/planks.png" width="40px" height="40px" />
                <img src="/img/soup.png" width="40px" height="40px" />
                <img src="/img/ingot.png" width="40px" height="40px" />
              </button>
            </div>
            <div class="chart-container" v-if="selectedResourcesType === 'simple'">
              <PriceChart :resources-data="{
                FOOD: chartStore.foodData,
                GOLD: chartStore.goldData,
                WOOD: chartStore.woodData,
                STONE: chartStore.StoneData,
              }" :fetch-more-data="fetchMoreData" />
            </div>
            <div class="chart-container" v-if="selectedResourcesType === 'factories'">
              <PriceChart :resources-data="{
                INGOT: chartStore.IngotData,
                PLANKS: chartStore.PlanksData,
                SOUP: chartStore.SoupData,
              }" :fetch-more-data="fetchMoreData" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

const selectedResourcesType = ref<'simple' | 'factories' | ''>('');

async function fetchMoreData() {
  return await chartStore.fetchMoreData();
}

function closeModal() {
  modalsStore.closeChartModal();
}

function chooseResourcesGraph(type: 'simple' | 'factories') {
  selectedResourcesType.value = type;
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


<style scoped>
.chart-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.chart-button {
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s;
}

.chart-button:hover {
  background-color: #f0f0f0;
}

.chart-button-active {
  border: 2px solid #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.chart-button img {
  margin: 0 5px;
}
</style>