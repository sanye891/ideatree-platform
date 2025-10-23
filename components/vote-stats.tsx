"use client"

import { TrendingUp, Users, Award, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"

interface VoteStatsProps {
  totalVotes: number
  uniqueVoters: number
  leadingOption: string
  participationRate: number
}

export function VoteStats({ totalVotes, uniqueVoters, leadingOption, participationRate }: VoteStatsProps) {
  const stats = [
    {
      label: "Total Votes",
      value: totalVotes.toLocaleString(),
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Unique Voters",
      value: uniqueVoters.toLocaleString(),
      icon: Users,
      color: "text-accent",
    },
    {
      label: "Leading Option",
      value: leadingOption,
      icon: Award,
      color: "text-chart-2",
    },
    {
      label: "Participation",
      value: `${participationRate}%`,
      icon: TrendingUp,
      color: "text-chart-3",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  )
}
