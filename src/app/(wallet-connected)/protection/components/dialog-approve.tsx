import React, { useContext, useMemo } from "react"
import Image from "next/image"
import { DashboardContext } from "@/providers/dashboard-provider"

import TimeRemaining from "@/lib/time-remaining"
import { calculateRemainingTime, cn, formatUnits } from "@/lib/utils"
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Icons,
} from "@/components/common"

import ApproveButton from "./approve-button"

type Props = React.ComponentPropsWithoutRef<typeof Dialog> & {}

const DialogApprove = ({ children, ...props }: Props) => {
  const {
    onOpenChangeDialogProcess: onOpenChange,
    unprotectedTokenSelected,
    protectionContracts,
    isOpenDialogProcess: open,
    processType: type,
    setIsOpenDialogProcess,
  } = useContext(DashboardContext)

  const clonedClose = React.cloneElement(
    <Button onClick={() => onOpenChange?.()} className="w-full flex-1">
      Close
    </Button>
  )

  const renderHeading = useMemo(
    () => (type?: string) => {
      return new Map([
        ["waiting", "Waiting for confirmations"],
        ["approve", "Approve the protection"],
        ["spending", "Your assets are now Protected!"],
        ["protected", "Your assets are now Protected!"],
      ]).get(type ?? "")
    },
    []
  )

  const renderDescription = useMemo(
    () => (type?: string) => {
      return new Map([
        [
          "waiting",
          `Once your protection is confirmed, it will be displayed in your dashboard shortly.`,
        ],
        [
          "approve",
          "Your asset protection has been confirmed and should be displayed in your dashboard shortly. Please click Approve to allow the protection contract to move your asset once the time is due.",
        ],
        [
          "spending",
          "Your assets are now Protected! Please approve spending for each selected token.",
        ],
        [
          "protected",
          "Your asset protection has been confirmed and should be displayed in your dashboard shortly. Please click Approve to allow the protection contract to move your asset once the time is due.",
        ],
      ]).get(type ?? "")
    },
    []
  )

  const protectedTokens = protectionContracts.flatMap(
    (contract) => contract.erc20Assets
  )

  const tokens = protectedTokens.filter((token) =>
    unprotectedTokenSelected.includes(token.token_address)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        classNamePattern={cn(type === "protected" && "!bg-green bg-none")}
      >
        <DialogHeader className="gap-2 space-y-0">
          {type === "waiting" && (
            <Icons.RotateCw
              className="text-primary-light  size-12 animate-spin"
              style={{
                animationDuration: "4000ms",
              }}
            />
          )}
          {(type === "approve" || type === "spending") && (
            <Icons.TickCircle className="size-12 lg:size-16" />
          )}
          {type === "protected" && <Icons.ShieldTick className="size-16" />}

          <h2 className="text-left text-2xl font-semibold text-white">
            {renderHeading?.(type)}
          </h2>
          <p className="text-left text-base font-medium leading-[22px] text-white">
            {renderDescription?.(type)}
          </p>
        </DialogHeader>
        {type === "approve" && (
          <div className="flex items-stretch justify-between gap-3 md:gap-6 ">
            {unprotectedTokenSelected.length === 1 && (
              <ApproveButton
                token={tokens[0]}
                label="Approve Now"
                className="size-full flex-1 gap-2 "
                callbackFn={() => onOpenChange?.()}
              />
            )}
            <Button onClick={() => onOpenChange?.()} variant="destructive">
              Later
            </Button>
          </div>
        )}

        {type === "spending" && <>{clonedClose}</>}
        {type === "protected" && (
          <div className="border-t-dark-20 border-t pt-6">
            {/* <div className="mb-6 grid grid-cols-2 gap-2">
              <p className="text-dark-40 text-center text-base font-semibold leading-[22px]">
                Token
              </p>
              <p className="text-dark-40 text-center text-base font-semibold leading-[22px]">
                Amount
              </p>

              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className="col-span-3 grid grid-cols- gap-2"
                >
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div key={token.symbol} className="flex items-center gap-2">
                      {token.logo ? (
                        <Image
                          src={token.logo}
                          width={24}
                          height={24}
                          alt="coin"
                        />
                      ) : (
                        <Image
                          src="/coin/coin.svg"
                          width={24}
                          height={24}
                          alt="coin"
                        />
                      )}
                      <span className="text-base font-semibold leading-[22px] text-white">
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                  <span className="text-center text-base font-semibold leading-[22px] text-white">
                    {token?.balance &&
                      formatUnits(
                        BigInt(token?.balance!),
                        token?.decimals ?? 0,
                        ''
                      )}
                  </span>

                </div>
              ))}
            </div> */}
            <>{clonedClose}</>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogApprove
