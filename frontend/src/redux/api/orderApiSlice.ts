import { apiSlice } from "./apiSlice";
import { ORDERS_URL, STRIPE_URL } from "../constants";
import type {
  CreateOrderRequest,
  Order,
  Pages,
  PaginatedOrdersResponse,
  PaymentIntentRequest,
  PaymentIntentResponse,
  StripeConfigResponse,
  StripePaymentResult,
} from "../../types/orderTypes";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query<Order, string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation<
      Order,
      { orderId: string; details: StripePaymentResult }
    >({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getStripePublishableKey: builder.query<StripeConfigResponse, void>({
      query: () => ({
        url: STRIPE_URL,
      }),
    }),

    getMyOrders: builder.query<PaginatedOrdersResponse, Pages>({
      query: ({ pageNumber = 1, pageSize = 10 }) => ({
        url: `${ORDERS_URL}/mine?page=${pageNumber}&limit=${pageSize}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query<PaginatedOrdersResponse, Pages>({
      query: ({ pageNumber = 1, pageSize = 10 }) => ({
        url: `${ORDERS_URL}?page=${pageNumber}&limit=${pageSize}`,
      }),
    }),

    deliverOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query<{ totalOrders: number }, void>({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    createPaymentIntent: builder.mutation<
      PaymentIntentResponse,
      PaymentIntentRequest
    >({
      query: (data) => ({
        url: `${ORDERS_URL}/create-payment-intent`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetStripePublishableKeyQuery,
  useCreatePaymentIntentMutation,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
