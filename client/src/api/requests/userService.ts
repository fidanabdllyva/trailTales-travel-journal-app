import type { AxiosResponse } from "axios";
import instance from "../instance";
import { endpoints } from "../constants";
import type { User } from "@/types/UserType";

interface UserResponse {
  message: string;
  data: User;
}

interface UsersListResponse {
  message: string;
  data: User[];
}

export const getCurrentUser = () => instance.get<UserResponse>(`${endpoints.auth}/me`);


export const getAllUsers = async (): Promise<AxiosResponse<UsersListResponse>> => {
  try {
    const response = await instance.get<UsersListResponse>(`${endpoints.auth}/users`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
  }
};

export const getUserById = async (userId: string): Promise<AxiosResponse<UserResponse>> => {
  try {
    const response = await instance.get<UserResponse>(`${endpoints.auth}/users/${userId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
  }
};

export const updateUser = async (userId: string, formData: FormData): Promise<AxiosResponse<UserResponse>> => {
  try {
    const response = await instance.patch<UserResponse>(
      `${endpoints.auth}/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
  }
};

export const changePasswordApi = (data: { currentPassword: string; newPassword: string }) => {
  return instance.patch(`${endpoints.auth}/change-password`, data);
};


// export const deleteAccount = async (): Promise<AxiosResponse<{ message: string }>> => {
//   try {
//     const response = await instance.delete<{ message: string }>(`${endpoints.auth}/me`);
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message || 'Failed to delete account');
//   }
// };

// export const updatePassword = async (
//   currentPassword: string,
//   newPassword: string
// ): Promise<AxiosResponse<{ message: string }>> => {
//   try {
//     const response = await instance.put<{ message: string }>(`${endpoints.auth}/me/password`, {
//       currentPassword,
//       newPassword,
//     });
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message || 'Failed to update password');
//   }
// };

// export const togglePremium = async (): Promise<AxiosResponse<UserResponse>> => {
//   try {
//     const response = await instance.post<UserResponse>(`${endpoints.auth}/me/toggle-premium`);
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message || 'Failed to toggle premium status');
//   }
// };