import { create } from "zustand";
import { User } from "@/lib/api/types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  setUser: (user: User, access_token: string) => void;
  setAuthInitialized: (initialized: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthInitialized: false,
  setUser: (user, access_token) => {
    localStorage.setItem("access_token", access_token);

    set({
      user,
      isAuthenticated: true,
      isAuthInitialized: true,
    });
  },
  setAuthInitialized: (initialized) => {
    set({
      isAuthInitialized: initialized,
    });
  },
  logout: () => {
    // Xóa access token khỏi localStorage
    localStorage.removeItem("access_token");
    
    set({
      user: null,
      isAuthenticated: false,
      // Không reset isAuthInitialized để tránh flash không cần thiết
    });
  },
}));