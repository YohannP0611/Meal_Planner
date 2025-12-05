<script setup>
import { 
  getIngredients as fetchIngredients, 
  createIngredient, 
  updateIngredient, 
  deleteIngredient as apiDeleteIngredient 
} from '@/services/ingredientsService'

import { onMounted, ref } from 'vue'
import { uploadFile } from '@/services/uploadService'

/* Reactive list of ingredients loaded from the backend */
const ingredients = ref([])

/* Fetch ingredients from the API */
const loadIngredients = async () => {
  try {
    ingredients.value = await fetchIngredients()
    console.log("Loaded ingredients:", ingredients.value)
  } catch (err) {
    console.error(err)
  }
}

/* Load ingredients when the component is mounted */
onMounted(() => {
  loadIngredients()
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

// toggle like for ONE recipe
const likeToggle = (item) => {
  if (!item.liked) {
    // activate like and deactivate pass
    item.liked = true
    item.passed = false
  } else {
    // deactivate like
    item.liked = false
  }
} 

// toggle pass for ONE recipe
const passToggle = (item) => {
  if (!item.passed) {
    // activate pass and deactivate like
    item.passed = true
    item.liked = false
  } else {
    // deactivate pass
    item.passed = false
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

    // Refresh the list after saving
    await loadIngredients()
    
    showForm.value = false
    editingId.value = null
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
</script>

<template>
  <div>
    <div class="about">
      <button class="add-btn" @click="openForm">Add ingredient</button>
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
      <div class="card" :class="{ passed: i.passed }" v-for="i in ingredients" :key="i.IDIngredients">
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

        <div class="CRUD">
          <button @click="deleteIngredient(i.IDIngredients)">🗑️</button>
          <button @click="openEditForm(i)">✏️</button>
        </div>
      </div>
    </div>
  </div>
</template>
