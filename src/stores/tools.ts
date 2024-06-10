import { defineStore } from 'pinia';
import type { Tool, ResourceType } from '@/types/main';
import { usePricesStore } from './prices';

export const useToolsStore = defineStore('tools', () => {
  const tools: Tool[] = [
    { name: 'Axe (Common)', icon: 'img/axe_common.png', profit: 5, wood: 2400, gold: 400, cooldown: 1, resource: 'wood', energy: 10, durability: 5, maxDurability: 100 },
    { name: 'Axe (Uncommon)', icon: 'img/axe_uncommon.png', profit: 17, wood: 7200, gold: 1200, cooldown: 1, resource: 'wood', energy: 30, durability: 15, maxDurability: 300 },
    { name: 'Axe (Rare)', icon: 'img/axe_rare.png', profit: 54, wood: 21600, gold: 3600, cooldown: 1, resource: 'wood', energy: 60, durability: 45, maxDurability: 900 },
    { name: 'Axe (Promo)', icon: 'img/axe_promo.png', profit: 1, wood: 110, gold: 20, cooldown: 1, resource: 'wood', energy: 4, durability: 1, maxDurability: 25 },
    { name: 'Bow (Common)', icon: 'img/bow_common.png', profit: 5, wood: 1200, gold: 200, cooldown: 1, resource: 'food', energy: 0, durability: 5, maxDurability: 250 },
    { name: 'Bow (Uncommon)', icon: 'img/bow_uncommon.png', profit: 20, wood: 4800, gold: 800, cooldown: 1, resource: 'food', energy: 0, durability: 20, maxDurability: 1000 },
    { name: 'Bow (Rare)', icon: 'img/bow_rare.png', profit: 80, wood: 19200, gold: 3200, cooldown: 1, resource: 'food', energy: 0, durability: 32, maxDurability: 1600 },
    { name: 'Pickaxe (Common)', icon: 'img/pikaxe_common.png', profit: 50, wood: 24000, gold: 4000, cooldown: 1, resource: 'gold', energy: 66, durability: 3, maxDurability: 250 }
  ];
  const types: Record<ResourceType, Tool[]> = {
    wood: [],
    food: [],
    gold: [],
  };
  for (const tool of tools) {
    if (!types[tool.resource]) {
      types[tool.resource] = [];
    }
    types[tool.resource].push(tool);
  }
  const toolTypes = types;

  const pricesStore = usePricesStore();

  function getToolCraftCost(tool: Tool): number {
    return tool.wood * pricesStore.prices.wood + tool.gold * pricesStore.prices.gold;
  }

  function getToolEnergyCost(tool: Tool): number {
    return tool.energy / 3 * pricesStore.prices.food;
  }

  function getToolDurabilityCost(tool: Tool): number {
    return tool.durability / 5 * pricesStore.prices.gold;
  }

  function getToolHourlyProfit(tool: Tool): number {
    const grossProfit = tool.profit * pricesStore.getResourcePrice(tool.resource);
    const energyCost = getToolEnergyCost(tool);
    const durabilityCost = getToolDurabilityCost(tool);
    const netProfit = (grossProfit - energyCost - durabilityCost) / tool.cooldown;
    return netProfit;
  }

  function getToolDailyProfit(tool: Tool) {
    return getToolHourlyProfit(tool) * 24;
  }

  function getToolROI(tool: Tool, craftPrice: number): { hours: number; days: number } {
    const hourlyProfit = getToolHourlyProfit(tool);
    const roiHours = craftPrice / hourlyProfit;
    const roiDays = roiHours / 24;
    return { hours: roiHours, days: roiDays };
  }

  return {
    tools,
    toolTypes,
    getToolCraftCost,
    getToolEnergyCost,
    getToolDurabilityCost,
    getToolHourlyProfit,
    getToolDailyProfit,
    getToolROI,
  };
});