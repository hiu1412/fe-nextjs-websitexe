import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/api/services/auth-service";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { shallow } from "zustand/shallow";

export const USE_ADMIN_QUERY_KEY = ["admin-validation"] as const;

export const useAdmin = (redirectOnFailure = true) => {
  const router = useRouter();
  const { user, setUser } = useAuthStore(
    (state) => ({
      user: state.user,
      setUser: state.setUser
    }),
    shallow
  );
  
  // Ref để tránh request trùng lặp
  const hasValidatedRef = useRef(false);
  
  // Kiểm tra access_token từ localStorage
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem("access_token");
  
  // Kiểm tra nếu user đã có và là admin
  const isAlreadyAdmin = !!user && user.role === "admin";
  
  const query = useQuery({
    queryKey: USE_ADMIN_QUERY_KEY,
    queryFn: async () => {
      const response = await authService.validateAdmin();
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // Cache kết quả trong 1 phút
    retry: false,
    // Chỉ validate nếu có token, chưa xác định là admin, và chưa validate trước đó
    enabled: hasToken && !isAlreadyAdmin && !hasValidatedRef.current,
  });
  
  useEffect(() => {
    if (query.isSuccess) {
      // Nếu không phải admin và redirectOnFailure được bật, chuyển hướng
      if (!query.data.isAdmin && redirectOnFailure) {
        router.replace('/');
      }
      
      // Nếu có thông tin user từ API, cập nhật store
      if (query.data.user) {
        setUser(query.data.user, localStorage.getItem("access_token") || "");
      }
      
      // Đánh dấu đã validate
      hasValidatedRef.current = true;
    }
    
    // Nếu có lỗi và redirectOnFailure được bật, chuyển hướng
    if (query.isError && redirectOnFailure) {
      router.replace('/auth/login');
    }
  }, [query.isSuccess, query.isError, query.data, redirectOnFailure, router, setUser]);
  
  return {
    isAdmin: isAlreadyAdmin || query.data?.isAdmin || false,
    isLoading: query.isLoading,
    error: query.error,
    user: query.data?.user || user,
  };
}; 