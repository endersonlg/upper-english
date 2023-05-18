import { RegisterClassroom } from '../components/RegisterClassroom'
import * as Dialog from '@radix-ui/react-dialog'
import { Binoculars, Trash } from 'phosphor-react'
import { Th } from '../components/table/Th'
import { Td } from '../components/table/Td'
import axios, { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { UsersContext } from '../context/UsersContext'
import { toast } from 'react-toastify'
import { useQuery } from 'react-query'
import { queryClient } from '../lib/queryClient'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../lib/session'
import { format, parse } from 'date-fns'
import { ClassroomView } from '../components/ClassroomView'
import { ModalDelete } from '../components/ModalDelete'
import { SearchForm } from '../components/SearchForm'

export interface NewClassroom {
  teacher: {
    id: string
    name: string
  }
  unit: number
  page: number
  lastWord: string
  lastDictation: string | null
  lastReading: string | null
  date: string
  time: string
  studentsPresent: {
    id: string
    name: string
    present: boolean
  }[]
  group: {
    id: string
    name: string
  } | null
}

export interface Classroom {
  id: string
  students: {
    id: string
    name: string
    present: boolean
  }[]
  teacher: {
    id: string
    name: string
  }
  unit: number
  page: number
  lastWord: string
  lastDictation?: string
  lastReading?: string
  dateShow: string
  group?: {
    id: string
    name: string
  }
}

interface ResponseClassroom {
  classrooms: Classroom[]
  after?: string[]
  before?: string[]
  total: number
}

const limit = 8

export default function Classrooms() {
  const [isRegisterClassroomModalOpen, setRegisterClassroomIsModalOpen] =
    useState(false)

  const [classroomToView, setClassroomToView] = useState<Classroom | null>(null)
  const [classroomIdToDelete, setClassroomIdToDelete] = useState<string | null>(
    null,
  )

  const [search, setSearch] = useState<string>('')

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [after, setAfter] = useState<string[] | null>(null)
  const [before, setBefore] = useState<string[] | null>(null)

  const { isLoading: isLoadingUsers } = useContext(UsersContext)

  const { data, isLoading, isFetching } = useQuery(
    ['classrooms', page, search],
    async () => {
      const params = new URLSearchParams()

      if (after) {
        params.set('after', after.toString())
      } else if (before) {
        params.set('before', before.toString())
      }

      if (search) {
        params.set('search', search)
      }

      const response = await axios.get<ResponseClassroom>(
        '/api/protected/listClassrooms?' + params.toString(),
      )

      setAfter(null)
      setBefore(null)

      return response.data
    },
    {
      staleTime: 1000 * 60 * 60 * 1,
    },
  )

  function handleSearch(query: string) {
    setPage(1)
    setSearch(query)
  }

  function handleCloseModalRegisterNewClassroom() {
    setRegisterClassroomIsModalOpen(false)
  }

  function handleOpenModalViewClassroom(id: string) {
    const classroom = data?.classrooms.find((classroom) => classroom.id === id)
    if (classroom) {
      setClassroomToView(classroom)
    }
  }

  function handleCloseModalClassroomToView() {
    setClassroomToView(null)
  }

  function handleOpenModalDeleteClassroom(id: string) {
    setClassroomIdToDelete(id)
  }

  function handleCloseModalClassroomToDelete() {
    setClassroomIdToDelete(null)
  }

  function handleNextPage() {
    setPage((state) => state + 1)
    if (data?.after) {
      setAfter(data.after)
    }
  }

  function handlePrevPage() {
    setPage((state) => state - 1)
    if (data?.before) {
      setBefore(data.before)
    }
  }

  useEffect(() => {
    setAfter(null)
    setBefore(null)
    if (data?.total) {
      setTotal(data.total)
    }
  }, [data])

  async function registerClassroom(newClassroom: NewClassroom) {
    const {
      teacher,
      unit,
      page,
      lastWord,
      lastDictation,
      lastReading,
      date,
      time,
      studentsPresent,
      group,
    } = newClassroom

    const dateTime = parse(`${date} ${time}`, 'MM/dd/yyyy HH:mm', new Date())

    const dateShow = format(dateTime, "iii, MMM d, yyyy 'at' H:mm a")

    try {
      await axios.post('/api/protected/registerClassroom', {
        teacher,
        students: studentsPresent,
        unit,
        page,
        lastWord,
        lastDictation,
        lastReading,
        dateTime,
        dateShow,
        group,
      })

      queryClient.removeQueries('classrooms')
    } catch (err) {
      toast.error(
        (err as AxiosError<{ error: string }>)?.response?.data?.error ??
          'Failed to register new classroom',
      )
    }
  }

  async function deleteClassroom() {
    if (classroomIdToDelete) {
      try {
        await axios.delete(
          `/api/protected/deleteClassroom?id=${classroomIdToDelete}`,
        )
        queryClient.removeQueries('classrooms')
        queryClient.removeQueries('ClassroomsOfStudent')
      } catch (err) {
        toast.error(
          (err as AxiosError<{ error: string }>)?.response?.data?.error ??
            'Failed to delete classroom',
        )
      }
    }
  }

  const hasMore = page * limit >= total

  const classroomsToShow = data?.classrooms.map((classroom) => ({
    id: classroom.id,
    name: classroom.group
      ? classroom.group.name
      : classroom.students.map((student) => student.name).toString(),
    dateShow: classroom.dateShow,
    unit: classroom.unit,
    page: classroom.page,
    lastWord: classroom.lastWord,
    lastDictation: classroom.lastDictation ?? '--',
    lastReading: classroom.lastReading ?? '--',
    teacher: classroom.teacher.name,
  }))

  return (
    <>
      <main className="p-8 h-screen w-full flex flex-col items-center justify-center">
        <SearchForm search={handleSearch} />
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th className="text-left">Date</Th>
              <Th className="text-left">Name ( Group | Student )</Th>
              <Th className="text-left">U</Th>
              <Th className="text-left">P</Th>
              <Th className="text-left">Last word</Th>
              <Th className="text-left">Last Dictation</Th>
              <Th className="text-left">Last reading</Th>
              <Th className="text-left">Teacher</Th>
              <Th className="text-right">
                <Dialog.Root
                  open={isRegisterClassroomModalOpen}
                  onOpenChange={setRegisterClassroomIsModalOpen}
                >
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      className="bg-green-500 px-4 py-2 rounded-md hover:enabled:bg-green-700 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={isLoadingUsers}
                    >
                      Add
                    </button>
                  </Dialog.Trigger>
                  {isRegisterClassroomModalOpen && (
                    <RegisterClassroom
                      closeModal={handleCloseModalRegisterNewClassroom}
                      registerClassroom={registerClassroom}
                    />
                  )}
                </Dialog.Root>
              </Th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              !isFetching &&
              classroomsToShow?.map((classroom) => (
                <tr key={classroom.id}>
                  <Td className="whitespace-nowrap">{classroom.dateShow}</Td>
                  <Td>{classroom.name}</Td>
                  <Td>{classroom.unit}</Td>
                  <Td>{classroom.page}</Td>
                  <Td>{classroom.lastWord}</Td>
                  <Td>{classroom.lastDictation}</Td>
                  <Td>{classroom.lastReading}</Td>
                  <Td>{classroom.teacher}</Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <button
                        className="block ml-auto text-gray-300 hover:enabled:text-gray-500 transition duration-200 ease-in-out disabled:text-gray-600 disabled:cursor-not-allowed"
                        onClick={() =>
                          handleOpenModalViewClassroom(classroom.id)
                        }
                      >
                        <Binoculars size={24} weight="fill" />
                      </button>
                      <button
                        className="block ml-auto text-gray-300 hover:enabled:text-gray-500 transition duration-200 ease-in-out disabled:text-gray-600 disabled:cursor-not-allowed"
                        onClick={() =>
                          handleOpenModalDeleteClassroom(classroom.id)
                        }
                      >
                        <Trash size={24} weight="fill" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
          </tbody>
        </table>

        <Dialog.Root
          open={!!classroomToView}
          onOpenChange={handleCloseModalClassroomToView}
        >
          {classroomToView && <ClassroomView classroom={classroomToView} />}
        </Dialog.Root>

        <Dialog.Root
          open={!!classroomIdToDelete}
          onOpenChange={handleCloseModalClassroomToDelete}
        >
          {classroomIdToDelete && (
            <ModalDelete
              content="classroom"
              handleDelete={deleteClassroom}
              closeModal={handleCloseModalClassroomToDelete}
            />
          )}
        </Dialog.Root>

        {(isLoading || isFetching) && (
          <div
            role="status"
            className="flex items-center justify-center h-96 my-12"
          >
            <svg
              aria-hidden="true"
              className="w-12 h-12 mr-2 text-gray-600 animate-spin dark:text-gray-10000 fill-green-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-6 ">
          <div className="flex justify-center items-center gap-4">
            <button
              className="text-gray-400 hover:enabled:text-gray-300 transition duration-200 ease-in-out disabled:cursor-not-allowed disabled:text-gray-500"
              disabled={page === 1}
              onClick={handlePrevPage}
            >
              Prev
            </button>

            <span className="bg-green-500 px-2 rounded-md text-gray-300 text-center">
              {page}
            </span>

            <button
              className="text-gray-400 hover:enabled:text-gray-300 transition duration-200 ease-in-out disabled:cursor-not-allowed disabled:text-gray-500"
              disabled={hasMore}
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
          <span className="block text-center text-xs text-gray-500">
            Showing <b>{(page - 1) * limit + 1}</b> -{' '}
            <b>{page * limit < total ? page * limit : total}</b> of{' '}
            <b>{total}</b> classrooms
          </span>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
  const auth = req.session.auth

  if (auth?.isAuthenticated === undefined) {
    return {
      redirect: {
        destination: '/login',
        statusCode: 302,
      },
    }
  }

  return {
    props: {},
  }
}, sessionOptions)
