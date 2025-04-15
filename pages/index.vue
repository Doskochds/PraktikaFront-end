<template>
  <div class="min-h-screen flex flex-col">
    <Header
        class="shadow-sm"
        @openLoginModal="showLoginModal = true"
        @openRegisterModal="showRegisterModal = true"
    />

    <main class="flex-grow p-6 bg-white">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl font-bold mb-4 text-center">
          {{ welcomeMessage }}
        </h1>
        <p class="text-lg text-gray-700 text-center mb-6">
          Цей сайт дозволить вам зберігати, ділитись та переглядати статистику щодо своїх файлів
        </p>

        <!-- Якщо користувач залогінений — показуємо менеджер -->
        <FileManager v-if="authStore.user" />

        <!-- Інакше — заклик до авторизації -->
        <div v-else class="text-center mt-10">
          <p class="text-gray-600 mb-4">Щоб користуватись файловим менеджером, увійдіть або зареєструйтесь</p>
          <button @click="showLoginModal = true" class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Увійти
          </button>
        </div>
      </div>
    </main>

    <Footer class="mt-auto border-t border-gray-200 shadow-sm" />

    <LoginModal v-if="showLoginModal" @close="closeModals" />
    <RegistrModal v-if="showRegisterModal" @close="closeModals" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import FileManager from '~/components/file-manager.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import LoginModal from '~/components/LoginModal.vue'
import RegistrModal from '~/components/RegistrModal.vue'

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
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

main {
  padding-top: 2rem;
  padding-bottom: 4rem;
}
</style>
