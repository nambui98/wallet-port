import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-base leading-[22px] font-semibold ring-none transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0 disabled:pointer-events-none disabled:bg-white/20 disabled:text-dark-80 transition-all duration-300 disabled:bg-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary-linear disabled:text-grey-200 hover:bg-primary-linear-light text-white hover:shadow-drop-shadow",
        destructive: "bg-white text-primary-100 hover:bg-primary-20",
        secondary: "bg-primary-20 text-primary-100",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "text-primary-100 text-sm leading-[18px]",
        link: "text-primary-100 text-sm leading-[18px] underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "h-[46px] px-6 py-3",
        sm: "h-[26px] rounded-3xl px-4 py-1",
        lg: "h-9 rounded-3xl px-4 py-2",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
