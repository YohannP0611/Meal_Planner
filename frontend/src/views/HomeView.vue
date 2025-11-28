<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const recipes = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/recipes")
    if (!res.ok) throw new Error("Failed to load recipes")
    recipes.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const trending = computed(() => recipes.value.slice(0, 5))
const liked = computed(() => recipes.value.slice(2, 7))
const nextPlannedMeal = computed(() => recipes.value[0] || null)

// Load local images matching recipe titles
const getImage = (title) => {
  try {
    return require(`@/assets/${title}.jpg`)
  } catch (e) {
    return require('@/assets/MPlogo.png')
  }
}

// Construct full URL for recipe images from backend /uploads
const getRecipeImageUrl = (recipe) => {
  if (!recipe.Illustration) return require('@/assets/MPlogo.png');
  // if it's already a full URL, use it as-is
  if (recipe.Illustration.startsWith('http')) {
    return recipe.Illustration;
  }
  // otherwise, it's a filename - serve from backend /uploads/
  return `http://localhost:3000/uploads/${recipe.Illustration}`;
}



// Navigation functions
const goToRecipe = () => {
  router.push("/recipes")
}

const goToShoppingList = () => {
  if (!nextPlannedMeal.value) return
  router.push(`/shopping-list/${nextPlannedMeal.value.IDRecipes}`)
}
</script>

<template>
  <div class="home-page">
    <div v-if="loading" class="status">Loading recipes...</div>
    <div v-else-if="error" class="status error">Error: {{ error }}</div>

    <div v-else class="home-layout">

      <!-- Left section -->
      <section class="home-main">
        <h2 class="home-section-title">Tendances</h2>
        <div class="thumb-row">
          <div v-for="r in trending" :key="'trend-' + r.IDRecipes" class="thumb-card">
            <img :src="getRecipeImageUrl(r)" :alt="r.Title" @error="(e) => e.target.src = require('@/assets/MPlogo.png')" />
            <p class="thumb-caption">{{ r.Title }}</p>
          </div>
        </div>

        <h2 class="home-section-title second">Meal liked</h2>
        <div class="thumb-row">
          <div v-for="r in liked" :key="'liked-' + r.IDRecipes" class="thumb-card">
            <img :src="getRecipeImageUrl(r)" :alt="r.Title" @error="(e) => e.target.src = require('@/assets/MPlogo.png')" />
            <p class="thumb-caption">{{ r.Title }}</p>
          </div>
        </div>

        <section class="about-block">
          <h2>About Us</h2>
          <p>
            MealPlanner helps you plan your meals for the week, discover new
            recipes and generate shopping lists automatically based on your
            selected dishes. You can filter recipes by difficulty, time or
            ingredients, and even see which shops sell the needed ingredients.
          </p>
        </section>
      </section>

      <!-- Right sidebar -->
      <aside class="home-sidebar">
        <h2 class="sidebar-title">Next planned meal:</h2>

        <div v-if="nextPlannedMeal" class="next-meal-card">
          <p>Lunch for tomorrow: {{ nextPlannedMeal.Title }}</p>
          <img :src="getRecipeImageUrl(nextPlannedMeal)" :alt="nextPlannedMeal.Title" @error="(e) => e.target.src = require('@/assets/MPlogo.png')" />
          <p><strong>Preparation time:</strong> {{ nextPlannedMeal.PrepTime }}</p>
          <p><strong>Cooking time:</strong> {{ nextPlannedMeal.CookTime }}</p>
          <p><strong>Difficulty:</strong> {{ nextPlannedMeal.Difficulty }}</p>
          <a href="" class="recipe-link" @click.prevent="goToRecipe">Link to the recipe</a>
        </div>

        <button class="shopping-btn" @click="goToShoppingList">
             Prepare your shopping list
        </button>
      </aside>

    </div>
  </div>
</template>
