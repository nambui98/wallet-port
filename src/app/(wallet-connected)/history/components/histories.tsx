"use client"

import React, { useContext, useMemo, useState } from "react"
import { ChainContext } from "@/providers/wallet-provider"
import { TNftProtection, TProtection } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

import { usePagination } from "@/hooks/use-pagination"
import {
  Dialog,
  Icons,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/common"

import NftContract from "../../protection/components/history/nft-contract"
import TokenContract from "../../protection/components/history/token-contract"

type Props = React.ComponentPropsWithoutRef<typeof Dialog> & {}

const Histories = ({ children, ...props }: Props) => {
  const [perPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { backendService } = useContext(ChainContext)

  const account = useAccount()
  const { data: protectionContracts } = useQuery({
    queryKey: ["getProtectionHistory", account.address],
    queryFn: () => backendService.getProtectionHistory(account.address!),
    select(data) {
      return data.data
    },
    refetchInterval: 5000,
    enabled: !!account.address,
  })

  const { data: nftProtectionContracts } = useQuery({
    queryKey: ["getNftProtectionHistory", account.address],
    queryFn: () => backendService.getNftProtectionHistory(account.address!),
    select(data) {
      return data.data
    },
    refetchInterval: 5000,
    enabled: !!account.address,
  })

  const allContracts = useMemo(
    () =>
      [...(nftProtectionContracts || []), ...(protectionContracts || [])].sort(
        (a, b) =>
          parseInt(b.statusChangeTimestamp) - parseInt(a.statusChangeTimestamp)
      ),
    [nftProtectionContracts, protectionContracts]
  )

  const startIndex = Math.max(0, (currentPage - 1) * perPage)
  const endIndex = Math.min(startIndex + perPage, allContracts?.length || 0)

  const currentItems = allContracts?.slice(startIndex, endIndex)

  const { paginationRange, DOTS } = usePagination({
    currentPage,
    totalCount: allContracts?.length || 0,
    siblingCount: 1,
    pageSize: perPage,
  })

  const handleChangePagination = (page: number) => setCurrentPage(page)

  return (
    <div>
      <div className="mb-2">
        {protectionContracts?.length === 0 ? (
          <div className="flex h-[382px] flex-col items-center justify-center gap-4">
            <Icons.ClockOutline className="size-20" />
            <p className="max-w-[280px] text-center text-sm ">
              You don’t have any{" "}
              <span className="text-primary-100">Protection History</span>
            </p>
          </div>
        ) : (
          <div className=" flex h-full max-h-[200px] flex-col gap-2 overflow-auto  md:max-h-[300px] 2xl:max-h-[478px] [@media(max-height:500px)]:!max-h-[180px] [@media(max-height:600px)]:max-h-[200px]">
            {currentItems?.map((item, idx) =>
              (item as TProtection).erc20Assets ? (
                <TokenContract
                  key={item.protectionAddress}
                  protectionContract={item as TProtection}
                />
              ) : (
                <NftContract
                  key={item.protectionAddress}
                  protectionContract={item as TNftProtection}
                  className="first:border-t-0"
                />
              )
            )}
          </div>
        )}
      </div>

      <Pagination>
        <PaginationContent>
          {paginationRange?.map((page, idx) => {
            if (page === DOTS) {
              return (
                <PaginationItem key={idx} className="cursor-default">
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            return (
              <PaginationItem
                key={idx}
                onClick={() => handleChangePagination(Number(page))}
                isActive={currentPage === page}
              >
                {page}
              </PaginationItem>
            )
          })}
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Histories
