"use client"

import { useContext, useState } from "react"
import Image from "next/image"

import { Button, Icons, Input } from "@/components/common"

import { DashboardContext } from "@/providers/dashboard-provider"

const BeneficiaryAdress = () => {
  const { setBackupWallet, backupWallet } = useContext(DashboardContext)
  const [wallet, setWallet] = useState("")
  if (backupWallet) {
    return null
  }
  return (
    <div className="flex flex-col gap-6 lg:mt-[63px]">
      <h1 className="text-2xl font-bold leading-10 text-white lg:text-[32px]">
        Setup your{" "}
        <span className="text-primary-100">Beneficiary address</span>
      </h1>

      <div className="flex flex-col items-center rounded-3xl border-2 border-white/[0.12] bg-white/[0.08] md:flex-row">
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <Input
            placeholder="Enter your address"
            label="Your Beneficiary address"
            className="h-[46px] pe-40"
            classContainer="mt-1"
            classIconRight="pe-[5px]"
            onChange={(e) => setWallet(e.target.value)}
            IconRight={
              <Button className="h-full" onClick={() => setBackupWallet(wallet)}>
                Set address
              </Button>
            }
          />

          <div className="flex max-w-[520px] items-start gap-2">
            <Icons.Warning className="min-h-8 min-w-8 lg:min-h-10 lg:min-w-10" />
            <div>
              <p className="text-xs font-medium text-white lg:text-sm">
                Please review the provided address carefully to ensure its accuracy.
                We cannot assume responsibility for any issues that may arise from incorrect information.
              </p>
            </div>
          </div>
        </div>
        <div className="ml-3 mt-[-96px] hidden pr-10 lg:block">
          <Image
            width={404}
            priority
            height={287.13}
            src="/protect-token/beneficiary_address.svg"
            alt="beneficiary adress"
            className="relative z-0"
          />
        </div>
      </div>
    </div>
  )
}

export default BeneficiaryAdress
