<template>
  <div class="page-outer">
    <Navbar />

    <h1 class="title">
      {{ $t('title') }}
      <a href="https://t.me/Farm_world_bot/app?startapp=ref_8485" target="_blank">
        Farm World
      </a>
    </h1>

    <div v-if="serverError" class="server-error red mb-3">{{ $t('serverError') }}</div>

    <AccountList />

    <StackPriceCalculator />

    <ToolTypeSummary />
  </div>

  <Footer />
  <AddToolModal />
  <SettingsMenu />
  <PriceChartModal v-if="modalsStore.showChartModal" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAccountsStore } from '@/stores/accounts';
import { usePricesStore } from '@/stores/prices';
import { useModalsStore } from '@/stores/modals';
import { useSettingsStore } from '@/stores/settings';
import Navbar from '@/components/NavBar.vue';
import AccountList from '@/components/AccountList.vue';
import ToolTypeSummary from '@/components/ToolTypeSummary.vue';
import Footer from '@/components/PageFooter.vue';
import AddToolModal from '@/components/AddToolModal.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';
import PriceChartModal from '@/components/PriceChartModal.vue';
import StackPriceCalculator from '@/components/StackPriceCalculator.vue';

const { t: $t } = useI18n();
const accountsStore = useAccountsStore();
const pricesStore = usePricesStore();
const modalsStore = useModalsStore();
const settingsStore = useSettingsStore();

const serverError = computed(() => settingsStore.serverError);

let reloadTimeout: number;

function startReloadTimer() {
  reloadTimeout = window.setTimeout(() => {
    window.location.reload();
  }, 30 * 60 * 1000);
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    const { locale } = useI18n();
    locale.value = savedLanguage;
  }
  accountsStore.loadAccounts();
  startReloadTimer();
  pricesStore.startPricesTimers();
  window.addEventListener('beforeunload', () => {
    window.clearTimeout(reloadTimeout);
  });
});

onUnmounted(() => {
  window.clearTimeout(reloadTimeout);
  pricesStore.stopPricesTimers();
});
</script>