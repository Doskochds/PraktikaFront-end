<template>
  <div class="upload-section">
    <h2>Завантажити файл</h2>
    <form @submit.prevent="uploadFile" class="upload-form">
      <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          accept="image/*,.ai,.cdr,.svg,.wmf,.emf"
      />
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
const baseURL = 'http://localhost:80'
const uploading = ref(false)
const uploadData = ref<{ file: File | null; comment: string; delete_at: string }>({
  file: null,
  comment: '',
  delete_at: ''
})
const fileInput = ref<HTMLInputElement | null>(null)
const minDate = new Date().toISOString().slice(0, 16)
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    uploadData.value.file = target.files[0]
  }
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
    await fetch(`${baseURL}/sanctum/csrf-cookie`, { credentials: 'include' })
    const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
    if (!xsrfToken) {
      throw new Error('Не вдалося отримати CSRF токен')
    }
    const response = await fetch(`${baseURL}/api/files`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Помилка при завантаженні файлу')
    }
    const data = await response.json()
    alert(data.message)
    if (fileInput.value) fileInput.value.value = ''
    uploadData.value = { file: null, comment: '', delete_at: '' }
  } catch (error: any) {
    alert(error.message || 'Сталася невідома помилка')
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
