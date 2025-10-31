<script setup>
import { inject } from 'vue'
const recipes = inject('recipes')
</script>

<template>
  <div class="about">
    <h1>This is the recipe page !</h1>
  </div>
  <ul>
    <li v-for="i in recipes" :key="i.id">{{ i.title }}</li>
  </ul>
</template>
