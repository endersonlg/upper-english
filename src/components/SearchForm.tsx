import { zodResolver } from '@hookform/resolvers/zod'
import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormInputs = z.infer<typeof searchFormSchema>

interface SearchFormProps {
  search: (query: string) => Promise<void> | void
}

export function SearchForm({ search }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  })

  async function handleSearchTransactions({ query }: SearchFormInputs) {
    await search(query)
  }

  return (
    <form
      onSubmit={handleSubmit(handleSearchTransactions)}
      className="flex w-full mb-6 gap-4"
    >
      <input
        type="text"
        placeholder="Search"
        className="flex-1 rounded-md border-0 bg-gray-600 text-gray-300 p-4 placeholder:text-gray-500"
        {...register('query')}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-3 p-4 bg-transparent border border-solid border-green-300 font-bold  rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed enabled:hover:bg-green-500  enabled:hover:border-green-500 enabled:hover:text-white transition-all duration-200"
      >
        <MagnifyingGlass size={20} />
      </button>
    </form>
  )
}
