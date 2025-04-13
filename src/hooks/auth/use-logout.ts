import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { USE_CURRENT_USER_QUERY_KEY } from "./use-current-user";
import { USE_ADMIN_QUERY_KEY } from "./use-admin";
import { useRef } from "react";
import Cookies from 'js-cookie';

// Hàm xóa tất cả dữ liệu xác thực
const clearAllAuthData = (queryClient: ReturnType<typeof useQueryClient>) => {
  // Xóa queries từ react-query cache
  queryClient.removeQueries({ queryKey: USE_CURRENT_USER_QUERY_KEY });
  queryClient.removeQueries({ queryKey: USE_ADMIN_QUERY_KEY });
  
  // Xóa access token từ localStorage
  localStorage.removeItem("access_token");
  
  // Xóa cookies
  Cookies.remove('refresh_token', { path: '/' });
  Cookies.remove('user-role', { path: '/' });
  
  // Xóa state từ zustand
  const logout = useAuthStore.getState().logout;
  logout();
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const isLoggingOutRef = useRef(false);

  const handleLogout = async () => {
    if (isLoggingOutRef.current) {
      return Promise.resolve({ status: "success", message: "Already logging out", data: null });
    }
    
    isLoggingOutRef.current = true;
    
    try {
      return await authService.logout();
    } catch (error) {
      clearAllAuthData(queryClient);
      isLoggingOutRef.current = false;
      return { status: "success", message: "Logged out (client-side only)", data: null };
    }
  };

  return useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      clearAllAuthData(queryClient);
      isLoggingOutRef.current = false;
      router.push("/auth/login");
    },
    onError: () => {
      isLoggingOutRef.current = false;
    }
  });
};