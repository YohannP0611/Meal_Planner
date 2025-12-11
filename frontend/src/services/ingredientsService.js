import { getToken } from './authService';

const API_URL = "http://localhost:3000/api/ingredients";

// GET all ingredients
export async function getIngredients() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  const data = await res.json();
  // normalize numeric fields (mysql returns DECIMAL as strings)
  if (Array.isArray(data)) return data.map(normalize);
  // some environments/tools may wrap arrays; try to handle common wrappers
  if (data && Array.isArray(data.value)) return data.value.map(normalize);
  return data;
}

// GET one ingredient by id
export async function getIngredient(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch ingredient");
  const data = await res.json();
  return normalize(data);
}

// POST (create) an ingredient
export async function createIngredient(ingredient) {
  // ingredient should have keys matching your backend / DB
  // e.g. { Name: "...", Calories: 123, ... }
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(ingredient),
  });

  if (!res.ok) throw new Error("Failed to create ingredient");
  return await res.json();
}

// PUT (update) an ingredient
export async function updateIngredient(id, ingredient) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(ingredient),
  });

  if (!res.ok) throw new Error("Failed to update ingredient");
  const data = await res.json();
  return normalize(data);
}

function normalize(item) {
  if (!item || typeof item !== 'object') return item;
  const n = { ...item };
  if (n.Calories != null) n.Calories = Number(n.Calories);
  ['Fat','Carbs','Fibers','Protein','Salt','Sugar'].forEach(k => {
    if (n[k] != null) n[k] = parseFloat(n[k]);
  });
  return n;
}

// DELETE an ingredient
export async function deleteIngredient(id) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error("Failed to delete ingredient");
  return res.ok;
}
