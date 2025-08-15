import type { DestinationType } from "@/types/DestinationType";
import instance from "../instance";
import { endpoints } from "../constants";

export const createDestination = async (formData: FormData) => {
    const response = await instance.post(`${endpoints.destination}`, formData);
    return response.data.data as DestinationType;
};

export const getDestinationsByList = async (listId: string, status?: string) => {
    const response = await instance.get(`${endpoints.destination}/list/${listId}`, {
        params: { status }
    });
    return response.data.data as DestinationType[];
};

export const getDestination = async (id: string) => {
    const response = await instance.get(`${endpoints.destination}/${id}`);
    return response.data.data as DestinationType;
};

export const updateDestination = async (id: string, formData: FormData) => {
    const response = await instance.patch(`${endpoints.destination}/${id}`, formData);
    return response.data.data as DestinationType;
};

export const deleteDestination = async (id: string) => {
    const response = await instance.delete(`${endpoints.destination}/${id}`);
    return response.data; 
};

export const removeImage = async (id: string, imageId: string) => {
    const response = await instance.delete(`${endpoints.destination}/${id}/images`, {
        data: { imageId }
    });
    return response.data.data as DestinationType;
};
