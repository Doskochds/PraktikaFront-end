<template>
  <header class="flex justify-between items-center p-4 bg-gray-200 shadow">
    <div class="text-xl font-bold"> Файл шерінг практика</div>


    <div>
      <div v-if="!user" class="flex items-center gap-4">
        <button @click="showLogin = true" class="text-blue-600 hover:underline">Увійти</button>
        <button @click="showRegister = true" class="text-blue-600 hover:underline">Реєстрація</button>
      </div>
      <UserMenu v-else :user="user" :onLogout="logout" />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import UserMenu from './UserMenu.vue'

const user = ref(null)
const showLogin = ref(false)
const showRegister = ref(false)

function logout() {
  user.value = null
}
</script>
