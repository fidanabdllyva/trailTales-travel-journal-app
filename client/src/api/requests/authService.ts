import  { type AxiosResponse } from "axios";
import instance from "../instance";


interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  accessToken?: string;
  data?: any;
}

class AuthService {
  private static PATH = '/auth';

  static async register(data: RegisterData): Promise<AxiosResponse<AuthResponse>> {
    return instance.post(`${this.PATH}/register`, data);
  }

  static async login(credentials: LoginData): Promise<AxiosResponse<AuthResponse>> {
    return instance.post(`${this.PATH}/login`, credentials);
  }

  static async verifyEmail(token: string): Promise<AxiosResponse<AuthResponse>> {
    return instance.get(`${this.PATH}/verify-email?token=${token}`);
  }

  static async forgotPassword(email: string): Promise<AxiosResponse<AuthResponse>> {
    return instance.post(`${this.PATH}/forgot-password`, { email });
  }

  static async resetPassword(newPassword: string, email: string): Promise<AxiosResponse<AuthResponse>> {
    return instance.post(`${this.PATH}/reset-password`, {
      newPassword,
      email
    });
  }

  static async refreshToken(): Promise<AxiosResponse<{ accessToken: string }>> {
    return instance.post(`${this.PATH}/refresh`);
  }

  static async logout(): Promise<AxiosResponse<AuthResponse>> {
    return instance.post(`${this.PATH}/logout`);
  }

  static async unlockAccount(token: string): Promise<AxiosResponse<AuthResponse>> {
    return instance.get(`${this.PATH}/unlock-account?token=${token}`);
  }

  static async getAllUsers(): Promise<AxiosResponse<{ message: string; data: any[] }>> {
    return instance.get(`${this.PATH}/users`);
  }

  // Set the JWT token in the axios instance
  static setAuthToken(token: string | null): void {
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common['Authorization'];
    }
  }
}

export default AuthService;
