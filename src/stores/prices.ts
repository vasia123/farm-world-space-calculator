import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings'
import type { ResourceType, ResourceFactoriesType } from '@/types/main';

export const usePricesStore = defineStore('prices', () => {
  type Prices = { [key in ResourceType | ResourceFactoriesType]: number }
  const prices = ref<Prices>({
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

  const settingsStore = useSettingsStore()

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

  function getResourcePrice(resource: ResourceType | ResourceFactoriesType): number {
    return prices.value[resource] || 0;
  }

  function setManualPrices() {
    settingsStore.setState('local')
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
        return JSON.parse(storedPrices)
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

  return {
    prices,
    tonPriceUsd,
    fetchPrices,
    fetchTonPrice,
    getResourcePrice,
    startPricesTimers,
    setManualPrices,
    stopPricesTimers,
  };
});