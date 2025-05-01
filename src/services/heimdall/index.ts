import { getAllMyNfts } from "@/app/actions"
import { TNft, TNftProtection, TPrimaryWalletWithProtections, TProtection } from "@/types"
import { Network } from "alchemy-sdk"
import axios, { AxiosResponse } from "axios"
import { bytesToHex, isAddressEqual } from "viem"

const getProtections = (
  baseUrl: string,
  address: string
): Promise<AxiosResponse<TProtection[]>> => {
  return axios.get<TProtection[]>(
    `${baseUrl}/chain/protection-contract-by-primary-wallet/${address}`
  )
}

const getNftProtections = async (
  baseUrl: string,
  address: string
): Promise<AxiosResponse<TNftProtection>> => {
  const response = await axios.get<TNftProtection>(
    `${baseUrl}/chain/nft-protection-contract-by-primary-wallet/${address}`
  )

  if (!response.data) {
    return response
  }

  response.data.erc721Assets = response.data.erc721Assets.map(erc721Asset => {
    return {
      ...erc721Asset,
      address: erc721Asset.asset
    }
  })
  return response
}

const getPrimaryWallets = async (
  baseUrl: string,
  backupWalletAddress: string,
  alchemyNetwork: Network,
): Promise<TPrimaryWalletWithProtections[]> => {
  const [ primaryWallets, nftPrimaryWallets ] = await Promise.all([
    axios.get<string[]>(
      `${baseUrl}/chain/primary-wallets-by-backup-wallet/${backupWalletAddress}`
    ),
    axios.get<string[]>(
      `${baseUrl}/chain/primary-wallets-by-backup-wallet-nft/${backupWalletAddress}`
    )
  ])

  const [protections, nftProtections, allNfts] = await Promise.all([
    Promise.all(primaryWallets.data.map((address) =>
      getProtections(baseUrl, address)
    )),
    Promise.all(nftPrimaryWallets.data.map((address) =>
      getNftProtections(baseUrl, address)
    )),
    Promise.all(nftPrimaryWallets.data.map((address) =>
      getAllMyNfts({ address, network: alchemyNetwork })
    ))
  ])

  // Map protections
  const addressWithProtectionsMap: Record<string, { protections?: TProtection[], nftProtection?: TNftProtection, nfts?: TNft[] }> = {};
  const mergeProtections = (
    wallets: string[],
    protections: { data: TProtection[] | TNftProtection }[],
    key: string
  ) => {
    for (let i = 0; i < wallets.length; i++) {
      const current = addressWithProtectionsMap[wallets[i]] || {}
      addressWithProtectionsMap[wallets[i]] = { ...current, [key]: protections[i].data }
    }
  }
  mergeProtections(primaryWallets.data, protections, 'protections')
  mergeProtections(nftPrimaryWallets.data, nftProtections, 'nftProtection')

  // Map NFTs
  for (let i = 0; i < nftPrimaryWallets.data.length; i++) {
    addressWithProtectionsMap[nftPrimaryWallets.data[i]].nfts = allNfts[i].filter(rawNft => {
      return nftProtections[i].data.erc721Assets.find(asset =>
        isAddressEqual(rawNft.contractAddress as `0x${string}`, asset.address as `0x${string}`)
        && asset.ids.includes(rawNft.id)
      )
    }) || []
  }

  return Object.keys(addressWithProtectionsMap).map(address => {
    return {
      address,
      ...addressWithProtectionsMap[address]
    }
  })
}

const getProtectionHistory = (
  baseUrl: string,
  address: string
): Promise<AxiosResponse<TProtection[]>> => {
  return axios.get<TProtection[]>(
    `${baseUrl}/chain/historic-protection-contract-by-primary-wallet/${address}`
  )
}
const getNftProtectionHistory = (
  baseUrl: string,
  address: string
): Promise<AxiosResponse<TNftProtection[]>> => {
  return axios.get<TNftProtection[]>(
    `${baseUrl}/chain/historic-nft-protection-contract-by-primary-wallet/${address}`
  )
}

export type TBackendService = {
  getProtections: (address: string) => Promise<AxiosResponse<TProtection[]>>,
  getPrimaryWallets: (backupWalletAddress: string, alchemyNetwork: Network) => Promise<TPrimaryWalletWithProtections[]>,
  getProtectionHistory: (address: string) => Promise<AxiosResponse<TProtection[]>>,
  getNftProtectionHistory: (address: string) => Promise<AxiosResponse<TNftProtection[]>>,
  getNftProtections: (address: string) => Promise<AxiosResponse<TNftProtection>>,
}

const wrapper = (baseUrl: string): TBackendService => ({
  getProtections: (address: string) => getProtections(baseUrl, address),
  getPrimaryWallets: (backupWalletAddress: string, alchemyNetwork: Network) => getPrimaryWallets(baseUrl, backupWalletAddress, alchemyNetwork),
  getProtectionHistory: (address: string) => getProtectionHistory(baseUrl, address),
  getNftProtectionHistory: (address: string) => getNftProtectionHistory(baseUrl, address),
  getNftProtections: (address: string) => getNftProtections(baseUrl, address),
})

const sepoliaService = wrapper('/api/sepolia')
const baseSepoliaService = wrapper('/api/base-sepolia')

export {
  sepoliaService,
  baseSepoliaService,
}
