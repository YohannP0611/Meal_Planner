<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { getRecipes, deleteRecipe as apiDeleteRecipe } from '@/services/recipesService'
import { addMealToPlanning } from '@/services/planningService'
import { getRecipePreferences, setRecipePreference, removeRecipePreference } from '@/services/preferencesService'
import { isLoggedIn as checkIsLoggedIn, getStoredUser } from '@/services/authService'

const recipes = ref([])
const preferences = ref({})
const currentUser = ref(null)
let authCheckInterval = null



// --------- ADD TO MEALS (planning) ---------
const showPlanModal = ref(false)
const selectedRecipeForPlanning = ref(null)
const selectedMealDate = ref('')
const selectedMealType = ref('Breakfast')
const isSavingPlanning = ref(false)
const planningError = ref(null)

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' }
]


function openPlanningModal(recipe) {
  selectedRecipeForPlanning.value = recipe
  selectedMealDate.value = ''
  selectedMealType.value = 'Breakfast'
  planningError.value = null
  showPlanModal.value = true
}

function closePlanningModal() {
  showPlanModal.value = false
}

async function savePlanning() {
  if (!selectedMealDate.value) {
    planningError.value = 'Please select a date.'
    return
  }
  if (!selectedRecipeForPlanning.value) return

  try {
    isSavingPlanning.value = true
    planningError.value = null

    await addMealToPlanning({
      accountId: currentUser.value?.id,
      recipeId: selectedRecipeForPlanning.value.IDRecipes,
      dateMeal: selectedMealDate.value, // format HTML : YYYY-MM-DD
      mealType: selectedMealType.value
    })

    showPlanModal.value = false
  } catch (err) {
    console.error(err)
    planningError.value = 'Could not save this meal in your planning.'
  } finally {
    isSavingPlanning.value = false
  }
}
// --------- FIN PARTIE ADD TO MEALS ---------


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

    // Initialize liked and passed properties
    recipes.value.forEach(r => {
      r.liked = false
      r.passed = false
    })

    // Load current user and preferences if logged in
    if (checkIsLoggedIn()) {
      currentUser.value = getStoredUser()
      await loadPreferences()
    }
  } catch (err) {
    console.error('Failed to load recipes', err)
  }
}

const loadPreferences = async () => {
  try {
    const prefs = await getRecipePreferences()
    // Convert array to object map for easy lookup: { recipeId: 'liked' | 'passed' }
    preferences.value = {}
    prefs.forEach(p => {
      preferences.value[p.IDRecipes] = p.Status
    })

    // Apply preferences to recipes
    recipes.value.forEach(r => {
      const status = preferences.value[r.IDRecipes]
      r.liked = status === 'liked'
      r.passed = status === 'passed'
    })
  } catch (err) {
    console.error('Failed to load preferences', err)
  }
}

onMounted(() => {
  loadRecipes()

  // Check for login/logout changes periodically
  authCheckInterval = setInterval(() => {
    const user = getStoredUser()
    const userChanged = JSON.stringify(user) !== JSON.stringify(currentUser.value)
    if (userChanged) {
      currentUser.value = user
    }
  }, 500)
})

// toggle like for ONE recipe
const likeToggle = async (item) => {
  if (!checkIsLoggedIn()) {
    alert('Please login to like recipes')
    return
  }

  try {
    if (!item.liked) {
      // activate like and deactivate pass
      await setRecipePreference(item.IDRecipes, 'liked')
      item.liked = true
      item.passed = false
      preferences.value[item.IDRecipes] = 'liked'
    } else {
      // deactivate like
      await removeRecipePreference(item.IDRecipes)
      item.liked = false
      delete preferences.value[item.IDRecipes]
    }
  } catch (err) {
    console.error('Failed to update preference', err)
    alert('Failed to update preference')
  }
}

// toggle pass for ONE recipe
const passToggle = async (item) => {
  if (!checkIsLoggedIn()) {
    alert('Please login to pass recipes')
    return
  }

  try {
    if (!item.passed) {
      // activate pass and deactivate like
      await setRecipePreference(item.IDRecipes, 'passed')
      item.passed = true
      item.liked = false
      preferences.value[item.IDRecipes] = 'passed'
    } else {
      // deactivate pass
      await removeRecipePreference(item.IDRecipes)
      item.passed = false
      delete preferences.value[item.IDRecipes]
    }
  } catch (err) {
    console.error('Failed to update preference', err)
    alert('Failed to update preference')
  }
}

/* ---------- FILTRES / TRI (wireframe) ---------- */

const sortBy = ref('time') // 'time' | 'liked' | 'cost'

