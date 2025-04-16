<template>
  <div class="upload-section">
    <h2>Завантажити файл</h2>
    <form @submit.prevent="uploadFile" class="upload-form" enctype="multipart/form-data">
      <input type="file" ref="fileInput" @change="handleFileChange"
             accept="image/*,.ai,.cdr,.svg,.wmf,.emf" required />
      <div class="form-group">
        <label>Коментар (необов'язково):</label>
        <input v-model="uploadData.comment" type="text" maxlength="255" />
      </div>
      <div class="form-group">
        <label>Видалити автоматично:</label>
        <input v-model="uploadData.delete_at" type="date" :min="minDate" />
      </div>
      <button type="submit" :disabled="uploading">
        {{ uploading ? 'Завантаження...' : 'Завантажити' }}
      </button>
      <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['file-uploaded'])

const fileInput = ref(null)
const uploading = ref(false)
const uploadError = ref(null)
const minDate = new Date().toISOString().split('T')[0]
const uploadData = ref({
  file: null,
  comment: '',
  delete_at: ''
})

const handleFileChange = (e) => {
  uploadData.value.file = e.target.files[0]
  uploadError.value = null
}

const uploadFile = async () => {
  if (!uploadData.value.file) {
    uploadError.value = 'Будь ласка, виберіть файл'
    return
  }

  uploading.value = true
  uploadError.value = null

  try {
    await fetch('http://localhost:80/sanctum/csrf-cookie', {
      credentials: 'include'
    })

    const formData = new FormData()
    formData.append('file', uploadData.value.file)
    formData.append('comment', uploadData.value.comment)

    if (uploadData.value.delete_at) {
      formData.append('delete_at', `${uploadData.value.delete_at} 12:00:00`)
    }

    const response = await fetch('http://localhost:80/api/files', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': getCsrfToken(),
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Помилка при завантаженні файлу')
    }

    const data = await response.json()
    alert(data.message)

    // Очистити форму
    uploadData.value = { file: null, comment: '', delete_at: '' }
    fileInput.value.value = null
    emit('file-uploaded')
  } catch (error) {
    console.error('Upload error:', error)
    uploadError.value = error.message
  } finally {
    uploading.value = false
  }
}

const getCsrfToken = () => {
  return document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]
}
</script>

<style scoped>
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

.form-group label {
  font-weight: 500;
}

.error-message {
  color: #ef4444;
  margin-top: 10px;
}

button {
  padding: 10px 15px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2563eb;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>