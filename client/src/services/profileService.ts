import apiClient from './apiClient';
import { UserType } from '../types/user';
import { PostType } from '../types/post';

// Gets the user data by the given id
export const fetchUserById = async (userId: string): Promise<UserType> => {    
    const response = await apiClient.get<UserType>(`/api/users/${userId}`);
    return response.data;
};

// Gets the posts of a given user by their id
export const fetchPostsByUserId = async (userId: string): Promise<PostType[]> => {
    const response = await apiClient.get<PostType[]>(`/api/posts/user/${userId}`);
    return response.data;
};

// Updates the user profile details
export const updateUserProfile = async (userId: string, formData: FormData): Promise<UserType> => {
    const response = await apiClient.put<UserType>(`/api/users/profile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
    return response.data;
};