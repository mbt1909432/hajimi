'use client';

import { memo, useMemo } from 'react';
import type { CatState } from '@/types/game';
import { getCatAnimation, getCatMood } from '@/lib/gameLogic';

interface CatProps {
  state: CatState;
  size?: 'sm' | 'md' | 'lg';
}

// 提取静态尺寸配置
const SIZES = {
  sm: { width: 100, height: 100 },
  md: { width: 150, height: 150 },
  lg: { width: 200, height: 200 }
} as const;

// 提取静态颜色
const COLORS = {
  bodyHealthy: '#4a4a6a',
  bodySick: '#3a3a4a',
  bodyCorrupted: '#5a3a5a',
  eyeHappy: '#90EE90',
  eyeScared: '#FFD700',
  eyeNormal: '#87CEEB',
  eyeCorrupted: '#FF69B4',
  earInner: '#6a6a8a',
  eyePupil: '#111',
  whisker: '#888',
  nose: '#FFAACC',
  mouth: '#333',
  blush: '#FFB6C1'
} as const;

function CatComponent({ state, size = 'lg' }: CatProps) {
  const { width, height } = SIZES[size];

  const animation = useMemo(() => getCatAnimation(state), [state]);
  const mood = useMemo(() => getCatMood(state), [state]);

  // 计算视觉状态
  const visualState = useMemo(() => {
    // 根据堕落度调整颜色
    const bodyColor = state.corruption > 50
      ? COLORS.bodyCorrupted
      : state.health > 50
        ? COLORS.bodyHealthy
        : COLORS.bodySick;

    // 眼睛颜色根据状态变化
    let eyeColor: string = COLORS.eyeNormal;
    if (state.corruption > 60) eyeColor = COLORS.eyeCorrupted;
    else if (state.affection > 70) eyeColor = COLORS.eyeHappy;
    else if (state.trauma > 50) eyeColor = COLORS.eyeScared;

    const eyeBrightness = Math.max(0.3, state.sanity / 100);
    const earRotation = state.trauma > 50 ? -15 : state.affection > 60 ? 5 : 0;
    const tailPosition = state.corruption > 50 ? 30 : state.affection > 50 ? 10 : 0;
    const bodyOpacity = state.health < 30 ? 0.7 : 1;

    return { bodyColor, eyeColor, eyeBrightness, earRotation, tailPosition, bodyOpacity };
  }, [state]);

  const { bodyColor, eyeColor, eyeBrightness, earRotation, tailPosition, bodyOpacity } = visualState;

  return (
    <div className={`${animation} inline-block`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: bodyOpacity }}
        aria-label={`Cat with ${mood} mood`}
      >
        {/* 尾巴 */}
        <g transform={`rotate(${tailPosition}, 170, 140)`}>
          <path d="M150 140 Q180 120 175 80" stroke={bodyColor} strokeWidth="12" strokeLinecap="round" fill="none" />
        </g>

        {/* 身体 */}
        <ellipse cx="100" cy="130" rx="50" ry="40" fill={bodyColor} />

        {/* 前腿 */}
        <rect x="70" y="155" width="15" height="30" rx="5" fill={bodyColor} />
        <rect x="115" y="155" width="15" height="30" rx="5" fill={bodyColor} />

        {/* 头部 */}
        <circle cx="100" cy="80" r="45" fill={bodyColor} />

        {/* 耳朵 */}
        <g transform={`rotate(${earRotation}, 70, 50)`}>
          <polygon points="60,50 75,15 90,50" fill={bodyColor} />
          <polygon points="65,48 75,25 85,48" fill={COLORS.earInner} />
        </g>
        <g transform={`rotate(${-earRotation}, 130, 50)`}>
          <polygon points="110,50 125,15 140,50" fill={bodyColor} />
          <polygon points="115,48 125,25 135,48" fill={COLORS.earInner} />
        </g>

        {/* 表情 */}
        {mood === 'broken' ? (
          <g>
            <circle cx="80" cy="75" r="10" fill={eyeColor} style={{ opacity: 0.3 }} />
            <circle cx="120" cy="75" r="10" fill={eyeColor} style={{ opacity: 0.3 }} />
            <path d="M90 100 L100 98 L110 100" stroke={COLORS.mouth} strokeWidth="2" fill="none" />
          </g>
        ) : mood === 'corrupted' ? (
          <g>
            <ellipse cx="80" cy="75" rx="10" ry="12" fill={eyeColor} style={{ opacity: eyeBrightness }} />
            <ellipse cx="120" cy="75" rx="10" ry="12" fill={eyeColor} style={{ opacity: eyeBrightness }} />
            <ellipse cx="80" cy="77" rx="3" ry="8" fill="#111" />
            <ellipse cx="120" cy="77" rx="3" ry="8" fill="#111" />
            <path d="M85 100 Q100 115 115 100" stroke={COLORS.mouth} strokeWidth="2" fill="none" />
          </g>
        ) : mood === 'happy' ? (
          <g>
            <path d="M70 75 Q80 68 90 75" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" style={{ opacity: eyeBrightness }} />
            <path d="M110 75 Q120 68 130 75" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" style={{ opacity: eyeBrightness }} />
            <path d="M85 95 Q100 110 115 95" stroke={COLORS.mouth} strokeWidth="2" fill="none" />
            <circle cx="65" cy="90" r="8" fill={COLORS.blush} opacity="0.5" />
            <circle cx="135" cy="90" r="8" fill={COLORS.blush} opacity="0.5" />
          </g>
        ) : mood === 'traumatized' || mood === 'scared' ? (
          <g>
            <circle cx="80" cy="75" r="12" fill="white" />
            <circle cx="120" cy="75" r="12" fill="white" />
            <circle cx="80" cy="77" r="5" fill={eyeColor} style={{ opacity: eyeBrightness }} />
            <circle cx="120" cy="77" r="5" fill={eyeColor} style={{ opacity: eyeBrightness }} />
            <path d="M65 60 L90 65" stroke={COLORS.mouth} strokeWidth="3" strokeLinecap="round" />
            <path d="M135 60 L110 65" stroke={COLORS.mouth} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="100" cy="100" rx="6" ry="4" fill={COLORS.mouth} />
          </g>
        ) : (
          <g>
            <ellipse cx="80" cy="75" rx="10" ry="8" fill={eyeColor} style={{ opacity: eyeBrightness }} />
            <ellipse cx="120" cy="75" rx="10" ry="8" fill={eyeColor} style={{ opacity: eyeBrightness }} />
            <ellipse cx="80" cy="75" rx="4" ry="6" fill={COLORS.eyePupil} />
            <ellipse cx="120" cy="75" rx="4" ry="6" fill={COLORS.eyePupil} />
            <circle cx="82" cy="73" r="2" fill="white" />
            <circle cx="122" cy="73" r="2" fill="white" />
            <ellipse cx="100" cy="90" rx="5" ry="4" fill={COLORS.nose} />
            <path d="M90 98 L100 102 L110 98" stroke={COLORS.mouth} strokeWidth="2" fill="none" />
          </g>
        )}

        {/* 胡须 */}
        <line x1="50" y1="85" x2="70" y2="90" stroke={COLORS.whisker} strokeWidth="1" />
        <line x1="50" y1="95" x2="70" y2="95" stroke={COLORS.whisker} strokeWidth="1" />
        <line x1="130" y1="90" x2="150" y2="85" stroke={COLORS.whisker} strokeWidth="1" />
        <line x1="130" y1="95" x2="150" y2="95" stroke={COLORS.whisker} strokeWidth="1" />
      </svg>
    </div>
  );
}

export default memo(CatComponent);
