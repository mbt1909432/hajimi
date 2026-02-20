'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import MainMenu from '@/components/menu/MainMenu';
import Settings from '@/components/menu/Settings';
import { useSettingsStore } from '@/store/settingsStore';

export default function Home() {
  const t = useTranslations();
  const [showSettings, setShowSettings] = useState(false);
  const { language } = useSettingsStore();

  // 同步语言设置到 cookie
  useEffect(() => {
    document.cookie = `language=${language}; path=/; max-age=31536000`;
  }, [language]);

  return (
    <>
      <MainMenu onSettings={() => setShowSettings(true)} />
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
