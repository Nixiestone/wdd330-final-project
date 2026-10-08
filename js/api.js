const API_BASE =
  "https://www.themealdb.com/api/json/v1/1";

async function fetchAPI(endpoint) {
  const response = await fetch(`${API_BASE}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

async function searchRecipes(searchTerm = "chicken") {
  const data = await fetchAPI(
    `search.php?s=${encodeURIComponent(searchTerm)}`
  );

  return data.meals || [];
}

async function getRecipeById(recipeId) {
  const data = await fetchAPI(
    `lookup.php?i=${encodeURIComponent(recipeId)}`
  );

  return data.meals ? data.meals[0] : null;
}

async function getCategories() {
  const data = await fetchAPI("list.php?c=list");

  return data.meals || [];
}

async function getRecipesByCategory(category) {
  const data = await fetchAPI(
    `filter.php?c=${encodeURIComponent(category)}`
  );

  return data.meals || [];
}

export {
  searchRecipes,
  getRecipeById,
  getCategories,
  getRecipesByCategory,
};