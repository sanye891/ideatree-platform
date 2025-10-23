// 演示数据生成工具
export type DecisionStatus = "ongoing" | "completed" | "upcoming"

export interface Decision {
  id: string
  title: string
  description: string
  status: DecisionStatus
  totalTokens: number
  participants: number
  branches: number
  roundEndTime?: Date
  decisionEndTime?: Date
  createdAt: Date
  winner?: string
  currentRound?: number
  totalRounds?: number
}

// AI生成的决策主题和分支内容
const decisionThemes = [
  {
    title: "为 IdeaTree 设计最具吸引力的 Web3 激励机制",
    description: "探讨如何通过代币经济和NFT激励来吸引更多用户参与决策",
    branches: [
      "平台代币奖励参与投票",
      "每参与一轮获得NFT，可转售",
      "被采纳创意空投奖励",
      "思维挖矿机制（活跃度高奖励多）",
      "按投票比例分发代币",
      "随机空投策略"
    ]
  },
  {
    title: "选择最佳的去中心化治理模型",
    description: "评估不同的DAO治理结构，找到最适合社区的方案",
    branches: [
      "完全去中心化的代币投票",
      "委托代表制度",
      "流动民主混合模式",
      "二次方投票机制",
      "时间加权投票权",
      "专家委员会+社区投票"
    ]
  },
  {
    title: "确定平台代币的经济模型",
    description: "设计可持续发展的代币分配和燃烧机制",
    branches: [
      "通缩模型：定期销毁代币",
      "通胀模型：持续奖励参与者",
      "稳定供应：固定总量分配",
      "动态调节：根据活跃度调整",
      "混合模型：奖励+销毁平衡",
      "阶梯式释放机制"
    ]
  },
  {
    title: "Web3社交功能优先级排序",
    description: "决定下一阶段应该优先开发哪些社交功能",
    branches: [
      "链上身份和信誉系统",
      "去中心化消息通讯",
      "NFT头像和个性化",
      "社区空间和群组",
      "内容创作者激励",
      "跨链社交互操作"
    ]
  },
  {
    title: "平台安全性升级方案",
    description: "评估各种安全措施，保护用户资产和数据",
    branches: [
      "多签钱包集成",
      "智能合约审计加强",
      "零知识证明隐私保护",
      "去中心化身份验证",
      "保险基金机制",
      "紧急暂停功能"
    ]
  },
  {
    title: "NFT市场功能设计",
    description: "打造用户友好的NFT交易和展示平台",
    branches: [
      "低手续费拍卖系统",
      "创作者版税自动分配",
      "NFT碎片化交易",
      "社交展示画廊",
      "跨链NFT桥接",
      "动态NFT生成工具"
    ]
  },
  {
    title: "社区激励计划方向",
    description: "选择最有效的社区建设和用户增长策略",
    branches: [
      "推荐奖励计划",
      "早期采用者空投",
      "社区大使项目",
      "内容创作奖励",
      "开发者赏金计划",
      "教育培训补贴"
    ]
  },
  {
    title: "跨链集成优先级",
    description: "确定首先支持哪些区块链网络",
    branches: [
      "以太坊Layer2优先",
      "多链同步部署",
      "侧链试点方案",
      "跨链桥梁建设",
      "Cosmos生态接入",
      "Polkadot平行链"
    ]
  },
  {
    title: "DeFi功能路线图",
    description: "规划去中心化金融产品的开发顺序",
    branches: [
      "质押挖矿功能",
      "流动性池创建",
      "借贷市场",
      "收益聚合器",
      "去中心化交易所",
      "合成资产发行"
    ]
  },
  {
    title: "移动端体验优化重点",
    description: "提升移动设备上的用户体验",
    branches: [
      "原生移动应用开发",
      "PWA渐进式应用",
      "钱包浏览器插件",
      "轻量级界面设计",
      "离线功能支持",
      "简化交易流程"
    ]
  }
]

