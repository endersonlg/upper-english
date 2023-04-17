import React, { ForwardedRef, Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Input } from './Input'

interface AutoCompleteProps {
  label: string
  options: string[]
  required: boolean
  onChange: (value: string) => void
  value: string
}

export const AutoComplete = React.forwardRef(function AutoComplete(
  { label, options, required, onChange, value }: AutoCompleteProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [query, setQuery] = useState('')

  const filteredOption =
    query === ''
      ? options
      : options.filter((option) =>
          option
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        )

  return (
    <Combobox onChange={onChange} value={value} ref={ref}>
      <div className="relative">
        <Combobox.Input
          as={Input}
          label={label}
          displayValue={(option: string) => option}
          onChange={(event) => setQuery(event.target.value)}
          required={required}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2"></Combobox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-sm bg-gray-900 text-base shadow-lg ring-1 ring-green-700 ring-opacity-50 focus:outline-none sm:text-sm z-10">
            <div className="bg-opacity-white-05">
              {filteredOption.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none p-2 text-gray-400">
                  Nothing found.
                </div>
              ) : (
                filteredOption.map((option) => (
                  <Combobox.Option
                    key={option}
                    className={({ active }) =>
                      `relative cursor-default select-none p-2 ${
                        active ? 'bg-gray-600 text-gray-300' : 'text-gray-400'
                      }`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option}
                      </span>
                    )}
                  </Combobox.Option>
                ))
              )}
            </div>
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
})
