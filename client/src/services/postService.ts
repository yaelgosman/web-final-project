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

export interface PaginatedPosts {
  posts: PostType[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

/**
 * Fetches all posts from the database, optionally filtered by search text and category and paginated.
 */
export const getAllPosts = async (search?: string, category?: string, page: number = 1, limit: number = 5): Promise<PaginatedPosts> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'all') params.append('category', category);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const queryString = params.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;
  const response = await apiClient.get<PaginatedPosts>(url);
  return response.data;
};

/**
 * Searches posts using the AI smart search functionality.
 */
export const aiSearch = async (query: string): Promise<PostType[]> => {
  const response = await apiClient.post<PostType[]>('/api/ai/search', { query });
  return response.data;
};

const postService = {
  createPost,
  getPost,
  editPost,
  deletePost,
  getAllPosts,
  aiSearch
};

export default postService;