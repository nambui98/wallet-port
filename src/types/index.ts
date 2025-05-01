export type TProtectedToken = GetWalletTokenBalancesResponse & {
  protectionAddress: string
  allowance?: bigint
  lastActiveTimestamp: number
  timelapse?: string
}
export type TUnprotectedToken = GetWalletTokenBalancesResponse

export type TProtection = {
  primaryWallet: string
  backupWallet: string
  erc20Assets: `0x${string}`[]
  lastActiveTimestamp: number
  lastActiveTransactionHash: string
  lastActiveToken: string
  protectionAddress: string
  timelapse: string
  status: string
  statusChangeTxHash: string
  statusChangeBlockNumber: string
  statusChangeTimestamp: string
}

export type TNftProtection = {
  backupWallet: string
  erc721Assets: TNftAsset[]
  erc1155Assets: TNftAsset[]
  lastActiveTimestamp: number
  lastActiveTransactionHash: string
  primaryWallet: string
  protectionAddress: string
  status: string
  statusChangeBlockNumber: string
  statusChangeTimestamp: string
  statusChangeTxHash: string
  timelapse: string
}

type TNftAsset = {
  asset: `0x${string}`
  ids: string[]
  address?: string
}

export type TProtectionWithTimeData = {
  primaryWallet: string
  backupWallet: string
  erc20Assets: TProtectedToken[]
  lastActiveTimestamp: number
  lastActiveTransactionHash: string
  lastActiveToken: string
  protectionAddress: string
  timelapse: string
  status: string
  statusChangeTxHash: string
  statusChangeBlockNumber: string
  statusChangeTimestamp: string
}

export type TPrimaryWalletWithProtections = {
  address: string
  protections?: TProtection[]
  nftProtection?: TNftProtection
  nfts?: TNft[]
}

export type TNft = {
  id: string
  contractAddress: string
  name: string
  image: string
  owner: string
  protectionAddress?: string
}
