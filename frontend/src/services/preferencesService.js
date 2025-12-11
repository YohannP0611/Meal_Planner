import { getToken } from './authService';

const API_URL = "http://localhost:3000/api/preferences";

// Helper to get auth headers
function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

// ============ RECIPE PREFERENCES ============

// Get all recipe preferences for current user
export async function getRecipePreferences() {
  const res = await fetch(`${API_URL}/recipes`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch recipe preferences");
  return await res.json();
}

// Set recipe preference (liked or passed)
export async function setRecipePreference(recipeId, status) {
  const res = await fetch(`${API_URL}/recipes/${recipeId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to set recipe preference");
  return await res.json();
}

// Remove recipe preference
export async function removeRecipePreference(recipeId) {
  const res = await fetch(`${API_URL}/recipes/${recipeId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to remove recipe preference");
  return await res.json();
}

// ============ INGREDIENT PREFERENCES ============

// Get all ingredient preferences for current user
export async function getIngredientPreferences() {
  const res = await fetch(`${API_URL}/ingredients`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch ingredient preferences");
  return await res.json();
}

// Set ingredient preference (liked or passed)
export async function setIngredientPreference(ingredientId, status) {
  const res = await fetch(`${API_URL}/ingredients/${ingredientId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to set ingredient preference");
  return await res.json();
}

// Remove ingredient preference
export async function removeIngredientPreference(ingredientId) {
  const res = await fetch(`${API_URL}/ingredients/${ingredientId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to remove ingredient preference");
  return await res.json();
}
