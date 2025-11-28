<script setup>
import { ref, onMounted } from "vue";
import { createIngredient, getIngredients } from "@/services/ingredientsService";

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

const emit = defineEmits(['ingredient-created']);

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

    // Emit event so parent can refresh the list
    emit('ingredient-created');
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
    <input v-model.number="ingredient.Calories" type="number" step="any" placeholder="Calories" />
    <input v-model.number="ingredient.Fat" type="number" step="any" placeholder="Fat" />
    <input v-model.number="ingredient.Carbs" type="number" step="any" placeholder="Carbs" />
    <input v-model.number="ingredient.Fibers" type="number" step="any" placeholder="Fibers" />
    <input v-model.number="ingredient.Protein" type="number" step="any" placeholder="Protein" />
    <input v-model.number="ingredient.Salt" type="number" step="any" placeholder="Salt" />
    <input v-model.number="ingredient.Sugar" type="number" step="any" placeholder="Sugar" />

    <button type="submit">Create Ingredient</button>
  </form>
</template>
