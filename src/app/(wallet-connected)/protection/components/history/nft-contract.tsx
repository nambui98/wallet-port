"use client"

import React, { useEffect, useState } from "react"
import { TNft, TNftProtection } from "@/types"

import { shortenAddress } from "@/lib/utils"

import { getNftMetadataBatch } from "@/app/actions"
import Link from "next/link"
import { Icons } from "@/components/common"
import NftItem from "./nft-item"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  protectionContract: TNftProtection
}

const NftContract = ({
  className,
  protectionContract,
  ...props
}: Props) => {
  const [nfts, setNfts] = useState<Pick<TNft, "id" | "contractAddress" | "name" | "image">[]>([])

  useEffect(() => {
    const fn = async () => {
      const nftsPayload = protectionContract.erc721Assets.map(erc721Asset =>
        erc721Asset.ids.map(id => ({
          id,
          contractAddress: erc721Asset.asset || ''
        }))
      ).flat()

      const nfts = await getNftMetadataBatch({ nfts: nftsPayload })
      setNfts(nfts)
    }
    fn()
  }, [protectionContract.erc721Assets])

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

      {nfts?.map((nft) => (
        <NftItem
          key={nft.name}
          name={nft.name}
          image={nft.image}
        />
      ))}
    </div>
  )
}

export default NftContract
