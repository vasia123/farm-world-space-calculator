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
      <ul class="nav navbar-nav nav-flex-icons ml-auto"></ul>
    </nav>

    <h1 class="pt-5">Калькулятор окупаемости инструментов <a href="https://t.me/Farm_world_bot" target="_blank">Farm
        World</a></h1>

    <div v-if="state === 'server'">
      <div v-if="serverError" class="red">{{ serverError }}</div>
      <button @click="setManualPrices">Ввести цены вручную</button>
    </div>
    <div v-if="state === 'local'">
      <button @click="fetchPrices">Обновить цены с сервера</button>
      <div>
        <label for="woodPrice">Цена за единицу дерева:</label>
        <input type="number" id="woodPrice" v-model.number="prices.wood" step="0.0001"><br>
        <label for="foodPrice">Цена за единицу еды:</label>
        <input type="number" id="foodPrice" v-model.number="prices.food" step="0.0001"><br>
        <label for="goldPrice">Цена за единицу золота:</label>
        <input type="number" id="goldPrice" v-model.number="prices.gold" step="0.0001"><br>
      </div>
    </div>

    <div class="resources-container">
      <!-- <div v-for="(toolsOfType, resource) in toolTypes" :key="resource" class="tool-type">
        <h2>{{ resource }}</h2>
        <div v-for="tool in toolsOfType" :key="tool.name" class="tool-box">
          <img class="tool-icon" :src="tool.icon" :alt="tool.name">
          <div class="tool-info">
            <div class="tool-name">{{ tool.name }}</div>
            <div class="tool-resource">
              <img class="resource-icon" :src="`img/${tool.resource.toLowerCase()}_shadow.png`" :alt="tool.resource">
              Добывает: {{ tool.resource }}
            </div>
            <p><span>Стоимость крафта: <b>{{ getToolCraftCost(tool).toFixed(2) }}</b><i class="ton-icon"></i></span></p>
            <p v-if="tool.energy > 0">Потребление энергии(5 = 1 еда): {{ tool.energy }} (<b>{{
          getToolEnergyCost(tool).toFixed(precision) }}</b><i class="ton-icon"></i>)</p>
            <p>Потеря прочности(5 = 1 золото): {{ tool.durability }} (<b>{{
          getToolDurabilityCost(tool).toFixed(precision) }}</b><i class="ton-icon"></i>)</p>
            <p><span>Прибыль в час: <b>{{ getToolHourlyProfit(tool).toFixed(precision) }}</b><i
                  class="ton-icon"></i></span></p>
            <p><span>Прибыль в сутки: <b>{{ getToolDailyProfit(tool).toFixed(precision) }}</b><i
                  class="ton-icon"></i></span></p>
            <p>Срок окупаемости: <b>{{ getToolROI(tool).hours.toFixed(1) }}</b> часов (<b>{{
          getToolROI(tool).days.toFixed(1) }}</b> дней)</p>
          </div>
        </div>
      </div> -->


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
                      {{ getResourcePrice(resource)?.toFixed(precision) }} <i class="ton-icon"></i>
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
                      <span class="badge sm">Daily:</span>
                      <span class="badge sm gradbg-lime2">
                        {{ getToolDailyProfit(tool).toFixed(2) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                    <div class="d-block">
                      <span class="ml-3 badge sm">ROI:</span>
                      <span class="badge sm">{{ getToolROI(tool).days.toFixed(1) }} дней</span>
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
                      <span class="badge sm">Craft Cost:</span>
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

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

function getToolROI(tool: Tool): { hours: number; days: number } {
  const craftCost = getToolCraftCost(tool);
  const hourlyProfit = getToolHourlyProfit(tool);
  const roiHours = craftCost / hourlyProfit;
  const roiDays = roiHours / 24;
  return { hours: roiHours, days: roiDays };
}

function getResourcePrice(resource: string): number {
  switch (resource) {
    case 'wood':
      return prices.wood;
    case 'food':
      return prices.food;
    case 'gold':
      return prices.gold;
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

  fetch('https://app.farm-world.space/tokens.php')
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
    if (window.pageYOffset > 50) {
      scrollingNavbar.classList.add('top-nav-collapse');
    } else {
      scrollingNavbar.classList.remove('top-nav-collapse');
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  fetchPrices();
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

.resources-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
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
</style>