'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/store/settingsStore';
import { useGameStore } from '@/store/gameStore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const router = useRouter();
  const t = useTranslations();
  const { language, setLanguage, soundEnabled, toggleSound, musicEnabled, toggleMusic } = useSettingsStore();
  const { resetGame } = useGameStore();

  const handleLanguageChange = (newLang: 'en' | 'zh') => {
    if (newLang === language) return;

    // 设置 cookie
    document.cookie = `language=${newLang}; path=/; max-age=31536000`;

    // 更新 Zustand store
    setLanguage(newLang);

    // 刷新页面以应用新语言
    router.refresh();
  };

  const handleReset = () => {
    if (confirm(t('ui.resetConfirm'))) {
      resetGame();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settings.title')}>
      <div className="space-y-5">
        {/* 语言设置 */}
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-300">{t('settings.language')}</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange('zh')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: language === 'zh'
                  ? 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))'
                  : 'rgba(255, 255, 255, 0.05)',
                color: language === 'zh' ? 'white' : 'var(--heal-primary)',
                border: language === 'zh' ? 'none' : '1px solid rgba(201, 160, 220, 0.3)'
              }}
            >
              中文
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: language === 'en'
                  ? 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))'
                  : 'rgba(255, 255, 255, 0.05)',
                color: language === 'en' ? 'white' : 'var(--heal-primary)',
                border: language === 'en' ? 'none' : '1px solid rgba(201, 160, 220, 0.3)'
              }}
            >
              EN
            </button>
          </div>
        </div>

        {/* 音效设置 */}
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-300">{t('settings.soundEffects')}</span>
          <button
            onClick={toggleSound}
            className="w-12 h-7 rounded-full transition-all duration-200 relative"
            style={{
              background: soundEnabled
                ? 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))'
                : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              className="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-200 shadow-md"
              style={{ left: soundEnabled ? '26px' : '4px' }}
            />
          </button>
        </div>

        {/* 音乐设置 */}
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-300">{t('settings.music')}</span>
          <button
            onClick={toggleMusic}
            className="w-12 h-7 rounded-full transition-all duration-200 relative"
            style={{
              background: musicEnabled
                ? 'linear-gradient(135deg, var(--heal-primary), var(--neutral-purple))'
                : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              className="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-200 shadow-md"
              style={{ left: musicEnabled ? '26px' : '4px' }}
            />
          </button>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-white/10 pt-5">
          <Button
            onClick={handleReset}
            variant="danger"
            size="md"
            fullWidth
          >
            {t('ui.resetGame')}
          </Button>
        </div>

        {/* 返回按钮 */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="md"
          fullWidth
        >
          {t('settings.back')}
        </Button>
      </div>
    </Modal>
  );
}
