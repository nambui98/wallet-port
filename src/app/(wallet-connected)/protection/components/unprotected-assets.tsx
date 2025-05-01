import React, { useState } from "react"

import { cn } from "@/lib/utils"
import UnprotectedTokens from "./unprotected-tokens"
import { Button } from "@/components/common"
import UnprotectedNfts from "./nft/unprotected-nfts"

enum AssetButtons {
  TOKENS = "Tokens",
  NFTS = "NFTs",
}

type Props = React.HTMLAttributes<HTMLDivElement> & {}

const UnProtectedAssets = ({ className, ...props }: Props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenType: AssetButtons = urlParams.get('t') === AssetButtons.NFTS ? AssetButtons.NFTS : AssetButtons.TOKENS;
  const [filter, setFilter] = useState<AssetButtons>(tokenType);

  const setTokenType = (type: string) => {
    window.history.pushState({}, '', `?t=${type}`);
    setFilter(type as AssetButtons);
  }

  return (
    <div
      className={cn(
        "relative flex size-full max-h-[600px] flex-col rounded-3xl border-2 border-white/[0.12] bg-white/[0.08] p-4",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex gap-2">
        {Object.values(AssetButtons).map((label) => (
          <Button
            key={label}
            variant="outline"
            className={cn(
              "h-[38px] rounded-2xl border border-transparent bg-white/[0.08] text-base font-semibold",
              filter === label ? "border-primary-100 bg-primary-100/20" : ""
            )}
            onClick={() => setTokenType(label)}
          >
            {label}
          </Button>
        ))}
      </div>
      {filter === AssetButtons.TOKENS ? <UnprotectedTokens /> : <UnprotectedNfts />}
    </div>
  )
}

export default React.memo(UnProtectedAssets)
