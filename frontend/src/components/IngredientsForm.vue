<script setup>
import { ref } from "vue";
import { createIngredient } from "@/services/ingredientsService";

const ingredient = ref({
  Name: "",
  Properties: "",
  Calories: null,
  Fat: null,
  Carbs: null,
  Fibers: null,
  Protein: null,
  Salt: null,
  Sugar: null,
});

async function submitForm() {
  try {
    const created = await createIngredient(ingredient.value);
    console.log("Created ingredient:", created);

    // Reset form
    ingredient.value = {
      Name: "",
      Properties: "",
      Calories: null,
      Fat: null,
      Carbs: null,
      Fibers: null,
      Protein: null,
      Salt: null,
      Sugar: null,
    };
  } catch (err) {
    console.error("Error:", err);
  }
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <h2>Add Ingredient</h2>

    <input v-model="ingredient.Name" placeholder="Name" />
    <input v-model="ingredient.Properties" placeholder="Properties" />
    <input v-model.number="ingredient.Calories" type="number" placeholder="Calories" />
    <input v-model.number="ingredient.Fat" type="number" placeholder="Fat" />
    <input v-model.number="ingredient.Carbs" type="number" placeholder="Carbs" />
    <input v-model.number="ingredient.Fibers" type="number" placeholder="Fibers" />
    <input v-model.number="ingredient.Protein" type="number" placeholder="Protein" />
    <input v-model.number="ingredient.Salt" type="number" placeholder="Salt" />
    <input v-model.number="ingredient.Sugar" type="number" placeholder="Sugar" />

    <button type="submit">Create Ingredient</button>
  </form>
</template>
