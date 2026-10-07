import { searchRecipes, getRecipeById } from "./api.js";
import { createRecipeCard, createRecipeDetails } from "./recipes.js";

const recipeGrid = document.querySelector("#recipe-grid");
const statusMessage = document.querySelector("#status-message");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const resultsTitle = document.querySelector("#results-title");

const detailsSection = document.querySelector("#recipe-details");
const detailsContent = document.querySelector("#details-content");
const closeDetailsButton = document.querySelector("#close-details");


/**
 * Display a status message.
 * @param {string} message
 */
function showStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden");
}


/**
 * Hide the status message.
 */
function hideStatus() {
  statusMessage.classList.add("hidden");
}


/**
 * Display recipes in the recipe grid.
 * @param {Array} recipes
 */
function displayRecipes(recipes) {
  recipeGrid.innerHTML = "";

  if (!recipes.length) {
    showStatus("No recipes found. Try searching for something else.");
    return;
  }

  hideStatus();

  recipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    recipeGrid.appendChild(card);
  });
}


/**
 * Load recipes from the API.
 * @param {string} searchTerm
 */
async function loadRecipes(searchTerm = "") {
  showStatus("Loading recipes...");
  recipeGrid.innerHTML = "";

  try {
    const recipes = await searchRecipes(searchTerm);

    displayRecipes(recipes);

    if (searchTerm) {
      resultsTitle.textContent = `Results for "${searchTerm}"`;
    } else {
      resultsTitle.textContent = "Popular Recipes";
    }
  } catch (error) {
    console.error(error);

    showStatus(
      "Sorry, we couldn't load the recipes. Please check your internet connection and try again."
    );
  }
}


/**
 * Open the recipe details modal.
 * @param {string} recipeId
 */
async function openRecipeDetails(recipeId) {
  detailsContent.innerHTML = "<p>Loading recipe...</p>";

  detailsSection.classList.remove("hidden");
  detailsSection.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  try {
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      detailsContent.innerHTML = `
        <p>Sorry, this recipe could not be found.</p>
      `;

      return;
    }

    detailsContent.innerHTML = createRecipeDetails(recipe);
  } catch (error) {
    console.error(error);

    detailsContent.innerHTML = `
      <p>Sorry, we couldn't load this recipe. Please try again.</p>
    `;
  }
}


/**
 * Close recipe details.
 */
function closeRecipeDetails() {
  detailsSection.classList.add("hidden");
  detailsSection.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}


/**
 * Handle recipe card clicks.
 */
recipeGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".view-recipe");

  if (!button) {
    return;
  }

  const recipeId = button.dataset.recipeId;

  openRecipeDetails(recipeId);
});


/**
 * Handle recipe search.
 */
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  loadRecipes(searchTerm);
});


/**
 * Close details with the close button.
 */
closeDetailsButton.addEventListener("click", closeRecipeDetails);


/**
 * Close details when clicking the dark background.
 */
detailsSection.addEventListener("click", (event) => {
  if (event.target === detailsSection) {
    closeRecipeDetails();
  }
});


/**
 * Close details with the Escape key.
 */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRecipeDetails();
  }
});


/**
 * Initial page load.
 */
loadRecipes();