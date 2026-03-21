import apiClient from './apiClient';
import { UserType } from '../types/user';
import { PostType } from '../types/post';

// Gets the user data by the given id
export const fetchUserById = async (userId: string): Promise<UserType> => {
    try {
        const response = await apiClient.get<UserType>(`/api/users/${userId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

// Gets the posts of a given user by their id
export const fetchPostsByUserId = async (userId: string) => {
    try {
        const response = await apiClient.get<any>(`/api/posts/user/${userId}`);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
};

// Updates the user profile details
export const updateUserProfile = async (userId: string, formData: FormData) => {
    try {
        const response = await apiClient.put(
            `/api/users/profile`,
            formData,
            {
                headers: {
                    // This overrides the global 'application/json' in your apiClient.ts
                    'Content-Type': 'multipart/form-data'
                },
            }
        );
        console.log("Profile updated:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error updating profile:", error);
        throw error;
    }
};