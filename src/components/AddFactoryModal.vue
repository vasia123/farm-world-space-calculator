<template>
    <div v-if="showModal" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ $t('addFactory') }}</h5>
                    <button type="button" class="close" @click="closeModal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="factoryType">{{ $t('chooseFactoryType') }}</label>
                        <div class="icon-resource-select-wrapper">
                            <div v-for="(data, name) in factories" :key="name" class="icon-resource-select-row" :class="{
                                'icon-resource-select-row--active': selectedFactory?.name === name
                            }" @click="selectedFactory = { name, data }">
                                <img :src="`/farm-world-space-calculator/img/${name}.jpg`"
                                    class="icon-resource-select-img icon-resource-select-img--big">
                                <div class="icon-resource-select-resource">
                                    {{ $t(name) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="factoryType">{{ $t('chooseFactoryLevel') }}</label>
                        <select id="factoryType" v-model="selectedFactoryLevel" class="form-control"
                            :disabled="!selectedFactory">
                            <option v-for="level in levelsOfSelectedFactory" :key="level.level" :value="level">
                                {{ level.level }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="craftPrice">{{ $t('craftPriceFull') }}<i class="ton-icon"></i></label>
                        <input type="number" id="craftPrice" v-model.number="craftPrice" class="form-control"
                            step="0.0001">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" @click="closeModal">{{ $t('cancel') }}</button>
                    <button type="button" class="btn btn-primary" @click="addUserFactory">{{ $t('add') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useModalsStore } from '@/stores/modals';
import { useFactoriesStore } from '@/stores/factories';
import { useAccountsStore } from '@/stores/accounts';
import type { CraftedFactory, FactoryLevel, FactoryData, FactoryName } from '@/types/main';

const { t: $t } = useI18n();
const modalsStore = useModalsStore();
const factoriesStore = useFactoriesStore();
const accountsStore = useAccountsStore();

const factories = computed(() => factoriesStore.factories);
const showModal = computed(() => modalsStore.showAddFactoryModal);
const selectedAccountId = computed(() => modalsStore.selectedAccountId);

const defaultFactory = Object.entries(factories.value)[0]
const selectedFactory = ref<{ name: FactoryName, data: FactoryData }>({
    data: defaultFactory[1],
    name: defaultFactory[0] as FactoryName
});
const selectedFactoryLevel = ref<FactoryLevel | null>(null);
const craftPrice = ref(0);

const levelsOfSelectedFactory = computed(() => {
    if (selectedFactory.value) {
        return selectedFactory.value.data.levels.map(level => level)
    }
    return [];
});

function closeModal() {
    craftPrice.value = 0;
    modalsStore.closeAddFactoryModal();
}

function addUserFactory() {
    if (!selectedFactory.value || !selectedAccountId.value || !selectedFactoryLevel.value) return;
    const account = accountsStore.accounts.find(acc => acc.id === selectedAccountId.value);
    if (!account) return;
    if (!account.factories) account.factories = [];

    const newFactory: CraftedFactory = {
        name: selectedFactory.value.name,
        data: selectedFactory.value.data,
        level: selectedFactoryLevel.value,
        craftPrice: craftPrice.value
    };
    account.factories.push(newFactory);
    accountsStore.saveAccounts();
    closeModal();
}
</script>