import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo } from "../../../types/userTypes";

interface Initial {
  userInfo: UserInfo | null;
}

const userInfoString = localStorage.getItem("userInfo");
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
const initialState: Initial = {
  userInfo,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", expirationTime.toString());
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
