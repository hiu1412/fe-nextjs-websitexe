"use client";

import { authService } from "@/lib/api/services";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { PropsWithChildren } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function AuthCheckProvider({ children }: PropsWithChildren) {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);
  const hasInitializedRef = useRef(false);

  // Query để kiểm tra người dùng hiện tại
  const { refetch: refetchUser } = useQuery({
    queryKey: ["auth-check"],
    queryFn: async () => {
      try {
        const response = await authService.getMe();
        if (response.data && response.data.user) {
          // Lấy access_token từ localStorage (đã được set bởi axios interceptor)
          const token = localStorage.getItem("access_token") || "";
          setUser(response.data.user, token);
        }
        return response.data;
      } catch (error) {
        console.error("Lỗi khi kiểm tra người dùng:", error);
        return null;
      }
    },
    enabled: false, // Tắt tự động chạy khi mount
    retry: false,
  });

  // Hàm để refresh token
  const refreshToken = async (): Promise<string | null> => {
    try {
      // Dùng axios nguyên bản thay vì instance đã cấu hình để tránh lặp vô tận
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Refresh token thành công:", response.data);
      const { access_token } = response.data.data;

      localStorage.setItem("access_token", access_token);
      return access_token;
    } catch (error) {
      console.error("Refresh token thất bại:", error);
      return null;
    }
  };

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (hasInitializedRef.current) return;

      try {
        // Kiểm tra xem đã có access_token trong localStorage chưa
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          // Trường hợp 1: Có access_token - Thử lấy thông tin người dùng
          console.log("Có access_token, lấy thông tin người dùng");
          await refetchUser();
        } else {
          // Trường hợp 2: Không có access_token - Thử refresh token
          console.log("Không có access_token, thử refresh token");
          const response = await refreshToken();

          if (response) {
            // Nếu refresh thành công, lấy thông tin người dùng
            console.log("Refresh token thành công, lấy thông tin người dùng");
            await refetchUser();
          } else {
            // Nếu refresh thất bại, đánh dấu là đã khởi tạo
            console.log("Refresh token thất bại, kết thúc quá trình kiểm tra");
            setAuthInitialized(true);
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra xác thực:", error);
        setAuthInitialized(true);
      } finally {
        hasInitializedRef.current = true;
      }
    };

    checkAuth();
  }, [isAuthenticated, refetchUser, setAuthInitialized]);

  return <>{children}</>;
}
