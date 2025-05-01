import { clsx, type ClassValue } from "clsx"
import { formatUnits as formatUnitsViem } from "viem"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateRemainingTime({
  lastActiveTimestamp,
  timelapse,
}: {
  lastActiveTimestamp: number
  timelapse: number
}): string {
  const now = Math.floor(Date.now() / 1000)

  const elapsedTime = now - lastActiveTimestamp
  let remainingTime = timelapse - elapsedTime
  remainingTime = remainingTime < 0 ? 0 : remainingTime
  return formatRemainingTime(remainingTime)
}

export function formatRemainingTime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600))
  seconds %= 24 * 3600
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60

  // Format each component to be two digits
  const daysStr = String(days)
  const hoursStr = String(hours).padStart(2, "0")
  const minutesStr = String(minutes).padStart(2, "0")
  const secondsStr = String(seconds).padStart(2, "0")
  if (days > 0) {
    return `${daysStr}d ${hoursStr}:${minutesStr}:${secondsStr}`
  }
  if (hours > 0) {
    return `${hoursStr}:${minutesStr}:${secondsStr}`
  }
  return `${minutesStr}:${secondsStr}`
}

export function formatUnits(value: bigint, decimals?: number, symbol?: string, fixed: number = 6,): string {
  return parseFloat(
    Number(formatUnitsViem(value, decimals ?? 0))?.toFixed(
      fixed
    )
  ) +
    " " +
    symbol
}

export function shortenAddress(address: string) {
  return address.slice(0, 4) + "..." + address.slice(-4)
}
