"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"

import { Avatar, AvatarImage } from "../common/avatar"
import { Button } from "../common/button"
import { Icons } from "../common/icons"
import ConnectWallet from "../rainbowkit/connect-wallet"
import Navigation from "./navigation"

const AUTHENTICATION_ROUTES = ["/login", "/register"]
const Header = () => {
  const { status } = useSession()

  return (
    <header className="bg-dark-100/20 relative flex min-h-[56px] items-center px-4 py-2 lg:min-h-[78px] lg:bg-transparent lg:px-0 lg:py-4">
      {/* background on mobile */}
      <div className="bg-primary-100 absolute left-[-64px] top-[-100px] z-0 block h-[170px] w-[280px] rounded-full opacity-20 blur-xl lg:hidden" />
      <div className="bg-primary-100 absolute right-[-64px] top-[-140px] z-0 block h-[170px] w-[180px] rounded-full opacity-20 blur-xl lg:hidden" />

      <div className="box-container mx-auto flex w-full items-center justify-between">
        <Link href="/">
          <Image
            src="logo.svg"
            width={240}
            height={32}
            priority
            alt="logo"
            className="h-[20px] w-[150px] lg:h-[32px] lg:w-[240px]"
          />
        </Link>
        <div className="hidden lg:block">
          <Navigation />
        </div>
        <div>
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}

export default Header
