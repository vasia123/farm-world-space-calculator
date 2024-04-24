<template>
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar">
        <div class="navbar-prices">
            <div class="alert alert-light p-1 fw_topBox token_TON" style="">
                <img class="mr-1" src="/img/ton_g.png">
                <strong>{{ formatNumber(store.tonPriceUsd) }}$</strong>
            </div>
            <div class="alert alert-light p-1 fw_topBox token_FWW" style="">
                <img class="mr-1" src="/img/wood_shadow.png">
                <strong>{{ formatNumber(store.prices.wood) }}</strong>
            </div>
            <div class="alert alert-light p-1 fw_topBox token_FWF" style="">
                <img class="mr-1" src="/img/food_shadow.png">
                <strong>{{ formatNumber(store.prices.food) }}</strong>
            </div>
            <div class="alert alert-light p-1 fw_topBox token_FWG" style="">
                <img class="mr-1" src="/img/gold_shadow.png">
                <strong>{{ formatNumber(store.prices.gold) }}</strong>
            </div>
            <button @click="$emit('open-chart-modal')" class="btn btn-primary">{{ $t('showCharts') }}</button>
        </div>
        <ul class="nav navbar-nav nav-flex-icons ml-auto">
            <li class="nav-item">
                <button class="nav-link btn btn-link" :class="{ 'active': locale === 'en' }"
                    @click="$emit('change-language', 'en')">
                    <FlagEng />
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link btn btn-link" :class="{ 'active': locale === 'ru' }"
                    @click="$emit('change-language', 'ru')">
                    <FlagRu />
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link btn btn-link" @click="$emit('toggle-settings-menu')">
                    <SettingsIcon />
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { formatNumber } from '@/shared/utils'
import { useStore } from '@/stores/prices';
import FlagEng from '@/components/icons/flag-eng.vue'
import FlagRu from '@/components/icons/flag-ru.vue'
import SettingsIcon from '@/components/icons/settings-icon.vue'
import type { Account } from '@/types/main';

const store = useStore();

defineProps({
    accounts: Array<Account>,
    prices: Object,
    locale: String,
    tonPriceUsd: [Number, String]
});

defineEmits(['change-language', 'toggle-settings-menu', 'open-chart-modal']);

</script>