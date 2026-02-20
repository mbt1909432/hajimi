import type { GameEvent, CatState, GameStats } from '@/types/game';

// 事件定义 - 希尔薇风格
export const events: GameEvent[] = [
  {
    id: 'nightmare',
    trigger: (state: CatState, _stats: GameStats) =>
      state.trauma > 40 && state.sanity < 60,
    title: '噩梦',
    description: '它在睡梦中颤抖着，似乎在经历可怕的噩梦...',
    dialogue: '......不要......求求你......',
    choices: [
      {
        id: 'comfort',
        text: '轻轻安抚它',
        effect: { affection: 5, trauma: -5, sanity: 5 },
        dialogueResponse: '它慢慢平静下来，呼吸变得均匀...'
      },
      {
        id: 'wake',
        text: '叫醒它',
        effect: { trauma: 5, sanity: -5 },
        dialogueResponse: '它惊恐地醒来，眼神中充满恐惧...'
      }
    ],
    priority: 2
  },
  {
    id: 'sick',
    trigger: (state: CatState, _stats: GameStats) =>
      state.health < 40,
    title: '它生病了',
    description: '它无精打采地蜷缩在角落，拒绝进食...',
    dialogue: '......好难受......',
    choices: [
      {
        id: 'treat',
        text: '温柔地照顾它',
        effect: { health: 15, affection: 5, trauma: -3 },
        dialogueResponse: '在你的照顾下，它似乎好了一些...'
      },
      {
        id: 'ignore',
        text: '不管它',
        effect: { health: -10, affection: -5 },
        dialogueResponse: '它默默地承受着痛苦...'
      }
    ],
    priority: 3
  },
  {
    id: 'trust_moment',
    trigger: (state: CatState, _stats: GameStats) =>
      state.affection > 50 && state.trauma < 40,
    title: '温馨时刻',
    description: '它主动靠近你，在你身边坐下...',
    dialogue: '......可以......待在你身边吗......',
    choices: [
      {
        id: 'accept',
        text: '轻轻抚摸它',
        effect: { affection: 10, dependence: 5, trauma: -3 },
        dialogueResponse: '它发出满足的呼噜声...'
      },
      {
        id: 'push',
        text: '推开它',
        effect: { affection: -10, trauma: 5 },
        dialogueResponse: '它失落地走开了...'
      }
    ],
    priority: 1
  },
  {
    id: 'escape_attempt',
    trigger: (state: CatState, stats: GameStats) =>
      state.affection < 30 && state.trauma > 50 && stats.darkInteractions > 3,
    title: '逃跑尝试',
    description: '你发现它正在试图打开窗户...',
    dialogue: '......我想......离开......',
    choices: [
      {
        id: 'let_go',
        text: '让它走',
        effect: { corruption: -10, trauma: -10 },
        dialogueResponse: '它惊讶地看了你最后一眼，然后消失在夜色中...'
      },
      {
        id: 'stop',
        text: '阻止它',
        effect: { trauma: 10, corruption: 5, affection: -5 },
        dialogueResponse: '它绝望地低下了头...'
      }
    ],
    priority: 2
  },
  {
    id: 'corruption_event',
    trigger: (state: CatState, _stats: GameStats) =>
      state.corruption > 40 && state.sanity < 50,
    title: '异常行为',
    description: '它的行为变得有些奇怪...',
    dialogue: '......我已经......不知道......什么是对什么是错了......',
    choices: [
      {
        id: 'comfort',
        text: '试图唤醒它',
        effect: { sanity: 10, corruption: -5, affection: 5 },
        dialogueResponse: '它的眼神稍微清明了一些...'
      },
      {
        id: 'exploit',
        text: '利用这个机会',
        effect: { corruption: 15, sanity: -10 },
        dialogueResponse: '......是的......我愿意......'
      }
    ],
    priority: 2
  }
];

// 获取随机事件
export function getRandomEvent(state: CatState, stats: GameStats): GameEvent | null {
  // 20% 概率触发事件
  if (Math.random() > 0.2) return null;

  const possibleEvents = events.filter(event => event.trigger(state, stats));

  if (possibleEvents.length === 0) return null;

  // 按优先级排序
  possibleEvents.sort((a, b) => b.priority - a.priority);

  return possibleEvents[0];
}

// 获取特定事件
export function getEvent(id: string): GameEvent | undefined {
  return events.find(e => e.id === id);
}
