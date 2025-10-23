"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { DecisionNode } from "@/components/decision-node";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createDecision,
  processRoundEnd,
  simulateVoting,
  selectWinner,
  type DecisionTree,
  type Branch,
} from "@/lib/auto-decision";

// 将 Branch 转换为 DecisionNodeProps 格式
function convertBranchToNode(branch: Branch, isMain = false): any {
  return {
    id: branch.id,
    content: branch.content,
    tokens: branch.tokens,
    votes: branch.votes,
    isMain,
    isWinner: branch.isWinner,
    isEliminated: branch.isEliminated,
    children: branch.children?.map((child) => convertBranchToNode(child)),
  };
}

const mainContent = "为 IdeaTree 设计最具吸引力的 Web3 激励机制";

interface DecisionCanvasProps {
  currentRound: number;
  roundTimeLeft: number;
  isCompleted: boolean;
  onRoundComplete?: () => void;
}

export function DecisionCanvas({
  currentRound,
  roundTimeLeft,
  isCompleted,
  onRoundComplete,
}: DecisionCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 自动决策状态
  const [decision, setDecision] = useState<DecisionTree | null>(null);
  const [currentTree, setCurrentTree] = useState<any>(null);
  const [lastProcessedRound, setLastProcessedRound] = useState(0);

  // 初始化决策
  useEffect(() => {
    const newDecision = createDecision(mainContent);
    setDecision(newDecision);

    // 构建初始树结构
    const mainNode = {
      id: "main",
      content: mainContent,
      tokens: newDecision.totalTokens,
      isMain: true,
      children: newDecision.branches.map((b) => convertBranchToNode(b)),
    };
    setCurrentTree(mainNode);
  }, []);

  // 当轮次改变时处理
  useEffect(() => {
    if (!decision) return;

    // 如果是新的一轮，处理上一轮的结束
    if (currentRound > lastProcessedRound && lastProcessedRound > 0) {
      const updated = processRoundEnd(decision);
      setDecision(updated);

      // 构建新的树结构
      buildTreeStructure(updated);
      setLastProcessedRound(currentRound);
    } else if (lastProcessedRound === 0) {
      setLastProcessedRound(currentRound);
    }
  }, [currentRound, decision, lastProcessedRound]);

  // 当轮次倒计时结束时，立即处理当前轮的投票
  useEffect(() => {
    if (!decision || roundTimeLeft > 0 || isCompleted) return;

    // 轮次时间结束，处理当前轮的投票
    const votedBranches = simulateVoting(decision.branches);
    const { updatedBranches } = selectWinner(votedBranches);

    // 更新当前决策状态，显示获胜者
    const updatedDecision = {
      ...decision,
      branches: updatedBranches,
    };
    setDecision(updatedDecision);
    buildTreeStructure(updatedDecision);
  }, [roundTimeLeft, decision, isCompleted]);

  // 构建树结构的辅助函数
  const buildTreeStructure = (decisionData: DecisionTree) => {
    const history = decisionData.history;
    let mainNode: any = {
      id: "main",
      content: mainContent,
      tokens: decisionData.totalTokens,
      isMain: true,
      children: [],
    };

    // 构建历史层级 - 保持树状结构，获胜者在其位置下方扩展
    if (history.length > 0) {
      let currentLevel: any = mainNode;

      for (let i = 0; i < history.length; i++) {
        const round = history[i];

        // 显示这一轮的所有分支（包括失败的）
        currentLevel.children = round.branches.map((b) =>
          convertBranchToNode(b)
        );

        // 找到获胜者，准备下一层
        const winner = currentLevel.children.find((c: any) => c.isWinner);
        if (winner && i < history.length - 1) {
          currentLevel = winner;
        }
      }

      // 如果还在进行中，添加当前轮的分支到最后一个获胜者下面
      if (decisionData.status === "running") {
        const lastWinner = currentLevel.children?.find((c: any) => c.isWinner);

        if (lastWinner) {
          lastWinner.children = decisionData.branches.map((b) =>
            convertBranchToNode(b)
          );
        }
      } else if (decisionData.status === "completed") {
        // 对于已完成的决策，确保最终获胜者有正确的样式
        const finalRound = history[history.length - 1];
        if (finalRound && finalRound.winner) {
          // 递归更新最终获胜者的样式
          const updateWinnerInTree = (node: any): any => {
            if (node.id === finalRound.winner.id) {
              return { ...node, isWinner: true };
            }
            if (node.children) {
              return {
                ...node,
                children: node.children.map(updateWinnerInTree),
              };
            }
            return node;
          };
          mainNode = updateWinnerInTree(mainNode);
        }
      }
    } else if (decisionData.status === "running") {
      // 第一轮还没结束，显示当前分支
      mainNode.children = decisionData.branches.map((b) =>
        convertBranchToNode(b)
      );
    }

    setCurrentTree(mainNode);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, scale + delta), 2);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.5));
  };

  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={canvasRef}
      className="relative h-full w-full overflow-hidden bg-background"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={handleZoomIn}
          className="bg-card"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleZoomOut}
          className="bg-card"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleResetView}
          className="bg-card"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Decision Tree Canvas */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {currentTree && (
          <DecisionNode {...currentTree} isCompleted={isCompleted} />
        )}
      </div>

      {/* Grid Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(var(--border) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(var(--border) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
