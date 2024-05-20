

export type ResourceType = 'wood' | 'food' | 'gold'
export type ResourceFactoriesType = 'planks' | 'soup' | 'ingot' | 'stone'

export interface Tool {
    name: string;
    icon: string;
    profit: number;
    wood: number;
    gold: number;
    cooldown: number;
    resource: ResourceType;
    energy: number;
    durability: number;
    maxDurability: number;
}
export interface CraftedTool extends Tool {
    craftPrice: number;
}
export interface CraftedFactory {
    name: FactoryName;
    level: FactoryLevel;
    data: FactoryData
    craftPrice: number;
}
export interface Account {
    id: number;
    name: string;
    tools: CraftedTool[];
    factories: CraftedFactory[];
    editing: boolean;
}

export type Buff = {
    name: string;
    cost: {
        planks?: number;
        ton: number;
        soup?: number;
        ingot?: number;
    };
    bonus_percent: {
        mining_up?: number;
        energy_cost_reduce?: number;
        durability_cost_reduce?: number;
    };
    cooldown: string;
}


export type FactoryLevelPrice = {
    [key in ResourceFactoriesType | ResourceType]?: number;
};

export type FactoryLevel = {
    level: number;
    up_level_price: FactoryLevelPrice;
    craft_recipe: Partial<Record<ResourceType, number>>;
    result_craft: number;
};

export type FactoryName = "sawmill" | "kitchen" | "forge"

export interface FactoryData {
    build_slot_cost: number,
    resource: ResourceFactoriesType,
    levels: FactoryLevel[],
    cooldown: number,
}

export type Factories = {
    [key in FactoryName]: FactoryData;
};
