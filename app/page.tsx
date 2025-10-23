"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DecisionList } from "@/components/decision-list"
import { LandingIntro } from "@/components/landing-intro"
import { CreateDecisionButton } from "@/components/create-decision-button"
import { Toaster } from "@/components/ui/toaster"
import type { DecisionStatus } from "@/lib/mock-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<DecisionStatus>("ongoing")

  return (
    <div className="flex h-screen flex-col">
      <Header onTabChange={setActiveTab} />
      <main className="relative flex-1 overflow-hidden">
        <LandingIntro />
        <DecisionList activeTab={activeTab} />
        <CreateDecisionButton />
      </main>
      <Toaster />
    </div>
  )
}
