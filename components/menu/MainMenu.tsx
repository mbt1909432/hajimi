'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

interface MainMenuProps {
  onSettings: () => void;
}

export default function MainMenu({ onSettings }: MainMenuProps) {
  const router = useRouter();
  const t = useTranslations();
  const { stats, isEnded } = useGameStore();

  const hasSaveGame = stats.daysPassed > 1 || stats.totalInteractions > 0;

  const handleNewGame = () => {
    router.push('/game');
  };

  const handleContinue = () => {
    router.push('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: 'var(--bg-primary)' }}>

      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(107,91,149,0.1)] to-transparent" />

      {/* 粒子背景层 - 使用CSS实现简化版 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
      </div>

      <div className="text-center animate-fade-in relative z-10">
        {/* 猫咪剪影 */}
        <div className="mb-8">
          <svg
            width="140"
            height="140"
            viewBox="0 0 200 200"
            className="mx-auto"
            style={{
              animation: 'breathe 4s ease-in-out infinite',
              filter: 'drop-shadow(0 0 20px rgba(201, 160, 220, 0.3))'
            }}
          >
            {/* 猫咪剪影 */}
            <ellipse cx="100" cy="130" rx="50" ry="40" fill="rgba(201, 160, 220, 0.15)" />
            <circle cx="100" cy="80" r="45" fill="rgba(201, 160, 220, 0.15)" />
            {/* 耳朵 */}
            <polygon points="60,50 75,15 90,50" fill="rgba(201, 160, 220, 0.2)" />
            <polygon points="110,50 125,15 140,50" fill="rgba(201, 160, 220, 0.2)" />
            {/* 眼睛 */}
            <ellipse cx="80" cy="75" rx="8" ry="6" fill="rgba(201, 160, 220, 0.4)" />
            <ellipse cx="120" cy="75" rx="8" ry="6" fill="rgba(201, 160, 220, 0.4)" />
          </svg>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight font-title"
            style={{
              background: 'linear-gradient(135deg, var(--heal-primary), var(--heal-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
          {t('game.title')}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--heal-primary)]" />
          <p className="text-gray-400 text-sm md:text-base tracking-widest">
            Cat&apos;s Whisper: Taming and Breaking
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--heal-primary)]" />
        </div>

        {/* 菜单按钮 */}
        <div className="space-y-4 max-w-xs mx-auto">
          <Button
            onClick={handleNewGame}
            variant="primary"
            size="lg"
            fullWidth
            className="bg-gradient-to-r from-[var(--heal-primary)] to-[var(--neutral-purple)] border-0 shadow-lg shadow-[var(--heal-glow)]"
          >
            {t('menu.newGame')}
          </Button>

          {hasSaveGame && !isEnded && (
            <Button
              onClick={handleContinue}
              variant="secondary"
              size="lg"
              fullWidth
              className="border-[var(--heal-primary)]/30 text-[var(--heal-primary)] hover:bg-[var(--heal-primary)]/10"
            >
              {t('menu.continue')} · 第{stats.daysPassed}天
            </Button>
          )}

          <Button
            onClick={onSettings}
            variant="ghost"
            size="lg"
            fullWidth
          >
            {t('menu.settings')}
          </Button>
        </div>

        {/* 版本信息 */}
        <div className="mt-16 text-gray-600 text-xs tracking-wider">
          v1.0.0
        </div>
      </div>

      {/* 粒子动画样式 */}
      <style jsx>{`
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--heal-primary);
          border-radius: 50%;
          opacity: 0.3;
          animation: float 15s infinite ease-in-out;
        }
        .particle-1 { left: 10%; top: 20%; animation-delay: 0s; }
        .particle-2 { left: 30%; top: 60%; animation-delay: 3s; }
        .particle-3 { left: 50%; top: 30%; animation-delay: 6s; }
        .particle-4 { left: 70%; top: 70%; animation-delay: 9s; }
        .particle-5 { left: 90%; top: 40%; animation-delay: 12s; }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
