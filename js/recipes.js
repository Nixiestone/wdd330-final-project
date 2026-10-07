/**
 * Create a recipe card.
 * @param {Object} recipe
 * @returns {HTMLElement}
 */
export function createRecipeCard(recipe) {
  const article = document.createElement("article");

  article.className = "recipe-card";

  article.innerHTML = `
    <img
      class="recipe-card-image"
      src="${recipe.strMealThumb}"
      alt="${recipe.strMeal}"
      loading="lazy"
    >

    <div class="recipe-card-content">
      <p class="recipe-category">
        ${recipe.strCategory || "Recipe"}
      </p>

      <h3>${recipe.strMeal}</h3>

      <button
        type="button"
        class="view-recipe"
        data-recipe-id="${recipe.idMeal}"
      >
        View Recipe
      </button>
    </div>
  `;

  return article;
}


/**
 * Create the full recipe details view.
 * @param {Object} recipe
 * @returns {string}
 */
export function createRecipeDetails(recipe) {
  const ingredients = getIngredients(recipe);

  const ingredientsHtml = ingredients
    .map(
      (ingredient) =>
        `<li>${ingredient.measure} ${ingredient.name}</li>`
    )
    .join("");

  return `
    <div class="details-layout">
      <div>
        <img
          class="details-image"
          src="${recipe.strMealThumb}"
          alt="${recipe.strMeal}"
        >
      </div>

      <div class="details-content">
        <p class="details-category">
          ${recipe.strCategory || "Recipe"}
          ${recipe.strArea ? ` • ${recipe.strArea}` : ""}
        </p>

        <h2>${recipe.strMeal}</h2>

        <h3>Ingredients</h3>

        <ul class="ingredients-list">
          ${ingredientsHtml}
        </ul>

        <h3>Instructions</h3>

        <p class="instructions">
          ${recipe.strInstructions || "No instructions available."}
        </p>
      </div>
    </div>
  `;
}


/**
 * Extract ingredient and measurement pairs.
 * TheMealDB stores ingredients in fields 1-20.
 * @param {Object} recipe
 * @returns {Array}
 */
function getIngredients(recipe) {
  const ingredients = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = recipe[`strIngredient${index}`];
    const measure = recipe[`strMeasure${index}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : ""
      });
    }
  }

  return ingredients;
}