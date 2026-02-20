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
  TimeOfDay,
  InventoryItem,
  DiaryEntry
} from '@/types/game';
import { applyInteraction, checkEndings, getNextTimeOfDay, applyDailyChanges } from '@/lib/gameLogic';
import { interactions, isInteractionAvailable } from '@/lib/interactions';
import { generateDiaryEntry } from '@/lib/diary';
import { getRandomEvent } from '@/lib/events';

// 初始角色状态 - 兽娘（有创伤的初始状态）
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

// 初始背包
const initialInventory: InventoryItem[] = [];

// 初始日记
const initialDiary: DiaryEntry[] = [];

// 初始资源
const initialCoins = 100;

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
  },
  // 特殊物品状态
  hasDiary: false,
  hasPhoto: false,
  hasCollar: false
};

// 扩展的游戏状态
interface ExtendedGameState extends GameState {
  inventory: InventoryItem[];
  diary: DiaryEntry[];
  coins: number;
  todayInteractions: InteractionType[];
}

interface GameStore extends ExtendedGameState {
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

  // 物品系统
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => boolean;
  useItem: (itemId: string) => { success: boolean; message?: string };

  // 商店
  buyItem: (itemId: string) => { success: boolean; message?: string };

  // 日记系统
  addDiaryEntry: () => void;

  // 资源
  addCoins: (amount: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      inventory: initialInventory,
      diary: initialDiary,
      coins: initialCoins,
      todayInteractions: [],

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
          },
          todayInteractions: [...state.todayInteractions, type]
        });

        // 特殊处理：放生互动直接触发 released 结局
        if (type === 'release') {
          set({ isEnded: true, ending: 'released' });
          return { success: true };
        }

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

        // 检查是否触发随机事件
        const event = getRandomEvent(newCat, newStats);

        set({
          time: newTime,
          cat: newCat,
          stats: newStats,
          currentEvent: event
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
        set({
          ...initialState,
          inventory: initialInventory,
          diary: initialDiary,
          coins: initialCoins,
          todayInteractions: []
        });
      },

      acceptWarning: () => {
        set({ hasAcceptedWarning: true });
      },

      updateSettings: (settings) => {
        set(state => ({
          settings: { ...state.settings, ...settings }
        }));
      },

      // 物品系统
      addItem: (itemId: string, quantity = 1) => {
        set(state => {
          const existing = state.inventory.find(i => i.itemId === itemId);
          if (existing) {
            return {
              inventory: state.inventory.map(i =>
                i.itemId === itemId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            };
          }
          return {
            inventory: [...state.inventory, { itemId, quantity }]
          };
        });
      },

      removeItem: (itemId: string, quantity = 1) => {
        const state = get();
        const existing = state.inventory.find(i => i.itemId === itemId);
        if (!existing || existing.quantity < quantity) return false;

        if (existing.quantity <= quantity) {
          set({ inventory: state.inventory.filter(i => i.itemId !== itemId) });
        } else {
          set({
            inventory: state.inventory.map(i =>
              i.itemId === itemId
                ? { ...i, quantity: i.quantity - quantity }
                : i
            )
          });
        }
        return true;
      },

      useItem: (itemId: string) => {
        const state = get();
        const { items, canUseItem } = require('@/lib/items');
        const item = items[itemId];

        if (!item) return { success: false, message: '物品不存在' };

        const inventoryItem = state.inventory.find(i => i.itemId === itemId);
        if (!inventoryItem || inventoryItem.quantity <= 0) {
          return { success: false, message: '没有这个物品' };
        }

        const useCheck = canUseItem(itemId, state.cat);
        if (!useCheck.canUse) {
          return { success: false, message: useCheck.reason };
        }

        // 特殊物品处理
        let specialMessage = '';
        const updates: Partial<GameState> = {};

        // 日记本 - 解锁日记功能
        if (itemId === 'diary' && !state.hasDiary) {
          updates.hasDiary = true;
          specialMessage = '她接过日记本，轻轻抚摸着封面...';
        } else if (itemId === 'diary' && state.hasDiary) {
          return { success: false, message: '她已经有一本日记本了' };
        }

        // 合照 - 特殊纪念品
        if (itemId === 'photo' && !state.hasPhoto) {
          updates.hasPhoto = true;
          specialMessage = '她看着照片中的两个人，眼中闪过一丝光芒...';
        }

        // 项圈 - 黑暗物品
        if (itemId === 'collar') {
          if (state.hasCollar) {
            return { success: false, message: '她已经戴着项圈了' };
          }
          updates.hasCollar = true;
          specialMessage = '......';
        }

        // 应用效果
        const newCat = { ...state.cat };
        if (item.effect.affection) newCat.affection = Math.max(0, Math.min(100, newCat.affection + item.effect.affection));
        if (item.effect.corruption) newCat.corruption = Math.max(0, Math.min(100, newCat.corruption + item.effect.corruption));
        if (item.effect.health) newCat.health = Math.max(0, Math.min(100, newCat.health + item.effect.health));
        if (item.effect.sanity) newCat.sanity = Math.max(0, Math.min(100, newCat.sanity + item.effect.sanity));
        if (item.effect.trauma) newCat.trauma = Math.max(0, Math.min(100, newCat.trauma + item.effect.trauma));
        if (item.effect.dependence) newCat.dependence = Math.max(0, Math.min(100, newCat.dependence + item.effect.dependence));

        // 更新库存
        let newInventory = state.inventory;
        if (!item.permanent) {
          if (inventoryItem.quantity <= 1) {
            newInventory = state.inventory.filter(i => i.itemId !== itemId);
          } else {
            newInventory = state.inventory.map(i =>
              i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
          }
        }

        set({ cat: newCat, inventory: newInventory, ...updates });

        // 返回成功消息
        return {
          success: true,
          message: specialMessage || `送出了${item.name}`
        };
      },

      // 商店
      buyItem: (itemId: string) => {
        const state = get();
        const { items, isItemUnlocked } = require('@/lib/items');
        const item = items[itemId];

        if (!item) return { success: false, message: '物品不存在' };
        if (!isItemUnlocked(itemId, { affection: state.cat.affection, daysPassed: state.stats.daysPassed })) {
          return { success: false, message: '物品尚未解锁' };
        }
        if (state.coins < item.price) {
          return { success: false, message: '金币不足' };
        }

        set(state => {
          const existing = state.inventory.find(i => i.itemId === itemId);
          let newInventory: InventoryItem[];

          if (existing && item.stackable) {
            newInventory = state.inventory.map(i =>
              i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else if (!existing) {
            newInventory = [...state.inventory, { itemId, quantity: 1 }];
          } else {
            return { coins: state.coins - item.price }; // 已拥有非堆叠物品
          }

          return {
            coins: state.coins - item.price,
            inventory: newInventory
          };
        });

        return { success: true };
      },

      // 日记系统
      addDiaryEntry: () => {
        const state = get();
        const entry = generateDiaryEntry(
          state.time.day,
          state.cat,
          state.stats,
          state.todayInteractions
        );

        set(state => ({
          diary: [...state.diary, entry],
          todayInteractions: []
        }));
      },

      // 资源
      addCoins: (amount: number) => {
        set(state => ({ coins: state.coins + amount }));
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
        settings: state.settings,
        inventory: state.inventory,
        diary: state.diary,
        coins: state.coins,
        // 特殊物品状态
        hasDiary: state.hasDiary,
        hasPhoto: state.hasPhoto,
        hasCollar: state.hasCollar
      })
    }
  )
);
