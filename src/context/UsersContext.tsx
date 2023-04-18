import axios, { AxiosError } from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from './AuthContext'

interface RegisterStudent {
  name: string
}

interface Student {
  id: string
  name: string
}

interface Teachers {
  id: string
  name: string
}

interface ResponseRegisterStudent {
  student: {
    id: string
    name: string
  }
}

interface ResponseListTeachersAndStudents {
  teachers: []
  students: []
}

interface UsersContextType {
  students: Student[]
  teachers: Teachers[]
  isLoading: boolean
  registerStudent: (data: RegisterStudent) => Promise<void>
}

export const UsersContext = createContext({} as UsersContextType)

interface UsersProviderProps {
  children: React.ReactNode
}

export function UsersProvider({ children }: UsersProviderProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teachers[]>([])
  const [isLoading, setLoading] = useState(true)

  const { isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get<ResponseListTeachersAndStudents>(
          '/api/protected/listTeachersAndStudents',
        )

        setStudents(data.students)
        setTeachers(data.teachers)
        setLoading(false)
      } catch (err) {
        toast.error(
          (err as AxiosError<{ error: string }>)?.response?.data?.error ??
            'Failed to load students and teachers',
        )
      }
    }

    if (isAuthenticated) {
      load()
    }
  }, [isAuthenticated])

  async function registerStudent({ name }: RegisterStudent) {
    try {
      const { data } = await axios.post<ResponseRegisterStudent>(
        '/api/protected/registerStudent',
        {
          name,
        },
      )

      setStudents((state) => [data.student, ...state])
    } catch (err) {
      toast.error(
        (err as AxiosError<{ error: string }>)?.response?.data?.error ??
          'Failed to register new student',
      )
    }
  }

  return (
    <UsersContext.Provider
      value={{
        students,
        teachers,
        isLoading,
        registerStudent,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
