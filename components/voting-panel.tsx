"use client"

import { useState } from "react"
import { ThumbsUp, TrendingUp, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface VoteOption {
  id: string
  content: string
  votes: number
  percentage: number
}

interface VotingPanelProps {
  options: VoteOption[]
  totalVotes: number
  userVote?: string
  onVote?: (optionId: string) => void
}

export function VotingPanel({ options, totalVotes, userVote, onVote }: VotingPanelProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userVote)

  const handleVote = (optionId: string) => {
    setSelectedOption(optionId)
    onVote?.(optionId)
  }

  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes)

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Current Votes</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{totalVotes} votes</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sortedOptions.map((option, index) => (
          <div
            key={option.id}
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50"
          >
            {/* Background Progress */}
            <div className="absolute inset-0 bg-primary/5 transition-all" style={{ width: `${option.percentage}%` }} />

            {/* Content */}
            <div className="relative flex items-center justify-between">
              <div className="flex flex-1 items-center gap-3">
                {index === 0 && (
                  <Badge variant="default" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Leading
                  </Badge>
                )}
                <span className="font-medium">{option.content}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-semibold">{option.votes} votes</div>
                  <div className="text-xs text-muted-foreground">{option.percentage}%</div>
                </div>

                <Button
                  size="sm"
                  variant={selectedOption === option.id ? "default" : "outline"}
                  onClick={() => handleVote(option.id)}
                  className="gap-1"
                >
                  <ThumbsUp className="h-3 w-3" />
                  {selectedOption === option.id ? "Voted" : "Vote"}
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={option.percentage} className="mt-3 h-1" />
          </div>
        ))}
      </div>
    </Card>
  )
}
