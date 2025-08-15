import instance from "../instance";
import { endpoints } from "../constants";
import type { JournalEntryType } from "@/types/JournalEntryType";

export const createJournalEntry = async (formData: FormData) => {
    const response = await instance.post(`${endpoints.journal}`, formData);
    return response.data.data as JournalEntryType;
};

export const getJournalEntries = async (params?: {
    destination?: string;
    author?: string;
    public?: boolean;
    page?: number;
    limit?: number;
}) => {
    const response = await instance.get(`${endpoints.journal}`, { params });
    return response.data.data as JournalEntryType[];
};

export const getPublicJournalEntries = async (params?: { page?: number; limit?: number }) => {
    const response = await instance.get(`${endpoints.journal}/public`, { params });
    return response.data.data as JournalEntryType[];
};

export const getJournalEntryById = async (id: string) => {
    const response = await instance.get(`${endpoints.journal}/${id}`);
    return response.data.data as JournalEntryType;
};

export const updateJournalEntry = async (id: string, formData: FormData) => {
    const response = await instance.patch(`${endpoints.journal}/${id}`, formData);
    return response.data.data as JournalEntryType;
};

export const deleteJournalEntry = async (id: string) => {
    const response = await instance.delete(`${endpoints.journal}/${id}`);
    return response.data; // { success: boolean, message: string }
};

export const removePhoto = async (id: string, photoUrl: string) => {
    const response = await instance.delete(`${endpoints.journal}/${id}/photos`, {
        data: { photoUrl }
    });
    return response.data.data as JournalEntryType;
};

export const toggleLike = async (id: string) => {
    const response = await instance.post(`${endpoints.journal}/${id}/toggle-like`);
    return response.data.data as JournalEntryType;
};
