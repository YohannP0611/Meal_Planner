import ingredients from '@/services/fake/ingredients.json'
import recipes from '@/services/fake/recipes.json'
import mealsPlan from '@/services/fake/mealsPlan.json'

export const getAllIngredients = () => ingredients
export const getAllRecipes = () => recipes
export const getAllMealPlans = () => mealsPlan

class DataService {

  constructor() {
    this.init("ingredients", ingredients)
    this.init("recipes", recipes)
    this.init("mealsPlan", mealsPlan)
  }

  // Load initial JSON into localStorage only once
  init(key, defaultValue) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
    }
  }

  // --- CRUD ---
  getAll(key) {
    return JSON.parse(localStorage.getItem(key))
  }

  getById(key, id) {
    const items = this.getAll(key)
    return items.find(item => item.id === id)
  }

  create(key, data) {
    const items = this.getAll(key)
    data.id = Date.now() // fake unique ID
    items.push(data)
    localStorage.setItem(key, JSON.stringify(items))
    return data
  }

  update(key, id, newData) {
    const items = this.getAll(key)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return
    items[index] = { ...items[index], ...newData }
    localStorage.setItem(key, JSON.stringify(items))
  }

  delete(key, id) {
    let items = this.getAll(key)
    items = items.filter(item => item.id !== id)
    localStorage.setItem(key, JSON.stringify(items))
  }
}

export default new DataService()
