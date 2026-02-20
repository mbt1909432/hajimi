'use client';

import { memo, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSound } from '@/components/providers/SoundProvider';
import { getMoodName, getMoodColor } from '@/lib/diary';
import type { DiaryEntry } from '@/types/game';

interface DiaryPanelProps {
  onClose: () => void;
}

function DiaryPanelComponent({ onClose }: DiaryPanelProps) {
  const { diary, hasDiary } = useGameStore();
  const { playClick } = useSound();

  const handleClose = () => {
    playClick();
    onClose();
  };

  const sortedDiary = useMemo(() => {
    return [...diary].sort((a, b) => b.day - a.day);
  }, [diary]);

  const renderMoodIcon = (mood: DiaryEntry['mood']) => {
    const icons: Record<DiaryEntry['mood'], string> = {
      happy: '♪',
      sad: '...',
      scared: '!',
      neutral: '-',
      hopeful: '☆'
    };
    return icons[mood];
  };

  // 没有日记本时显示提示
  if (!hasDiary) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold" style={{ color: 'var(--heal-primary)' }}>
            日记
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📔</div>
          <p className="text-gray-400">她还没有日记本</p>
          <p className="text-gray-500 text-sm mt-2">去商店买一本送给她吧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold" style={{ color: 'var(--heal-primary)' }}>
          她的日记
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors p-2"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>

      {diary.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">还没有日记记录</p>
          <p className="text-gray-500 text-sm mt-2">过几天再来看看吧...</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {sortedDiary.map((entry, index) => (
            <div
              key={entry.day}
              className={`
                p-4 rounded-xl border transition-all
                ${entry.special
                  ? 'border-[var(--heal-primary)]/40 bg-[var(--heal-primary)]/5'
                  : 'border-white/10 bg-white/5'
                }
              `}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">{entry.date}</span>
                <span
                  className="text-sm font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: getMoodColor(entry.mood),
                    background: `${getMoodColor(entry.mood)}20`
                  }}
                >
                  {renderMoodIcon(entry.mood)} {getMoodName(entry.mood)}
                </span>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>
              {entry.special && (
                <div className="mt-2 pt-2 border-t border-[var(--heal-primary)]/20">
                  <span className="text-xs" style={{ color: 'var(--heal-primary)' }}>
                    ✦ 特别的一天
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(DiaryPanelComponent);
