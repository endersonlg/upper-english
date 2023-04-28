import * as Dialog from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CircleNotch, X } from 'phosphor-react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from './Input'
import { useContext, useState } from 'react'
import { Group, UsersContext } from '../context/UsersContext'
import { AutoComplete } from './AutoComplete'

import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Switch from '@radix-ui/react-switch'
import { InputMask } from './InputMask'
import { format, setMinutes } from 'date-fns'
import { NewClassroom } from '../pages'

const regexDate = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2]\d|3[0-1])\/\d{4}$/
const regexTime = /^([01]\d|2[0-3]):([0-5]\d)$/

const newClassroomFormSchema = z.object({
  teacherName: z.string(),
  unit: z.number().positive(),
  page: z.number().positive(),
  lastWord: z.string(),
  lastDictation: z.string().optional(),
  lastReading: z.string().optional(),
  date: z.string().regex(regexDate),
  time: z.string().regex(regexTime),
})

type NewClassroomFormInputs = z.infer<typeof newClassroomFormSchema>

interface SelectStudent {
  id: string
  name: string
  present: boolean
}

interface RegisterClassroomProps {
  closeModal: () => void
  registerClassroom: (newClassroom: NewClassroom) => Promise<void>
}

type GroupOrStudent = 'student' | 'group'

