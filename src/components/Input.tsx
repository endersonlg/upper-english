import React, { ForwardedRef, forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  mask?: string
  className?: string
  error?: boolean
}

export const Input = forwardRef(function Input(
  { label, className, error, ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  let classNameAux = 'flex flex-col gap-2'

  if (className) {
    classNameAux += ' ' + className
  }

  const errorCSS = error
    ? 'border border-red-500 shadow-sm shadow-red-700'
    : 'border-none'

  return (
    <div className={classNameAux}>
      {label && <label>{label}</label>}
      <input
        ref={ref}
        className={`bg-opacity-white-05 rounded-sm p-2 w-full ${errorCSS}`}
        {...rest}
      />
    </div>
  )
})
