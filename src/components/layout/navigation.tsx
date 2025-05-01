"use client"

import React, { Fragment, useCallback, useContext, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

import { cn } from "@/lib/utils"

import { Button } from "../common/button"
import { Icons } from "../common"
import { useCheckAccount } from "@/hooks/use-check-account"

export const navDropdownItems = [
  { href: "/protection", heading: "Protections" },
  { href: "/recovery", heading: "Recovery" },
]

const Navigation = () => {
  const { data, status } = useSession()
  const { isConnected } = useCheckAccount()

  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-0">
      {isConnected && <Navigation.NavDropdown items={navDropdownItems} />}

      {status !== "unauthenticated" && (
        <>
          <Navigation.NavItem
            href="/profile"
            heading="Profile"
            active={["/profile"].includes(pathname)}
          />
        </>
      )}

      <Navigation.NavItem
        href="https://walletport.io/#howitworks"
        target="_blank"
        heading="How it works"
        active={["/how-it-works"].includes(pathname)}
      />
      <Navigation.NavItem
        href="https://walletport.io/"
        target="_blank"
        heading="Early Access"
        active={["/early-access"].includes(pathname)}
      />
      <Navigation.NavItem
        href="https://walletport.gitbook.io/walletport/"
        target="_blank"
        heading="Wiki"
        active={["/wiki"].includes(pathname)}
      />
    </nav>
  )
}

export default Navigation

type NavProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  heading: string
  active?: boolean
}

Navigation.NavItem = function NavItem({
  className,
  href,
  heading,
  active,
  ...props
}: NavProps) {
  return (
    <Link href={href as string} className={cn("w-full", className)} {...props}>
      <Button
        variant="ghost"
        className={cn(
          "h-[38px] rounded-none px-4 py-2 text-base font-semibold leading-[22px] text-white",
          active && "text-primary-100"
        )}
      >
        {heading}
      </Button>
    </Link>
  )
}

type NavDropdownProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  items: Array<{ href: string; heading: string }>
}


Navigation.NavDropdown = function NavDropdown({
  className,
  href,
  items,
  ...props
}: NavDropdownProps) {
  const pathname = usePathname()

  const selectedItem = useMemo(() => navDropdownItems.find(item => item.href === pathname), [pathname])

  return (
    <Menu as="a" {...props}>
      <MenuButton as={Fragment}>
        <Button
          variant="ghost"
          className={cn(
            "h-[38px] rounded-none px-4 py-2 text-base font-semibold leading-[22px] text-white",
            !!selectedItem && "text-primary-100"
          )}
        >
          {selectedItem?.heading}
          <Icons.ChevronDown className="text-primary-100 size-5" />
        </Button>
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className="bg-primary-100 border-primary-100 w-[171px] items-start gap-2 rounded-xl border-2 p-2"
      >
        {items.map((item) => (
          <MenuItem key={item.heading}>
            <Link
              className={cn([
                "block w-full rounded-xl p-4 text-base font-semibold text-white",
                pathname === item.href && "text-primary-100 bg-white",
              ])}
              href={item.href}
            >
              {item.heading}
            </Link>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
