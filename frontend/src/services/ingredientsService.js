const API_URL = "http://localhost:3000/api/ingredients";

// GET all ingredients
export async function getIngredients() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return await res.json();
}

// GET one ingredient by id
export async function getIngredient(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch ingredient");
  return await res.json();
}

// POST (create) an ingredient
export async function createIngredient(ingredient) {
  // ingredient should have keys matching your backend / DB
  // e.g. { Name: "...", Calories: 123, ... }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  });

  if (!res.ok) throw new Error("Failed to create ingredient");
  return await res.json();
}
