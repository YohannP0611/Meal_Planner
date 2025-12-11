<script setup>
import Logo from './assets/MPlogo.png'
import { ref, provide } from 'vue'
import { getAllIngredients, getAllRecipes, getAllMealPlans } from '@/services/dataService'

const ingredients = ref(getAllIngredients())
const recipes = ref(getAllRecipes())
const mealPlans = ref(getAllMealPlans())

provide('ingredients', ingredients)
provide('recipes', recipes)
provide('mealPlans', mealPlans)
</script>

<template>
  <div id="HeaderContainer">
    <div id="TopLeftProject">
      <img :src="Logo" alt="MealPlanner Logo" id="BarLogo" />
      <h1>Meal Planner</h1>
    </div>

    <!-- center navigation -->
    <nav id="MainNav">
      <router-link to="/">Home</router-link>
      <span class="nav-separator">|</span>
      <router-link to="/meals">Meals</router-link>
      <span class="nav-separator">|</span>
      <router-link to="/ingredients">Ingredients</router-link>
      <span class="nav-separator">|</span>
      <router-link to="/recipes">Recipes</router-link>
      <span class="nav-separator">|</span>
      <router-link to="/shops">Shops</router-link>
    </nav>

    <!-- right side: sign in / log in -->
    <div id="AuthNav">
      <router-link to="/login" class="auth-link">
        <span class="account-icon">👤</span>
        <span>Sign in / Log in</span>
      </router-link>
    </div>
  </div>

  <router-view />
</template>

