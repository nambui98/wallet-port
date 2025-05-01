"use server"

import { TNft, TUnprotectedToken } from "@/types"
import Moralis from "moralis"
import { hardhat } from "viem/chains"
import { Alchemy, Network, NftTokenType } from "alchemy-sdk"

import hardhatTokensFake from "../constants/hardhatTokens.json"

type TGetAllTokensPayload = {
  address: string
  chain: string | number
  tokenAddresses?: string[]
}

export async function getAllMyTokens(payload: TGetAllTokensPayload): Promise<TUnprotectedToken[]> {
  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      })
    }
    if (hardhat.id !== payload.chain) {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances(payload)
      return response.toJSON()
    }
    return hardhatTokensFake
  } catch (e) {
    throw e as Error
  }
}

export async function getAllMyNfts({
  address,
  network,
}: {
  address: string,
  network: Network
}): Promise<TNft[]> {
  try {
    const alchemy = new Alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
      network,
    })
    const response = await alchemy.nft.getNftsForOwner(address)
    return response.ownedNfts.map((nft) => ({
      owner: address,
      id: nft.tokenId,
      contractAddress: nft.contract.address,
      name: nft.name || '',
      image: nft.image.originalUrl || ''
    }))
  } catch (e) {
    // return
    throw e as Error
  }
}


export async function getNftMetadataBatch({
  nfts,
}: {
  nfts: { id: string, contractAddress: string }[]
}): Promise<Pick<TNft, "id" | "contractAddress" | "name" | "image">[]> {
  try {
    const alchemy = new Alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.ETH_SEPOLIA, // handle testnet/mainnet
    })
    const response = await alchemy.nft.getNftMetadataBatch(
      nfts.map(nft => ({
        contractAddress: nft.contractAddress,
        tokenId: nft.id,
        tokenType: NftTokenType.ERC721,
      }))
    )
    return response.nfts.map((nft) => ({
      id: nft.tokenId,
      contractAddress: nft.contract.address,
      name: nft.name || '',
      image: nft.image.originalUrl || ''
    }))
  } catch (e) {
    throw e as Error
  }
}

export async function getTokenPrice({
  chain,
  address,
}: {
  chain: number | string
  address: string
}) {
  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      })
    }
    if (hardhat.id !== chain) {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: chain,
        address: address,
      })

      return response.toJSON()
    }
    return hardhatTokensFake
  } catch (e) {
    // return
    throw e as Error
  }
}
