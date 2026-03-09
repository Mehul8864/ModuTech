// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadUserFromStorage = () => {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Failed to load user from localStorage:", err);
    return null;
  }
};

const saveUserToStorage = (user) => {
  try {
    if (typeof window === "undefined") return;
    if (user === null) {
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (err) {
    console.warn("Failed to save user to localStorage:", err);
  }
};

const initialState = {
  user: loadUserFromStorage(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      saveUserToStorage(action.payload);
    },
    clearUser: (state) => {
      state.user = null;
      saveUserToStorage(null);
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

/**
 * Safe selector for user - returns null if auth slice or user is missing.
 * Usage: useSelector(selectUser)
 */
export const selectUser = (state) => state?.auth?.user ?? null;

export default authSlice.reducer;