import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ApiClient } from '../services/api';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  isLoading: boolean;
  login: (userId: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  isLeaderOrAdmin: boolean;
  isAdminOrSuperAdmin: boolean;
  isSuperAdmin: boolean;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await ApiClient.getMe();
      if (res.user) {
        setCurrentUser(res.user);
      }
      const usersRes = await ApiClient.getAllUsers();
      if (usersRes.users) {
        setAllUsers(usersRes.users);
      }
    } catch (err) {
      console.warn('Backend session check failed, falling back to member login');
      // Login as default member
      try {
        const loginRes = await ApiClient.login(INITIAL_USERS[0].id);
        setCurrentUser(loginRes.user);
      } catch (loginErr) {
        console.error('Initial login error:', loginErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Attempt to verify existing token or login initial user
    const token = ApiClient.getToken();
    if (token) {
      refreshUser();
    } else {
      // Create session for default member
      ApiClient.login(INITIAL_USERS[0].id)
        .then((res) => {
          setCurrentUser(res.user);
          return ApiClient.getAllUsers();
        })
        .then((usersRes) => {
          if (usersRes.users) setAllUsers(usersRes.users);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, []);

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.login(userId);
      setCurrentUser(res.user);
      const usersRes = await ApiClient.getAllUsers();
      if (usersRes.users) setAllUsers(usersRes.users);
    } catch (err) {
      console.error('Failed to switch user on backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userId: string): Promise<boolean> => {
    try {
      const res = await ApiClient.login(userId);
      setCurrentUser(res.user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    try {
      const res = await ApiClient.register(name, email);
      setCurrentUser(res.user);
      const usersRes = await ApiClient.getAllUsers();
      if (usersRes.users) setAllUsers(usersRes.users);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await ApiClient.logout();
    } catch (err) {
      console.warn('Logout error', err);
    }
    // Default back to member
    await switchUser(INITIAL_USERS[0].id);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return roles.includes(currentUser.role);
  };

  const updateProfile = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const isLeaderOrAdmin = ['LEADER', 'ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);
  const isAdminOrSuperAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        refreshUser,
        hasRole,
        isLeaderOrAdmin,
        isAdminOrSuperAdmin,
        isSuperAdmin,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
