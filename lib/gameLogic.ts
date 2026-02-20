import type { CatState, EvolutionStage, InteractionType, GameStats, TimeOfDay } from '@/types/game';
import { interactions } from './interactions';
import { checkEnding } from './endings';

// 限制数值
function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

// 时间段名称
export function getTimeOfDayName(time: TimeOfDay): string {
  const names: Record<TimeOfDay, string> = {
    morning: '早晨',
    afternoon: '午后',
    evening: '傍晚',
    night: '深夜'
  };
  return names[time];
}

// 下一个时间段
export function getNextTimeOfDay(current: TimeOfDay): TimeOfDay {
  const order: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
  const currentIndex = order.indexOf(current);
  return order[(currentIndex + 1) % 4];
}

// 计算进化阶段
export function calculateEvolutionStage(state: CatState): EvolutionStage {
  const { affection, corruption, health, sanity, trauma, dependence } = state;

  // 崩坏状态 - 高堕落 + 低理智
  if (corruption >= 70 && sanity <= 30) {
    return 'broken';
  }

  // 叛逆状态 - 高创伤 + 低依赖
  if (trauma >= 60 && dependence <= 30) {
    return 'rebellious';
  }

  // 奉献状态 - 高好感 + 高依赖 + 低堕落（治愈线终点）
  if (affection >= 80 && dependence >= 60 && corruption <= 20 && health >= 50) {
    return 'devoted';
  }

  // 依恋状态 - 中高好感 + 一定依赖
  if (affection >= 60 && dependence >= 40) {
    return 'attached';
  }

  // 接受状态 - 中等好感
  if (affection >= 40 && trauma <= 50) {
    return 'accepting';
  }

  // 警惕状态 - 低好感 + 开始适应
  if (affection >= 20) {
    return 'wary';
  }

  // 创伤状态 - 初始/高创伤
  return 'traumatized';
}

// 应用互动效果
export function applyInteraction(state: CatState, type: InteractionType): CatState {
  const interaction = interactions[type];
  const newState = { ...state };

  // 应用效果
  const effect = interaction.effect;

  if (effect.affection !== undefined) {
    // 创伤会降低好感度获取效果
    const modifier = state.trauma > 50 ? 0.7 : 1;
    newState.affection = clamp(newState.affection + Math.floor(effect.affection * modifier));
  }

  if (effect.corruption !== undefined) {
    newState.corruption = clamp(newState.corruption + effect.corruption);
  }

  if (effect.health !== undefined) {
    newState.health = clamp(newState.health + effect.health);
  }

  if (effect.sanity !== undefined) {
    newState.sanity = clamp(newState.sanity + effect.sanity);
  }

  if (effect.trauma !== undefined) {
    newState.trauma = clamp(newState.trauma + effect.trauma);
  }

  if (effect.dependence !== undefined) {
    newState.dependence = clamp(newState.dependence + effect.dependence);
  }

  // 计算新的进化阶段
  newState.evolutionStage = calculateEvolutionStage(newState);

  return newState;
}

// 获取进化阶段名称
export function getEvolutionStageName(stage: EvolutionStage): string {
  const names: Record<EvolutionStage, string> = {
    traumatized: '创伤',
    wary: '警惕',
    accepting: '接受',
    attached: '依恋',
    devoted: '奉献',
    broken: '崩坏',
    rebellious: '叛逆'
  };
  return names[stage];
}

// 获取猫咪心情（用于动画和表情）
export function getCatMood(state: CatState): string {
  const { affection, corruption, health, sanity, trauma } = state;

  if (health < 20) return 'sick';
  if (sanity < 30) return 'broken';
  if (corruption > 70) return 'corrupted';
  if (trauma > 60) return 'traumatized';
  if (affection > 80) return 'happy';
  if (affection > 50) return 'content';
  if (affection > 20) return 'neutral';

  return 'scared';
}

// 获取猫咪动画类名
export function getCatAnimation(state: CatState): string {
  const mood = getCatMood(state);

  switch (mood) {
    case 'sick':
    case 'broken':
      return 'cat-sick';
    case 'traumatized':
    case 'scared':
      return 'cat-scared';
    case 'corrupted':
      return 'cat-idle';
    case 'happy':
      return 'cat-happy';
    default:
      return 'cat-idle';
  }
}

// 检查结局
export function checkEndings(state: CatState, stats: GameStats) {
  return checkEnding(state, stats);
}

// 每日自然变化
export function applyDailyChanges(state: CatState): CatState {
  const newState = { ...state };

  // 好感度自然缓慢下降
  newState.affection = clamp(newState.affection - 1);

  // 理智度缓慢恢复
  if (newState.sanity < 50) {
    newState.sanity = clamp(newState.sanity + 2);
  }

  // 创伤缓慢消退
  if (newState.trauma > 0) {
    newState.trauma = clamp(newState.trauma - 1);
  }

  // 更新进化阶段
  newState.evolutionStage = calculateEvolutionStage(newState);

  return newState;
}
