<template>
  <div>
    <Header />

    <main class="p-6">
      <h1>Ласкаво просимо на головну сторінку!</h1>
      <p>
        Цей сайт дозволить вам зберігати, ділитись та переглядати статистику щодо своїх файлів
      </p>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  components: {
    Header
  },
  head() {
    return {
      title: 'Головна сторінка'
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
