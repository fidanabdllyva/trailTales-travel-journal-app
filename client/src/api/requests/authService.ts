import  { type AxiosResponse } from "axios";
import instance from "../instance";
import { endpoints } from "../constants";

//types
interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  accessToken: string;
  data?: any;
}

export const login= async (credentials: LoginData): Promise<AxiosResponse<AuthResponse>> => {
try {
  const response = await instance.post<AuthResponse>(`${endpoints.auth}/login`, credentials);


  return response;
} catch (error: any) {
   throw new Error(error.response?.data?.message || error.message || "Failed to login.")
}
}

export const register = async (payload: RegisterData): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response = await instance.post<AuthResponse>(`${endpoints.auth}/register`, payload);

    return response;
    
  } catch ( error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to register.")
    
  }
}

export const forgotPassword = async (email: string): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await instance.post<{ message: string }>(`${endpoints.auth}/forgot-password`, { email });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to send reset password email.");
  }
};

export const resetPassword = async (email: string, newPassword: string): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await instance.post<{ message: string }>(`${endpoints.auth}/reset-password`, { email, newPassword });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to reset password.");
  }
}

export const logout = async (): Promise<void> => {
  try {
    await instance.post(`${endpoints.auth}/logout`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to logout.");
  }
};


interface RefreshResponse {
  accessToken: string;
}

export const refreshToken = async (): Promise<AxiosResponse<RefreshResponse>> => {
  try {
    const response = await instance.post<RefreshResponse>(`${endpoints.auth}/refresh`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to refresh token.");
  }
};


