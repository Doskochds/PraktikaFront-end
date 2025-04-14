import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as { email: string, name: string } | null,
    }),
    actions: {
        setUser(userData: any) {
            this.user = userData
        },
        clearUser() {
            this.user = null
        }
    }
})