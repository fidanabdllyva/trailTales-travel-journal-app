import type { TravelListType } from "@/types/TravelListType";
import instance from "../instance";
import { endpoints } from "../constants";


interface ApiResponse<T> {
  success?: boolean;
  message: string;
  data: T;
}

// Create
export const createTravelList = async (
  formData: FormData
) => {
  try {
    const response = await instance.post(endpoints.list, formData);
    return response.data;
  } catch (error) {
    console.error("Failed to create travel list:", error);
    throw error;
  }
};

// Public lists (paginated)
export const getPublicTravelLists = async (
  params?: { page?: number; limit?: number; tag?: string }
) => {
  try {
    const response = await instance.get(`${endpoints.list}/public`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch public travel lists:", error);
    throw error;
  }
};

// User’s own lists
export const getUserTravelLists = async (): Promise<
  ApiResponse<TravelListType[]>
> => {
  try {
    const response = await instance.get(`${endpoints.list}/user`);
    return response.data as ApiResponse<TravelListType[]>;
  } catch (error) {
    console.error("Failed to fetch user travel lists:", error);
    throw error;
  }
};

// Collaborative lists
export const getUserCollaborativeLists = async (): Promise<
  ApiResponse<TravelListType[]>
> => {
  try {
    const response = await instance.get(`${endpoints.list}/user/collaborative`);
    return response.data as ApiResponse<TravelListType[]>;
  } catch (error) {
    console.error("Failed to fetch collaborative travel lists:", error);
    throw error;
  }
};

// Single list
export const getTravelList = async (
  id: string
) => {
  try {
    const response = await instance.get(`${endpoints.list}/${id}`);
    return response.data ;
  } catch (error) {
    console.error(`Failed to fetch travel list ${id}:`, error);
    throw error;
  }
};

// Update
export const updateTravelList = async (
  id: string,
  formData: FormData
) => {
  try {
    const response = await instance.patch(`${endpoints.list}/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update travel list ${id}:`, error);
    throw error;
  }
};

// Delete
export const deleteTravelList = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await instance.delete(`${endpoints.list}/${id}`);
    return response.data as ApiResponse<null>;
  } catch (error) {
    console.error(`Failed to delete travel list ${id}:`, error);
    throw error;
  }
};

// Add collaborator
export const addCollaborator = async (
  listId: string,
  email: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await instance.post(
      `${endpoints.list}/${listId}/collaborators`,
      { email }
    );
    return response.data as ApiResponse<null>;
  } catch (error) {
    console.error(`Failed to add collaborator to list ${listId}:`, error);
    throw error;
  }
};

// Remove collaborator
export const removeCollaborator = async (
  listId: string,
  collaboratorId: string
) => {
  try {
    const response = await instance.delete(
      `${endpoints.list}/${listId}/collaborators/${collaboratorId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      error.message
    );
    throw error;
  }
};
