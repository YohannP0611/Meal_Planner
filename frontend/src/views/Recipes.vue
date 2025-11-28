<script setup>
import { inject, ref, computed } from 'vue'

const recipes = inject('recipes', ref([]))
const getImage = (title) => {
  try {
    return require(`@/assets/${title}.jpg`)
  } catch (e) {
    return require('@/assets/MPlogo.png')
  }
}


const likeToggle = (item) => {
  item.liked = !item.liked
}

const passToggle = (item) => {
  item.passed = !item.passed
}

/* ---------- FILTRES / TRI (wireframe) ---------- */

const sortBy = ref('time') // 'time' | 'liked' | 'cost'

const sortedRecipes = computed(() => {
  const list = Array.isArray(recipes) ? recipes : recipes.value
  const arr = [...list]

  if (sortBy.value === 'liked') {
    return arr.sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0))
  }

  if (sortBy.value === 'time') {
    // tri grossier : concat PrepTime+CookTime (OK pour la démo)
    return arr.sort((a, b) =>
      (a.PrepTime + a.CookTime).localeCompare(b.PrepTime + b.CookTime)
    )
  }

  // si un jour vous avez un champ "cost", on pourra trier dessus
  return arr
})

/* ---------- POPUP FORM STATE ---------- */

const showForm = ref(false)

const form = ref({
  Title: '',
  CookTime: '00:00:00',
  PrepTime: '00:00:00',
  Difficulty: 'normal',
  Illustration: ''
})

const editingId = ref(null)

// blob URL for dropped/selected image
const imagePreview = ref(null)

const resetForm = () => {
  form.value = {
    Title: '',
    CookTime: '00:00:00',
    PrepTime: '00:00:00',
    Difficulty: 'normal',
    Illustration: ''
  }
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = null
}

const openForm = () => {
  resetForm()
  editingId.value = null
  showForm.value = true
}

const openEditForm = (recipe) => {
  form.value = {
    Title: recipe.Title,
    CookTime: recipe.CookTime,
    PrepTime: recipe.PrepTime,
    Difficulty: recipe.Difficulty,
    Illustration: recipe.Illustration || ''
  }
  editingId.value = recipe.IDRecipes
  // si la recette a déjà une image, on la prévisualise
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = recipe.ImageUrl || null
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingId.value = null
}

/* ---------- IMAGE HANDLING ---------- */

const handleFiles = (files) => {
  if (!files || !files.length) return
  const file = files[0]
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = URL.createObjectURL(file)
}

const onFileChange = (e) => {
  handleFiles(e.target.files)
}

const onDrop = (e) => {
  e.preventDefault()
  handleFiles(e.dataTransfer.files)
}

const onDragOver = (e) => {
  e.preventDefault()
}

/* ---------- SUBMIT ---------- */

const submitForm = () => {
  if (!form.value.Title) {
    alert('Title is required')
    return
  }

  if (editingId.value === null) {
    // CREATE
    const newRecipe = {
      IDRecipes: Date.now(),
      ...form.value,
      ImageUrl: imagePreview.value || null,
      liked: false,
      passed: false
    }
    if (Array.isArray(recipes)) {
      recipes.push(newRecipe)
    } else {
      recipes.value.push(newRecipe)
    }
  } else {
    // UPDATE
    const list = Array.isArray(recipes) ? recipes : recipes.value
    const rec = list.find(r => r.IDRecipes === editingId.value)
    if (rec) {
      rec.Title = form.value.Title
      rec.CookTime = form.value.CookTime
      rec.PrepTime = form.value.PrepTime
      rec.Difficulty = form.value.Difficulty
      rec.Illustration = form.value.Illustration
      rec.ImageUrl = imagePreview.value || rec.ImageUrl || null
    }
  }

  closeForm()
}

const deleteRecipe = (id) => {
  if (!confirm("Delete this recipe?")) return

  if (Array.isArray(recipes)) {
    const index = recipes.findIndex(i => i.IDRecipes === id)
    if (index !== -1) recipes.splice(index, 1)
  } else {
    recipes.value = recipes.value.filter(i => i.IDRecipes !== id)
  }
}
</script>

<template>
  <div class="recipes-page">
    <!-- BARRE DU HAUT (wireframe) -->
    <h1 class="page-title">Recipes</h1>

    <div class="recipes-toolbar">
      <div class="recipes-filters">
        <button
          class="filter-pill"
          :class="{ active: sortBy === 'time' }"
          @click="sortBy = 'time'"
        >
          Time
        </button>
        <button
          class="filter-pill"
          :class="{ active: sortBy === 'liked' }"
          @click="sortBy = 'liked'"
        >
          Liked
        </button>
        <button
          class="filter-pill"
          :class="{ active: sortBy === 'cost' }"
          @click="sortBy = 'cost'"
        >
          Cost
        </button>
        <button class="filter-pill disabled">...</button>
      </div>

      <button class="add-recipe-btn" @click="openForm">
        Add recipe
      </button>
    </div>

    <!-- POPUP FORM -->
    <div v-if="showForm" class="card">
      <div class="modal">
        <h2>{{ editingId === null ? 'Add recipe' : 'Edit recipe' }}</h2>

        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>Title</label>
            <input v-model="form.Title" required />
          </div>

          <!-- DRAG & DROP FIELD -->
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

          <!-- Preview -->
          <div v-if="imagePreview">
            <label>Preview</label>
            <img :src="imagePreview" class="ImgPreview" alt="Preview" />
          </div>

          <div class="form-row">
            <label>Cooking time</label>
            <input v-model="form.CookTime" type="time" />
          </div>

          <div class="form-row">
            <label>Preparation time</label>
            <input v-model="form.PrepTime" type="time" />
          </div>

          <div class="form-row">
            <label>Difficulty</label>
            <input v-model="form.Difficulty" />
          </div>

          <div class="actions">
            <button type="submit">Save</button>
            <button type="button" @click="closeForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CARTES (wireframe + tes images) -->
    <div class="grid">
      <div class="card recipe-card" v-for="r in sortedRecipes" :key="r.IDRecipes">
        <div class="card-header">
          <button 
            @click="passToggle(r)"
            :class="{ active: r.passed }"
          >
            x
          </button>

          <h3>{{ r.Title }}</h3>

          <button 
            @click="likeToggle(r)" 
            :class="{ active: r.liked }"
          >
            ♡
          </button>
        </div>
       <img
       :src="r.ImageUrl || getImage(r.Title)"
       :alt="r.Title"
       class="recipe-image"
/>


        <p><strong>Preparation time:</strong> {{ r.PrepTime }}</p>
        <p><strong>Cooking time:</strong> {{ r.CookTime }}</p>
        <p><strong>Difficulty:</strong> {{ r.Difficulty }}</p>

        <div class="CRUD">
          <button @click="deleteRecipe(r.IDRecipes)">🗑️</button>
          <button @click="openEditForm(r)">✏️</button>
        </div>
      </div>
    </div>
  </div>
</template>
