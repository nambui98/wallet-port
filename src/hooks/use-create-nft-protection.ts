import { Factory__factory } from "@/typechain-types"
import { toast } from "./use-toast"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useEthersSigner } from "@/lib/ethers"
import { useAccount } from "wagmi"
import { NftContext, getNftAddresses, getNftIds } from "@/providers/nft-provider"
import { formatEther } from "viem"
import { ChainContext } from "@/providers/wallet-provider"
import { useTransferCostNfts } from "./use-transfer-cost-nft"

type Props = {
  backupWallet: string | null
  // unprotectedNfts: TNft[]
  closeDialog: (value: boolean) => void
}

const FIXED_PLATFORM_FEE_AMOUNT = BigInt(0.0005 * 1e18)
const mapTimelapseTypeValue = {
  day: 86400,
  hour: 3600,
  minute: 60,
}

export const useCreateNftProtection = ({
  backupWallet,
  // unprotectedNfts,
  closeDialog,
}: Props) => {
  const signer = useEthersSigner()
  const account = useAccount()
  const {setSelectedNfts} = useContext(NftContext);
  const [timelapse, setTimelapse] = useState<number | undefined>()
  const [timelapseType, setTimelapseType] = useState<"day" | "hour" | "minute">(
    "day"
  )
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined)
  const [transactionFee, setTransactionFee] = useState<bigint | undefined>()
  const { selectedNfts } = useContext(NftContext)
  const { factoryAddress, backendService } = useContext(ChainContext)

  // const { handleAddNftsToProtection } = useAddNftsToProtection({
  //   backupWallet,
  //   unprotectedNftsCount: unprotectedNfts.length,
  // })

  const { transferCost, gasUnitInWei } = useTransferCostNfts({ nftsCount: selectedNfts.length })

  const factory = useMemo(() => Factory__factory.connect(factoryAddress, signer), [factoryAddress, signer])

  const getFeeData = useCallback(async () => {
    if (
      backupWallet &&
      factory &&
      transferCost
    ) {
      try {
        const nftAddresses = getNftAddresses(selectedNfts)
        const nftIds = getNftIds(nftAddresses, selectedNfts)

        const gasEstimate = await factory
          .getFunction("registerNFTWithAssets")
          ?.estimateGas(
            backupWallet,
            (timelapse || 0) * mapTimelapseTypeValue[timelapseType],
            nftAddresses,
            nftIds,
            [], // erc1155Addresses
            [], // erc1155Ids
            {
              value: transferCost + FIXED_PLATFORM_FEE_AMOUNT,
            }
          )

        if (gasUnitInWei != null) {
          const gasCost = gasUnitInWei * gasEstimate
          // console.log in GWei
          console.log(
            `gasCost: ${formatEther(gasCost)}, gasEstimate: ${gasEstimate}`
          )
          setTransactionFee(gasCost)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [backupWallet, factory, gasUnitInWei, selectedNfts, timelapse, timelapseType, transferCost])

  useEffect(() => {
    getFeeData()
  }, [getFeeData])

  const handleProtectToken = async () => {
    try {
      if (!timelapse) {
        toast({
          title: "Please enter a timelapse",
        })
        return
      }
      if (!backupWallet) {
        toast({
          title: "Please enter a backup address",
        })
        return
      }
      setIsLoading(true)

      if (account) {
        closeDialog(false)

        const nftAddresses = getNftAddresses(selectedNfts)
        const nftIds = getNftIds(nftAddresses, selectedNfts)
        const registerNFT = await factory.registerNFTWithAssets(
          backupWallet,
          timelapse * mapTimelapseTypeValue[timelapseType],
          nftAddresses,
          nftIds,
          [], // erc1155Addresses
          [], // erc1155Ids
          {
            value: transferCost + FIXED_PLATFORM_FEE_AMOUNT,
          }
        )
        await registerNFT.wait()
        if (registerNFT) {
          const protectionAddress = await new Promise((res, rej) => {
            const interval = setInterval(async () => {
              const protection = await backendService.getNftProtections(account.address as string)
              if (protection?.data?.protectionAddress) {
                res(protection.data.protectionAddress)
                clearInterval(interval)
              }
            }, 1000)
          })
          setSelectedNfts([]);
          setIsLoading(false)
        }
      }
    } catch (error: any) {
      toast({
        title:
          error?.reason?.toString() ||
          error.message?.toString() ||
          error?.error?.message.toString() ||
          error.shortMessage?.toString() ||
          error.toString(),
      })
      setIsLoading(false)
      return error
    }
  }

  return {
    handleProtectToken,
    isLoading,
    timelapse,
    setTimelapse,
    timelapseType,
    setTimelapseType,
    transactionFee,
  }
}
