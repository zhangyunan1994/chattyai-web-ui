import type {App} from 'vue'
import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHashHistory} from 'vue-router'
import {setupPageGuard} from './permission'
import Login from '@/views/login/Login.vue'
import Parent from '@/views/Parent.vue'
import Dashboard from '@/views/dash/Dashboard.vue'
import UserManager from "@/views/dash/UserManager.vue"
import SensitiveWords from "@/views/dash/SensitiveWords.vue"
import SensitiveWordsHitRecord from "@/views/dash/SensitiveWordsHitRecord.vue"
import ChatGPTMessageRecord from "@/views/dash/ChatGPTMessageRecord.vue"
import OpenAIKeyManager from "@/views/dash/OpenAIKeyManager.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }, {
    path: '/app',
    name: 'app',
    component: Parent,
    children: [
      {
        path: "dash",
        name: "Dash",
        component: Dashboard,
        meta: {requiresAuth: true},
      }, {
        path: "user",
        name: "UserManager",
        component: UserManager,
        meta: {requiresAuth: true},
      }, {
        path: "SensitiveWords",
        name: "SensitiveWords",
        component: SensitiveWords,
        meta: {requiresAuth: true},
      }, {
        path: "SensitiveWordsHitRecord",
        name: "SensitiveWordsHitRecord",
        component: SensitiveWordsHitRecord,
        meta: {requiresAuth: true},
      }, {
        path: "ChatGPTMessageRecord",
        name: "ChatGPTMessageRecord",
        component: ChatGPTMessageRecord,
        meta: {requiresAuth: true},
      }, {
        path: "OpenAIKeyManager",
        name: "OpenAIKeyManager",
        component: OpenAIKeyManager,
        meta: {requiresAuth: true},
      },
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({left: 0, top: 0}),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
