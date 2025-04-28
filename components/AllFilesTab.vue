<template>
  <div class="all-files-section">
    <h2>Всі файли</h2>
    <div v-if="loading">Завантаження...</div>
    <ul v-else>
      <li v-for="file in files" :key="file.id">
        <strong>{{ file.original_name }}</strong> ({{ file.size_kb }} КБ)
        <br />
        Коментар: {{ file.comment || '—' }}<br />
        Завантажено: {{ new Date(file.created_at).toLocaleString() }}<br />
        Видалення: {{ file.delete_at ? new Date(file.delete_at).toLocaleString() : 'не вказано' }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const files = ref([])
const loading = ref(true)
const baseURL = 'http://localhost:80/api'
const authStore = useAuthStore()

const fetchFiles = async () => {
  loading.value = true
  try {
    // Отримуємо токен з Pinia
    const token = authStore.token
    const headers = new Headers({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    })

    const res = await fetch(`${baseURL}/files`, {
      method: 'GET',
      headers,
      credentials: 'include'
    })

    if (!res.ok) {
      throw new Error('Не вдалося завантажити файли')
    }

    const data = await res.json()
    files.value = data
  } catch (err) {
    console.error('Помилка при отриманні файлів:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchFiles)
</script>

<style scoped>
.all-files-section {
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 15px;
  background: #e2e8f0;
  padding: 10px;
  border-radius: 6px;
}
</style>


