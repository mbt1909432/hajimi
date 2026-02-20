'use client';

import type { CatState, GameTime } from '@/types/game';
import { getTimeOfDayName, getEvolutionStageName } from '@/lib/gameLogic';
import ProgressBar from '@/components/ui/ProgressBar';

interface StatusBarProps {
  cat: CatState;
  time: GameTime;
  compact?: boolean;
}

export default function StatusBar({ cat, time, compact = false }: StatusBarProps) {
  if (compact) {
    // 紧凑模式 - 用于移动端和侧边栏
    return (
      <div className="w-full space-y-3">
        {/* 时间显示 - 紧凑 */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">
            第 <span className="text-white font-medium">{time.day}</span> 天
          </span>
          <span style={{ color: 'var(--heal-primary)' }}>{getTimeOfDayName(time.timeOfDay)}</span>
          <span className="text-gray-500">行动 {time.actionsRemaining}</span>
        </div>

        {/* 核心数值 - 紧凑 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <ProgressBar value={cat.affection} label="好感" variant="heal" size="sm" showValue />
          <ProgressBar value={cat.corruption} label="堕落" variant="dark" size="sm" showValue />
          <ProgressBar value={cat.health} label="健康" variant="health" size="sm" showValue />
          <ProgressBar value={cat.sanity} label="理智" variant="sanity" size="sm" showValue />
        </div>

        {/* 状态 - 紧凑 */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">状态</span>
          <span style={{ color: 'var(--heal-primary)' }} className="font-medium">
            {getEvolutionStageName(cat.evolutionStage)}
          </span>
        </div>
      </div>
    );
  }

  // 完整模式
  return (
    <div className="w-full glass-card p-4 space-y-4">
      {/* 时间显示 */}
      <div className="text-center">
        <div className="text-gray-400 text-sm">
          第 <span className="text-white font-bold text-lg">{time.day}</span> 天
        </div>
        <div className="text-lg font-medium mt-1" style={{ color: 'var(--heal-primary)' }}>
          {getTimeOfDayName(time.timeOfDay)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          剩余行动: {time.actionsRemaining}
        </div>
      </div>

      {/* 核心数值 */}
      <div className="space-y-3">
        <ProgressBar value={cat.affection} label="好感度" variant="heal" size="md" />
        <ProgressBar value={cat.corruption} label="堕落度" variant="dark" size="md" />
        <ProgressBar value={cat.health} label="健康度" variant="health" size="md" />
        <ProgressBar value={cat.sanity} label="理智度" variant="sanity" size="md" />
      </div>

      {/* 进化阶段 */}
      <div className="pt-3 border-t border-white/10">
        <div className="text-center">
          <span className="text-gray-500 text-xs">状态 </span>
          <span className="text-lg font-semibold" style={{ color: 'var(--heal-primary)' }}>
            {getEvolutionStageName(cat.evolutionStage)}
          </span>
        </div>
      </div>

      {/* 隐藏数值提示 */}
      <div className="flex justify-center gap-4 text-[10px] text-gray-600">
        <span>创伤 {cat.trauma}</span>
        <span>依赖 {cat.dependence}</span>
      </div>
    </div>
  );
}
