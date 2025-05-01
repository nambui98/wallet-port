import React, { useContext, useEffect } from "react"
import { ETH_MAINNET_CHAINID, WETH_MAINNET_ADDRESS } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import { formatUnits as formatUnitsViem } from "viem"
import { useAccount, useBalance } from "wagmi"

import { formatUnits } from "@/lib/utils"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Icons,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/common"
import { getTokenPrice } from "@/app/actions"

import { DashboardContext } from "@/providers/dashboard-provider"
import { NftContext } from "@/providers/nft-provider"
import { useCreateNftProtection } from "@/hooks/use-create-nft-protection"
import { useTransferCostNfts } from "@/hooks/use-transfer-cost-nft"

type Props = React.ComponentPropsWithoutRef<typeof Dialog> & {}

const FIXED_PLATFORM_FEE_AMOUNT = BigInt(0.0005 * 1e18)

const DialogSettingsNft = ({
  children,
  open,
  onOpenChange,
  ...props
}: Props) => {
  const {
    backupWallet,
  } = useContext(DashboardContext)
  const {
    selectedNfts,
    setIsSettingProtectionLoading,
    refetchProtectionAndNfts,
  } = useContext(NftContext)
  const account = useAccount()
  const { data: balance } = useBalance({ address: account.address })
  const {
    handleProtectToken,
    timelapse,
    setTimelapse,
    timelapseType,
    setTimelapseType,
    isLoading,
    transactionFee,
  } = useCreateNftProtection({
    backupWallet,
    closeDialog: onOpenChange!,
  })

  useEffect(() => {
    setIsSettingProtectionLoading(!!isLoading)
    if (isLoading === false) {
      refetchProtectionAndNfts()
    }
  }, [isLoading, refetchProtectionAndNfts, setIsSettingProtectionLoading])

  const { data: nativeTokenPrice } = useQuery({
    queryKey: ["tokenNativeTokenPrice", account.chain?.id],
    queryFn: () =>
      getTokenPrice({
        chain: ETH_MAINNET_CHAINID,
        address: WETH_MAINNET_ADDRESS,
      }),
    enabled: !!account.chainId,
  })

  const { transferCost } = useTransferCostNfts({ nftsCount: selectedNfts.length })

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b-dark-20 gap-2 space-y-0 border-b pb-6">
          <Icons.ClockOutline className="size-12 lg:size-16" />
          <h2 className="text-left text-2xl font-semibold text-white">
            Protection settings
          </h2>
          <p className="text-left text-sm font-medium text-white">
            Define time period for your protection. If there won’t be any
            interaction with your wallet address during that time, then assets
            will be automatically transfered to{" "}
            <span className="text-primary-100">Backup Address</span>
          </p>
        </DialogHeader>

        <FeeEstimationPreview
          transferCost={transferCost}
          transactionFee={transactionFee ?? BigInt(0)}
          nativeTokenPrice={nativeTokenPrice}
          decimals={balance?.decimals}
          symbol={balance?.symbol}
        />
        <div className="flex flex-col gap-2">
          {/* <p className="text-base font-semibold leading-[22px] text-white">
            Timelapse
          </p> */}
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 lg:col-span-1">
              <Input
                value={timelapse}
                onChange={(e) => setTimelapse(parseFloat(e.target.value))}
                type="number"
                placeholder="Protection timelapse"
                className="h-[46px]"
              />
            </div>

            <Tabs
              value={timelapseType}
              onValueChange={(value) =>
                setTimelapseType(value as "day" | "hour" | "minute")
              }
              className="col-span-2 lg:col-span-1"
            >
              <TabsList className="h-[46px] w-full">
                <TabsTrigger value="day" className="w-full">
                  Day
                </TabsTrigger>
                <TabsTrigger value="hour" className="w-full">
                  Hour
                </TabsTrigger>
                <TabsTrigger value="minute" className="w-full">
                  Minute
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={handleProtectToken}>
            Set protection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const FeeEstimationPreview = ({
  transferCost,
  transactionFee,
  decimals,
  symbol,
  nativeTokenPrice,
}: {
  transferCost: bigint
  transactionFee: bigint
  decimals?: number
  symbol?: string
  nativeTokenPrice?: any
}) => {
  const total = transactionFee + transferCost + FIXED_PLATFORM_FEE_AMOUNT

  return (
    <>
    {transactionFee && (
      <div className="flex justify-between text-sm  text-white">
        <p>Transaction fee</p>
        <p>
          {formatUnits(transactionFee, decimals, symbol)}{" "}
          {nativeTokenPrice && (
            <span className="f text-sm text-[#A9A9A9]">
              (
              {(
                Number(formatUnitsViem(transactionFee, decimals ?? 0)) *
                (nativeTokenPrice as any)?.usdPrice
              ).toFixed(2) + " "}
              USD){/* {transactionFee * nativeTokenPrice.} */}
            </span>
          )}
        </p>
      </div>
    )}
    {transferCost && (
      <div className="flex justify-between text-sm  text-white">
        <p>Deposit</p>
        <p>
          {formatUnits(transferCost, decimals, symbol)}{" "}
          {nativeTokenPrice && (
            <span className="text-sm text-[#A9A9A9]">
              (
              {(
                Number(formatUnitsViem(transferCost, decimals ?? 0)) *
                (nativeTokenPrice as any)?.usdPrice
              ).toFixed(2) + " "}
              USD)
            </span>
          )}
        </p>
      </div>
    )}
    <div className="flex justify-between text-sm  text-white">
      <p>Service fee</p>
      <p>
        {formatUnits(FIXED_PLATFORM_FEE_AMOUNT, decimals, symbol)}{" "}
        {nativeTokenPrice && (
          <span className="text-sm text-[#A9A9A9]">
            (
            {(
              Number(
                formatUnitsViem(FIXED_PLATFORM_FEE_AMOUNT, decimals ?? 0)
              ) * (nativeTokenPrice as any)?.usdPrice
            ).toFixed(2) + " "}
            USD)
          </span>
        )}
      </p>
    </div>

    <div className="flex justify-between text-sm font-semibold text-white">
      <p>Total</p>
      <p>
        {formatUnits(total, decimals, symbol)}{" "}
        {nativeTokenPrice && (
          <span className="text-sm text-[#A9A9A9]">
            (
            {(
              Number(formatUnitsViem(total, decimals ?? 0)) *
              (nativeTokenPrice as any)?.usdPrice
            ).toFixed(2) + " "}
            USD)
          </span>
        )}
      </p>
    </div>
  </>
  )
}

export default DialogSettingsNft
