// context/AuthContext.tsx
<<<<<<< HEAD
import React, { createContext, useState, useCallback, useMemo } from 'react'
import axios from 'axios'

export interface User {
  email: string
  status: boolean
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000'

  // cấu hình axios để gửi cookie kèm theo request
  axios.defaults.withCredentials = true

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await axios.post(
        `${BASE_URL}/patients/login`,
        { email, password },
        { withCredentials: true } // cho phép nhận cookie từ server
      )

      if (response.data.message === 'Đăng nhập thành công!') {
        const { status } = response.data
        const userData: User = { email, status }
        setUser(userData)
      } else {
        throw new Error('Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await axios.get(`${BASE_URL}/patients/logout`, { withCredentials: true })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoading,
    }),
    [user, login, logout, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
=======
import React, { createContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

export interface User {
    email: string;
    token: string;
    status: boolean;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

    const setCookie = (name: string, value: string, maxAgeSeconds = 24 * 60 * 60) => {
    // add Secure in production and adjust SameSite as needed
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  };

  const getCookie = (name: string) => {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  };

    const login = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/accounts/login`, {
                email,
                password,
            });

            if (response.data.message === 'Đăng nhập thành công!') {
                const { tokenUser, status } = response.data;
                const userData: User = {
                    email,
                    token: tokenUser,
                    status,
                };
                setUser(userData);
                setCookie('token', tokenUser);
            } else {
                throw new Error('Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = user?.token || localStorage.getItem('token');
            if (token) {
                await axios.get(`${BASE_URL}/accounts/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setUser(null);
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            isLoading,
        }),
        [user, login, logout, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
>>>>>>> b8da650d43d362025ecbb97d76f351b703011414
