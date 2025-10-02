import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../../types/productTypes";

const initialState: Product[] = [];

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorites: (state, action: PayloadAction<Product>) => {
      //Check if the product is not already favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      //Remove the product with the matching ID
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      // Set the favorite from loaclStorage
      return action.payload;
    },
  },
});

export const { addFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;
export const selectFavoriteProduct = (state: { favorites: Product[] }) =>
  state.favorites;
export default favoriteSlice.reducer;
