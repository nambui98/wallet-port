import { useCallback, useContext, useEffect, useState } from "react"
import Link from "next/link"
import { DashboardContext } from "@/providers/dashboard-provider"
import { ProtectionDelegate__factory } from "@/typechain-types"
import { TProtectionWithTimeData } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { ContractFunctionExecutionError } from "viem"
import { useAccount, useWaitForTransactionReceipt } from "wagmi"

import { useEthersSigner } from "@/lib/ethers"
import TimeRemaining from "@/lib/time-remaining"
import { shortenAddress } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/common"

import ProtectedItem from "./protected-item"

const ProtectionContract = ({
  contract,
}: {
  contract: TProtectionWithTimeData
}) => {
  const [timeRemaining, setTimeRemaining] = useState("Checking...")
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelTxHash, setCancelTxHash] = useState<`0x${string}`>()
  const signer = useEthersSigner()
  const account = useAccount()
  const queryClient = useQueryClient()
  const { refetchProtectionsAndTokens } = useContext(DashboardContext)
  const handleCancel = () => {
    setCancelTxHash(undefined)
    if (signer) {
      setIsCancelling(true)

      const protection = ProtectionDelegate__factory.connect(
        contract.protectionAddress,
        signer
      )
      protection
        .cancel()
        .then((data) => {
          setIsCancelling(false)
          setCancelTxHash(data.hash as `0x${string}`)
          queryClient.invalidateQueries({
            queryKey: [
              "getAllProtectedMyTokens",
              account.chainId,
              account.address,
            ],
          })
          queryClient.invalidateQueries({
            queryKey: ["getAllMyTokens", account.chainId, account.address],
          })
        })
        .catch((err: ContractFunctionExecutionError) => {
          setIsCancelling(false)
          toast({
            title: err.shortMessage,
          })
        })
    }
  }

  const { isLoading: isLoadingWaitForCancel, isSuccess: isCancelSuccess } =
    useWaitForTransactionReceipt({ hash: cancelTxHash })

  useEffect(() => {
    if (isCancelSuccess) {
      toast({
        title: "Protection canceled",
      })
    }
  }, [isCancelSuccess])

  const onProtectionExecutedHandler = useCallback(() => {
    setTimeout(refetchProtectionsAndTokens, 2000)
    toast({
      title: "A protection is due and being executed",
    })
  }, [refetchProtectionsAndTokens])

  return (
    <div className="flex flex-col rounded-[24px] bg-white/5 p-3 hover:bg-white/10 md:px-5 md:py-4">
      <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-1 md:items-center">
        <div className="flex items-center gap-2">
          Protection:
          <span className="font-semibold">
            {shortenAddress(contract.protectionAddress)}
          </span>
          <Link
            target="_blank"
            href="https://etherscan.io/address/[address]"
            as={`https://etherscan.io/address/${contract.protectionAddress}`}
          >
            <Icons.Link className="size-4" fill="white" />
          </Link>
        </div>
        <p className="text-primary-100 flex  items-center gap-2 text-xs font-semibold leading-[18px] md:flex-row md:items-center">
          <span className="items-left flex flex-row  gap-1">
            <Icons.ClockOutline fill="rgb(60, 123, 253)" />
            <TimeRemaining
              timelapse={contract.timelapse}
              from={contract.lastActiveTimestamp}
              onCountdownEnd={onProtectionExecutedHandler}
            />
          </span>
          {"  "}
          <span
            className="text-red bg-dark-20 cursor-pointer rounded-full px-4 py-1 text-xs font-semibold leading-[18px]"
            onClick={handleCancel}
          >
            {isCancelling || isLoadingWaitForCancel
              ? "Cancelling..."
              : "Cancel"}
          </span>
        </p>
      </div>

      {/* heading */}
      <div className="border-dark-20 grid grid-cols-[minmax(68px,_1fr)_minmax(50px,_1fr)_minmax(60px,_1fr)_minmax(50px,_1fr)] gap-4  border-b py-2 md:grid-cols-[minmax(105px,_1fr)_minmax(50px,_1fr)_minmax(80px,_1fr)_minmax(150px,_1fr)]">
        <p className="text-base font-semibold leading-[22px] text-white">
          Token
        </p>
        <p className="text-left text-base font-semibold leading-[22px] text-white">
          Total
        </p>
        <p className="text-left text-base font-semibold leading-[22px] text-white">
          Approved
        </p>
      </div>

      {contract.erc20Assets.map((asset, idx) => (
        <ProtectedItem key={idx} token={asset} />
      ))}
    </div>
  )
}

export default ProtectionContract
