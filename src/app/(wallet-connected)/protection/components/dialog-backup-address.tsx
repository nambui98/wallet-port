"use client"

import React, { useContext, useState } from "react"
import { DashboardContext } from "@/providers/dashboard-provider"

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Icons,
  Input,
} from "@/components/common"

type Props = React.ComponentPropsWithoutRef<typeof Dialog> & {}
const DialogBackupAddress = ({
  children,
  open,
  onOpenChange,
  ...props
}: Props) => {
  const { setBackupWallet, backupWallet } = useContext(DashboardContext)
  const [wallet, setWallet] = useState<string>(backupWallet!)

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b-dark-20 gap-2 space-y-0 border-b pb-6">
          <Icons.TickCircle className="size-12 lg:size-16" />
          <h2 className="text-left text-2xl font-semibold text-white">
            Backup Address
          </h2>
          <p className="text-left text-sm font-medium text-white">
            Please review the provided address carefully to ensure its accuracy.
            We cannot assume responsibility for any issues that may arise from incorrect information.{" "}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="Enter your address"
            label="Your Backup address"
            className="h-[46px]"
            classContainer="mt-1"
            classIconRight="pe-[5px]"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={() => setBackupWallet(wallet)}>
            Set address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogBackupAddress
