<script setup>
import { ref, onMounted } from 'vue'
import { getRecipes, deleteRecipe as apiDeleteRecipe } from '@/services/recipesService'

const recipes = ref([])

// Construct full URL for recipe images from backend /uploads
function getRecipeImageUrl(recipe) {
  if (recipe.Illustration) {
    return `http://localhost:3000/uploads/${recipe.Illustration}`;
  }
  // Fallback to logo placeholder
  return require('@/assets/MPlogo.png');
}

const loadRecipes = async () => {
  try {
    recipes.value = await getRecipes()
    console.log('Loaded recipes:', recipes.value)
    recipes.value.forEach(r => {
      console.log(`Recipe: ${r.Title}, Illustration: "${r.Illustration}", Type: ${typeof r.Illustration}`)
    })
  } catch (err) {
    console.error('Failed to load recipes', err)
  }
}

onMounted(() => loadRecipes())

// toggle like for ONE recipe
const likeToggle = (item) => {
  if (!item.passed) {
    item.liked = !item.liked
  }
} 

// toggle pass for ONE recipe
const passToggle = (item) => {
  if (!item.liked) {
    item.passed = !item.passed
  }
}

/* Use RecipeForm component to handle create/edit */
import RecipeForm from '@/components/RecipeForm.vue'

const showForm = ref(false)
const editingRecipe = ref(null)

const openForm = () => {
  editingRecipe.value = null
  showForm.value = true
}

const openEditForm = (recipe) => {
  editingRecipe.value = recipe
  showForm.value = true
}

const closeForm = () => {
  editingRecipe.value = null
  showForm.value = false
}

const onSaved = ({ action, recipe }) => {
  const list = Array.isArray(recipes) ? recipes : recipes.value
  if (action === 'create') {
    list.push(recipe)
  } else if (action === 'update') {
    const idx = list.findIndex(r => r.IDRecipes === recipe.IDRecipes)
    if (idx !== -1) list.splice(idx, 1, recipe)
  }
  closeForm()
}

const deleteRecipe = async (id) => {
  if (!confirm("Delete this recipe?")) return
  try {
    await apiDeleteRecipe(id)
    recipes.value = recipes.value.filter(i => i.IDRecipes !== id)
  } catch (err) {
    console.error('Failed to delete recipe', err)
    alert('Failed to delete recipe')
  }
}
</script>

<template>
  <div>
    <div class="about">
      <button @click="openForm">Add recipe</button>
    </div>
    
    <!-- POPUP FORM -->
    <RecipeForm v-if="showForm" :initialRecipe="editingRecipe" @saved="onSaved" @close="closeForm" />

    <div class="grid">
      <div class="card" v-for="r in recipes" :key="r.IDRecipes">
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
        <!-- use illustration URL from backend /uploads, fallback to logo on error -->
        <img :src="getRecipeImageUrl(r)" :alt="r.Title" @error="(e) => e.target.src = require('@/assets/MPlogo.png')" style="display:block; margin:0 auto;" />
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
