'use client';

import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, UserRole } from '@/lib/types';
import { getMockUserByRole } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user
    try {
      const storedUser = localStorage.getItem('athlete-sentinel-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('athlete-sentinel-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (role: UserRole) => {
    // setLoading(true);
    // const mockUser = getMockUserByRole(role);
    // if (mockUser) {
    //   setUser(mockUser);
    //   localStorage.setItem('athlete-sentinel-user', JSON.stringify(mockUser));
    // }
    // setLoading(false);
  };
  
  const switchRole = (role: UserRole) => {
    login(role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('athlete-sentinel-user');
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    switchRole,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
