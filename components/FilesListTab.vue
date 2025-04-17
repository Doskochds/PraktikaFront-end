<template>
  <div class="files-list">
    <h2>Мої файли</h2>
    <div class="file-actions">
      <button @click="$emit('refresh')">Оновити список</button>
      <button @click="showStatistics = !showStatistics">
        {{ showStatistics ? 'Сховати статистику' : 'Показати статистику' }}
      </button>
    </div>

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
          <button @click="$emit('view-file', file)">Переглянути</button>
          <button @click="$emit('delete-file', file.id)" class="delete">Видалити</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  files: {
    type: Array,
    required: true
  }
})

defineEmits(['refresh', 'view-file', 'delete-file'])

const showStatistics = ref(false)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
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
</style>