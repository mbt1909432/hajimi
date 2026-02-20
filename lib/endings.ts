import type { Ending, EndingType, CatState, GameStats } from '@/types/game';

// 结局定义 - 希尔薇风格
// 每个结局都有最低天数要求，防止过早触发
export const endings: Ending[] = [
  {
    id: 'devoted',
    title: '真正的羁绊',
    description: '通过耐心和温柔，你治愈了她的心灵创伤。她不再害怕，而是全心全意地信任着你。每当看到她的眼神，你都能感受到那份纯粹的依恋。也许这就是所谓的——救赎。',
    type: 'good',
    checkCondition: (state: CatState, stats: GameStats) =>
      stats.daysPassed >= 20 &&
      state.evolutionStage === 'devoted' &&
      state.affection >= 90 &&
      state.corruption <= 10 &&
      stats.careInteractions + stats.affectionInteractions > stats.disciplineInteractions + stats.darkInteractions
  },
  {
    id: 'dependent',
    title: '永恒的依赖',
    description: '她已经离不开你了。虽然心灵得到了一定程度的治愈，但她变得过于依赖你的存在。每当你要离开，她的眼神中就会流露出深深的恐惧。这份羁绊，既是救赎，也是枷锁。',
    type: 'neutral',
    checkCondition: (state: CatState, stats: GameStats) =>
      stats.daysPassed >= 15 &&
      state.affection >= 70 &&
      state.dependence >= 80 &&
      state.corruption <= 30 &&
      state.evolutionStage === 'attached'
  },
  {
    id: 'broken',
    title: '空壳',
    description: '她的眼神空洞，仿佛灵魂已经离体。身体还在，但那个曾经有着丰富情感的生命已经不复存在。她不会反抗，不会逃离，只是静静地存在着。你得到了完全的控制，但代价是什么？',
    type: 'bad',
    checkCondition: (state: CatState, stats: GameStats) =>
      stats.daysPassed >= 10 &&
      state.evolutionStage === 'broken' &&
      state.sanity <= 20 &&
      stats.darkInteractions >= 10
  },
  {
    id: 'escaped',
    title: '逃离',
    description: '某个深夜，她找到了逃跑的机会。你再也没有见过她。有时你会在窗边看到一个熟悉的身影，但她总是很快消失在黑暗中。也许自由，才是她真正需要的。',
    type: 'neutral',
    checkCondition: (state: CatState, stats: GameStats) =>
      stats.daysPassed >= 7 &&
      state.affection <= 30 &&
      state.trauma >= 60 &&
      stats.disciplineInteractions + stats.darkInteractions > stats.careInteractions + stats.affectionInteractions
  },
  {
    id: 'revenge',
    title: '反噬',
    description: '那些积累的创伤和恐惧最终转化为仇恨。一个不留神的夜晚，她露出了獠牙。被自己一手造成的怪物所伤，这或许是某种因果。伤口会愈合，但那双充满恨意的眼睛，你永远忘不掉。',
    type: 'bad',
    checkCondition: (state: CatState, stats: GameStats) =>
      stats.daysPassed >= 12 &&
      state.evolutionStage === 'rebellious' &&
      state.affection <= 20 &&
      state.trauma >= 70 &&
      stats.darkInteractions >= 5
  },
  {
    id: 'death',
    title: '消逝',
    description: '她的呼吸越来越微弱，最终在一个安静的夜晚停止了。你无法确定她最后的时刻是否感到了一丝温暖，但至少，痛苦已经结束。有些伤害，是无法挽回的。',
    type: 'bad',
    checkCondition: (_state: CatState, stats: GameStats) =>
      stats.daysPassed >= 5 &&
      stats.daysWithLowHealth >= 5
  },
  {
    id: 'released',
    title: '放她自由',
    description: '你打开了门。她犹豫了很久，回头看了你最后一眼，然后消失在晨光中。也许有一天，她会想起这段经历——希望她能记住的，不只是恐惧。',
    type: 'secret',
    // 这个结局需要执行 release 互动才能触发，不是自动触发
    checkCondition: () => false
  }
];

// 结局预兆 - 当接近某个结局时显示的提示
export interface EndingOmen {
  endingId: EndingType;
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high'; // 紧急程度
}

// 检查结局预兆
export function checkEndingOmen(state: CatState, stats: GameStats): EndingOmen | null {
  // 真正的羁绊预兆
  if (stats.daysPassed >= 15 && state.evolutionStage === 'devoted' && state.affection >= 80) {
    return {
      endingId: 'devoted',
      title: '心灵的治愈',
      message: '她的眼神越来越柔和，创伤正在慢慢愈合...',
      urgency: state.affection >= 85 ? 'high' : 'medium'
    };
  }

  // 空壳预兆
  if (state.evolutionStage === 'broken' && state.sanity <= 35) {
    return {
      endingId: 'broken',
      title: '灵魂的消逝',
      message: '她的眼神越来越空洞，似乎有什么重要的东西正在失去...',
      urgency: state.sanity <= 25 ? 'high' : 'medium'
    };
  }

  // 逃离预兆
  if (state.affection <= 35 && state.trauma >= 50 && stats.daysPassed >= 5) {
    return {
      endingId: 'escaped',
      title: '不安的躁动',
      message: '她开始频繁地望向窗外，似乎在寻找什么...',
      urgency: state.trauma >= 55 ? 'high' : 'medium'
    };
  }

  // 反噬预兆
  if (state.evolutionStage === 'rebellious' && state.trauma >= 60) {
    return {
      endingId: 'revenge',
      title: '潜藏的危险',
      message: '她的眼神中偶尔闪过一丝危险的光芒...',
      urgency: state.trauma >= 65 ? 'high' : 'medium'
    };
  }

  // 死亡预兆
  if (state.health <= 25 && stats.daysWithLowHealth >= 3) {
    return {
      endingId: 'death',
      title: '生命的脆弱',
      message: '她的身体越来越虚弱，需要尽快恢复健康...',
      urgency: stats.daysWithLowHealth >= 4 ? 'high' : 'medium'
    };
  }

  return null;
}

// 检查结局
export function checkEnding(state: CatState, stats: GameStats): EndingType | null {
  // 按优先级排序检查
  const sortedEndings = [...endings].sort((a, b) => {
    const priority = { secret: 0, good: 1, neutral: 2, bad: 3 };
    return priority[a.type] - priority[b.type];
  });

  for (const ending of sortedEndings) {
    if (ending.checkCondition(state, stats)) {
      return ending.id;
    }
  }
  return null;
}

// 获取结局信息
export function getEnding(id: EndingType): Ending | undefined {
  return endings.find(e => e.id === id);
}

// 获取所有结局
export function getAllEndings(): Ending[] {
  return endings;
}

// 获取结局类型名称
export function getEndingTypeName(type: Ending['type']): string {
  const names = {
    good: '美好结局',
    neutral: '普通结局',
    bad: '黑暗结局',
    secret: '隐藏结局'
  };
  return names[type];
}
