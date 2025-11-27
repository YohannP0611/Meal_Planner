const API_URL = "http://localhost:3000/api/recipes";

export async function getRecipes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return await res.json();
}

export async function createRecipe(recipe) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });

  if (!res.ok) throw new Error("Failed to create recipe");
  return await res.json();
}
