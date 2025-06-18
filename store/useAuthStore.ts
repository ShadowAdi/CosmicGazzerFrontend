import { create } from "zustand";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import { AuthStore } from "@/types";
import { saveToken } from "@/utils/Token";

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  loading: false,

  setToken: (token: string) => {
    saveToken("token", token);
    set({ token });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  getUser: async () => {
    const { token } = get();
    if (!token) return;

    set({ loading: true });

    try {
      const res = await fetch(`${BACKEND_URL}auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const { success, userFound, message } = data;

      if (success && userFound) {
        set({ user: userFound, loading: false });
      } else {
        console.error("Failed to get user:", message);
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("Auth fetch failed:", error);
      set({ user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });

    try {
      const res = await fetch(`${BACKEND_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });


      const data = await res.json();
      console.log("data ",data)
      const { success, token, user } = data;

      if (success && token && user) {
        set({
          token,
          user: user,
          loading: false,
        });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        console.error("Login failed:",data);
        set({ loading: false });
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ loading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    delete axios.defaults.headers.common["Authorization"];
  },
}));
