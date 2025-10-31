// context/AuthContext.tsx
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
