<template>
  <div class="file-manager">
    <!-- Завантаження файлів -->
    <div class="upload-section">
      <h2>Завантажити файл</h2>
      <form @submit.prevent="uploadFile" class="upload-form">
        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*,.ai,.cdr,.svg,.wmf,.emf" />
        <div class="form-group">
          <label>Коментар (необов'язково):</label>
          <input v-model="uploadData.comment" type="text" maxlength="255" />
        </div>
        <div class="form-group">
          <label>Видалити автоматично:</label>
          <input v-model="uploadData.delete_at" type="datetime-local" :min="minDate" />
        </div>
        <button type="submit" :disabled="uploading">Завантажити</button>
      </form>
    </div>

    <!-- Список файлів -->
    <div class="files-list">
      <h2>Мої файли</h2>
      <div class="file-actions">
        <button @click="refreshFiles">Оновити список</button>
        <button @click="showStatistics = !showStatistics">
          {{ showStatistics ? 'Сховати статистику' : 'Показати статистику' }}
        </button>
      </div>

      <!-- Статистика -->
      <div v-if="showStatistics" class="statistics">
        <h3>Статистика</h3>
        <pre>{{ statistics }}</pre>
      </div>

      <!-- Таблиця файлів -->
      <table>
        <thead>
        <tr>
          <th>Ім'я файлу</th>
          <th>Коментар</th>
          <th>Дата видалення</th>
          <th>Дії</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="file in files" :key="file.id">
          <td>{{ file.original_name }}</td>
          <td>{{ file.comment || '-' }}</td>
          <td>{{ file.delete_at ? formatDate(file.delete_at) : 'Не встановлено' }}</td>
          <td class="actions">
            <button @click="viewFile(file.id)">Переглянути</button>
            <button @click="generateLink(file.id)">Згенерувати посилання</button>
            <button @click="deleteFile(file.id)" class="delete">Видалити</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальне вікно для одноразових посилань -->
    <div v-if="showLinksModal" class="modal-overlay" @click.self="closeLinksModal">
      <div class="modal-content">
        <button class="close-button" @click="closeLinksModal">×</button>
        <h3>Одноразові посилання для файлу</h3>
        <div class="links-list">
          <div v-for="(link, index) in generatedLinks" :key="index" class="link-item">
            <input :value="link" readonly />
            <button @click="copyLink(link)">Копіювати</button>
          </div>
        </div>
        <div class="generate-more">
          <input v-model.number="linksCount" type="number" min="1" max="10" />
          <button @click="generateMoreLinks">Згенерувати ще</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const baseURL = 'http://localhost:80/api'

const files = ref([])
const statistics = ref({})
const showStatistics = ref(false)
const showLinksModal = ref(false)
const generatedLinks = ref([])
const currentFileId = ref(null)
const linksCount = ref(1)
const uploading = ref(false)
const uploadData = ref({
  file: null,
  comment: '',
  delete_at: ''
})
const fileInput = ref(null)

const minDate = new Date().toISOString().slice(0, 16)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const handleFileChange = (e) => {
  uploadData.value.file = e.target.files[0]
}

const uploadFile = async () => {
  if (!uploadData.value.file) {
    alert('Будь ласка, виберіть файл')
    return
  }

  uploading.value = true

  const formData = new FormData()
  formData.append('file', uploadData.value.file)
  formData.append('comment', uploadData.value.comment)
  if (uploadData.value.delete_at) {
    formData.append('delete_at', new Date(uploadData.value.delete_at).toISOString())
  }

  try {
    const response = await fetch(`${baseURL}/files`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (!response.ok) throw new Error('Помилка при завантаженні файлу')

    const data = await response.json()
    alert(data.message)
    fileInput.value.value = ''
    uploadData.value = { file: null, comment: '', delete_at: '' }
    await fetchFiles()
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

const fetchFiles = async () => {
  try {
    const response = await fetch(`${baseURL}/files`, {
      credentials: 'include'
    })
    const data = await response.json()
    files.value = data.files
  } catch (error) {
    console.error('Помилка при отриманні файлів:', error)
  }
}

const fetchStatistics = async () => {
  try {
    const response = await fetch(`${baseURL}/files/statistics`, {
      credentials: 'include'
    })
    const data = await response.json()
    statistics.value = data.statistics
  } catch (error) {
    console.error('Помилка при отриманні статистики:', error)
  }
}

const viewFile = (fileId) => {
  window.open(`${baseURL}/files/view/${fileId}`, '_blank')
}

const deleteFile = async (fileId) => {
  if (!confirm('Ви впевнені, що хочете видалити цей файл?')) return

  try {
    const response = await fetch(`${baseURL}/files/${fileId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) throw new Error('Помилка при видаленні файлу')

    const data = await response.json()
    alert(data.message)
    await fetchFiles()
  } catch (error) {
    alert(error.message)
  }
}

const generateLink = async (fileId) => {
  currentFileId.value = fileId
  try {
    const response = await fetch(`${baseURL}/files/${fileId}/generate-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: linksCount.value }),
      credentials: 'include'
    })

    const data = await response.json()
    generatedLinks.value = data.urls.map(url => `${window.location.origin}/links/${url.token}`)
    showLinksModal.value = true
  } catch (error) {
    alert('Помилка при генерації посилань: ' + error.message)
  }
}

const generateMoreLinks = async () => {
  await generateLink(currentFileId.value)
}

const copyLink = (link) => {
  navigator.clipboard.writeText(link)
  alert('Посилання скопійовано в буфер обміну')
}

const closeLinksModal = () => {
  showLinksModal.value = false
  generatedLinks.value = []
}

const refreshFiles = async () => {
  await Promise.all([fetchFiles(), fetchStatistics()])
}

onMounted(async () => {
  await refreshFiles()
})
</script>

<style scoped>
.file-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.upload-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.files-list {
  margin-top: 30px;
}

.file-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

.actions {
  display: flex;
  gap: 5px;
}

button {
  padding: 8px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}

button.delete {
  background-color: #ef4444;
}

button.delete:hover {
  background-color: #dc2626;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}

.link-item {
  display: flex;
  gap: 5px;
}

.link-item input {
  flex-grow: 1;
  padding: 8px;
}

.generate-more {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.generate-more input {
  width: 60px;
  padding: 8px;
}

.statistics {
  margin: 15px 0;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
