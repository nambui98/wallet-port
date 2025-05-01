import { NFTProtectionDelegate__factory } from "@/typechain-types"
import { toast } from "./use-toast"
import { useContext, useMemo, useState } from "react"
import { useEthersSigner } from "@/lib/ethers"
import { useAccount } from "wagmi"
import { NftContext } from "@/providers/nft-provider"
import { useTransferCostNfts } from "./use-transfer-cost-nft"

type Props = {
  backupWallet: string | null
  protectionAddress: string
}

export const useAddOrUpdateNfts = ({
  backupWallet,
  protectionAddress
}: Props) => {
  const signer = useEthersSigner()
  const account = useAccount()
  const { getAddingAndUpdatingNfts, setSelectedNfts } = useContext(NftContext)
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined)

  const {
    newNftAddresses,
    newNftIds,
    updateNftAddresses,
    updateNftIds,
    updateCount,
  } = getAddingAndUpdatingNfts()

  const delegate = useMemo(() => protectionAddress && NFTProtectionDelegate__factory.connect(protectionAddress, signer), [protectionAddress, signer])

  const { transferCost } = useTransferCostNfts({
    nftsCount: updateCount + newNftIds.flat().length
  })

  const handleAddOrUpdateNfts = async () => {
    try {
      if (!backupWallet) {
        toast({
          title: "Please enter a backup address",
        })
        return
      }

      setIsLoading(true)
      if (delegate && account && transferCost) {
        let transaction;
        if (updateNftAddresses.length && newNftAddresses.length) {
          transaction = await delegate.addOrUpdateAssets(
            newNftAddresses,
            newNftIds,
            [], // new erc1155Addresses
            [], // new erc1155Ids
            updateNftAddresses,
            updateNftIds,
            [], // update erc1155Addresses
            [], // update erc1155Ids
            {
              value: transferCost,
            }
          )
        }else if (newNftAddresses.length) {
           transaction = await delegate.addNewAssets(
            newNftAddresses,
            newNftIds,
            [], // new erc1155Addresses
            [], // new erc1155Ids
            {
              value: transferCost,
            }
          )
        } else if (updateNftAddresses.length) {
           transaction = await delegate.updateERC721TokenIds(
            updateNftAddresses,
            updateNftIds,
            {
              value: transferCost,
            }
          )
        }

        transaction && await transaction.wait();
        setIsLoading(false)
        setSelectedNfts([])
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

  return { handleAddOrUpdateNfts, isLoading, transferCost }
}
