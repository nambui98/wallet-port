import React from "react"

import ConnectWallet from "@/components/rainbowkit/connect-wallet"

const SignIn = () => {
  return (
    <section
      className="h-full bg-[length:357px_315px] bg-left bg-no-repeat lg:bg-[length:734px_632px] lg:bg-right lg:pt-3"
      style={{
        backgroundImage: `url("/background/bg_home.svg")`,
      }}
    >
      <div className="flex lg:pt-[120px]">
        <div className="lg:max-w-[734px]">
          <h1 className="text-[32px] font-[900] uppercase leading-[44px] text-white lg:text-[56px] lg:leading-[76px]">
            PROTECT YOUR <span className="text-primary-100">CRYPTO</span> SECURE
            YOUR <span className="text-primary-100">FUTURE</span>
          </h1>

          <p className="mt-2 block text-xs font-medium leading-[18px] text-white lg:mt-6 lg:text-base lg:leading-[22px]">
            Connect your self-custody wallet to WalletPort, choose your dormancy
            period, and define the backup address. If there is no activity
            in your self-custody wallet for the duration of the dormancy period,
            the smart contracts will autonomously transfer your assets to the
            defined backup wallet.
          </p>

          <div className="mt-10 flex w-full flex-col items-stretch gap-4 lg:mt-20 lg:flex-row lg:items-center">
            <ConnectWallet className="block w-full lg:h-16 lg:w-max lg:rounded-[32px] lg:px-10 lg:py-4 lg:text-2xl lg:font-semibold" />

            {/* <Link href="/login">
              <Button
                variant="destructive"
                className="block w-full lg:h-16 lg:w-max lg:rounded-[32px] lg:px-10 lg:py-4 lg:text-2xl lg:font-semibold"
              >
                Sign in
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignIn
