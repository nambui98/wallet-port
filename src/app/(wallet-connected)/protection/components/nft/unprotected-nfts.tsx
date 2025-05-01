import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import Image from "next/image"
import { DashboardContext } from "@/providers/dashboard-provider"
import { NftContext } from "@/providers/nft-provider"

import { useAddOrUpdateNfts } from "@/hooks/use-add-or-update-nfts"
import { toast } from "@/hooks/use-toast"
import { Button, Icons, Input, Label, Spinner } from "@/components/common"
// import DialogAddNfts from "./dialog-add-nfts"
import { Checkbox } from "@/components/common/checkbox"

import DialogSettingsNft from "./dialog-settings-nft"
import NftItem from "./nft-item"

type Props = React.HTMLAttributes<HTMLDivElement> & {}

const UnProtectedNfts = (props: Props) => {
  const [search, setSearch] = useState<string>("")
  const { backupWallet } = useContext(DashboardContext)
  const {
    nftProtection,
    isLoadingAllNfts,
    unprotectedNfts,
    isOpenSettingDialog,
    setIsOpenSettingDialog,
    isOpenAddNftsDialog,
    setIsOpenAddNftsDialog,
    isSettingProtectionLoading,
    setSelectedNfts,
    selectedNfts,
    setIsSettingProtectionLoading,
  } = useContext(NftContext)
  const { handleAddOrUpdateNfts, isLoading: isLoadingAddOrUpdate } =
    useAddOrUpdateNfts({
      backupWallet,
      protectionAddress: nftProtection?.protectionAddress || "",
    })

  useEffect(() => {
    setIsSettingProtectionLoading(!!isLoadingAddOrUpdate)
  }, [isLoadingAddOrUpdate, setIsSettingProtectionLoading])

  const handleProtectClick = useCallback(() => {
    if (!backupWallet) {
      toast({
        title: "Please enter a backup address",
      })
      return
    }

    if (!nftProtection) {
      setIsOpenSettingDialog(true)
      return
    }

    handleAddOrUpdateNfts()
  }, [
    backupWallet,
    handleAddOrUpdateNfts,
    nftProtection,
    setIsOpenSettingDialog,
  ])

  const handleSelectAll = useCallback(
    (value: boolean) => {
      if (value) {
        setSelectedNfts(unprotectedNfts)
      } else {
        setSelectedNfts([])
      }
    },
    [setSelectedNfts, unprotectedNfts]
  )

  if (!unprotectedNfts.length) {
    return (
      <div className="mx-auto flex min-h-[399px] w-full max-w-[280px] flex-1 flex-col items-center justify-center gap-4">
        <Image
          src="/protect-token/no_token_found.svg"
          width={80}
          height={80}
          alt="no token found"
        />
        <p className="text-center text-base font-semibold leading-[22px]">
          No <span className="text-primary-100">NFT</span> found!
        </p>
      </div>
    )
  }

  return (
    <>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your NFTs"
        Icon={<Icons.Search />}
      />
      {isLoadingAllNfts ? (
        <div className="flex h-full min-h-[323px] items-center justify-center">
          <Spinner size={40} />
        </div>
      ) : (
        <div className="my-4 flex h-full min-h-[337px] flex-col gap-1 overflow-auto pr-4">
          <Button
            variant="ghost"
            className="mb-2 flex h-max items-center justify-start gap-3 p-0 pl-1"
          >
            <Checkbox
              id="select"
              onCheckedChange={handleSelectAll}
              checked={selectedNfts.length === unprotectedNfts?.length}
            />
            <Label
              htmlFor="select"
              className=" cursor-pointer text-sm font-semibold text-white md:text-base"
            >
              Select all
            </Label>
          </Button>
          {unprotectedNfts?.map((nft) => (
            <NftItem nft={nft} key={nft.name} isSelectable />
          ))}
        </div>
      )}
      {!!unprotectedNfts.length && (
        <Button
          size="lg"
          className="h-[46px] gap-2 text-base font-semibold"
          disabled={isSettingProtectionLoading || !selectedNfts.length}
          onClick={handleProtectClick}
        >
          {isSettingProtectionLoading ? (
            <Spinner />
          ) : (
            <Icons.Protect fill="white" />
          )}
          {isSettingProtectionLoading ? (
            "Processing..."
          ) : (
            <>
              {selectedNfts.length
                ? `Protect ${selectedNfts.length} NFTs`
                : "Please select an NFT"}
            </>
          )}
        </Button>
      )}
      <DialogSettingsNft
        open={isOpenSettingDialog}
        onOpenChange={() => {
          if (!backupWallet) {
            toast({
              title: "Please enter a backup address",
            })
          } else {
            setIsOpenSettingDialog(!isOpenSettingDialog)
          }
        }}
      />
      {/* <DialogAddNfts
        open={isOpenAddNftsDialog}
        onOpenChange={() => {
          if (!backupWallet) {
            toast({
              title: "Please enter a backup address",
            })
          } else {
            setIsOpenAddNftsDialog(!isOpenAddNftsDialog)
          }
        }}
      /> */}
    </>
  )
}

export default React.memo(UnProtectedNfts)
