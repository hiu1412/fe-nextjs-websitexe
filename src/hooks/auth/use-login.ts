import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { ApiErrorResponse, LoginRequest, AuthResponse } from "@/lib/api/types";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { USE_CURRENT_USER_QUERY_KEY } from "./use-current-user";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response: AuthResponse) => {
      setUser(response.data.user, response.data.access_token);
      
      queryClient.setQueryData(USE_CURRENT_USER_QUERY_KEY, {
        user: response.data.user
      });
      
      toast.success("Đăng nhập thành công!");
      
      if (response.data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401 && error.response.data.message === "Email not verified") {
        toast.error("Vui lòng xác thực email trước khi đăng nhập", {
          action: {
            label: "Chuyển đến trang xác thực",
            onClick: () => router.push("/auth/verify-email")
          }
        });
      } else {
        toast.error(error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    }
  });
};