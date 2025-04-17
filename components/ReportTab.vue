// tabs/ReportTab.vue
<template>
  <div class="report-tab">
    <h2>Звіт по файлах</h2>

    <div v-if="loading">Завантаження звіту...</div>
    <div v-else>
      <p>Загальна кількість файлів: {{ stats.total }}</p>
      <p>Кількість активних (не видалених) файлів: {{ stats.active }}</p>
      <p>Середній розмір файлу: {{ stats.avg_size_kb }} КБ</p>
      <p>Файл з найбільшим переглядом: {{ stats.most_viewed?.original_name || '—' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const stats = ref({})
const baseURL = 'http://localhost:80/api'

const fetchReport = async () => {
  loading.value = true
  try {
    const res = await fetch(`${baseURL}/files/statistics`, {
      credentials: 'include'
    })
    const data = await res.json()
    stats.value = data.statistics
  } catch (err) {
    console.error('Помилка при отриманні статистики:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReport)
</script>

<style scoped>
.report-tab {
  padding: 20px;
  background: #fef9c3;
  border-radius: 6px;
}
</style>
