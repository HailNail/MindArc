import type {
  StripeTotalSales,
  StripeSalesByDate,
} from "../../types/stripeTypes";
import { apiSlice } from "./apiSlice";

export const stripeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStripeTotalSales: builder.query<StripeTotalSales, void>({
      query: () => ({
        url: "/api/stripe/sales",
      }),
    }),
    getStripeSalesByDate: builder.query<StripeSalesByDate[], void>({
      query: () => "/api/stripe/sales-by-date",
    }),
  }),
});

export const { useGetStripeTotalSalesQuery, useGetStripeSalesByDateQuery } =
  stripeApiSlice;
