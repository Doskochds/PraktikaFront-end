<template>
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
        <input v-model="uploadData.delete_at" type="date" :min="minDate" />
      </div>
      <button type="submit" :disabled="uploading">Завантажити</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const baseURL = 'http://localhost:80/api'
const uploading = ref(false)
const uploadData = ref({ file: null, comment: '', delete_at: '' })
const fileInput = ref(null)
const minDate = new Date().toISOString().slice(0, 10)
const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN=')).split('=')[1]
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
    formData.append('delete_at', new Date(uploadData.value.delete_at).toISOString().slice(0, 10)) // Залишаємо тільки дату
  }
  try {
    const response = await fetch(`${baseURL}/files`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
      credentials: 'include'
    })
    if (!response.ok) throw new Error('Помилка при завантаженні файлу')
    const data = await response.json()
    alert(data.message)
    fileInput.value.value = ''
    uploadData.value = { file: null, comment: '', delete_at: '' }
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}
</script>
<style scoped>
.upload-section {
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
</style>
