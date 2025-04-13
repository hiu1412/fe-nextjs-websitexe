import { AxiosError } from "axios";
import { ApiResponse } from "./types";

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    // Xử lý lỗi từ API
    const response = error.response?.data as ApiResponse<null>;
    return {
      message: response?.message || "Đã có lỗi xảy ra",
      status: error.response?.status || 500,
    };
  }
  // Xử lý lỗi không phải từ API
  return {
    message: "Đã có lỗi xảy ra",
    status: 500,
  };
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

export const removeAccessToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Cookie helpers (cho SSR)
export const parseCookies = (cookieString: string) => {
  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=').map(c => c.trim());
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
};

// Hàm helper để tạo query string từ object params
export const createQueryString = (params: Record<string, string | number | boolean>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

// Hàm helper để format data trước khi gửi lên server
export const formatRequestData = <T extends Record<string, string | number | boolean | File | Array<string | number>>>(
  data: T
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, String(item));
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// Hàm helper để kiểm tra và refresh token
export const checkAndRefreshToken = async () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    // TODO: Implement token validation and refresh logic
    return true;
  } catch {
    removeAccessToken();
    return false;
  }
};