import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState, AppDispatch, ApiError } from "../redux/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type CustomFetchError = Omit<FetchBaseQueryError, "data"> & {
  data: ApiError;
};
