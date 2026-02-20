import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  CatState,
  GameTime,
  GameStats,
  InteractionType,
  GameEvent,
  EventChoice,
  EndingType,
  InteractionRecord,
  TimeOfDay
} from '@/types/game';
import { applyInteraction, checkEndings, getNextTimeOfDay, applyDailyChanges } from '@/lib/gameLogic';
import { interactions, isInteractionAvailable } from '@/lib/interactions';

// 初始猫咪状态 - 希尔薇风格（有创伤的初始状态）
const initialCatState: CatState = {
  affection: 10,     // 低好感度
  corruption: 5,     // 初始堕落度
  health: 60,        // 健康度一般
  sanity: 70,        // 理智度还行
  trauma: 50,        // 有创伤
  dependence: 0,     // 无依赖
  evolutionStage: 'traumatized',
  currentOutfit: 'default',
  isSleeping: false
};

// 初始游戏时间
const initialGameTime: GameTime = {
  day: 1,
  timeOfDay: 'morning',
  actionsRemaining: 3  // 每个时间段3次行动机会
};

// 初始游戏统计
const initialGameStats: GameStats = {
  daysPassed: 1,
  totalInteractions: 0,
  careInteractions: 0,
  affectionInteractions: 0,
  disciplineInteractions: 0,
  darkInteractions: 0,
  daysWithLowHealth: 0,
  daysWithHighCorruption: 0,
  lastInteractionType: null,
  unlockedInteractions: ['feed', 'groom', 'letRest', 'speak', 'scold', 'ignore']
};

// 初始冷却时间
const initialCooldowns: Record<InteractionType, number> = {
  feed: 0, treat: 0, groom: 0, letRest: 0,
  petHead: 0, play: 0, hold: 0, speak: 0,
  scold: 0, ignore: 0, restrict: 0,
  punish: 0, cage: 0, torment: 0,
  release: 0, adoptOut: 0
};

// 初始游戏状态
const initialState: GameState = {
  cat: initialCatState,
  time: initialGameTime,
  stats: initialGameStats,
  history: [],
  currentEvent: null,
  currentDialogue: null,
  isEnded: false,
  ending: null,
  hasAcceptedWarning: false,
  cooldowns: initialCooldowns,
  settings: {
    textSpeed: 'normal',
    autoPlayDelay: 2000,
    showAffectionChange: true
  }
};

interface GameStore extends GameState {
  // 互动
  interact: (type: InteractionType) => { success: boolean; message?: string };

  // 时间推进
  advanceTime: () => void;

  // 事件
  triggerEvent: (event: GameEvent) => void;
  resolveEvent: (choice: EventChoice) => void;

  // 游戏流程
  endGame: (ending: EndingType) => void;
  resetGame: () => void;
  acceptWarning: () => void;

  // 设置
  updateSettings: (settings: Partial<GameState['settings']>) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      interact: (type: InteractionType) => {
        const state = get();

        if (state.isEnded) {
          return { success: false, message: '游戏已结束' };
        }

        // 检查行动次数
        if (state.time.actionsRemaining <= 0) {
          return { success: false, message: '当前时间段行动次数已用完' };
        }

        // 检查冷却
        const now = Date.now();
        if (state.cooldowns[type] > now) {
          return { success: false, message: '冷却中' };
        }

        // 检查互动是否可用
        const availability = isInteractionAvailable(type, state.cat, state.stats);
        if (!availability.available) {
          return { success: false, message: availability.reason };
        }

        // 应用互动
        const interaction = interactions[type];
        const newState = applyInteraction(state.cat, type);

        // 记录历史
        const record: InteractionRecord = {
          type,
          timestamp: now,
          day: state.time.day,
          timeOfDay: state.time.timeOfDay,
          previousState: state.cat,
          newState,
          dialogue: '' // TODO: 添加对话系统
        };

        // 更新统计
        const newStats = { ...state.stats, totalInteractions: state.stats.totalInteractions + 1 };

        // 按类别计数
        if (interaction.category === 'care') newStats.careInteractions++;
        else if (interaction.category === 'affection') newStats.affectionInteractions++;
        else if (interaction.category === 'discipline') newStats.disciplineInteractions++;
        else if (interaction.category === 'dark') newStats.darkInteractions++;

        newStats.lastInteractionType = type;

        // 检查是否解锁新互动
        if (!state.stats.unlockedInteractions.includes(type)) {
          newStats.unlockedInteractions = [...state.stats.unlockedInteractions, type];
        }

        // 更新状态
        set({
          cat: newState,
          history: [...state.history, record],
          stats: newStats,
          time: {
            ...state.time,
            actionsRemaining: state.time.actionsRemaining - interaction.timeCost
          },
          cooldowns: {
            ...state.cooldowns,
            [type]: now + interaction.cooldown * 1000
          }
        });

        // 检查结局
        const ending = checkEndings(newState, newStats);
        if (ending) {
          set({ isEnded: true, ending });
        }

        return { success: true };
      },

