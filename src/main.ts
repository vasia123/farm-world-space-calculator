import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initYandexMetrika } from 'yandex-metrika-vue3';

import App from './App.vue'
import router from './router'
import type { Router } from 'vue-router';

const app = createApp(App)

app.use(createPinia())
app.use(router)

interface MetrikaConfig {
    id: string;
    router: Router;
    scriptSrc: "https://mc.yandex.ru/metrika/tag.js" | "https://mc.yandex.ru/metrika/watch.js";
    env: string;
}
const metrikaConfig: MetrikaConfig = {
    id: '97014735',
    router: router,
    env: 'production',
    scriptSrc: "https://mc.yandex.ru/metrika/tag.js"
};

app.use(initYandexMetrika, metrikaConfig)

app.mount('#app')
