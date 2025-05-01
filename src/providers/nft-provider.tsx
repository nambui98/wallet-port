import React, { useCallback, useContext, useMemo, useState } from "react"
import {
  TNft,
  TNftProtection,
  TProtectedToken,
  TProtectionWithTimeData,
  TUnprotectedToken,
} from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { bytesToHex, isAddress, isAddressEqual } from "viem"
import { useAccount, useAccountEffect, useBalance, useBlock } from "wagmi"

import { toast } from "@/hooks/use-toast"
import { getAllMyNfts, getAllMyTokens } from "@/app/actions"
import { ChainContext } from "./wallet-provider"

type NftContextType = {
  nftProtection?: TNftProtection
  protectedNfts: TNft[]
  unprotectedNfts: TNft[]
  isLoadingAllNfts: boolean
  isLoadingAllNftsProtected: boolean
  isOpenSettingDialog: boolean
  setIsOpenSettingDialog: (value: boolean) => void
  isOpenAddNftsDialog: boolean
  setIsOpenAddNftsDialog: (value: boolean) => void
  selectedNfts: TNft[]
  setSelectedNfts: (value: TNft[]) => void
  isSettingProtectionLoading: boolean
  setIsSettingProtectionLoading: (value: boolean) => void
  refetchProtectionAndNfts: () => void
  getAddingAndUpdatingNfts: () => {
    newNftAddresses: string[],
    newNftIds: string[][],
    updateNftAddresses: string[],
    updateNftIds: string[][],
    updateCount: number
  }
}

export const getNftAddresses = (nfts: TNft[]) => {
  return Array.from(new Set(nfts.map(nft => nft.contractAddress)))
}

export const getNftIds = (addresses: string[], nfts: TNft[]) => {
  const ids = [];
  for (const address of addresses) {
    const currentIds = []
    for (const nft of nfts) {
      if (nft.contractAddress === address) {
        currentIds.push(nft.id)
      }
    }
    ids.push(currentIds)
  }
  return ids
}

export const NftContext = React.createContext<NftContextType>({
  nftProtection: undefined,
  protectedNfts: [],
  unprotectedNfts: [],
  isLoadingAllNfts: false,
  isLoadingAllNftsProtected: false,
  isOpenSettingDialog: false,
  setIsOpenSettingDialog: () => {},
  isOpenAddNftsDialog: false,
  setIsOpenAddNftsDialog: () => {},
  isSettingProtectionLoading: false,
  setIsSettingProtectionLoading: () => {},
  selectedNfts: [],
  setSelectedNfts: () => {},
  refetchProtectionAndNfts: () => {},
  getAddingAndUpdatingNfts: () => ({
    newNftAddresses: [],
    newNftIds: [],
    updateNftAddresses: [],
    updateNftIds: [],
    updateCount: 0,
  }),
})

const NftProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const account = useAccount()
  const [isOpenSettingDialog, setIsOpenSettingDialog] = useState(false)
  const [isOpenAddNftsDialog, setIsOpenAddNftsDialog] = useState(false)
  const [isSettingProtectionLoading, setIsSettingProtectionLoading] = useState(false)
  const [selectedNfts, setSelectedNfts] = useState<TNft[]>([])
  const queryClient = useQueryClient()
  const { backendService, alchemyNetwork } = useContext(ChainContext)
  const {
    data: rawNfts,
    isLoading: isLoadingAllNfts,
    refetch: refetchUnprotectedNfts,
  } = useQuery({
    queryKey: ["getAllMyNfts", account.chainId, account.address],
    queryFn: () => getAllMyNfts({ address: account.address!, network: alchemyNetwork! }),
    enabled: !!account.address,
  })

  const {
    data: rawProtectionContract,
    isLoading: isLoadingAllNftsProtected,
    refetch: refetchProtectedTokens,
  } = useQuery({
    queryKey: ["getNftProtections", account.chainId, account.address],
    queryFn: () => backendService.getNftProtections(account.address!),
    select(data) {
      return data.data
    },
    refetchInterval: 5000,
    enabled: !!account.address,
  })

  const refetchProtectionAndNfts = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [
        "getAllMyNfts",
        account.chainId,
        account.address,
      ],
    })
    queryClient.invalidateQueries({
      queryKey: [
        "getNftProtections",
        account.chainId,
        account.address,
      ],
    })
    refetchUnprotectedNfts()
    refetchProtectedTokens()
  }, [queryClient, account.chainId, account.address, refetchUnprotectedNfts, refetchProtectedTokens])

  const protectedNfts = useMemo(() => {
    if (!rawProtectionContract?.protectionAddress) {
      return []
    }

    return rawProtectionContract.erc721Assets.map(asset => {
      return rawNfts
        ?.filter(rawNft =>
          isAddressEqual(rawNft.contractAddress as `0x${string}`, asset.address as `0x${string}`)
          && asset.ids.includes(rawNft.id)
        )
        .map(nft => ({
          ...nft,
          protectionAddress: rawProtectionContract?.protectionAddress
        })) as TNft[]
    }).flat() || []
  }, [rawProtectionContract, rawNfts])

  const unprotectedNfts = useMemo(() => {
    if (!rawProtectionContract?.protectionAddress) {
      return rawNfts || []
    }

    return rawNfts?.filter(rawNft => {
      return !rawProtectionContract?.erc721Assets?.find(asset =>
        isAddressEqual(rawNft.contractAddress as `0x${string}`, asset.address as `0x${string}`)
        && asset.ids.includes(rawNft.id)
      )
    }) || []
  }, [rawProtectionContract, rawNfts])

  const getAddingAndUpdatingNfts = useCallback(() => {
    const newNfts = selectedNfts.filter(nft => {
      return !protectedNfts.find((protectedNft: TNft) =>
        isAddressEqual(protectedNft.contractAddress as `0x${string}`, nft.contractAddress as `0x${string}`)
      )
    })

    const updateNfts = selectedNfts.filter(
      (selectedNft) => protectedNfts.find(
        (protectedNft: TNft) => isAddressEqual(selectedNft.contractAddress as `0x${string}`, protectedNft.contractAddress as `0x${string}`)
      )
    );

    const existingNftsOftheSelectedContracts = protectedNfts.filter(
      protectedNft => selectedNfts.find(
        selectedNft => protectedNft.contractAddress === selectedNft.contractAddress
      )
    )

    const newNftAddresses = getNftAddresses(newNfts)
    const newNftIds = getNftIds(newNftAddresses, newNfts)
    const updateNftAddresses = getNftAddresses([...updateNfts, ...existingNftsOftheSelectedContracts])
    const updateNftIds = getNftIds(updateNftAddresses, [...updateNfts, ...existingNftsOftheSelectedContracts])
    const updateCount = updateNfts.length

    return {
      newNftAddresses,
      newNftIds,
      updateNftAddresses,
      updateNftIds,
      updateCount
    }
  }, [protectedNfts, selectedNfts])

  return (
    <NftContext.Provider
      value={{
        nftProtection: rawProtectionContract,
        protectedNfts,
        unprotectedNfts,
        isLoadingAllNfts,
        isLoadingAllNftsProtected,
        isOpenSettingDialog,
        setIsOpenSettingDialog,
        refetchProtectionAndNfts,
        isOpenAddNftsDialog,
        setIsOpenAddNftsDialog,
        isSettingProtectionLoading,
        setIsSettingProtectionLoading,
        selectedNfts,
        setSelectedNfts,
        getAddingAndUpdatingNfts,
      }}
    >
      {children}
    </NftContext.Provider>
  )
}

export default NftProvider
