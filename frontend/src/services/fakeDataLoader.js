// This file provides access to fake data for initial app setup
// The actual dataService with localStorage CRUD has been moved to fake/ folder

import ingredients from '@/services/fake/ingredients.json'
import recipes from '@/services/fake/recipes.json'
import mealsPlan from '@/services/fake/mealsPlan.json'

export const getAllIngredients = () => ingredients
export const getAllRecipes = () => recipes
export const getAllMealPlans = () => mealsPlan
