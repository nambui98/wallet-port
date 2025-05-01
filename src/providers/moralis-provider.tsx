"use client"

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import Moralis from "moralis"

interface MoralisContextType {
  moralis: typeof Moralis | undefined
}

const MoralisContext = createContext<MoralisContextType>({
  moralis: undefined,
})

export const useMoralis = () => useContext(MoralisContext)

export const MoralisProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [moralis, setMoralis] = useState<typeof Moralis | undefined>();



  return (
    <MoralisContext.Provider value={{ moralis: moralis }}>
      {children}
    </MoralisContext.Provider>
  )
}