export function RegisterClassroom({
  closeModal,
  registerClassroom,
}: RegisterClassroomProps) {
  const [groupOrStudent, setGroupOrStudent] = useState<GroupOrStudent>('group')
  const [studentsSelected, setStudentsSelected] = useState<SelectStudent[]>([])
  const [group, setGroup] = useState<Group | null>(null)

  const { students, teachers, groups } = useContext(UsersContext)

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NewClassroomFormInputs>({
    resolver: zodResolver(newClassroomFormSchema),
    defaultValues: {
      date: format(new Date(), 'MM/dd/yyyy'),
      time: format(setMinutes(new Date(), 0), 'HH:mm'),
    },
  })

  async function handleRegister(data: NewClassroomFormInputs) {
    const {
      teacherName,
      page,
      lastWord,
      unit,
      lastDictation,
      lastReading,
      date,
      time,
    } = data

    const teacher = teachers.find((teacher) => teacher.name === teacherName)

    if (!teacher) {
      return
    }

    const groupAdjusted = group && {
      id: group.id,
      name: group.name,
    }

    console.log(groupAdjusted)

    await registerClassroom({
      teacher,
      unit,
      page,
      lastWord,
      lastDictation: lastDictation || null,
      lastReading: lastReading || null,
      date,
      time,
      studentsPresent: studentsSelected,
      group: groupAdjusted,
    })

    closeModal()
  }

  function handleChangeGroupOrStudent(option: GroupOrStudent) {
    setGroupOrStudent(option)
    setStudentsSelected([])
    setGroup(null)
  }

  function handleSelectGroup(groupName: string) {
    const group = groups.find((group) => group.name === groupName)
    if (group) {
      setGroup(group)

      setStudentsSelected(
        group.students.map((student) => ({
          id: student.id,
          name: student.name,
          present: true,
        })),
      )
    }
  }

  function handleSelectStudent(studentName: string) {
    const student = students.find((student) => student.name === studentName)
    if (student) {
      setStudentsSelected([
        {
          id: student.id,
          name: student.name,
          present: true,
        },
      ])
    }
  }

  function handleChangeStudentIsPresent(index: number, isPresent: boolean) {
    const aux = studentsSelected[index]

    aux.present = isPresent

    const studentsSelectedAux = [...studentsSelected]

    studentsSelectedAux.splice(index, 1, aux)

    setStudentsSelected(studentsSelectedAux)
  }

  function adjustTime(time: string) {
    if (!regexTime.test(time)) {
      const hour = Number(time.substring(0, 2))

      if (!Number.isNaN(hour) && hour >= 24) {
        time = time.replace(time.substring(0, 2), '23')
      }

      const minute = Number(time.substring(3, 5))

      if (!Number(isNaN(minute) && minute >= 60)) {
        time.replace(time.substring(3, 5), '59')
      }

      return time
    }
  }

  function adjustDate(date: string) {
    if (!regexDate.test(date)) {
      const month = Number(date.substring(0, 2))

      console.log('month', month)

      if (!Number.isNaN(month) && month >= 12) {
        date = date.replace(date.substring(0, 2), '12')
      }

      const day = Number(date.substring(3, 5))

      if (!Number.isNaN(day) && day >= 31) {
        date = date.replace(date.substring(3, 5), '31')
      }

      return date
    }
  }

  const optionsStudents = students.map((student) => student.name)
  const optionsGroups = groups.map((group) => group.name)

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed w-screen h-screen inset-0 bg-opacity-black-75" />

      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 border-2 border-solid border-gray-700 rounded-md bg-gray-900 w-full max-w-2xl">
        <Dialog.Close className="absolute bg-transparent border-0 top-4 right-4 cursor-pointer bg-gray-500">
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title className="text-center text-2xl text-white mb-6">
          Register Classroom
        </Dialog.Title>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleRegister)}
          autoComplete="off"
        >
          <div className="flex gap-4">
            <div className="w-2/4 flex flex-col gap-2">
              <Controller
                defaultValue={''}
                name="teacherName"
                control={control}
                render={({ field }) => (
                  <AutoComplete
                    label="Teacher"
                    options={teachers.map((teacher) => teacher.name)}
                    required
                    placeholder="Ex: Thiago"
                    error={!!errors.teacherName}
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
                  placeholder="Ex: 4"
                  {...register('unit', { valueAsNumber: true })}
                  error={!!errors.unit}
                />

                <Input
                  className="col-span-1"
                  label="Page"
                  min={1}
                  required
                  placeholder="Ex: 9"
                  {...register('page', { valueAsNumber: true })}
                  error={!!errors.page}
                />

                <Input
                  label="Last Word"
                  className="col-span-2"
                  required
                  placeholder="Ex: wood"
                  {...register('lastWord')}
                  error={!!errors.lastWord}
                />
              </div>

              <div className="flex gap-6">
                <Input
                  label="Last dictation"
                  placeholder="Ex: dictation 5"
                  {...register('lastDictation')}
                  error={!!errors.lastDictation}
                />

                <Input
                  label="Last reading"
                  placeholder="Ex: reading 9"
                  {...register('lastReading')}
                  error={!!errors.lastReading}
                />
              </div>

              <div className="flex gap-6">
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { onChange, value } }) => (
                    <InputMask
                      label="Date"
                      className="col-span-2"
                      required
                      placeholder="MM/DD/YYYY"
                      onChange={({ target }) => {
                        onChange(adjustDate(target.value))
                      }}
                      value={value}
                      mask={'Mm/Dd/yyyy'}
                      maskChar={'_'}
                      // @ts-expect-error
                      formatChars={{
                        M: '[0-1]',
                        m: '[0-9]',
                        D: '[0-3]',
                        d: '[0-9]',
                        y: '[0-9]',
                      }}
                      error={!!errors.date}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="time"
                  render={({ field: { onChange, value } }) => (
                    <InputMask
                      label="Time"
                      className="col-span-2"
                      required
                      placeholder="HH:MM"
                      onChange={({ target }) => {
                        onChange(adjustTime(target.value))
                      }}
                      value={value}
                      mask={'12:34'}
                      maskChar={'0'}
                      // @ts-expect-error
                      formatChars={{
                        '1': '[0-2]',
                        '2': '[0-9]',
                        '3': '[0-5]',
                        '4': '[0-9]',
                      }}
                      error={!!errors.time}
                    />
                  )}
                />
              </div>
            </div>
            <hr className="w-px bg-gray-700 h-auto border-0" />
            <div className="w-2/4">
              <div className="flex gap-2 mb-2">
                <span>Type</span>
                <RadioGroup.Root
                  className="flex flex-1 justify-end gap-2"
                  value={groupOrStudent}
                  onValueChange={(value: GroupOrStudent) =>
                    handleChangeGroupOrStudent(value)
                  }
                >
                  <div className="flex items-center gap-2">
                    <RadioGroup.Item
                      className="bg-gray-600 w-4 h-4 rounded-full shadow-gray-100 hover:bg-gray-700"
                      value="group"
                      id="r1"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content after:block after:w-2 after:h-2 after:rounded-md after:bg-green-300 " />
                    </RadioGroup.Item>
                    <label className="cursor-pointer" htmlFor="r1">
                      Group
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroup.Item
                      className="bg-gray-600 w-4 h-4 rounded-full shadow-gray-100 hover:bg-gray-700"
                      value="student"
                      id="r2"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content after:block after:w-2 after:h-2 after:rounded-md after:bg-green-300 " />
                    </RadioGroup.Item>
                    <label className="cursor-pointer" htmlFor="r2">
                      Student
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>

              {groupOrStudent === 'student' ? (
                <AutoComplete
                  options={optionsStudents}
                  required
                  onChange={(value) => handleSelectStudent(value)}
                  placeholder="Ex: Enderson"
                  value={
                    studentsSelected.length ? studentsSelected[0].name : ''
                  }
                />
              ) : (
                <AutoComplete
                  options={optionsGroups}
                  required
                  onChange={(value) => handleSelectGroup(value)}
                  placeholder="Ex: Group Dublin"
                  value={group?.name || ''}
                />
              )}

              <div className="flex flex-col mt-4">
                <div className="flex justify-between">
                  <h4 className="mb-0.5 pb-0.5 border-b-2 border-green-700">
                    Students
                  </h4>
                  <h4 className="mb-0.5 pb-0.5 border-b-2 border-green-700">
                    Present
                  </h4>
                </div>

                <div className="mt-2 h-48 overflow-y-auto">
                  {studentsSelected.map((studentSelected, index) => (
                    <div
                      className="flex gap-4 pr-2 justify-between items-center mb-2 last:mb-0"
                      key={`student-selected-${studentSelected.name}`}
                    >
                      <label className="cursor-pointer" htmlFor="airplane-mode">
                        {studentSelected.name}
                      </label>
                      <Switch.Root
                        className="w-10 h-6 bg-gray-700 rounded-full relative shadow-sm shadow-gray-600"
                        id="airplane-mode"
                        onCheckedChange={(value) =>
                          handleChangeStudentIsPresent(index, value)
                        }
                        checked={studentSelected.present}
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-gray-500 hover:bg-gray-600 shadow-sm rounded-full duration-200 transition translate-x-0.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-green-500 data-[state=checked]:hover:bg-green-700" />
                      </Switch.Root>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
