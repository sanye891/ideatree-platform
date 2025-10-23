"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Calendar, Clock, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/lib/web3-context"
import { useRouter } from "next/navigation"

export function CreateDecisionButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roundTime: "24",
    endTime: "7",
    initialTokens: "500",
  })
  const { toast } = useToast()
  const { isConnected, balance } = useWeb3()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a decision",
        variant: "destructive",
      })
      return
    }

    const tokensRequired = Number.parseInt(formData.initialTokens)
    if (Number.parseFloat(balance) < tokensRequired) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${tokensRequired} tokens to create this decision`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Creating decision:", formData)

    const newDecisionId = Math.random().toString(36).substring(7)

    toast({
      title: "Decision Created",
      description: `"${formData.title}" has been created successfully`,
    })

    setOpen(false)
    setIsSubmitting(false)

    // Reset form
    setFormData({
      title: "",
      description: "",
      roundTime: "24",
      endTime: "7",
      initialTokens: "500",
    })

    // Navigate to the new decision
    router.push(`/decision/${newDecisionId}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="absolute right-6 top-6 z-10 gap-2 shadow-lg">
          <Plus className="h-5 w-5" />
          Create Decision
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Decision</DialogTitle>
            <DialogDescription>Set up a new decision tree for collaborative token-based voting</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Decision Title</Label>
              <Input
                id="title"
                placeholder="e.g., Should we implement feature X?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide context and details about this decision..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="roundTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Round Time (hours)
                </Label>
                <Input
                  id="roundTime"
                  type="number"
                  min="1"
                  max="168"
                  placeholder="24"
                  value={formData.roundTime}
                  onChange={(e) => setFormData({ ...formData, roundTime: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Total Duration (days)
                </Label>
                <Input
                  id="endTime"
                  type="number"
                  min="1"
                  max="30"
                  placeholder="7"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="initialTokens" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Initial Token Stake
              </Label>
              <Input
                id="initialTokens"
                type="number"
                min="100"
                max="10000"
                step="100"
                placeholder="500"
                value={formData.initialTokens}
                onChange={(e) => setFormData({ ...formData, initialTokens: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your balance: {isConnected ? `${Number.parseFloat(balance).toFixed(2)} tokens` : "Connect wallet"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isConnected}>
              {isSubmitting ? "Creating..." : "Create Decision"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
