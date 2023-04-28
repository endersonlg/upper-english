import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CircleNotch, X } from 'phosphor-react'

interface ModalDeleteProps {
  handleDelete: () => Promise<void>
  content: string
  closeModal: () => void
}

export function ModalDelete({
  handleDelete,
  content,
  closeModal,
}: ModalDeleteProps) {
  const [loading, setLoading] = useState(false)
  async function handleConfirm() {
    setLoading(true)
    await handleDelete()
    closeModal()
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed w-screen h-screen inset-0 bg-opacity-black-75" />

      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 border-2 border-solid border-gray-700 rounded-md bg-gray-900 w-full max-w-sm max-h-3/4 overflow-y-scroll">
        <Dialog.Close className="absolute bg-transparent border-0 top-4 right-4 cursor-pointer bg-gray-500">
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title className="text-center text-2xl text-white mb-6">
          {`Are you sure you want to delete this ${content} ?`}
        </Dialog.Title>

        <button
          type="button"
          onClick={handleConfirm}
          className="flex mx-auto items-center  justify-center gap-2 mt-12 bg-red-500 p-4 rounded-lg  hover:enabled:bg-red-700 transition duration-200 ease-in-out"
        >
          {loading && <CircleNotch size={24} className="animate-spin" />}
          Confirm
        </button>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
