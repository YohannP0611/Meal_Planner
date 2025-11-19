<!-- <script setup>
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