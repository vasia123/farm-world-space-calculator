import { defineStore } from 'pinia';
import { useAccountsStore } from './accounts';
import { useToolsStore } from './tools';
import { useBuffsStore } from './buffs';
import { usePricesStore } from './prices';
import type { ResourceFactoriesType, Buff, ResourceType } from '@/types/main';
import { useFactoriesStore } from './factories';

export const useSummariesStore = defineStore('summaries', () => {
  const accountsStore = useAccountsStore();
  const toolsStore = useToolsStore();
  const buffsStore = useBuffsStore();
  const pricesStore = usePricesStore();
  const factoriesStore = useFactoriesStore();

  function getAccountRawResourcesSummary(accountId: number): Record<string, number> {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return {};

    const resourceSummary: Record<string, number> = {};
    account.tools.forEach(tool => {
      const resource = tool.resource;
      const amount = tool.profit * 24;
      if (amount > 0) {
        if (resource in resourceSummary) {
          resourceSummary[resource] += amount;
        } else {
          resourceSummary[resource] = amount;
        }
      }
    });
    account.factories?.forEach(factory => {
      const resource = factory.data.resource;
      const amount = factory.level.result_craft;
      if (amount > 0) {
        if (resource in resourceSummary) {
          resourceSummary[resource] += amount;
        } else {
          resourceSummary[resource] = amount;
        }
      }
    });
    return resourceSummary;
  }
  function getAccountResourcesSummary(accountId: number): Record<string, number> {
    const profitSummary = getAccountRawResourcesSummary(accountId)
    const consumptionSummary = getAccountRawConsumptionSummary(accountId)
    if (profitSummary.wood) {
      profitSummary.wood -= consumptionSummary.wood;
      if (profitSummary.wood < 0) profitSummary.wood = 0;
    }
    if (profitSummary.food) {
      profitSummary.food -= consumptionSummary.food;
      if (profitSummary.food < 0) profitSummary.food = 0;
    }
    if (profitSummary.gold) {
      profitSummary.gold -= consumptionSummary.gold;
      if (profitSummary.gold < 0) profitSummary.gold = 0;
    }

    return profitSummary;
  }

  function getAccountProfitSummary(accountId: number): number {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return 0;
    const toolsDailyProfit = account.tools.reduce((sum, tool) => sum + toolsStore.getToolDailyProfit(tool), 0);
    const factoriesDailyProfit = account.factories?.reduce(
      (sum, factory) => sum + factoriesStore.getFactoryDailyProfit(factory.name, factory.level.level),
      0
    ) || 0;

    return toolsDailyProfit + factoriesDailyProfit;
  }

  function getAccountRawConsumptionSummary(accountId: number): { [key in ResourceType]: number } {
    const consumptionSummary: { [key in ResourceType]: number } = {
      food: 0,
      gold: 0,
      wood: 0
    };

    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return consumptionSummary;

    account.tools.forEach(tool => {
      consumptionSummary.food += tool.energy / tool.cooldown * 24 / 3;
      consumptionSummary.gold += tool.durability / tool.cooldown * 24 / 5;
    });

    account.factories?.forEach(factory => {
      for (const resource of Object.keys(factory.level.craft_recipe)) {
        consumptionSummary[resource as ResourceType] += factory.level.craft_recipe[resource as ResourceType] || 0
      }
    });

    return consumptionSummary;
  }
  function getAccountConsumptionSummary(accountId: number): { [key in ResourceType]: number } {
    const consumptionSummary = getAccountRawConsumptionSummary(accountId)
    const profitSummary = getAccountRawResourcesSummary(accountId)
    if (profitSummary.wood) {
      consumptionSummary.wood -= profitSummary.wood;
      if (consumptionSummary.wood < 0) consumptionSummary.wood = 0;
    }
    if (profitSummary.food) {
      consumptionSummary.food -= profitSummary.food;
      if (consumptionSummary.food < 0) consumptionSummary.food = 0;
    }
    if (profitSummary.gold) {
      consumptionSummary.gold -= profitSummary.gold;
      if (consumptionSummary.gold < 0) consumptionSummary.gold = 0;
    }

    return consumptionSummary;
  }

  function getAllProfitSummary(): number {
    return accountsStore.accounts.reduce(
      (fullSum, account) => {
        const toolsDailyProfit = account.tools.reduce((sum, tool) => sum + toolsStore.getToolDailyProfit(tool), 0);
        const factoriesDailyProfit = account.factories?.reduce(
          (sum, factory) => sum + factoriesStore.getFactoryDailyProfit(factory.name, factory.level.level),
          0
        ) || 0;
        return fullSum + toolsDailyProfit + factoriesDailyProfit;
      },
      0
    );
  }

  function getFullAccountROI(): number {
    const totalProfit = getAllProfitSummary();
    if (totalProfit === 0) return 0;
    const totalInvestment = accountsStore.accounts.reduce(
      (fullSum, account) => {
        const toolsCraftPrice = account.tools.reduce((acc, tool) => acc + tool.craftPrice, 0)
        const factoriesCraftPrice = account.factories?.reduce((acc, factory) => acc + factory.craftPrice, 0) || 0
        return fullSum + toolsCraftPrice + factoriesCraftPrice;
      }, 0);
    return totalInvestment / totalProfit;
  }

  function getAccountROI(accountId: number): number {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return 0;

    const totalProfit = getAccountProfitSummary(accountId);
    if (totalProfit === 0) return 0;
    const toolsCraftPrice = account.tools.reduce((acc, tool) => acc + tool.craftPrice, 0)
    const factoriesCraftPrice = account.factories?.reduce((acc, factory) => acc + factory.craftPrice, 0) || 0
    return (toolsCraftPrice + factoriesCraftPrice) / totalProfit;
  }

  function getAccountBuffROI(accountId: number, buff: Buff): number {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return 0;
    const buffData = buffsStore.buffs.find(b => b.name === buff.name);
    if (!buffData) throw new Error("no buff data!");

    const buffCost = Object.entries(buffData.cost).reduce((total, [resource, amount]) => {
      const tonTotal = resource === 'ton'
        ? amount
        : amount * pricesStore.getResourcePrice(resource as ResourceFactoriesType)
      return total + tonTotal;
    }, 0);

    const originalProfit = getAccountProfitSummary(accountId);
    const updatedTools = account.tools.map(tool => buffsStore.applyBuffToTool(tool, buff));
    const updatedProfit = updatedTools.reduce((total, tool) => total + toolsStore.getToolDailyProfit(tool), 0);

    const profitIncrease = updatedProfit - originalProfit;
    const roiDays = buffCost / profitIncrease;

    return roiDays;
  }

  return {
    getAccountResourcesSummary,
    getAccountProfitSummary,
    getAccountConsumptionSummary,
    getAllProfitSummary,
    getFullAccountROI,
    getAccountROI,
    getAccountBuffROI,
  };
});