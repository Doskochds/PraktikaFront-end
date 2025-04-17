<!-- FileManager.vue -->
<template>
  <div class="file-manager">
    <div class="tabs">
      <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="activeTab = tab.name"
          :class="{ active: activeTab === tab.name }"
      >
        {{ tab.label }}
      </button>
    </div>

    <transition name="fade" mode="out-in">
      <div class="tab-content" :key="activeTab">
        <component :is="currentTabComponent" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import UploadTab from './UploadTab.vue'
import AllFilesTab from './AllFilesTab.vue'
import SingleFileTab from './SingleFileTab.vue'
import ReportTab from './ReportTab.vue'

const tabs = [
  { name: 'upload', label: 'Завантаження', component: UploadTab },
  { name: 'all', label: 'Всі файли', component: AllFilesTab },
  { name: 'single', label: 'Перегляд одного', component: SingleFileTab },
  { name: 'report', label: 'Звіт', component: ReportTab },
]

const activeTab = ref('upload')

const currentTabComponent = computed(() => {
  const tab = tabs.find(t => t.name === activeTab.value)
  return tab ? tab.component : null
})
</script>

<style scoped>
.file-manager {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 10px 20px;
  border: 2px solid transparent;
  background: #f1f5f9;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.tabs button:hover {
  background: #e2e8f0;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.tab-content {
  padding: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
