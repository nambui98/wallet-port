import React, { useContext, useMemo, useState } from "react"
import Image from "next/image"
import { DashboardContext } from "@/providers/dashboard-provider"
import { NftContext } from "@/providers/nft-provider"
import { Pencil } from "lucide-react"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button, Icons, Input, Spinner } from "@/components/common"

import DialogBackupAddress from "./dialog-backup-address"
import ProtectedNfts from "./nft/protected-nfts"
import ProtectionContract from "./protection-contract"

type Props = React.HTMLAttributes<HTMLDivElement> & {}

const ProtectedTokens = ({ className, ...props }: Props) => {
  const {
    protectionContracts,
    backupWallet,
    isLoadingAllMyTokens,
    isLoadingAllProtectedMyTokens,
    isOpenDialogBackup,
    onOpenChangeDialogBackup,
  } = useContext(DashboardContext)
  const { nftProtection, isLoadingAllNftsProtected, isLoadingAllNfts } =
    useContext(NftContext)

  const [search, setSearch] = useState<string>("")
  const filteredContracts = useMemo(
    () => [
      ...protectionContracts.filter((contract) =>
        !search
          ? true
          : contract.erc20Assets
              .map((asset) => asset.symbol)
              .join("")
              .toLowerCase()
              .includes(search.toLowerCase())
      ),
    ],
    [protectionContracts, search]
  )

  return (
    <>
      <div
        className={cn(
          "flex size-full max-h-[600px] flex-col gap-2 rounded-3xl border-2 border-white/[0.12] bg-white/[0.08] p-4",
          className
        )}
        {...props}
      >
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your token"
          Icon={<Icons.Search />}
        />

        <div className="flex w-full grow flex-col overflow-y-scroll">
          {isLoadingAllMyTokens ||
          isLoadingAllProtectedMyTokens ||
          isLoadingAllNftsProtected ||
          isLoadingAllNfts ? (
            <div className="flex h-full min-h-[323px] items-center justify-center">
              <Spinner size={40} />
            </div>
          ) : (!filteredContracts || filteredContracts?.length === 0) &&
            !nftProtection ? (
            <div className="mx-auto flex min-h-[323px] w-full max-w-[280px] flex-1 flex-col items-center justify-center gap-4">
              <Image
                src="/protect-token/no_protected_found.svg"
                width={80}
                height={80}
                alt="no token found"
              />
              <p className="text-center text-base font-semibold leading-[22px]">
                You don’t have any{" "}
                <span className="text-primary-100">Protected Token</span>
              </p>
            </div>
          ) : (
            <>
              {/* table */}
              <div className="flex h-full min-h-[323px] flex-col gap-2 overflow-auto md:px-2">
                <ProtectedNfts />
                {filteredContracts?.map((contract, idx) => (
                  <ProtectionContract
                    key={contract.protectionAddress}
                    contract={contract}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {/* submit */}
        {backupWallet && (
          <div className="ml-auto pt-4">
            <div className="bg-primary-linear inline-flex h-7 items-center justify-center gap-2 whitespace-nowrap rounded-3xl px-4 py-1 text-sm font-semibold leading-[22px]">
              <span>Backup address:</span>
              <span>
                {backupWallet?.slice(0, 4) +
                  "..." +
                  backupWallet?.slice(
                    backupWallet.length - 4,
                    backupWallet.length
                  )}
              </span>
              <Button
                size="sm"
                className="p-0"
                variant="ghost"
                onClick={onOpenChangeDialogBackup}
              >
                <Pencil className="size-4 text-white" />
              </Button>
              <Button
                size="sm"
                className="p-0"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(backupWallet)
                  toast({
                    title: "Copied",
                    description: "Backup address copied to clipboard",
                  })
                }}
              >
                <Icons.Copy />
              </Button>
            </div>
          </div>
        )}
      </div>
      {isOpenDialogBackup && (
        <DialogBackupAddress
          open={isOpenDialogBackup}
          onOpenChange={onOpenChangeDialogBackup}
        />
      )}
    </>
  )
}

export default React.memo(ProtectedTokens)
