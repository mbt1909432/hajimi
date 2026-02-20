import type { GameEvent, CatState, GameStats } from '@/types/game';

// 事件定义 - 扩展版 (20个事件)
export const events: GameEvent[] = [
  // ============ 治愈线事件 ============
  {
    id: 'nightmare',
    trigger: (state: CatState, _stats: GameStats) =>
      state.trauma > 40 && state.sanity < 60,
    title: '噩梦',
    description: '她在睡梦中颤抖着，似乎在经历可怕的噩梦...',
    dialogue: '......不要......求求你......',
    choices: [
      {
        id: 'comfort',
        text: '轻轻安抚她',
        effect: { affection: 5, trauma: -5, sanity: 5 },
        dialogueResponse: '她慢慢平静下来，呼吸变得均匀...'
      },
      {
        id: 'wake',
        text: '叫醒她',
        effect: { trauma: 5, sanity: -5 },
        dialogueResponse: '她惊恐地醒来，眼神中充满恐惧...'
      }
    ],
    priority: 2
  },
  {
    id: 'trust_moment',
    trigger: (state: CatState, _stats: GameStats) =>
      state.affection > 50 && state.trauma < 40,
    title: '温馨时刻',
    description: '她主动靠近你，在你身边坐下...',
    dialogue: '......可以......待在你身边吗......',
    choices: [
      {
        id: 'accept',
        text: '轻轻抚摸她的头',
        effect: { affection: 10, dependence: 5, trauma: -3 },
        dialogueResponse: '她发出满足的声音，靠得更近了...'
      },
      {
        id: 'push',
        text: '推开她',
        effect: { affection: -10, trauma: 5 },
        dialogueResponse: '她失落地走开了...'
      }
    ],
    priority: 1
  },
  {
    id: 'first_smile',
    trigger: (state: CatState, stats: GameStats) =>
      state.affection > 40 && state.corruption < 20 && stats.daysPassed > 5,
    title: '第一次微笑',
    description: '你注意到她的嘴角微微上扬...',
    dialogue: '......谢谢你......一直以来......',
    choices: [
      {
        id: 'smile_back',
        text: '温柔地回应',
        effect: { affection: 15, sanity: 10, trauma: -5 },
        dialogueResponse: '她的笑容更加明显了，眼睛里有了光彩...'
      },
      {
        id: 'question',
        text: '问她为什么笑',
        effect: { affection: -3, trauma: 2 },
        dialogueResponse: '她立刻收起了笑容，低下了头...'
      }
    ],
    priority: 3
  },
  {
    id: 'gift_attempt',
    trigger: (state: CatState, stats: GameStats) =>
      state.affection > 60 && stats.careInteractions > 10,
    title: '小礼物',
    description: '她小心翼翼地拿出什么东西藏在身后...',
    dialogue: '......这个......给你......',
    choices: [
      {
        id: 'accept_gift',
        text: '开心地接受',
        effect: { affection: 12, dependence: 5, corruption: -3 },
        dialogueResponse: '她开心地看着你收下那朵野花，眼中闪烁着期待...'
      },
      {
        id: 'reject',
        text: '说不需要',
        effect: { affection: -8, trauma: 5 },
        dialogueResponse: '她默默地把东西藏了回去...'
      }
    ],
    priority: 2
  },
  {
    id: 'healing_moment',
    trigger: (state: CatState, _stats: GameStats) =>
      state.trauma < 30 && state.affection > 70,
    title: '治愈时刻',
    description: '她似乎终于开始信任你了...',
    dialogue: '......我......从来没有这样安心过......',
    choices: [
      {
        id: 'embrace',
        text: '给她一个拥抱',
        effect: { affection: 20, dependence: 10, trauma: -10 },
        dialogueResponse: '她轻轻靠在你怀里，像找到了归宿...'
      },
      {
        id: 'distant',
        text: '保持距离',
        effect: { affection: -5, trauma: 3 },
        dialogueResponse: '她有些失落地低下了头...'
      }
    ],
    priority: 4
  },

  // ============ 健康事件 ============
  {
    id: 'sick',
    trigger: (state: CatState, _stats: GameStats) =>
      state.health < 40,
    title: '她生病了',
    description: '她无精打采地蜷缩在角落，拒绝进食...',
    dialogue: '......好难受......',
    choices: [
      {
        id: 'treat',
        text: '温柔地照顾她',
        effect: { health: 15, affection: 5, trauma: -3 },
        dialogueResponse: '在你的照顾下，她似乎好了一些...'
      },
      {
        id: 'ignore',
        text: '不管她',
        effect: { health: -10, affection: -5 },
        dialogueResponse: '她默默地承受着痛苦...'
      }
    ],
    priority: 3
  },
  {
    id: 'fever_dream',
    trigger: (state: CatState, _stats: GameStats) =>
      state.health < 30 && state.trauma > 30,
    title: '高烧呓语',
    description: '她在发烧中不停地说着什么...',
    dialogue: '......妈妈......对不起......我好怕......',
    choices: [
      {
        id: 'stay',
        text: '整夜守在她身边',
        effect: { health: 10, affection: 10, trauma: -5 },
        dialogueResponse: '天亮时，她的烧退了一些...'
      },
      {
        id: 'medicine_only',
        text: '只给她吃药',
        effect: { health: 15, affection: -2 },
        dialogueResponse: '她默默吞下药，眼神空洞...'
      }
    ],
    priority: 4
  },
  {
    id: 'recovery_sign',
    trigger: (state: CatState, stats: GameStats) =>
      state.health > 60 && stats.daysWithLowHealth > 2,
    title: '康复的迹象',
    description: '她的脸色终于好转了一些...',
    dialogue: '......我好像......有力气了......',
    choices: [
      {
        id: 'celebrate',
        text: '为她庆祝',
        effect: { affection: 8, sanity: 5 },
        dialogueResponse: '她难得地露出了一丝微笑...'
      },
      {
        id: 'normal',
        text: '继续日常',
        effect: { health: 5 },
        dialogueResponse: '她安静地休息着...'
      }
    ],
    priority: 1
  },

  // ============ 黑暗线事件 ============
  {
    id: 'corruption_event',
    trigger: (state: CatState, _stats: GameStats) =>
      state.corruption > 40 && state.sanity < 50,
    title: '异常行为',
    description: '她的行为变得有些奇怪...',
    dialogue: '......我已经......不知道......什么是对什么是错了......',
    choices: [
      {
        id: 'comfort',
        text: '试图唤醒她',
        effect: { sanity: 10, corruption: -5, affection: 5 },
        dialogueResponse: '她的眼神稍微清明了一些...'
      },
      {
        id: 'exploit',
        text: '利用这个机会',
        effect: { corruption: 15, sanity: -10 },
        dialogueResponse: '......是的......我愿意......'
      }
    ],
    priority: 2
  },
  {
    id: 'escape_attempt',
    trigger: (state: CatState, stats: GameStats) =>
      state.affection < 30 && state.trauma > 50 && stats.darkInteractions > 3,
    title: '逃跑尝试',
    description: '你发现她正在试图打开窗户...',
    dialogue: '......我想......离开......',
    choices: [
      {
        id: 'let_go',
        text: '让她走',
        effect: { corruption: -10, trauma: -10 },
        dialogueResponse: '她惊讶地看了你最后一眼，然后消失在夜色中...'
      },
      {
        id: 'stop',
        text: '阻止她',
        effect: { trauma: 10, corruption: 5, affection: -5 },
        dialogueResponse: '她绝望地低下了头...'
      }
    ],
    priority: 2
  },
  {
    id: 'mental_break',
    trigger: (state: CatState, _stats: GameStats) =>
      state.sanity < 25 && state.corruption > 50,
    title: '精神崩溃',
    description: '她突然开始尖叫...',
    dialogue: '......不要碰我！！！......所有人都在骗我！！！',
    choices: [
      {
        id: 'calm',
        text: '温柔地安抚她',
        effect: { sanity: 15, corruption: -10, trauma: -5 },
        dialogueResponse: '在你的安抚下，她慢慢平静下来...'
      },
      {
        id: 'force',
        text: '强行压制',
        effect: { sanity: -15, corruption: 10, trauma: 10 },
        dialogueResponse: '她不再挣扎，但眼神已经死寂...'
      }
    ],
    priority: 5
  },
  {
    id: 'submission',
    trigger: (state: CatState, _stats: GameStats) =>
      state.corruption > 70 && state.affection < 20,
    title: '完全顺从',
    description: '她低着头，等待你的指令...',
    dialogue: '......主人......请随意使用我......',
    choices: [
      {
        id: 'reject_submission',
        text: '告诉她不必这样',
        effect: { sanity: 10, corruption: -15, affection: 10 },
        dialogueResponse: '她惊讶地抬头，眼中闪过一丝希望...'
      },
      {
        id: 'accept_submission',
        text: '接受她的顺从',
        effect: { corruption: 20, sanity: -10, dependence: 10 },
        dialogueResponse: '她完全低下了头，等待着...'
      }
    ],
    priority: 3
  },

  // ============ 特殊事件 ============
  {
    id: 'past_reveal',
    trigger: (state: CatState, stats: GameStats) =>
      state.affection > 60 && stats.daysPassed > 10,
    title: '过去的阴影',
    description: '她开始讲述她的过去...',
    dialogue: '......我以前......也有家......但后来......',
    choices: [
      {
        id: 'listen',
        text: '认真倾听',
        effect: { affection: 10, trauma: -8, dependence: 5 },
        dialogueResponse: '讲完后，她似乎轻松了一些...'
      },
      {
        id: 'dismissive',
        text: '转移话题',
        effect: { affection: -5, trauma: 5 },
        dialogueResponse: '她沉默了，把话吞了回去...'
      }
    ],
    priority: 3
  },
  {
    id: 'festival_invite',
    trigger: (state: CatState, stats: GameStats) =>
      state.affection > 55 && state.corruption < 25 && stats.daysPassed > 7,
    title: '节日的邀请',
    description: '外面传来了节日的音乐声...',
    dialogue: '......那个......我们可以......出去看看吗......',
    choices: [
      {
        id: 'go_together',
        text: '带她出去',
        effect: { affection: 15, sanity: 10, trauma: -5, corruption: -5 },
        dialogueResponse: '她像孩子一样开心地看着一切...'
      },
      {
        id: 'stay_home',
        text: '说外面危险',
        effect: { affection: -3, trauma: 2 },
        dialogueResponse: '她失落地低下了头...'
      }
    ],
    priority: 2
  },
  {
    id: 'birthday',
    trigger: (state: CatState, stats: GameStats) =>
      stats.daysPassed === 30 && state.affection > 40,
    title: '特殊的日子',
    description: '今天是她来到这里的第三十天...',
    dialogue: '......你记得......今天是什么日子吗......',
    choices: [
      {
        id: 'celebrate',
        text: '为她准备惊喜',
        effect: { affection: 25, dependence: 10, trauma: -10 },
        dialogueResponse: '她惊讶得说不出话，眼眶微微泛红...'
      },
      {
        id: 'forget',
        text: '装作不记得',
        effect: { affection: -10, trauma: 5 },
        dialogueResponse: '她默默转过身去...'
      }
    ],
    priority: 5
  },

  // ============ 随机日常事件 ============
  {
    id: 'rainy_day',
    trigger: (state: CatState, stats: GameStats) =>
      Math.random() < 0.1 && state.sanity > 40 && stats.daysPassed > 3,
    title: '下雨天',
    description: '窗外下着雨，雷声隐隐传来...',
    dialogue: '......雷声......好可怕......',
    choices: [
      {
        id: 'comfort',
        text: '陪在她身边',
        effect: { affection: 8, dependence: 5 },
        dialogueResponse: '有你在身边，她渐渐不再害怕了...'
      },
      {
        id: 'leave',
        text: '让她自己待着',
        effect: { trauma: 5, sanity: -5 },
        dialogueResponse: '她独自缩在角落里发抖...'
      }
    ],
    priority: 1
  },
  {
    id: 'good_dream',
    trigger: (state: CatState, _stats: GameStats) =>
      state.trauma < 40 && state.sanity > 50 && Math.random() < 0.15,
    title: '美梦',
    description: '她在睡梦中微微一笑...',
    dialogue: '......嗯......好开心......',
    choices: [
      {
        id: 'let_sleep',
        text: '让她继续睡',
        effect: { sanity: 5, health: 5 },
        dialogueResponse: '她睡得很香甜...'
      },
      {
        id: 'wake_gently',
        text: '轻轻叫醒她',
        effect: { affection: 3 },
        dialogueResponse: '她揉揉眼睛，看起来心情不错...'
      }
    ],
    priority: 1
  },
  {
    id: 'curiosity',
    trigger: (state: CatState, stats: GameStats) =>
      state.affection > 30 && state.corruption < 40 && stats.daysPassed > 5 && Math.random() < 0.2,
    title: '好奇心',
    description: '她对你的某样东西产生了好奇...',
    dialogue: '......那个......是什么......可以碰吗......',
    choices: [
      {
        id: 'allow',
        text: '允许她碰',
        effect: { affection: 5, sanity: 3 },
        dialogueResponse: '她小心翼翼地触摸，眼中闪烁着好奇...'
      },
      {
        id: 'deny',
        text: '说不行',
        effect: { affection: -2 },
        dialogueResponse: '她有些失落地收回了手...'
      }
    ],
    priority: 1
  },
  {
    id: 'nightmare_memory',
    trigger: (state: CatState, _stats: GameStats) =>
      state.trauma > 60 && Math.random() < 0.15,
    title: '过去的回忆',
    description: '她突然陷入了对过去的回忆...',
    dialogue: '......为什么......要那样对我......我做错了什么......',
    choices: [
      {
        id: 'comfort',
        text: '告诉她现在安全了',
        effect: { trauma: -10, affection: 8, sanity: 5 },
        dialogueResponse: '她靠在你身上，慢慢平静下来...'
      },
      {
        id: 'silent',
        text: '保持沉默',
        effect: { trauma: 3 },
        dialogueResponse: '她独自承受着回忆的痛苦...'
      }
    ],
    priority: 2
  }
];

// 获取随机事件
export function getRandomEvent(state: CatState, stats: GameStats): GameEvent | null {
  // 25% 概率触发事件
  if (Math.random() > 0.25) return null;

  const possibleEvents = events.filter(event => event.trigger(state, stats));

  if (possibleEvents.length === 0) return null;

  // 按优先级排序，然后加权随机选择
  possibleEvents.sort((a, b) => b.priority - a.priority);

  // 高优先级事件有更高几率被选中
  const weights = possibleEvents.map(e => e.priority);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < possibleEvents.length; i++) {
    random -= weights[i];
    if (random <= 0) return possibleEvents[i];
  }

  return possibleEvents[0];
}

// 获取特定事件
export function getEvent(id: string): GameEvent | undefined {
  return events.find(e => e.id === id);
}
