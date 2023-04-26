import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'

export interface AuthState {
  isLoggedIn: boolean
  token: string | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    isLoggedIn: getToken() != null,
    token: getToken(),
  }),

  getters: {

  },

  actions: {
    loginSuccess(token: string) {
      this.token = token
      this.isLoggedIn = true
      setToken(token)
    },

    logout() {
      this.token = undefined
      removeToken()
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
