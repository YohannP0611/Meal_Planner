<script setup>
import { inject } from 'vue'
const meals = inject('mealPlans')
</script>

<template>
  <div class="about">
    <h1>This is the meal page !</h1>
  </div>
  <ul>
    <li v-for="i in meals" :key="i.id">{{ i.mealType }}</li>
  </ul>
</template>
