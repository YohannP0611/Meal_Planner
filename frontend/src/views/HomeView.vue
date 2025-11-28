<script setup>
import { inject, ref } from 'vue'
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'


const recipes = inject('recipes', ref([]))
const getImage = (fileName) => {
  try {
    return require(`@/assets/${fileName}`)
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


</script>
<template>
  <div class="home">
    <HelloWorld msg="Welcome to Meal Planner !"/>
  </div>
  <div class="grid">
      <div class="card" v-for="r in recipes" :key="r.IDRecipes">
        <router-link to="/recipes" class="HomeLink">
        <div class="card-header">
          <h3>{{ r.Title }}</h3>
        </div>
        <!-- use illustration URL from backend /uploads, fallback to logo on error -->
        <img :src="getRecipeImageUrl(r)" :alt="r.Title" @error="(e) => e.target.src = require('@/assets/MPlogo.png')" />
        <p><strong>Preparation time:</strong> {{ r.PrepTime }}</p>
        <p><strong>Cooking time:</strong> {{ r.CookTime }}</p>
        <p><strong>Difficulty:</strong> {{ r.Difficulty }}</p>
        </router-link>
      </div>
  </div>
</template>