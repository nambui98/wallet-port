/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

import { Button } from "../common/button"
import { Icons } from "../common/icons"

const NavBottomBar = () => {
  const pathname = usePathname()

  return createPortal(
    <nav className="bg-dark-100 fixed inset-x-0 bottom-0 z-[100] block lg:hidden">
      <div className="bg-primary-light/20 relative grid grid-cols-3 p-4 ">
        <div className={cn("absolute inset-x-4 -bottom-[13px] h-[26px]")}>
          <div
            className={cn(
              "bg-primary-100/50  absolute left-0 flex  h-[26px] w-1/4  rounded-full blur-md",
              `transition-all duration-300`,
              {
                "left-0": pathname === "/history",
                "left-1/3": pathname === "/" || pathname === "/protection",
                "left-2/3": pathname === "/recovery",
              }
            )}
          ></div>
        </div>
        <Link href="/history">
          <NavBottomBar.Item
            Icon={
              <Icons.History
                className={cn("size-6 fill-white", {
                  "fill-primary-100": ["/history"].includes(pathname),
                })}
              />
            }
          />
        </Link>

        <Link href="/">
          <NavBottomBar.Item
            Icon={
              <Icons.Protect2
                className={cn("flex items-center justify-center fill-white ", {
                  "fill-primary-100": ["/", "/protection"].includes(pathname),
                })}
              />
            }
          />
        </Link>

        <Link href="/recovery">
          <NavBottomBar.Item
            Icon={
              <Icons.Recovery
                className={cn("size-6 fill-white", {
                  "fill-primary-100": ["/recovery"].includes(pathname),
                })}
              />
            }
          />
        </Link>
      </div>
    </nav>,
    document?.body
  )
}

export default NavBottomBar

type PropsItem = React.HTMLAttributes<HTMLDivElement> & {
  Icon: React.ReactNode
}
NavBottomBar.Item = function Item({ className, Icon }: PropsItem) {
  return (
    <Button
      className={cn(
        "relative mx-auto flex h-max items-center justify-center gap-2 bg-transparent p-0 shadow-none hover:bg-transparent",
        className
      )}
    >
      {Icon}
    </Button>
  )
}
