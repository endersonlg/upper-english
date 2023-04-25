import * as Dialog from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CircleNotch, MinusCircle, PlusCircle, X } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { Input } from './Input'
import { useContext, useEffect, useState } from 'react'
import { Group, UsersContext } from '../context/UsersContext'
import { AutoComplete } from './AutoComplete'
import { toast } from 'react-toastify'

const EditGroupFormSchema = z.object({
  name: z.string(),
})

type EditGroupFormInputs = z.infer<typeof EditGroupFormSchema>

interface EditGroupProps {
  group: Group
  closeModal: () => void
}

export function EditGroup({ group, closeModal }: EditGroupProps) {
  const [studentsThisGroup, setStudentsThisGroup] = useState<string[]>([])

  console.log(group)

  useEffect(() => {
    function loadDefaultStudents() {
      setStudentsThisGroup(group.students.map((students) => students.name))
    }
    loadDefaultStudents()
  }, [group])

  const { students, editGroup } = useContext(UsersContext)

  const studentsWithoutGroup = students.filter((student) => !student.group_id)

  const availableStudents = [...studentsWithoutGroup, ...group.students]

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<EditGroupFormInputs>({
    resolver: zodResolver(EditGroupFormSchema),
    defaultValues: {
      name: group.name,
    },
  })

  async function handleEdit({ name }: EditGroupFormInputs) {
    await editGroup({ group, name, studentsName: studentsThisGroup })

    reset()

    closeModal()
  }

  function handleIncrementNumberOfStudents() {
    if (
      !availableStudents
        .map((student) => student.name)
        .filter((student) => !studentsThisGroup.includes(student)).length
    ) {
      toast.warning('There are not student without group to add !!')
      return
    }
    setStudentsThisGroup((state) => [...state, ''])
  }

  function handleAddUser(name: string, index: number) {
    setStudentsThisGroup((state) => {
      return state.map((student, indexAux) =>
        index === indexAux ? name : student,
      )
    })
  }

  function removeStudent(index: number) {
    setStudentsThisGroup((state) => {
      const aux = [...state]
      aux.splice(index, 1)
      return aux
    })
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed w-screen h-screen inset-0 bg-opacity-black-75" />

      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 border-2 border-solid border-gray-700 rounded-md bg-gray-900 w-full max-w-md max-h-3/4 overflow-y-scroll">
        <Dialog.Close className="absolute bg-transparent border-0 top-4 right-4 cursor-pointer bg-gray-500">
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title className="text-center text-2xl text-white mb-6">
          Edit Group
        </Dialog.Title>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleEdit)}
          autoComplete="off"
        >
          <Input label="Name" required {...register('name')} />

          <div className="flex  justify-between items-center mt-4 pb-1 border-b border-gray-600">
            <h2 className="text-lg  text-gray-400 ">Add students</h2>
            <button
              type="button"
              className="text-green-300 transition duration-200 hover:enabled:text-green-500"
              onClick={handleIncrementNumberOfStudents}
            >
              <PlusCircle size={24} weight="bold" />
            </button>
          </div>

          {Array.from({ length: studentsThisGroup.length }, (_, index) => (
            <div
              key={`input-student-${index}`}
              className="flex justify-between gap-2"
            >
              <AutoComplete
                label={index === 0 ? 'Students' : undefined}
                className="flex-1"
                options={availableStudents
                  .map((student) => student.name)
                  .filter((student) => !studentsThisGroup.includes(student))}
                required
                onChange={(val) => handleAddUser(val, index)}
                value={studentsThisGroup[index]}
              />

              <button
                type="button"
                className={`text-red-500 transition duration-200 hover:enabled:text-red-700 ${
                  index === 0 && 'mt-8'
                }`}
                onClick={() => removeStudent(index)}
              >
                <MinusCircle size={24} weight="bold" />
              </button>
            </div>
          ))}

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
