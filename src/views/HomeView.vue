<template>
  <div class="grey darken-3 px-3 py-1">
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar py-1">
      <div class="alert alert-light p-1 m-0 mr-1 fw_topBox token_TON" style="">
        <img class="mr-1" src="/img/ton_g.png">
        <strong>{{ formatNumber(tonPriceUsd) }}$</strong>
      </div>
      <div class="alert alert-light p-1 m-0 mr-1 fw_topBox token_FWW" style="">
        <img class="mr-1" src="/img/wood_shadow.png">
        <strong>{{ formatNumber(prices.wood) }}</strong>
      </div>
      <div class="alert alert-light p-1 m-0 mr-1 fw_topBox token_FWF" style="">
        <img class="mr-1" src="/img/food_shadow.png">
        <strong>{{ formatNumber(prices.food) }}</strong>
      </div>
      <div class="alert alert-light p-1 m-0 fw_topBox token_FWG" style="">
        <img class="mr-1" src="/img/gold_shadow.png">
        <strong>{{ formatNumber(prices.gold) }}</strong>
      </div>
      <ul class="nav navbar-nav nav-flex-icons ml-auto">
        <li class="nav-item">
          <button class="nav-link btn btn-link" :class="{ 'active': locale === 'en' }" @click="changeLanguage('en')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="flag-icon">
              <clipPath id="t">
                <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
              </clipPath>
              <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
              <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4" />
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
              <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" stroke-width="6" />
            </svg>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link btn btn-link" :class="{ 'active': locale === 'ru' }" @click="changeLanguage('ru')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="flag-icon">
              <rect fill="#fff" width="9" height="3" />
              <rect fill="#d52b1e" y="3" width="9" height="3" />
              <rect fill="#0039a6" y="2" width="9" height="2" />
            </svg>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link btn btn-link" @click="toggleSettingsMenu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
            </svg>
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

    <div v-if="state === 'server'">
      <div v-if="serverError" class="red">{{ serverError }}</div>
    </div>

    <div v-if="userTools.length > 0">
      <div class="tool-box-container">
        <div v-for="(tool, index) in userTools" :key="index" class="tool-box">
          <img :src="tool.icon" :alt="tool.name" class="mr-2" width="20px" height="20px">
          <div class="tool-info">
            <span class="mr-2">
              {{ $t('dailyProfit') }}:
            </span>
            <span class="mr-2">
              {{ formatNumber(tool.profit * 24) }}
              <img :src="'/farm-world-space-calculator/img/' + String(tool.resource).toLowerCase() + '_shadow.png'"
                width="20px" height="20px" class="mb-1" />
            </span>
            <span>
              {{ formatNumber(getToolDailyProfit(tool)) }} <i class="ton-icon"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="mt-2">
        <p>
          <span class="mr-3">
            {{ $t('dailyProfitFull') }}:
          </span>
          <span v-for="(amount, resource) in getUserToolsResourceSummary()" :key="resource" class="mr-4">
            {{ formatNumber(amount) }}
            <img :src="'/farm-world-space-calculator/img/' + resource + '_shadow.png'" width="20px" height="20px"
              class="mb-1" />
          </span>
          <span class="mr-3">
            {{ formatNumber(getUserToolsProfitSummary()) }} <i class="ton-icon"></i>
          </span>
        </p>
      </div>
    </div>

    <div class="resources-container">
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4 px-2 text-center" v-for="(toolsOfType, resource) in toolTypes"
        :key="resource">
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
                    <!-- <span class="sss-font c-white">{{ tool.name }}</span> -->
                  </div>
                  <div class="d-inline-block w-75 flex-right vtop">
                    <div class="d-block">
                      <span class="badge sm no-shadow">{{ $t('dailyProfit') }}:</span>
                      <span class="badge sm gradbg-lime2 ml-1">
                        {{ formatNumber(getToolDailyProfit(tool)) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                    <div class="d-block mt-2">
                      <span class="ml-3 badge sm no-shadow">ROI:</span>
                      <span class="badge grey darken-2 sm ml-1">
                        {{ getToolROI(tool, getToolCraftCost(tool)).days.toFixed(1) }}
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
        UQDJrAnNVrdvw6Ba3R9g5Xdd40L2SjFZyKZUW2u3HikHxmSD<i class="ton-icon"></i>
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
      <button v-if="state === 'server'" @click="setManualPrices" class="btn btn-light">{{ $t('manualPrices')
        }}</button>
      <button v-if="state === 'local'" @click="fetchPrices" class="btn btn-primary">{{ $t('fetchPrices') }}</button>
      <h5 class="my-4">{{ $t('addedTools') }}</h5>
      <div v-if="userTools.length > 0">
        <ul class="user-tools-list">
          <li v-for="(tool, index) in userTools" :key="index">
            <img :src="tool.icon" :alt="tool.name" class="small" width="20px" height="20px">
            {{ tool.name }}
            <button @click="removeUserTool(index)" class="remove-tool-button">
              <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision"
                text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"
                clip-rule="evenodd" viewBox="0 0 456 511.82" width="15" height="15">
                <path fill="#FD3B3B"
                  d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
      <div v-else class="no-tools mb-2">
        {{ $t('noAddedTools') }}
      </div>
      <button @click="openAddToolModal" class="btn btn-secondary mt-2">{{ $t('addTool') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t: $t } = useI18n();

function changeLanguage(lang: string) {
  locale.value = lang;
  localStorage.setItem('selectedLanguage', lang);
}
const showCopiedMessage = ref(false);

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText('UQDJrAnNVrdvw6Ba3R9g5Xdd40L2SjFZyKZUW2u3HikHxmSD');
    showCopiedMessage.value = true;
    setTimeout(() => {
      showCopiedMessage.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy address:', error);
  }
};

type ResourceType = 'wood' | 'food' | 'gold'

interface Tool {
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
interface CraftedTool extends Tool {
  craftPrice: number;
}

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
  wood: 0.006,
  food: 0.005,
  gold: 0.007
});

const state = ref<'server' | 'local'>('server');
const serverPrices = ref();
const serverError = ref('');
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
  serverError.value = '';

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
      serverError.value = 'Ошибка получения цен: ' + error;
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
const userTools = ref<CraftedTool[]>([]);

function openAddToolModal() {
  showAddToolModal.value = true;
  showSettingsMenu.value = false;
  document.body.classList.add('modal-open');
}

function closeAddToolModal() {
  showAddToolModal.value = false;
  document.body.classList.remove('modal-open');
  selectedTool.value = null;
  craftPrice.value = 0;
}

function addUserTool() {
  if (!selectedTool.value) return;
  const newTool = {
    ...selectedTool.value,
    craftPrice: craftPrice.value
  };
  userTools.value.push(newTool);
  closeAddToolModal();
  saveUserTools();
}

function saveUserTools() {
  localStorage.setItem('userTools', JSON.stringify(userTools.value));
}
function loadUserTools() {
  const storedTools = localStorage.getItem('userTools');
  if (storedTools) {
    userTools.value = JSON.parse(storedTools);
  }
}
function removeUserTool(index: number) {
  userTools.value.splice(index, 1);
  saveUserTools();
}

const showSettingsMenu = ref(false);

function toggleSettingsMenu() {
  showSettingsMenu.value = !showSettingsMenu.value;
}
function getUserToolsResourceSummary(): Record<string, number> {
  const resourceSummary: Record<string, number> = {};
  userTools.value.forEach(tool => {
    const resource = tool.resource
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

function getUserToolsProfitSummary() {
  return userTools.value.reduce((sum, tool) => sum + getToolDailyProfit(tool), 0);
}

function formatNumber(num: number | string): string {
  const number = Number(num)
  if (Number.isInteger(number)) {
    return num.toString();
  }
  const numString = num.toString();
  const decimalPos = numString.indexOf('.');
  if (decimalPos === -1) {
    return numString;
  }
  let firstSignificantDigitPos = decimalPos + 1;
  while (numString[firstSignificantDigitPos] === '0') {
    firstSignificantDigitPos++;
  }
  if (firstSignificantDigitPos > decimalPos + 1 + 8) {
    return numString.substring(0, decimalPos);
  }
  const decimalPlaces = firstSignificantDigitPos - decimalPos - 1 + 2;
  return number.toFixed(decimalPlaces);
}
const tonPriceUsd = ref<number | string>(0);

function saveTonPrice(price: number | string) {
  localStorage.setItem('tonPrice', JSON.stringify(price));
}
function loadTonPrice(): number | string | null {
  const storedPrice = localStorage.getItem('tonPrice');
  if (storedPrice) {
    return JSON.parse(storedPrice);
  }
  return null;
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
    tonPriceUsd.value = 'err';
  }
  priceTonTimeout = setInterval(fetchTonPrice, 5 * 60 * 1000);
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  fetchPrices();
  loadUserTools();
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
  const storedTonPrice = loadTonPrice();
  if (storedTonPrice) {
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