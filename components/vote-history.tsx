"use client"

import { Clock, ThumbsUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VoteHistoryItem {
  id: string
  voter: string
  option: string
  timestamp: Date
  weight: number
}

interface VoteHistoryProps {
  votes: VoteHistoryItem[]
}

export function VoteHistory({ votes }: VoteHistoryProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Recent Votes</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {votes.map((vote) => (
            <div key={vote.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <ThumbsUp className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">{formatAddress(vote.voter)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {vote.weight} votes
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{vote.option}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(vote.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
