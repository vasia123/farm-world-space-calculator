import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    tonPriceUsd: '🤷‍♂️' as number | string,
    prices: {
      wood: 0.0072,
      food: 0.0069,
      gold: 0.0095
    }
  }),
  actions: {
    async fetchTonPrice() {
      try {
        const response = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd');
        const data = await response.json();
        const price = data?.rates?.TON?.prices?.USD || 'err';
        this.tonPriceUsd = price;
        this.saveTonPrice(price);
      } catch (error) {
        console.error('Ошибка получения цены TON Coin:', error);
      }
    },
    saveTonPrice(price: number | string) {
      localStorage.setItem('tonPrice', price.toString());
    },
    loadTonPrice() {
      const storedPrice = localStorage.getItem('tonPrice');
      this.tonPriceUsd = storedPrice ? storedPrice : '🤷‍♂️';
    },
    setManualPrices() {
      // Логика для установки цен вручную
    },
    async fetchPrices() {
      try {
        const response = await fetch('https://app.farm-world.space/tokens.php?access_token=FFGrIZyIsxIl17TaIxlBKHp7ZEZ55g');
        const data = await response.json();
        this.prices.wood = data.WOOD;
        this.prices.food = data.FOOD;
        this.prices.gold = data.GOLD;
      } catch (error) {
        console.error('Ошибка получения цен:', error);
      }
    }
  }
});