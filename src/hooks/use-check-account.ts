import { useAccount, useSwitchChain } from "wagmi"

export const useCheckAccount = () => {
  const account = useAccount()
  const { chains } = useSwitchChain()
  const isSupportedChain = chains.some(chain => chain.id === account.chainId)

  return {
    isConnected: account.isConnected && isSupportedChain
  }
}
