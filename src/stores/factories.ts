import { defineStore } from 'pinia';
import { usePricesStore } from './prices';
import type { Factories, ResourceFactoriesType } from '@/types/main';

export const useFactoriesStore = defineStore('factories', () => {
    const factories: Factories = {
        sawmill: {
            build_slot_cost: 6000,
            resource: 'planks',
            levels: [
                {
                    level: 1,
                    up_level_price: {
                        wood: 31200,
                        gold: 5200,
                        stone: 1000
                    },
                    craft_recipe: {
                        wood: 1000
                    },
                    result_craft: 1
                },
                {
                    level: 2,
                    up_level_price: {
                        planks: 10,
                        soup: 5,
                        ingot: 5,
                        stone: 1500
                    },
                    craft_recipe: {
                        wood: 900
                    },
                    result_craft: 2
                },
                {
                    level: 3,
                    up_level_price: {
                        planks: 10,
                        soup: 5,
                        ingot: 5,
                        stone: 2500
                    },
                    craft_recipe: {
                        wood: 800
                    },
                    result_craft: 2
                },
                {
                    level: 4,
                    up_level_price: {
                        planks: 10,
                        soup: 5,
                        ingot: 5,
                        stone: 3500
                    },
                    craft_recipe: {
                        wood: 700
                    },
                    result_craft: 3
                },
                {
                    level: 5,
                    up_level_price: {
                        planks: 10,
                        soup: 5,
                        ingot: 5,
                        stone: 4500
                    },
                    craft_recipe: {
                        wood: 600
                    },
                    result_craft: 3
                }
            ],
            cooldown: 24,
        },
        kitchen: {
            build_slot_cost: 9000,
            resource: 'soup',
            levels: [
                {
                    level: 1,
                    up_level_price: {
                        wood: 25200,
                        gold: 4200,
                        stone: 1000
                    },
                    craft_recipe: {
                        food: 1000
                    },
                    result_craft: 1
                },
                {
                    level: 2,
                    up_level_price: {
                        planks: 5,
                        soup: 10,
                        ingot: 5,
                        stone: 1500
                    },
                    craft_recipe: {
                        food: 900
                    },
                    result_craft: 2
                },
                {
                    level: 3,
                    up_level_price: {
                        planks: 5,
                        soup: 10,
                        ingot: 5,
                        stone: 2500
                    },
                    craft_recipe: {
                        food: 800
                    },
                    result_craft: 2
                },
                {
                    level: 4,
                    up_level_price: {
                        planks: 5,
                        soup: 10,
                        ingot: 5,
                        stone: 3500
                    },
                    craft_recipe: {
                        food: 700
                    },
                    result_craft: 3
                },
                {
                    level: 5,
                    up_level_price: {
                        planks: 5,
                        soup: 10,
                        ingot: 5,
                        stone: 4500
                    },
                    craft_recipe: {
                        food: 600
                    },
                    result_craft: 3
                }
            ],
            cooldown: 24,
        },
        forge: {
            build_slot_cost: 12000,
            resource: 'ingot',
            levels: [
                {
                    level: 1,
                    up_level_price: {
                        wood: 36000,
                        gold: 6000,
                        stone: 2000
                    },
                    craft_recipe: {
                        gold: 1000
                    },
                    result_craft: 1
                },
                {
                    level: 2,
                    up_level_price: {
                        planks: 5,
                        soup: 5,
                        ingot: 10,
                        stone: 1500
                    },
                    craft_recipe: {
                        gold: 900
                    },
                    result_craft: 2
                },
                {
                    level: 3,
                    up_level_price: {
                        planks: 5,
                        soup: 5,
                        ingot: 10,
                        stone: 2500
                    },
                    craft_recipe: {
                        gold: 800
                    },
                    result_craft: 2
                },
                {
                    level: 4,
                    up_level_price: {
                        planks: 5,
                        soup: 5,
                        ingot: 10,
                        stone: 3500
                    },
                    craft_recipe: {
                        gold: 700
                    },
                    result_craft: 3
                },
                {
                    level: 5,
                    up_level_price: {
                        planks: 5,
                        soup: 5,
                        ingot: 10,
                        stone: 4500
                    },
                    craft_recipe: {
                        gold: 600
                    },
                    result_craft: 3
                }
            ],
            cooldown: 24,
        }
    };

    const guilds = {
        sawmill: {
            cost_build: {
                wood: 15000,
                food: 25000,
                gold: 10000,
            },
            required_level: 3
        },
        kitchen: {
            cost_build: {
                wood: 15000,
                food: 25000,
                gold: 10000,
            },
            required_level: 3
        },
        forge: {
            cost_build: {
                wood: 15000,
                food: 25000,
                gold: 10000,
            },
            required_level: 3
        },
    }

    const pricesStore = usePricesStore();


    function getFactoryUpgradeCost(factoryName: keyof typeof factories, level: number): number {
        const factoryLevel = factories[factoryName].levels[level - 1];
        let totalCost = 0;

        for (const [resource, cost] of Object.entries(factoryLevel.up_level_price)) {
            totalCost += cost * pricesStore.getResourcePrice(resource as ResourceFactoriesType);
        }

        return totalCost;
    }

    function getFactoryTotalUpgradeCost(factoryName: keyof typeof factories, level: number): number {
        let totalCost = factories[factoryName].build_slot_cost * pricesStore.getResourcePrice('stone');

        for (let i = 0; i < level; i++) {
            const factoryLevel = factories[factoryName].levels[i];
            for (const [resource, cost] of Object.entries(factoryLevel.up_level_price)) {
                totalCost += cost * pricesStore.getResourcePrice(resource as ResourceFactoriesType);
            }
        }

        return totalCost;
    }

    function getFactoryDailyProfit(factoryName: keyof typeof factories, level: number): number {
        const factoryLevel = factories[factoryName].levels[level - 1];
        const craftRecipe = factoryLevel.craft_recipe;
        const resultCraft = factoryLevel.result_craft;
        const resultResource = factories[factoryName].resource;

        let totalCraftCost = 0;
        for (const [resource, cost] of Object.entries(craftRecipe)) {
            totalCraftCost += cost * pricesStore.getResourcePrice(resource as ResourceFactoriesType);
        }

        const grossProfit = resultCraft * pricesStore.getResourcePrice(resultResource);
        const netProfit = grossProfit - totalCraftCost;

        return netProfit;
    }

    function getFactoryROI(factoryName: keyof typeof factories, level: number): { hours: number; days: number } {
        const totalUpgradeCost = getFactoryTotalUpgradeCost(factoryName, level);
        const dailyProfit = getFactoryDailyProfit(factoryName, level);

        const roiDays = totalUpgradeCost / dailyProfit;
        const roiHours = roiDays * 24;

        return { hours: roiHours, days: roiDays };
    }

    return {
        factories,
        guilds,
        getFactoryUpgradeCost,
        getFactoryDailyProfit,
        getFactoryROI,
    };
});