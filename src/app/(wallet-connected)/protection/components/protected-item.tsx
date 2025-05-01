import React from "react"
import Image from "next/image"
import Link from "next/link"
import { TProtectedToken } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { erc20Abi } from "viem"
import { useAccount, useReadContract } from "wagmi"

import { formatUnits } from "@/lib/formatUnits"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/common"

import ApproveButton from "./approve-button"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  token: TProtectedToken
}

const ProtectedItem = ({ token, className, ...props }: Props) => {
  const account = useAccount()

  const queryClient = useQueryClient()
  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    address: token.token_address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    query: {
      enabled: !!account?.address && !!token?.protectionAddress,
      gcTime: 2000,
    },
    args: [
      account.address as `0x${string}`,
      token.protectionAddress as `0x${string}`,
    ],
  })

  refetchAllowance()

  const percentage = allowance
    ? (parseFloat(formatUnits(allowance!, token.decimals)) * 100) /
      parseFloat(formatUnits(BigInt(token.balance), token.decimals))
    : 0

  return (
    <div className={cn(" py-2  last:pb-0", className)} {...props}>
      <div className="grid grid-cols-[minmax(68px,_1fr)_minmax(50px,_1fr)_minmax(60px,_1fr)_minmax(50px,_1fr)] items-center  gap-4 md:grid-cols-[minmax(105px,_1fr)_minmax(50px,_1fr)_minmax(80px,_1fr)_minmax(150px,_1fr)]">
        <div className="flex  items-center">
          <Image
            src={token.logo || "/coin/coin.svg"}
            width={16}
            height={16}
            alt="token avatar"
            className="rounded-full"
          />
          <div className="ml-2 flex flex-col">
            <Link
              target="_blank"
              href={`https://sepolia.etherscan.io/token/${token.token_address}`}
            >
              <p className="text-sm font-semibold leading-5 text-white">
                {token.symbol}
              </p>
            </Link>
          </div>
        </div>
        <div className="">
          <p className="text-sm font-semibold text-white">
            {token.balance
              ? formatUnits(BigInt(token.balance!), token.decimals)
              : 0}
          </p>
        </div>
        <div className="flex  flex-row items-center gap-1">
          {isLoadingAllowance ? (
            <Spinner />
          ) : (
            <p className="text-sm font-semibold text-white">
              {allowance ? formatUnits(allowance, token.decimals) : 0}
            </p>
          )}
          <p
            className={cn(
              "text-primary-100 text-xs font-semibold leading-[18px]"
              // active && 'text-green'
            )}
          >
            {`(${percentage.toFixed(2)}%)`}
          </p>
        </div>{" "}
        {/* <div className="flex justify-end gap-1"> */}
        {/* <LoadingButton
            onClick={() => handleApprove()}
            isLoading={isLoadingApprove || isLoadingWaitForApprove}
            variant="destructive"
            size="lg"
            className="text-primary-light min-w-[112px] text-sm leading-5"
            icon={<Icons.BadgeCheck />}
          >
            Approve
          </LoadingButton> */}
        <ApproveButton
          token={token}
          label={
            <div className="hidden md:block">
              {percentage > 0 ? "Reapprove" : "Approve"}
            </div>
          }
          callbackFn={refetchAllowance}
          className="text-primary-light w-full min-w-min text-sm leading-5 "
          variant="destructive"
        />
        {/* </div> */}
      </div>
    </div>
  )
}

export default ProtectedItem
