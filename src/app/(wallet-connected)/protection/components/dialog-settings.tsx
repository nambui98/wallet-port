import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import Image from "next/image"
import { ETH_MAINNET_CHAINID, WETH_MAINNET_ADDRESS } from "@/constants"
import { Factory__factory } from "@/typechain-types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { formatEther, formatUnits as formatUnitsViem } from "viem"
import {
  useAccount,
  useBalance,
  useEstimateMaxPriorityFeePerGas,
  useGasPrice,
} from "wagmi"

import { useEthersSigner } from "@/lib/ethers"
import { formatUnits } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
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
import { ChainContext } from "@/providers/wallet-provider"

type Props = React.ComponentPropsWithoutRef<typeof Dialog> & {
  tokens: GetWalletTokenBalancesResponse[]
}

const FIXED_PLATFORM_FEE_AMOUNT = BigInt(0.0005 * 1e18)
const DEPOSIT_OVER_COST_RATIO = 5 // 5 times more than the cost of the estimated fee
const mapTimelapseTypeValue = {
  day: 86400,
  hour: 3600,
  minute: 60,
}
const DialogSettings = ({
  children,
  open,
  onOpenChange,
  tokens,
  ...props
}: Props) => {
  const {
    setTimelapse,
    timelapse,
    backupWallet,
    setTimelapseType,
    timelapseType,
    setIsOpenDialogProcess,
    onOpenChangeDialogSetting,
    unprotectedTokenSelected,
    setIsOpenDialogSetting,
    setProcessType,
  } = useContext(DashboardContext)
  const signer = useEthersSigner()
  const account = useAccount()
  const { data: balance } = useBalance({ address: account.address })
  const queryClient = useQueryClient()
  const [transactionFee, setTransactionFee] = useState<bigint | undefined>()
  const { factoryAddress } = useContext(ChainContext)

  const factory = useMemo(
    () =>
      Factory__factory.connect(factoryAddress, signer),
    [factoryAddress, signer]
  )
  const { data: maxFeePerGas } = useEstimateMaxPriorityFeePerGas()
  const { data: gasPrice } = useGasPrice()
  const gasUnitInWei = useMemo(
    () => gasPrice ?? maxFeePerGas,
    [gasPrice, maxFeePerGas]
  )

  const transferCost = useMemo(() => {
    const _transferCost = gasUnitInWei
      ? BigInt((54611 + unprotectedTokenSelected.length * 47309).toString()) *
        gasUnitInWei
      : BigInt(0)
    return (
      (_transferCost * BigInt(Math.floor(DEPOSIT_OVER_COST_RATIO * 10))) /
      BigInt(10)
    )
  }, [gasUnitInWei, unprotectedTokenSelected.length])


  const { data: nativeTokenPrice } = useQuery({
    queryKey: ["tokenNativeTokenPrice", account.chain?.id],
    queryFn: () =>
      getTokenPrice({
        chain: ETH_MAINNET_CHAINID,
        address: WETH_MAINNET_ADDRESS,
      }),
    enabled: !!account.chainId,
  })

  const getFeeData = useCallback(async () => {
    if (
      backupWallet &&
      factory &&
      unprotectedTokenSelected &&
      unprotectedTokenSelected.length > 0 &&
      transferCost
    ) {
      try {
        const gasEstimate = await factory
          .getFunction("register")
          ?.estimateGas(
            backupWallet!,
            (timelapse ?? 0) * mapTimelapseTypeValue[timelapseType],
            unprotectedTokenSelected,
            {
              value: transferCost + FIXED_PLATFORM_FEE_AMOUNT,
            }
          )

        if (gasUnitInWei != null) {
          const gasCost = gasUnitInWei * gasEstimate
          // console.log in GWei
          console.log(
            `gasCost: ${formatEther(gasCost)}, gasEstimate: ${gasEstimate}`
          )
          setTransactionFee(gasCost)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [
    backupWallet,
    factory,
    gasUnitInWei,
    timelapse,
    timelapseType,
    transferCost,
    unprotectedTokenSelected,
  ])

  useEffect(() => {
    getFeeData()
  }, [getFeeData])

  const handleProtectToken = async () => {
    try {
      if (!timelapse) {
        toast({
          title: "Please enter a timelapse",
        })
      } else if (!backupWallet) {
        toast({
          title: "Please enter a backup address",
        })
      } else {
        onOpenChangeDialogSetting?.()
        setIsOpenDialogProcess(true)
        setProcessType("waiting")

        if (factory && account && transferCost) {
          const register = await factory.register(
            backupWallet,
            timelapse * mapTimelapseTypeValue[timelapseType],
            unprotectedTokenSelected,
            {
              value: transferCost + FIXED_PLATFORM_FEE_AMOUNT,
            }
          )
          await register.wait()
          if (register) {
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
            if (unprotectedTokenSelected.length > 1) {
              setProcessType("protected")
            } else {
              setProcessType("approve")
            }
          }
        }
      }
    } catch (error: any) {
      toast({
        title:
          error?.reason?.toString() ||
          error.message?.toString() ||
          error?.error?.message.toString() ||
          error.shortMessage?.toString() ||
          error.toString(),
      })
      setIsOpenDialogProcess(false)
      setIsOpenDialogSetting(true)
      return error
    }
  }

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

        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold leading-[22px] text-white">
            Token
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {tokens.map((token) => (
              <div
                key={token.token_address}
                className="flex items-center gap-2"
              >
                {token.logo ? (
                  <Image width={32} height={32} src={token.logo} alt="coin" />
                ) : (
                  <Image
                    width={32}
                    height={32}
                    src="/coin/coin.svg"
                    alt="coin"
                  />
                )}
                <p className="text-base font-semibold leading-[22px] text-white">
                  {token.symbol}
                </p>
              </div>
            ))}
          </div>
        </div>
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

export default DialogSettings
