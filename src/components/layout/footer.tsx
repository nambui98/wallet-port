import React from "react"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  const SOCIAL = [
    {
      title: "telegram",
      src: "/social/telegram.svg",
      href: "https://t.me/WalletPort",
    },
    {
      title: "Twitter",
      src: "/social/twitter.svg",
      href: "http://www.twitter.com/walletport",
    },
    {
      title: "linkedin",
      src: "/social/linkedin.svg",
      href: "https://www.linkedin.com/company/walletport",
    },
  ]
  return (
    <footer className="px-4 py-2">
      <div className="box-container border-dark-80 mx-auto flex h-full flex-col justify-between gap-6 border-t pb-6 pt-4">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:gap-0">
          <Image src="/logo.svg" priority width={240} height={32} alt="logo" />

          <div className="flex items-center gap-6">
            {SOCIAL.map((attr, idx) => (
              <Link key={idx} href={attr.href} target="_blank">
                <Image width={24} height={24} src={attr.src} alt={attr.title} />
              </Link>
            ))}
          </div>
        </div>
        <p className="text-center text-xs font-semibold leading-[18px] text-white">
          Copyright @ WalletPort 2024
        </p>
      </div>
    </footer>
  )
}

export default Footer
