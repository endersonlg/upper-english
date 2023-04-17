import React from 'react'

interface TdProps {
  children?: React.ReactNode
  className?: string
}

export function Td({ children, className }: TdProps) {
  let classNameAux =
    'bg-gray-700 text-gray-300 border-solid border-t-4 border-gray-800 p-4 text-sm leading-6 first:pl-6 last:pr-6'

  if (className) {
    classNameAux += ' ' + className
  }

  return <td className={classNameAux}>{children}</td>
}
