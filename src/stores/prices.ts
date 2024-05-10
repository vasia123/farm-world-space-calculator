import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings'

export const usePricesStore = defineStore('prices', () => {
  const prices = ref({
    wood: 0.00,
    food: 0.00,
    gold: 0.00,
  });
  const tonPriceUsd = ref<number | string>('...');
  let priceTimeout: number;
  let priceTonTimeout: number;

  const settingsStore = useSettingsStore()

  async function fetchPrices() {
    try {
      const response = await fetch('https://app.farm-world.space/tokens.php?access_token=FFGrIZyIsxIl17TaIxlBKHp7ZEZ55g');
      const data = await response.json();
      prices.value.wood = data.WOOD;
      prices.value.food = data.FOOD;
      prices.value.gold = data.GOLD;
      priceTimeout = window.setTimeout(fetchPrices, 30 * 1000);
    } catch (error) {
      console.error(error);
    }
  }
  
  function getResourcePrice(resource: string): number {
    switch (resource) {
      case 'wood':
        return Number(prices.value.wood);
      case 'food':
        return Number(prices.value.food);
      case 'gold':
        return Number(prices.value.gold);
      default:
        return 0;
    }
  }

  function setManualPrices() {
    settingsStore.setState('local')
    window.clearTimeout(priceTimeout);
  }

  function saveTonPrice(price: number | string) {
    localStorage.setItem('tonPrice', price.toString());
  }
  function loadTonPrice(): number | string | null {
    const storedPrice = localStorage.getItem('tonPrice');
    return storedPrice ? storedPrice : null;
  }
  async function fetchTonPrice() {
    try {
      const response = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd');
      const data = await response.json();
      const price = data?.rates?.TON?.prices?.USD || 'err';
      tonPriceUsd.value = price;
      saveTonPrice(price);
    } catch (error) {
      console.error('Ошибка получения цены TON Coin:', error);
    }
    priceTonTimeout = setInterval(fetchTonPrice, 5 * 60 * 1000);
  }
  async function startPricesTimers() {
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