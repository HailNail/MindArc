import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cart";
import type { CartItem, CartState } from "../../../types/cartTypes";

const cartFromStorage = localStorage.getItem("cart")
  ? (JSON.parse(localStorage.getItem("cart") as string) as CartState)
  : null;

const initialState: CartState = cartFromStorage || {
  cartItems: [],
  shippingAddress: {
    address: "",
    city: "",
    postalCode: "",
    country: "",
  },
  paymentMethod: "Stripe",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id
            ? { ...x, quantity: x.quantity + item.quantity }
            : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (
      state,
      action: PayloadAction<CartState["shippingAddress"]>
    ) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
