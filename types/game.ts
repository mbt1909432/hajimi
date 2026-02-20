// ============================================
// 希尔薇风格游戏系统设计
// ============================================

// 时间段
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// 猫咪进化阶段（对应希尔薇的状态变化）
export type EvolutionStage =
  | 'traumatized'  // 创伤 - 初始状态，害怕一切
  | 'wary'         // 警惕 - 开始适应
  | 'accepting'    // 接受 - 愿意接近
  | 'attached'     // 依恋 - 产生依赖
  | 'devoted'      // 奉献 - 完全信任（治愈线）
  | 'broken'       // 崩坏 - 失去自我（堕落线）
  | 'rebellious';  // 叛逆 - 内心抗拒

// 猫咪状态
export interface CatState {
  // 核心数值 (0-100)
  affection: number;    // 好感度 (替代 trust)
  corruption: number;   // 堕落度 (新增，替代 fear 的部分功能)
  health: number;       // 健康度
  sanity: number;       // 理智度 (新增)

  // 隐藏数值
  trauma: number;       // 创伤值 (影响互动效果)
  dependence: number;   // 依赖度

  // 状态
  evolutionStage: EvolutionStage;
  currentOutfit: string;  // 当前外观状态
  isSleeping: boolean;
}

// 游戏时间
export interface GameTime {
  day: number;
  timeOfDay: TimeOfDay;
  actionsRemaining: number;  // 当前时间段剩余行动次数
}

// 互动类型 - 希尔薇风格分类
export type InteractionCategory = 'care' | 'affection' | 'discipline' | 'dark' | 'special';

export type InteractionType =
  // 照顾类 (care)
  | 'feed'          // 喂食
  | 'treat'         // 治疗
  | 'groom'         // 梳理毛发
  | 'letRest'       // 让它休息
  // 亲密类 (affection)
  | 'petHead'       // 摸头
  | 'play'          // 玩耍
  | 'hold'          // 抱抱
  | 'speak'         // 对话
  // 管教类 (discipline)
  | 'scold'         // 责骂
  | 'ignore'        // 冷落
  | 'restrict'      // 限制自由
  // 黑暗类 (dark)
  | 'punish'        // 惩罚
  | 'cage'          // 囚禁
  | 'torment'       // 折磨
  // 特殊类 (special) - 需要特定条件解锁
  | 'release'       // 放它自由
  | 'adoptOut';     // 送养

// 互动定义
export interface Interaction {
  id: InteractionType;
  category: InteractionCategory;
  displayName: string;
  description: string;
  effect: InteractionEffect;
  requirements?: InteractionRequirement;
  cooldown: number;
  timeCost: number;  // 消耗的行动次数
}

// 互动效果
export interface InteractionEffect {
  affection?: number;
  corruption?: number;
  health?: number;
  sanity?: number;
  trauma?: number;
  dependence?: number;
}

// 互动需求
export interface InteractionRequirement {
  minAffection?: number;
  maxCorruption?: number;
  minCorruption?: number;
  minDay?: number;
  evolutionStage?: EvolutionStage[];
}

// 对话系统
export interface Dialogue {
  id: string;
  trigger: (state: CatState, time: GameTime) => boolean;
  category: 'greeting' | 'interaction' | 'event' | 'ending';
  variations: DialogueVariation[];
}

export interface DialogueVariation {
  condition?: (state: CatState) => boolean;
  text: string;
  response?: {
    affection: number;
    corruption: number;
  };
}

// 事件
export interface GameEvent {
  id: string;
  trigger: (state: CatState, stats: GameStats) => boolean;
  title: string;
  description: string;
  dialogue: string;  // 事件发生时的对话
  choices: EventChoice[];
  priority: number;
}

export interface EventChoice {
  id: string;
  text: string;
  effect: InteractionEffect;
  dialogueResponse: string;  // 选择后的回应
}

// 结局
export type EndingType =
  | 'devoted'       // 真爱结局 - 完全治愈
  | 'dependent'     // 依赖结局 - 离不开你
  | 'broken'        // 崩坏结局 - 失去灵魂
  | 'escaped'       // 逃亡结局 - 逃离魔爪
  | 'revenge'       // 复仇结局 - 反噬
  | 'death'         // 死亡结局
  | 'released';     // 放生结局

export interface Ending {
  id: EndingType;
  title: string;
  description: string;
  type: 'good' | 'bad' | 'neutral' | 'secret';
  checkCondition: (state: CatState, gameStats: GameStats) => boolean;
}

// 游戏统计
export interface GameStats {
  daysPassed: number;
  totalInteractions: number;
  careInteractions: number;
  affectionInteractions: number;
  disciplineInteractions: number;
  darkInteractions: number;
  daysWithLowHealth: number;
  daysWithHighCorruption: number;
  lastInteractionType: InteractionType | null;
  unlockedInteractions: InteractionType[];
}

// 互动历史
export interface InteractionRecord {
  type: InteractionType;
  timestamp: number;
  day: number;
  timeOfDay: TimeOfDay;
  previousState: CatState;
  newState: CatState;
  dialogue: string;
}

// 游戏状态
export interface GameState {
  cat: CatState;
  time: GameTime;
  stats: GameStats;
  history: InteractionRecord[];
  currentEvent: GameEvent | null;
  currentDialogue: Dialogue | null;
  isEnded: boolean;
  ending: EndingType | null;
  hasAcceptedWarning: boolean;
  cooldowns: Record<InteractionType, number>;
  settings: GameSettings;
}

// 游戏设置
export interface GameSettings {
  textSpeed: 'slow' | 'normal' | 'fast';
  autoPlayDelay: number;
  showAffectionChange: boolean;
}
