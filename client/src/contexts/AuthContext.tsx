import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { UserType } from '../types/user';

interface AuthContextType {
    user: UserType | null;
    login: (userData: UserType, token: string, refreshToken?: string) => void;
    logout: () => void;
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
                setUser(JSON.parse(storedUser));
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

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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