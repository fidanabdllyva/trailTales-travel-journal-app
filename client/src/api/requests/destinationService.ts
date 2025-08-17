import type { DestinationType } from "@/types/DestinationType";
import instance from "../instance";
import { endpoints } from "../constants";

type CreateDestinationResponse = {
  success: boolean;
  message: string;
  data: DestinationType;
};

export const createDestination = async (
  formData: FormData
): Promise<CreateDestinationResponse> => {
  try {
    console.log("Sending destination form data:", formData);

    const response = await instance.post(endpoints.destination, formData);

    console.log("Destination response:", response.data);

    return response.data as CreateDestinationResponse;
  } catch (error: any) {
    console.error(
      "Failed to create destination:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getDestinationsByList = async (listId: string, status?: string): Promise<DestinationType[]> => {
  try {
    const response = await instance.get(`${endpoints.destination}/list/${listId}`, {
      params: { status },
    });
    return response.data as DestinationType[]; // backend returns array
  } catch (error: any) {
    console.error(`Failed to fetch destinations for list ${listId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const getDestination = async (id: string): Promise<DestinationType> => {
  try {
    const response = await instance.get(`${endpoints.destination}/${id}`);
    return response.data as DestinationType; // backend returns object
  } catch (error: any) {
    console.error(`Failed to fetch destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateDestination = async (id: string, formData: FormData): Promise<DestinationType> => {
  try {
    const response = await instance.patch(`${endpoints.destination}/${id}`, formData);
    return response.data as DestinationType; // backend returns updated destination
  } catch (error: any) {
    console.error(`Failed to update destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteDestination = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await instance.delete(`${endpoints.destination}/${id}`);
    return response.data; // backend returns { success, message }
  } catch (error: any) {
    console.error(`Failed to delete destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const removeImage = async (id: string, imageId: string): Promise<DestinationType> => {
  try {
    const response = await instance.delete(`${endpoints.destination}/${id}/images`, {
      data: { imageId },
    });
    return response.data.data as DestinationType; // backend returns { success, message, data }
  } catch (error: any) {
    console.error(`Failed to remove image ${imageId} from destination ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
