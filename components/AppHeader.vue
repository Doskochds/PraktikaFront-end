<template>
  <header class="bg-gray-200 text-gray-800 shadow-md">
    <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
      <!-- Логотип або назва сайту -->
      <div class="text-xl font-bold">🌐 Файл шерінг практика</div>

      <!-- Навігація -->
      <nav class="flex items-center gap-4">
        <NuxtLink
            to="/login"
            class="hover:text-blue-500 transition-colors duration-200"
        >
          Увійти
        </NuxtLink>
        <span class="text-gray-400">|</span>
        <NuxtLink
            to="/register"
            class="hover:text-blue-500 transition-colors duration-200"
        >
          Реєстрація
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Тут можна додати логіку, якщо потрібно
</script>

<style scoped>
/* Додаткові стилі, якщо потрібно */
</style>