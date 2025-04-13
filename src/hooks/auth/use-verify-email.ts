import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/lib/api/types";

interface VerifyEmailParams {
  email: string;
  token: string;
}

export const useVerifyEmail = () => {
  const router = useRouter();
  
  const verifyMutation = useMutation({
    mutationFn: ({ email, token }: VerifyEmailParams) => 
      authService.verifyEmail(email, token),
    onSuccess: () => {
      toast.success("Xác thực email thành công!");
      router.push("/auth/login");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 404) {
        toast.error("Mã xác thực không hợp lệ hoặc đã hết hạn");
      } else {
        toast.error(error.response?.data?.message || "Xác thực email thất bại");
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: (email: string) => 
      authService.resendVerification(email),
    onSuccess: () => {
      toast.success("Đã gửi lại mã xác thực, vui lòng kiểm tra email");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || "Không thể gửi lại mã xác thực");
    },
  });

  const verify = (email: string, token: string) => {
    verifyMutation.mutate({ email, token });
  };

  const resend = (email: string) => {
    resendMutation.mutate(email);
  };

  return {
    verify,
    resend,
    isVerifying: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    error: verifyMutation.error?.message,
  };
};