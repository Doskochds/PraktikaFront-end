<template>
  <div class="min-h-screen flex flex-col">
    <Header
        class="shadow-sm"
        @openLoginModal="showLoginModal = true"
        @openRegisterModal="showRegisterModal = true"
    />

    <main class="flex-grow p-6 bg-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-4 text-center">
          {{ welcomeMessage }}
        </h1>
        <p class="text-lg text-gray-700 text-center">
          Цей сайт дозволить вам зберігати, ділитись та переглядати статистику щодо своїх файлів
        </p>
      </div>
    </main>

    <Footer class="mt-auto border-t border-gray-200 shadow-sm" />

    <LoginModal v-if="showLoginModal" @close="closeModals" />
    <RegistrModal v-if="showRegisterModal" @close="closeModals" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const welcomeMessage = computed(() => {
  return authStore.user
      ? `Ласкаво просимо, ${authStore.user.name}!`
      : 'Ласкаво просимо на головну сторінку!'
})

const closeModals = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:80/api/user', {
      credentials: 'include'
    })
    if (response.ok) {
      const userData = await response.json()
      authStore.setUser(userData)
    }
  } catch (error) {
    console.error('Помилка при перевірці авторизації:', error)
  }
})
</script>

<style scoped>
h1 {
  color: #42b983;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  margin-top: 1rem;
}

main {
  padding-top: 2rem;
  padding-bottom: 4rem;
}
</style>

<style scoped>
h1 {
  color: #42b983;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  margin-top: 1rem;
}

main {
  padding-top: 2rem;
  padding-bottom: 4rem;
}
</style>