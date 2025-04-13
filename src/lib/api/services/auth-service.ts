import { API_ENDPOINTS } from "../endpoints";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";
import axiosInstance from "../axios-instance";
import Cookies from 'js-cookie';

export interface AuthApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

const setUserAuthenticated = (token: string, user: User) => {
  localStorage.setItem("access_token", token);
  Cookies.set('access_token', token, { expires: 7, path: '/' });
  Cookies.set('user-role', user.role || 'user', { expires: 7, path: '/' });
};

const clearUserAuthentication = () => {
  localStorage.removeItem("access_token");
  Cookies.remove('user-role', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

let isMakingAuthRequest = false;

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      
      const { access_token } = response.data.data;
      const user = response.data.data.user;
      
      setUserAuthenticated(access_token, user);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  verifyEmail: async (email: string, token: string): Promise<AuthApiResponse<null>> => {
    try {
      const response = await axiosInstance.post<AuthApiResponse<null>>(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL(token),
        { email }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resendVerification: async (email: string): Promise<AuthApiResponse<null>> => {
    try {
      const response = await axiosInstance.post<AuthApiResponse<null>>(
        API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        { email }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<AuthApiResponse<null>> => {
    if (isMakingAuthRequest) {
      return {
        status: "success",
        message: "Already logging out",
        data: null
      };
    }
    
    isMakingAuthRequest = true;
    
    try {
      const response = await axiosInstance.post<AuthApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT);
      
      clearUserAuthentication();
      
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        isMakingAuthRequest = false;
      }, 300);
    }
  },

  getMe: async (): Promise<AuthApiResponse<{ user: User }>> => {
    if (isMakingAuthRequest) {
      return {
        status: "success",
        message: "Already fetching user data",
        data: { user: null as unknown as User }
      };
    }
    
    isMakingAuthRequest = true;
    
    try {
      const response = await axiosInstance.get<AuthApiResponse<{ user: User }>>(API_ENDPOINTS.AUTH.ME);
      
      if (response.data.data.user) {
        Cookies.set('user-role', response.data.data.user.role || 'user', { expires: 7, path: '/' });
      }
      
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        isMakingAuthRequest = false;
      }, 300);
    }
  },
  
  validateAdmin: async (): Promise<AuthApiResponse<{ isAdmin: boolean; user?: User }>> => {
    try {
      const response = await axiosInstance.get<AuthApiResponse<{ user: User }>>(API_ENDPOINTS.AUTH.ME);
      
      const isAdmin = response.data.data.user?.role === 'admin';
      
      return {
        status: response.data.status,
        message: response.data.message,
        data: {
          isAdmin,
          user: response.data.data.user
        }
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to validate admin rights",
        data: { isAdmin: false }
      };
    }
  },

  getGoogleAuthUrl: async (): Promise<string> => {
    try {
      const response = await axiosInstance.get<{ url: string }>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN);
      
      if (!response.data || !response.data.url) {
        throw new Error("Không nhận được URL đăng nhập Google hợp lệ");
      }
      
      return response.data.url;
    } catch (error) {
      throw error;
    }
  },

  handleGoogleCallback: async (): Promise<AuthApiResponse<{user: null, access_token: null}>> => {
    return {
      status: "success", 
      message: "Please use the success route instead",
      data: { user: null, access_token: null }
    };
  }
};

export default authService;