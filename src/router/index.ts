import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import Login from '@/views/login/Login.vue'
import Parent from '@/views/Parent.vue'
import Dashboard from '@/views/dash/Dashboard.vue'
import UserManager from "@/views/dash/UserManager.vue"

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
        meta: { requiresAuth: true },
      },{
        path: "user",
        name: "UserManager",
        component: UserManager,
        meta: { requiresAuth: true },
      },


    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
