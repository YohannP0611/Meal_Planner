<script setup>
import { ref, onMounted, computed } from 'vue'
import { getRecipes, deleteRecipe as apiDeleteRecipe } from '@/services/recipesService'
import { addMealToPlanning } from '@/services/planningService'

const recipes = ref([])



// --------- ADD TO MEALS (planning) ---------
const currentUserId = 1

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
      accountId: currentUserId,
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
  if (action === 'create') {
    recipes.value.push(recipe)
  } else if (action === 'update') {
    const idx = recipes.value.findIndex(r => r.IDRecipes === recipe.IDRecipes)
    if (idx !== -1) recipes.value.splice(idx, 1, recipe)
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

      <button class="add-btn" @click="openForm">
        Add recipe
      </button>
    </div>

    <!-- POPUP FORM -->
    <RecipeForm v-if="showForm" :initialRecipe="editingRecipe" @saved="onSaved" @close="closeForm" />

    <!-- MODAL PLANIFICATION --><!-- MODAL : ajout au planning -->
    <div v-if="showPlanModal" class="modal-backdrop">
      <div class="modal">
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

        <div class="modal-actions">
          <button type="button" @click="closePlanningModal">Cancel</button>
          <button type="button" @click="savePlanning" :disabled="isSavingPlanning">
            {{ isSavingPlanning ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- CARTES (wireframe + tes images) -->
    <div class="grid">
      <div class="card recipe-card":class="{ passed: r.passed }" v-for="r in sortedRecipes" :key="r.IDRecipes">
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

        <button class="plan-btn" @click="openPlanningModal(r)">
          Add to my meals
        </button>
      </div>
    </div>
  </div>
</template>
