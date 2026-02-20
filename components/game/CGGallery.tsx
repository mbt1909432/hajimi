'use client';

import { memo, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSound } from '@/components/providers/SoundProvider';
import { CG_LIST, isCGUnlocked } from '@/lib/cg';

interface CGGalleryProps {
  onClose: () => void;
}

function CGGalleryComponent({ onClose }: CGGalleryProps) {
  const { cat, stats } = useGameStore();
  const { playClick } = useSound();

  const handleClose = () => {
    playClick();
    onClose();
  };

  const cgStatus = useMemo(() => {
    const state = {
      affection: cat.affection,
      corruption: cat.corruption,
      trauma: cat.trauma,
      evolutionStage: cat.evolutionStage,
      daysPassed: stats.daysPassed
    };

    return CG_LIST.map(cg => ({
      ...cg,
      unlocked: isCGUnlocked(cg.id, state)
    }));
  }, [cat, stats]);

  const unlockedCount = cgStatus.filter(cg => cg.unlocked).length;
  const totalCount = CG_LIST.length;

  const storyCGs = cgStatus.filter(cg => cg.category === 'story');
  const endingCGs = cgStatus.filter(cg => cg.category === 'ending');

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold" style={{ color: 'var(--heal-primary)' }}>
          CG画廊
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {unlockedCount} / {totalCount}
          </span>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 剧情CG */}
      <div>
        <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">剧情</h4>
        <div className="grid grid-cols-2 gap-3">
          {storyCGs.map(cg => (
            <CGCard key={cg.id} cg={cg} />
          ))}
        </div>
      </div>

      {/* 结局CG */}
      <div>
        <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">结局</h4>
        <div className="grid grid-cols-2 gap-3">
          {endingCGs.map(cg => (
            <CGCard key={cg.id} cg={cg} />
          ))}
        </div>
      </div>
    </div>
  );
}

// CG卡片组件
interface CGCardProps {
  cg: {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
  };
}

function CGCard({ cg }: CGCardProps) {
  return (
    <div
      className={`
        relative rounded-xl overflow-hidden
        border transition-all
        ${cg.unlocked
          ? 'border-[var(--heal-primary)]/30 bg-[var(--heal-primary)]/5'
          : 'border-white/10 bg-white/5 opacity-50'
        }
      `}
      style={{ aspectRatio: '4/3' }}
    >
      {cg.unlocked ? (
        <>
          {/* 已解锁 - 显示CG占位图 */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 160, 220, 0.2), rgba(107, 91, 149, 0.2))'
            }}
          >
            {/* 这里可以放实际的CG图片 */}
            <div className="text-center p-3">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-sm font-medium text-white">{cg.name}</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-xs text-gray-300 line-clamp-1">{cg.description}</p>
          </div>
        </>
      ) : (
        // 未解锁 - 显示锁定状态
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs text-gray-500">???</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CGGalleryComponent);
