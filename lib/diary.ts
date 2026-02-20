import type { DiaryEntry, CatState, GameStats, InteractionType } from '@/types/game';

// 心情判定
export function getMoodFromState(state: CatState): 'happy' | 'sad' | 'scared' | 'neutral' | 'hopeful' {
  if (state.corruption > 60) return 'sad';
  if (state.trauma > 60) return 'scared';
  if (state.affection > 70 && state.trauma < 30) return 'happy';
  if (state.affection > 50 && state.corruption < 30) return 'hopeful';
  return 'neutral';
}

// 日记模板 - 根据心情和状态生成
const diaryTemplates: Record<string, Record<string, string[]>> = {
  happy: {
    morning: [
      '今天醒来感觉心情很好。',
      '阳光很温暖，希望能一直这样。',
      '昨晚做了一个好梦。',
    ],
    afternoon: [
      '今天过得很开心。',
      '有人陪伴的感觉真好。',
      '我开始期待明天了。',
    ],
    evening: [
      '今天是最美好的一天。',
      '希望能永远记住这种感觉。',
      '谢谢你。',
    ],
    special: [
      '这是我来到这里后最开心的一天。',
      '我以为再也不会笑了，但是......',
      '也许，生活真的会变好。',
    ]
  },
  sad: {
    morning: [
      '不想起床......',
      '又是一个难熬的日子。',
      '好累......',
    ],
    afternoon: [
      '为什么要这样对我......',
      '我不知道还能坚持多久。',
      '心里空空的。',
    ],
    evening: [
      '今天也很难熬。',
      '明天会更好吗......大概不会吧。',
      '我想哭，但已经没有眼泪了。',
    ],
    special: [
      '为什么会变成这样......',
      '我做错了什么吗？',
      '我想离开这里。',
    ]
  },
  scared: {
    morning: [
      '又到了早上......好可怕。',
      '不要看我......',
      '我想躲起来。',
    ],
    afternoon: [
      '心一直在跳，好害怕。',
      '请不要再伤害我了。',
      '我什么都会做的，只要不......',
    ],
    evening: [
      '终于要结束了......吗？',
      '晚上更可怕了。',
      '我不敢睡觉。',
    ],
    special: [
      '我好害怕，好害怕，好害怕......',
      '谁来救救我......',
      '我想消失。',
    ]
  },
  neutral: {
    morning: [
      '新的一天开始了。',
      '今天会是什么样呢。',
      '起床了。',
    ],
    afternoon: [
      '一天过去了大半。',
      '还是老样子。',
      '没什么特别的事情。',
    ],
    evening: [
      '今天结束了。',
      '又要睡觉了。',
      '晚安。',
    ],
    special: [
      '普通的一天。',
      '就这样吧。',
      '......',
    ]
  },
  hopeful: {
    morning: [
      '今天也许会是好的一天。',
      '感觉和以前不太一样了。',
      '有点期待今天。',
    ],
    afternoon: [
      '比想象中过得好一些。',
      '也许真的可以信任......',
      '心情稍微好了一点。',
    ],
    evening: [
      '今天还不错。',
      '也许明天也会是好的一天。',
      '谢谢你......今天。',
    ],
    special: [
      '第一次觉得，活着也许没有那么糟糕。',
      '我好像，开始期待明天了。',
      '这种感觉，是什么呢？',
    ]
  }
};

// 特殊互动的日记内容
const interactionDiary: Partial<Record<InteractionType, { positive: string; negative: string }>> = {
  feed: {
    positive: '今天的食物很好吃。',
    negative: '没有胃口......'
  },
  play: {
    positive: '玩得很开心！',
    negative: '不想玩......'
  },
  petHead: {
    positive: '被摸头的感觉......不讨厌。',
    negative: '请不要碰我。'
  },
  hold: {
    positive: '被抱住的感觉，很温暖。',
    negative: '太近了，好害怕。'
  },
  punish: {
    positive: '......',
    negative: '为什么......好痛......'
  },
  cage: {
    positive: '......',
    negative: '好黑，好可怕，放我出去......'
  },
  release: {
    positive: '真的......愿意放我走吗？',
    negative: '......'
  }
};

// 生成日记条目
export function generateDiaryEntry(
  day: number,
  state: CatState,
  stats: GameStats,
  interactions: InteractionType[]
): DiaryEntry {
  const mood = getMoodFromState(state);

  // 决定时间段
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'special' = 'evening';

  // 特殊事件判定
  const isSpecial =
    (mood === 'happy' && state.affection > 80) ||
    (mood === 'sad' && state.corruption > 70) ||
    (mood === 'hopeful' && stats.daysPassed === 7) ||
    stats.daysPassed === 30;

  if (isSpecial) {
    timeOfDay = 'special';
  }

  // 获取模板
  const templates = diaryTemplates[mood][timeOfDay];
  let content = templates[Math.floor(Math.random() * templates.length)];

  // 添加互动相关的日记
  if (interactions.length > 0) {
    const lastInteraction = interactions[interactions.length - 1];
    const interactionEntry = interactionDiary[lastInteraction];

    if (interactionEntry) {
      const interactionText = mood === 'happy' || mood === 'hopeful'
        ? interactionEntry.positive
        : interactionEntry.negative;
      content += `\n\n${interactionText}`;
    }
  }

  // 根据数值添加额外内容
  if (state.health < 30) {
    content += '\n\n身体好难受......';
  }
  if (state.sanity < 30) {
    content += '\n\n脑子里乱乱的......';
  }
  if (state.trauma > 70) {
    content += '\n\n那些记忆又回来了......';
  }
  if (state.affection > 80) {
    content += '\n\n有你在身边，真好。';
  }

  // 日期格式
  const date = `第 ${day} 天`;

  return {
    day,
    date,
    mood,
    content,
    special: isSpecial
  };
}

// 获取心情名称
export function getMoodName(mood: DiaryEntry['mood']): string {
  const names: Record<DiaryEntry['mood'], string> = {
    happy: '开心',
    sad: '悲伤',
    scared: '恐惧',
    neutral: '平静',
    hopeful: '期待'
  };
  return names[mood];
}

// 获取心情颜色
export function getMoodColor(mood: DiaryEntry['mood']): string {
  const colors: Record<DiaryEntry['mood'], string> = {
    happy: 'var(--heal-primary)',
    sad: '#6B7280',
    scared: 'var(--dark-action)',
    neutral: '#9CA3AF',
    hopeful: 'var(--care)'
  };
  return colors[mood];
}
