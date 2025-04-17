<template>
  <footer class="bg-gray-100 py-4 shadow-inner">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <div v-if="loading" class="text-gray-600">
        Перевірка статусу сервіса...
      </div>
      <div v-else-if="apiAvailable" class="text-green-600 font-medium">
        ✅ Сервіс доступний, усе готово для роботи
      </div>
      <div v-else class="text-red-600 font-medium">
        ❌ Сервіс недоступний, спробуйте пізніше
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const apiAvailable = ref(false);
const loading = ref(true);

const checkApiStatus = async () => {
  try {
    const response = await fetch('http://localhost:80/api/health-check');
    apiAvailable.value = response.ok;
  } catch (error) {
    apiAvailable.value = false;
    console.error('Помилка при перевірці API:', error);
  } finally {
    loading.value = false;
  }
};


onMounted(checkApiStatus);

const interval = ref();
onMounted(() => {
  interval.value = setInterval(checkApiStatus, 30000);
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<style scoped>
footer {
  border-top: 1px solid #e5e7eb;
}
</style>