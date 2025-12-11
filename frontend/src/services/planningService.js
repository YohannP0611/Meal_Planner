const BASE_URL = "http://localhost:3000/api";

export async function addMealToPlanning({ accountId, recipeId, dateMeal, mealType }) {
  const res = await fetch(`${BASE_URL}/connects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      AccountIDAcc: accountId,
      RecipesIDRecipes: recipeId,
      DateMeal: dateMeal, // format YYYY-MM-DD from <input type="date">
      MealType: mealType,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("addMealToPlanning error:", errBody); // debug log
    throw new Error("Failed to add meal to planning");
  }

  return await res.json();
}

export async function getMealsByDate({ accountId, dateMeal }) {
  const url = new URL(`${BASE_URL}/meals`);
  url.searchParams.set("accountId", accountId);
  url.searchParams.set("dateMeal", dateMeal);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("getMealsByDate error:", errBody); // debug log
    throw new Error("Failed to load meals");
  }

  return await res.json();
}

export async function removeMealFromPlanning({ accountId, recipeId, dateMeal, mealType }) {
  const res = await fetch(`${BASE_URL}/connects`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      AccountIDAcc: accountId,
      RecipesIDRecipes: recipeId,
      DateMeal: dateMeal,
      MealType: mealType,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("removeMealFromPlanning error:", errBody); // debug log
    throw new Error("Failed to remove meal from planning");
  }

  return await res.json();
}
