import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as { email: string, name: string } | null,
    }),
    actions: {
        setUser(userData: any) {
            this.user = userData
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(userData)) // Зберігаємо користувача в localStorage
            }
        },
        clearUser() {
            this.user = null
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user') // Очищаємо localStorage
            }
        },
        loadUser() {
            if (typeof window !== 'undefined') {
                const userData = localStorage.getItem('user')
                if (userData) {
                    this.user = JSON.parse(userData)
                }
            }
        }
    }
})
