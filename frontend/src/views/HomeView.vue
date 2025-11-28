<script setup>
import { ref, onMounted, computed } from "vue";

const recipes = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/recipes");
    if (!res.ok) throw new Error("Failed to load recipes");
    recipes.value = await res.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// pour l’instant on fait des listes simples
const trending = computed(() => recipes.value.slice(0, 5));
const liked = computed(() => recipes.value.slice(2, 7));
const nextPlannedMeal = computed(() => recipes.value[0] || null);

function illustrationUrl(recipe) {
  return "https://source.unsplash.com/300x200/?food,meal";
}
</script>

<template>
  <div class="home-page">
    <div class="home-layout">
      <!-- colonne principale gauche -->
      <section class="home-main">
        <h2 class="home-section-title">Tendances</h2>

        <div class="thumb-row">
          <div
            v-for="r in trending"
            :key="'trend-' + r.IDRecipes"
            class="thumb-card"
          >
            <img :src="illustrationUrl(r)" :alt="r.Title" />
            <p class="thumb-caption">{{ r.Title }}</p>
          </div>
        </div>

        <h2 class="home-section-title second">Meal liked</h2>

        <div class="thumb-row">
          <div
            v-for="r in liked"
            :key="'liked-' + r.IDRecipes"
            class="thumb-card"
          >
            <img :src="illustrationUrl(r)" :alt="r.Title" />
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

      <!-- colonne droite : next planned meal -->
      <aside class="home-sidebar">
        <h2 class="sidebar-title">Next planned meal:</h2>

        <div v-if="nextPlannedMeal" class="next-meal-card">
          <p>Lunch for tomorrow: {{ nextPlannedMeal.Title }}</p>
          <img
            :src="illustrationUrl(nextPlannedMeal)"
            :alt="nextPlannedMeal.Title"
          />
          <a href="#" class="recipe-link">Link to the recipe</a>
        </div>

        <button class="shopping-btn">
          Prepare your shopping list
        </button>
      </aside>
    </div>
  </div>
</template>
