import axios, { AxiosError } from 'axios'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from './AuthContext'

interface RegisterStudent {
  name: string
}

interface RegisterGroup {
  name: string
  studentsName: string[]
}

interface Student {
  id: string
  name: string
  group_id?: string
}

export interface Group {
  id: string
  name: string
  students: Student[]
}

interface EditGroup {
  group: Group
  name: string
  studentsName: string[]
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

interface ResponseRegisterGroup {
  group: {
    id: string
  }
}

interface ResponseListTeachersStudentsGroups {
  teachers: Teachers[]
  students: Student[]
  groups: Group[]
}

interface UsersContextType {
  students: Student[]
  teachers: Teachers[]
  groups: Group[]
  isLoading: boolean
  registerStudent: (data: RegisterStudent) => Promise<void>
  registerGroup: (data: RegisterGroup) => Promise<void>
  editGroup: (data: EditGroup) => Promise<void>
}

export const UsersContext = createContext({} as UsersContextType)

interface UsersProviderProps {
  children: React.ReactNode
}

export function UsersProvider({ children }: UsersProviderProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teachers[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setLoading] = useState(true)

  const { isAuthenticated } = useContext(AuthContext)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get<ResponseListTeachersStudentsGroups>(
        '/api/protected/listTeachersStudentsGroups',
      )

      setStudents(data.students)
      setTeachers(data.teachers)
      setGroups(data.groups)
    } catch (err) {
      toast.error(
        (err as AxiosError<{ error: string }>)?.response?.data?.error ??
          'Failed to load students and teachers',
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      load()
    }
  }, [isAuthenticated, load])

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

  async function registerGroup({ name, studentsName }: RegisterGroup) {
    try {
      const studentsAux = studentsName.map((studentThisGroup) =>
        students.find((student) => student.name === studentThisGroup),
      )

      const { data } = await axios.post<ResponseRegisterGroup>(
        '/api/protected/registerGroup',
        {
          name,
          user_ids: studentsAux.map((student) => student?.id),
        },
      )

      setGroups((state) => [
        {
          id: data.group.id,
          name,
          students: studentsAux as Student[],
        },
        ...state,
      ])
    } catch (err) {
      toast.error(
        (err as AxiosError<{ error: string }>)?.response?.data?.error ??
          'Failed to register new student',
      )
    }
  }

  async function editGroup({ group, name, studentsName }: EditGroup) {
    try {
      const removeStudentsId = group.students
        .filter((students) => !studentsName.includes(students.name))
        .map((student) => student.id)

      const newStudentsName = studentsName.filter(
        (studentName) =>
          !group.students.some((student) => student.name === studentName),
      )

      const newStudentsId = students
        .filter((student) => newStudentsName.includes(student.name))
        .map((student) => student.id)

      await axios.post<ResponseRegisterGroup>('/api/protected/editGroup', {
        id: group.id,
        name,
        removeStudentsId,
        newStudentsId,
      })

      load()
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
        groups,
        isLoading,
        registerStudent,
        registerGroup,
        editGroup,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
