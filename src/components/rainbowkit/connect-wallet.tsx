/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable tailwindcss/classnames-order */
"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useDisconnect, useSwitchChain } from "wagmi"

import { cn } from "@/lib/utils"

import { Button, ButtonProps } from "../common/button"

type Props = ButtonProps

const ConnectWallet = ({ className, ...props }: Props) => {
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [refResize, setRefResize] = useState({ width: 0 })

  const triggerRef = useRef<React.ElementRef<"div">>(null)
  const triggerButtonRef = useRef<React.ElementRef<"button">>(null)
  const { switchChain } = useSwitchChain()

  const { disconnect, connectors } = useDisconnect()

  const handleMouseEnter = () => setOpenPopover(true)
  const handleMouseLeave = () => setOpenPopover(false)

  const formatUnits = (value: string) => parseFloat(Number(value)?.toFixed(6))

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry?.contentRect
        setRefResize({ width })
      }
    })

    if (triggerRef?.current) {
      observer?.observe(triggerRef?.current)
    }

    return () => {
      if (triggerRef?.current) {
        observer?.unobserve(triggerRef?.current)
      }
    }
  }, [triggerRef?.current, connectors])

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated")

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    className={cn(
                      "hidden text-base text-gray-100 lg:block",
                      className
                    )}
                    {...props}
                  >
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Switch network
                  </Button>
                )
              }

              return (
                <div
                  className="relative w-fit"
                  style={{
                    // minWidth: "230px",
                    height: triggerButtonRef?.current?.offsetHeight,
                  }}
                >
                  <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      ref={triggerRef}
                      className={cn(
                        " overflow-hidden rounded-3xl border-2 border-white/[12%] outline-none ring-0 ring-transparent",
                        openPopover && " z-[999]"
                      )}
                    >
                      <Button
                        ref={triggerButtonRef}
                        type="button"
                        className={cn(
                          "h-full flex-col rounded-none bg-white/[8%] p-1 ring-0 ring-transparent hover:scale-[inherit] hover:bg-white/[8%] active:scale-[inherit] hover:shadow-none"
                        )}
                      >
                        <div className="flex h-full items-center flex-row gap-2">
                          <div className="bg-primary-linear flex h-full items-center rounded-3xl px-3 py-1">
                            {chain?.hasIcon && (
                              <div
                                className="relative mr-1 size-8 overflow-hidden rounded-full"
                                style={{
                                  background: chain.iconBackground,
                                }}
                              >
                                {chain?.iconUrl && (
                                  <div
                                    onClick={openChainModal}
                                    className=" border-2 border-transparent hover:border-gray-500/80 rounded-full"
                                  >
                                    <Image
                                      width={32}
                                      height={32}
                                      alt={chain.name ?? "Chain icon"}
                                      src={chain.iconUrl}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            <div
                              className="item-center flex"
                              onClick={openAccountModal}
                            >
                              {account?.address && (
                                <p className="text-left text-base font-semibold text-white">
                                  {account?.displayName}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="hidden md:flex h-full items-center gap-2 p-1 pr-3">
                            <span className="text-base font-semibold leading-[22px] text-white">
                              {account?.balanceFormatted
                                ? `${formatUnits(account?.balanceFormatted!)} ${account?.balanceSymbol}`
                                : "0.00 ETH"}
                            </span>
                          </div>
                        </div>
                      </Button>
                      <div
                        className={cn(
                          "rounded-3xl bg-white/[8%] px-0 transition-all duration-500",
                          "rounded-t-none border-none",
                          openPopover
                            ? "visible h-auto pb-0"
                            : "invisible h-0 p-0"
                        )}
                        style={{
                          minWidth: triggerButtonRef?.current?.offsetWidth,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default ConnectWallet
