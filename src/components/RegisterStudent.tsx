import * as Dialog from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CircleNotch, X } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { Input } from './Input'
import { useContext } from 'react'
import { UsersContext } from '../context/UsersContext'

const newClassroomFormSchema = z.object({
  name: z.string(),
})

type NewClassroomFormInputs = z.infer<typeof newClassroomFormSchema>

interface RegisterStudentsProps {
  closeModal: () => void
}

export function RegisterStudents({ closeModal }: RegisterStudentsProps) {
  const { registerStudent } = useContext(UsersContext)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewClassroomFormInputs>({
    resolver: zodResolver(newClassroomFormSchema),
  })

  async function handleRegister(data: NewClassroomFormInputs) {
    const { name } = data

    await registerStudent({ name })

    reset()

    closeModal()
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed w-screen h-screen inset-0 bg-opacity-black-75" />

      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 border-2 border-solid border-gray-700 rounded-md bg-gray-900 w-full max-w-md">
        <Dialog.Close className="absolute bg-transparent border-0 top-4 right-4 cursor-pointer bg-gray-500">
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title className="text-center text-2xl text-white mb-6">
          Register student
        </Dialog.Title>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleRegister)}
        >
          <Input label="Name" required {...register('name')} />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 mt-6 bg-green-500 p-4 rounded-lg  hover:enabled:bg-green-700 transition duration-200 ease-in-out"
            disabled={isSubmitting}
          >
            {isSubmitting && <CircleNotch size={24} className="animate-spin" />}
            Confirm
          </button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
