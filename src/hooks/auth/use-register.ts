import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { ApiErrorResponse, AuthResponse, RegisterRequest } from "@/lib/api/types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";

export const useRegister = () => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response: AuthResponse) => {
      setRegisteredEmail(response.data.user.email);
      setShowVerifyModal(true);
      toast.success("Đăng ký thành công! Vui lòng xác thực email của bạn.");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
    }
  });

  return {
    mutate,
    isPending,
    showVerifyModal,
    setShowVerifyModal,
    registeredEmail
  };
};