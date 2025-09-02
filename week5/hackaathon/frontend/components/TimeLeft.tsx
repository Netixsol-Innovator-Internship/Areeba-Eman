"use client"
import { useEffect, useState } from "react"

interface TimeLeftProps {
  createdAt: string
  durationDays?: number // optional, default to 4 days
}

export default function TimeLeft({ createdAt, durationDays = 4 }: TimeLeftProps) {
  const [timeLeft, setTimeLeft] = useState("")

  const calculateTimeLeft = () => {
    const endTime = new Date(createdAt).getTime() + durationDays * 24 * 60 * 60 * 1000
    const now = Date.now()
    const diff = endTime - now
    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [createdAt, durationDays])

  return <span>{timeLeft}</span>
}
