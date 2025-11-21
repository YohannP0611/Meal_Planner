<script setup>
import { inject, ref } from 'vue'
const recipes = inject('recipes', ref([]))
const getImage = (fileName) => {
  try {
    // @ points to /src, so this is src/assets/<Name>.jpg
    return require(`@/assets/${fileName}`)
  } catch (e) {
    // fallback image if file not found
    return require('@/assets/MPlogo.png')   // or some default.png
  }
}
// toggle like for ONE ingredient
const likeToggle = (item) => {
  item.liked = !item.liked   // Vue 3 is fine with adding new props on the fly
}

// toggle pass for ONE ingredient
const passToggle = (item) => {
  item.passed = !item.passed
}
/* ---------- POPUP FORM STATE ---------- */

const showForm = ref(false)
const form = ref({
  Title: '',
  CookTime: "00:00:00",
  PrepTime: "00:00:00",
  Difficulty: "normal"
})

// open popup
const openForm = () => {
  form.value = {
    Title: '',
    CookTime: "00:00:00",
    PrepTime: "00:00:00",
    Difficulty: "normal"
  }
  showForm.value = true
}

// close popup
const closeForm = () => {
  showForm.value = false
}

// submit form
const submitForm = () => {
  if (!form.value.Title) {
    alert('Title is required')
    return
  }

  const newRecipe = {
    IDRecipes: Date.now(),
    ...form.value
  }

  recipes.value.push(newRecipe)

  closeForm()
}
</script>

<template>
  <!-- single root wrapper to avoid any internal Vue "flags" crash -->
  <div>
    <div class="about">
      <button @click="openForm">Add recipe</button>
    </div>
    
    <!-- POPUP FORM -->
    <div v-if="showForm" class="modal-backdrop">
      <div class="modal">
        <h2>Add recipe</h2>

        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>Title</label>
            <input v-model="form.Title" required/>
          </div>

          <div class="form-row">
            <label>Cooking time</label>
            <input v-model.number="form.CookTime" type="string"/>
          </div>

          <div class="form-row">
            <label>Preparation time</label>
            <input v-model.number="form.PrepTime" type="string"/>
          </div>

          <div class="form-row">
            <label>Difficulty</label>
            <input v-model.number="form.Difficulty"/>
          </div>

          <div class="actions">
            <button type="submit">Save</button>
            <button type="button" @click="closeForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="grid">
    <div class="card" v-for="r in recipes" :key="r.IDRecipes">
      <div class="card-header">
        <button 
          @click="passToggle(r)"
          :class="{ active: r.passed }"
        >
          x
        </button>

        <h3>{{ r.Title }}</h3>

        <button 
          @click="likeToggle(r)" 
          :class="{ active: r.liked }"
        >
          ♡
        </button>
      </div>
      <img :src="getImage(r.Illustration)" :alt="r.Illustration" />
      <p><strong>Preparation time:</strong> {{ r.PrepTime }}</p>
      <p><strong>Cooking time:</strong> {{ r.CookTime }}</p>
      <p><strong>Difficulty:</strong> {{ r.Difficulty }}</p>
    </div>
  </div>
</template>
