
import ingredients from '@/services/fake/ingredients.json'
import recipes from '@/services/fake/recipes.json'
import mealsPlan from '@/services/fake/mealsPlan.json'

export const getAllIngredients = () => ingredients
export const getAllRecipes = () => recipes
export const getAllMealPlans = () => mealsPlan

import { onMounted } from 'vue'

onMounted(async () => {
  ingredients.value = await getAllIngredients()
  })
onMounted(async () => {
  recipes.value = await getAllRecipes()
  })
onMounted(async () => {
  items.meals = await getAllMealPlans()
  })  