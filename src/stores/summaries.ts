import { defineStore } from 'pinia';
import { useAccountsStore } from './accounts';
import { useToolsStore } from './tools';

export const useSummariesStore = defineStore('summaries', () => {
  const accountsStore = useAccountsStore();
  const toolsStore = useToolsStore();

  function getAccountToolsResourceSummary(accountId: number): Record<string, number> {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return {};

    const resourceSummary: Record<string, number> = {};
    account.tools.forEach(tool => {
      const resource = tool.resource;
      const amount = tool.profit * 24;
      if (amount > 0) {
        if (resourceSummary[resource]) {
          resourceSummary[resource] += amount;
        } else {
          resourceSummary[resource] = amount;
        }
      }
    });
    return resourceSummary;
  }

  function getAccountToolsProfitSummary(accountId: number): number {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return 0;

    return account.tools.reduce((sum, tool) => sum + toolsStore.getToolDailyProfit(tool), 0);
  }

  function getAccountToolsConsumptionSummary(accountId: number): Record<string, number> {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return { food: 0, gold: 0 };

    const consumptionSummary: Record<string, number> = {
      food: 0,
      gold: 0
    };

    account.tools.forEach(tool => {
      consumptionSummary.food += tool.energy / tool.cooldown * 24 / 5;
      consumptionSummary.gold += tool.durability / tool.cooldown * 24 / 5;
    });

    return consumptionSummary;
  }

  function getAllToolsProfitSummary(): number {
    return accountsStore.accounts.reduce((sum, account) => sum + account.tools.reduce((acc, tool) => acc + toolsStore.getToolDailyProfit(tool), 0), 0);
  }

  function getAllToolsROI(): number {
    const totalProfit = getAllToolsProfitSummary();
    if (totalProfit === 0) return 0;
    const totalInvestment = accountsStore.accounts.reduce((sum, account) => sum + account.tools.reduce((acc, tool) => acc + tool.craftPrice, 0), 0);
    return totalInvestment / totalProfit;
  }

  function getUserToolsROI(accountId: number): number {
    const account = accountsStore.accounts.find(acc => acc.id === accountId);
    if (!account) return 0;

    const totalProfit = getAccountToolsProfitSummary(accountId);
    if (totalProfit === 0) return 0;
    const totalInvestment = account.tools.reduce((sum, tool) => sum + tool.craftPrice, 0);
    return totalInvestment / totalProfit;
  }

  return {
    getAccountToolsResourceSummary,
    getAccountToolsProfitSummary,
    getAccountToolsConsumptionSummary,
    getAllToolsProfitSummary,
    getAllToolsROI,
    getUserToolsROI
  };
});