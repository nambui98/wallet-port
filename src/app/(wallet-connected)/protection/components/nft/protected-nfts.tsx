import React, { useCallback, useContext, useEffect, useState } from "react"
import NftItem from "./nft-item";
import { NftContext } from "@/providers/nft-provider"
import ApproveButton from "./approve-button"
import ApproveAllButton from "./approve-all-button"
import { shortenAddress } from "@/lib/utils"
import Link from "next/link"
import { Button, Icons, Spinner } from "@/components/common"
import TimeRemaining from "@/lib/time-remaining"
import { toast } from "@/hooks/use-toast"
import { useEthersSigner } from "@/lib/ethers"
import { NFTProtectionDelegate__factory } from "@/typechain-types"
import { useQueryClient } from "@tanstack/react-query"
import { useAccount, useWaitForTransactionReceipt } from "wagmi"
import { ContractFunctionExecutionError } from "viem"

type Props = React.HTMLAttributes<HTMLDivElement> & {}

const ProtectedNfts = ({ className, ...props }: Props) => {
  const {
    protectedNfts,
    nftProtection,
    refetchProtectionAndNfts,
    setIsOpenAddNftsDialog,
    isSettingProtectionLoading,
  } = useContext(NftContext)
  const signer = useEthersSigner()
  const queryClient = useQueryClient()
  const account = useAccount()
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelTxHash, setCancelTxHash] = useState<`0x${string}`>()

  const onProtectionExecutedHandler = useCallback(() => {
    setTimeout(refetchProtectionAndNfts, 2000)
    toast({
      title: "A protection is due and being executed",
    })
  }, [refetchProtectionAndNfts])

  const handleCancel = useCallback(() => {
    if (!nftProtection) return

    setCancelTxHash(undefined)
    if (signer) {
      setIsCancelling(true)

      const protection = NFTProtectionDelegate__factory.connect(
        nftProtection.protectionAddress,
        signer
      )
      protection
        .cancel()
        .then((data) => {
          setIsCancelling(false)
          setCancelTxHash(data.hash as `0x${string}`)
        })
        .catch((err: ContractFunctionExecutionError) => {
          setIsCancelling(false)
          toast({
            title: err.shortMessage,
          })
        })
    }
  }, [nftProtection, signer])

  const {
    isLoading: isLoadingWaitForCancel,
    isSuccess: isCancelSuccess
  } = useWaitForTransactionReceipt({ hash: cancelTxHash })

  useEffect(() => {
    if (isCancelSuccess) {
      toast({
        title: "Protection canceled",
      })
      setTimeout(refetchProtectionAndNfts, 2000)
    }
  }, [isCancelSuccess, refetchProtectionAndNfts])

  if (!nftProtection) return null

  return (
    <div className="flex flex-col gap-2 rounded-[24px] bg-white/5 p-2 px-4 hover:bg-white/10">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          Protection:
          <span className="font-semibold">{shortenAddress(nftProtection.protectionAddress)}</span>
          <Link
            target="_blank"
            href="https://etherscan.io/address/[address]"
            as={`https://etherscan.io/address/${nftProtection.protectionAddress}`}
          >
            <Icons.Link className="size-4" fill="white" />
          </Link>
        </div>
        <p className="text-primary-100 flex flex-row items-center gap-2 text-xs font-semibold leading-[18px]">
          <span className="items-left flex flex-row  gap-1">
            <Icons.ClockOutline  fill="rgb(60, 123, 253)"/>
            <TimeRemaining
              timelapse={nftProtection.timelapse}
              from={nftProtection.lastActiveTimestamp}
              onCountdownEnd={onProtectionExecutedHandler}
            />
          </span>
          {"  "}
          <span
            className="text-red bg-dark-20 cursor-pointer rounded-full px-4 py-1 text-xs font-semibold leading-[18px]"
            onClick={handleCancel}
          >
            {isCancelling || isLoadingWaitForCancel
              ? "Cancelling..."
              : "Cancel"}
          </span>
        </p>
      </div>

      {protectedNfts?.map((nft) => (
        <NftItem
        isSelectable={false}
          key={nft.name}
          nft={nft}
          protectionAddress={nftProtection.protectionAddress}
        />
      ))}
      {!protectedNfts?.length && (
        <div className="flex items-center gap-2 py-4">
          {isSettingProtectionLoading ? (
            <div className="flex w-full justify-center gap-2">
              <Spinner />
              <p className="text-gray-300">Adding your NFTs to the protection...</p>
            </div>
          ) : (
            <>
              No NFTs have been added yet
              <Button
                variant="link"
                className="p-0 text-base font-semibold"
                onClick={() => setIsOpenAddNftsDialog(true)}
              >
                Protect your NFTs
              </Button>
            </>
          )}
        </div>
      )}

      {/* <div className="flex justify-between pr-2">
        {!!protectedNfts?.length && (
          <ApproveAllButton
            nft={protectedNfts[0]}
            protectionAddress={nftProtection.protectionAddress}
            label="Approve all your NFTs"
            callbackFn={() => {}}
            className="text-primary-light my-2 min-w-[112px] text-sm leading-5"
            variant="destructive"
          />
        )}
      </div> */}
    </div>
  )
}

export default React.memo(ProtectedNfts)
