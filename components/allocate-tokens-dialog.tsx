"use client"

import { useState } from "react"
import { Coins, Wallet, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useWeb3 } from "@/lib/web3-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface AllocateTokensDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branchId: string
  branchContent: string
  currentTokens: number
  onAllocate: (tokens: number) => void
}

export function AllocateTokensDialog({
  open,
  onOpenChange,
  branchId,
  branchContent,
  currentTokens,
  onAllocate,
}: AllocateTokensDialogProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { isConnected, balance } = useWeb3()
  const { toast } = useToast()

  const handleMax = () => {
    setAmount(balance)
  }

  const handleAllocate = async () => {
    const tokens = Number.parseFloat(amount)
    
    if (!amount || tokens <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (tokens > Number.parseFloat(balance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough tokens",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    
    // 模拟处理时间
    setTimeout(() => {
      onAllocate(tokens)
      toast({
        title: "Success",
        description: `${tokens} tokens allocated successfully`,
      })
      setIsProcessing(false)
      setAmount("")
      onOpenChange(false)
    }, 1000)
  }

  const quickAmounts = [10, 50, 100, 500]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Allocate Tokens
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Branch Info */}
          <Card className="p-3 bg-muted/50">
            <div className="text-sm text-muted-foreground mb-1">Branch</div>
            <div className="font-medium">{branchContent}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="gap-1">
                <Coins className="h-3 w-3" />
                {currentTokens.toLocaleString()} tokens
              </Badge>
            </div>
          </Card>

          {/* Wallet Balance */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Wallet Balance</span>
              </div>
              <Badge variant="outline" className="gap-1">
                <Coins className="h-3 w-3" />
                {Number.parseFloat(balance).toLocaleString()}
              </Badge>
            </div>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
                min="0"
                step="0.01"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1 h-7"
                onClick={handleMax}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
                className={cn(
                  "gap-1",
                  amount === amt.toString() && "border-primary bg-primary/10"
                )}
              >
                {amt}
              </Button>
            ))}
          </div>

          {/* Preview */}
          {amount && Number.parseFloat(amount) > 0 && (
            <Card className="p-3 bg-primary/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">New Total</span>
                <Badge variant="default" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {(currentTokens + Number.parseFloat(amount)).toLocaleString()}
                </Badge>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAllocate}
              disabled={!amount || Number.parseFloat(amount) <= 0 || isProcessing}
              className="flex-1 gap-2"
            >
              <Coins className="h-4 w-4" />
              {isProcessing ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}