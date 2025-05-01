import { useEffect, useState } from "react"
import { calculateRemainingTime, cn } from "@/lib/utils"

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  timelapse: string
  from: number
  onCountdownEnd?: () => void
}

const TimeRemaining = ({
  timelapse,
  from,
  onCountdownEnd,
  className,
  ...props
}: Props) => {
  const [timeRemaining, setTimeRemaining] = useState("Checking...")
  useEffect(() => {
    const interval = setInterval(() => {
      let _timeRemaining = calculateRemainingTime({
        lastActiveTimestamp: from,
        timelapse: parseFloat(timelapse),
      })

      if (_timeRemaining === "00:00") {
        _timeRemaining = "Moving assets..."
        clearInterval(interval)
        onCountdownEnd?.()
      }

      setTimeRemaining(_timeRemaining)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, timelapse])

  return <span {...props} className={cn(className, "whitespace-nowrap font-mono")}>{timeRemaining}</span>
}

export default TimeRemaining
