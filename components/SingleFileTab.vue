// tabs/SingleFileTab.vue
<template>
  <div class="single-file-section">
    <h2>Перегляд одного файлу</h2>
    <form @submit.prevent="fetchFile">
      <input v-model="fileId" type="text" placeholder="Введіть ID файлу" required />
      <button type="submit">Знайти</button>
    </form>

    <div v-if="loading">Завантаження...</div>
    <div v-else-if="file">
      <h3>{{ file.original_name }}</h3>
      <p>Коментар: {{ file.comment || '—' }}</p>
      <p>Розмір: {{ file.size_kb }} КБ</p>
      <p>Завантажено: {{ new Date(file.created_at).toLocaleString() }}</p>
      <p>Видалення: {{ file.delete_at ? new Date(file.delete_at).toLocaleString() : 'не вказано' }}</p>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileId = ref('')
const file = ref(null)
const loading = ref(false)
const error = ref(null)
const baseURL = 'http://localhost:80/api'

const fetchFile = async () => {
  loading.value = true
  error.value = null
  file.value = null
  try {
    const res = await fetch(`${baseURL}/files/${fileId.value}`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Файл не знайдено')
    file.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.single-file-section {
  padding: 20px;
}
input {
  padding: 8px;
  margin-right: 10px;
}
button {
  padding: 8px 16px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
