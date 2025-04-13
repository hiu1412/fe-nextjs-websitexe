"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGoogleAuth } from "@/hooks/auth";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Xử lý khi component mount
    const processAuth = async () => {
      try {
        // Kiểm tra nếu có lỗi từ Google
        if (searchParams.has("error")) {
          const googleError = searchParams.get("error");
          console.error("Google returned an error:", googleError);
          setError(`Lỗi từ Google: ${googleError || "Không xác định"}`);
          setIsLoading(false);
          return;
        }

        // Lấy code từ params (Google sẽ trả về code này)
        const code = searchParams.get("code");

        // Nếu không có code, chuyển hướng về trang đăng nhập
        if (!code) {
          console.error("No code found in the callback URL");
          router.replace("/auth/login?error=no_code");
          return;
        }

        console.log(
          "Processing Google callback with code:",
          code.substring(0, 10) + "..."
        );

        // Xử lý callback
        await handleGoogleCallback.mutateAsync(code);

        // Thành công - không cần set isLoading vì đã redirect rồi
      } catch (error: any) {
        console.error("Google callback processing error:", error);

        // Hiển thị lỗi chi tiết hơn
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Đã xảy ra lỗi khi xử lý đăng nhập Google";

        setError(errorMessage);
        setIsLoading(false);
      }
    };

    processAuth();
  }, []);

  // Nếu đang xử lý
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Đang xử lý đăng nhập...</p>
        <p className="text-sm text-gray-500 mt-2">
          Vui lòng đợi trong giây lát
        </p>
      </div>
    );
  }

  // Nếu có lỗi
  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.push("/auth/login")} variant="default">
            Quay lại trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  // Nếu thành công, trang này sẽ không còn hiển thị (đã redirect tới home)
  return null;
}
