<script setup>
import { inject, ref } from 'vue'

// Safely get ingredients from parent, or fall back to an empty array
const ingredients = inject('ingredients', ref([]))

const getImage = (name) => {
  try {
    // @ points to /src, so this is src/assets/<Name>.jpg
    return require(`@/assets/${name}.jpg`)
  } catch (e) {
    // fallback image if file not found
    return require('@/assets/MPlogo.png')   // or some default.png
  }
}

// toggle like for ONE ingredient
const likeToggle = (item) => {
  item.liked = !item.liked
} 

// toggle pass for ONE ingredient
const passToggle = (item) => {
  item.passed = !item.passed
}

/* ---------- POPUP FORM STATE ---------- */

const showForm = ref(false)
const form = ref({
  Name: '',
  Calories: 0,
  Carbs: 0,
  Protein: 0
})
const editingId = ref(null)
// open popup
const openForm = () => {
  form.value = {
    Name: '',
    Calories: 0,
    Carbs: 0,
    Protein: 0
  }
  editingId.value = null
  showForm.value = true
}

const openEditForm = (ingredient) => {
  form.value = {
    Name: ingredient.Name,
    Calories: ingredient.Calories,
    Carbs: ingredient.Carbs,
    Protein: ingredient.Protein
  }
  editingId.value = ingredient.IDIngredients   // 👈 edit mode for this ID
  showForm.value = true
}

// close popup
const closeForm = () => {
  showForm.value = false
}

const submitForm = () => {
  if (!form.value.Name) {
    alert('Name is required')
    return
  }

  if (editingId.value === null) {
    // CREATE
    const newIngredient = {
      IDIngredients: Date.now(),  // simple fake ID
      ...form.value
    }

    if (Array.isArray(ingredients)) {
      ingredients.push(newIngredient)
    } else if (Array.isArray(ingredients?.value)) {
      ingredients.value.push(newIngredient)
    }
  } else {
    // UPDATE
    if (Array.isArray(ingredients)) {
      const ing = ingredients.find(i => i.IDIngredients === editingId.value)
      if (ing) Object.assign(ing, form.value)
    } else if (Array.isArray(ingredients?.value)) {
      const ing = ingredients.value.find(i => i.IDIngredients === editingId.value)
      if (ing) Object.assign(ing, form.value)
    }
  }

  showForm.value = false
  editingId.value = null
}
const deleteIngredient = (id) => {
  if (!confirm("Delete this ingredient?")) return

  if (Array.isArray(ingredients)) {
    const index = ingredients.findIndex(i => i.IDIngredients === id)
    if (index !== -1) ingredients.splice(index, 1)
  } else {
    ingredients.value = ingredients.value.filter(i => i.IDIngredients !== id)
  }
}
</script>

<template>
  <!-- single root wrapper to avoid any internal Vue "flags" crash -->
  <div>
    <div class="about">
      <button @click="openForm">Add ingredient</button>
    </div>
    
    <!-- POPUP FORM -->
    <div v-if="showForm" class="card">
      <div class="modal">
        <h2>Add ingredient</h2>

        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>Name</label>
            <input v-model="form.Name" required />
          </div>

          <div class="form-row">
            <label>Calories</label>
            <input v-model.number="form.Calories" type="number" min="0" />
          </div>

          <div class="form-row">
            <label>Carbs</label>
            <input v-model.number="form.Carbs" type="number" min="0" />
          </div>

          <div class="form-row">
            <label>Protein</label>
            <input v-model.number="form.Protein" type="number" min="0" />
          </div>

          <div class="actions">
            <button type="submit">Save</button>
            <button type="button" @click="closeForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="grid">
      <div class="card" v-for="i in ingredients" :key="i.IDIngredients">
        <div class="card-header">
          <button 
            @click="passToggle(i)"
            :class="{ active: i.passed }"
          >
            x
          </button>

          <h3>{{ i.Name }}</h3>

          <button 
            @click="likeToggle(i)" 
            :class="{ active: i.liked }"
          >
            ♡
          </button>
        </div>
        <img :src="getImage(i.Name)" :alt="i.Name" />
        <p><strong>Calories:</strong> {{ i.Calories }} kcal</p>
        <p><strong>Carbs:</strong> {{ i.Carbs }} g</p>
        <p><strong>Protein:</strong> {{ i.Protein }} g</p>
        <div class="CRUD">
          <button @click="deleteIngredient(i.IDIngredients)">🗑️</button>
          <button @click="openEditForm(i)">✏️</button>
        </div>
      </div>
    </div>
  </div>
</template> -->
<script setup>
import IngredientsList from "@/components/IngredientsList.vue";
import IngredientForm from "@/components/IngredientForm.vue";
</script>

<template>
  <div>
    <h1>Ingredients Manager</h1>
    <IngredientForm />
    <IngredientsList />
  </div>
</template>