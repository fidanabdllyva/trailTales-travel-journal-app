import type { TravelListType } from "@/types/TravelListType";
import instance from "../instance";
import { endpoints } from "../constants";

interface TravelListsResponse {
    lists: TravelListType[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export const createTravelList = async (formData: FormData) => {
  try {
    const response = await instance.post(`${endpoints.list}`, formData);
    return response.data.data.data as TravelListType;
  } catch (error) {
    console.error("Failed to create travel list:", error);
    throw error;
  }
};

export const getPublicTravelLists = async (params?: { page?: number; limit?: number; tag?: string }) => {
  try {
    const response = await instance.get(`${endpoints.list}/public`, { params });
    return response.data.data as TravelListsResponse;
  } catch (error) {
    console.error("Failed to fetch public travel lists:", error);
    throw error;
  }
};

export const getUserTravelLists = async () => {
  try {
    const response = await instance.get(`${endpoints.list}/user`);
    return response.data.data as TravelListType[];
  } catch (error) {
    console.error("Failed to fetch user travel lists:", error);
    throw error;
  }
};

export const getTravelList = async (id: string) => {
  try {
    const response = await instance.get(`${endpoints.list}/${id}`);
    return response.data.data as TravelListType;
  } catch (error) {
    console.error(`Failed to fetch travel list ${id}:`, error);
    throw error;
  }
};

export const updateTravelList = async (id: string, formData: FormData) => {
  try {
    const response = await instance.patch(`${endpoints.list}/${id}`, formData);
    return response.data.data as TravelListType;
  } catch (error) {
    console.error(`Failed to update travel list ${id}:`, error);
    throw error;
  }
};

export const deleteTravelList = async (id: string) => {
  try {
    const response = await instance.delete(`${endpoints.list}/${id}`);
    return response.data; // { success: boolean, message: string }
  } catch (error) {
    console.error(`Failed to delete travel list ${id}:`, error);
    throw error;
  }
};

export const addCollaborator = async (listId: string, userId: string) => {
  try {
    const response = await instance.post(`${endpoints.list}/${listId}/collaborators`, { userId });
    return response.data.data as TravelListType;
  } catch (error) {
    console.error(`Failed to add collaborator to list ${listId}:`, error);
    throw error;
  }
};

export const removeCollaborator = async (listId: string, userId: string) => {
  try {
    const response = await instance.delete(`${endpoints.list}/${listId}/collaborators`, {
      data: { userId },
    });
    return response.data.data as TravelListType;
  } catch (error) {
    console.error(`Failed to remove collaborator from list ${listId}:`, error);
    throw error;
  }
};