      advanceTime: () => {
        const state = get();
        const nextTime = getNextTimeOfDay(state.time.timeOfDay);

        let newTime: GameTime;
        let newCat = { ...state.cat };
        let newStats = { ...state.stats };

        if (nextTime === 'morning') {
          // 新的一天
          newTime = {
            day: state.time.day + 1,
            timeOfDay: 'morning',
            actionsRemaining: 3
          };
          newStats.daysPassed++;

          // 每日变化
          newCat = applyDailyChanges(newCat);

          // 检查低健康
          if (newCat.health < 20) {
            newStats.daysWithLowHealth++;
          }

          // 检查高堕落
          if (newCat.corruption > 70) {
            newStats.daysWithHighCorruption++;
          }
        } else {
          newTime = {
            ...state.time,
            timeOfDay: nextTime,
            actionsRemaining: 3
          };
        }

        // 夜间自动睡觉
        if (nextTime === 'night') {
          newCat.isSleeping = true;
        } else {
          newCat.isSleeping = false;
        }

        set({
          time: newTime,
          cat: newCat,
          stats: newStats
        });

        // 检查结局
        const ending = checkEndings(newCat, newStats);
        if (ending) {
          set({ isEnded: true, ending });
        }
      },

      triggerEvent: (event: GameEvent) => {
        set({ currentEvent: event });
      },

      resolveEvent: (choice: EventChoice) => {
        const state = get();
        const newCat = { ...state.cat };

        // 应用效果
        if (choice.effect.affection) newCat.affection = Math.max(0, Math.min(100, newCat.affection + choice.effect.affection));
        if (choice.effect.corruption) newCat.corruption = Math.max(0, Math.min(100, newCat.corruption + choice.effect.corruption));
        if (choice.effect.health) newCat.health = Math.max(0, Math.min(100, newCat.health + choice.effect.health));
        if (choice.effect.sanity) newCat.sanity = Math.max(0, Math.min(100, newCat.sanity + choice.effect.sanity));
        if (choice.effect.trauma) newCat.trauma = Math.max(0, Math.min(100, newCat.trauma + choice.effect.trauma));
        if (choice.effect.dependence) newCat.dependence = Math.max(0, Math.min(100, newCat.dependence + choice.effect.dependence));

        set({
          cat: newCat,
          currentEvent: null
        });

        // 检查结局
        const ending = checkEndings(newCat, state.stats);
        if (ending) {
          set({ isEnded: true, ending });
        }
      },

      endGame: (ending: EndingType) => {
        set({ isEnded: true, ending });
      },

      resetGame: () => {
        set(initialState);
      },

      acceptWarning: () => {
        set({ hasAcceptedWarning: true });
      },

      updateSettings: (settings) => {
        set(state => ({
          settings: { ...state.settings, ...settings }
        }));
      }
    }),
    {
      name: 'cat-whisper-game',
      partialize: (state) => ({
        cat: state.cat,
        time: state.time,
        stats: state.stats,
        history: state.history.slice(-50), // 只保留最近50条记录
        isEnded: state.isEnded,
        ending: state.ending,
        hasAcceptedWarning: state.hasAcceptedWarning,
        cooldowns: state.cooldowns,
        settings: state.settings
      })
    }
  )
);
