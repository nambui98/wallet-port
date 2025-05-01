import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import {
  TProtectedToken,
  TProtectionWithTimeData,
  TUnprotectedToken,
} from "@/types"
import { useQuery } from "@tanstack/react-query"
import { isAddress, isAddressEqual } from "viem"
import { useAccount, useAccountEffect, useBalance, useBlock } from "wagmi"
import { sepolia } from "wagmi/chains"

import { toast } from "@/hooks/use-toast"
import { getAllMyTokens } from "@/app/actions"
import { ChainContext } from "./wallet-provider"

export const handleGetAllMyTokens = (
  address: string,
  chainId: number
): Promise<TUnprotectedToken[]> => {
  return new Promise(async (resolve, reject) => {
    console.log("Fetching from moralis", chainId, address)
    try {
      const wethAddress = chainId === sepolia.id
        ? process.env.NEXT_PUBLIC_WETH_ADDRESS__SEPOLIA
        : process.env.NEXT_PUBLIC_WETH_ADDRESS__BASE_SEPOLIA
      const responses = await Promise.all([
        getAllMyTokens({
          address: address,
          chain: chainId,
          tokenAddresses: [wethAddress || ''],
        }),
        getAllMyTokens({
          address: address,
          chain: chainId,
        }).then(tokens => tokens.filter(token => token.token_address.toLowerCase() !== (wethAddress || '').toLowerCase()))
      ])
      const tokens = responses.flat()
      console.log("Success fetching from moralis", tokens)
      localStorage.setItem("availableTokens", JSON.stringify(tokens))
      return resolve(tokens)
    } catch (error) {
      console.log("Error fetching from moralis", error)

      return resolve(
        JSON.parse(
          localStorage.getItem("availableTokens") ?? "[]"
        ) as unknown as TUnprotectedToken[]
      )
    }
  })
}

type DashboardContextType = {
  unprotectedTokens: GetWalletTokenBalancesResponse[]
  protectionContracts: TProtectionWithTimeData[]
  isOpenDialogSetting: boolean
  onOpenChangeDialogSetting?: () => void
  setBackupWallet: (address: string) => void
  setTimelapse: (time: number) => void
  timelapse?: number
  handleSetUnprotectedTokenSelected: (
    token?: string,
    isSingle?: boolean
  ) => void
  backupWallet: string | null
  unprotectedTokenSelected: string[]
  isOpenDialogProcess: boolean
  processType?: "waiting" | "approve" | "spending" | "protected"
  onOpenChangeDialogProcess?: () => void
  timelapseType: "day" | "hour" | "minute"
  setTimelapseType: (time: "day" | "hour" | "minute") => void
  isLoadingAllMyTokens: boolean
  isLoadingAllProtectedMyTokens: boolean
  isOpenDialogBackup: boolean
  onOpenChangeDialogBackup: () => void
  setIsOpenDialogProcess: (value: boolean) => void
  setIsOpenDialogSetting: (value: boolean) => void
  setProcessType: (
    value: "waiting" | "approve" | "spending" | "protected"
  ) => void
  refetchProtectionsAndTokens: () => void
}

export const DashboardContext = React.createContext<DashboardContextType>({
  unprotectedTokens: [],
  protectionContracts: [],
  isOpenDialogSetting: false,
  backupWallet: "",
  setTimelapse(time) {},
  setBackupWallet(address) {},
  unprotectedTokenSelected: [],
  handleSetUnprotectedTokenSelected: function (
    token?: string,
    isSingle?: boolean
  ): void {
    throw new Error("Function not implemented.")
  },
  isOpenDialogProcess: false,
  timelapseType: "day",
  setTimelapseType: function (time: "day" | "hour" | "minute"): void {
    throw new Error("Function not implemented.")
  },
  isLoadingAllMyTokens: false,
  isLoadingAllProtectedMyTokens: false,

  isOpenDialogBackup: false,
  onOpenChangeDialogBackup: () => {},
  setIsOpenDialogProcess: function (value: boolean): void {
    throw new Error("Function not implemented.")
  },
  setIsOpenDialogSetting: function (value: boolean): void {
    throw new Error("Function not implemented.")
  },
  setProcessType: function (
    value: "waiting" | "approve" | "spending" | "protected"
  ): void {
    throw new Error("Function not implemented.")
  },
  refetchProtectionsAndTokens: function () {}
})

const DashBoardProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const account = useAccount()
  const { data: balance } = useBalance({
    address: account.address,
    unit: "ether",
  })
  const { backendService } = useContext(ChainContext)

  const [backupWallet, setBackupWallet] = useState(
    localStorage.getItem("backupWallet")
  )
  const [timelapse, setTimelapse] = useState<number | undefined>()
  const [timelapseType, setTimelapseType] = useState<"day" | "hour" | "minute">(
    "day"
  )
  const [processType, setProcessType] = useState<
    "waiting" | "approve" | "spending" | "protected"
  >()
  const [unprotectedTokenSelected, setUnprotectedTokenSelected] = useState<
    string[]
  >([])

  const [isOpenDialogSetting, setIsOpenDialogSetting] = useState<boolean>(false)
  const [isOpenDialogProcess, setIsOpenDialogProcess] = useState<boolean>(false)
  const [isOpenDialogBackup, setIsOpenDialogBackup] =
    useState<boolean>(false)

  const [unprotectedTokens, setUnProtectedTokens] = useState<
    GetWalletTokenBalancesResponse[]
  >([])
  const [protectionContracts, setProtectionContracts] = useState<
    TProtectionWithTimeData[]
  >([])
  const previousAddress = useRef(account?.address) // Store previous address
  useAccountEffect({
    onConnect(data) {
      console.log("Connected!", data)
    },
    onDisconnect() {
      console.log("Disconnected!")
      onResetState()
    },
  })
  useEffect(() => {
    if (account?.address && account?.address !== previousAddress.current) {
      console.log("Account changed to:", account.address)
      previousAddress.current = account.address
      onResetState()
    }
  }, [account.address, account.isDisconnected])

  const onResetState = () => {
    localStorage.removeItem("backupWallet")
    setBackupWallet("")
    setIsOpenDialogBackup(false)
    setIsOpenDialogProcess(false)
    setIsOpenDialogSetting(false)
  }

  const onOpenChangeDialogSetting = () =>
    setIsOpenDialogSetting(!isOpenDialogSetting)

  const onOpenChangeDialogProcess = () => {
    setIsOpenDialogProcess(!isOpenDialogProcess)
    setUnprotectedTokenSelected([])
    refetchProtectedTokens()
  }
  const onOpenChangeDialogBackup = () =>
    setIsOpenDialogBackup(!isOpenDialogBackup)

  // const { data: blockNumber } = useBlockNumber({ watch: true })
  const { queryKey } = useBlock()

  const {
    data: rawProtectionContract,
    isSuccess: isSuccessGetProtectedTokens,
    isError: isErrorGetProtectedTokens,
    isLoading: isLoadingAllProtectedMyTokens,
    refetch: refetchProtectedTokens,
  } = useQuery({
    queryKey: ["getProtections", account.chainId, account.address],
    queryFn: () => backendService.getProtections(account.address!),
    select(data) {
      return data.data
    },
    refetchInterval: 5000,
    enabled: !!account.address,
  })

  const {
    data: outstandingTokenBalances,
    isSuccess: isSuccessGetAllMyTokens,
    isLoading: isLoadingAllMyTokens,
    refetch: refetchAllMyTokens,
  } = useQuery({
    queryKey: ["getAllMyTokens", account.chainId, account.address],
    queryFn: () => handleGetAllMyTokens(account.address!, account.chainId!),
    enabled: !!account.chainId && !!account.address,
    initialData: [],
  })

  useEffect(() => {
    let _protectionContracts: TProtectionWithTimeData[] = []
    let _unProtectedTokens: TUnprotectedToken[] = []
    const nativeCurrency = account.chain?.nativeCurrency
    if (balance && balance?.value > 0) {
      _unProtectedTokens.push({
        balance: balance.value.toString(),
        decimals: nativeCurrency?.decimals ?? 0,
        name: nativeCurrency?.name ?? "",
        symbol: nativeCurrency?.symbol ?? "",
        token_address: "",
        isNativeToken: true,
      })
    }
    if (rawProtectionContract) {
      _protectionContracts = rawProtectionContract.map((contract) => {
        const erc20Assets: TProtectedToken[] = contract.erc20Assets.map(
          (assetAddress) => {
            const token = outstandingTokenBalances.find((token) =>
              isAddressEqual(token.token_address as `0x${string}`, assetAddress)
            )

            return {
              ...token,
              protectionAddress: contract.protectionAddress,
            }
          }
        ) as TProtectedToken[]
        return {
          ...contract,
          erc20Assets,
        }
      })
    }

    //  filter for unprotected token in outstandingTokenBalances
    const protectedTokenAddresses = _protectionContracts
      .map((contract) =>
        contract.erc20Assets.map((asset) => asset.token_address)
      )
      .flat()
    _unProtectedTokens = [
      ..._unProtectedTokens,
      ...outstandingTokenBalances.filter(
        (token) =>
          !protectedTokenAddresses.includes(
            token.token_address as `0x${string}`
          )
      ),
    ]

    setProtectionContracts(_protectionContracts)
    setUnProtectedTokens(_unProtectedTokens)
  }, [
    account.chain?.nativeCurrency,
    balance,
    isErrorGetProtectedTokens,
    isSuccessGetAllMyTokens,
    isSuccessGetProtectedTokens,
    rawProtectionContract,
    outstandingTokenBalances,
  ])

  const handleSetUnprotectedTokenSelected = (
    token?: string,
    isSingle?: boolean
  ) => {
    if (token) {
      if (isSingle) {
        setUnprotectedTokenSelected([token])
      } else if (unprotectedTokenSelected.includes(token)) {
        setUnprotectedTokenSelected((prev) => [
          ...prev.filter((upt) => upt !== token),
        ])
      } else {
        setUnprotectedTokenSelected((prev) => [...prev, token])
      }
    }
  }

  const handleSetBackupWallet = (address: string) => {
    if (isAddressEqual(address as `0x${string}`, account.address as `0x${string}`)) {
      toast({
        title: "Backup wallet can not be the same as the primary wallet",
      })
      return
    }
    if (!isAddress(address)) {
      toast({
        title: "Invalid address",
      })
      return
    }
    setBackupWallet(address)
    localStorage.setItem("backupWallet", address)
    isOpenDialogBackup && onOpenChangeDialogBackup()
  }

  const refetchProtectionsAndTokens = useCallback(() => {
    refetchProtectedTokens()
    refetchAllMyTokens()
  }, [refetchAllMyTokens, refetchProtectedTokens])

  return (
    <DashboardContext.Provider
      value={{
        unprotectedTokens,
        protectionContracts,
        isOpenDialogSetting,
        backupWallet,
        onOpenChangeDialogSetting,
        setBackupWallet: handleSetBackupWallet,
        setTimelapse,
        handleSetUnprotectedTokenSelected,
        unprotectedTokenSelected,
        onOpenChangeDialogProcess,
        isOpenDialogProcess,
        processType,
        timelapseType,
        setTimelapseType,
        timelapse,
        isLoadingAllMyTokens,
        isLoadingAllProtectedMyTokens,
        isOpenDialogBackup,
        onOpenChangeDialogBackup,
        setIsOpenDialogProcess,
        setIsOpenDialogSetting,
        setProcessType,
        refetchProtectionsAndTokens,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export default DashBoardProvider
