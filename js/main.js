import {
  searchRecipes,
  getRecipeById,
  getCategories,
  getRecipesByCategory,
} from "./api.js";

import {
  createRecipeCard,
  createRecipeDetails,
  getFavorites,
  isFavorite,
} from "./recipes.js";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const resultsTitle = document.querySelector("#results-title");
const statusMessage = document.querySelector("#status-message");
const recipeGrid = document.querySelector("#recipe-grid");

const recipeDetails = document.querySelector("#recipe-details");
const detailsContent = document.querySelector("#details-content");
const closeDetailsButton = document.querySelector("#close-details");

const categoryContainer = document.querySelector("#category-container");

function showStatus(message) {
  if (statusMessage) {
    statusMessage.textContent = message;
    statusMessage.classList.remove("hidden");
  }
}

function hideStatus() {
  if (statusMessage) {
    statusMessage.textContent = "";
    statusMessage.classList.add("hidden");
  }
}

function displayRecipes(recipes) {
  if (!recipeGrid) return;

  if (!recipes || recipes.length === 0) {
    recipeGrid.innerHTML = "";
    showStatus("No recipes found. Try another search.");
    return;
  }

  hideStatus();

  recipeGrid.innerHTML = recipes
    .map((recipe) => createRecipeCard(recipe))
    .join("");
}

async function loadRecipes(searchTerm = "chicken") {
  showStatus("Loading recipes...");

  try {
    const recipes = await searchRecipes(searchTerm);

    if (resultsTitle) {
      resultsTitle.textContent = searchTerm
        ? `Results for "${searchTerm}"`
        : "Popular Recipes";
    }

    displayRecipes(recipes);
  } catch (error) {
    console.error("Error loading recipes:", error);
    showStatus(
      "Sorry, we couldn't load the recipes. Please check your connection and try again."
    );
  }
}

async function openRecipeDetails(recipeId) {
  try {
    if (detailsContent) {
      detailsContent.innerHTML = "<p>Loading recipe...</p>";
    }

    if (recipeDetails) {
      recipeDetails.classList.add("open");
    }

    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      detailsContent.innerHTML = "<p>Recipe not found.</p>";
      return;
    }

    detailsContent.innerHTML = createRecipeDetails(recipe);
  } catch (error) {
    console.error("Error loading recipe details:", error);

    if (detailsContent) {
      detailsContent.innerHTML =
        "<p>Unable to load this recipe. Please try again.</p>";
    }
  }
}

function closeRecipeDetails() {
  if (recipeDetails) {
    recipeDetails.classList.remove("open");
  }
}

function saveFavorite(recipe) {
  const favorites = getFavorites();

  const alreadyFavorite = favorites.some(
    (favorite) => favorite.idMeal === recipe.idMeal
  );

  if (!alreadyFavorite) {
    favorites.push(recipe);
    localStorage.setItem("favoriteRecipes", JSON.stringify(favorites));
  }
}

function removeFavorite(recipeId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (recipe) => recipe.idMeal !== recipeId
  );

  localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
}

async function toggleFavorite(recipeId) {
  try {
    const favorite = isFavorite(recipeId);

    if (favorite) {
      removeFavorite(recipeId);
    } else {
      const recipe = await getRecipeById(recipeId);

      if (recipe) {
        saveFavorite(recipe);
      }
    }

    refreshFavoriteButtons(recipeId);

    if (recipeDetails?.classList.contains("open")) {
      const recipe = await getRecipeById(recipeId);

      if (recipe) {
        detailsContent.innerHTML = createRecipeDetails(recipe);
      }
    }
  } catch (error) {
    console.error("Error updating favorite:", error);
  }
}

function refreshFavoriteButtons(recipeId) {
  const favorite = isFavorite(recipeId);

  const buttons = document.querySelectorAll(
    `[data-favorite-id="${recipeId}"]`
  );

  buttons.forEach((button) => {
    button.classList.toggle("is-favorite", favorite);

    button.textContent = favorite ? "♥" : "♡";

    button.setAttribute(
      "aria-label",
      favorite ? "Remove from favorites" : "Add to favorites"
    );

    button.setAttribute(
      "title",
      favorite ? "Remove from favorites" : "Add to favorites"
    );
  });
}

async function loadCategories() {
  if (!categoryContainer) return;

  try {
    const categories = await getCategories();

    categoryContainer.innerHTML = `
      <button
        class="category-button active"
        data-category="all"
        type="button"
      >
        All
      </button>
    `;

    categories.forEach((category) => {
      categoryContainer.insertAdjacentHTML(
        "beforeend",
        `
          <button
            class="category-button"
            data-category="${category.strCategory}"
            type="button"
          >
            ${category.strCategory}
          </button>
        `
      );
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

async function loadCategory(category) {
  if (category === "all") {
    await loadRecipes();
    return;
  }

  showStatus("Loading recipes...");

  try {
    const recipes = await getRecipesByCategory(category);

    if (resultsTitle) {
      resultsTitle.textContent = `${category} Recipes`;
    }

    displayRecipes(recipes);
  } catch (error) {
    console.error("Error loading category:", error);
    showStatus("Unable to load this category.");
  }
}

searchForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    await loadRecipes();
    return;
  }

  await loadRecipes(searchTerm);
});

recipeGrid?.addEventListener("click", async (event) => {
  const favoriteButton = event.target.closest(".favorite-button");

  if (favoriteButton) {
    event.stopPropagation();

    const recipeId = favoriteButton.dataset.favoriteId;

    await toggleFavorite(recipeId);
    return;
  }

  const recipeButton = event.target.closest(".view-recipe");

  if (recipeButton) {
    const recipeId = recipeButton.dataset.id;

    await openRecipeDetails(recipeId);
  }
});

categoryContainer?.addEventListener("click", async (event) => {
  const categoryButton = event.target.closest(".category-button");

  if (!categoryButton) return;

  document.querySelectorAll(".category-button").forEach((button) => {
    button.classList.remove("active");
  });

  categoryButton.classList.add("active");

  const category = categoryButton.dataset.category;

  await loadCategory(category);
});

detailsContent?.addEventListener("click", async (event) => {
  const favoriteButton = event.target.closest(".favorite-button");

  if (!favoriteButton) return;

  const recipeId = favoriteButton.dataset.favoriteId;

  await toggleFavorite(recipeId);
});

closeDetailsButton?.addEventListener("click", closeRecipeDetails);

recipeDetails?.addEventListener("click", (event) => {
  if (event.target === recipeDetails) {
    closeRecipeDetails();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRecipeDetails();
  }
});

loadCategories();
loadRecipes();