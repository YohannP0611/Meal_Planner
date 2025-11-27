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
        <!-- use dropped image if present, otherwise fallback to static -->
        <img :src="r.ImageUrl || getImage(r.Illustration)" :alt="r.Title" />
        <p><strong>Preparation time:</strong> {{ r.PrepTime }}</p>
        <p><strong>Cooking time:</strong> {{ r.CookTime }}</p>
        <p><strong>Difficulty:</strong> {{ r.Difficulty }}</p>
        </router-link>
      </div>
  </div>
</template>