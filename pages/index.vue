<template>
  <div class="min-h-screen flex flex-col">
    <Header class="shadow-sm" />

    <main class="flex-grow p-6 bg-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-4 text-center">Ласкаво просимо на головну сторінку!</h1>
        <p class="text-lg text-gray-700 text-center">
          Цей сайт дозволить вам зберігати, ділитись та переглядати статистику щодо своїх файлів
        </p>
      </div>
    </main>

    <Footer class="mt-auto border-t border-gray-200 shadow-sm" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Головна сторінка'
})


import Header from '@/components/Header.vue'
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