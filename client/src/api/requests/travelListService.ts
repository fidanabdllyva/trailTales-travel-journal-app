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
    const response = await instance.post(`${endpoints.list}`, formData);
    return response.data.data as TravelListType;
};

export const getPublicTravelLists = async (params?: { page?: number; limit?: number; tag?: string }) => {
    const response = await instance.get(`${endpoints.list}/public`, { params });
    return response.data.data as TravelListsResponse;
};

export const getUserTravelLists = async () => {
    const response = await instance.get(`${endpoints.list}/user`);
    return response.data.data as TravelListType[];
};

export const getTravelList = async (id: string) => {
    const response = await instance.get(`${endpoints.list}/${id}`);
    return response.data.data as TravelListType;
};

export const updateTravelList = async (id: string, formData: FormData) => {
    const response = await instance.patch(`${endpoints.list}/${id}`, formData);
    return response.data.data as TravelListType;
};

export const deleteTravelList = async (id: string) => {
    const response = await instance.delete(`${endpoints.list}/${id}`);
    return response.data; // { success: boolean, message: string }
};

export const addCollaborator = async (listId: string, userId: string) => {
    const response = await instance.post(`${endpoints.list}/${listId}/collaborators`, { userId });
    return response.data.data as TravelListType;
};

export const removeCollaborator = async (listId: string, userId: string) => {
    const response = await instance.delete(`${endpoints.list}/${listId}/collaborators`, {
        data: { userId }
    });
    return response.data.data as TravelListType;
};
