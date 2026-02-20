'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useSoundManager, setGlobalSoundManager } from '@/hooks/useSoundManager';

type SoundManager = ReturnType<typeof useSoundManager>;

const SoundContext = createContext<SoundManager | null>(null);

interface SoundProviderProps {
  children: ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  const soundManager = useSoundManager();
  const hasInitialized = useRef(false);

  // 设置全局实例 - 只运行一次
  useEffect(() => {
    setGlobalSoundManager(soundManager);
  }, [soundManager]);

  // 首次用户交互时初始化音频 - 只运行一次
  useEffect(() => {
    if (hasInitialized.current) return;

    const handleFirstInteraction = () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      soundManager.initialize();
      // 自动开始 BGM
      if (!soundManager.isBGMPlaying) {
        soundManager.playBGM();
      }

      // 移除所有监听器
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    // 监听首次交互
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [soundManager.initialize, soundManager.isBGMPlaying, soundManager.playBGM]);

  return (
    <SoundContext.Provider value={soundManager}>
      {children}
    </SoundContext.Provider>
  );
}

// Hook for accessing sound manager
export function useSound(): SoundManager {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

// Hook for components that only need click sound (most common case)
export function useClickSound() {
  const { playClick, config } = useSound();
  return config.enabled ? playClick : () => {};
}
