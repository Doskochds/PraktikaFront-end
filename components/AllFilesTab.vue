<template>
  <div class="all-files-section">
    <h2>Всі файли</h2>
    <div v-if="loading">Завантаження...</div>
    <div v-else>
      <div
          v-for="file in files"
          :key="file.id"
          class="file-card"
      >
        <strong>{{ file.file_name }}</strong><br />
        Коментар: {{ file.comment || '—' }}<br />
        Завантажено: {{ new Date(file.created_at).toLocaleString() }}<br />
        Видалення: {{ file.delete_at ? new Date(file.delete_at).toLocaleString() : 'не вказано' }}<br />
        Переглядів: {{ file.views ?? 0 }}
        <div class="file-actions">
          <button @click="goToFile(file.id)">Переглянути</button>
          <button @click="deleteFile(file.id)">Видалити</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const files = ref([])
const loading = ref(true)
const baseURL = 'http://localhost:80'
const router = useRouter()
const fetchFiles = async () => {
  loading.value = true
  try {
    await fetch(`${baseURL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    })
    const res = await fetch(`${baseURL}/api/files`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Не вдалося завантажити файли')
    const data = await res.json()
    files.value = data.files // 👈 важливо!
  } catch (err) {
    console.error('Помилка при отриманні файлів:', err)
  } finally {
    loading.value = false
  }
}
const deleteFile = async (id) => {
  if (!confirm('Ви дійсно хочете видалити цей файл?')) return
  try {
    const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
    const headers = new Headers({
      'Content-Type': 'application/json',
    })
    if (xsrfToken) {
      headers.append('X-XSRF-TOKEN', decodeURIComponent(xsrfToken))
    }
    const res = await fetch(`${baseURL}/api/files/${id}`, {
      method: 'DELETE',
      headers: headers,
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Помилка при видаленні файлу')
    files.value = files.value.filter(f => f.id !== id)
    alert('Файл видалено')
  } catch (err) {
    alert('Помилка: ' + err.message)
  }
}
const goToFile = (id) => {
  window.location.href = `http://localhost/file/${id}`
}
onMounted(fetchFiles)
</script>

<style scoped>
.all-files-section {
  padding: 20px;
}
.file-card {
  border: 2px solid #cbd5e1;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #f1f5f9;
}
.file-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
