"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, Trophy, Zap, Timer, Crown, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  createDecision,
  processRoundEnd,
  calculateRewards,
  type DecisionTree,
  type Branch,
} from "@/lib/auto-decision"

interface AutoDecisionDemoProps {
  mainContent: string
  onComplete?: (decision: DecisionTree) => void
}

export function AutoDecisionDemo({ mainContent, onComplete }: AutoDecisionDemoProps) {
  const [decision, setDecision] = useState<DecisionTree | null>(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isAnimating, setIsAnimating] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  // 初始化决策
  useEffect(() => {
    const newDecision = createDecision(mainContent)
    setDecision(newDecision)
  }, [mainContent])

  // 倒计时和自动进入下一轮
  useEffect(() => {
    if (!decision || decision.status === "completed") {
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 轮次结束，处理投票和选出胜者
          setIsAnimating(true)

          setTimeout(() => {
            setDecision((current) => {
              if (!current) return null
              const updated = processRoundEnd(current)

              if (updated.status === "completed" && onComplete) {
                onComplete(updated)
              }

              return updated
            })
            setIsAnimating(false)
            setTimeLeft(10)
          }, 2000) // 2秒动画时间

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [decision, onComplete])

  if (!decision) {
    return <div>Loading...</div>
  }

  const progress = ((decision.currentRound - 1) / decision.totalRounds) * 100
  const rewards = decision.status === "completed" ? calculateRewards(decision) : new Map()

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Card className="flex items-center gap-3 px-4 py-3 bg-primary/5 border-primary/20">
            <Timer className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">轮次倒计时</div>
              <div className="text-2xl font-bold text-primary">{timeLeft}s</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3 px-4 py-3">
            <Zap className="h-5 w-5 text-accent" />
            <div>
              <div className="text-xs text-muted-foreground">当前轮次</div>
              <div className="text-xl font-bold">
                {decision.currentRound} / {decision.totalRounds}
              </div>
            </div>
          </Card>

          <Card className="flex items-center gap-3 px-4 py-3 bg-accent/5 border-accent/20">
            <Coins className="h-5 w-5 text-accent" />
            <div>
              <div className="text-xs text-muted-foreground">代币总量</div>
              <div className="text-xl font-bold text-accent">{decision.totalTokens.toLocaleString()}</div>
            </div>
          </Card>
        </div>

        {decision.status === "completed" && (
          <Badge variant="outline" className="gap-2 px-4 py-2 text-lg bg-accent/10 border-accent">
            <Trophy className="h-5 w-5" />
            决策已完成
          </Badge>
        )}
      </div>

      {/* 进度条 */}
      <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 主决策内容 */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">主决策</h2>
        </div>
        <p className="text-lg text-muted-foreground">{decision.mainContent}</p>
      </Card>

      {/* 当前轮次的分支 */}
      {decision.status !== "completed" && (
        <div className="flex-1 overflow-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              第 {decision.currentRound} 轮分支 ({decision.branches.length} 个选项)
            </h3>
            {isAnimating && (
              <Badge variant="outline" className="gap-2 animate-pulse">
                <Zap className="h-4 w-4" />
                代币竞争中...
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decision.branches.map((branch, index) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                index={index}
                isAnimating={isAnimating}
                reward={rewards.get(branch.id)}
                showTokenChanges={decision.status === "completed" || decision.currentRound > 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* 历史轮次 */}
      {decision.history.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-semibold">历史轮次</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {decision.history.map((round) => (
              <Card key={round.round} className="min-w-[200px] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="secondary">第 {round.round} 轮</Badge>
                  <Trophy className="h-4 w-4 text-accent" />
                </div>
                <p className="text-sm font-medium line-clamp-2">{round.winner.content}</p>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Coins className="h-3 w-3" />
                    {round.winner.tokens} (最终)
                  </div>
                  {round.tokenChanges?.map((change, idx) => {
                    const branch = round.branches.find(b => b.id === change.branchId)
                    return (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {change.type === "gained" ? (
                          <Badge variant="default" className="gap-1 bg-accent">
                            <TrendingUp className="h-3 w-3" />
                            {branch?.content}: +{change.amount}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <TrendingDown className="h-3 w-3" />
                            {branch?.content}: -{change.amount}
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 最终奖励 */}
      {decision.status === "completed" && (
        <Card className="p-6 bg-gradient-to-r from-accent/20 to-primary/20 border-accent">
          <div className="mb-4 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-accent" />
            <h3 className="text-xl font-bold">最终代币余额</h3>
          </div>
          <div className="grid gap-2">
            {decision.history[decision.history.length - 1]?.branches.map((branch) => {
              return (
                <div key={branch.id} className="flex items-center justify-between rounded-lg bg-card p-3">
                  <span className="font-medium">{branch.content}</span>
                  <Badge variant="default" className="gap-1">
                    <Coins className="h-3 w-3" />
                    {branch.tokens.toLocaleString()}
                  </Badge>
                </div>
              )
            })}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">总奖励分配</h2>
            {decision.status === "completed" && rewards.size > 0 ? (
              <div className="space-y-2">
                {(() => {
                  let maxReward = 0;
                  let topBranchId: string | null = null;

                  Array.from(rewards.entries()).forEach(([branchId, reward]) => {
                    if (reward > maxReward) {
                      maxReward = reward;
                      topBranchId = branchId;
                    }
                  });

                  console.log("Rewards Map:", rewards);
                  console.log("Max Reward:", maxReward);
                  console.log("Top Branch ID:", topBranchId);

                  return Array.from(rewards.entries()).map(([branchId, reward]) => {
                    const branch =
                      decision.branches.find((b) => b.id === branchId) ||
                      decision.history
                        .flatMap((h) => h.branches)
                        .find((b) => b.id === branchId);
                    const isTopBranch = branchId === topBranchId;
                    return (
                      <div
                        key={branchId}
                        className={cn(
                          "flex justify-between items-center bg-gray-100 p-3 rounded-md",
                          isTopBranch && "border-2 border-green-500 ring-2 ring-green-300"
                        )}
                      >
                        <span className="font-medium">
                          {branch?.content || `未知分支 (${branchId})`}
                        </span>
                        <span className="text-green-600 font-bold">
                          +{reward} 代币
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <p className="text-gray-500">决策完成后显示总奖励分配。</p>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

interface BranchCardProps {
  branch: Branch
  index: number
  isAnimating: boolean
  reward?: number
  showTokenChanges?: boolean
}

function BranchCard({ branch, index, isAnimating, reward, showTokenChanges }: BranchCardProps) {
  const lostTokens = showTokenChanges && branch.tokenChanges?.find(tc => tc.type === "lost")?.amount
  const gainedTokens = showTokenChanges && branch.tokenChanges?.find(tc => tc.type === "gained")?.amount

  return (
    <Card
      className={cn(
        "relative p-5 transition-all duration-500",
        branch.isWinner && "border-green-500 ring-2 ring-green-300 scale-105",
        branch.isEliminated && "opacity-50 grayscale",
        isAnimating && "animate-pulse"
      )}
    >
      {branch.isWinner && (
        <div className="absolute -right-2 -top-2">
          <Badge variant="default" className="gap-1 bg-green-500">
            <Crown className="h-3 w-3" />
            胜出
          </Badge>
        </div>
      )}

      <div className="mb-3">
        <Badge variant="secondary" className="mb-2">
          分支 {index + 1}
        </Badge>
        <p className="font-medium leading-relaxed">{branch.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Coins className="h-3 w-3" />
            {branch.tokens}
          </Badge>
          {lostTokens && (
            <Badge variant="destructive" className="gap-1">
              <TrendingDown className="h-3 w-3" />
              -{lostTokens}
            </Badge>
          )}
          {gainedTokens && (
            <Badge variant="default" className="gap-1 bg-green-500">
              <TrendingUp className="h-3 w-3" />
              +{gainedTokens}
            </Badge>
          )}
        </div>

        {reward && (
          <Badge variant="default" className="gap-1 bg-accent">
            <Trophy className="h-3 w-3" />
            +{reward}
          </Badge>
        )}
      </div>

      {branch.isWinner && (
        <div className="mt-3 text-xs text-green-500">🎉 本轮代币最多，晋级下一轮</div>
      )}
    </Card>
  )
}

// 轮次结束，处理代币竞争和选出胜者
        if (timeRemaining <= 0) {
          setIsProcessing(true)
          setStatus("代币竞争中...")
          
          // 延迟2秒显示结果
          setTimeout(() => {
            const updatedDecision = processRoundEnd(decision)
            setDecision(updatedDecision)
            setIsProcessing(false)
            
            if (updatedDecision.status === "completed") {
              setStatus("决策完成")
              setShowRewards(true)
            } else {
              setStatus(`第${updatedDecision.currentRound}轮进行中`)
              setTimeRemaining(updatedDecision.roundDuration / 1000)
            }
          }, 2000)
        }

// 模拟投票：随机为分支分配票数
export function simulateVoting(branches: Branch[]): Branch[] {
  return branches.map(branch => {
    // 基于当前代币数生成合理的投票数（仅用于显示，不影响结果）
    const baseVotes = Math.floor(branch.tokens / 10)
    const randomVotes = Math.floor(Math.random() * baseVotes * 2)

    return {
      ...branch,
      votes: baseVotes + randomVotes,
    }
  })
}
