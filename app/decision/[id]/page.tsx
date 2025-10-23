"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DecisionCanvas } from "@/components/decision-canvas"

export default function DecisionPage() {
  const [currentRound, setCurrentRound] = useState(1)
  const [roundTimeLeft, setRoundTimeLeft] = useState(10)
  const totalRounds = 6
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  // 计算总剩余时间（基于当前轮次）
  // 总剩余时间 = 后续完整轮次秒数 + 当前轮剩余秒数，首轮从 60s 开始
  const totalTimeLeft = (totalRounds - currentRound) * 10 + roundTimeLeft

  // ------------------------------
  // 定时与轮次逻辑
  // ------------------------------

  // 倒计时定时器，只在未完成时启动
  useEffect(() => {
    if (isCompleted) return

    const timer = setInterval(() => {
      setRoundTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isCompleted])

  // 监听倒计时结束，处理轮次切换和完成状态
  useEffect(() => {
    if (isCompleted) return

    if (roundTimeLeft <= 0) {
      if (currentRound >= totalRounds) {
        if (!isCompleted) {
          setIsCompleted(true)
          setShowCompletion(true)
        }
      } else {
        setCurrentRound((r) => r + 1)
        setRoundTimeLeft(10)
      }
    }
  }, [roundTimeLeft, currentRound, totalRounds, isCompleted])

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center gap-4 px-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回列表
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">为 IdeaTree 设计最具吸引力的 Web3 激励机制</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* 当前轮次 */}
            <div className="flex items-center gap-2 rounded-lg border border-accent/50 bg-accent/10 px-4 py-2">
              <Zap className="h-4 w-4 text-accent" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">当前轮次</span>
                <span className="text-sm font-bold">
                  第 {currentRound} / {totalRounds} 轮
                </span>
              </div>
            </div>

            {/* 轮次倒计时 */}
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                roundTimeLeft <= 3
                  ? "border-red-500 bg-red-500/10 animate-pulse"
                  : "border-primary/50 bg-primary/10"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">轮次倒计时</span>
                <span className="text-2xl font-bold text-primary tabular-nums">
                  {roundTimeLeft}s
                </span>
              </div>
            </div>

            {/* 总倒计时 */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">决策结束</span>
                <span className="text-sm font-semibold tabular-nums">
                  {Math.floor(totalTimeLeft / 60)}:
                  {(totalTimeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 决策完成提示 */}
      {showCompletion && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-lg border border-accent bg-card p-8 shadow-2xl animate-in zoom-in-50">
            <div className="flex flex-col items-center gap-4">
              <Trophy className="h-16 w-16 text-accent" />
              <h2 className="text-3xl font-bold">决策已完成！</h2>
              <p className="text-lg text-muted-foreground">
                所有 {totalRounds} 轮次已结束，查看最终结果
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/">
                  <Button variant="default">返回列表</Button>
                </Link>
                <Button variant="outline" onClick={() => setShowCompletion(false)}>
                  继续查看
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative flex-1 overflow-hidden">
        <DecisionCanvas
          currentRound={currentRound}
          roundTimeLeft={roundTimeLeft}
          isCompleted={isCompleted}
          onRoundComplete={() => {}}
        />
      </main>
    </div>
  )
}
