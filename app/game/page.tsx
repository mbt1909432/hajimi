'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameScreen from '@/components/game/GameScreen';
import WarningModal from '@/components/menu/WarningModal';
import { useGameStore } from '@/store/gameStore';

export default function GamePage() {
  const router = useRouter();
  const { hasAcceptedWarning } = useGameStore();

  // 如果未接受警告，显示警告弹窗
  if (!hasAcceptedWarning) {
    return <WarningModal isOpen={true} />;
  }

  return <GameScreen />;
}
