// CG画廊系统

// CG类型
export type CGType =
  | 'first_meeting'      // 初次相遇
  | 'first_smile'        // 第一次微笑
  | 'healing_moment'     // 治愈时刻
  | 'trust_bond'         // 信任羁绊
  | 'devoted'            // 奉献结局
  | 'broken'             // 崩坏结局
  | 'escape'             // 逃离结局
  | 'revenge'            // 复仇结局
  | 'release';           // 放生结局

// CG定义
export interface CGDefinition {
  id: CGType;
  name: string;
  description: string;
  unlockCondition: (state: { affection: number; corruption: number; trauma: number; evolutionStage: string; daysPassed: number }) => boolean;
  category: 'story' | 'ending';
}

// CG列表
export const CG_LIST: CGDefinition[] = [
  // 剧情CG
  {
    id: 'first_meeting',
    name: '初次相遇',
    description: '你第一次见到她的那一刻...',
    unlockCondition: () => true, // 自动解锁
    category: 'story'
  },
  {
    id: 'first_smile',
    name: '第一次微笑',
    description: '她第一次对你露出真心的笑容',
    unlockCondition: (state) => state.affection >= 50 && state.corruption < 20,
    category: 'story'
  },
  {
    id: 'healing_moment',
    name: '治愈时刻',
    description: '她终于开始信任你了',
    unlockCondition: (state) => state.affection >= 70 && state.trauma < 30,
    category: 'story'
  },
  {
    id: 'trust_bond',
    name: '信任羁绊',
    description: '你们之间建立了牢不可破的纽带',
    unlockCondition: (state) => state.evolutionStage === 'devoted',
    category: 'story'
  },

  // 结局CG
  {
    id: 'devoted',
    name: '真正的羁绊',
    description: '你给了她一个真正的家',
    unlockCondition: (state) => state.evolutionStage === 'devoted' && state.affection >= 90,
    category: 'ending'
  },
  {
    id: 'broken',
    name: '空壳',
    description: '恐惧吞噬了一切',
    unlockCondition: (state) => state.evolutionStage === 'broken',
    category: 'ending'
  },
  {
    id: 'escape',
    name: '逃离',
    description: '她选择了自由',
    unlockCondition: (state) => state.affection < 30 && state.trauma > 60,
    category: 'ending'
  },
  {
    id: 'revenge',
    name: '反噬',
    description: '受伤的灵魂终于反击',
    unlockCondition: (state) => state.evolutionStage === 'rebellious' && state.trauma > 70,
    category: 'ending'
  },
  {
    id: 'release',
    name: '放她自由',
    description: '你选择了放手',
    unlockCondition: (state) => state.affection >= 60 && state.corruption <= 25 && state.daysPassed >= 15,
    category: 'ending'
  }
];

// 检查CG是否解锁
export function isCGUnlocked(cgId: CGType, state: {
  affection: number;
  corruption: number;
  trauma: number;
  evolutionStage: string;
  daysPassed: number;
}): boolean {
  const cg = CG_LIST.find(c => c.id === cgId);
  if (!cg) return false;
  return cg.unlockCondition(state);
}

// 获取所有已解锁的CG
export function getUnlockedCGs(state: {
  affection: number;
  corruption: number;
  trauma: number;
  evolutionStage: string;
  daysPassed: number;
}): CGDefinition[] {
  return CG_LIST.filter(cg => cg.unlockCondition(state));
}

// 获取CG总数
export function getTotalCGCount(): number {
  return CG_LIST.length;
}

// 获取已解锁CG数量
export function getUnlockedCGCount(state: {
  affection: number;
  corruption: number;
  trauma: number;
  evolutionStage: string;
  daysPassed: number;
}): number {
  return getUnlockedCGs(state).length;
}
