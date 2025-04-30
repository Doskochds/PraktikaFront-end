<template>
  <div class="single-file-section">
    <h2>Перегляд одного файлу</h2>

    <!-- Форма для пошуку -->
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
        <p><strong>Посилання на файл:</strong>
          <a :href="`http://localhost/file/${file.id}`" target="_blank">
            http://localhost/file/{{ file.id }}
          </a>
        </p>
      </div>

      <div class="file-actions">
        <button @click="downloadFile(file.id)">Завантажити</button>
        <button @click="deleteFile(file.id)">Видалити</button>
      </div>
    </div>

    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const fileId = ref('')
const file = ref(null)
const loading = ref(false)
const error = ref(null)
const baseURL = 'http://localhost:80/api'
const route = useRoute()

// Функція для завантаження файлу за ID
const fetchFile = async () => {
  const idToFetch = fileId.value || route.query.id // Вибираємо ID з форми або з URL
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
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Завантаження файлу
const downloadFile = (fileId) => {
  window.open(`http://localhost:80/api/files/download/${fileId}`, '_blank')
}

// Видалення файлу
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

// Завантаження файлу при завантаженні сторінки, якщо ID передано в URL
onMounted(() => {
  // Якщо в URL є параметр id, то одразу виконуємо запит
  if (route.query.id) {
    fileId.value = route.query.id
    fetchFile()
  }
})
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
</style>
