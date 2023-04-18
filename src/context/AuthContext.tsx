import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface LoginProps {
  password: string
}

export interface Auth {
  isAuthenticated: boolean
}

export interface AuthContextType {
  isAuthenticated: boolean
  login: (data: LoginProps) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    async function authentication() {
      try {
        const { data } = await axios.get<Auth>('/api/getAuthentication')
        setIsAuthenticated(data.isAuthenticated)
      } catch (err) {
        toast.error('Failed to login')
      }
    }

    authentication()
  }, [])

  async function login({ password }: LoginProps) {
    try {
      await axios.post('/api/authenticate', {
        password,
      })
      setIsAuthenticated(true)
      router.push('/')
    } catch (err) {
      toast.error(
        (err as AxiosError<{ error: string }>)?.response?.data?.error ??
          'Failed to login',
      )
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
