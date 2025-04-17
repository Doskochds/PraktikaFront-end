<template>
  <div class="file-view">
    <button @click="$emit('back')" class="back-button">← Назад до списку</button>
    <div class="file-info">
      <h3>{{ file.original_name }}</h3>
      <p v-if="file.comment"><strong>Коментар:</strong> {{ file.comment }}</p>
      <p><strong>Дата завантаження:</strong> {{ formatDate(file.created_at) }}</p>
      <p v-if="file.delete_at"><strong>Видалити:</strong> {{ formatDate(file.delete_at) }}</p>
    </div>
    <div class="file-preview">
      <iframe
          v-if="isImage(file.original_name)"
          :src="`http://localhost:80/api/files/view/${file.id}`"
          frameborder="0"
      ></iframe>
      <div v-else class="unsupported-format">
        Попередній перегляд недоступний для цього типу файлу
      </div>
    </div>
    <div class="file-actions">
      <button @click="downloadFile(file.id)">Завантажити</button>
      <button @click="generateLinks">Згенерувати посилання</button>
    </div>
    <div v-if="generatedLinks.length > 0" class="links-section">
      <h4>Згенеровані одноразові посилання:</h4>
      <div class="links-list">
        <div v-for="(link, index) in generatedLinks" :key="index" class="link-item">
          <input :value="link" readonly />
          <button @click="copyLink(link)">Копіювати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['back'])
const generatedLinks = ref([])
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
const isImage = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)
}
const downloadFile = (fileId) => {
  window.open(`http://localhost:80/api/files/download/${fileId}`, '_blank')
}
const generateLinks = async () => {
  try {
    const response = await fetch(`http://localhost:80/api/files/${props.file.id}/generate-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: 1 }),
      credentials: 'include'
    })
    const data = await response.json()
    generatedLinks.value = data.urls.map(url => `${window.location.origin}/links/${url.token}`)
  } catch (error) {
    alert('Помилка при генерації посилань: ' + error.message)
  }
}
const copyLink = (link) => {
  navigator.clipboard.writeText(link)
  alert('Посилання скопійовано в буфер обміну')
}
</script>

<style scoped>
.file-view {
  padding: 20px;
}
.back-button {
  margin-bottom: 20px;
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 1rem;
}
.file-info {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}
.file-preview {
  margin: 20px 0;
  border: 1px solid #ddd;
  min-height: 500px;
}
.file-preview iframe {
  width: 100%;
  height: 500px;
}
.unsupported-format {
  padding: 20px;
  text-align: center;
  color: #666;
}
.file-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.links-section {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}
.links-list {
  margin-top: 15px;
}
.link-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.link-item input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
</style>