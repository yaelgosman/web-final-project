import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { UserType } from '../types/user';

interface AuthContextType {
    user: UserType | null;
    login: (userData: UserType, token: string) => void;
    updateUser: (userData: UserType) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserType | null>(null);

    // Checks localStorage on initial load to keep the user logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: UserType, token: string) => {
        // First we save the new state for the UI to react immidiately on login
        setUser(userData);

        // Then we save to the localStorage for persistence on refresh
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);        
    };

    const updateUser = (userData: UserType) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null); // First sets the user state for the UI to react immidiately on logout
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, updateUser, logout, isAuthenticated: !!user }}>
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