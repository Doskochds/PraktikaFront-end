<template>
  <div class="single-file-section">
    <h2>Перегляд одного файлу</h2>
    <form @submit.prevent="fetchFile">
      <input v-model="fileId" type="text" placeholder="Введіть ID файлу" required />
      <button type="submit">Знайти</button>
    </form>
    <div v-if="loading">Завантаження...</div>
    <div v-else-if="file">
      <div class="file-info">
        <h3>{{ file.file_name }}</h3>
        <p v-if="file.comment"><strong>Коментар:</strong> {{ file.comment }}</p>
        <p><strong>Кількість переглядів:</strong> {{ file.views }}</p>
        <p><strong>Завантажено:</strong> {{ new Date(file.created_at).toLocaleString() }}</p>
        <p><strong>Видалення:</strong> {{ file.delete_at ? new Date(file.delete_at).toLocaleString() : 'не вказано' }}</p>
      </div>
      <div class="file-link">
        <h3>Одноразові посилання</h3>
        <ul>
          <li v-for="link in file.links" :key="link.token">
            <a :href="`http://localhost/files/view/${link.token}`" target="_blank">{{ `http://localhost/files/view/${link.token}` }}</a>
            <button @click="deleteLink(link.token)">Видалити</button>
          </li>
        </ul>
        <button @click="generateNewLink">Створити нове посилання</button>
      </div>
      <div class="file-actions">
        <button @click="deleteFile(file.id)">Видалити файл</button>
      </div>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const fileId = ref('')
const file = ref(null)
const loading = ref(false)
const error = ref(null)
const baseURL = 'http://localhost:80/api'
const route = useRoute()
const getCsrfToken = async () => {
  const res = await fetch(`${baseURL}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Не вдалося отримати CSRF токен')
  }
}
const fetchFile = async () => {
  const idToFetch = fileId.value || route.query.id
  if (!idToFetch) {
    error.value = 'ID файлу не передано'
    return
  }
  loading.value = true
  error.value = null
  file.value = null
  try {
    const res = await fetch(`${baseURL}/files/${idToFetch}`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Файл не знайдено')
    const data = await res.json()
    file.value = data.file
    await fetchLinks()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
const fetchLinks = async () => {
  try {
    const res = await fetch(`${baseURL}/files/${file.value.id}/links`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Не вдалося отримати одноразові посилання')
    const data = await res.json()
    if (data.links && Array.isArray(data.links)) {
      file.value.links = data.links.map(link => ({
        token: link.token,
        url: link.url
      }))
    } else {
      file.value.links = []
    }
  } catch (err) {
    alert('Помилка при отриманні посилань: ' + err.message)
  }
}
const generateNewLink = async () => {
  try {
    await getCsrfToken()
    const res = await fetch(`${baseURL}/files/${file.value.id}/generate-links`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ count: 1, token: file.value.token }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('Не вдалося створити нове посилання')
    const data = await res.json()
    file.value.links.push(...data.urls)
  } catch (err) {
    alert('Помилка при створенні посилання: ' + err.message)
  }
}
const deleteLink = async (token) => {
  if (confirm('Ви справді хочете видалити це посилання?')) {
    try {
      const res = await fetch(`${baseURL}/links/${token}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        file.value.links = file.value.links.filter(link => link.token !== token)
      } else {
        throw new Error('Не вдалося видалити посилання')
      }
    } catch (err) {
      alert('Помилка при видаленні посилання: ' + err.message)
    }
  }
}
const deleteFile = async (fileId) => {
  if (confirm('Ви справді хочете видалити цей файл?')) {
    try {
      const res = await fetch(`${baseURL}/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        alert('Файл успішно видалено')
        file.value = null
      } else {
        throw new Error('Не вдалося видалити файл')
      }
    } catch (err) {
      alert('Помилка при видаленні файлу: ' + err.message)
    }
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
.file-info {
  margin-bottom: 20px;
}
.file-link {
  margin: 20px 0;
}
.file-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
li button {
  margin-left: 10px;
  background-color: red;
  color: white;
}
</style>
