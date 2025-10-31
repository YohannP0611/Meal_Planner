<script setup>
import { inject } from 'vue'
const ingredients = inject('ingredients')
</script>

<template>
  <div class="about">
    <h1>This is the ingredients page !</h1>
  </div>
  <div>
      <h2> Ingredients : </h2>
      <ul>
          <li v-for="i in ingredients" :key="i.id">{{ i.name }}</li>
      </ul>
  </div>
</template>
