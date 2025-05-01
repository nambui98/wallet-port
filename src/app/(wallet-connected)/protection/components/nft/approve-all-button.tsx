import { useEffect } from "react"
import { TNft, TProtectedToken } from "@/types"
import { ContractFunctionExecutionError, erc721Abi } from "viem"
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { toast } from "@/hooks/use-toast"
import { Button, ButtonProps, Icons } from "@/components/common"
import LoadingButton from "@/components/common/loading-button"

const ApproveButton = ({
  nft,
  protectionAddress,
  label,
  callbackFn,
  ...props
}: ButtonProps & {
  nft: TNft
  protectionAddress: string
  label: string
  callbackFn?: () => void
}) => {
  const account = useAccount()

  const {
    data: approveTxHash,
    writeContractAsync: approve,
    isPending: isLoadingApprove,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {},
    },
  })

  // const {
  //   data: isApprovedAll,
  //   isLoading: isLoadingApprovedAll,
  // } = useReadContract({
  //   address: nft.contractAddress as `0x${string}`,
  //   abi: erc721Abi,
  //   functionName: "isApprovedForAll",
  //   query: {
  //     enabled: !!nft?.contractAddress,
  //     gcTime: 2000,
  //   },
  //   args: [ account?.address as `0x${string}`, protectionAddress as `0x${string}`],
  // })

  const {
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
        functionName: "setApprovalForAll",
        args: [protectionAddress as `0x${string}`, true],
      }).catch((err: ContractFunctionExecutionError) => {
        toast({
          title: err.shortMessage,
        })
      })
    }
  }

  return (
    <span
      className="text-red flex cursor-pointer items-center gap-1 text-xs font-semibold leading-[18px]"
      onClick={handleApprove}
    >
      <Icons.BadgeCheck className="size-4" />
      {label}
    </span>
  )
}

export default ApproveButton
