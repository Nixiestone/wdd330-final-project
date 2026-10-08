function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
  } catch (error) {
    console.error("Could not read favorites:", error);
    return [];
  }
}

function isFavorite(recipeId) {
  const favorites = getFavorites();
  return favorites.some((recipe) => recipe.idMeal === recipeId);
}

function createRecipeCard(recipe) {
  const favorite = isFavorite(recipe.idMeal);

  return `
    <article class="recipe-card">
      <div class="recipe-image-wrapper">
        <img
          src="${recipe.strMealThumb}"
          alt="${recipe.strMeal}"
          class="recipe-image"
          loading="lazy"
        />

        <button
          class="favorite-button ${favorite ? "is-favorite" : ""}"
          data-favorite-id="${recipe.idMeal}"
          type="button"
          aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}"
          title="${favorite ? "Remove from favorites" : "Add to favorites"}"
        >
          ${favorite ? "♥" : "♡"}
        </button>
      </div>

      <div class="recipe-card-content">
        <p class="recipe-category">
          ${recipe.strCategory || "Recipe"}
        </p>

        <h3>${recipe.strMeal}</h3>

        <button
          class="view-recipe"
          data-id="${recipe.idMeal}"
          type="button"
        >
          View Recipe
        </button>
      </div>
    </article>
  `;
}

function createRecipeDetails(recipe) {
  const ingredients = getIngredients(recipe);
  const favorite = isFavorite(recipe.idMeal);

  return `
    <div class="recipe-details-inner">
      <img
        src="${recipe.strMealThumb}"
        alt="${recipe.strMeal}"
        class="details-image"
      />

      <div class="details-content">
        <div class="details-heading">
          <div>
            <p class="recipe-category">
              ${recipe.strCategory || "Recipe"}
              ${recipe.strArea ? ` • ${recipe.strArea}` : ""}
            </p>

            <h2>${recipe.strMeal}</h2>
          </div>

          <button
            class="favorite-button details-favorite ${
              favorite ? "is-favorite" : ""
            }"
            data-favorite-id="${recipe.idMeal}"
            type="button"
            aria-label="${
              favorite ? "Remove from favorites" : "Add to favorites"
            }"
            title="${
              favorite ? "Remove from favorites" : "Add to favorites"
            }"
          >
            ${favorite ? "♥" : "♡"}
          </button>
        </div>

        <h3>Ingredients</h3>

        <ul class="ingredients-list">
          ${ingredients
            .map(
              (ingredient) => `
                <li>
                  <strong>${ingredient.measure}</strong>
                  ${ingredient.name}
                </li>
              `
            )
            .join("")}
        </ul>

        <h3>Instructions</h3>

        <p class="instructions">
          ${recipe.strInstructions || "No instructions available."}
        </p>
      </div>
    </div>
  `;
}

function getIngredients(recipe) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const name = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }

  return ingredients;
}

export {
  createRecipeCard,
  createRecipeDetails,
  getFavorites,
  isFavorite,
};