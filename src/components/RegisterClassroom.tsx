import * as Dialog from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CircleNotch, X } from 'phosphor-react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from './Input'
import { useContext } from 'react'
import { UsersContext } from '../context/UsersContext'
import { AutoComplete } from './AutoComplete'

const newClassroomFormSchema = z.object({
  student: z.string(),
  teacher: z.string(),
  unit: z.number().positive(),
  group: z.number().positive(),
  lastWord: z.string(),
  lastDictation: z.string().optional(),
  lastReading: z.string().optional(),
})

type NewClassroomFormInputs = z.infer<typeof newClassroomFormSchema>

interface NewClassroom {
  student: string
  teacher: string
  unit: number
  group: number
  lastWord: string
  lastDictation: string | null
  lastReading: string | null
}

interface RegisterClassroomProps {
  closeModal: () => void
  registerClassroom: (newClassroom: NewClassroom) => Promise<void>
}

export function RegisterClassroom({
  closeModal,
  registerClassroom,
}: RegisterClassroomProps) {
  const { students, teachers } = useContext(UsersContext)

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewClassroomFormInputs>({
    resolver: zodResolver(newClassroomFormSchema),
  })

  async function handleRegister(data: NewClassroomFormInputs) {
    const {
      student,
      teacher,
      group,
      lastWord,
      unit,
      lastDictation,
      lastReading,
    } = data

    await registerClassroom({
      student,
      teacher,
      group,
      lastWord,
      unit,
      lastDictation: lastDictation || null,
      lastReading: lastReading || null,
    })

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
          Register classroom
        </Dialog.Title>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleRegister)}
          autoComplete="off"
        >
          <Controller
            defaultValue={''}
            name="student"
            control={control}
            render={({ field }) => (
              <AutoComplete
                label="Student"
                options={students.map((student) => student.name)}
                required
                {...field}
              />
            )}
          />

          <Controller
            defaultValue={''}
            name="teacher"
            control={control}
            render={({ field }) => (
              <AutoComplete
                label="Teacher"
                options={teachers.map((teacher) => teacher.name)}
                required
                {...field}
              />
            )}
          />

          <div className="grid grid-cols-4 gap-6 ">
            <Input
              className="col-span-1"
              label="Unit"
              min={1}
              required
              {...register('unit', { valueAsNumber: true })}
            />

            <Input
              className="col-span-1"
              label="Group"
              min={1}
              required
              {...register('group', { valueAsNumber: true })}
            />

            <Input
              label="Last Word"
              className="col-span-2"
              required
              {...register('lastWord')}
            />
          </div>

          <div className="flex gap-6">
            <Input label="Last dictation" {...register('lastDictation')} />

            <Input label="Last reading" {...register('lastReading')} />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 mt-6 bg-green-500 p-4 rounded-lg  hover:enabled:bg-green-700 transition duration-200 ease-in-out"
            disabled={isSubmitting}
          >
            {isSubmitting && <CircleNotch size={24} className="animate-spin" />}
            Register
          </button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
