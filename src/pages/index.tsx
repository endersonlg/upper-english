import { RegisterClassroom } from '../components/RegisterClassroom'
import * as Dialog from '@radix-ui/react-dialog'
import { Trash } from 'phosphor-react'
import { Th } from '../components/table/Th'
import { Td } from '../components/table/Td'
import axios, { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { UsersContext } from '../context/UsersContext'
import { toast } from 'react-toastify'
import { useQuery } from 'react-query'
import { queryClient } from '../lib/queryClient'

interface Student {
  id: string
  name: string
}

interface Teacher {
  id: string
  name: string
}

interface ClassroomsProps {
  teachers: Teacher[]
  students: Student[]
}

interface NewClassroom {
  student: string
  teacher: string
  unit: number
  group: number
  lastWord: string
  lastDictation: string | null
  lastReading: string | null
}

interface Classroom {
  id: string
  student: string
  teacher: string
  unit: number
  group: number
  lastWord: string
  lastDictation?: string
  lastReading?: string
}

interface ResponseClassroom {
  classrooms: Classroom[]
  after?: string
  before?: string
  total: number
}

const limit = 8

export default function Classrooms(props: ClassroomsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [after, setAfter] = useState<string | null>(null)
  const [before, setBefore] = useState<string | null>(null)

  const { isLoading: isLoadingUsers } = useContext(UsersContext)

  const { data, isLoading, isFetching } = useQuery(
    ['classrooms', page],
    async () => {
      const params = new URLSearchParams()

      if (after) {
        params.set('after', after)
      } else if (before) {
        params.set('before', before)
      }

      const response = await axios.get<ResponseClassroom>(
        '/api/listClassrooms?' + params.toString(),
      )

      setAfter(null)
      setBefore(null)

      return response.data
    },
    {
      staleTime: 1000 * 1,
    },
  )

  function closeModal() {
    setIsModalOpen(false)
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
      student,
      teacher,
      group,
      lastWord,
      unit,
      lastDictation,
      lastReading,
    } = newClassroom

    try {
      await axios.post('/api/registerClassroom', {
        student,
        teacher,
        group,
        lastWord,
        unit,
        lastDictation,
        lastReading,
      })

      queryClient.removeQueries('classrooms')
    } catch (err) {
      toast.error(
        (err as AxiosError<{ error: string }>)?.response?.data?.error ??
          'Failed to register new classroom',
      )
    }
  }

  const hasMore = page * limit >= total

  return (
    <>
      <main className="p-8 h-screen w-full flex flex-col items-center justify-center">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th className="text-left">Name</Th>
              <Th className="text-left">Date</Th>
              <Th className="text-left">U - P</Th>
              <Th className="text-left">Last word</Th>
              <Th className="text-left">Last Dictation</Th>
              <Th className="text-left">Last reading</Th>
              <Th className="text-left">Teacher</Th>
              <Th className="text-right">
                <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      className="bg-green-500 px-4 py-2 rounded-md hover:enabled:bg-green-700 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={isLoadingUsers}
                    >
                      Add
                    </button>
                  </Dialog.Trigger>
                  {isModalOpen && (
                    <RegisterClassroom
                      closeModal={closeModal}
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
              data?.classrooms?.map((classroom) => (
                <tr key={classroom.id}>
                  <Td>{classroom.student}</Td>
                  <Td>--</Td>
                  <Td>{`${classroom.unit} -  ${classroom.group}`}</Td>
                  <Td>{classroom.lastWord}</Td>
                  <Td>{classroom.lastDictation ?? '--'}</Td>
                  <Td>{classroom.lastReading ?? '--'}</Td>
                  <Td>{classroom.teacher}</Td>
                  <Td>
                    <button className="block ml-auto text-gray-300 hover:enabled:text-gray-500 transition duration-200 ease-in-out">
                      <Trash size={24} weight="fill" />
                    </button>
                  </Td>
                </tr>
              ))}
          </tbody>
        </table>

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
