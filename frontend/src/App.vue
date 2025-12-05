<script setup>
import Logo from './assets/MPlogo.png'
import LoginPopup from '@/components/LoginPopup.vue'
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
      <img :src=Logo alt="MealPlanner Logo" id="BarLogo"/>
      <h1>Meal Planner</h1>
    </div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/meals">Meals</router-link> |
      <router-link to="/ingredients">Ingredients</router-link> |
      <router-link to="/recipes">Recipes</router-link> |
      <router-link to="/shops">Shops</router-link>
    </nav>
    <div id="TopRightLogin">
      <LoginPopup />
    </div>
  </div>
  <router-view/>
</template>

<style>
#TopRightLogin {
  position: absolute;
  right: 20px;
}
</style>
