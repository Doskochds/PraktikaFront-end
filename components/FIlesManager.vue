<template>
  <div class="file-manager">
    <!-- Таби -->
    <div class="tabs">
      <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="{ active: currentTab === tab.id }"
      >
        {{ tab.title }}
      </button>
    </div>

    <!-- Вміст вкладок -->
    <div class="tab-content">
      <UploadTab
          v-if="currentTab === 'upload'"
          @file-uploaded="refreshFiles"
      />

      <FilesListTab
          v-if="currentTab === 'files'"
          :files="files"
          @refresh="refreshFiles"
          @view-file="viewFile"
          @delete-file="deleteFile"
      />

      <FileViewTab
          v-if="currentTab === 'view' && currentFile"
          :file="currentFile"
          @back="currentTab = 'files'"
      />

      <StatisticsTab
          v-if="currentTab === 'stats'"
          :statistics="statistics"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UploadTab from './UploadTab.vue'
import FilesListTab from './FilesListTab.vue'
import FileViewTab from './FileViewTab.vue'
import StatisticsTab from './StatisticsTab.vue'

const baseURL = 'http://localhost:80/api'

const tabs = [
  { id: 'upload', title: 'Завантажити файл' },
  { id: 'files', title: 'Мої файли' },
  { id: 'view', title: 'Перегляд файлу' },
  { id: 'stats', title: 'Статистика' }
]

const currentTab = ref('upload')
const files = ref([])
const statistics = ref({})
const currentFile = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const fetchFiles = async () => {
  try {
    const response = await fetch(`${baseURL}/files`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    files.value = data.files
  } catch (error) {
    console.error('Помилка при отриманні файлів:', error)
    alert('Не вдалося завантажити файли')
  }
}

const fetchStatistics = async () => {
  try {
    const response = await fetch(`${baseURL}/files/statistics`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    statistics.value = data.statistics
  } catch (error) {
    console.error('Помилка при отриманні статистики:', error)
  }
}

const viewFile = (file) => {
  currentFile.value = file
  currentTab.value = 'view'
}

const deleteFile = async (fileId) => {
  if (!confirm('Ви впевнені, що хочете видалити цей файл?')) return

  try {
    await fetch(`${baseURL}/sanctum/csrf-cookie`, {
      credentials: 'include'
    })

    const response = await fetch(`${baseURL}/files/${fileId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': getCsrfToken(),
        'Accept': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Помилка при видаленні файлу')

    const data = await response.json()
    alert(data.message)
    await refreshFiles()
  } catch (error) {
    alert(error.message)
  }
}

const refreshFiles = async () => {
  await Promise.all([fetchFiles(), fetchStatistics()])
  currentTab.value = 'files'
}

const getCsrfToken = () => {
  return document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]
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

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
}

.tabs button.active {
  border-bottom-color: #3b82f6;
  font-weight: bold;
}

.tab-content {
  padding: 15px 0;
}
</style>