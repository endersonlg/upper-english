import React from 'react'

interface ThProps {
  children?: React.ReactNode
  className?: string
}

export function Th({ children, className }: ThProps) {
  let classNameAux =
    'bg-gray-600 p-4 text-gray-100 text-sm leading-6 first:rounded-tl-lg first:pl-6 last:rounded-tr-lg last:pr-6'
  if (className) {
    classNameAux += ' ' + className
  }

  return <th className={classNameAux}>{children}</th>
}
