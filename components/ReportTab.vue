<template>
  <div class="report-tab">
    <h2>Звіт по файлах</h2>
    <div v-if="loading">Завантаження звіту...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="stat-item">
        <span class="stat-label">Загальна кількість файлів:</span>
        <span>{{ stats.totalFiles }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Кількість видалених файлів:</span>
        <span>{{ stats.deletedFiles }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Загальна кількість посилань:</span>
        <span>{{ stats.totalLinks }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Кількість використаних посилань:</span>
        <span>{{ stats.usedLinks }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Кількість невикористаних посилань:</span>
        <span>{{ stats.unusedLinks }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Загальна кількість переглядів:</span>
        <span>{{ stats.totalViews }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Загальна кількість файлів користувача:</span>
        <span>{{ stats.userFiles }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Кількість видалених файлів користувача:</span>
        <span>{{ stats.userDeletedFiles }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Загальна кількість переглядів файлів користувача:</span>
        <span>{{ stats.userTotalViews }}</span>
      </div>
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
    await fetch(`${baseURL}/sanctum/csrf-cookie`, { credentials: 'include' })
    const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
    if (!xsrfToken) throw new Error('Не вдалося отримати CSRF токен')
    const res = await fetch(`${baseURL}/api/statistics`, {
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
.stat-item {
  margin-bottom: 10px;
}
.stat-label {
  font-weight: bold;
}
.stat-item span {
  margin-left: 10px;
  font-size: 16px;
  color: #555;
}
</style>
