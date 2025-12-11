<script setup>
import { 
  getIngredients as fetchIngredients, 
  createIngredient, 
  updateIngredient, 
  deleteIngredient as apiDeleteIngredient 
} from '@/services/ingredientsService'

import { onMounted, ref, onUnmounted } from 'vue'
import { uploadFile } from '@/services/uploadService'
import { getIngredientPreferences, setIngredientPreference, removeIngredientPreference } from '@/services/preferencesService'
import { isLoggedIn as checkIsLoggedIn, getStoredUser } from '@/services/authService'

/* Reactive list of ingredients loaded from the backend */
const ingredients = ref([])
const preferences = ref({})
const currentUser = ref(null)
let authCheckInterval = null

/* Fetch ingredients from the API */
const loadIngredients = async () => {
  try {
    ingredients.value = await fetchIngredients()
    console.log("Loaded ingredients:", ingredients.value)
    
    // Initialize liked and passed properties
    ingredients.value.forEach(i => {
      i.liked = false
      i.passed = false
    })
    
    // Load current user and preferences if logged in
    if (checkIsLoggedIn()) {
      currentUser.value = getStoredUser()
      await loadPreferences()
    }
  } catch (err) {
    console.error(err)
  }
}

const loadPreferences = async () => {
  try {
    const prefs = await getIngredientPreferences()
    // Convert array to object map for easy lookup
    preferences.value = {}
    prefs.forEach(p => {
      preferences.value[p.IDIngredients] = p.Status
    })
    
    // Apply preferences to ingredients
    ingredients.value.forEach(i => {
      const status = preferences.value[i.IDIngredients]
      i.liked = status === 'liked'
      i.passed = status === 'passed'
    })
  } catch (err) {
    console.error('Failed to load preferences', err)
  }
}

/* Load ingredients when the component is mounted */
onMounted(() => {
  loadIngredients()
  
  // Check for login/logout changes periodically
  authCheckInterval = setInterval(() => {
    const user = getStoredUser()
    const userChanged = JSON.stringify(user) !== JSON.stringify(currentUser.value)
    if (userChanged) {
      currentUser.value = user
    }
  }, 500)
})

/* Returns an image based on the ingredient's name */
const getImage = (name) => {
  try {
    return require(`@/assets/${name}.jpg`)
  } catch (e) {
    // Fallback image if the file doesn't exist
    return require('@/assets/MPlogo.png')
  }
}

/* Construct full URL for ingredient images */
const getIngredientImageUrl = (ingredient) => {
  if (!ingredient.IngredientPicture) return getImage(ingredient.Illustration || ingredient.Name);
  // IngredientPicture contains just the filename, construct full URL
  return `http://localhost:3000/uploads/${ingredient.IngredientPicture}`;
}

/* ----------- LIKE / PASS SYSTEM ----------- */

// toggle like for ONE ingredient
const likeToggle = async (item) => {
  if (!checkIsLoggedIn()) {
    alert('Please login to like ingredients')
    return
  }

  try {
    if (!item.liked) {
      // activate like and deactivate pass
      await setIngredientPreference(item.IDIngredients, 'liked')
      item.liked = true
      item.passed = false
      preferences.value[item.IDIngredients] = 'liked'
    } else {
      // deactivate like
      await removeIngredientPreference(item.IDIngredients)
      item.liked = false
      delete preferences.value[item.IDIngredients]
    }
  } catch (err) {
    console.error('Failed to update preference', err)
    alert('Failed to update preference')
  }
} 

// toggle pass for ONE ingredient
const passToggle = async (item) => {
  if (!checkIsLoggedIn()) {
    alert('Please login to pass ingredients')
    return
  }

  try {
    if (!item.passed) {
      // activate pass and deactivate like
      await setIngredientPreference(item.IDIngredients, 'passed')
      item.passed = true
      item.liked = false
      preferences.value[item.IDIngredients] = 'passed'
    } else {
      // deactivate pass
      await removeIngredientPreference(item.IDIngredients)
      item.passed = false
      delete preferences.value[item.IDIngredients]
    }
  } catch (err) {
    console.error('Failed to update preference', err)
    alert('Failed to update preference')
  }
}

/* ----------- POPUP FORM MANAGEMENT ----------- */

const showForm = ref(false)

/* Form data (used for both create and edit) */
const form = ref({
  Name: '',
  Calories: 0,
  Carbs: 0,
  Protein: 0
})

/* editingId = null → create mode | number → edit mode */
const editingId = ref(null)

/* Open form in create mode */
const openForm = () => {
  form.value = {
    Name: '',
    Calories: 0,
    Carbs: 0,
    Protein: 0,
    IngredientPicture: null
  }
  editingId.value = null
  if (imagePreview.value) { URL.revokeObjectURL(imagePreview.value); imagePreview.value = null }
  showForm.value = true
}

/* Open form in edit mode with existing values */
const openEditForm = (ingredient) => {
  form.value = {
    Name: ingredient.Name,
    Calories: ingredient.Calories,
    Carbs: ingredient.Carbs,
    Protein: ingredient.Protein,
    IngredientPicture: ingredient.IngredientPicture || null
  }
  editingId.value = ingredient.IDIngredients
  // prefill image preview if the ingredient has one
  if (ingredient.IngredientPicture) {
    if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview.value)
    }
    // Construct full URL for preview
    imagePreview.value = `http://localhost:3000/uploads/${ingredient.IngredientPicture}`
  } else {
    imagePreview.value = null
  }
  showForm.value = true
}

