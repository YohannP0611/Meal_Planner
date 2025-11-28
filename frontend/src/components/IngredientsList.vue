<script setup>
import { ref, onMounted } from "vue";
import { getIngredients } from "@/services/ingredientsService";

const ingredients = ref([]);
const loading = ref(true);

const loadIngredients = async () => {
  loading.value = true;
  try {
    ingredients.value = await getIngredients();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadIngredients();
});

defineExpose({ loadIngredients });
</script>

<template>
  <div>
    <h2>Ingredients</h2>

    <div v-if="loading">Loading...</div>

    <ul v-else>
      <li v-for="ingredient in ingredients" :key="ingredient.IDIngredients">
        {{ ingredient.Name }} — {{ ingredient.Calories }} kcal
      </li>
    </ul>
  </div>
</template>
