import React, { useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { DashboardContext } from "@/providers/dashboard-provider"
import { TUnprotectedToken } from "@/types"
import { CheckedState } from "@radix-ui/react-checkbox"

import { formatUnits } from "@/lib/formatUnits"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/common"
import { Checkbox } from "@/components/common/checkbox"
import LoadingButton from "@/components/common/loading-button"

import DialogWrapToken from "./dialog-wrap-token"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  token?: TUnprotectedToken
  isSelectMultiMode: CheckedState
}

const UnProtectItem = ({
  className,
  token,
  isSelectMultiMode,
  ...props
}: Props) => {
  const {
    backupWallet,
    unprotectedTokenSelected,
    handleSetUnprotectedTokenSelected,
    onOpenChangeDialogSetting,
  } = useContext(DashboardContext)

  return (
    <div
      className={cn(
        "grid h-[58px] w-full grid-cols-[minmax(144px,_1fr)_minmax(80px,_1fr)_1fr] items-center justify-between rounded-3xl py-2 hover:bg-white/10 md:px-3 lg:min-w-max",
        className
      )}
      {...props}
    >
      <div className="flex items-center">
        {isSelectMultiMode && (
          <div className="mr-2">
            <Checkbox
              checked={unprotectedTokenSelected.includes(
                token?.token_address ?? ""
              )}
              onCheckedChange={(value) =>
                handleSetUnprotectedTokenSelected(token?.token_address)
              }
            />
          </div>
        )}
        <Image
          src={token?.logo || "/coin/coin.svg"}
          width={32}
          height={32}
          alt="token logo"
          className="rounded-full"
        />
        <div className="ml-2 flex flex-col">
          {token?.token_address ? (
            <Link
              target="_blank"
              href={`https://sepolia.etherscan.io/token/${token.token_address}`}
            >
              <p className="text-sm font-semibold leading-5 text-white">
                {token?.symbol}
              </p>
            </Link>
          ) : (
            <p className="text-sm font-semibold leading-5 text-white">
              {token?.symbol}
            </p>
          )}

          <span className="text-dark-20 max-w-[80px] truncate text-xs font-semibold leading-[18px]">
            {token?.name}
          </span>
        </div>
      </div>
      <div className="flex">
        <p className="text-sm font-semibold text-white">
          {token?.balance &&
            formatUnits(BigInt(token?.balance!), token?.decimals ?? 0)}
        </p>
      </div>
      {token?.isNativeToken ? (
        <DialogWrapToken />
      ) : (
        <LoadingButton
          size="lg"
          disabled={!!isSelectMultiMode.valueOf()}
          onClick={() => {
            if (!backupWallet) {
              toast({
                title: "Please enter a backup address",
              })
            } else {
              handleSetUnprotectedTokenSelected(token?.token_address, true)
              onOpenChangeDialogSetting?.()
            }
          }}
          className="[&>svg]:disabled:fill-dark-80 hover:shadow-drop-shadow gap-0 text-sm"
          icon={<Icons.Security />}
        >
          <div className="hidden md:block">Protect</div>
        </LoadingButton>
      )}
    </div>
  )
}

export default UnProtectItem
