import { useEffect } from "react"
import { TProtectedToken } from "@/types"
import { ContractFunctionExecutionError, erc20Abi } from "viem"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { ButtonProps, Icons } from "@/components/common"
import LoadingButton from "@/components/common/loading-button"

const ApproveButton = ({
  token,
  label,
  callbackFn,
  ...props
}: ButtonProps & {
  token: TProtectedToken
  label: React.ReactNode
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessWaitForApproval])

  const handleApprove = () => {
    if (token?.protectionAddress) {
      console.log("token.token_address :>> ", token.token_address)
      approve({
        abi: erc20Abi,
        address: token.token_address as `0x${string}`,
        functionName: "approve",
        args: [token.protectionAddress as `0x${string}`, BigInt(token.balance)],
      }).catch((err: ContractFunctionExecutionError) => {
        toast({
          title: err.shortMessage,
        })
      })
    }
  }
  return (
    <LoadingButton
      onClick={() => handleApprove()}
      isLoading={isLoadingApprove || isLoadingWaitForApprove}
      size="lg"
      {...props}
      icon={<Icons.BadgeCheck />}
      className={cn("w-full px-3 md:px-4", props.className)}
    >
      {label}
    </LoadingButton>
  )
}

export default ApproveButton
