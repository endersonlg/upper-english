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

export interface Student {
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

interface Teacher {
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
  teachers: Teacher[]
  students: Student[]
  groups: Group[]
}

interface UsersContextType {
  students: Student[]
  teachers: Teacher[]
  groups: Group[]
  isLoading: boolean
  registerStudent: (data: RegisterStudent) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
  registerGroup: (data: RegisterGroup) => Promise<void>
  editGroup: (data: EditGroup) => Promise<void>
  deleteGroup: (id: string) => Promise<void>
}

export const UsersContext = createContext({} as UsersContextType)

interface UsersProviderProps {
  children: React.ReactNode
}

export function UsersProvider({ children }: UsersProviderProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setLoading] = useState(true)

  const { isAuthenticated } = useContext(AuthContext)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get<ResponseListTeachersStudentsGroups>(
        '/api/protected/listTeachersStudentsGroups',
      )

      const studentsSort = data.students.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })

      const teachersSort = data.teachers.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })

      const groupsSort = data.groups.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })

      setStudents(studentsSort)
      setTeachers(teachersSort)
      setGroups(groupsSort)
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
      await axios.post<ResponseRegisterStudent>(
        '/api/protected/registerStudent',
        {
          name,
        },
      )

      load()
    } catch (err) {
      toast.error(
        (err as AxiosError<{ error: string }>)?.response?.data?.error ??
          'Failed to register new student',
      )
    }
  }

  async function deleteStudent(id: string) {
    if (id) {
      try {
        await axios.delete(`/api/protected/deleteStudent?id=${id}`)

        load()
      } catch (err) {
        toast.error(
          (err as AxiosError<{ error: string }>)?.response?.data?.error ??
            'Failed to delete classroom',
        )
      }
    }
  }

  async function registerGroup({ name, studentsName }: RegisterGroup) {
    try {
      const studentsAux = studentsName.map((studentThisGroup) =>
        students.find((student) => student.name === studentThisGroup),
      )

      await axios.post<ResponseRegisterGroup>('/api/protected/registerGroup', {
        name,
        user_ids: studentsAux.map((student) => student?.id),
      })

      load()
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

  async function deleteGroup(id: string) {
    if (id) {
      try {
        await axios.delete(`/api/protected/deleteGroup?id=${id}`)

        load()
      } catch (err) {
        toast.error(
          (err as AxiosError<{ error: string }>)?.response?.data?.error ??
            'Failed to delete classroom',
        )
      }
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
        deleteStudent,
        registerGroup,
        editGroup,
        deleteGroup,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
