'use client';

import { useCallback, useRef } from 'react';
import type { GameEvent, EventChoice } from '@/types/game';
import Modal from '@/components/ui/Modal';

interface EventModalProps {
  event: GameEvent | null;
  onChoose: (choice: EventChoice) => void;
}

export default function EventModal({ event, onChoose }: EventModalProps) {
  if (!event) return null;

  return (
    <Modal isOpen={!!event} onClose={() => {}} title={event.title}>
      <div className="space-y-5">
        {/* 事件描述 */}
        <p className="text-gray-300 text-base leading-relaxed">
          {event.description}
        </p>

        {/* 对话 */}
        {event.dialogue && (
          <div
            className="pl-4 py-2 border-l-2 text-sm italic"
            style={{
              borderColor: 'var(--heal-primary)',
              color: 'var(--heal-secondary)'
            }}
          >
            &ldquo;{event.dialogue}&rdquo;
          </div>
        )}

        {/* 选择按钮 */}
        <div className="space-y-3 pt-2">
          {event.choices.map((choice, index) => (
            <EventChoiceButton
              key={choice.id}
              choice={choice}
              index={index}
              onChoose={onChoose}
            />
          ))}
        </div>

        {/* 效果提示 */}
        <div className="text-center pt-2">
          <span className="text-xs text-gray-500">
            你的选择将影响它的感受...
          </span>
        </div>
      </div>
    </Modal>
  );
}

// 选项按钮组件
interface EventChoiceButtonProps {
  choice: EventChoice;
  index: number;
  onChoose: (choice: EventChoice) => void;
}

function EventChoiceButton({ choice, index, onChoose }: EventChoiceButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 判断是否为黑暗选项
  const isDarkChoice = (choice.effect.trauma && choice.effect.trauma > 0) ||
                       (choice.effect.corruption && choice.effect.corruption > 10);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.5s ease-out;
      pointer-events: none;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);

    // 延迟执行，让涟漪动画先显示
    setTimeout(() => onChoose(choice), 150);
  }, [choice, onChoose]);

  const getButtonStyle = () => {
    if (isDarkChoice) {
      return {
        background: 'rgba(139, 58, 58, 0.15)',
        borderColor: 'rgba(252, 129, 129, 0.4)',
        color: 'var(--dark-action)',
        boxShadow: '0 2px 8px rgba(139, 58, 58, 0.2)'
      };
    }
    if (index === 0) {
      return {
        background: 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))',
        borderColor: 'transparent',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(201, 160, 220, 0.3)'
      };
    }
    return {
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(201, 160, 220, 0.2)',
      color: '#fff',
      boxShadow: 'none'
    };
  };

  const style = getButtonStyle();

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        w-full text-left px-5 py-4 rounded-xl
        transition-all duration-150 ease-out
        select-none
        hover:-translate-y-0.5 hover:shadow-lg
        active:translate-y-0
        focus:outline-none focus-visible:ring-2
        ${isDarkChoice ? 'hover:shadow-[var(--dark-glow)]' : 'hover:shadow-[var(--heal-glow)]'}
      `}
      style={{
        border: `1px solid ${style.borderColor}`,
        background: style.background,
        color: style.color,
        boxShadow: style.boxShadow
      }}
    >
      <span className="font-medium relative z-10">{choice.text}</span>

      {/* 黑暗选项警告标识 */}
      {isDarkChoice && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs opacity-60">
          ⚠️
        </span>
      )}
    </button>
  );
}
