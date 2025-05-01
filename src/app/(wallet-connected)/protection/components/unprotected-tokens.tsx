import React, { useContext, useMemo, useState } from "react"
import Image from "next/image"
import { DashboardContext } from "@/providers/dashboard-provider"
import { CheckedState } from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button, Icons, Input, Label, Spinner } from "@/components/common"
import { Checkbox } from "@/components/common/checkbox"

import DialogSettings from "./dialog-settings"
import UnProtectItem from "./unprotect-item"

type Props = React.HTMLAttributes<HTMLDivElement> & {}

const UnProtectedTokens = (props: Props) => {
  const {
    unprotectedTokens,
    isLoadingAllMyTokens,
    isLoadingAllProtectedMyTokens,
    unprotectedTokenSelected,
    isOpenDialogSetting,
    backupWallet,
    onOpenChangeDialogSetting,
  } = useContext(DashboardContext)
  const [isSelectMultiMode, setIsSelectMultiMode] =
    useState<CheckedState>(false)
  const [search, setSearch] = useState<string>("")
  const filteredTokens = useMemo(
    () => [
      ...unprotectedTokens.filter((token) =>
        !search
          ? true
          : token?.name?.toUpperCase().includes(search?.toUpperCase()) ||
            token?.symbol?.toUpperCase().includes(search?.toUpperCase())
      ),
    ],
    [unprotectedTokens, search]
  )

  return (
    <>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your token"
        Icon={<Icons.Search />}
      />
      <div className="mt-4 flex size-full max-h-[500px] flex-col">
        {/* heading */}
        <div className="border-dark-20 grid  w-full grid-cols-[minmax(144px,_1fr)_minmax(80px,_1fr)_1fr] items-center justify-between   border-b pb-4  hover:bg-white/10 md:px-3 ">
          <p className="text-base font-semibold leading-[22px] text-white">
            Token
          </p>
          <p className="text-base font-semibold leading-[22px] text-white">
            Total
          </p>
          <Button
            variant="ghost"
            className="flex h-max items-center justify-start gap-1 p-0"
          >
            <Checkbox
              id="select"
              onCheckedChange={(value) => setIsSelectMultiMode(value)}
            />
            <Label
              htmlFor="select"
              className=" cursor-pointer text-sm font-semibold text-white"
            >
              Multiple
            </Label>
          </Button>
        </div>

        {/* table */}
        {isLoadingAllMyTokens || isLoadingAllProtectedMyTokens ? (
          <div className="flex h-full min-h-[323px] items-center justify-center">
            <Spinner size={40} />
          </div>
        ) : !filteredTokens || filteredTokens?.length === 0 ? (
          <div className="mx-auto flex min-h-[399px] w-full max-w-[280px] flex-1 flex-col items-center justify-center gap-4">
            <Image
              src="/protect-token/no_token_found.svg"
              width={80}
              height={80}
              alt="no token found"
            />
            <p className="text-center text-base font-semibold leading-[22px]">
              No <span className="text-primary-100">Token</span> found!
            </p>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "-mr-4 mt-4 flex h-full  max-h-[337px]  min-h-[337px] flex-col gap-1 overflow-auto overflow-x-hidden pr-4",
                {
                  /* not checked : max-h-[399px], checked: max-h-[337px] */
                }
              )}
            >
              {(filteredTokens || [])?.map((token, idx) => (
                <UnProtectItem
                  key={idx}
                  token={token}
                  isSelectMultiMode={isSelectMultiMode}
                />
              ))}
            </div>
            {/* submit */}
            {isSelectMultiMode && (
              <div className="pt-4">
                {unprotectedTokenSelected.length > 0 && (
                  <Button
                    onClick={() => {
                      if (!backupWallet) {
                        toast({
                          title: "Please enter a backup address",
                        })
                      } else {
                        onOpenChangeDialogSetting?.()
                      }
                    }}
                    className="[&>svg]:disabled:fill-dark-80 w-full gap-2"
                  >
                    <Icons.Security className="size-5" />
                    Protect {`${unprotectedTokenSelected.length}`} tokens
                  </Button>
                )}
              </div>
            )}
          </>
        )}
        <DialogSettings
          open={isOpenDialogSetting}
          onOpenChange={() => {
            if (!backupWallet) {
              toast({
                title: "Please enter a backup address",
              })
            } else {
              onOpenChangeDialogSetting?.()
            }
          }}
          tokens={unprotectedTokens.filter((token) =>
            unprotectedTokenSelected.includes(token.token_address)
          )}
        />
      </div>
    </>
  )
}

export default React.memo(UnProtectedTokens)
