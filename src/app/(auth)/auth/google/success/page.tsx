"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Cookies from "js-cookie";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  // Lấy access_token và refresh_token từ URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  // Xử lý cookies và local storage
  useEffect(() => {
    if (refreshToken) {
      Cookies.set("refresh_token", refreshToken, {
        expires: 7, // 7 ngày (60 * 24 * 7 phút)
        path: "/",
        secure: window.location.protocol === "https:", // tương đương với false trong local dev
        httpOnly: false, // không thể set httpOnly từ JavaScript
        sameSite: "Lax",
      });
    } else {
      console.log("No refresh_token in URL");
    }

    // Lưu access token vào localStorage nếu có
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else {
      setError("Không nhận được access token từ server");
    }
  }, [refreshToken, accessToken]);

  // Thực hiện getMe nếu có access_token
  const { isLoading, error: queryError } = useQuery({
    queryKey: ["google-auth-user"],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("Không tìm thấy access token");
      }

      // Gọi API getMe để lấy thông tin user
      console.log("Fetching user data with access token");
      const response = await authService.getMe();

      if (response.data.user) {
        // Lưu thông tin user vào store
        setUser(response.data.user, accessToken);
        console.log("User data fetched successfully");

        // Chuyển hướng về trang chủ
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }

      return response;
    },
    enabled: !!accessToken,
    retry: 1,
  });

  useEffect(() => {
    // Xử lý nếu không có access_token
    if (!accessToken) {
      setError("Không nhận được token đăng nhập từ Google");
      // Chuyển về trang đăng nhập sau 3 giây
      setTimeout(() => {
        router.push("/auth/login?error=google_login_failed");
      }, 3000);
    }

    // Xử lý lỗi trong quá trình query
    if (queryError) {
      console.error("Error fetching user data:", queryError);
      setError("Lỗi khi lấy thông tin người dùng");
      // Chuyển về trang đăng nhập sau 3 giây
      setTimeout(() => {
        router.push("/auth/login?error=fetch_user_failed");
      }, 3000);
    }
  }, [accessToken, queryError, router]);

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <p className="text-center text-sm mt-4">
          Đang chuyển hướng về trang đăng nhập...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-lg font-medium">Đăng nhập thành công!</p>
      <p className="text-sm text-gray-500 mt-2">
        Đang lấy thông tin người dùng...
      </p>
    </div>
  );
}
