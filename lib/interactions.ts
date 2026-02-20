import type { Interaction, InteractionType, InteractionCategory } from '@/types/game';

// 互动定义 - 希尔薇风格
export const interactions: Record<InteractionType, Interaction> = {
  // ============ 照顾类 (care) ============
  feed: {
    id: 'feed',
    category: 'care',
    displayName: '喂食',
    description: '给它准备美味的食物',
    effect: {
      affection: 5,
      health: 8,
      trauma: -2
    },
    cooldown: 5,
    timeCost: 1
  },
  treat: {
    id: 'treat',
    category: 'care',
    displayName: '治疗',
    description: '温柔地处理它的伤口',
    effect: {
      affection: 3,
      health: 15,
      trauma: -3,
      dependence: 2
    },
    cooldown: 10,
    timeCost: 1
  },
  groom: {
    id: 'groom',
    category: 'care',
    displayName: '整理头发',
    description: '温柔地帮她整理凌乱的头发',
    effect: {
      affection: 4,
      trauma: -2,
      dependence: 1
    },
    cooldown: 5,
    timeCost: 1
  },
  letRest: {
    id: 'letRest',
    category: 'care',
    displayName: '让它休息',
    description: '给它一个安静的空间休息',
    effect: {
      health: 5,
      sanity: 5,
      corruption: -2
    },
    cooldown: 5,
    timeCost: 1
  },

  // ============ 亲密类 (affection) ============
  petHead: {
    id: 'petHead',
    category: 'affection',
    displayName: '摸摸头',
    description: '轻柔地抚摸它的头',
    effect: {
      affection: 3,
      trauma: -2,
      dependence: 2
    },
    requirements: {
      minAffection: 20
    },
    cooldown: 3,
    timeCost: 1
  },
  play: {
    id: 'play',
    category: 'affection',
    displayName: '一起玩耍',
    description: '用玩具陪它玩耍',
    effect: {
      affection: 6,
      trauma: -4,
      corruption: -2
    },
    requirements: {
      minAffection: 30
    },
    cooldown: 5,
    timeCost: 1
  },
  hold: {
    id: 'hold',
    category: 'affection',
    displayName: '抱在怀里',
    description: '温柔地把它抱在怀里',
    effect: {
      affection: 8,
      dependence: 5,
      trauma: -3
    },
    requirements: {
      minAffection: 50
    },
    cooldown: 5,
    timeCost: 1
  },
  speak: {
    id: 'speak',
    category: 'affection',
    displayName: '轻声对话',
    description: '温柔地对它说话',
    effect: {
      affection: 2,
      sanity: 3,
      corruption: -1
    },
    cooldown: 2,
    timeCost: 1
  },

  // ============ 管教类 (discipline) ============
  scold: {
    id: 'scold',
    category: 'discipline',
    displayName: '责骂',
    description: '严厉地责骂它',
    effect: {
      affection: -8,
      corruption: 5,
      trauma: 8,
      dependence: -3
    },
    cooldown: 5,
    timeCost: 1
  },
  ignore: {
    id: 'ignore',
    category: 'discipline',
    displayName: '冷落',
    description: '假装没有注意到它的存在',
    effect: {
      affection: -3,
      corruption: 3,
      trauma: 3,
      dependence: -2,
      health: -3
    },
    cooldown: 3,
    timeCost: 1
  },
  restrict: {
    id: 'restrict',
    category: 'discipline',
    displayName: '限制自由',
    description: '限制它的活动范围',
    effect: {
      affection: -5,
      corruption: 8,
      trauma: 5,
      dependence: 3
    },
    cooldown: 10,
    timeCost: 1
  },

  // ============ 黑暗类 (dark) ============
  punish: {
    id: 'punish',
    category: 'dark',
    displayName: '惩罚',
    description: '对它进行严厉的惩罚',
    effect: {
      affection: -15,
      corruption: 15,
      trauma: 15,
      sanity: -10,
      health: -5
    },
    cooldown: 10,
    timeCost: 1
  },
  cage: {
    id: 'cage',
    category: 'dark',
    displayName: '囚禁',
    description: '把它关进狭小的笼子里',
    effect: {
      affection: -20,
      corruption: 20,
      trauma: 20,
      sanity: -15,
      dependence: 10,
      health: -8
    },
    cooldown: 30,
    timeCost: 1
  },
  torment: {
    id: 'torment',
    category: 'dark',
    displayName: '折磨',
    description: '......',
    effect: {
      affection: -25,
      corruption: 30,
      trauma: 30,
      sanity: -20,
      health: -10
    },
    requirements: {
      minCorruption: 30
    },
    cooldown: 20,
    timeCost: 1
  },

  // ============ 特殊类 (special) ============
  release: {
    id: 'release',
    category: 'special',
    displayName: '放它自由',
    description: '打开门，让它选择去留',
    effect: {
      affection: 10,
      corruption: -20,
      trauma: -10
    },
    requirements: {
      minAffection: 70,
      maxCorruption: 30
    },
    cooldown: 0,
    timeCost: 2
  },
  adoptOut: {
    id: 'adoptOut',
    category: 'special',
    displayName: '送养',
    description: '为它找一个更好的家',
    effect: {},
    requirements: {
      minAffection: 50,
      maxCorruption: 20
    },
    cooldown: 0,
    timeCost: 3
  }
};

// 按类别获取互动
export function getInteractionsByCategory(category: InteractionCategory): Interaction[] {
  return Object.values(interactions).filter(i => i.category === category);
}

// 检查互动是否可用
export function isInteractionAvailable(
  type: InteractionType,
  state: { affection: number; corruption: number; evolutionStage: string },
  stats: { daysPassed: number }
): { available: boolean; reason?: string } {
  const interaction = interactions[type];

  if (!interaction.requirements) {
    return { available: true };
  }

  const req = interaction.requirements;

  if (req.minAffection && state.affection < req.minAffection) {
    return { available: false, reason: `需要好感度 ${req.minAffection}` };
  }

  if (req.maxCorruption && state.corruption > req.maxCorruption) {
    return { available: false, reason: `堕落度过高` };
  }

  if (req.minCorruption && state.corruption < req.minCorruption) {
    return { available: false, reason: `需要堕落度 ${req.minCorruption}` };
  }

  if (req.minDay && stats.daysPassed < req.minDay) {
    return { available: false, reason: `需要第 ${req.minDay} 天后` };
  }

  if (req.evolutionStage && !req.evolutionStage.includes(state.evolutionStage as any)) {
    return { available: false, reason: '当前状态无法使用' };
  }

  return { available: true };
}

// 获取互动信息
export function getInteraction(type: InteractionType): Interaction {
  return interactions[type];
}

// 获取类别名称
export function getCategoryName(category: InteractionCategory): string {
  const names: Record<InteractionCategory, string> = {
    care: '照顾',
    affection: '亲密',
    discipline: '管教',
    dark: '黑暗',
    special: '特殊'
  };
  return names[category];
}

// 获取类别颜色
export function getCategoryColor(category: InteractionCategory): string {
  const colors: Record<InteractionCategory, string> = {
    care: 'text-blue-400',
    affection: 'text-pink-400',
    discipline: 'text-yellow-400',
    dark: 'text-red-400',
    special: 'text-purple-400'
  };
  return colors[category];
}
