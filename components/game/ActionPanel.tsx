'use client';

import { memo, useMemo, useCallback } from 'react';
import type { InteractionType, InteractionCategory } from '@/types/game';
import {
  interactions,
  getInteractionsByCategory,
  getCategoryName,
  isInteractionAvailable
} from '@/lib/interactions';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

interface ActionPanelProps {
  onInteract: (type: InteractionType) => void;
  disabled?: boolean;
}

// 互动类别顺序
const CATEGORY_ORDER: InteractionCategory[] = ['care', 'affection', 'discipline', 'dark', 'special'];

// 类别配置
const CATEGORY_CONFIG: Record<InteractionCategory, { color: string; borderColor: string }> = {
  care: { color: 'var(--care)', borderColor: 'rgba(99, 179, 237, 0.3)' },
  affection: { color: 'var(--affection)', borderColor: 'rgba(246, 135, 179, 0.3)' },
  discipline: { color: 'var(--discipline)', borderColor: 'rgba(246, 224, 94, 0.3)' },
  dark: { color: 'var(--dark-action)', borderColor: 'rgba(252, 129, 129, 0.3)' },
  special: { color: 'var(--special)', borderColor: 'rgba(183, 148, 244, 0.3)' }
};

function ActionPanelComponent({ onInteract, disabled }: ActionPanelProps) {
  const { cat, stats, cooldowns } = useGameStore();

  const now = useMemo(() => Date.now(), [cooldowns]);

  const isOnCooldown = useCallback((type: InteractionType) => {
    return cooldowns[type] > now;
  }, [cooldowns, now]);

  const getRemainingCooldown = useCallback((type: InteractionType) => {
    const remaining = Math.max(0, cooldowns[type] - now);
    return Math.ceil(remaining / 1000);
  }, [cooldowns, now]);

  return (
    <div className="w-full space-y-4">
      {CATEGORY_ORDER.map(category => (
        <ActionCategory
          key={category}
          category={category}
          onInteract={onInteract}
          disabled={disabled}
          isOnCooldown={isOnCooldown}
          getRemainingCooldown={getRemainingCooldown}
          catState={cat}
          gameStats={stats}
        />
      ))}
    </div>
  );
}

interface ActionCategoryProps {
  category: InteractionCategory;
  onInteract: (type: InteractionType) => void;
  disabled?: boolean;
  isOnCooldown: (type: InteractionType) => boolean;
  getRemainingCooldown: (type: InteractionType) => number;
  catState: { affection: number; corruption: number; evolutionStage: string };
  gameStats: { daysPassed: number };
}

const ActionCategory = memo(function ActionCategory({
  category,
  onInteract,
  disabled,
  isOnCooldown,
  getRemainingCooldown,
  catState,
  gameStats
}: ActionCategoryProps) {
  const categoryInteractions = getInteractionsByCategory(category);
  const config = CATEGORY_CONFIG[category];

  // 过滤出可用的互动
  const availableInteractions = categoryInteractions.filter(interaction => {
    const availability = isInteractionAvailable(interaction.id, catState, gameStats);
    return availability.available;
  });

  // 如果没有可用互动，不显示该类别
  if (availableInteractions.length === 0) return null;

  const categoryName = getCategoryName(category);

  return (
    <div>
      {/* 类别标题 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-4 rounded-full" style={{ background: config.color }} />
        <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: config.color }}>
          {categoryName}
        </h3>
      </div>

      {/* 互动按钮网格 */}
      <div className="grid grid-cols-2 gap-2">
        {availableInteractions.map((interaction) => {
          const onCooldown = isOnCooldown(interaction.id);
          const remaining = getRemainingCooldown(interaction.id);

          return (
            <button
              key={interaction.id}
              onClick={() => onInteract(interaction.id)}
              disabled={disabled || onCooldown}
              className="action-card flex flex-col items-center justify-center py-3 px-2 min-h-[52px] transition-all duration-200"
              style={{
                borderColor: config.borderColor,
                background: category === 'dark'
                  ? 'rgba(139, 58, 58, 0.1)'
                  : 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <span className="font-medium text-sm text-white">
                {interaction.displayName}
              </span>
              {onCooldown && (
                <span className="text-[10px] text-gray-500 mt-1">
                  {remaining}s
                </span>
              )}
              {!onCooldown && interaction.description && (
                <span className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">
                  {interaction.description.slice(0, 10)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default memo(ActionPanelComponent);
