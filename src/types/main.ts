

export type ResourceType = 'wood' | 'food' | 'gold'

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
export interface Account {
    id: number;
    name: string;
    tools: CraftedTool[];
    editing: boolean;
}