import instance from "../instance";
import { endpoints } from "../constants";

export const createJournalEntry = async (formData: FormData) => {
  try {
    const response = await instance.post(`${endpoints.journal}`, formData);
    return response.data;
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    throw error;
  }
};

export const getJournalEntries = async (params?: {
  destination?: string;
  author?: string;
  public?: boolean;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await instance.get(`${endpoints.journal}`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch journal entries:", error);
    throw error;
  }
};

export const getPublicJournalEntries = async (params?: {
  destination?: string;
  author?: string;
  public?: boolean;
  page?: number;
  limit?: number;
  excludeUserId?: string; 
}) => {
  try {
    const response = await instance.get(`${endpoints.journal}`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch journal entries:", error);
    throw error;
  }
};


export const getJournalEntryById = async (id: string) => {
  try {
    const response = await instance.get(`${endpoints.journal}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch journal entry ${id}:`, error);
    throw error;
  }
};

export const updateJournalEntry = async (id: string, formData: FormData) => {
  try {
    const response = await instance.patch(`${endpoints.journal}/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update journal entry ${id}:`, error);
    throw error;
  }
};

export const getUserOwnJournal = async () => {
  try {
    const response = await instance.get(`${endpoints.journal}/user`)
    return response.data
  }
  catch (error) {
    console.error("Failed to fetch user own journal entries")
    throw error
  }
}

export const deleteJournalEntry = async (id: string) => {
  try {
    const response = await instance.delete(`${endpoints.journal}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete journal entry ${id}:`, error);
    throw error;
  }
};

export const removePhoto = async (id: string, photoUrl: string) => {
  try {
    const response = await instance.delete(`${endpoints.journal}/${id}/photos`, {
      data: { photoUrl },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to remove photo from journal entry ${id}:`, error);
    throw error;
  }
};

export const toggleLike = async (id: string) => {
  try {
    const response = await instance.post(`${endpoints.journal}/${id}/toggle-like`);
    return response.data;
  } catch (error) {
    console.error(`Failed to toggle like for journal entry ${id}:`, error);
    throw error;
  }
};
