import { createApp } from 'vue'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import {setupStore} from './store'
import {setupRouter} from './router'

import '@/assets/css/style.css'


const app = createApp(App)

for (const [key, componentIcon] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, componentIcon)
}
app.use(ElementPlus)

setupStore(app)
await setupRouter(app)
app.mount('#app')
