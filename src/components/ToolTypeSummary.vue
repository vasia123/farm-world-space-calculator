<template>
  <div class="tool-type-summary">
    <div class="resources-container">
      <div v-for="(toolsOfType, resource) in toolTypes" :key="resource"
        class="col-lg-4 col-md-6 col-sm-12 mb-4 text-center resource-item">
        <div class="card card-cascade wider">
          <div class="view view-cascade grey darken-3">
            <div class="m-1">
              <div class="text-center">
                <div class="chip gradbg-dark-grey shd mb-0 waves-effect resources-big">
                  <div class="mt-2 ml-2">
                    <img :src="'/farm-world-space-calculator/img/' + String(resource).toLowerCase() + '.png'">
                    <span class="badge darken-3 md no-shadow">
                      {{ formatNumber(pricesStore.getResourcePrice(resource)) }} <i class="ton-icon"></i>
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
                      <span class="badge sm ml-1" :class="{
                        'gradbg-lime2': toolsStore.getToolDailyProfit(tool) > 0,
                        'gradbg-red': toolsStore.getToolDailyProfit(tool) < 0,
                      }">
                        {{ formatNumber(toolsStore.getToolDailyProfit(tool)) }}<i class="ton-icon"></i>
                      </span>
                    </div>
                    <div class="d-block mt-2">
                      <span class="ml-3 badge sm no-shadow">{{ $t('roi') }}:</span>
                      <span class="badge grey darken-2 sm ml-1">
                        {{ toolsStore.getToolDailyProfit(tool) > 0
                          ? toolsStore.getToolROI(tool, toolsStore.getToolCraftCost(tool)).days.toFixed(1)
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
                      <img src="/img/wood.png" style="height: 16px;">
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
                      <img src="/img/gold.png" style="height: 16px;">
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
                        {{ formatNumber(toolsStore.getToolCraftCost(tool)) }}<i class="ton-icon"></i>
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

  <div class="resources-container">
    <div v-for="(factory, factoryName) in factoriesStore.factories" :key="factoryName"
      class="col-lg-4 col-md-6 col-sm-12 mb-4 text-center resource-item">
      <div class="card card-cascade wider">
        <div class="view view-cascade grey darken-3">
          <div class="m-1">
            <div class="text-center">
              <div class="chip gradbg-dark-grey shd mb-0 waves-effect resources-big">
                <div class="mt-2 ml-2">
                  <img :src="'/farm-world-space-calculator/img/' + factory.resource + '.png'">
                  <span class="badge darken-3 md no-shadow">
                    {{ formatNumber(pricesStore.getResourcePrice(factory.resource)) }} <i class="ton-icon"></i>
                  </span>
                </div>
              </div>
            </div>
            <div class="d-block mt-4">
              <div class="d-inline-block w-100 b-atomic">
                <div class="d-inline-block w-20 flex-right">
                  <img :src="'/farm-world-space-calculator/img/' + factoryName + '.jpg'" class="img-fluid ml-2">
                  <div>
                    <span class="badge ssm no-shadow">
                      {{$t(factoryName)}}
                    </span>
                  </div>
                </div>

                <div class="d-inline-block w-80 b-alcor">
                  <div class="d-block fw_craft">
                    <div class="d-inline-block w-60 text-right">
                      &nbsp;
                    </div>
                    <div class="d-inline-block w-40 text-right">
                      <span class="badge ssm no-shadow">
                        {{ factory.build_slot_cost }} 
                        <img :src="'/farm-world-space-calculator/img/stone.png'" style="height: 16px;">
                      </span>
                    </div>
                  </div>
                  <div class="d-block fw_craft">
                    <div class="d-inline-block w-60 text-right">
                      <span class="badge sm no-shadow">{{ $t('buildSlotCost') }}:</span>
                    </div>
                    <div class="d-inline-block w-40 text-right">
                      <span class="badge grey darken-2 sm">
                        {{ formatNumber(factory.build_slot_cost * pricesStore.getResourcePrice('stone')) }}<i
                          class="ton-icon"></i>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class="d-block mt-4" v-for="factoryLevel in factory.levels" :key="factoryLevel.level">
              <div class="d-inline-block w-50 b-atomic pt-4">
                
                <div class="d-inline-block w-30 no-wrap flex-right pt-4">
                  <span class="badge sm no-shadow">
                    {{ $t('level') }}<br>{{ factoryLevel.level }} 
                  </span>
                </div>
                <div class="d-inline-block w-70 flex-right vtop">
                  <div class="d-block">
                    <span class="badge sm no-shadow">{{ $t('dailyProfit') }}:</span>
                    <span class="badge sm ml-1" :class="{
                      'gradbg-lime2': factoriesStore.getFactoryDailyProfit(factoryName, factoryLevel.level) > 0,
                      'gradbg-red': factoriesStore.getFactoryDailyProfit(factoryName, factoryLevel.level) < 0,
                    }">
                      {{ formatNumber(factoriesStore.getFactoryDailyProfit(factoryName, factoryLevel.level)) }}<i
                        class="ton-icon"></i>
                    </span>
                  </div>
                  <div class="d-block mt-2">
                    <span class="ml-3 badge sm no-shadow">{{ $t('roi') }}:</span>
                    <span class="badge grey darken-2 sm ml-1">
                      {{ factoriesStore.getFactoryDailyProfit(factoryName, factoryLevel.level) > 0
                        ? factoriesStore.getFactoryROI(factoryName, factoryLevel.level).days.toFixed(1)
                        : '🤷‍♂️'
                      }}
                    </span>
                    {{ $t('days') }}
                  </div>
                </div>
              </div>
              <div class="d-inline-block w-50 b-alcor">
                <!-- Display resource requirements for upgrading the factory level -->
                <div class="d-block fw_craft" v-for="(resourceAmount, resource) in factoryLevel.up_level_price"
                  :key="resource">
                  <div class="d-inline-block w-50 text-right">
                    <span class="badge ssm no-shadow">{{ resourceAmount }}</span>
                    <img :src="'/farm-world-space-calculator/img/' + resource + '.png'" style="height: 16px;">
                  </div>
                  <div class="d-inline-block w-50 text-right">
                    <span class="badge ssm no-shadow">
                      {{ formatNumber((resourceAmount || 0) * pricesStore.getResourcePrice(resource)) }}<i class="ton-icon"></i>
                    </span>
                  </div>
                </div>
                <div class="d-block fw_craft">
                  <div class="d-inline-block w-50 text-right">
                    <span class="badge sm no-shadow">{{ $t('upgradeCost') }}:</span>
                  </div>
                  <div class="d-inline-block w-50 text-right">
                    <span class="badge grey darken-2 sm">
                      {{ formatNumber(factoriesStore.getFactoryUpgradeCost(factoryName, factoryLevel.level)) }}<i
                        class="ton-icon"></i>
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
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToolsStore } from '@/stores/tools';
import { usePricesStore } from '@/stores/prices';
import { formatNumber } from '@/shared/utils';
import { useFactoriesStore } from '@/stores/factories';

const { t: $t } = useI18n();
const toolsStore = useToolsStore();
const pricesStore = usePricesStore();
const factoriesStore = useFactoriesStore();

const toolTypes = computed(() => toolsStore.toolTypes);
const prices = computed(() => pricesStore.prices);
</script>