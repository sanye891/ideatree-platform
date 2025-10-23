// 自动决策系统：10秒/轮，6轮共1分钟
export interface Branch {
  id: string;
  content: string;
  tokens: number;
  votes: number;
  isWinner?: boolean;
  isEliminated?: boolean;
  round: number;
  children?: Branch[];
}

export interface DecisionTree {
  id: string;
  mainContent: string;
  currentRound: number;
  totalRounds: number;
  roundDuration: number; // 毫秒
  totalTokens: number;
  branches: Branch[];
  roundStartTime: number;
  status: "running" | "completed" | "paused";
  history: RoundHistory[];
}

export interface RoundHistory {
  round: number;
  branches: Branch[];
  winner: Branch;
  timestamp: number;
  tokenChanges?: {
    branchId: string;
    type: "gained" | "lost";
    amount: number;
  }[];
}

// AI生成分支内容的模板
const branchTemplates = [
  // Web3激励机制相关
  "代币质押奖励机制",
  "NFT徽章成就系统",
  "创作者版税分成",
  "社区治理投票权",
  "流动性挖矿奖励",
  "推荐用户返佣",
  "早鸟用户空投",
  "活跃度积分排行",

  // 技术方案相关
  "Layer2扩容方案",
  "跨链桥接技术",
  "零知识证明隐私",
  "智能合约自动化",
  "去中心化存储",
  "预言机数据接入",
  "多签安全机制",
  "Gas费优化方案",

  // 产品功能相关
  "社交关系图谱",
  "内容推荐算法",
  "实时消息通知",
  "多语言国际化",
  "移动端适配",
  "暗黑模式主题",
  "无障碍访问支持",
  "离线功能缓存",

  // 商业模式相关
  "订阅会员制度",
  "交易手续费分润",
  "广告收益分享",
  "付费功能解锁",
  "企业级服务",
  "API接口收费",
  "数据分析服务",
  "定制开发支持",
];

