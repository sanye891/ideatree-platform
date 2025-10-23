"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Users,
  Coins,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getAllMockDecisions,
  type Decision,
  type DecisionStatus,
} from "@/lib/mock-data";

const mockDecisions: Decision[] = getAllMockDecisions();

interface DecisionListProps {
  activeTab?: DecisionStatus;
}

export function DecisionList({ activeTab = "ongoing" }: DecisionListProps) {
  const router = useRouter();
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    // 在客户端加载数据以避免水合错误
    setDecisions(getAllMockDecisions());
  }, []);

  const filteredDecisions = decisions.filter((d) => d.status === activeTab);

  const handleDecisionClick = (id: string) => {
    router.push(`/decision/${id}`);
  };

  const getStatusIcon = (status: DecisionStatus) => {
    switch (status) {
      case "ongoing":
        return <TrendingUp className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "upcoming":
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: DecisionStatus) => {
    switch (status) {
      case "ongoing":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-accent/10 text-accent border-accent/20";
      case "upcoming":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const diff = date.getTime() - Date.now();
    if (diff <= 0) return "已结束";
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  };

  return (
    <div className="absolute inset-0 overflow-auto bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Decisions
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredDecisions.length} decision
              {filteredDecisions.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredDecisions.map((decision) => (
            <Card
              key={decision.id}
              className={cn(
                "cursor-pointer p-6 transition-all hover:shadow-lg",
                selectedDecision === decision.id && "border-primary"
              )}
              onClick={() => handleDecisionClick(decision.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{decision.title}</h3>
                    <Badge
                      variant="outline"
                      className={cn("gap-1", getStatusColor(decision.status))}
                    >
                      {getStatusIcon(decision.status)}
                      {decision.status}
                    </Badge>
                  </div>

                  <p className="mb-4 text-sm text-muted-foreground">
                    {decision.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Coins className="h-4 w-4" />
                      <span className="font-medium">
                        {decision.totalTokens.toLocaleString()}
                      </span>
                      <span>tokens</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {decision.participants}
                      </span>
                      <span>participants</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">{decision.branches}</span>
                      <span>branches</span>
                    </div>

                    {decision.roundEndTime && decision.status === "ongoing" && (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {formatTimeRemaining(decision.roundEndTime)}
                        </span>
                        <span>remaining</span>
                      </div>
                    )}
                  </div>

                  {decision.winner && (
                    <div className="mt-3 rounded-lg border border-accent/20 bg-accent/5 p-3">
                      <p className="text-sm">
                        <span className="font-medium text-accent">Winner:</span>{" "}
                        {decision.winner}
                      </p>
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))}

          {filteredDecisions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {getStatusIcon(activeTab)}
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                No {activeTab} decisions
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "ongoing"
                  ? "Create a new decision to get started"
                  : `There are no ${activeTab} decisions at the moment`}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
