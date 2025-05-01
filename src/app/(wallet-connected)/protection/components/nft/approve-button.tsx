import { useEffect } from "react"
import { TNft, TProtectedToken } from "@/types"
import { ContractFunctionExecutionError, erc721Abi } from "viem"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { toast } from "@/hooks/use-toast"
import { ButtonProps, Icons } from "@/components/common"
import LoadingButton from "@/components/common/loading-button"

const ApproveButton = ({
  nft,
  protectionAddress,
  label,
  callbackFn,
  ...props
}: ButtonProps & {
  nft: TNft,
  protectionAddress: string
  label: string
  callbackFn?: () => void
}) => {
  const {
    data: approveTxHash,
    writeContractAsync: approve,
    isPending: isLoadingApprove,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {},
    },
  })

  const {
    data,
    isSuccess: isSuccessWaitForApproval,
    isLoading: isLoadingWaitForApprove,
  } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  })

  useEffect(() => {
    if (isSuccessWaitForApproval && callbackFn) {
      callbackFn()
    }
  }, [callbackFn, isSuccessWaitForApproval])

  const handleApprove = () => {
    if (protectionAddress) {
      approve({
        abi: erc721Abi,
        address: nft.contractAddress as `0x${string}`,
        functionName: "approve",
        args: [protectionAddress as `0x${string}`, BigInt(nft.id)],
      }).catch((err: ContractFunctionExecutionError) => {
        toast({
          title: err.shortMessage,
        })
      })
    }
  }
  return (
    <LoadingButton
      onClick={handleApprove}
      isLoading={isLoadingApprove || isLoadingWaitForApprove}
      size="lg"
      {...props}
      icon={<Icons.BadgeCheck />}
    >
      {label}
    </LoadingButton>
  )
}

export default ApproveButton
