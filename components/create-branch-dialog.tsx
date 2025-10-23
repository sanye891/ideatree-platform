"use client"

import type React from "react"

import { useState } from "react"
import { GitBranch, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/lib/web3-context"

interface CreateBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentNodeId: string
  parentContent: string
}

export function CreateBranchDialog({ open, onOpenChange, parentNodeId, parentContent }: CreateBranchDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    content: "",
    description: "",
    initialTokens: "100",
  })
  const { toast } = useToast()
  const { balance } = useWeb3()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const tokensRequired = Number.parseInt(formData.initialTokens)
    if (Number.parseFloat(balance) < tokensRequired) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${tokensRequired} tokens to create this branch`,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Creating branch:", {
      parentNodeId,
      ...formData,
    })

    toast({
      title: "Branch Created",
      description: `New branch "${formData.content}" has been created with ${formData.initialTokens} tokens`,
    })

    onOpenChange(false)
    setIsSubmitting(false)

    // Reset form
    setFormData({
      content: "",
      description: "",
      initialTokens: "100",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Create New Branch
            </DialogTitle>
            <DialogDescription>
              Create a new branch from: <span className="font-medium text-foreground">"{parentContent}"</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content">Branch Content</Label>
              <Input
                id="content"
                placeholder="e.g., Alternative approach using..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Explain your reasoning for this branch..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="initialTokens" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Initial Token Allocation
              </Label>
              <Input
                id="initialTokens"
                type="number"
                min="10"
                max="1000"
                step="10"
                placeholder="100"
                value={formData.initialTokens}
                onChange={(e) => setFormData({ ...formData, initialTokens: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your balance: {Number.parseFloat(balance).toFixed(2)} tokens
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
