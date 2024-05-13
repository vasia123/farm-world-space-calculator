import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import type { ResourceType, ResourceFactoriesType } from '@/types/main';
import { useChartStore } from './chart';

export const usePricesStore = defineStore('prices', () => {
  type Prices = { [key in ResourceType | ResourceFactoriesType]: number };
  const prices = ref<Prices>({
    wood: 0.00,
    food: 0.00,
    gold: 0.00,
    ingot: 0.00,
    planks: 0.00,
    soup: 0.00,
    stone: 0.00,
  });
  const prevDayAveragePrices = ref<Prices>({
    wood: 0.00,
    food: 0.00,
    gold: 0.00,
    ingot: 0.00,
    planks: 0.00,
    soup: 0.00,
    stone: 0.00,
  });
  const tonPriceUsd = ref<number | string>('...');
  let priceTimeout: number;
  let priceTonTimeout: number;

  const settingsStore = useSettingsStore();
  const chartStore = useChartStore();

  async function fetchPrices() {
    try {
      const response = await fetch('https://app.farm-world.space/tokens.php?access_token=FFGrIZyIsxIl17TaIxlBKHp7ZEZ55g');
      const data = await response.json();
      if (data.WOOD) prices.value.wood = data.WOOD;
      if (data.FOOD) prices.value.food = data.FOOD;
      if (data.GOLD) prices.value.gold = data.GOLD;
      if (data.INGOT) prices.value.ingot = data.INGOT;
      if (data.PLANKS) prices.value.planks = data.PLANKS;
      if (data.SOUP) prices.value.soup = data.SOUP;
      if (data.STONE) prices.value.stone = data.STONE;
      priceTimeout = window.setTimeout(fetchPrices, 30 * 1000);
      saveResourcesPrices();
    } catch (error) {
      console.error(error);
    }
  }

  async function loadPricesForThreeDays() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const pricesPromises = [
      chartStore.fetchChartPrices(tomorrow),
      chartStore.fetchChartPrices(today),
      chartStore.fetchChartPrices(yesterday),
      chartStore.fetchChartPrices(twoDaysAgo),
    ];

    const pricesDataAll = await Promise.all(pricesPromises);
    const pricesData = pricesDataAll.filter(prices => prices.length > 0).sort((a, b) => a[0].date_update - b[0].date_update);

    if (pricesData.length > 0) {
      const prevDayPrices = pricesData[pricesData.length - 1];
      const resourceTypes: (ResourceType | ResourceFactoriesType)[] = ['wood', 'food', 'gold', 'ingot', 'planks', 'soup', 'stone'];
      resourceTypes.forEach(resource => {
        const prices = prevDayPrices.map((item: any) => parseFloat(item[resource.toUpperCase()])).filter(price => price > 0);
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        prevDayAveragePrices.value[resource] = averagePrice;
      });
    }
  }

  function getResourcePrice(resource: ResourceType | ResourceFactoriesType): number {
    return prices.value[resource] || 0;
  }

  function setManualPrices() {
    settingsStore.setState('local');
    window.clearTimeout(priceTimeout);
  }

  function saveTonPrice(price: number | string) {
    localStorage.setItem('tonPrice', price.toString());
  }

  function saveResourcesPrices() {
    localStorage.setItem('resourcesPrices', JSON.stringify(prices.value));
  }

  function loadResourcesPrices(): Prices | null {
    const storedPrices = localStorage.getItem('resourcesPrices');
    if (storedPrices) {
      try {
        return JSON.parse(storedPrices);
      } catch (error) {
        // 
      }
    }
    return null;
  }

  function loadTonPrice(): number | string | null {
    const storedPrice = localStorage.getItem('tonPrice');
    return storedPrice ? storedPrice : null;
  }

  async function fetchTonPrice() {
    try {
      const response = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd');
      const data = await response.json();
      const price = data?.rates?.TON?.prices?.USD;
      if (price) {
        tonPriceUsd.value = price;
        saveTonPrice(price);
      }
    } catch (error) {
      console.error('Ошибка получения цены TON Coin:', error);
    }
    priceTonTimeout = setInterval(fetchTonPrice, 5 * 60 * 1000);
  }

  async function startPricesTimers() {
    const storedPrices = loadResourcesPrices();
    if (storedPrices) {
      if (storedPrices.wood) prices.value.wood = storedPrices.wood;
      if (storedPrices.food) prices.value.food = storedPrices.food;
      if (storedPrices.gold) prices.value.gold = storedPrices.gold;
      if (storedPrices.ingot) prices.value.ingot = storedPrices.ingot;
      if (storedPrices.planks) prices.value.planks = storedPrices.planks;
      if (storedPrices.soup) prices.value.soup = storedPrices.soup;
      if (storedPrices.stone) prices.value.stone = storedPrices.stone;
    }
    fetchPrices();

    const storedTonPrice = loadTonPrice();
    if (storedTonPrice && !['err', '"err"'].includes(storedTonPrice.toString())) {
      tonPriceUsd.value = storedTonPrice;
      priceTonTimeout = setInterval(fetchTonPrice, 5 * 60 * 1000);
    } else {
      fetchTonPrice();
    }
  }

  async function stopPricesTimers() {
    window.clearTimeout(priceTimeout);
    window.clearInterval(priceTonTimeout);
  }

  function getPriceChangePercentage(resource: ResourceType | ResourceFactoriesType): string {
    const currentPrice = prices.value[resource];
    const prevDayAveragePrice = prevDayAveragePrices.value[resource];
    if (prevDayAveragePrice === 0) {
      return '';
    }
    const changePercentage = ((currentPrice - prevDayAveragePrice) / prevDayAveragePrice) * 100;
    return changePercentage >= 0 ? `+${changePercentage.toFixed(1)}%` : `${changePercentage.toFixed(1)}%`;
  }

  return {
    prices,
    tonPriceUsd,
    fetchPrices,
    loadPricesForThreeDays,
    fetchTonPrice,
    getResourcePrice,
    startPricesTimers,
    setManualPrices,
    stopPricesTimers,
    getPriceChangePercentage,
  };
});