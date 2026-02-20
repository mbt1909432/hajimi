'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

interface WarningModalProps {
  isOpen: boolean;
}

export default function WarningModal({ isOpen }: WarningModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const { acceptWarning, resetGame } = useGameStore();

  const handleAccept = () => {
    resetGame();
    acceptWarning();
  };

  const handleDecline = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
         style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
      <div
        className="w-full max-w-md mx-4 rounded-2xl p-8 animate-fade-in"
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(139, 58, 58, 0.3)'
        }}
      >
        {/* 警告图标 */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(139, 58, 58, 0.2)' }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: 'var(--dark-action)' }}
            >
              <path
                d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold font-title" style={{ color: 'var(--dark-action)' }}>
            {t('game.warning.title')}
          </h2>
        </div>

        {/* 描述 */}
        <p className="text-gray-300 text-center leading-relaxed mb-8">
          {t('game.warning.description')}
        </p>

        {/* 按钮 */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAccept}
            variant="primary"
            size="lg"
            fullWidth
            className="bg-gradient-to-r from-[var(--heal-primary)] to-[var(--neutral-purple)]"
          >
            {t('game.warning.understand')}
          </Button>
          <Button
            onClick={handleDecline}
            variant="ghost"
            size="md"
            fullWidth
          >
            {t('game.warning.decline')}
          </Button>
        </div>
      </div>
    </div>
  );
}