const sortedRecipes = computed(() => {
  const list = Array.isArray(recipes) ? recipes : recipes.value
  if (!list || list.length === 0) return []

  const arr = [...list]

  if (sortBy.value === 'liked') {
    return arr.sort((a, b) => ((b.liked || false) ? 1 : 0) - ((a.liked || false) ? 1 : 0))
  }

  if (sortBy.value === 'time') {
    // tri grossier : concat PrepTime+CookTime (OK pour la démo)
    return arr.sort((a, b) =>
      ((a.PrepTime || '') + (a.CookTime || '')).localeCompare((b.PrepTime || '') + (b.CookTime || ''))
    )
  }

  // si un jour vous avez un champ "cost", on pourra trier dessus
  return arr
})


/* Use RecipeForm component to handle create/edit */
import RecipeForm from '@/components/RecipeForm.vue'

const showForm = ref(false)
const editingRecipe = ref(null)

// Check if current user can edit a recipe
const canEdit = (recipe) => {
  if (!currentUser.value) return false // Not logged in
  if (currentUser.value.role === 'admin') return true // Admin can edit everything
  if (!recipe.IDAcc) return false // No owner, not editable by regular users
  return currentUser.value.id === recipe.IDAcc // Owner can edit
}

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

const onSaved = async ({ action, recipe }) => {
  closeForm()
  // Reload recipes to get fresh IDAcc values from backend
  await loadRecipes()
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

onUnmounted(() => {
  if (authCheckInterval) clearInterval(authCheckInterval)
})
</script>

<template>
  <div class="recipes-page">
    <!-- BARRE DU HAUT (wireframe) -->
    <h1 class="page-title">Recipes</h1>

    <div class="recipes-toolbar">
      <div class="recipes-filters">
        <button class="filter-pill" :class="{ active: sortBy === 'time' }" @click="sortBy = 'time'">
          Time
        </button>
        <button class="filter-pill" :class="{ active: sortBy === 'liked' }" @click="sortBy = 'liked'">
          Liked
        </button>
        <button class="filter-pill" :class="{ active: sortBy === 'cost' }" @click="sortBy = 'cost'">
          Cost
        </button>
        <button class="filter-pill disabled">...</button>
      </div>

      <button v-if="currentUser" class="add-btn" @click="openForm">
        Add recipe
      </button>
    </div>

    <!-- POPUP FORM -->
    <RecipeForm v-if="showForm" :initialRecipe="editingRecipe" @saved="onSaved" @close="closeForm" />

    <!-- MODAL PLANIFICATION --><!-- MODAL : ajout au planning -->
    <div v-if="showPlanModal" class="modal-backdrop">
      <div class="card card-plan">
        <h3>Add "{{ selectedRecipeForPlanning?.Title }}" to your planning</h3>

        <label>
          Date:
          <input type="date" v-model="selectedMealDate" />
        </label>

        <label>
          Meal:
          <select v-model="selectedMealType">
            <option v-for="t in mealTypes" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>
        </label>

        <p v-if="planningError" class="error">{{ planningError }}</p>

        <div class="actions">
          <button type="button" @click="closePlanningModal">Cancel</button>
          <button type="button" @click="savePlanning" :disabled="isSavingPlanning">
            {{ isSavingPlanning ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- CARTES (wireframe + tes images) -->
    <div class="grid">
      <div class="card" :class="{ passed: r.passed, liked: r.liked }" v-for="r in sortedRecipes"
        :key="r.IDRecipes">
        <div class="card-header">
          <button @click="passToggle(r)" :class="{ active: r.passed }">
            x
          </button>

          <h3>{{ r.Title }}</h3>

          <button @click="likeToggle(r)" :class="{ active: r.liked }">
            ♡
          </button>
        </div>
        <!-- use illustration URL from backend /uploads, fallback to logo on error -->
        <img :src="getRecipeImageUrl(r)" :alt="r.Title" @error="(e) => e.target.src = require('@/assets/MPlogo.png')"/>

        <p><strong>Preparation time:</strong> {{ r.PrepTime }}</p>
        <p><strong>Cooking time:</strong> {{ r.CookTime }}</p>
        <p><strong>Difficulty:</strong> {{ r.Difficulty }}</p>

        <!-- Action buttons -->
        <div v-if="currentUser || canEdit(r)" class="CRUD">
          <!-- Planning button for all logged-in users -->
          <button v-if="currentUser" class="plan-btn" @click="openPlanningModal(r)">🗓️</button>

          <!-- Edit/Delete buttons only for owner or admin -->
          <button v-if="canEdit(r)" @click="deleteRecipe(r.IDRecipes)">🗑️</button>
          <button v-if="canEdit(r)" @click="openEditForm(r)">✏️</button>
        </div>
      </div>
    </div>
  </div>
</template>
