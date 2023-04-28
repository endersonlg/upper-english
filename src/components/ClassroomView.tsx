import * as Dialog from '@radix-ui/react-dialog'
import { User, X } from 'phosphor-react'
import { Classroom } from '../pages'

interface ClassroomViewProps {
  classroom: Classroom
}

export function ClassroomView({ classroom }: ClassroomViewProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed w-screen h-screen inset-0 bg-opacity-black-75" />

      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 border-2 border-solid border-gray-700 rounded-md bg-gray-900 w-auto max-w-2/4 max-h-3/4 overflow-y-scroll">
        <Dialog.Close className="absolute bg-transparent border-0 top-4 right-4 cursor-pointer bg-gray-500">
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title className="text-center text-2xl text-white mb-6">
          Students Present
        </Dialog.Title>

        <div>
          {classroom.students.map((student) => (
            <div
              key={`student-${student.id}`}
              className="flex justify-between items-center gap-8 pb-2 mt-2 last:pb-0 border-b border-gray-800 last:border-none"
            >
              <div className="flex gap-2">
                <User size={24} weight="bold" className="text-gray-800" />
                <span>{student.name}</span>
              </div>
              <span
                className={student.present ? 'text-green-500' : 'text-red-500'}
              >
                {student.present ? 'present' : 'missed'}
              </span>
            </div>
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
