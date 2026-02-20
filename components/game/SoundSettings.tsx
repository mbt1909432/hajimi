'use client';

import { memo } from 'react';
import { useSound } from '@/components/providers/SoundProvider';

interface SoundSettingsProps {
  onClose: () => void;
}

function SoundSettingsComponent({ onClose }: SoundSettingsProps) {
  const {
    config,
    isBGMPlaying,
    toggleBGM,
    toggleMute,
    setMasterVolume,
    setBGMVolume,
    setSFXVolume,
    playClick
  } = useSound();

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold" style={{ color: 'var(--heal-primary)' }}>
          音效设置
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors p-2"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>

      {/* 总开关 */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">音效</span>
        <button
          onClick={() => {
            playClick();
            toggleMute();
          }}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            config.enabled ? 'bg-[var(--heal-primary)]' : 'bg-gray-600'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              config.enabled ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* BGM 开关 */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">背景音乐</span>
        <button
          onClick={() => {
            playClick();
            toggleBGM();
          }}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            isBGMPlaying ? 'bg-[var(--heal-primary)]' : 'bg-gray-600'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              isBGMPlaying ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* 主音量 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">主音量</span>
          <span className="text-gray-500 text-sm">{Math.round(config.masterVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--heal-primary) ${config.masterVolume * 100}%, #374151 ${config.masterVolume * 100}%)`
          }}
        />
      </div>

      {/* BGM 音量 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">音乐音量</span>
          <span className="text-gray-500 text-sm">{Math.round(config.bgmVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.bgmVolume}
          onChange={(e) => setBGMVolume(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--care) ${config.bgmVolume * 100}%, #374151 ${config.bgmVolume * 100}%)`
          }}
        />
      </div>

      {/* 音效音量 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">音效音量</span>
          <span className="text-gray-500 text-sm">{Math.round(config.sfxVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.sfxVolume}
          onChange={(e) => setSFXVolume(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--special) ${config.sfxVolume * 100}%, #374151 ${config.sfxVolume * 100}%)`
          }}
        />
      </div>

      {/* 测试音效 */}
      <div className="flex gap-2 justify-center pt-2">
        <button
          onClick={() => {
            const { play } = useSound();
            play('click');
          }}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ background: 'rgba(201, 160, 220, 0.2)', color: 'var(--heal-primary)' }}
        >
          测试点击
        </button>
        <button
          onClick={() => {
            const { play } = useSound();
            play('positive');
          }}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ background: 'rgba(99, 179, 237, 0.2)', color: 'var(--care)' }}
        >
          测试正面
        </button>
        <button
          onClick={() => {
            const { play } = useSound();
            play('dark');
          }}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--dark-action)' }}
        >
          测试黑暗
        </button>
      </div>
    </div>
  );
}

export default memo(SoundSettingsComponent);
