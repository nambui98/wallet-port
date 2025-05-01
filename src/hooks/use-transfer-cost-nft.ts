import { useMemo } from "react"
import { useEstimateMaxPriorityFeePerGas, useGasPrice } from "wagmi"

type Props = {
  nftsCount: number
}

const DEPOSIT_OVER_COST_RATIO = 5 // 5 times more than the cost of the estimated fee

export const useTransferCostNfts = ({
  nftsCount
}: Props) => {
  const { data: maxFeePerGas } = useEstimateMaxPriorityFeePerGas()
  const { data: gasPrice } = useGasPrice()
  const gasUnitInWei = useMemo(
    () => gasPrice ?? maxFeePerGas,
    [gasPrice, maxFeePerGas]
  )

  const transferCost = useMemo(() => {
    const _transferCost = gasUnitInWei
      ? BigInt((85000 + nftsCount * 22000).toString()) *
        gasUnitInWei
      : BigInt(0)
    return (
      (_transferCost * BigInt(Math.floor(DEPOSIT_OVER_COST_RATIO * 10))) /
      BigInt(10)
    )
  }, [gasUnitInWei, nftsCount])


  return { transferCost, gasUnitInWei }
}
