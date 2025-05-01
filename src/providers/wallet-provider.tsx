"use client"

import * as React from "react"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import {
  metaMaskWallet,
  phantomWallet,
  xdefiWallet,
  coinbaseWallet,
  coin98Wallet,
  coreWallet,
  ledgerWallet,
  okxWallet,
  subWallet,
  tokenPocketWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http, WagmiProvider, useChainId } from "wagmi"
import { baseSepolia, sepolia } from "wagmi/chains"

import { customThemeRainbowKit } from "@/lib/rainbowkit"
import { baseSepoliaService, sepoliaService, TBackendService } from "@/services/heimdall"
import { Network } from "alchemy-sdk"

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID || ""

const config = getDefaultConfig({
  appName: "WalletPort",
  projectId,
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        phantomWallet,
        xdefiWallet,
        coinbaseWallet,
        coin98Wallet,
        coreWallet,
        ledgerWallet,
        okxWallet,
        subWallet,
        tokenPocketWallet,
        trustWallet,
        uniswapWallet,
        walletConnectWallet,
      ],
    },
  ],
  chains: [
    sepolia,
    baseSepolia,
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL__SEPOLIA),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL__BASE_SEPOLIA),
  },
  ssr: true,
})

type TChainContext = {
  backendApiUrl: string,
  rpcUrl: string,
  factoryAddress: string,
  backendService: TBackendService,
  alchemyNetwork: Network,
  wethAddress: string,
}

const NETWORK_CONFIGS: Record<number, TChainContext> = {
  [sepolia.id]: {
    backendApiUrl: process.env.NEXT_PUBLIC_BACKEND_API__SEPOLIA || "",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL__SEPOLIA || "",
    factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS__SEPOLIA || "",
    wethAddress: process.env.NEXT_PUBLIC_WETH_ADDRESS__SEPOLIA || "",
    backendService: sepoliaService,
    alchemyNetwork: Network.ETH_SEPOLIA,
  },
  [baseSepolia.id]: {
    backendApiUrl: process.env.NEXT_PUBLIC_BACKEND_API__BASE_SEPOLIA || "",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL__BASE_SEPOLIA || "",
    factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS__BASE_SEPOLIA || "",
    wethAddress: process.env.NEXT_PUBLIC_WETH_ADDRESS__BASE_SEPOLIA || "",
    backendService: baseSepoliaService,
    alchemyNetwork: Network.BASE_SEPOLIA,
  }
}

export const ChainContext = React.createContext<TChainContext>({
  backendApiUrl: "",
  rpcUrl: "",
  factoryAddress: "",
  backendService: {} as TBackendService,
  alchemyNetwork: "" as Network,
  wethAddress: "",
})

const ChainProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const chainId = useChainId()
  return (
    <ChainContext.Provider
      value={NETWORK_CONFIGS[chainId]}
    >
      {children}
    </ChainContext.Provider>
  )
}

const demoAppInfo = {
  appName: "WalletPort",
}

const queryClient = new QueryClient()

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider appInfo={demoAppInfo} theme={customThemeRainbowKit}>
          <ChainProvider>
            {children}
          </ChainProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
