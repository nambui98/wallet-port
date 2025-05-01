import React, { useCallback, useContext, useMemo } from "react"
import Image from "next/image"
import { NftContext } from "@/providers/nft-provider"
import { TNft, TNftProtection } from "@/types"
import { erc721Abi, isAddressEqual } from "viem"
import { useReadContract } from "wagmi"

import ApproveButton from "@/app/(wallet-connected)/protection/components/nft/approve-button"

import { Checkbox } from "../../../../components/common/checkbox"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  nft: TNft
  isSelectable?: boolean
  protectionAddress: string
}

const NftItem = ({ nft }: Props) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg p-1 hover:bg-white/10">
      <div className="flex items-center gap-2">
        <Image
          src={nft.image}
          height={50}
          width={50}
          alt={nft.name}
          className="size-8 rounded-lg md:size-[50px]"
        />
        {nft.name}
      </div>
    </div>
  )
}

export default React.memo(NftItem)
