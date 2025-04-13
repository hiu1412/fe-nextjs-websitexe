import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { useAuthStore } from "@/store/use-auth-store";
import { useMemo } from "react";

export const USE_CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export const useCurrentUser = (options?: { skipCache?: boolean }) => {
  const queryClient = useQueryClient();
  // Lấy trực tiếp các hàm và state từ store
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  
  // Kiểm tra token từ localStorage một lần
  const hasToken = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem("access_token");
  }, []);

  // Memoize kết quả của điều kiện enabled để tránh tính toán lại
  const isQueryEnabled = useMemo(() => {
    // Chỉ fetch khi cần bỏ qua cache hoặc chưa có user
    return options?.skipCache || (hasToken && !user && isAuthInitialized);
  }, [hasToken, user, isAuthInitialized, options?.skipCache]);

  const query = useQuery({
    queryKey: USE_CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await authService.getMe();
        return response.data;
      } catch (error) {
        // Nếu có lỗi và đã authenticated, thực hiện logout
        if (isAuthenticated) {
          logout();
        }
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled: isQueryEnabled,
    select: (data) => {
      if (data?.user) {
        setUser(data.user, localStorage.getItem("access_token") || "");
        return data.user;
      }
      return null;
    },
  });

  // Hàm tiện ích để refresh người dùng hiện tại
  const refreshUser = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: USE_CURRENT_USER_QUERY_KEY });
      return await query.refetch();
    } catch (error) {
      return null;
    }
  };

  return {
    ...query,
    user,
    isAuthenticated,
    isAuthInitialized,
    refreshUser,
  };
};

export type UseCurrentUserReturn = ReturnType<typeof useCurrentUser>;