'use client';

import { useState } from 'react';
import MainMenu from '@/components/menu/MainMenu';
import Settings from '@/components/menu/Settings';

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <MainMenu onSettings={() => setShowSettings(true)} />
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
