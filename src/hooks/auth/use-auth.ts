import { useAuthStore } from "@/store/use-auth-store";
import { useCurrentUser } from "./use-current-user";
import { useLogout } from "./use-logout";
import { useMemo } from "react";

export const useAuth = () => {
  // Lấy state từ zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  
  // Lấy các hook queries
  const { isLoading: isUserLoading, error: userError, refreshUser } = useCurrentUser();
  const { mutate: logoutMutation, isPending: isLoggingOut } = useLogout();
  
  // Sử dụng useMemo để cache kết quả
  const authData = useMemo(() => ({
    isAuthenticated,
    user,
    isLoading: isUserLoading || !isAuthInitialized,
    isAuthInitialized,
    isLoggingOut,
    error: userError,
    isAdmin: user?.role === "admin",
    refreshUser,
    logout: logoutMutation,
  }), [
    isAuthenticated, 
    user, 
    isUserLoading, 
    isAuthInitialized,
    isLoggingOut,
    userError, 
    refreshUser,
    logoutMutation
  ]);
  
  return authData;
};

// Xuất type để sử dụng ở nơi khác
export type UseAuthReturn = ReturnType<typeof useAuth>;

// Hook sử dụng:
// const { isAuthenticated, user, isLoading, isAdmin, logout } = useAuth();
// if (isLoading) return <Loading />;
// if (!isAuthenticated) return <Navigate to="/login" />;