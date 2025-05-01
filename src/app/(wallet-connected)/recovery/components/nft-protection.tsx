"use client"

import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ProtectionDelegate__factory } from "@/typechain-types"
import { TNft, TNftProtection, TProtection } from "@/types"
import { ContractFunctionExecutionError, erc20Abi, formatUnits } from "viem"
import { useReadContracts, useWaitForTransactionReceipt } from "wagmi"

import { useEthersSigner } from "@/lib/ethers"
import TimeRemaining from "@/lib/time-remaining"
import { cn, shortenAddress } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button, Icons } from "@/components/common"
import Disclosure from "@/components/common/disclosure"
import Link from "next/link"
import NftItem from "./nft-item";
import { Alchemy, Network } from "alchemy-sdk"
import RecoverButton from "./recover-button"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  protection: TNftProtection
  nfts: TNft[]
  refetch: () => void
}

const NftProtection = ({ protection, nfts, refetch }: Props) => {
  const onProtectionExecutedHandler = useCallback(() => {
    setTimeout(refetch, 2000)
    toast({
      title: "A protection is due and being executed",
    })
  }, [refetch])

  return (
    <div className="flex flex-col  gap-5 rounded-2xl  bg-white/5 p-4 px-8 hover:bg-white/10">
      <div className="flex items-center gap-2">
        Protection:
        <span className="font-semibold">{shortenAddress(protection.protectionAddress)}</span>
        <Link target="_blank" href="https://etherscan.io/address/[address]" as={`https://etherscan.io/address/${protection.protectionAddress}`}>
          <Icons.Link className="size-4" fill="white" />
        </Link>
      </div>

      {nfts?.map((nft) => (
        <NftItem nft={nft} key={nft.name} protectionAddress={
          protection.protectionAddress
        } />
      ))}

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

export default NftProtection
