<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Sign In</h2>

      <div class="auth-field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="you@example.com" />
      </div>

      <div class="auth-field">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" />
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button class="auth-button" @click="handleLogin">
        Log In
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.'
    return
  }

  // TODO: connect to backend auth
  console.log('Login attempt:', email.value, password.value)

  router.push('/')
}
</script>
