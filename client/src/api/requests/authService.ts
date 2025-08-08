import  { type AxiosResponse } from "axios";
import instance from "../instance";


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
  const response = await instance.post<AuthResponse>("/auth/login", credentials);


  return response;
} catch (error: any) {
   throw new Error(error.response?.data?.message || error.message || "Failed to login.")
}
}

export const register = async (payload: RegisterData): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response = await instance.post<AuthResponse>("/auth/register", payload);

    return response;
    
  } catch ( error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to register.")
    
  }
}