// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "user";

const loadUserFromStorage = () => {
  try {
    if (typeof window === "undefined") return null;

    const rawUser = localStorage.getItem(STORAGE_KEY);
    if (!rawUser) return null;

    return JSON.parse(rawUser);
  } catch (error) {
    console.warn("Failed to load user from localStorage:", error);
    return null;
  }
};

const saveUserToStorage = (user) => {
  try {
    if (typeof window === "undefined") return;

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to save user to localStorage:", error);
  }
};

const initialState = {
  user: loadUserFromStorage(),
};

const authSlice = createSlice({
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

export const selectUser = (state) => state?.auth?.user ?? null;

export default authSlice.reducer;