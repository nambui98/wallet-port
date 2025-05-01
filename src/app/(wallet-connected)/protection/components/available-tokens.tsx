"use client"

import { useContext } from "react"
import { DashboardContext } from "@/providers/dashboard-provider"

import { Button, Icons } from "@/components/common"

import DialogApprove from "./dialog-approve"
import DialogProtectionHistory from "./history/dialog-protection-history"
import ProtectedTokens from "./protected-tokens"
import UnprotectedAssets from "./unprotected-assets"

const AvailableTokens = () => {
  return (
    <div className="mt-6 flex w-full flex-col gap-4 pb-10 md:mt-10 md:gap-6 lg:gap-10 lg:pb-[155px]">
      <div className="flex items-center justify-between gap-2 lg:gap-0">
        <h2 className="text-2xl font-bold leading-10 text-white lg:text-[32px]">
          Protect your <span className="text-primary-100">Tokens</span>
        </h2>
        <div className="hidden md:block">
          <DialogProtectionHistory>
            <Button size="lg" className="gap-2 text-sm font-semibold">
              <Icons.Clock />
              Protection history
            </Button>
          </DialogProtectionHistory>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 lg:gap-8">
        <div className="col-span-2 flex flex-col items-start lg:col-span-1">
          <div className="mb-4 flex w-full items-center gap-2 md:mb-6">
            <Icons.ProtectOutline className="size-6 lg:size-8" />
            <p className="text-base font-semibold text-white lg:text-2xl">
              Unprotected Tokens
            </p>
          </div>
          <UnprotectedAssets />
        </div>
        <div className="col-span-2 flex flex-col items-start lg:col-span-1 lg:items-end">
          <div className="mb-4 flex flex-row-reverse items-center gap-2 md:mb-6 lg:flex-row">
            <p className="text-green text-base font-semibold lg:text-2xl">
              Protected Tokens
            </p>
            <Icons.ProtectActive className="size-6 lg:size-8" />
          </div>
          <ProtectedTokens />
        </div>
      </div>
      <DialogApprove />
    </div>
  )
}

export default AvailableTokens
