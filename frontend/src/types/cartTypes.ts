export interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  countInStock: number;
  brand: string;
}

//main cart state
export interface CartState {
  cartItems: CartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}
