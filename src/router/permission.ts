import type {Router} from 'vue-router'
import {useAuthStoreWithout} from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
      const authStore = useAuthStoreWithout()
      if (authStore.isLoggedIn)
        next()
      else
        next({name: 'Login'})
    } else if (to.path === '/') {
      const authStore = useAuthStoreWithout()
      if (authStore.isLoggedIn)
        next({name: 'Dash'})
      else
        next({name: 'Login'})
      next()
    } else {
      next()
    }
  })
}
