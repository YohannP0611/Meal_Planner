<script setup>
import { ref, onMounted } from 'vue'
import { login as apiLogin, logout as apiLogout, register as apiRegister, isLoggedIn as checkIsLoggedIn, getStoredUser } from '@/services/authService'

const showPopup = ref(false)
const isLoggedIn = ref(false)
const user = ref(null)
const showRegister = ref(false) // Toggle between login and register

const form = ref({
  email: '',
  password: '',
  displayName: '' // For registration
})

const errorMessage = ref('')

// Check if user is already logged in on mount
onMounted(() => {
  if (checkIsLoggedIn()) {
    isLoggedIn.value = true
    user.value = getStoredUser()
  }
})

const togglePopup = () => {
  showPopup.value = !showPopup.value
  errorMessage.value = ''
  showRegister.value = false
  form.value = { email: '', password: '', displayName: '' }
}

const switchToRegister = () => {
  showRegister.value = true
  errorMessage.value = ''
  form.value = { email: '', password: '', displayName: '' }
}

const switchToLogin = () => {
  showRegister.value = false
  errorMessage.value = ''
  form.value = { email: '', password: '', displayName: '' }
}

const login = async () => {
  errorMessage.value = ''
  
  try {
    const data = await apiLogin(form.value.email, form.value.password)
    
    isLoggedIn.value = true
    user.value = data.user
    showPopup.value = false
    
    // Reset form
    form.value = { email: '', password: '', displayName: '' }
    
    console.log('Login successful:', data.user)
    
    // Reload the page to load user-specific data
    window.location.reload()
  } catch (err) {
    console.error('Login failed:', err)
    errorMessage.value = err.message || 'Login failed'
  }
}

const register = async () => {
  errorMessage.value = ''
  
  if (!form.value.displayName) {
    errorMessage.value = 'Display name is required'
    return
  }
  
  try {
    const data = await apiRegister(form.value.email, form.value.password, form.value.displayName)
    
    isLoggedIn.value = true
    user.value = data.user
    showPopup.value = false
    
    // Reset form
    form.value = { email: '', password: '', displayName: '' }
    
    console.log('Registration successful:', data.user)
    
    // Reload the page to load user-specific data
    window.location.reload()
  } catch (err) {
    console.error('Registration failed:', err)
    errorMessage.value = err.message || 'Registration failed'
  }
}

const logout = () => {
  apiLogout()
  isLoggedIn.value = false
  user.value = null
  showPopup.value = false
  console.log('Logged out')
  // Reload the page to clear all user-specific data
  window.location.reload()
}

// Fermer le popup si on clique en dehors
const closePopup = (e) => {
  if (e.target.classList.contains('popup-overlay')) {
    showPopup.value = false
    errorMessage.value = ''
  }
}
</script>

<template>
  <div class="login-container">
    <!-- Bouton principal -->
    <button class="login-btn" @click="togglePopup">
      <span v-if="isLoggedIn">👤 {{ user?.displayName || user?.email }}</span>
      <span v-else>Login</span>
    </button>

    <!-- Popup -->
    <div v-if="showPopup" class="popup-overlay" @mousedown="closePopup">
      <div class="popup-box" @mousedown.stop>
        <!-- Si connecté : afficher profil -->
        <div v-if="isLoggedIn" class="profile-view">
          <h3>Profile</h3>
          <p><strong>Name:</strong> {{ user?.displayName }}</p>
          <p><strong>Email:</strong> {{ user?.email }}</p>
          <button class="logout-btn" @click="logout">Logout</button>
        </div>

        <!-- Si non connecté : afficher formulaire -->
        <div v-else class="login-form">
          <h3>{{ showRegister ? 'Register' : 'Login' }}</h3>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <!-- LOGIN FORM -->
          <form v-if="!showRegister" @submit.prevent="login">
            <div class="form-field">
              <label>Email</label>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="your@email.com"
                required 
              />
            </div>
            <div class="form-field">
              <label>Password</label>
              <input 
                v-model="form.password" 
                type="password" 
                placeholder="••••••••"
                required 
              />
            </div>
            <button type="submit" class="connect-btn">Connect</button>
            <p class="switch-mode">
              Don't have an account? 
              <a @click.prevent="switchToRegister" href="#">Register here</a>
            </p>
          </form>

          <!-- REGISTER FORM -->
          <form v-else @submit.prevent="register">
            <div class="form-field">
              <label>Display Name</label>
              <input 
                v-model="form.displayName" 
                type="text" 
                placeholder="Your Name"
                required 
              />
            </div>
            <div class="form-field">
              <label>Email</label>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="your@email.com"
                required 
              />
            </div>
            <div class="form-field">
              <label>Password</label>
              <input 
                v-model="form.password" 
                type="password" 
                placeholder="••••••••"
                required 
                minlength="6"
              />
            </div>
            <button type="submit" class="connect-btn">Register</button>
            <p class="switch-mode">
              Already have an account? 
              <a @click.prevent="switchToLogin" href="#">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  position: relative;
}

.login-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.login-btn:hover {
  background-color: #45a049;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 80px 20px 20px 20px;
  z-index: 1000;
}

.popup-box {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-form h3,
.profile-view h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  text-align: center;
}

.form-field {
  margin-bottom: 16px;
}

.form-field label {
  display: block;
  margin-bottom: 4px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.form-field input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-field input:focus {
  outline: none;
  border-color: #4CAF50;
}

.connect-btn {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
}

.connect-btn:hover {
  background-color: #45a049;
}

.profile-view {
  text-align: center;
}

.profile-view p {
  margin: 16px 0;
  color: #555;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.logout-btn:hover {
  background-color: #da190b;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

.switch-mode {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.switch-mode a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.switch-mode a:hover {
  text-decoration: underline;
}
</style>
