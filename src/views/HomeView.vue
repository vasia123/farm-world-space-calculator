<template>
  <div class="grey darken-3 px-3 py-1">
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar py-1">
      <!-- <div class="alert alert-light p-1 m-0 fw_topBox" style=""><strong id="waxp_usdt">1ï¿¦ = 0.336$</strong></div> -->
      <div class="alert alert-light p-1 m-0 mr-1 fw_topBox token_FWF" style="">
        <img class="mr-1" src="/img/wood_shadow.png" style="height: 18px;">
        <strong>{{ Number(prices.wood).toFixed(precision) }}</strong>
      </div>
      <div class="alert alert-light p-1 m-0 mr-1 fw_topBox token_FWW" style="">
        <img class="mr-1" src="/img/food_shadow.png" style="height: 18px;">
        <strong>{{ Number(prices.food).toFixed(precision) }}</strong>
      </div>
      <div class="alert alert-light p-1 m-0 fw_topBox token_FWG" style="">
        <img class="mr-1" src="/img/gold_shadow.png" style="height: 18px;">
        <strong>{{ Number(prices.gold).toFixed(precision) }}</strong>
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
      </ul>
    </nav>

    <h1 class="pt-5">
      {{ $t('title') }}
      <a href="https://t.me/Farm_world_bot/app?startapp=ref_8485" target="_blank">
        Farm World
      </a>
    </h1>

    <div v-if="state === 'server'">
      <div v-if="serverError" class="red">{{ serverError }}</div>
    </div>
    <div v-if="state === 'local'">
      <button @click="fetchPrices">{{ $t('fetchPrices') }}</button>
      <div>
        <label for="woodPrice">{{ $t('woodPrice') }}:</label>
        <input type="number" id="woodPrice" v-model.number="prices.wood" step="0.0001"><br>
        <label for="foodPrice">{{ $t('foodPrice') }}:</label>
        <input type="number" id="foodPrice" v-model.number="prices.food" step="0.0001"><br>
        <label for="goldPrice">{{ $t('goldPrice') }}:</label>
        <input type="number" id="goldPrice" v-model.number="prices.gold" step="0.0001"><br>
      </div>
    </div>
    <button v-if="state === 'server'" @click="setManualPrices" class="btn btn-primary">{{ $t('manualPrices') }}</button>
    <button @click="openAddToolModal" class="btn btn-secondary">{{ $t('addTool') }}</button>
    <div v-if="userTools.length > 0">
      <h2>{{ $t('addedTools') }}</h2>
      <div class="tool-box-container">
        <div v-for="(tool, index) in userTools" :key="index">
          <div class="tool-box">
            <img :src="tool.icon" :alt="tool.name" class="tool-icon">
            <div class="tool-info">
              <div class="tool-name">{{ tool.name }}</div>
              <div>{{ $t('craftPriceShort') }}: {{ tool.craftPrice.toFixed(2) }} <i class="ton-icon"></i></div>
              <div>{{ $t('dailyProfit') }}: {{ getToolDailyProfit(tool).toFixed(2) }} <i class="ton-icon"></i></div>
              <div>ROI: {{ getToolROI(tool, tool.craftPrice).days.toFixed(1) }} {{ $t('days') }}</div>
              <button class="btn btn-danger btn-sm" @click="removeUserTool(index)">{{ $t('remove') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="resources-container">
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4 px-2 text-center" v-for="(toolsOfType, resource) in toolTypes"
        :key="resource">
        <div class="card card-cascade wider">
          <div class="view view-cascade grey darken-3">
            <div class="m-1">
              <div class="text-center">
                <div class="chip gradbg-dark-grey shd mb-0 waves-effect" style="height: 50px; line-height: 16px;">
                  <div class="mt-2">
                    <img :src="'/farm-world-space-calculator/img/' + String(resource).toLowerCase() + '_shadow.png'">
                    <span class="badge darken-3 md">
                      {{ getResourcePrice(resource).toFixed(precision) }} <i class="ton-icon"></i>
                      <!-- <span class="badge ssm red lighten-2">-11.3%</span> -->
                    </span>
                  </div>
                </div>
              </div>
              <div class="d-block mt-4" v-for="tool in toolsOfType" :key="tool.name">
                <div class="d-inline-block w-50 b-atomic">
                  <div class="d-inline-block w-25 flex-right" style="line-height: 10px;">
                    <a target="_blank">
                      <img :src="tool.icon" :alt="tool.name" class="img-fluid">
                    </a>
                  </div>
                  <div class="d-inline-block w-75 flex-right vtop">
                    <div class="d-block">
                      <span class="badge sm">{{ $t('dailyProfit') }}:</span>
                      <span class="badge sm gradbg-lime2">
                        {{ getToolDailyProfit(tool).toFixed(2) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                    <div class="d-block">
                      <span class="ml-3 badge sm">ROI:</span>
                      <span class="badge sm">{{ getToolROI(tool, getToolCraftCost(tool)).days.toFixed(1) }} {{
          $t('days') }}</span>
                    </div>
                  </div>
                </div>
                <div class="d-inline-block w-50 b-alcor">

                  <div class="d-block fw_craft" v-if="tool.wood > 0">
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm">{{ tool.wood }}</span>
                      <img src="/img/wood_shadow.png" style="height: 16px;">
                    </div>
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm">
                        {{ Number(tool.wood * prices.wood).toFixed(2) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                  </div>

                  <div class="d-block fw_craft" v-if="tool.gold > 0">
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm">{{ tool.gold }}</span>
                      <img src="/img/gold_shadow.png" style="height: 16px;">
                    </div>
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge ssm">
                        {{ Number(tool.gold * prices.gold).toFixed(precision) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                  </div>

                  <div class="d-block fw_craft">
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge sm">{{ $t('craftCost') }}:</span>
                    </div>
                    <div class="d-inline-block w-50 text-right">
                      <span class="badge grey darken-2 sm">
                        {{ getToolCraftCost(tool).toFixed(2) }}<i class="ton-icon"></i>
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

const precision = 4;

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

function getToolDailyProfit(tool: Tool): number {
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  fetchPrices();
  loadUserTools();
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.clearTimeout(priceTimeout);
});
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

input {
  margin-bottom: 10px;
}

.tool-box-container {
  display: flex;
  flex-wrap: wrap;
}

.resources-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.badge.ssm {
  font-size: 12px;
}

.badge.sm {
  font-size: 14px;
}

.tool-type {
  max-width: 450px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.tool-type h2 {
  margin-top: 0;
}

.tool-box {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  display: flex;
}

.tool-icon {
  width: 64px;
  height: 64px;
  margin-right: 10px;
}

.tool-info {
  flex-grow: 1;
}

.tool-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.tool-resource {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.resource-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.ton-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url('/img/ton_g.png');
  background-size: cover;
  vertical-align: middle;
  margin: 0px 5px 5px 5px;
}

p {
  margin: 0;
}

.red,
#server-error {
  color: red;
}

.navbar {
  background-color: #000000a1;
  -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12)
}

.navbar:not(.top-nav-collapse) {
  background: 0 0
}

table.table.mwm th,
table.table.mwm td {
  padding: 2px;
}

.mwm .wam_id {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 90px;
  white-space: nowrap;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-dialog {
  max-width: 500px;
  width: 100%;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #fff;
  border-radius: 0.3rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  margin-bottom: 0;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.nav-link.active {
  background-color: #e0e0e0;
}

.flag-icon {
  width: 30px;
  height: 20px;
}

.footer {
  background-color: #212121;
  padding: 20px 0;
  color: #fff;
  width: 100%;
  position: relative;
}

.ton-address {
  cursor: pointer;
  text-decoration: underline;
}

.copied-message {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  animation: fade-in-out 2s ease-in-out;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>