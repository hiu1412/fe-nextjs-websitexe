"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra các loại lỗi từ URL parameters
    if (searchParams.has("from") && searchParams.get("from") === "admin") {
      setError("Bạn cần đăng nhập với quyền admin để truy cập trang quản trị.");
    } else if (searchParams.has("error")) {
      const errorType = searchParams.get("error");

      switch (errorType) {
        case "google_login":
          setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
          break;
        case "no_code":
          setError("Không nhận được mã xác thực từ Google. Vui lòng thử lại.");
          break;
        case "google_callback":
          setError("Xử lý đăng nhập Google thất bại. Vui lòng thử lại sau.");
          break;
        default:
          setError("Đăng nhập thất bại. Vui lòng thử lại.");
          break;
      }
    }
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <LoginForm />

      <div className="mt-6 mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-muted-foreground text-sm">
              Hoặc tiếp tục với
            </span>
          </div>
        </div>
      </div>

      <GoogleButton />
    </div>
  );
}
