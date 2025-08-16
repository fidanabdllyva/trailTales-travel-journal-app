import type { DestinationType } from "@/types/DestinationType";
import instance from "../instance";
import { endpoints } from "../constants";

export const createDestination = async (formData: FormData): Promise<DestinationType> => {
  try {
    const response = await instance.post(endpoints.destination, formData);
    return response.data.data; // Adjust according to your backend response
  } catch (error: any) {
    console.error("Failed to create destination:", error.response?.data || error.message);
    throw error;
  }
};

export const getDestinationsByList = async (listId: string, status?: string) => {
  try {
    const response = await instance.get(`${endpoints.destination}/list/${listId}`, {
      params: { status },
    });
    return response.data.data.data as DestinationType[];
  } catch (error: any) {
    console.error(`Failed to fetch destinations for list ${listId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const getDestination = async (id: string) => {
  try {
    const response = await instance.get(`${endpoints.destination}/${id}`);
    return response.data.data.data as DestinationType;
  } catch (error: any) {
    console.error(`Failed to fetch destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateDestination = async (id: string, formData: FormData) => {
  try {
    const response = await instance.patch(`${endpoints.destination}/${id}`, formData);
    return response.data.data.data as DestinationType;
  } catch (error: any) {
    console.error(`Failed to update destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteDestination = async (id: string) => {
  try {
    const response = await instance.delete(`${endpoints.destination}/${id}`);
    return response.data; // { success: boolean, message: string }
  } catch (error: any) {
    console.error(`Failed to delete destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const removeImage = async (id: string, imageId: string) => {
  try {
    const response = await instance.delete(`${endpoints.destination}/${id}/images`, {
      data: { imageId },
    });
    return response.data.data.data as DestinationType;
  } catch (error: any) {
    console.error(`Failed to remove image ${imageId} from destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
