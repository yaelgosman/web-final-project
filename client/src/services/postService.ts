import apiClient from './apiClient'; 
import { PostType } from '../types/post';

const API_URL = '/api/posts';

/**
 * Creates a new post.
 * @param formData - FormData containing text, rating, userId, restaurant data, and the image file.
 */
export const createPost = async (formData: FormData): Promise<PostType> => {
  const response = await apiClient.post<PostType>(API_URL, formData, {
    headers: {
      // Overriding the default JSON header for file uploads
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fetches a single post by its ID.
 * @param postId - The MongoDB ObjectId of the post.
 */
export const getPost = async (postId: string): Promise<PostType> => {
  const response = await apiClient.get<PostType>(`${API_URL}/${postId}`);
  return response.data;
};

/**
 * Updates an existing post.
 * @param postId - The MongoDB ObjectId of the post to edit.
 * @param updateData - FormData (if changing image) or Partial<PostType> (if just updating text/rating).
 */
export const editPost = async (postId: string, updateData: FormData | Partial<PostType>): Promise<PostType> => {
  const isFormData = updateData instanceof FormData;

  const response = await apiClient.put<PostType>(`${API_URL}/${postId}`, updateData, {
    headers: {
      // Dynamically apply the correct header based on payload type
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

/**
 * Deletes a post.
 * @param postId - The MongoDB ObjectId of the post to delete.
 */
export const deletePost = async (postId: string): Promise<void> => {
  await apiClient.delete(`${API_URL}/${postId}`);
};

/**
 * Fetches all posts from the database.
 */
export const getAllPosts = async (): Promise<PostType[]> => {
  const response = await apiClient.get<PostType[]>(API_URL);
  return response.data;
};

const postService = {
  createPost,
  getPost,
  editPost,
  deletePost,
  getAllPosts
};

export default postService;