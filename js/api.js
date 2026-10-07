const API_BASE = "https://www.themealdb.com/api/json/v1/1";

/**
 * Search for recipes by name.
 * @param {string} searchTerm
 * @returns {Promise<Array>}
 */
export async function searchRecipes(searchTerm = "") {
  const url = `${API_BASE}/search.php?s=${encodeURIComponent(searchTerm)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to connect to the recipe service.");
  }

  const data = await response.json();

  return data.meals || [];
}


/**
 * Get one recipe by its ID.
 * @param {string} recipeId
 * @returns {Promise<Object|null>}
 */
export async function getRecipeById(recipeId) {
  const url = `${API_BASE}/lookup.php?i=${encodeURIComponent(recipeId)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load the recipe.");
  }

  const data = await response.json();

  return data.meals ? data.meals[0] : null;
}


/**
 * Get all available recipe categories.
 * This will be used in Milestone 2.
 * @returns {Promise<Array>}
 */
export async function getCategories() {
  const url = `${API_BASE}/list.php?c=list`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load recipe categories.");
  }

  const data = await response.json();

  return data.meals || [];
}


/**
 * Get recipes belonging to a category.
 * This will be used in Milestone 2.
 * @param {string} category
 * @returns {Promise<Array>}
 */
export async function getRecipesByCategory(category) {
  const url = `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load recipes for this category.");
  }

  const data = await response.json();

  return data.meals || [];
}