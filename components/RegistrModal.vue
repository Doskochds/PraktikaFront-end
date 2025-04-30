<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      <h2 class="modal-title">Реєстрація</h2>
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="name">Ім'я</label>
          <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="form-input"
              :class="{ 'error': errors.name }"
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              :class="{ 'error': errors.email }"
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              :class="{ 'error': errors.password }"
          >
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>
        <div class="form-group">
          <label for="password_confirm">Підтвердіть пароль</label>
          <input
              id="password_confirm"
              v-model="form.password_confirm"
              type="password"
              required
              class="form-input"
              :class="{ 'error': errors.password_confirm }"
          >
          <span v-if="errors.password_confirm" class="error-message">{{ errors.password_confirm }}</span>
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Зареєструватись</span>
          <span v-else>Обробка...</span>
        </button>
        <div v-if="serverError" class="server-error">{{ serverError }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirm: ''
})
const errors = ref({})
const isLoading = ref(false)
const serverError = ref('')
const successMessage = ref('')
const validateForm = () => {
  errors.value = {}
  let isValid = true
   if (!form.value.name.trim()) {
    errors.value.name = "Введіть ім'я"
    isValid = false
  } else if (form.value.name.length < 3) {
    errors.value.name = "Ім'я має містити щонайменше 3 символи"
    isValid = false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    errors.value.email = "Введіть email"
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = "Введіть коректний email"
    isValid = false
  }
    if (!form.value.password) {
    errors.value.password = "Введіть пароль"
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = "Пароль має містити щонайменше 6 символів"
    isValid = false
  }
  if (form.value.password !== form.value.password_confirm) {
    errors.value.password_confirm = "Паролі не співпадають"
    isValid = false
  }
  return isValid
}
const handleSubmit = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  serverError.value = '';
  successMessage.value = '';
  try {
    const dataToSend = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    };
    const response = await fetch('http://localhost:80/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Помилка реєстрації');
    }
    successMessage.value = 'Реєстрація успішна! Можете увійти.';
    form.value = {
      name: '',
      email: '',
      password: '',
      password_confirm: ''
    };
    setTimeout(() => {
      emit('close');
    }, 2000);
  } catch (error) {
    serverError.value = error.message || 'Сталася помилка при реєстрації';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
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
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
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
.modal-title {
  margin-bottom: 1.5rem;
  text-align: center;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-input.error {
  border-color: #ff4444;
}
.error-message {
  color: #ff4444;
  font-size: 0.8rem;
}
.submit-btn {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submit-btn:hover {
  background-color: #2563eb;
}
.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.server-error {
  margin-top: 1rem;
  color: #ff4444;
  text-align: center;
}
.success-message {
  margin-top: 1rem;
  color: #00C851;
  text-align: center;
}
</style>