// 生成AI分支内容
function generateBranchContent(round: number, parentContent?: string): string {
  const randomTemplate =
    branchTemplates[Math.floor(Math.random() * branchTemplates.length)];

  if (parentContent) {
    const prefixes = [
      "优化",
      "增强",
      "简化",
      "扩展",
      "改进",
      "集成",
      "升级",
      "创新",
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix}${randomTemplate}`;
  }

  return randomTemplate;
}

// 生成初始分支（第一轮）
export function generateInitialBranches(mainContent: string): Branch[] {
  const branchCount = Math.floor(Math.random() * 3) + 4; // 4-6个分支
  const branches: Branch[] = [];

  for (let i = 0; i < branchCount; i++) {
    branches.push({
      id: `branch-1-${i}`,
      content: generateBranchContent(1),
      tokens: Math.floor(Math.random() * 50) + 50, // 50-100初始代币
      votes: 0,
      round: 1,
    });
  }

  return branches;
}

// 生成新一轮分支
export function generateNextRoundBranches(
  parentBranch: Branch,
  round: number
): Branch[] {
  const branchCount = Math.floor(Math.random() * 2) + 3; // 3-4个分支
  const branches: Branch[] = [];

  for (let i = 0; i < branchCount; i++) {
    branches.push({
      id: `branch-${round}-${parentBranch.id}-${i}`,
      content: generateBranchContent(round, parentBranch.content),
      tokens: Math.floor(Math.random() * 30) + 30, // 30-60代币
      votes: 0,
      round,
    });
  }

  return branches;
}

// 模拟投票：随机为分支分配票数
// 模拟数据：基于代币生成参考数据（不影响胜出结果）
export function simulateVoting(branches: Branch[]): Branch[] {
  return branches.map((branch) => {
    // 基于当前代币数生成参考数据，仅用于展示
    const baseVotes = Math.floor(branch.tokens / 10);
    const randomVotes = Math.floor(Math.random() * baseVotes * 2);

    return {
      ...branch,
      votes: baseVotes + randomVotes,
    };
  });
}

// 选出胜者（票数最多的分支）
// 选出胜者（代币数量最多的分支）
export function selectWinner(
  branches: Branch[],
  eliminationRate: number = 0.2
): {
  updatedBranches: Branch[];
  tokenChanges: { branchId: string; type: "gained" | "lost"; amount: number }[];
} {
  if (branches.length === 0) {
    throw new Error("Cannot select a winner from an empty branch list.");
  }

  let winner: Branch = branches[0];
  for (const branch of branches) {
    if (branch.tokens > winner.tokens) {
      winner = branch;
    }
  }

  const tokenChanges: {
    branchId: string;
    type: "gained" | "lost";
    amount: number;
  }[] = [];
  let totalEliminatedTokens = 0;
  const updatedBranches = branches.map((branch) => {
    if (branch.id === winner.id) {
      return { ...branch, isWinner: true, isEliminated: false };
    } else {
      const eliminatedTokens = Math.floor(branch.tokens * eliminationRate);
      totalEliminatedTokens += eliminatedTokens;
      tokenChanges.push({
        branchId: branch.id,
        type: "lost",
        amount: eliminatedTokens,
      });
      return {
        ...branch,
        tokens: branch.tokens - eliminatedTokens,
        isWinner: false,
        isEliminated: true,
      };
    }
  });

  // 将收取的代币奖励给获胜者
  const finalBranches = updatedBranches.map((branch) => {
    if (branch.id === winner.id) {
      tokenChanges.push({
        branchId: branch.id,
        type: "gained",
        amount: totalEliminatedTokens,
      });
      return { ...branch, tokens: branch.tokens + totalEliminatedTokens };
    }
    return branch;
  });

  return { updatedBranches: finalBranches, tokenChanges };
}

// 代币增长：每轮增加20%
export function calculateTokenGrowth(
  currentTokens: number,
  round: number
): number {
  const growthRate = 0.2; // 20%增长
  return Math.floor(currentTokens * (1 + growthRate));
}

// 创建新决策
export function createDecision(mainContent: string): DecisionTree {
  const initialBranches = generateInitialBranches(mainContent);
  const totalTokens = initialBranches.reduce((sum, b) => sum + b.tokens, 0);

  return {
    id: `decision-${Date.now()}`,
    mainContent,
    currentRound: 1,
    totalRounds: 6,
    roundDuration: 10000, // 10秒
    totalTokens,
    branches: initialBranches,
    roundStartTime: Date.now(),
    status: "running",
    history: [],
  };
}

// 处理轮次结束
export function processRoundEnd(decision: DecisionTree): DecisionTree {
  // 1. 模拟投票
  const votedBranches = simulateVoting(decision.branches);

  // 2. 选出胜者并进行代币重新分配
  const { updatedBranches: branchesAfterAllocation, tokenChanges } =
    selectWinner(votedBranches);
  const winner = branchesAfterAllocation.find((b) => b.isWinner)!;

  // 3. 标记失败分支 (已在 selectWinner 中完成，这里直接使用结果)
  const updatedBranches = branchesAfterAllocation;

  // 4. 记录历史
  const history: RoundHistory = {
    round: decision.currentRound,
    branches: updatedBranches,
    winner,
    timestamp: Date.now(),
    tokenChanges,
  };

  // 5. 如果不是最后一轮，生成下一轮分支
  if (decision.currentRound < decision.totalRounds) {
    const nextRoundBranches = generateNextRoundBranches(
      winner,
      decision.currentRound + 1
    );

    // 6. 计算代币增长
    const newTotalTokens = calculateTokenGrowth(
      decision.totalTokens,
      decision.currentRound
    );
    const additionalTokens = newTotalTokens - decision.totalTokens;
    const tokensPerBranch = Math.floor(
      additionalTokens / nextRoundBranches.length
    );

    const enhancedBranches = nextRoundBranches.map((branch) => ({
      ...branch,
      tokens: branch.tokens + tokensPerBranch,
    }));

    return {
      ...decision,
      currentRound: decision.currentRound + 1,
      branches: enhancedBranches,
      totalTokens: newTotalTokens,
      roundStartTime: Date.now(),
      history: [...decision.history, history],
    };
  }

  // 最后一轮，决策完成
  // Ensure the final winner is properly marked
  const finalWinner = { ...winner, isWinner: true };
  const finalHistory = { ...history, winner: finalWinner };

  return {
    ...decision,
    status: "completed",
    branches: updatedBranches, // 确保最后一轮的分支状态被保存
    history: [...decision.history, finalHistory],
  };
}

// 计算奖励分配
export function calculateRewards(decision: DecisionTree): Map<string, number> {
  const rewards = new Map<string, number>();

  // 总奖池为最终的总代币数
  const totalRewardPool = decision.totalTokens;

  // 每轮胜者分配奖励
  decision.history.forEach((round, index) => {
    // 每轮分配的奖励递增（越往后的轮次奖励越高）
    const roundWeight = (index + 1) / decision.history.length;
    const roundReward = Math.floor(totalRewardPool * roundWeight * 0.15); // 每轮最多15%

    const winnerId = round.winner.id;
    const currentReward = rewards.get(winnerId) || 0;
    rewards.set(winnerId, currentReward + roundReward);

    // 将 tokenChanges 中的 gained 部分也累加到奖励中
    round.tokenChanges?.forEach((change) => {
      if (change.type === "gained") {
        const current = rewards.get(change.branchId) || 0;
        rewards.set(change.branchId, current + change.amount);
      }
    });
  });

  return rewards;
}
