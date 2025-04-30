<template>
  <div class="report-tab">
    <h2>Звіт по файлах</h2>

    <div v-if="loading">Завантаження звіту...</div>
    <div v-else-if="error">{{ error }}</div>
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
const error = ref('')
const baseURL = 'http://localhost:80'

const fetchReport = async () => {
  loading.value = true
  error.value = ''

  try {
    // 1. Отримати CSRF cookie
    await fetch(`${baseURL}/sanctum/csrf-cookie`, {
      credentials: 'include'
    })

    // 2. Витягнути токен
    const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]

    if (!xsrfToken) {
      throw new Error('Не вдалося отримати CSRF токен')
    }

    // 3. Викликати API
    const res = await fetch(`${baseURL}/api/files/statistics`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        'Accept': 'application/json'
      }
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    const data = await res.json()
    stats.value = data.statistics || {}
  } catch (err) {
    console.error('Помилка при отриманні статистики:', err)
    error.value = 'Не вдалося завантажити статистику.'
    stats.value = {}
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
