import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

export const useBuffsStore = defineStore('buffs', () => {
    const { t: $t } = useI18n();

    const buffs = {
        mining_buff: {
            cost: {
                planks: 5,
                ton: 1
            }, 
            bonus_percent: {
                mining_up: 30
            },
            cooldown: `30 ${$t('days')}`
        },
        energy_buff: {
            cost: {
                soup: 5,
                ton: 1
            }, 
            bonus_percent: {
                energy_cost_reduce: 100
            },
            cooldown: `30 ${$t('days')}`
        },
        durability_buff: {
            cost: {
                ingot: 5,
                ton: 1
            }, 
            bonus_percent: {
                durability_cost_reduce: 100
            },
            cooldown: `30 ${$t('days')}`
        },
    }

    return {
        buffs,
    };
});