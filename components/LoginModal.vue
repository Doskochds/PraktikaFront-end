<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      <h2 class="modal-title">Увійти</h2>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input
              id="login-email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              :class="{ error: errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="login-password">Пароль</label>
          <input
              id="login-password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              :class="{ error: errors.password }"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Увійти</span>
          <span v-else>Вхід...</span>
        </button>

        <div v-if="serverError" class="server-error">{{ serverError }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const emit = defineEmits(['close'])

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const isLoading = ref(false)
const serverError = ref('')

const validateForm = () => {
  errors.value = {}
  let isValid = true

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    errors.value.email = 'Введіть email'
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Введіть коректний email'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Введіть пароль'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  serverError.value = ''

  try {
    const response = await fetch('http://localhost:80/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        errors.value.email = 'Невірний email або пароль'
        return
      }
      throw new Error(data.message || 'Помилка входу')
    }

    localStorage.setItem('auth_token', data.token)
    authStore.setUser(data.user)

    emit('close')
  } catch (error) {
    serverError.value = error.message || 'Помилка при з’єднанні з сервером'
  } finally {
    isLoading.value = false
  }
}
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
</style>
