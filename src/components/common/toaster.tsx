"use client"

import { useMemo } from "react"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/common/toast"

import { Icons } from "./icons"

export function Toaster() {
  const { toasts } = useToast()

  const renderIcon = (
    variant: "default" | "error" | "warning" | null | undefined
  ) => {
    switch (variant) {
      case "default":
        return <Icons.InfoToast />
      case "error":
        return <Icons.ErrorToast />
      case "warning":
        return <Icons.WarningToast />
      default:
        return <Icons.InfoToast />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="inline-flex items-center gap-2">
                  {renderIcon(variant)}
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
