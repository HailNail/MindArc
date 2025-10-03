import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const BASE_URL_FALLBACK = import.meta.env.VITE_BASE_URL || "";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL_FALLBACK,
  prepareHeaders: (headers, { getState }) => {
    return headers;
  },

  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,

  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
