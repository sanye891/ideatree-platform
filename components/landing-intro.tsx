"use client"

import { Sparkles, TrendingUp, Users, Coins } from "lucide-react"
import { Card } from "@/components/ui/card"

export function LandingIntro() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Decentralized Decision Making</span>
        </div>

        <h1 className="mb-4 text-balance text-5xl font-bold tracking-tight">
          Welcome to <span className="text-primary">IdeaTree</span>
        </h1>

        <p className="mb-8 text-pretty text-xl text-muted-foreground">
          A blockchain-powered platform for collaborative decision-making. Create decision trees, vote with tokens, and
          watch ideas evolve through community consensus.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Decision Trees</h3>
            <p className="text-sm text-muted-foreground">
              Visualize complex decisions as interactive trees with multiple branches and outcomes
            </p>
          </Card>

          <Card className="border-accent/20 bg-card/50 p-6 backdrop-blur">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Coins className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 font-semibold">Token Voting</h3>
            <p className="text-sm text-muted-foreground">
              Use tokens to vote on branches. Winners earn rewards after each round
            </p>
          </Card>

          <Card className="border-secondary/20 bg-card/50 p-6 backdrop-blur">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
              <Users className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">Community Driven</h3>
            <p className="text-sm text-muted-foreground">
              Collaborate with others to create branches and shape the direction of decisions
            </p>
          </Card>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Select a decision from the tabs above or create a new one to get started
        </p>
      </div>
    </div>
  )
}
