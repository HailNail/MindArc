import type { UserInfo } from "./userTypes";

export interface OrderItem {
  _id: string; // product ID
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface StripePaymentResult {
  id: string;
  status: string;
  payment_method?: string;
  receipt_email?: string;
}

export interface Order {
  _id: string;
  user: UserInfo;
  orderItems: OrderItem[];
  pages: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

export interface StripeConfigResponse {
  publishableKey: string;
}

export interface PaymentIntentRequest {
  totalPrice: number;
}

export interface Pages {
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  pages: number;
}
