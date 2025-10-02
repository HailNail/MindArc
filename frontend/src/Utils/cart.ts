import type { CartState } from "../types/cartTypes";

export const addDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const updateCart = (state: CartState): CartState => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0.15 : 3);

  state.taxPrice = addDecimals(0.15 * Number(state.itemsPrice));

  state.totalPrice = state.itemsPrice + state.shippingPrice + state.taxPrice;

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
