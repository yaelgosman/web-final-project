import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { UserType } from '../types/user';
import { getProfile } from '../services/userService';

interface AuthContextType {
    user: UserType | null;
    login: (userData: UserType, token: string, refreshToken?: string) => void;
    logout: () => void;
    updateUser: (userData: UserType) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);

    // Checks localStorage on initial load to keep the user logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && storedUser !== "undefined" && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // Verify session with server
                getProfile().then((updatedUser) => {
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }).catch((error) => {
                    console.error("Session verification failed", error);
                    // logout() is handled by apiClient interceptor if it returns 401
                    // But we can also call it here for safety if the error is terminal
                    if (error.response?.status === 401) {
                        logout();
                    }
                });
            } catch (error) {
                console.error("Failed to parse user", error);
                logout(); // אם המידע פגום, ננקה הכל
            }
        }
    }, []);

    const login = (userData: UserType, token: string, refreshToken?: string) => {
        if (!userData) return;
        setUser(userData);

        // Then we save to the localStorage for persistence on refresh
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    };

    const logout = () => {
        setUser(null); // First sets the user state for the UI to react immidiately on logout
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

    };

    const updateUser = (userData: UserType) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}