"use client"

import React from "react"
import { TProtection } from "@/types"

import { shortenAddress } from "@/lib/utils"
import { Icons } from "@/components/common"

import Link from "next/link"
import TokenItem from "./token-item"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  protectionContract: TProtection
}

const TokenContract = ({
  className,
  protectionContract,
  ...props
}: Props) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/5 p-2 px-4 hover:bg-white/10">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          Protection:
          <span className="font-semibold">
            {shortenAddress(protectionContract.protectionAddress)}
          </span>
          <Link
            target="_blank"
            href="https://etherscan.io/address/[address]"
            as={`https://etherscan.io/address/${protectionContract.protectionAddress}`}
          >
            <Icons.Link className="size-4" fill="white" />
          </Link>
        </div>
        <p className="text-sm text-white">
          {protectionContract.status}
        </p>
      </div>

      <div>
        {protectionContract.erc20Assets.map((address) => (
          <TokenItem key={address} address={address} />
        ))}
      </div>
    </div>
  )
}

export default TokenContract
