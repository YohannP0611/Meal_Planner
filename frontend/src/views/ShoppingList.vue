<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const items = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const id = route.params.id; // recipe id from /shopping-list/:id

  try {
    const res = await fetch(
      `http://localhost:3000/api/recipes/${id}/shopping-list`
    );
    if (!res.ok) throw new Error("Failed to load shopping list");
    items.value = await res.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.push({ name: "home" }); // or { name: "recipes" } if you prefer
};
</script>

<template>
  <div class="shopping-page">
    <h1>Shopping list</h1>

    <div v-if="loading">Loading…</div>
    <div v-else-if="error">Error: {{ error }}</div>

    <div v-else>
      <p v-if="items.length === 0">
        No ingredients needed for this recipe.
      </p>

      <table v-else class="shopping-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Quantity</th>
            <th>Calories</th>
            <th>Protein (g)</th>
            <th>Carbs (g)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in items" :key="i.IDIngredients">
            <td>{{ i.Name }}</td>
            <td>{{ i.Quantity }} {{ i.Unit }}</td>
            <td>{{ i.Calories }}</td>
            <td>{{ i.Protein }}</td>
            <td>{{ i.Carbs }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="back-btn" @click="goBack">
      Back to home
    </button>
  </div>
</template>

<style scoped>
.shopping-page {
  padding: 2rem 4rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.shopping-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0 2rem;
}

.shopping-table th,
.shopping-table td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.shopping-table th {
  background: #f5f5f5;
}

.back-btn {
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  border: 2px solid #000;
  background: #ffa346;
  cursor: pointer;
}
</style>
