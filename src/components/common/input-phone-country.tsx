"use client"

import React from "react"
import {
  ParsedCountry,
  PhoneInput,
  PhoneInputProps,
} from "react-international-phone"

import { cn } from "@/lib/utils"

import "react-international-phone/style.css"

type Props = PhoneInputProps & {
  error?: string
  value: string
  onChange: (
    phone: string,
    meta: {
      country: ParsedCountry
      inputValue: string
    }
  ) => void
}
const InputPhoneCountry = ({ error, value, className, onChange }: Props) => {
  return (
    <PhoneInput
      placeholder="Phone"
      defaultCountry="gb"
      className={cn(
        "focus-within:border-primary z-50 h-[46px] border border-transparent focus-within:rounded-xl focus-within:border focus-within:ring-0 [&>button]:h-full",
        !!error && "border-red rounded-xl",
        className
      )}
      inputClassName="w-full !h-full placeholder:!text-dark-40 !bg-white/10 caret-primary-light !border-none !rounded-3xl border !px-4 py-[11px] !text-base !font-semibold !leading-[22px] !text-white file:border-0 file:bg-transparent file:!text-sm file:!font-medium placeholder:!font-semibold placeholder:!leading-[22px] focus-visible:!bg-white/20 focus-visible:outline-none !rounded-l-none !pl-1"
      countrySelectorStyleProps={{
        buttonClassName:
          "!h-full !rounded-3xl !rounded-r-none !border-none !bg-white/10 !pl-4 !pr-1 !mr-0",
        dropdownStyleProps: {
          className:
            "!ring-0 !outline-none  rounded-3xl !bg-dark-80 !text-gray-100 !max-h-80",
          listItemClassName:
            "!rounded-sm !py-1 !pl-8 !pr-2 !text-sm !text-white hover:!bg-dark-100/20 aria-[selected=true]:!text-dark-100 !font-montserrat !font-medium",
        },
        buttonContentWrapperClassName: "size-5 rounded-full overflow-hidden",
        flagClassName: "rounded-full !size-[30px] !m-0 object-cover",
        dropdownArrowClassName: "hidden",
      }}
      value={value}
      onChange={onChange}
    />
  )
}

export default InputPhoneCountry
