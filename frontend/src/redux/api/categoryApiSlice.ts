import { apiSlice } from "./apiSlice";
import { CATEGORIES_URL } from "../constants";
import type { Category } from "../../types/categoryTypes";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: `${CATEGORIES_URL}`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { categoryId: string; updatedCategory: Partial<Category> }
    >({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<
      { message: string; name: string; id: string },
      string
    >({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    fetchCategories: builder.query<Category[], void>({
      query: () => ({
        url: `${CATEGORIES_URL}/categories`,
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;