/* Close the popup form */
const closeForm = () => {
  showForm.value = false
  editingId.value = null
  if (imagePreview.value) { URL.revokeObjectURL(imagePreview.value); imagePreview.value = null }
}


const imagePreview = ref(null)

// Check if current user can edit an ingredient
const canEdit = (ingredient) => {
  if (!currentUser.value) return false // Not logged in
  if (currentUser.value.role === 'admin') return true // Admin can edit everything
  if (!ingredient.IDAcc) return false // No owner, not editable by regular users
  return currentUser.value.id === ingredient.IDAcc // Owner can edit
}

const handleFiles = async (files) => {
  if (!files || !files.length) return
  const file = files[0]
  try {
    // upload to backend, get just the filename
    const filename = await uploadFile(file)
    // show preview with full URL
    imagePreview.value = `http://localhost:3000/uploads/${filename}`
    // store just the filename in form (will be saved to DB)
    form.value.IngredientPicture = filename
  } catch (err) {
    console.error('Upload failed', err)
    alert('Image upload failed')
  }
}

const onFileChange = (e) => handleFiles(e.target.files)
const onDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }
const onDragOver = (e) => e.preventDefault()

/* Submit form (either create or update depending on editingId) */
const submitForm = async () => {
  if (!form.value.Name) {
    alert('Name is required')
    return
  }

  try {
    if (editingId.value === null) {
      // Create new ingredient (don't send ImageUrl until backend supports it)
      await createIngredient({ ...form.value })
      console.log("Created ingredient:", form.value)
    } else {
      // Update existing ingredient (don't send ImageUrl until backend supports it)
      await updateIngredient(editingId.value, { ...form.value })
      console.log("Updated ingredient:", form.value)
    }

    showForm.value = false
    editingId.value = null
    
    // Refresh the list after saving to get fresh IDAcc values
    await loadIngredients()
  } catch (err) {
    console.error("Error:", err)
    alert("Failed to save ingredient")
  }
}

/* Delete an ingredient by ID */
const deleteIngredient = async (id) => {
  if (!confirm("Delete this ingredient?")) return

  try {
    await apiDeleteIngredient(id)
    console.log("Deleted ingredient:", id)

    // Refresh the list after deletion
    await loadIngredients()
  } catch (err) {
    console.error("Error:", err)
    alert("Failed to delete ingredient")
  }
}

onUnmounted(() => {
  if (authCheckInterval) clearInterval(authCheckInterval)
})
</script>

<template>
  <div>
    <div class="about">
      <button v-if="currentUser" class="add-btn" @click="openForm">Add ingredient</button>
    </div>
    
    <!-- POPUP FORM -->
    <div v-if="showForm" class="card card-add">
      <div class="modal">
            <h2>{{ editingId === null ? 'Add ingredient' : 'Edit ingredient' }}</h2>

            <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>Name</label>
            <input v-model="form.Name" required maxlength="50" />
          </div>

                    <!-- Image upload -->
                    <div
                      class="form-row dropzone"
                      @dragover="onDragOver"
                      @dragenter.prevent
                      @drop="onDrop"
                    >
                      <label>Image</label>
                      <div class="dropzone-inner">
                        <p>Drop an image here or choose a file</p>
                        <input type="file" accept="image/*" @change="onFileChange" />
                      </div>
                    </div>

                    <div v-if="imagePreview">
                      <label>Preview</label>
                      <img :src="imagePreview" class="ImgPreview" alt="Preview" />
                    </div>

          <div class="form-row">
            <label>Calories</label>
            <input v-model.number="form.Calories" type="number" min="0" max="2147483647" step="1" />
          </div>

          <div class="form-row">
            <label>Carbs</label>
            <input v-model.number="form.Carbs" type="number" min="0" max="9999999999999.99" step="0.01" />
          </div>

          <div class="form-row">
            <label>Protein</label>
            <input v-model.number="form.Protein" type="number" min="0" max="9999999999999.99" step="0.01" />
          </div>

          <div class="actions">
            <button type="submit">Save</button>
            <button type="button" @click="closeForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="grid">
      <div class="card" :class="{ passed: i.passed, liked: i.liked }" v-for="i in ingredients" :key="i.IDIngredients">
        <div class="card-header">
          <button 
            @click="passToggle(i)"
            :class="{ active: i.passed }"
          >
            x
          </button>

          <h3>{{ i.Name }}</h3>

          <button 
            @click="likeToggle(i)" 
            :class="{ active: i.liked }"
          >
            ♡
          </button>
        </div>

          <!-- Ingredient image: use helper function to construct full URL -->
          <img :src="getIngredientImageUrl(i)" :alt="i.Name" />

        <p><strong>Calories:</strong> {{ i.Calories }} kcal</p>
        <p><strong>Carbs:</strong> {{ i.Carbs }} g</p>
        <p><strong>Protein:</strong> {{ i.Protein }} g</p>

        <div class="CRUD" v-if="canEdit(i)">
          <button @click="deleteIngredient(i.IDIngredients)">🗑️</button>
          <button @click="openEditForm(i)">✏️</button>
        </div>
      </div>
    </div>
  </div>
</template>
