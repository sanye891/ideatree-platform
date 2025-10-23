"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/wallet-connect"
import { cn } from "@/lib/utils"

type TabType = "ongoing" | "completed" | "upcoming"

interface HeaderProps {
  onTabChange?: (tab: TabType) => void
}

export function Header({ onTabChange }: HeaderProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>("ongoing")

  const tabs: { id: TabType; label: string }[] = [
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "upcoming", label: "Upcoming" },
  ]

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Logo and Tabs */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">IdeaTree</span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "font-medium transition-colors",
                  activeTab === tab.id && "bg-primary text-primary-foreground",
                )}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Right: Search and Wallet */}
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search decisions..." className="pl-9" />
          </div>

          <WalletConnect />
        </div>
      </div>
    </header>
  )
}
