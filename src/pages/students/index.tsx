import { ModalDelete } from '@/src/components/ModalDelete'
import { RegisterStudents } from '@/src/components/RegisterStudent'
import { SearchForm } from '@/src/components/SearchForm'
import { Td } from '@/src/components/table/Td'
import { Th } from '@/src/components/table/Th'
import { Student, UsersContext } from '@/src/context/UsersContext'
import { sessionOptions } from '@/src/lib/session'
import * as Dialog from '@radix-ui/react-dialog'
import { withIronSessionSsr } from 'iron-session/next'

import { MagnifyingGlass, Trash } from 'phosphor-react'
import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'

const limit = 8

export default function Students() {
  const [studentsFiltered, setStudentsFiltered] = useState<Student[]>([])

  const { students, isLoading, deleteStudent } = useContext(UsersContext)

  const [page, setPage] = useState(1)

  const [studentIdToDelete, setStudentIdToDelete] = useState<string | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setStudentsFiltered(students)
  }, [students])

  function searchStudents(query: string) {
    setPage(1)
    if (!query) {
      setStudentsFiltered(students)
    }
    setStudentsFiltered(
      students.filter((students) =>
        students.name.toUpperCase().includes(query.toUpperCase()),
      ),
    )
  }

  function handleCloseModalRegisterNewStudent() {
    setIsModalOpen(false)
  }

  function handleOpenModalDeleteStudent(id: string) {
    setStudentIdToDelete(id)
  }

  function handleCloseModalStudentToDelete() {
    setStudentIdToDelete(null)
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage((state) => state - 1)
    }
  }

  function handleNextPage() {
    setPage((state) => state + 1)
  }

  const total = studentsFiltered.length
  const hasMore = page * limit >= total
  const paginatedStudents = studentsFiltered.slice(
    (page - 1) * limit,
    page * limit,
  )

  return (
    <main className="p-8 h-screen w-full flex flex-col items-center justify-center">
      <SearchForm search={searchStudents} />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <Th className="text-left">Name</Th>
            <Th className="text-right">
              <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    className="bg-green-500 px-4 py-2 rounded-md hover:enabled:bg-green-700 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Add
                  </button>
                </Dialog.Trigger>
                {isModalOpen && (
                  <RegisterStudents
                    closeModal={handleCloseModalRegisterNewStudent}
                  />
                )}
              </Dialog.Root>
            </Th>
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            paginatedStudents.map((student) => (
              <tr key={student.id}>
                <Td className="w-2/4">{student.name}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <Link href={`/students/${student.id}`}>
                      <MagnifyingGlass size={24} weight="bold" />
                    </Link>
                    <button className="block text-gray-300 hover:enabled:text-gray-500 transition duration-200 ease-in-out disabled:text-gray-600 disabled:cursor-not-allowed">
                      <Trash
                        size={24}
                        weight="fill"
                        onClick={() => handleOpenModalDeleteStudent(student.id)}
                      />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
        </tbody>
      </table>

      <Dialog.Root
        open={!!studentIdToDelete}
        onOpenChange={handleCloseModalStudentToDelete}
      >
        {studentIdToDelete && (
          <ModalDelete
            content="student"
            handleDelete={() => deleteStudent(studentIdToDelete)}
            closeModal={handleCloseModalStudentToDelete}
          />
        )}
      </Dialog.Root>

      {isLoading && (
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
          Showing <b>{(page - 1) * (limit ?? 0) + 1}</b> -{' '}
          <b>{page * (limit ?? 0) < total ? page * (limit ?? 0) : total}</b> of{' '}
          <b>{total}</b> students
        </span>
      </div>
    </main>
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
