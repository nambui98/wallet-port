"use client"

import { useContext } from "react"
import { ChainContext } from "@/providers/wallet-provider"
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

import { cn, shortenAddress } from "@/lib/utils"
import { Spinner } from "@/components/common"
import Disclosure from "@/components/common/disclosure"

import NftProtection from "./nft-protection"
import Protection from "./protection"

type Props = React.HTMLAttributes<HTMLDivElement> & {}

const PrimaryWallets = ({ className, ...props }: Props) => {
  const account = useAccount()
  const { backendService, alchemyNetwork } = useContext(ChainContext)
  const {
    data: primaryWallets,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getPrimaryWallets", account.chainId, account.address],
    queryFn: () =>
      backendService.getPrimaryWallets(account.address!, alchemyNetwork),
    select(data) {
      return data
    },
    refetchInterval: 5000,
    enabled: !!account.address,
  })

  return (
    <div
      className={cn(
        "relative flex size-full flex-col gap-2 rounded-3xl border-2 border-white/[0.12] bg-[#051942] p-4",
        className
      )}
      {...props}
    >
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && !primaryWallets?.length && (
        <div className="flex justify-center">No Protections</div>
      )}
      {primaryWallets?.map((wallet) => {
        const { address, protections, nftProtection, nfts } = wallet
        const tokensCount =
          protections?.map((protection) => protection.erc20Assets).flat()
            .length || 0
        // const nftsCount = (nftProtection?.erc721Assets?.length || 0) + (nftProtection?.erc1155Assets?.length || 0)
        const nftsCount =
          nftProtection?.erc721Assets.reduce(
            (acc, curr) => acc + curr.ids.length,
            0
          ) || 0
        const protectionsCount =
          (protections?.length || 0) + (nftProtection ? 1 : 0)

        return (
          <Disclosure
            key={wallet.address}
            defaultOpen={true}
            buttonContent={
              <div className="flex flex-wrap gap-2 md:gap-4">
                <PrimaryWallets.LabelValue
                  label="Primary Wallet"
                  className="flex w-full items-baseline gap-2 md:block md:w-fit"
                  value={shortenAddress(address)}
                />
                <PrimaryWallets.LabelValue
                  label="Protections"
                  className="flex w-full items-baseline gap-2 md:block md:w-fit"
                  value={protectionsCount + ""}
                />
                {!!tokensCount && (
                  <PrimaryWallets.LabelValue
                    label="Tokens"
                    className="flex w-full items-baseline gap-2 md:block md:w-fit"
                    value={tokensCount + ""}
                  />
                )}
                {!!nftsCount && (
                  <PrimaryWallets.LabelValue
                    label="NFTs"
                    value={nftsCount + ""}
                  />
                )}
              </div>
            }
            panel={
              <div className="flex flex-col gap-4">
                {nftProtection && (
                  <NftProtection
                    protection={nftProtection}
                    nfts={nfts || []}
                    refetch={refetch}
                  />
                )}

                {protections?.map((protection, index) => (
                  <Protection
                    key={protection.protectionAddress}
                    protection={protection}
                    refetch={refetch}
                  />
                ))}
              </div>
            }
          />
        )
      })}
    </div>
  )
}

type LabelValueProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string
  value: string
}

PrimaryWallets.LabelValue = function LabelValue({
  label,
  value,
  ...props
}: LabelValueProps) {
  return (
    <div {...props}>
      <p className="text-dark-40 text-sm">{label}</p>
      <span className="text-base font-semibold text-white">{value}</span>
    </div>
  )
}

export default PrimaryWallets
