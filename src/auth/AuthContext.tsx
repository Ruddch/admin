import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../api/authApi'
import { cookies } from '../utils/cookies'

interface User {
  username: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_COOKIE = 'admin_access_token'
const USERNAME_COOKIE = 'admin_username'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUsername = cookies.get(USERNAME_COOKIE)
    return savedUsername ? { username: savedUsername } : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return cookies.get(TOKEN_COOKIE)
  })

  useEffect(() => {
    if (token) {
      // Сохраняем токен в cookie на 8 часов (expires_in = 28800 секунд)
      const days = 28800 / (24 * 60 * 60)
      cookies.set(TOKEN_COOKIE, token, days)
    } else {
      cookies.remove(TOKEN_COOKIE)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      // Сохраняем username в cookie на 30 дней
      cookies.set(USERNAME_COOKIE, user.username, 30)
    } else {
      cookies.remove(USERNAME_COOKIE)
    }
  }, [user])

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password })
      setToken(response.access_token)
      setUser({ username })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    cookies.remove(TOKEN_COOKIE)
    cookies.remove(USERNAME_COOKIE)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

