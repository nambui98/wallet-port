"use client"

import { MouseEvent, useCallback, useMemo, useState } from "react"
import { ProtectionDelegate__factory } from "@/typechain-types"
import { ContractFunctionExecutionError } from "viem"
import { useWaitForTransactionReceipt } from "wagmi"

import { useEthersSigner } from "@/lib/ethers"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/common"
import { TNftProtection, TProtection } from "@/types"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  protection: TProtection | TNftProtection
}

const RecoverButton = ({ protection }: Props) => {
  const signer = useEthersSigner()
  const [isRecovering, setIsRecovering] = useState<boolean>(false)
  const [recoverTxHash, setRecoverTxHash] = useState<`0x${string}`>()

  const handleRecover = useCallback(
    (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault()

      if (signer) {
        setIsRecovering(true)

        const protectionDelegate = ProtectionDelegate__factory.connect(
          protection.protectionAddress,
          signer
        )
        protectionDelegate
          .recoverAssets()
          .then((data) => {
            setRecoverTxHash(data.hash as `0x${string}`)
            setIsRecovering(false)
          })
          .catch((err: ContractFunctionExecutionError) => {
            setIsRecovering(false)
            toast({
              title: err.shortMessage,
            })
          })
      }
    },
    [protection.protectionAddress, signer]
  )

  const { isLoading: isLoadingWaitForRecover } = useWaitForTransactionReceipt({
    hash: recoverTxHash,
  })

  const isLoading = useMemo(
    () => isRecovering || isLoadingWaitForRecover,
    [isRecovering, isLoadingWaitForRecover]
  )

  return (
    <Button
      onClick={handleRecover}
      variant="default"
      className="h-[26px] px-4 text-sm"
      disabled={isLoading}
    >
      {isLoading ? "Recovering..." : "Recover"}
    </Button>
  )
}

export default RecoverButton
