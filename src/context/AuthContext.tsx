import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  setUserLanguage: (language: string) => void;
  setTargetLanguage: (language: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('quickChatUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('quickChatUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('quickChatUser');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just simulate a successful login
      const mockUser: User = {
        id: 'user-1',
        email,
        username: email.split('@')[0],
        userLanguage: 'en',
        targetLanguage: 'es'
      };
      
      setTimeout(() => {
        setUser(mockUser);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        username,
        userLanguage: 'en',
        targetLanguage: 'es'
      };
      
      setTimeout(() => {
        setUser(mockUser);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const setUserLanguage = (language: string) => {
    if (user) {
      setUser({ ...user, userLanguage: language });
    }
  };

  const setTargetLanguage = (language: string) => {
    if (user) {
      setUser({ ...user, targetLanguage: language });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      setUserLanguage,
      setTargetLanguage,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};