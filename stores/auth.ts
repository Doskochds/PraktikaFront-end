import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as { email: string, name: string } | null,
        token: null as string | null,
    }),
    actions: {
        setUser(userData: any, token: string) {
            this.user = userData
            this.token = token
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('token', token)
            }
        },
        clearUser() {
            this.user = null
            this.token = null
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
        },
        loadUser() {
            if (typeof window !== 'undefined') {
                const userData = localStorage.getItem('user')
                const token = localStorage.getItem('token')
                if (userData) {
                    this.user = JSON.parse(userData)
                }
                this.token = token
            }
        }
    }
})
