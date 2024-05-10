import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UTCTimestamp } from 'lightweight-charts';

export const useChartStore = defineStore('chart', () => {
  const chartPrices = ref<{
    FOOD: string;
    GOLD: string;
    WOOD: string;

    INGOT: string;
    PLANKS: string;
    SOUP: string;
    STONE: string;

    date_update: number;
  }[]>([]);
  const chartError = ref(false);
  const currentDate = ref(new Date());
  const chartCache = ref<Record<string, { data: typeof chartPrices.value; timestamp: number }>>({});

  async function fetchChartPrices(): Promise<boolean> {
    const year = currentDate.value.getFullYear();
    const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.value.getDate()).padStart(2, '0');
    const cacheKey = `${year}-${month}-${day}`;

    if (chartCache.value[cacheKey]) {
      const cachedData = chartCache.value[cacheKey];
      const now = Date.now();
      const cacheAge = (now - cachedData.timestamp) / 1000; // Cache age in seconds

      if (cacheAge < 300) { // Cache is valid for 5 minutes (300 seconds)
        chartPrices.value = [...cachedData.data, ...chartPrices.value];
        chartError.value = false;
        return true;
      }
    }

    const url = `https://vasia123.github.io/farm-world-space-prices/${year}-${month}/${day}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch chart prices');
      }
      const data = await response.json();
      chartPrices.value = [...data, ...chartPrices.value];
      chartError.value = false;

      chartCache.value[cacheKey] = {
        data: data,
        timestamp: Date.now()
      };

      return true;
    } catch (error) {
      console.error('Error fetching chart prices:', error);
      chartError.value = true;
      return false;
    }
  }

  const foodData = computed(() =>
    chartPrices.value.map(price => ({
      time: price.date_update as UTCTimestamp,
      value: parseFloat(price.FOOD)
    }))
  );

  const goldData = computed(() =>
    chartPrices.value.map(price => ({
      time: price.date_update as UTCTimestamp,
      value: parseFloat(price.GOLD)
    }))
  );

  const woodData = computed(() =>
    chartPrices.value.map(price => ({
      time: price.date_update as UTCTimestamp,
      value: parseFloat(price.WOOD)
    }))
  );

  const IngotData = computed(() =>
    chartPrices.value.map(price => ({
      time: price.date_update as UTCTimestamp,
      value: parseFloat(price.INGOT)
    }))
  );

  const PlanksData = computed(() =>
    chartPrices.value.map(price => ({
      time: price.date_update as UTCTimestamp,
      value: parseFloat(price.PLANKS)
    }))
  );

  const SoupData = computed(() =>
    chartPrices.value.map(price => ({
      time: price.date_update as UTCTimestamp,
      value: parseFloat(price.SOUP)
    }))
  );

  const StoneData = computed(() =>
    chartPrices.value.map(price => ({
      time: price.date_update as UTCTimestamp,
      value: parseFloat(price.STONE)
    }))
  );

  async function fetchMoreData() {
    const prevDate = new Date(currentDate.value);
    prevDate.setDate(prevDate.getDate() - 1);

    if (prevDate >= new Date(2023, 3, 19)) {
      currentDate.value = prevDate;
      return fetchChartPrices();
    }
    return false;
  }

  return {
    chartPrices,
    chartError,
    currentDate,
    chartCache,
    fetchChartPrices,

    foodData,
    goldData,
    woodData,
    IngotData,
    PlanksData,
    SoupData,
    StoneData,

    fetchMoreData
  };
});