"use client"

import PrimaryWallets from "./components/primary-wallets"

const Recovery = () => {
  return (
    <div className="flex min-h-[500px] w-full flex-col gap-6 pb-10 md:mt-10 lg:gap-10 lg:pb-[155px]">
      <div className="flex items-center justify-between gap-2 lg:gap-0">
        <h2 className="text-2xl font-bold leading-10 text-white lg:text-[32px]">
          Recovery
        </h2>
      </div>
      <div className="md:px-24">
        <PrimaryWallets />
      </div>
    </div>
  )
}

export default Recovery
