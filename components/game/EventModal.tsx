'use client';

import type { GameEvent, EventChoice } from '@/types/game';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

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
          {event.choices.map((choice, index) => {
            // 判断是否为黑暗选项（效果中有负面影响）
            const isDarkChoice = choice.effect.trauma && choice.effect.trauma > 0;

            return (
              <button
                key={choice.id}
                onClick={() => onChoose(choice)}
                className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 btn-interact"
                style={{
                  background: isDarkChoice
                    ? 'rgba(139, 58, 58, 0.15)'
                    : index === 0
                      ? 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))'
                      : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isDarkChoice
                    ? 'rgba(252, 129, 129, 0.3)'
                    : index === 0
                      ? 'transparent'
                      : 'rgba(201, 160, 220, 0.2)'}`,
                  color: isDarkChoice ? 'var(--dark-action)' : 'white'
                }}
              >
                <span className="font-medium">{choice.text}</span>
              </button>
            );
          })}
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
