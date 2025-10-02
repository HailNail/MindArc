import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ShopState } from "../../../types/shopTypes";
import { type Product } from "../../../types/productTypes";
import type { Category } from "../../../types/categoryTypes";

const initialState: ShopState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  brandCheckboxes: {},
  checkBrands: [],
  selectedBrand: undefined,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload;
    },
    setRadio: (state, action: PayloadAction<string[]>) => {
      state.radio = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string | undefined>) => {
      state.selectedBrand = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
} = shopSlice.actions;
export default shopSlice.reducer;
