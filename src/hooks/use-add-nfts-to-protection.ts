import { NFTProtectionDelegate__factory } from "@/typechain-types"
import { toast } from "./use-toast"
import { useContext } from "react"
import { useEthersSigner } from "@/lib/ethers"
import { useAccount } from "wagmi"
import { NftContext } from "@/providers/nft-provider"
import { useTransferCostNfts } from "./use-transfer-cost-nft"

type Props = {
  backupWallet: string | null
  unprotectedNftsCount: number
}

export const useAddNftsToProtection = ({
  backupWallet,
  unprotectedNftsCount,
}: Props) => {
  const signer = useEthersSigner()
  const account = useAccount()
  const { getAddingAndUpdatingNfts } = useContext(NftContext)

  const { transferCost } = useTransferCostNfts({ nftsCount: unprotectedNftsCount })

  const handleAddNftsToProtection = async (protectionAddress: string) => {
    try {
      if (!backupWallet) {
        toast({
          title: "Please enter a backup address",
        })
        return
      }

      const {
        newNftAddresses,
        newNftIds,
      } = getAddingAndUpdatingNfts()
      const delegate = protectionAddress && NFTProtectionDelegate__factory.connect(protectionAddress, signer)
      if (delegate && account && transferCost) {
        const addNewAssets = await delegate.addNewAssets(
          newNftAddresses,
          newNftIds,
          [], // erc1155Addresses
          [], // erc1155Ids
          {
            value: transferCost,
          }
        )
        await addNewAssets.wait()
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
      return error
    }
  }

  return { handleAddNftsToProtection }
}
