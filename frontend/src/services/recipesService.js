const API_URL = "http://localhost:3000/api/recipes";

export async function getRecipes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  const data = await res.json();
  if (Array.isArray(data)) return data.map(normalize);
  if (data && Array.isArray(data.value)) return data.value.map(normalize);
  return data;
}

export async function getRecipe(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch recipe');
  const data = await res.json();
  return normalize(data);
}

export async function createRecipe(recipe) {
  // avoid sending ImageUrl (blob URLs)
  const payload = { ...recipe };
  if (payload.ImageUrl !== undefined) delete payload.ImageUrl;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  const data = await res.json();
  // backend returns { id: insertId, ...recipe }
  return normalize({ IDRecipes: Number(data.id || data.IDRecipes), ...recipe, ...data });
}

export async function updateRecipe(id, recipe) {
  const payload = { ...recipe };
  if (payload.ImageUrl !== undefined) delete payload.ImageUrl;

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update recipe');
  const data = await res.json();
  return normalize({ IDRecipes: Number(data.id || id), ...recipe, ...data });
}

export async function deleteRecipe(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete recipe');
  return true;
}

function normalize(item) {
  if (!item || typeof item !== 'object') return item;
  const n = { ...item };
  if (n.IDRecipes != null) n.IDRecipes = Number(n.IDRecipes);
  if (n.Servings != null) n.Servings = Number(n.Servings);
  return n;
}

