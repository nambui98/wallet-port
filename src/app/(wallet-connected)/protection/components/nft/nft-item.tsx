import React, { useCallback, useContext, useMemo } from "react"
import Image from "next/image"
import { NftContext } from "@/providers/nft-provider"
import { TNft, TNftProtection } from "@/types"
import { Checkbox } from "@components/common/checkbox"
import { erc721Abi, isAddressEqual } from "viem"
import { useReadContract } from "wagmi"

import ApproveButton from "@/app/(wallet-connected)/protection/components/nft/approve-button"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  nft: TNft
  isSelectable?: boolean
  protectionAddress?: string
}

const NftItem = ({ nft, isSelectable, protectionAddress }: Props) => {
  const {
    data: approvedAddress,
    isLoading: isLoadingApproved,
    refetch: refetchGetApproved,
  } = useReadContract({
    address: nft.contractAddress as `0x${string}`,
    abi: erc721Abi,
    functionName: "getApproved",
    query: {
      enabled: !!nft?.contractAddress,
      gcTime: 2000,
    },
    args: [BigInt(nft.id)],
  })
  const { selectedNfts, setSelectedNfts } = useContext(NftContext)

  const isApproved = useMemo(() => {
    if (!approvedAddress || !nft?.protectionAddress) {
      return false
    }
    return isAddressEqual(
      approvedAddress as `0x${string}`,
      nft?.protectionAddress as `0x${string}`
    )
  }, [approvedAddress, nft?.protectionAddress])

  const handleCheckedChange = useCallback(
    (value: boolean) => {
      if (value) {
        setSelectedNfts([...selectedNfts, nft])
      } else {
        setSelectedNfts(
          selectedNfts.filter(
            (item) =>
              !(
                isAddressEqual(
                  item.contractAddress as `0x${string}`,
                  nft.contractAddress as `0x${string}`
                ) && item.id == nft.id
              )
          )
        )
      }
    },
    [nft, selectedNfts, setSelectedNfts]
  )

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg p-1 hover:bg-white/10">
      <div className="flex items-center gap-2">
        {isSelectable && (
          <Checkbox
            id="select"
            onCheckedChange={handleCheckedChange}
            checked={
              !!selectedNfts.find(
                (item) =>
                  isAddressEqual(
                    item.contractAddress as `0x${string}`,
                    nft.contractAddress as `0x${string}`
                  ) && item.id === nft.id
              )
            }
          />
        )}
        <Image
          src={nft.image}
          height={50}
          width={50}
          alt={nft.name}
          className="size-8 rounded-lg md:size-[50px]"
        />
        {nft.name}
      </div>
      {protectionAddress && (
        <>
          {!isLoadingApproved && isApproved ? (
            <p className="text-green px-4">Approved</p>
          ) : (
            <ApproveButton
              nft={nft}
              protectionAddress={protectionAddress}
              label="Approve"
              callbackFn={refetchGetApproved}
              className="text-primary-light min-w-[112px] text-sm leading-5"
              variant="destructive"
            />
          )}
        </>
      )}
    </div>
  )
}

export default React.memo(NftItem)
