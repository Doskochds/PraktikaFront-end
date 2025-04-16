<template>
  <div class="statistics">
    <h2>Статистика</h2>
    <div class="stats-grid">
      <div class="stat-card" v-for="(value, key) in statistics" :key="key">
        <h3>{{ formatKey(key) }}</h3>
        <p>{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  statistics: {
    type: Object,
    required: true
  }
})

const formatKey = (key) => {
  return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}
</script>

<style scoped>
.statistics {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  margin-top: 0;
  color: #333;
}

.stat-card p {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
}
</style>