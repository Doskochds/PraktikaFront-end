<template>
  <header class="header">
    <div class="container">
      <NuxtLink to="/" class="logo">
        <span class="text">Web-site for files on praktice</span>
      </NuxtLink>
      <nav class="nav">
        <template v-if="user">
          <div class="user-menu">
            <button @click="toggleMenu" class="user-email">
              {{ user.email }}
              <span class="chevron" :class="{ 'open': isMenuOpen }">▼</span>
            </button>
            <div v-if="isMenuOpen" class="dropdown">
              <NuxtLink to="/profile" class="dropdown-item">Профіль</NuxtLink>
              <button @click="logout" class="dropdown-item">Вийти</button>
            </div>
          </div>
        </template>
        <template v-else>
          <button @click="$emit('openLoginModal')" class="nav-link">Увійти</button>
          <button @click="$emit('openRegisterModal')" class="nav-link register">Реєстрація</button>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isMenuOpen = ref(false)
const logout = async () => {
  try {
    await fetch('http://localhost:80/api/logout', {
      method: 'POST',
      credentials: 'include'
    })
    authStore.clearUser()
    navigateTo('/')
  } catch (error) {
    console.error('Помилка при виході:', error)
  }
}
</script>

<style scoped>
.header {
  background: rgba(222, 178, 178, 0.13);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
}
.nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.nav-link {
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
.nav-link:hover {
  color: #3b82f6;
}
.register {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
.register:hover {
  background: #2563eb;
  color: white;
}
.user-menu {
  position: relative;
}
.user-email {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0.5rem 0;
}
.chevron {
  font-size: 0.6rem;
  transition: transform 0.2s;
}
.chevron.open {
  transform: rotate(180deg);
}
.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  overflow: hidden;
  z-index: 10;
}
.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f3f4f6;
}
</style>