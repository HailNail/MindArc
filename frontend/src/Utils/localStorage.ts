import { type Product } from "../types/productTypes";

// Add a product to a localStorage
export const addFavoriteToLocalStorage = (product: Product): void => {
  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

//Remove a product from a localStorage
export const removeFavoriteFromLocalStorage = (productId: string): void => {
  const favorites = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter(
    (product) => product._id !== productId
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};

//Retrieve favorites from a localStorage
export const getFavoritesFromLocalStorage = (): Product[] => {
  const favoritesJSON = localStorage.getItem("favorites");
  try {
    return favoritesJSON ? (JSON.parse(favoritesJSON) as Product[]) : [];
  } catch (err) {
    console.error("Failed to parse favorites from localStorage", err);
    return [];
  }
};
