import {
  createRecipeCard,
  getFavorites,
} from "./recipes.js";

const favoritesGrid = document.querySelector("#favorites-grid");
const favoritesStatus = document.querySelector("#favorites-status");

function showStatus(message) {
  if (favoritesStatus) {
    favoritesStatus.textContent = message;
    favoritesStatus.classList.remove("hidden");
  }
}

function hideStatus() {
  if (favoritesStatus) {
    favoritesStatus.textContent = "";
    favoritesStatus.classList.add("hidden");
  }
}

function displayFavorites() {
  const favorites = getFavorites();

  if (!favorites.length) {
    favoritesGrid.innerHTML = "";

    showStatus(
      "You haven't saved any favorite recipes yet. Go back to the home page and save some!"
    );

    return;
  }

  hideStatus();

  favoritesGrid.innerHTML = favorites
    .map((recipe) => createRecipeCard(recipe))
    .join("");
}

function removeFavorite(recipeId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (recipe) => recipe.idMeal !== recipeId
  );

  localStorage.setItem(
    "favoriteRecipes",
    JSON.stringify(updatedFavorites)
  );

  displayFavorites();
}

favoritesGrid?.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest(".favorite-button");

  if (favoriteButton) {
    const recipeId = favoriteButton.dataset.favoriteId;

    removeFavorite(recipeId);
    return;
  }

  const recipeButton = event.target.closest(".view-recipe");

  if (recipeButton) {
    const recipeId = recipeButton.dataset.id;

    window.location.href = `index.html?recipe=${recipeId}`;
  }
});

displayFavorites();