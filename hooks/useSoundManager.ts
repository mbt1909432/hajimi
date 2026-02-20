'use client';

import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import {
  playSound,
  SoundType,
  startBGM,
  stopBGM,
  setBGMVolume,
  getAudioContext
} from '@/lib/sound';

// 音效配置
interface SoundConfig {
  enabled: boolean;
  masterVolume: number;      // 0-1
  bgmVolume: number;         // 0-1
  sfxVolume: number;         // 0-1
}

// 默认配置
const DEFAULT_CONFIG: SoundConfig = {
  enabled: true,
  masterVolume: 0.7,
  bgmVolume: 0.3,
  sfxVolume: 1.0
};

// 从 localStorage 加载配置
function loadConfig(): SoundConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  try {
    const saved = localStorage.getItem('sound-config');
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONFIG;
}

// 保存配置到 localStorage
function saveConfig(config: SoundConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sound-config', JSON.stringify(config));
}

// 音效管理器 Hook
export function useSoundManager() {
  const [config, setConfig] = useState<SoundConfig>(loadConfig);
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const isInitialized = useRef(false);

  // 初始化（需要用户交互后才能播放）
  const initialize = useCallback(() => {
    if (isInitialized.current) return;

    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    isInitialized.current = true;
  }, []);

  // 播放音效（带音量控制）
  const play = useCallback((type: SoundType) => {
    if (!config.enabled) return;

    initialize();

    // 所有音效使用 sfxVolume
    if (config.sfxVolume * config.masterVolume > 0) {
      playSound(type);
    }
  }, [config, initialize]);

  // UI 交互音效快捷方法
  const playClick = useCallback(() => play('click'), [play]);
  const playPositive = useCallback(() => play('positive'), [play]);
  const playNegative = useCallback(() => play('negative'), [play]);
  const playEvent = useCallback(() => play('event'), [play]);

  // BGM 控制
  const playBGM = useCallback(() => {
    if (!config.enabled) return;
    initialize();
    startBGM();
    setBGMVolume(config.bgmVolume * config.masterVolume);
    setIsBGMPlaying(true);
  }, [config, initialize]);

  const stopBGMMusic = useCallback(() => {
    stopBGM();
    setIsBGMPlaying(false);
  }, []);

  const toggleBGM = useCallback(() => {
    if (isBGMPlaying) {
      stopBGMMusic();
    } else {
      playBGM();
    }
  }, [isBGMPlaying, playBGM, stopBGMMusic]);

  // 更新配置
  const updateConfig = useCallback((updates: Partial<SoundConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      saveConfig(newConfig);

      // 更新 BGM 音量
      if (updates.bgmVolume !== undefined || updates.masterVolume !== undefined) {
        setBGMVolume(newConfig.bgmVolume * newConfig.masterVolume);
      }

      return newConfig;
    });
  }, []);

  // 切换静音
  const toggleMute = useCallback(() => {
    updateConfig({ enabled: !config.enabled });
  }, [config.enabled, updateConfig]);

  // 监听配置变化
  useEffect(() => {
    if (!config.enabled && isBGMPlaying) {
      stopBGM();
      setIsBGMPlaying(false);
    }
  }, [config.enabled, isBGMPlaying]);

  // 稳定的 setter 函数
  const setMasterVolume = useCallback((v: number) => updateConfig({ masterVolume: v }), [updateConfig]);
  const setBGMVolumeCallback = useCallback((v: number) => updateConfig({ bgmVolume: v }), [updateConfig]);
  const setSFXVolume = useCallback((v: number) => updateConfig({ sfxVolume: v }), [updateConfig]);

  // 使用 useMemo 稳定返回对象
  return useMemo(() => ({
    // 状态
    config,
    isBGMPlaying,
    isEnabled: config.enabled,

    // 基础播放
    play,
    initialize,

    // UI 音效快捷方法
    playClick,
    playPositive,
    playNegative,
    playEvent,

    // BGM 控制
    playBGM,
    stopBGM: stopBGMMusic,
    toggleBGM,

    // 配置
    updateConfig,
    toggleMute,
    setMasterVolume,
    setBGMVolume: setBGMVolumeCallback,
    setSFXVolume,
  }), [
    config,
    isBGMPlaying,
    play,
    initialize,
    playClick,
    playPositive,
    playNegative,
    playEvent,
    playBGM,
    stopBGMMusic,
    toggleBGM,
    updateConfig,
    toggleMute,
    setMasterVolume,
    setBGMVolumeCallback,
    setSFXVolume,
  ]);
}

// 全局音效管理器实例
let globalSoundManager: ReturnType<typeof useSoundManager> | null = null;

// 获取全局音效管理器（用于非 React 环境）
export function getGlobalSoundManager() {
  return globalSoundManager;
}

// 设置全局音效管理器
export function setGlobalSoundManager(manager: ReturnType<typeof useSoundManager>) {
  globalSoundManager = manager;
}
