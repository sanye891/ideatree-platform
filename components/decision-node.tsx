"use client";

import { useEffect, useState } from "react";
import {
  Coins,
  Plus,
  MessageSquare,
  Lock,
  TrendingUp,
  Crown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWeb3 } from "@/lib/web3-context";
import { useToast } from "@/hooks/use-toast";
import { CreateBranchDialog } from "@/components/create-branch-dialog";
import { AllocateTokensDialog } from "@/components/allocate-tokens-dialog";

interface DecisionNodeProps {
  id: string;
  content: string;
  tokens: number;
  isMain?: boolean;
  isWinner?: boolean;
  isEliminated?: boolean;
  votes?: number;
  isCompleted?: boolean;
  children?: DecisionNodeProps[];
}

export function DecisionNode({
  id,
  content,
  tokens,
  isMain = false,
  isWinner = false,
  isEliminated = false,
  votes = 0,
  isCompleted = false,
  children,
}: DecisionNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [showAllocateDialog, setShowAllocateDialog] = useState(false);
  const [displayTokens, setDisplayTokens] = useState(tokens); // 用于动画显示的代币数
  const [isGrowing, setIsGrowing] = useState(false);
  const { isConnected, balance } = useWeb3();
  const { toast } = useToast();

  // 代币可视化增长动画
  useEffect(() => {
    if (!isEliminated && !isWinner && !isCompleted) {
      const interval = setInterval(() => {
        setDisplayTokens((prev) => {
          const increment = Math.floor(Math.random() * 5) + 1; // 随机增加1-5个代币
          setIsGrowing(true);
          setTimeout(() => setIsGrowing(false), 300);
          return prev + increment;
        });
      }, 2000); // 每2秒增加一次

      return () => clearInterval(interval);
    }
  }, [isEliminated, isWinner, isCompleted]);

  // 更新初始代币值
  useEffect(() => {
    setDisplayTokens(tokens);
  }, [tokens]);

  const handleAddTokens = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to allocate tokens",
        variant: "destructive",
      });
      return;
    }

    setShowAllocateDialog(true);
  };

  const handleAllocateTokens = (tokensToAdd: number) => {
    setUserTokens(userTokens + tokensToAdd);
  };

  const handleCreateBranch = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a branch",
        variant: "destructive",
      });
      return;
    }
    setShowBranchDialog(true);
  };

  const totalTokens = displayTokens + userTokens;

  return (
    <>
      <div className="relative flex flex-col items-center">
        <Card
          className={cn(
            "relative w-72 p-5 transition-all duration-500",
            isMain && "border-primary bg-primary/5 shadow-lg",
            isHovered && "shadow-xl",
            userTokens > 0 && "border-accent ring-2 ring-accent/20",
            isWinner &&
              isCompleted &&
              "border-green-500 bg-green-50 ring-2 ring-green-500 scale-105 shadow-green-200/50 shadow-lg",
            isWinner &&
              !isCompleted &&
              "border-accent bg-accent/10 ring-2 ring-accent scale-105",
            isEliminated && "opacity-40 grayscale"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Winner Badge */}
          {isWinner && (
            <div className="absolute -right-2 -top-2">
              <Badge
                variant="default"
                className={cn(
                  "gap-1",
                  isCompleted ? "bg-green-500 text-white" : "bg-accent"
                )}
              >
                {isCompleted ? (
                  <Crown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {isCompleted ? "最终胜出" : "代币胜出"}
              </Badge>
            </div>
          )}

          {/* Node Content */}
          <div className="mb-3">
            <p className="text-balance text-sm font-medium leading-relaxed text-foreground">
              {content}
            </p>
          </div>

          {/* Token Count */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge
              variant={userTokens > 0 ? "default" : "secondary"}
              className={`gap-1.5 transition-all ${
                isGrowing ? "scale-110 ring-2 ring-primary/50" : ""
              }`}
            >
              <Coins
                className={`h-3.5 w-3.5 ${isGrowing ? "animate-spin" : ""}`}
              />
              <span className="tabular-nums">
                {totalTokens.toLocaleString()}
              </span>
              {isGrowing && <span className="text-xs text-green-500">↑</span>}
            </Badge>
            {userTokens > 0 && (
              <Badge
                variant="outline"
                className="gap-1 border-accent text-accent"
              >
                <TrendingUp className="h-3 w-3" />+{userTokens}
              </Badge>
            )}
            {isMain && <Badge variant="outline">主决策</Badge>}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!isMain && (
              <Button
                size="sm"
                variant={userTokens > 0 ? "default" : "outline"}
                className="flex-1 gap-1.5"
                onClick={handleAddTokens}
                disabled={!isConnected}
              >
                {!isConnected ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Coins className="h-3.5 w-3.5" />
                )}
                {userTokens > 0 ? "Add More" : "Allocate"}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 bg-transparent"
              onClick={handleCreateBranch}
              disabled={!isConnected}
            >
              <Plus className="h-3.5 w-3.5" />
              Branch
            </Button>
            <Button size="sm" variant="ghost">
              <MessageSquare className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>

        {/* Child Nodes */}
        {children && children.length > 0 && (
          <div className="relative mt-12">
            {/* Main vertical line from parent */}
            <div className="absolute left-1/2 top-0 h-6 w-0.5 -translate-x-1/2 bg-gradient-to-b from-border to-primary/50" />

            {/* Horizontal connector line */}
            {children.length > 1 && (
              <div
                className="absolute left-0 top-6 h-0.5 bg-gradient-to-r from-primary/50 via-border to-primary/50"
                style={{
                  left: `calc(${100 / children.length / 2}%)`,
                  right: `calc(${100 / children.length / 2}%)`,
                }}
              />
            )}

            <div className="flex gap-12">
              {children.map((child) => (
                <div key={child.id} className="relative flex-1">
                  {/* Vertical line from horizontal connector to child */}
                  <div className="absolute left-1/2 top-0 h-6 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/50 to-border" />
                  <div className="mt-6">
                    <DecisionNode {...child} isCompleted={isCompleted} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateBranchDialog
        open={showBranchDialog}
        onOpenChange={setShowBranchDialog}
        parentNodeId={id}
        parentContent={content}
      />
      <AllocateTokensDialog
        open={showAllocateDialog}
        onOpenChange={setShowAllocateDialog}
        branchId={id}
        branchContent={content}
        currentTokens={totalTokens}
        onAllocate={handleAllocateTokens}
      />
    </>
  );
}
