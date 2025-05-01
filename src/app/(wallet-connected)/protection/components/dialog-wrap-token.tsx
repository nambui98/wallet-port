import { useContext, useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { parseEther } from "ethers"
import { ContractFunctionExecutionError } from "viem"
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"

import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Icons,
  Input,
} from "@/components/common"
import LoadingButton from "@/components/common/loading-button"
import { ChainContext } from "@/providers/wallet-provider"

type Props = {}

const DialogWrapToken = ({}: Props) => {
  const [amount, setAmount] = useState<number | undefined>()
  const [hash, setHash] = useState<`0x${string}` | undefined>()
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const account = useAccount()
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: account.address,
    unit: "ether",
  })

  const { wethAddress } = useContext(ChainContext)

  const wethABI = [
    {
      constant: false,
      inputs: [],
      name: "deposit",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
  ]
  const { writeContractAsync: wrap, isPending: isLoadingWrap } =
    useWriteContract()
  const formatUnits = (value: string) => parseFloat(Number(value)?.toFixed(6))

  const {
    isSuccess: isSendTransactionSuccess,
    isLoading: isLoadingWaitTransaction,
    error,
  } = useWaitForTransactionReceipt({
    hash: hash,
  })

  useEffect(() => {
    if (isSendTransactionSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["getAllMyTokens", account.chainId, account.address],
      })
      refetchBalance()
      toast({
        title: "Wrap successfully",
      })
      setHash(undefined)
      setOpen(false)
    }
  }, [
    account.address,
    account.chainId,
    isSendTransactionSuccess,
    queryClient,
    refetchBalance,
  ])

  useEffect(() => {
    if (error) {
      toast({
        title: error.message,
      })
    }
  }, [error])

  const handleSwapNativeToken = () => {
    if (balance) {
      if (!amount) {
        toast({
          title: "Please enter amount",
        })
      } else if (balance?.value < parseEther(amount.toString())) {
        toast({
          title: "Amount invalid",
        })
      } else {
        wrap({
          abi: wethABI,
          address: wethAddress as `0x${string}`,
          functionName: "deposit",
          value: parseEther(amount.toString()),
        })
          .then((hashRes) => {
            setHash(hashRes)
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
            toast({
              title: err.shortMessage,
            })
          })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <LoadingButton
          size="lg"
          className="[&>svg]:disabled:fill-dark-80 hover:shadow-drop-shadow gap-2 text-sm"
          icon={<Icons.ArrowRightLeft />}
        >
          <div className="hidden md:block">Wrap</div>
        </LoadingButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b-dark-20 gap-2 space-y-0 border-b pb-6">
          <Icons.ArrowRightLeft className="text-primary-100 size-12 lg:size-16" />
          <div className="z-10 flex justify-between">
            <h2 className="text-left text-2xl font-semibold text-white">
              Wrap
            </h2>
            <h2 className="text-left text-2xl font-semibold text-white">
              {/* {balance?.value.valueOf()}o */}
              {`${formatUnits(balance?.formatted ?? "0")} ${balance?.symbol}`}
            </h2>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold leading-[22px] text-white">
            Amount
          </p>
          <div className="">
            <div className="relative ">
              <Input
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                type="number"
                placeholder="Enter your amount"
                className="h-[46px] pr-10"
              />
              <p className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold">
                {balance?.symbol}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            isLoading={isLoadingWrap || isLoadingWaitTransaction}
            onClick={handleSwapNativeToken}
            className="[&>svg]:disabled:fill-dark-80 hover:shadow-drop-shadow w-full gap-2 text-sm"
            icon={<Icons.ArrowRightLeft />}
          >
            Wrap
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogWrapToken
