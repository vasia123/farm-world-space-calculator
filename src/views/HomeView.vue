<template>
  <div class="page-outer">
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar">
      <div class="navbar-prices">
        <div class="alert alert-light p-1 fw_topBox token_TON" style="">
          <img class="mr-1" src="/img/ton_g.png">
          <strong>{{ formatNumber(tonPriceUsd) }}$</strong>
        </div>
        <div class="alert alert-light p-1 fw_topBox token_FWW" style="">
          <img class="mr-1" src="/img/wood_shadow.png">
          <strong>{{ formatNumber(prices.wood) }}</strong>
        </div>
        <div class="alert alert-light p-1 fw_topBox token_FWF" style="">
          <img class="mr-1" src="/img/food_shadow.png">
          <strong>{{ formatNumber(prices.food) }}</strong>
        </div>
        <div class="alert alert-light p-1 fw_topBox token_FWG" style="">
          <img class="mr-1" src="/img/gold_shadow.png">
          <strong>{{ formatNumber(prices.gold) }}</strong>
        </div>
        <button @click="openChartModal" class="btn btn-primary">{{ $t('showCharts') }}</button>
      </div>
      <ul class="nav navbar-nav nav-flex-icons ml-auto">
        <li class="nav-item">
          <button class="nav-link btn btn-link" :class="{ 'active': locale === 'en' }" @click="changeLanguage('en')">
            <FlagEng />
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link btn btn-link" :class="{ 'active': locale === 'ru' }" @click="changeLanguage('ru')">
            <FlagRu />
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link btn btn-link" @click="toggleSettingsMenu">
            <SettingsIcon />
          </button>
        </li>
      </ul>
    </nav>

    <h1 class="title">
      {{ $t('title') }}
      <a href="https://t.me/Farm_world_bot/app?startapp=ref_8485" target="_blank">
        Farm World
      </a>
    </h1>

    <div v-if="serverError" class="server-error red mb-3">{{ $t('serverError') }}</div>

    <div class="tool-box-wrapper">
      <div v-for="account in accounts" :key="account.id" class="mb-3 px-1 tool-box-container">
        <div class="card card-cascade wider">
          <div class="view view-cascade grey darken-3">
            <div class="text-center my-2 font-weight-bolder">
              {{ account.name }}
            </div>
            <div class="no-tools" v-if="account.tools.length == 0">
              {{ $t('noToolsAdded') }}<br>{{ $t('addToolsInSettings') }}
            </div>
            <div v-else class="tools-tables mb-2">
              <table class="tools-table">
                <tr>
                  <th>&nbsp;</th>
                  <th>{{ $t('production') }}</th>
                  <th>{{ $t('consumption') }}</th>
                  <th>{{ $t('income') }}</th>
                  <th>{{ $t('invested') }}</th>
                </tr>
                <tr v-for="(tool, index) in account.tools" :key="index" class="tool-row">
                  <td>
                    <img :src="tool.icon" :alt="tool.name" class="mr-2" width="20px" height="20px">
                  </td>
                  <td>
                    {{ formatNumber(tool.profit * 24) }}
                    <img
                      :src="'/farm-world-space-calculator/img/' + String(tool.resource).toLowerCase() + '_shadow.png'"
                      width="20px" height="20px" class="mb-1" />
                  </td>
                  <td>
                    <div v-if="tool.energy > 0" class="tool-costs-row">
                      {{ formatNumber(tool.energy / 5 * 24) }}
                      <img src="/img/food_shadow.png" width="20px" height="20px" class="mb-1" />
                    </div>
                    <div v-if="tool.durability > 0" class="tool-costs-row">
                      {{ formatNumber(tool.durability / 5 * 24) }}
                      <img src="/img/gold_shadow.png" width="20px" height="20px" class="mb-1" />
                    </div>
                  </td>
                  <td>
                    {{ formatNumber(getToolDailyProfit(tool)) }} <i class="ton-icon"></i>
                  </td>
                  <td>
                    {{ tool.craftPrice }} <i class="ton-icon"></i>
                  </td>
                </tr>
                <tr class="tool-row">
                  <td>
                    {{ $t('dailyProfit') }}:
                  </td>
                  <td>
                    <div v-for="(amount, resource) in getAccountToolsResourceSummary(account.id)" :key="resource"
                      class="tool-costs-row">
                      {{ formatNumber(amount) }}
                      <img :src="'/farm-world-space-calculator/img/' + resource + '_shadow.png'" width="20px"
                        height="20px" class="mb-1" />
                    </div>
                  </td>
                  <td>
                    <div v-for="(amount, resource) in getAccountToolsConsumptionSummary(account.id)" :key="resource"
                      class="tool-costs-row">
                      {{ formatNumber(amount) }}
                      <img :src="'/farm-world-space-calculator/img/' + resource + '_shadow.png'" width="20px"
                        height="20px" class="mb-1" />
                    </div>
                  </td>
                  <td>
                    {{ formatNumber(getAccountToolsProfitSummary(account.id)) }} <i class="ton-icon"></i>
                  </td>
                  <td>
                    {{ $t('roi') }}: <span class="badge grey darken-2 sm ml-1">{{ getUserToolsROI(account.id).toFixed(1)
                      }}</span>
                    {{ $t('days') }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3 px-1 tool-box-container" v-if="accounts.length > 1">
        <div class="card card-cascade wider">
          <div class="view view-cascade grey darken-3">
            <div class="text-center my-2 font-weight-bolder">
              {{ $t('fullDailyProfit') }}
            </div>
            <div class="tools-tables p-2">
              <table class="tools-table">
                <tr class="tool-row">
                  <td>
                    {{ formatNumber(getAllToolsProfitSummary()) }} <i class="ton-icon"></i>
                  </td>
                  <td>
                    {{ $t('roi') }}: <span class="badge grey darken-2 sm ml-1">{{ getAllToolsROI().toFixed(1)
                      }}</span>
                    {{ $t('days') }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="resources-container">
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4 text-center resource-item"
        v-for="(toolsOfType, resource) in toolTypes" :key="resource">
        <div class="card card-cascade wider">
          <div class="view view-cascade grey darken-3">
            <div class="m-1">
              <div class="text-center">
                <div class="chip gradbg-dark-grey shd mb-0 waves-effect resources-big">
                  <div class="mt-2 ml-2">
                    <img :src="'/farm-world-space-calculator/img/' + String(resource).toLowerCase() + '_shadow.png'">
                    <span class="badge darken-3 md no-shadow">
                      {{ formatNumber(getResourcePrice(resource)) }} <i class="ton-icon"></i>
                      <!-- <span class="badge ssm red lighten-2">-11.3%</span> -->
                    </span>
                  </div>
                </div>
              </div>
              <div class="d-block mt-4" v-for="tool in toolsOfType" :key="tool.name">
                <div class="d-inline-block w-50 b-atomic">
                  <div class="d-inline-block w-25 flex-right">
                    <img :src="tool.icon" :alt="tool.name" class="img-fluid ml-2">
                  </div>
                  <div class="d-inline-block w-75 flex-right vtop">
                    <div class="d-block">
                      <span class="badge sm no-shadow">{{ $t('dailyProfit') }}:</span>
                      <span class="badge sm  ml-1" :class="{
            'gradbg-lime2': getToolDailyProfit(tool) > 0,
            'gradbg-red': getToolDailyProfit(tool) < 0,
          }">
                        {{ formatNumber(getToolDailyProfit(tool)) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                    <div class="d-block mt-2">
                      <span class="ml-3 badge sm no-shadow">{{ $t('roi') }}:</span>
                      <span class="badge grey darken-2 sm ml-1">
                        {{ getToolDailyProfit(tool) > 0
            ? getToolROI(tool, getToolCraftCost(tool)).days.toFixed(1)
            : '🤷‍♂️'
                        }}
                      </span>
                      {{ $t('days') }}
                    </div>
                  </div>
                </div>
                <div class="d-inline-block w-50 b-alcor">

                  <div class="d-block fw_craft" v-if="tool.wood > 0">
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm no-shadow">{{ tool.wood }}</span>
                      <img src="/img/wood_shadow.png" style="height: 16px;">
                    </div>
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm no-shadow">
                        {{ formatNumber(tool.wood * prices.wood) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                  </div>

                  <div class="d-block fw_craft" v-if="tool.gold > 0">
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm no-shadow">{{ tool.gold }}</span>
                      <img src="/img/gold_shadow.png" style="height: 16px;">
                    </div>
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm no-shadow">
                        {{ formatNumber(tool.gold * prices.gold) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                  </div>

                  <div class="d-block fw_craft">
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge sm no-shadow">{{ $t('craftCost') }}:</span>
                    </div>
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge grey darken-2 sm">
                        {{ formatNumber(getToolCraftCost(tool)) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <footer class="footer">
    <div class="text-center">
      {{ $t('appreciationText') }}
      <div class="ton-address" @click="copyAddress">
        UQDv96pmc4Ze5tqMbC8I7I7jzZUu2kgGYL5-oe7tIs5HhNYr<i class="ton-icon"></i>
      </div>
      <div v-if="showCopiedMessage" class="copied-message">{{ $t('copiedMessage') }}</div>
    </div>
  </footer>
  <div v-if="showAddToolModal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('addTool') }}</h5>
          <button type="button" class="close" @click="closeAddToolModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="craftPrice">{{ $t('chooseToolType') }}</label>
            <select v-model="selectedTool" class="form-control">
              <option v-for="tool in tools" :key="tool.name" :value="tool">{{ tool.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="craftPrice">{{ $t('craftPriceFull') }}<i class="ton-icon"></i></label>
            <input type="number" id="craftPrice" class="form-control" v-model.number="craftPrice" step="0.0001">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeAddToolModal">{{ $t('cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="addUserTool">{{ $t('add') }}</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showSettingsMenu" class="settings-menu">
    <div class="settings-menu-header">
      <h3>{{ $t('settings') }}</h3>
      <button type="button" class="close" @click="toggleSettingsMenu" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="settings-menu-content">
      <div v-if="state === 'local'">
        <div>
          <label for="woodPrice">{{ $t('woodPrice') }}:</label>
          <input type="number" id="woodPrice" v-model.number="prices.wood" step="0.0001"><br>
          <label for="foodPrice">{{ $t('foodPrice') }}:</label>
          <input type="number" id="foodPrice" v-model.number="prices.food" step="0.0001"><br>
          <label for="goldPrice">{{ $t('goldPrice') }}:</label>
          <input type="number" id="goldPrice" v-model.number="prices.gold" step="0.0001"><br>
        </div>
      </div>
      <button v-if="state === 'server'" @click="setManualPrices" class="btn btn-light">{{ $t('manualPrices') }}</button>
      <button v-if="state === 'local'" @click="fetchPrices" class="btn btn-primary">{{ $t('fetchPrices') }}</button>

      <h5 class="my-4">{{ $t('accounts') }}</h5>
      <div v-if="accounts.length > 0">
        <ul class="accounts-list">
          <li v-for="account in accounts" :key="account.id" class="account-item">
            <div class="account-info">
              <div class="account-actions" v-if="!account.editing && accounts.length > 1">
                <button @click="removeAccount(account.id)" class="remove-account-button">
                  <TrashIcon />
                </button>
              </div>
              <div class="account-name">
                <span v-if="!account.editing">{{ account.name }}</span>
                <input v-else type="text" v-model="account.name" @keyup.enter="saveAccountName(account)"
                  class="account-name-input">
              </div>
              <div class="account-actions">
                <button @click="account.editing = !account.editing" class="edit-account-button">
                  <component :is="account.editing ? DoneIcon : PencilIcon"></component>
                </button>
              </div>
            </div>
            <div class="account-tools">
              <div v-if="account.tools.length === 0" class="no-tools">
                {{ $t('noToolsAdded') }}
              </div>
              <ul v-else class="tools-list">
                <li v-for="(tool, index) in account.tools" :key="index" class="tool-item">
                  <img :src="tool.icon" :alt="tool.name" class="tool-icon">
                  <span class="tool-name">{{ tool.name }}<!-- - {{ tool.craftPrice }}<i class="ton-icon"></i>--></span>
                  <button @click="removeUserTool(account.id, index)" class="remove-tool-button">
                    <TrashIcon />
                  </button>
                </li>
              </ul>
              <button @click="openAddToolModal(account.id)" class="btn btn-info add-tool-button">
                <AddIcon class="mr-2" />
                {{ $t('addTool') }}
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="no-accounts mb-2">
        {{ $t('noAccounts') }}
      </div>
      <button @click="addAccount" class="btn btn-secondary mt-2">{{ $t('addAccount') }}</button>
    </div>
  </div>

  <div v-if="showChartModal" class="modal chart-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('priceCharts') }}</h5>
          <button type="button" class="close" @click="closeChartModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="chartError && !chartPrices.length" class="alert alert-danger">{{ $t('chartError') }}</div>
          <div v-else>
            <div class="chart-container">
              <PriceChart :food-data="foodData" :gold-data="goldData" :wood-data="woodData"
                :fetch-more-data="fetchMoreData" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import TrashIcon from '@/components/icons/trash-icon.vue'
import PencilIcon from '@/components/icons/pencil-icon.vue'
import DoneIcon from '@/components/icons/done-icon.vue'
import AddIcon from '@/components/icons/add-icon.vue'
import PriceChart from '@/components/PriceChart.vue';
import FlagEng from '@/components/icons/flag-eng.vue'
import FlagRu from '@/components/icons/flag-ru.vue'
import SettingsIcon from '@/components/icons/settings-icon.vue'
import { type UTCTimestamp } from 'lightweight-charts';
import { formatNumber } from '@/shared/utils'
import type { Account, ResourceType, Tool } from '@/types/main';

// TODO: калькулятор цены стаков

const { locale, t: $t } = useI18n();

function changeLanguage(lang: string) {
  locale.value = lang;
  localStorage.setItem('selectedLanguage', lang);
}
const showCopiedMessage = ref(false);

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText('UQDv96pmc4Ze5tqMbC8I7I7jzZUu2kgGYL5-oe7tIs5HhNYr');
    showCopiedMessage.value = true;
    setTimeout(() => {
      showCopiedMessage.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy address:', error);
  }
};

const accounts = ref<Account[]>([]);

const tools: Tool[] = [
  { name: 'Axe (Common)', icon: 'img/axe_common_shadow.png', profit: 5, wood: 2400, gold: 400, cooldown: 1, resource: 'wood', energy: 10, durability: 5, maxDurability: 100 },
  { name: 'Axe (Uncommon)', icon: 'img/axe_uncommon_shadow.png', profit: 17, wood: 7200, gold: 1200, cooldown: 1, resource: 'wood', energy: 30, durability: 15, maxDurability: 300 },
  { name: 'Axe (Rare)', icon: 'img/axe_rare_shadow.png', profit: 54, wood: 21600, gold: 3600, cooldown: 1, resource: 'wood', energy: 60, durability: 45, maxDurability: 900 },
  { name: 'Axe (Promo)', icon: 'img/axe_promo_shadow.png', profit: 1, wood: 110, gold: 20, cooldown: 1, resource: 'wood', energy: 4, durability: 1, maxDurability: 25 },
  { name: 'Bow (Common)', icon: 'img/bow_common_shadow.png', profit: 5, wood: 1200, gold: 200, cooldown: 1, resource: 'food', energy: 0, durability: 5, maxDurability: 250 },
  { name: 'Bow (Uncommon)', icon: 'img/bow_uncommon_shadow.png', profit: 20, wood: 4800, gold: 800, cooldown: 1, resource: 'food', energy: 0, durability: 20, maxDurability: 1000 },
  { name: 'Bow (Rare)', icon: 'img/bow_rare_shadow.png', profit: 80, wood: 19200, gold: 3200, cooldown: 1, resource: 'food', energy: 0, durability: 32, maxDurability: 1600 },
  { name: 'Pickaxe (Common)', icon: 'img/pikaxe_common_shadow.png', profit: 50, wood: 24000, gold: 4000, cooldown: 1, resource: 'gold', energy: 66, durability: 3, maxDurability: 250 }
];

const prices = reactive({
  wood: 0.0072,
  food: 0.0069,
  gold: 0.0095
});

const state = ref<'server' | 'local'>('server');
const serverPrices = ref();
const serverError = ref(false);
let priceTimeout: number;
let priceTonTimeout: number;

const toolTypes = computed(() => {
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

  return types;
});

function getToolCraftCost(tool: Tool): number {
  return tool.wood * prices.wood + tool.gold * prices.gold;
}

function getToolEnergyCost(tool: Tool): number {
  return tool.energy / 5 * prices.food;
}

function getToolDurabilityCost(tool: Tool): number {
  return tool.durability / 5 * prices.gold;
}

function getToolHourlyProfit(tool: Tool): number {
  const grossProfit = tool.profit * getResourcePrice(tool.resource);
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

const getResourcePrice = (resource: string): number => {
  switch (resource) {
    case 'wood':
      return Number(prices.wood);
    case 'food':
      return Number(prices.food);
    case 'gold':
      return Number(prices.gold);
    default:
      return 0;
  }
}

function setState(stateName: 'local' | 'server') {
  state.value = stateName;
}
function fetchPrices() {
  setState('server');
  serverError.value = false;

  fetch('https://app.farm-world.space/tokens.php?access_token=FFGrIZyIsxIl17TaIxlBKHp7ZEZ55g')
    .then(response => response.json())
    .then(data => {
      prices.wood = data.WOOD;
      prices.food = data.FOOD;
      prices.gold = data.GOLD;
      serverPrices.value = data;
      priceTimeout = window.setTimeout(fetchPrices, 30 * 1000);
    })
    .catch(error => {
      console.error(error)
      serverError.value = true;
      state.value = 'local';
    });
}

function setManualPrices() {
  setState('local')
  window.clearTimeout(priceTimeout);
}

function handleScroll() {
  const navbar = document.querySelector('.navbar');
  const scrollingNavbar = document.querySelector('.scrolling-navbar');

  if (navbar && scrollingNavbar) {
    if (window.scrollY > 50) {
      scrollingNavbar.classList.add('top-nav-collapse');
    } else {
      scrollingNavbar.classList.remove('top-nav-collapse');
    }
  }
}
const showAddToolModal = ref(false);
const selectedTool = ref<Tool | null>(null);
const craftPrice = ref(0);

function openAddToolModal(account: number) {
  showAddToolModal.value = true;
  showSettingsMenu.value = false;
  selectedAccountId.value = account;
  document.body.classList.add('modal-open');
}

function closeAddToolModal() {
  showAddToolModal.value = false;
  document.body.classList.remove('modal-open');
  selectedTool.value = null;
  craftPrice.value = 0;
  showSettingsMenu.value = true;
}
function saveAccountName(account: Account) {
  account.editing = false;
  saveAccounts();
}
const selectedAccountId = ref<number | null>(null);

function addUserTool() {
  if (!selectedTool.value || !selectedAccountId.value) return;
  const account = accounts.value.find(acc => acc.id === selectedAccountId.value);
  if (!account) return;

  const newTool = {
    ...selectedTool.value,
    craftPrice: craftPrice.value
  };
  account.tools.push(newTool);
  closeAddToolModal();
  saveAccounts();
}

function addAccount() {
  const accNum = (accounts.value.length > 0) ? ` ${accounts.value.length + 1}` : ''
  const newAccount: Account = {
    id: Date.now(),
    name: `${$t('myAccount')}${accNum}`,
    tools: [],
    editing: false
  };
  accounts.value.push(newAccount);
  saveAccounts();
}

function saveAccounts() {
  localStorage.setItem('accounts', JSON.stringify(accounts.value));
}

function loadAccounts() {
  const storedAccounts = localStorage.getItem('accounts');
  if (storedAccounts) {
    accounts.value = JSON.parse(storedAccounts);
  } else {
    const storedTools = localStorage.getItem('userTools');
    accounts.value = [
      {
        id: 1,
        name: $t('myAccount'),
        tools: storedTools ? JSON.parse(storedTools) : [],
        editing: false
      }
    ];
    saveAccounts();
    localStorage.removeItem('userTools');
  }
}

function removeUserTool(accountId: number, index: number) {
  const account = accounts.value.find(acc => acc.id === accountId);
  if (account) {
    account.tools.splice(index, 1);
    saveAccounts();
  }
}

function removeAccount(accountId: number) {
  accounts.value = accounts.value.filter(acc => acc.id !== accountId);
  saveAccounts();
}

const showSettingsMenu = ref(false);

function toggleSettingsMenu() {
  showSettingsMenu.value = !showSettingsMenu.value;
}
function getAccountToolsResourceSummary(accountId: number): Record<string, number> {
  const account = accounts.value.find(acc => acc.id === accountId);
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
  const account = accounts.value.find(acc => acc.id === accountId);
  if (!account) return 0;

  return account.tools.reduce((sum, tool) => sum + getToolDailyProfit(tool), 0);
}
function getAccountToolsConsumptionSummary(accountId: number): Record<string, number> {
  const account = accounts.value.find(acc => acc.id === accountId);
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
  return accounts.value.reduce((sum, account) => sum + account.tools.reduce((acc, tool) => acc + getToolDailyProfit(tool), 0), 0);
}
function getAllToolsROI(): number {
  const totalProfit = getAllToolsProfitSummary();
  if (totalProfit === 0) return 0;
  const totalInvestment = accounts.value.reduce((sum, account) => sum + account.tools.reduce((acc, tool) => acc + tool.craftPrice, 0), 0);
  return totalInvestment / totalProfit;
}

const tonPriceUsd = ref<number | string>('...');

function saveTonPrice(price: number | string) {
  localStorage.setItem('tonPrice', price.toString());
}
function loadTonPrice(): number | string | null {
  const storedPrice = localStorage.getItem('tonPrice');
  return storedPrice ? storedPrice : null;
}
async function fetchTonPrice() {
  try {
    const response = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd');
    const data = await response.json();
    const price = data?.rates?.TON?.prices?.USD || 'err';
    tonPriceUsd.value = price;
    saveTonPrice(price);
  } catch (error) {
    console.error('Ошибка получения цены TON Coin:', error);
  }
  priceTonTimeout = setInterval(fetchTonPrice, 5 * 60 * 1000);
}
function getUserToolsROI(accountId: number): number {
  const account = accounts.value.find(acc => acc.id === accountId);
  if (!account) return 0;

  const totalProfit = getAccountToolsProfitSummary(accountId);
  if (totalProfit === 0) return 0;
  const totalInvestment = account.tools.reduce((sum, tool) => sum + tool.craftPrice, 0);
  return totalInvestment / totalProfit;
}

const showChartModal = ref(false);
const chartPrices = ref<{
  FOOD: string
  GOLD: string
  WOOD: string
  date_update: number
}[]>([]);
const chartError = ref(false);
const currentDate = ref(new Date());
const chartCache = reactive<Record<string, { data: typeof chartPrices.value; timestamp: number }>>({});


async function openChartModal() {
  showChartModal.value = true;
  document.body.classList.add('modal-open');
  await fetchChartPrices();
}
function closeChartModal() {
  showChartModal.value = false;
  currentDate.value = new Date();
  chartPrices.value = [];
  document.body.classList.remove('modal-open');
}

async function fetchChartPrices(): Promise<boolean> {
  const year = currentDate.value.getFullYear();
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.value.getDate()).padStart(2, '0');
  const cacheKey = `${year}-${month}-${day}`;

  if (chartCache[cacheKey]) {
    const cachedData = chartCache[cacheKey];
    const now = Date.now();
    const cacheAge = (now - cachedData.timestamp) / 1000; // Cache age in seconds

    if (cacheAge < 300) { // Cache is valid for 5 minutes (300 seconds)
      chartPrices.value = [...cachedData.data, ...chartPrices.value];
      chartError.value = false;
      return true;
    }
  }

  const url = `https://vasia123.github.io/farm-world-space-prices/${year}-${month}/${day}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch chart prices');
    }
    const data = await response.json();
    chartPrices.value = [...data, ...chartPrices.value];
    chartError.value = false;

    chartCache[cacheKey] = {
      data: data,
      timestamp: Date.now()
    };

    return true;
  } catch (error) {
    console.error('Error fetching chart prices:', error);
    chartError.value = true;
    return false;
  }
}

const foodData = computed(() =>
  chartPrices.value.map(price => ({
    time: (price.date_update) as UTCTimestamp,
    value: parseFloat(price.FOOD)
  }))
);

const goldData = computed(() =>
  chartPrices.value.map(price => ({
    time: (price.date_update) as UTCTimestamp,
    value: parseFloat(price.GOLD)
  }))
);

const woodData = computed(() =>
  chartPrices.value.map(price => ({
    time: (price.date_update) as UTCTimestamp,
    value: parseFloat(price.WOOD)
  }))
);
async function fetchMoreData() {
  const prevDate = new Date(currentDate.value);
  prevDate.setDate(prevDate.getDate() - 1);

  if (prevDate >= new Date(2023, 3, 19)) {
    currentDate.value = prevDate;
    return fetchChartPrices();
  }
  return false;
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
  window.addEventListener('scroll', handleScroll);
  fetchPrices();
  loadAccounts();
  const storedTonPrice = loadTonPrice();
  if (storedTonPrice && !['err', '"err"'].includes(storedTonPrice.toString())) {
    tonPriceUsd.value = storedTonPrice;
    priceTonTimeout = setInterval(fetchTonPrice, 5 * 60 * 1000);
  } else {
    fetchTonPrice();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.clearTimeout(priceTimeout);
  window.clearTimeout(priceTonTimeout);
});
</script>