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

interface CollaboratorRequestResponse {
  message: string;
  data?: any;
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


export const respondToCollaboratorRequest = async (
  requestId: string,
  accept: boolean
): Promise<AxiosResponse<CollaboratorRequestResponse>> => {
  try {
    const response = await instance.post<CollaboratorRequestResponse>(
      `${endpoints.auth}/collaborator-requests/${requestId}/respond`,
      { accept }
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to respond to request');
  }
};

// Fetch all pending collaborator requests for the current user
export const getCollaboratorRequests = async (): Promise<AxiosResponse<{ message: string; data: any[] }>> => {
  try {
    const response = await instance.get(`${endpoints.auth}/collaborator-requests`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch collaborator requests');
  }
};

// export const deleteAccount = async (): Promise<AxiosResponse<{ message: string }>> => {
//   try {
//     const response = await instance.delete<{ message: string }>(`${endpoints.auth}/me`);
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message || 'Failed to delete account');
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