import apiClient from './apiClient';
import { CommentType } from '../types/comment';

const COMMENTS_API_URL = '/api/comments'; 

/**
 * Fetches all comments for a specific post.
 * Assuming your backend route is something like: GET /posts/:postId/comments
 */
export const getCommentsByPost = async (postId: string): Promise<CommentType[]> => {
  const response = await apiClient.get<CommentType[]>(`${COMMENTS_API_URL}/${postId}`);
  return response.data;
};

/**
 * Creates a new comment on a post.
 * Assuming your backend route is: POST /comments
 */
export const createComment = async (postId: string, text: string): Promise<CommentType> => {
  const response = await apiClient.post<CommentType>(COMMENTS_API_URL, {
    postId,
    text
  });
  return response.data;
};

/**
 * Updates an existing comment.
 * Assuming your backend route is: PUT or PATCH /comments/:id
 */
export const editComment = async (commentId: string, text: string): Promise<CommentType> => {
  const response = await apiClient.put<CommentType>(`${COMMENTS_API_URL}/${commentId}`, {
    text
  });
  return response.data;
};

/**
 * Deletes a comment.
 * Assuming your backend route is: DELETE /comments/:id
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`${COMMENTS_API_URL}/${commentId}`);
};

const commentService = {
  getCommentsByPost,
  createComment,
  editComment,
  deleteComment
};

export default commentService;