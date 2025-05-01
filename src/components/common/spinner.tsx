import React from "react"
import { Loader2, LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = LucideProps

const Spinner = ({ className, ...props }: Props) => {
  return <Loader2 className={cn("animate-spin", className)} {...props} />
}

export { Spinner }
