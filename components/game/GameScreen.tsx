'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { useGameStore } from '@/store/gameStore';
import Cat from './Cat';
import StatusBar from './StatusBar';
import ActionPanel from './ActionPanel';
import type { InteractionType, EventChoice } from '@/types/game';

const EventModal = dynamic(() => import('./EventModal'), { ssr: false });
const EndingScreen = dynamic(() => import('./EndingScreen'), { ssr: false });

export default function GameScreen() {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const {
    cat,
    time,
    stats,
    currentEvent,
    isEnded,
    ending,
    interact,
    resolveEvent,
    advanceTime,
    resetGame,
    acceptWarning
  } = useGameStore();

  const handleInteract = useCallback((type: InteractionType) => {
    const result = interact(type);
    if (result.success) {
      setShowActions(false);
    }
  }, [interact]);

  const handleEventChoice = useCallback((choice: EventChoice) => {
    resolveEvent(choice);
  }, [resolveEvent]);

  const handleAdvanceTime = useCallback(() => {
    advanceTime();
  }, [advanceTime]);

  const handleRestart = useCallback(() => {
    resetGame();
    acceptWarning();
  }, [resetGame, acceptWarning]);

  const handleMainMenu = useCallback(() => {
    resetGame();
    router.push('/');
  }, [resetGame, router]);

  if (isEnded && ending) {
    return (
      <EndingScreen
        ending={ending}
        onRestart={handleRestart}
        onMainMenu={handleMainMenu}
      />
    );
  }

  return (
    <div className="vn-container" style={{ background: 'var(--bg-primary)' }}>
      {/* 角色区域 */}
      <div className="character-area">
        <Cat state={cat} size="lg" />
      </div>

      {/* 状态面板 - 左上角 (Desktop) */}
      <div className="hidden md:block">
        <div className="status-panel" style={{ position: 'absolute', top: '20px', left: '20px', width: '220px' }}>
          <StatusBar cat={cat} time={time} compact />
        </div>
      </div>

      {/* 时间推进按钮 */}
      <button
        onClick={handleAdvanceTime}
        disabled={!!currentEvent}
        className="advance-button"
        style={{
          position: 'absolute',
          bottom: '220px',
          right: '20px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, var(--neutral-purple), var(--bg-secondary))',
          border: '1px solid rgba(201, 160, 220, 0.3)',
          borderRadius: '24px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 'var(--z-dialog)'
        }}
      >
        {time.actionsRemaining > 0 ? `推进时间 · ${time.actionsRemaining}` : '时间耗尽'}
      </button>

      {/* 底部对话框区域 */}
      <div className="dialog-box" style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        minHeight: '200px',
        background: 'linear-gradient(180deg, rgba(10, 10, 18, 0.95) 0%, rgba(18, 18, 31, 0.98) 100%)',
        borderTop: '2px solid rgba(201, 160, 220, 0.2)',
        padding: '20px 24px'
      }}>
        {/* 状态栏 - 移动端 */}
        <div className="md:hidden mb-4">
          <StatusBar cat={cat} time={time} compact />
        </div>

        {/* 对话/状态文字 */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs mb-2 tracking-wider">
            第 {time.day} 天 · {getTimeText(time.timeOfDay)}
          </p>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            {cat.isSleeping
              ? '它正在安静地睡着...'
              : getCatStatusText(cat, stats)}
          </p>
        </div>

        {/* 互动按钮区域 */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowActions(!showActions)}
            className="btn-interact px-6 py-3 rounded-xl text-white font-medium"
            style={{
              background: showActions
                ? 'linear-gradient(135deg, var(--neutral-purple), var(--bg-secondary))'
                : 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))',
              border: '1px solid rgba(201, 160, 220, 0.3)'
            }}
          >
            {showActions ? '收起' : '互动'}
          </button>

          {showActions && (
            <div className="w-full mt-4 animate-fade-in">
              <ActionPanel
                onInteract={handleInteract}
                disabled={!!currentEvent || cat.isSleeping}
              />
            </div>
          )}
        </div>

        {/* 统计 - 简化版 */}
        <div className="mt-4 pt-3 border-t border-white/5 flex justify-center gap-6 text-xs">
          <span style={{ color: 'var(--care)' }}>照顾 {stats.careInteractions}</span>
          <span style={{ color: 'var(--affection)' }}>亲密 {stats.affectionInteractions}</span>
          <span style={{ color: 'var(--discipline)' }}>管教 {stats.disciplineInteractions}</span>
          <span style={{ color: 'var(--dark-action)' }}>黑暗 {stats.darkInteractions}</span>
        </div>
      </div>

      <EventModal event={currentEvent} onChoose={handleEventChoice} />
    </div>
  );
}

function getTimeText(timeOfDay: string): string {
  const texts: Record<string, string> = {
    morning: '早晨',
    afternoon: '午后',
    evening: '傍晚',
    night: '深夜'
  };
  return texts[timeOfDay] || '';
}

function getCatStatusText(cat: any, stats: any): string {
  if (cat.evolutionStage === 'traumatized') {
    return '它蜷缩在角落，身体微微颤抖...';
  }
  if (cat.evolutionStage === 'broken') {
    return '它呆呆地望着虚空，没有任何反应...';
  }
  if (cat.evolutionStage === 'devoted') {
    return '它用充满信任的眼神看着你，轻轻蹭着你的手...';
  }
  if (cat.evolutionStage === 'attached') {
    return '它紧紧跟在你身边，不愿离开...';
  }
  if (cat.evolutionStage === 'rebellious') {
    return '它的眼神中带着一丝不甘和愤怒...';
  }
  if (cat.affection > 50) {
    return '它看起来放松了一些，偶尔会看你一眼。';
  }
  return '它警惕地观察着周围的一切...';
}
