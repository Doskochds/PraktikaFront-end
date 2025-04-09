<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow p-6 bg-white">
      <h1 class="text-3xl font-bold mb-4">Ласкаво просимо на головну сторінку!</h1>
      <p class="text-lg text-gray-700">
        Цей сайт дозволить вам зберігати, ділитись та переглядати статистику щодо своїх файлів
      </p>
    </main>

    <Footer class="mt-auto border-t border-gray-200 shadow-sm" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Головна сторінка'
})
</script>

<style scoped>
h1 {
  color: #42b983;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}
</style>