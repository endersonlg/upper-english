import React, { ForwardedRef, forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  className?: string
}

export const Input = forwardRef(function Input(
  { label, className, ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  let classNameAux = 'flex flex-col gap-2'

  if (className) {
    classNameAux += ' ' + className
  }

  return (
    <div className={classNameAux}>
      <label>{label}</label>
      <input
        ref={ref}
        className="border-0 bg-opacity-white-05 rounded-sm p-2 w-full"
        {...rest}
      />
    </div>
  )
})
