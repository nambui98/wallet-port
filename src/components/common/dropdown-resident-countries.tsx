"use client"

import React from "react"
import residentCountries from "@/constants/residentCountries.json"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean
  value?: string
  classNamePopContent?: string
  onSelect?: (value: string) => void
  onOpenChange?: () => void
  Icon?: React.ReactNode
}
const DropDownResidentCountries = ({
  open,
  value,
  className,
  classNamePopContent,
  onSelect,
  onOpenChange,
  Icon,
}: Props) => {
  const handleFocus = () => {
    if (!open) return onOpenChange?.()
  }
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
        <div
          aria-expanded={open}
          className={cn(
            "focus-within:border-primary-light flex h-12 w-full cursor-pointer items-center justify-start rounded-3xl border border-transparent bg-white/10 py-[11px] hover:bg-white/10",
            className
          )}
        >
          <div className="relative w-full">
            {!!Icon && (
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 leading-[22px]">
                {Icon}
              </div>
            )}
            <div
              className={cn(
                "text-gray-80  px-4 text-sm font-medium leading-[22px]",
                value && "text-gray-100",
                Icon && "ps-12"
              )}
            >
              <Input
                value={
                  residentCountries.find((attr) => attr.alpha3 === value)?.name
                }
                placeholder="Country of resident"
                className="h-10 rounded-none border-none bg-transparent p-0 focus-visible:border-none focus-visible:bg-transparent"
                onFocus={handleFocus}
                readOnly
              />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "bg-dark-80 w-full max-w-[340px] p-0 lg:w-full lg:max-w-max "
        )}
      >
        <Command className={cn("w-full lg:w-[496px]", classNamePopContent)}>
          <CommandInput
            placeholder="Search country of resident..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No country of resident found.</CommandEmpty>
            <CommandGroup>
              {(residentCountries || [])?.map((attr) => (
                <CommandItem
                  key={attr?.name}
                  value={attr?.name}
                  onSelect={() => {
                    onSelect?.(attr.alpha3)
                    onOpenChange?.()
                  }}
                  className={cn(
                    value === attr?.alpha3 && "text-primary-light bg-white/10"
                  )}
                >
                  {attr?.name}
                  <CheckIcon
                    className={cn(
                      "text-primary ml-auto size-4",
                      value === attr?.alpha3 ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default React.memo(DropDownResidentCountries)
