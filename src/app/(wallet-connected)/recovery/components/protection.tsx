"use client"

import { MouseEvent, useCallback, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ProtectionDelegate__factory } from "@/typechain-types"
import { TProtection } from "@/types"
import { ContractFunctionExecutionError, erc20Abi, formatUnits } from "viem"
import { useReadContracts, useWaitForTransactionReceipt } from "wagmi"

import { useEthersSigner } from "@/lib/ethers"
import TimeRemaining from "@/lib/time-remaining"
import { cn, shortenAddress } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button, Icons } from "@/components/common"
import Disclosure from "@/components/common/disclosure"

import RecoverButton from "./recover-button"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  protection: TProtection
  refetch: () => void
}

const Protection = ({ protection, refetch }: Props) => {
  const onProtectionExecutedHandler = useCallback(() => {
    setTimeout(refetch, 2000)
    toast({
      title: "A protection is due and being executed",
    })
  }, [refetch])

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/5  p-4 hover:bg-white/10 md:gap-5 md:px-8">
      <div className="flex items-center gap-2">
        Protection:
        <span className="font-semibold">
          {shortenAddress(protection.protectionAddress)}
        </span>
        <Link
          target="_blank"
          href="https://etherscan.io/address/[address]"
          as={`https://etherscan.io/address/${protection.protectionAddress}`}
        >
          <Icons.Link className="size-4" fill="white" />
        </Link>
      </div>

      <div className="md:pb-5">
        <div className="flex justify-between border-b border-white/10 pb-3">
          <span className="font-semibold">Token</span>
          <span className="font-semibold">Approved amount</span>
        </div>
        <div>
          {protection.erc20Assets.map((asset) => (
            <Protection.TokenAmount
              key={asset}
              tokenAddress={asset}
              primaryAddress={protection.primaryWallet as `0x${string}`}
              protectionAddress={protection.protectionAddress as `0x${string}`}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full justify-between">
        <p className="font-semibold">
          <div className="flex items-center gap-1">
            <Icons.ClockOutline fill="white" />
            <TimeRemaining
              timelapse={protection.timelapse}
              from={protection.lastActiveTimestamp}
              className="text-sm font-semibold text-white"
              onCountdownEnd={onProtectionExecutedHandler}
            />
          </div>
        </p>
        <div className="flex gap-2">
          <RecoverButton protection={protection} />
        </div>
      </div>
    </div>
  )
}

type TokenAmountProps = React.HTMLAttributes<HTMLDivElement> & {
  tokenAddress: `0x${string}`
  primaryAddress: `0x${string}`
  protectionAddress: `0x${string}`
}

Protection.TokenAmount = function TokenAmount({
  tokenAddress,
  primaryAddress,
  protectionAddress,
  className,
  ...props
}: TokenAmountProps) {
  const { data: tokenDetails, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [primaryAddress, protectionAddress],
      },
    ],
  })

  if (isLoading) return null

  return (
    <div
      className={cn(
        "flex justify-between border-t border-white/10 py-3 first:border-0 last:pb-0",
        className
      )}
      {...props}
    >
      <span className="flex gap-2 font-semibold">
        <Image
          src={"/coin/coin.svg"}
          width={16}
          height={16}
          alt="token logo"
          className="rounded-full"
        />
        {tokenDetails?.[0]}
      </span>
      <span className="font-semibold">
        {tokenDetails ? formatUnits(tokenDetails[2], tokenDetails[1]) : 0}
      </span>
    </div>
  )
}

export default Protection
