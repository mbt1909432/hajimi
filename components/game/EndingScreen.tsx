'use client';

import type { EndingType } from '@/types/game';
import { getEnding, getEndingTypeName } from '@/lib/endings';
import Button from '@/components/ui/Button';

interface EndingScreenProps {
  ending: EndingType;
  onRestart: () => void;
  onMainMenu: () => void;
}

export default function EndingScreen({ ending, onRestart, onMainMenu }: EndingScreenProps) {
  const endingData = getEnding(ending);

  if (!endingData) return null;

  const getEndingClass = () => {
    switch (endingData.type) {
      case 'good':
        return 'ending-good';
      case 'bad':
        return 'ending-bad';
      case 'secret':
        return 'ending-secret';
      default:
        return 'ending-good';
    }
  };

  const getTypeColor = () => {
    switch (endingData.type) {
      case 'good':
        return 'text-[var(--heal-primary)]';
      case 'bad':
        return 'text-[var(--dark-action)]';
      case 'secret':
        return 'text-[var(--special)]';
      default:
        return 'text-[var(--heal-secondary)]';
    }
  };

  const getTypeLabel = () => {
    switch (endingData.type) {
      case 'good':
        return 'TRUE END';
      case 'bad':
        return 'BAD END';
      case 'secret':
        return 'SECRET END';
      default:
        return 'NORMAL END';
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${getEndingClass()}`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)'
      }}
    >
      {/* 粒子效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {endingData.type === 'good' && (
          <>
            <div className="ending-particle ep-1" />
            <div className="ending-particle ep-2" />
            <div className="ending-particle ep-3" />
          </>
        )}
        {endingData.type === 'secret' && (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(107, 91, 149, 0.1) 100%)'
          }} />
        )}
      </div>

      <div className="text-center px-8 max-w-2xl animate-fade-in relative z-10">
        {/* 结局类型标签 */}
        <div className={`text-xs md:text-sm uppercase tracking-[0.3em] mb-6 ${getTypeColor()}`}>
          {getTypeLabel()}
        </div>

        {/* 装饰线 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-current opacity-30" />
          <div className="w-2 h-2 rounded-full bg-current opacity-50" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-current opacity-30" />
        </div>

        {/* 结局标题 - Fluid typography */}
        <h1
          className="font-bold text-white mb-8 font-title"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)' }}
        >
          &ldquo;{endingData.title}&rdquo;
        </h1>

        {/* 结局描述 */}
        <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-12 whitespace-pre-line max-w-lg mx-auto">
          {endingData.description}
        </p>

        {/* 按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRestart}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-[var(--heal-primary)] to-[var(--neutral-purple)] border-0"
          >
            重新开始
          </Button>
          <Button
            onClick={onMainMenu}
            variant="ghost"
            size="lg"
          >
            返回主菜单
          </Button>
        </div>
      </div>

      {/* 结局粒子动画 */}
      <style jsx>{`
        .ending-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--heal-primary);
          border-radius: 50%;
          opacity: 0.4;
          animation: rise 8s infinite ease-out;
        }
        .ep-1 { left: 20%; bottom: 0; animation-delay: 0s; }
        .ep-2 { left: 50%; bottom: 0; animation-delay: 2s; }
        .ep-3 { left: 80%; bottom: 0; animation-delay: 4s; }

        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
