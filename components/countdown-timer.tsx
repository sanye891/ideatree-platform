"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  label: string
  endTime: Date
  variant?: "primary" | "secondary"
}

export function CountdownTimer({ label, endTime, variant = "primary" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance < 0) {
        setTimeLeft("Ended")
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <Card
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        variant === "primary" && "border-primary/50 bg-primary/5",
        variant === "secondary" && "border-accent/50 bg-accent/5",
      )}
    >
      <Clock
        className={cn("h-4 w-4", variant === "primary" && "text-primary", variant === "secondary" && "text-accent")}
      />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{timeLeft}</span>
      </div>
    </Card>
  )
}
