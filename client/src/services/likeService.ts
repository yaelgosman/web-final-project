import apiClient from './apiClient';

const LIKES_API_URL = '/api/likes'; 

/**
 * Toggles a like on or off depending on the current state.
 */
export const toggleLike = async (postId: string, currentlyLiked: boolean): Promise<void> => {
  if (currentlyLiked) {
    await apiClient.delete(LIKES_API_URL, { 
      data: { postId } 
    });
  } else {
    await apiClient.post(LIKES_API_URL, { 
      postId 
    });
  }
};

/**
 * Gets the total likes and whether the current user has liked it.
 */
export const getPostLikes = async (postId: string): Promise<{ count: number, hasLiked: boolean }> => {
  const response = await apiClient.get(`${LIKES_API_URL}/${postId}`);
  return response.data;
};

const likeService = {
  toggleLike,
  getPostLikes
};

export default likeService;