"use client"

import { Disclosure as ReactDisclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { cn } from "@/lib/utils"
import { Icons } from '@/components/common'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  buttonContent: React.ReactNode
  panel: React.ReactNode
  defaultOpen?: boolean
}

const Disclosure = ({ className, buttonContent, panel, defaultOpen, ...props }: Props) => {
  return (
    <ReactDisclosure
      as="div"
      className={cn(
        "rounded-2xl bg-white/10 p-4",
        className
      )}
      defaultOpen={defaultOpen}
      {...props}
    >
      {({ open }: { open: boolean }) => (
        <>
          <dt>
            <DisclosureButton className="flex w-full items-start gap-4 text-left text-gray-900">
              <span className="rounded-full bg-white/[0.08] p-1">
                {open ? (
                  <Icons.ChevronUp className="size-4 text-white" />
                ) : (
                  <Icons.ChevronDown className="size-4 text-white" />
                )}
              </span>
              {buttonContent}
            </DisclosureButton>
          </dt>
          <DisclosurePanel as="dd" className="mt-4">
            {panel}
          </DisclosurePanel>
        </>
      )}
    </ReactDisclosure>
  )
}

export default Disclosure
