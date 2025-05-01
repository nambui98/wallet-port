import * as React from "react"

import { cn } from "@/lib/utils"

import { Label } from "./label"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  error?: string
  classContainer?: string
  classIconRight?: string
  Icon?: React.ReactNode
  IconRight?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      required,
      error,
      classContainer,
      classIconRight,
      Icon,
      IconRight,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex w-full flex-col">
        {(!!label || !!error) && (
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center">
              <Label>{label}</Label>
            </div>

            {!!error && (
              <span className="text-red text-right text-xs font-semibold leading-[18px]">
                {error}
              </span>
            )}
          </div>
        )}

        <div className={cn("relative w-full", classContainer)}>
          {!!Icon && (
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 leading-[22px]">
              {Icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "focus:border-primary-light placeholder:text-dark-40 caret-primary-light disabled:text-dark-40 w-full rounded-3xl border border-transparent bg-white/10 px-4 py-3 text-base font-semibold leading-[22px] text-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-semibold placeholder:leading-[22px] focus-visible:bg-white/20 focus-visible:outline-none disabled:cursor-not-allowed",
              error && "border-red",
              Icon && "ps-12",
              IconRight && "pe-12",
              className
            )}
            ref={ref}
            {...props}
          />

          {!!IconRight && (
            <div
              className={cn(
                "absolute inset-y-[5px] end-0 flex items-center pe-4 leading-[22px]",
                classIconRight
              )}
            >
              {IconRight}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
