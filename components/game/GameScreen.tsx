'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { useGameStore } from '@/store/gameStore';
import { useSound } from '@/components/providers/SoundProvider';
import Character from './Character';
import StatusBar from './StatusBar';
import ActionPanel from './ActionPanel';
import Modal from '@/components/ui/Modal';
import InventoryPanel from './InventoryPanel';
import DiaryPanel from './DiaryPanel';
import ShopPanel from './ShopPanel';
import CGGallery from './CGGallery';
import SoundSettings from './SoundSettings';
import { playInteractionSound } from '@/lib/sound';
import { CHARACTER_NAME } from '@/lib/gameLogic';
import { checkEndingOmen, MAX_GAME_DAYS } from '@/lib/endings';
import type { InteractionType, EventChoice } from '@/types/game';

const EventModal = dynamic(() => import('./EventModal'), { ssr: false });
const EndingScreen = dynamic(() => import('./EndingScreen'), { ssr: false });

type MenuPanel = 'none' | 'inventory' | 'diary' | 'shop' | 'gallery' | 'sound';

export default function GameScreen() {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [activePanel, setActivePanel] = useState<MenuPanel>('none');
  const { playClick, playEvent, playPositive, isBGMPlaying, playBGM, stopBGM } = useSound();

  const {
    cat,
    time,
    stats,
    coins,
    diary,
    hasDiary,
    currentEvent,
    isEnded,
    ending,
    interact,
    resolveEvent,
    advanceTime,
    addCoins,
    addDiaryEntry,
    resetGame,
    acceptWarning
  } = useGameStore();

  // 启动BGM
  useEffect(() => {
    if (!isBGMPlaying) {
      playBGM();
    }
    return () => stopBGM();
  }, [isBGMPlaying, playBGM, stopBGM]);

  // 结局预兆
  const endingOmen = useMemo(() => {
    return checkEndingOmen(cat, stats);
  }, [cat, stats]);

  const handleInteract = useCallback((type: InteractionType) => {
    const result = interact(type);
    if (result.success) {
      // 播放互动音效
      const { interactions } = require('@/lib/interactions');
      const interaction = interactions[type];
      if (interaction) {
        playInteractionSound(interaction.category);
      }
      setShowActions(false);
    }
  }, [interact]);

  const handleEventChoice = useCallback((choice: EventChoice) => {
    resolveEvent(choice);
    playEvent();
  }, [resolveEvent, playEvent]);

  const handleAdvanceTime = useCallback(() => {
    playClick();

    advanceTime();

    // 每天获得金币
    addCoins(20);

    // 每天记录日记（如果有日记本）
    if (hasDiary) {
      addDiaryEntry();
    }
  }, [advanceTime, addCoins, addDiaryEntry, hasDiary]);

  const handleRestart = useCallback(() => {
    resetGame();
    acceptWarning();
  }, [resetGame, acceptWarning]);

  const handleMainMenu = useCallback(() => {
    resetGame();
    router.push('/');
  }, [resetGame, router]);

  const closePanel = useCallback(() => {
    setActivePanel('none');
    playClick();
  }, [playClick]);

  const openPanel = useCallback((panel: MenuPanel) => {
    setActivePanel(panel);
    playClick();
  }, [playClick]);

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
        <Character state={cat} size="lg" />
      </div>

      {/* 状态面板 - 左上角 (Desktop) */}
      <div className="hidden md:block">
        <div className="status-panel" style={{ position: 'absolute', top: '20px', left: '20px', width: '220px' }}>
          <StatusBar cat={cat} time={time} compact />
          {/* 金币显示 */}
          <div className="mt-3 text-center text-sm">
            <span className="text-yellow-400">💰 {coins}</span>
          </div>
        </div>
      </div>

      {/* 右上角菜单按钮 - Desktop */}
      <div className="hidden md:flex gap-2" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 'var(--z-dialog)' }}>
        <button
          onClick={() => openPanel('shop')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{
            background: 'rgba(255, 200, 0, 0.1)',
            border: '1px solid rgba(255, 200, 0, 0.3)',
            color: '#FFD700'
          }}
        >
          商店
        </button>
        <button
          onClick={() => openPanel('inventory')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{
            background: 'rgba(201, 160, 220, 0.1)',
            border: '1px solid rgba(201, 160, 220, 0.3)',
            color: 'var(--heal-primary)'
          }}
        >
          背包
        </button>
        <button
          onClick={() => openPanel('diary')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{
            background: 'rgba(99, 179, 237, 0.1)',
            border: '1px solid rgba(99, 179, 237, 0.3)',
            color: 'var(--care)'
          }}
        >
          日记
        </button>
        <button
          onClick={() => openPanel('gallery')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{
            background: 'rgba(183, 148, 244, 0.1)',
            border: '1px solid rgba(183, 148, 244, 0.3)',
            color: 'var(--special)'
          }}
        >
          画廊
        </button>
        <button
          onClick={() => openPanel('sound')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{
            background: 'rgba(156, 163, 175, 0.1)',
            border: '1px solid rgba(156, 163, 175, 0.3)',
            color: '#9CA3AF'
          }}
          aria-label="音效设置"
        >
          🔊
        </button>
      </div>

      {/* 时间推进按钮 */}
      <button
        onClick={handleAdvanceTime}
        disabled={!!currentEvent}
        aria-label={time.actionsRemaining > 0 ? `推进时间，剩余${time.actionsRemaining}次行动` : '时间已耗尽'}
        className="advance-button btn-ux"
        style={{
          position: 'absolute',
          bottom: '220px',
          right: '20px',
          padding: '12px 24px',
          minHeight: '44px',
          background: 'linear-gradient(135deg, var(--neutral-purple), var(--bg-secondary))',
          border: '1px solid rgba(201, 160, 220, 0.3)',
          borderRadius: '24px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
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
        maxHeight: '50vh',
        background: 'linear-gradient(180deg, rgba(10, 10, 18, 0.95) 0%, rgba(18, 18, 31, 0.98) 100%)',
        borderTop: '2px solid rgba(201, 160, 220, 0.2)',
        padding: '20px 24px',
        overflowY: 'auto',
        overscrollBehavior: 'contain'
      }}>
        {/* 状态栏 - 移动端 */}
        <div className="md:hidden mb-4">
          <StatusBar cat={cat} time={time} compact />
          {/* 金币显示 - 移动端 */}
          <div className="mt-2 text-center">
            <span className="text-yellow-400 text-sm">💰 {coins}</span>
          </div>
        </div>

        {/* 对话/状态文字 */}
        <div className="mb-4">
          <p className="text-gray-400 text-xs mb-2 tracking-wider">
            第 {time.day} 天 / {MAX_GAME_DAYS} 天 · {getTimeText(time.timeOfDay)}
          </p>
          <p className="text-sm text-[var(--heal-primary)] mb-1">{CHARACTER_NAME}</p>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            {cat.isSleeping
              ? '她正在安静地睡着...'
              : getCharacterStatusText(cat, stats)}
          </p>

          {/* 结局预兆提示 */}
          {endingOmen && (
            <div
              className={`
                mt-3 p-3 rounded-xl text-sm animate-fade-in
                ${endingOmen.urgency === 'high'
                  ? 'bg-amber-500/20 border border-amber-500/30'
                  : 'bg-white/5 border border-white/10'
                }
              `}
            >
              <p className={`font-medium mb-1 ${endingOmen.urgency === 'high' ? 'text-amber-300' : 'text-gray-400'}`}>
                {endingOmen.title}
              </p>
              <p className="text-gray-400 text-xs">
                {endingOmen.message}
              </p>
            </div>
          )}
        </div>

        {/* 互动按钮区域 */}
        <div className="flex flex-wrap gap-3">
          {/* 移动端菜单按钮 */}
          <div className="flex md:hidden gap-2 mr-auto">
            <button
              onClick={() => setActivePanel('shop')}
              className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(255, 200, 0, 0.1)', color: '#FFD700' }}
            >
              商店
            </button>
            <button
              onClick={() => openPanel('inventory')}
              className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(201, 160, 220, 0.1)', color: 'var(--heal-primary)' }}
            >
              背包
            </button>
            <button
              onClick={() => openPanel('diary')}
              className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(99, 179, 237, 0.1)', color: 'var(--care)' }}
            >
              日记
            </button>
            <button
              onClick={() => openPanel('gallery')}
              className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(183, 148, 244, 0.1)', color: 'var(--special)' }}
            >
              画廊
            </button>
            <button
              onClick={() => openPanel('sound')}
              className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(156, 163, 175, 0.1)', color: '#9CA3AF' }}
              aria-label="音效设置"
            >
              🔊
            </button>
          </div>

          <button
            onClick={() => {
              setShowActions(!showActions);
              playClick();
            }}
            aria-expanded={showActions}
            aria-controls="action-panel"
            className="btn-ux px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heal-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
            style={{
              background: showActions
                ? 'linear-gradient(135deg, var(--neutral-purple), var(--bg-secondary))'
                : 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))',
              border: '1px solid rgba(201, 160, 220, 0.3)',
              cursor: 'pointer'
            }}
          >
            {showActions ? '收起' : '互动'}
          </button>

          {showActions && (
            <div id="action-panel" className="w-full mt-4 animate-fade-in" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
              {time.actionsRemaining <= 0 ? (
                <div className="text-center py-4 text-gray-400">
                  <p>当前时间段行动次数已用完</p>
                  <p className="text-sm mt-1">点击「推进时间」进入下一个时段</p>
                </div>
              ) : (
                <ActionPanel
                  onInteract={handleInteract}
                  disabled={!!currentEvent || cat.isSleeping}
                />
              )}
            </div>
          )}
        </div>

        {/* 统计 - 简化版 */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-center gap-6 text-xs">
          <span style={{ color: 'var(--care)' }}>照顾 {stats.careInteractions}</span>
          <span style={{ color: 'var(--affection)' }}>亲密 {stats.affectionInteractions}</span>
          <span style={{ color: 'var(--discipline)' }}>管教 {stats.disciplineInteractions}</span>
          <span style={{ color: 'var(--dark-action)' }}>黑暗 {stats.darkInteractions}</span>
        </div>
      </div>

      <EventModal event={currentEvent} onChoose={handleEventChoice} />

      {/* 面板弹窗 */}
      <Modal isOpen={activePanel === 'inventory'} onClose={closePanel} title="">
        <InventoryPanel onClose={closePanel} />
      </Modal>
      <Modal isOpen={activePanel === 'diary'} onClose={closePanel} title="">
        <DiaryPanel onClose={closePanel} />
      </Modal>
      <Modal isOpen={activePanel === 'shop'} onClose={closePanel} title="">
        <ShopPanel onClose={closePanel} />
      </Modal>
      <Modal isOpen={activePanel === 'gallery'} onClose={closePanel} title="">
        <CGGallery onClose={closePanel} />
      </Modal>
      <Modal isOpen={activePanel === 'sound'} onClose={closePanel} title="">
        <SoundSettings onClose={closePanel} />
      </Modal>
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

function getCharacterStatusText(cat: any, stats: any): string {
  if (cat.evolutionStage === 'traumatized') {
    return '她蜷缩在角落，身体微微颤抖...';
  }
  if (cat.evolutionStage === 'broken') {
    return '她呆呆地望着虚空，没有任何反应...';
  }
  if (cat.evolutionStage === 'devoted') {
    return '她用充满信任的眼神看着你，轻轻依偎着你...';
  }
  if (cat.evolutionStage === 'attached') {
    return '她紧紧跟在你身边，不愿离开...';
  }
  if (cat.evolutionStage === 'rebellious') {
    return '她的眼神中带着一丝不甘和愤怒...';
  }
  if (cat.affection > 50) {
    return '她看起来放松了一些，偶尔会看你一眼。';
  }
  return '她警惕地观察着周围的一切...';
}
