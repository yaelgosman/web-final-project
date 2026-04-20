import { useState, useEffect } from 'react';
import { UserType } from '../types/user';
import { PostType } from '../types/post';
import { fetchUserById, fetchPostsByUserId } from '../services/profileService';

export const useProfileData = (profileUserId: string | undefined) => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profileUserId) return;

        let isMounted = true;
        // The isMounted prevent state updates if the user navigates away from the profile page before the request finished loading.

        const loadProfileData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Fetch both user and posts concurrently
                const [userResult, postsResult] = await Promise.all([
                    fetchUserById(profileUserId),
                    // If fetching posts fails, fallback to an empty array so the user profile still loads
                    fetchPostsByUserId(profileUserId).catch((err) => {
                        console.warn("Could not fetch posts, defaulting to empty array:", err);
                        return []; 
                    })
                ]);
                
                if (isMounted) {
                    setUserData(userResult);
                    setPosts(postsResult);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error loading profile:", err);
                    setError("Could not load profile data.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProfileData();

        // Cleanup function prevents memory leaks if component unmounts early
        return () => {
            isMounted = false;
        };
    }, [profileUserId]);

    return { userData, posts, isLoading, error, setUserData };
};