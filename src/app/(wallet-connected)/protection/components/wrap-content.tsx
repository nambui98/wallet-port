import React from "react"

import AvailableTokens from "./available-tokens"
import BackupAddress from "./backup-address"
import DashBoardProvider from "@/providers/dashboard-provider"
import NftProvider from "@/providers/nft-provider"

const WrapContent = () => {
  return (
    <DashBoardProvider>
      <NftProvider>
        <BackupAddress />
        <AvailableTokens />
      </NftProvider>
    </DashBoardProvider>
  )
}

export default WrapContent
