'use client';

import { memo, useMemo, useCallback, useRef } from 'react';
import type { InteractionType, InteractionCategory } from '@/types/game';
import {
  getInteractionsByCategory,
  getCategoryName,
  isInteractionAvailable
} from '@/lib/interactions';
import { useGameStore } from '@/store/gameStore';

interface ActionPanelProps {
  onInteract: (type: InteractionType) => void;
  disabled?: boolean;
}

// 互动类别顺序
const CATEGORY_ORDER: InteractionCategory[] = ['care', 'affection', 'discipline', 'dark', 'special'];

// 类别配置
const CATEGORY_CONFIG: Record<InteractionCategory, { color: string; borderColor: string; bgColor: string }> = {
  care: { color: 'var(--care)', borderColor: 'rgba(99, 179, 237, 0.4)', bgColor: 'rgba(99, 179, 237, 0.1)' },
  affection: { color: 'var(--affection)', borderColor: 'rgba(246, 135, 179, 0.4)', bgColor: 'rgba(246, 135, 179, 0.1)' },
  discipline: { color: 'var(--discipline)', borderColor: 'rgba(246, 224, 94, 0.4)', bgColor: 'rgba(246, 224, 94, 0.1)' },
  dark: { color: 'var(--dark-action)', borderColor: 'rgba(252, 129, 129, 0.4)', bgColor: 'rgba(139, 58, 58, 0.15)' },
  special: { color: 'var(--special)', borderColor: 'rgba(183, 148, 244, 0.4)', bgColor: 'rgba(183, 148, 244, 0.1)' }
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
        <div className="w-1.5 h-4 rounded-full" style={{ background: config.color }} />
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.color }}>
          {categoryName}
        </h3>
      </div>

      {/* 互动按钮网格 */}
      <div className="grid grid-cols-2 gap-2">
        {availableInteractions.map((interaction) => {
          const onCooldown = isOnCooldown(interaction.id);
          const remaining = getRemainingCooldown(interaction.id);
          const isDisabled = disabled || onCooldown;

          return (
            <ActionButton
              key={interaction.id}
              interaction={interaction}
              category={category}
              config={config}
              onCooldown={onCooldown}
              remaining={remaining}
              disabled={isDisabled}
              onClick={() => onInteract(interaction.id)}
            />
          );
        })}
      </div>
    </div>
  );
});

// 独立的按钮组件，带有涟漪效果
interface ActionButtonProps {
  interaction: { id: InteractionType; displayName: string; description: string };
  category: InteractionCategory;
  config: { color: string; borderColor: string; bgColor: string };
  onCooldown: boolean;
  remaining: number;
  disabled: boolean;
  onClick: () => void;
}

const ActionButton = memo(function ActionButton({
  interaction,
  category,
  config,
  onCooldown,
  remaining,
  disabled,
  onClick
}: ActionButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    // 涟漪效果
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: ${category === 'dark' ? 'rgba(252, 129, 129, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.5s ease-out;
      pointer-events: none;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);

    onClick();
  }, [disabled, onClick, category]);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`${interaction.displayName}${onCooldown ? ` 冷却中 ${remaining}秒` : ''}`}
      className={`
        relative overflow-hidden
        flex flex-col items-center justify-center
        py-3 px-2 min-h-[52px] min-w-[44px]
        rounded-xl
        transition-all duration-150 ease-out
        select-none
        touch-manipulation
        ${disabled
          ? 'opacity-40 cursor-not-allowed grayscale-[30%]'
          : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
        }
      `}
      style={{
        borderColor: config.borderColor,
        background: config.bgColor,
        borderWidth: '1px',
        boxShadow: disabled ? 'none' : `0 2px 8px ${config.bgColor}`
      }}
    >
      <span
        className="font-medium text-sm"
        style={{ color: disabled ? '#666' : '#fff' }}
      >
        {interaction.displayName}
      </span>
      {onCooldown && (
        <span className="text-[10px] text-gray-500 mt-1">
          {remaining}s
        </span>
      )}
      {!onCooldown && interaction.description && (
        <span className="text-[10px] text-gray-500 mt-0.5 truncate w-full text-center px-1">
          {interaction.description.slice(0, 12)}
        </span>
      )}
    </button>
  );
});

export default memo(ActionPanelComponent);
