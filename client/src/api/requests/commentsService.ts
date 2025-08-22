import instance from "../instance";
import { endpoints } from "../constants";

export const createComment = async (journalEntryId: string, content: string) => {
  try {
    const response = await instance.post(`${endpoints.comments}`, {
      journalEntryId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
};

export const getCommentsByJournal = async (journalEntryId: string) => {
  try {
    const response = await instance.get(`${endpoints.comments}/${journalEntryId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch comments for journal entry ${journalEntryId}:`, error);
    throw error;
  }
};

export const deleteComment = async (id: string) => {
  try {
    const response = await instance.delete(`${endpoints.comments}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete comment ${id}:`, error);
    throw error;
  }
};
