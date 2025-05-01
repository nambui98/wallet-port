import { formatDistanceToNow } from "date-fns"
import { formatUnits as viemFormatUnits } from "viem"

const formatUnits = (value: bigint, decimals: number): string => {
  const formattedValue = parseFloat(viemFormatUnits(value, decimals ?? 0))
  const formattedString = formattedValue.toFixed(4).replace(/\.?0*$/, "") // Remove trailing zeros
  return formattedString
}

const formatTimeAgo = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    .replace("about ", "")
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
}
export { formatTimeAgo, formatUnits }