// 生成随机时间
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// 生成 Ongoing 决策数据
export function generateOngoingDecisions(count: number = 8): Decision[] {
  const decisions: Decision[] = []
  const now = Date.now()

  for (let i = 0; i < count && i < decisionThemes.length; i++) {
    const theme = decisionThemes[i]
    const createdTime = now - Math.random() * 3600000 * 24 * 3 // 过去3天内创建
    
    // 第一个决策固定60秒，其他的确保剩余时间大于一天
    let roundDuration;
    let totalRounds;
    let currentRound;
    
    if (i === 0) {
      // 第一个决策：60秒轮次，6轮，当前在第1-5轮
      roundDuration = 60000;
      totalRounds = 6;
      currentRound = Math.floor(Math.random() * (totalRounds - 1)) + 1;
    } else {
      // 其他决策：确保剩余时间大于24小时
      const minRemainingHours = 24;
      const minRemainingTime = minRemainingHours * 3600000; // 24小时毫秒数
      
      // 先随机确定总轮数和当前轮次
      totalRounds = Math.floor(Math.random() * 4) + 4; // 4-7轮
      currentRound = Math.floor(Math.random() * (totalRounds - 1)) + 1; // 1-(总轮数-1)
      
      // 计算每轮最少需要的时间
      const remainingRounds = totalRounds - currentRound + 1;
      const minRoundDuration = Math.ceil(minRemainingTime / remainingRounds);
      
      // 设置轮次时间（至少满足最小要求，再增加一些随机性）
      roundDuration = minRoundDuration + Math.floor(Math.random() * 3600000); // 最小时间 + 0-1小时随机
    }

    // 计算剩余时间
    const remainingRounds = totalRounds - currentRound + 1
    const remainingTime = roundDuration * remainingRounds

    decisions.push({
      id: `ongoing-${i + 1}`,
      title: theme.title,
      description: theme.description,
      status: "ongoing",
      totalTokens: Math.floor(Math.random() * 5000) + 500, // 500-5500代币
      participants: Math.floor(Math.random() * 200) + 10, // 10-210参与者
      branches: Math.floor(Math.random() * 12) + 3, // 3-15分支
      currentRound,
      totalRounds,
      roundEndTime: new Date(now + roundDuration),
      decisionEndTime: new Date(now + remainingTime),
      createdAt: new Date(createdTime),
    })
  }

  return decisions
}

// 生成 Completed 决策数据
export function generateCompletedDecisions(count: number = 12): Decision[] {
  const decisions: Decision[] = []
  const now = Date.now()

  const winners = [
    "思维挖矿机制（活跃度高奖励多）",
    "流动民主混合模式",
    "混合模型：奖励+销毁平衡",
    "NFT头像和个性化",
    "零知识证明隐私保护",
    "社交展示画廊",
    "内容创作奖励",
    "以太坊Layer2优先",
    "质押挖矿功能",
    "PWA渐进式应用",
    "完全去中心化的代币投票",
    "创作者版税自动分配"
  ]

  for (let i = 0; i < count && i < decisionThemes.length; i++) {
    const theme = decisionThemes[i]
    const createdTime = now - Math.random() * 3600000 * 24 * 30 // 过去30天内创建
    const totalRounds = Math.floor(Math.random() * 3) + 5 // 5-7轮

    decisions.push({
      id: `completed-${i + 1}`,
      title: theme.title,
      description: theme.description,
      status: "completed",
      totalTokens: Math.floor(Math.random() * 8000) + 2000, // 2000-10000代币
      participants: Math.floor(Math.random() * 300) + 50, // 50-350参与者
      branches: Math.floor(Math.random() * 20) + 6, // 6-25分支
      currentRound: totalRounds,
      totalRounds,
      createdAt: new Date(createdTime),
      winner: winners[i] || theme.branches[Math.floor(Math.random() * theme.branches.length)],
    })
  }

  return decisions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// 生成 Upcoming 决策数据
export function generateUpcomingDecisions(count: number = 6): Decision[] {
  const decisions: Decision[] = []
  const now = Date.now()

  for (let i = 0; i < count && i < decisionThemes.length; i++) {
    const theme = decisionThemes[i]
    const startTime = now + Math.random() * 3600000 * 24 * 7 // 未来7天内开始
    const totalRounds = Math.floor(Math.random() * 4) + 4 // 4-8轮

    decisions.push({
      id: `upcoming-${i + 1}`,
      title: theme.title,
      description: theme.description,
      status: "upcoming",
      totalTokens: Math.floor(Math.random() * 3000) + 1000, // 1000-4000代币
      participants: Math.floor(Math.random() * 50), // 0-50参与者（还未开始）
      branches: Math.floor(Math.random() * 8) + 2, // 2-10分支
      totalRounds,
      decisionEndTime: new Date(startTime),
      createdAt: new Date(now - Math.random() * 3600000 * 48), // 1-2天前创建
    })
  }

  return decisions.sort((a, b) => (a.decisionEndTime?.getTime() || 0) - (b.decisionEndTime?.getTime() || 0))
}

// 获取所有演示数据
export function getAllMockDecisions(): Decision[] {
  return [
    ...generateOngoingDecisions(8),
    ...generateCompletedDecisions(12),
    ...generateUpcomingDecisions(6),
  ]
}
