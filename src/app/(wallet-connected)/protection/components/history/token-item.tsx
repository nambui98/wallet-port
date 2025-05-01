"use client"

import React from "react"
import { erc20Abi } from "viem"
import { useReadContracts } from "wagmi"

import Image from "next/image"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  address: `0x${string}`
}

const TokenItem = ({
  className,
  address,
  ...props
}: Props) => {
  const { data: tokenDetails } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  })
  if (!tokenDetails) return null

  return (
    <div className="flex justify-between border-t border-white/10 py-1 first:border-0">
      <span className="flex gap-2 font-semibold">
        <Image
          src={"/coin/coin.svg"}
          width={16}
          height={16}
          alt="token logo"
          className="rounded-full"
        />
        {`${tokenDetails?.[0]} (${tokenDetails?.[1]})`}
      </span>
    </div>
  )
}

export default TokenItem
