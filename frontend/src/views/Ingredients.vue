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

// open popup
const openForm = () => {
  form.value = {
    Name: '',
    Calories: 0,
    Carbs: 0,
    Protein: 0
  }
  showForm.value = true
}

// close popup
const closeForm = () => {
  showForm.value = false
}

// submit form
const submitForm = () => {
  if (!form.value.Name) {
    alert('Name is required')
    return
  }

  const newIngredient = {
    IDIngredients: Date.now(),  // simple fake ID
    ...form.value
  }

  // ingredients can be a ref or a plain array depending on how parent provided it
  if (Array.isArray(ingredients)) {
    ingredients.push(newIngredient)
  } else if (Array.isArray(ingredients?.value)) {
    ingredients.value.push(newIngredient)
  }

  closeForm()
}
</script>

<template>
  <!-- single root wrapper to avoid any internal Vue "flags" crash -->
  <div>
    <div class="about">
      <button @click="openForm">Add ingredient</button>
    </div>
    
    <!-- POPUP FORM -->
    <div v-if="showForm" class="modal-backdrop">
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
      </div>
    </div>
  </div>
</template>
