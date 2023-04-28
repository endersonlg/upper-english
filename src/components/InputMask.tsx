import React, { ForwardedRef, forwardRef } from 'react'
import ReactInputMask, { Props as ReactInputMaskProps } from 'react-input-mask'

interface InputMaskProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    ReactInputMaskProps {
  label?: string
  mask: string | Array<string | RegExp>
  className?: string
  error?: boolean
}

export const InputMask = forwardRef(function Input(
  { label, className, error, ...rest }: InputMaskProps,
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
      <ReactInputMask
        inputRef={ref}
        className={`bg-opacity-white-05 rounded-sm p-2 w-full ${errorCSS}`}
        {...rest}
      />
    </div>
  )
})
