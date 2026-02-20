'use client';

import { memo, useMemo } from 'react';
import type { CatState } from '@/types/game';
import { getCatAnimation, getCatMood } from '@/lib/gameLogic';

interface CharacterProps {
  state: CatState;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { width: 120, height: 180 },
  md: { width: 180, height: 270 },
  lg: { width: 240, height: 360 }
} as const;

const COLORS = {
  skinLight: '#FFE4D0',
  skinPale: '#F5D5C8',
  skinDark: '#E8C4B8',
  hairMain: '#8B7355',
  hairHighlight: '#A08060',
  eyeHappy: '#90EE90',
  eyeScared: '#FFD700',
  eyeNormal: '#87CEEB',
  eyeCorrupted: '#FF69B4',
  earOuter: '#D4A574',
  earInner: '#FFB6C1',
  blush: '#FFB6C1',
  lip: '#E8A0A0',
  dress: '#6b5b95',
  dressDark: '#4a3f6b'
} as const;

function CharacterComponent({ state, size = 'lg' }: CharacterProps) {
  const { width, height } = SIZES[size];

  const animation = useMemo(() => getCatAnimation(state), [state]);
  const mood = useMemo(() => getCatMood(state), [state]);

  const visualState = useMemo(() => {
    const skinColor = state.health > 50 ? COLORS.skinLight : COLORS.skinPale;
    const hairColor = state.corruption > 50
      ? '#5a3a5a'
      : state.affection > 60
        ? '#A08060'
        : COLORS.hairMain;

    let eyeColor: string = COLORS.eyeNormal;
    if (state.corruption > 60) eyeColor = COLORS.eyeCorrupted;
    else if (state.affection > 70) eyeColor = COLORS.eyeHappy;
    else if (state.trauma > 50) eyeColor = COLORS.eyeScared;

    const eyeBrightness = Math.max(0.3, state.sanity / 100);
    const bodyOpacity = state.health < 30 ? 0.8 : 1;
    const earFold = state.trauma > 50 ? 10 : 0;

    return { skinColor, hairColor, eyeColor, eyeBrightness, bodyOpacity, earFold };
  }, [state]);

  const { skinColor, hairColor, eyeColor, eyeBrightness, bodyOpacity, earFold } = visualState;

  // 瞳孔样式
  const renderEyes = () => {
    if (mood === 'broken') {
      return (
        <g>
          <ellipse cx="95" cy="115" rx="12" ry="10" fill={eyeColor} style={{ opacity: 0.3 }} />
          <ellipse cx="145" cy="115" rx="12" ry="10" fill={eyeColor} style={{ opacity: 0.3 }} />
          <circle cx="95" cy="115" r="2" fill="#333" />
          <circle cx="145" cy="115" r="2" fill="#333" />
        </g>
      );
    }

    if (mood === 'corrupted') {
      return (
        <g>
          <ellipse cx="95" cy="115" rx="14" ry="12" fill={eyeColor} style={{ opacity: eyeBrightness }} />
          <ellipse cx="145" cy="115" rx="14" ry="12" fill={eyeColor} style={{ opacity: eyeBrightness }} />
          <ellipse cx="95" cy="117" rx="4" ry="10" fill="#111" />
          <ellipse cx="145" cy="117" rx="4" ry="10" fill="#111" />
          <circle cx="98" cy="112" r="3" fill="white" opacity="0.6" />
          <circle cx="148" cy="112" r="3" fill="white" opacity="0.6" />
        </g>
      );
    }

    if (mood === 'happy') {
      return (
        <g>
          <path d="M83 115 Q95 105 107 115" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" style={{ opacity: eyeBrightness }} />
          <path d="M133 115 Q145 105 157 115" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" style={{ opacity: eyeBrightness }} />
          <circle cx="75" cy="125" r="10" fill={COLORS.blush} opacity="0.5" />
          <circle cx="165" cy="125" r="10" fill={COLORS.blush} opacity="0.5" />
        </g>
      );
    }

    if (mood === 'traumatized' || mood === 'scared') {
      return (
        <g>
          <ellipse cx="95" cy="115" rx="14" ry="16" fill="white" />
          <ellipse cx="145" cy="115" rx="14" ry="16" fill="white" />
          <circle cx="95" cy="118" r="6" fill={eyeColor} style={{ opacity: eyeBrightness }} />
          <circle cx="145" cy="118" r="6" fill={eyeColor} style={{ opacity: eyeBrightness }} />
          <circle cx="95" cy="118" r="3" fill="#111" />
          <circle cx="145" cy="118" r="3" fill="#111" />
          <path d="M78 100 L105 105" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <path d="M162 100 L135 105" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }

    return (
      <g>
        <ellipse cx="95" cy="115" rx="13" ry="10" fill="white" />
        <ellipse cx="145" cy="115" rx="13" ry="10" fill="white" />
        <ellipse cx="95" cy="115" rx="5" ry="8" fill={eyeColor} style={{ opacity: eyeBrightness }} />
        <ellipse cx="145" cy="115" rx="5" ry="8" fill={eyeColor} style={{ opacity: eyeBrightness }} />
        <circle cx="95" cy="115" r="4" fill="#111" />
        <circle cx="145" cy="115" r="4" fill="#111" />
        <circle cx="97" cy="112" r="2" fill="white" />
        <circle cx="147" cy="112" r="2" fill="white" />
      </g>
    );
  };

  // 嘴巴样式
  const renderMouth = () => {
    if (mood === 'happy') {
      return <path d="M110 140 Q120 150 130 140" stroke={COLORS.lip} strokeWidth="2" fill="none" />;
    }
    if (mood === 'broken') {
      return <path d="M110 142 L120 140 L130 142" stroke="#999" strokeWidth="2" fill="none" />;
    }
    if (mood === 'scared' || mood === 'traumatized') {
      return <ellipse cx="120" cy="145" rx="6" ry="8" fill="#333" />;
    }
    return <path d="M112 142 Q120 146 128 142" stroke={COLORS.lip} strokeWidth="2" fill="none" />;
  };

  return (
    <div className={`${animation} inline-block`} style={{ opacity: bodyOpacity }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 240 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Character with ${mood} mood`}
      >
        {/* 头发后层 */}
        <ellipse cx="120" cy="100" rx="75" ry="70" fill={hairColor} />
        <path d="M45 100 Q30 150 40 220 Q50 200 55 150 Q60 120 45 100" fill={hairColor} />
        <path d="M195 100 Q210 150 200 220 Q190 200 185 150 Q180 120 195 100" fill={hairColor} />

        {/* 耳朵 */}
        <g transform={`rotate(${earFold}, 70, 60)`}>
          <polygon points="55,60 70,15 90,55" fill={COLORS.earOuter} />
          <polygon points="60,55 70,25 82,52" fill={COLORS.earInner} />
        </g>
        <g transform={`rotate(${-earFold}, 170, 60)`}>
          <polygon points="150,55 170,15 185,60" fill={COLORS.earOuter} />
          <polygon points="158,52 170,25 180,55" fill={COLORS.earInner} />
        </g>

        {/* 脸部 */}
        <ellipse cx="120" cy="110" rx="55" ry="60" fill={skinColor} />

        {/* 脖子 */}
        <rect x="100" y="165" width="40" height="25" fill={skinColor} />

        {/* 头发前层 - 刘海 */}
        <path d="M65 70 Q80 30 120 35 Q160 30 175 70 Q165 55 140 60 Q120 45 100 60 Q75 55 65 70" fill={hairColor} />
        <path d="M70 75 Q85 55 95 80 Q90 65 70 75" fill={hairColor} />
        <path d="M170 75 Q155 55 145 80 Q150 65 170 75" fill={hairColor} />

        {/* 身体/衣服 */}
        <path d="M70 190 Q50 200 45 260 L85 260 L85 220 L120 210 L155 220 L155 260 L195 260 Q190 200 170 190 Q145 180 120 185 Q95 180 70 190" fill={COLORS.dress} />
        <path d="M70 190 Q80 200 85 220 L85 260 L70 260 Q65 220 70 190" fill={COLORS.dressDark} />
        <path d="M170 190 Q160 200 155 220 L155 260 L170 260 Q175 220 170 190" fill={COLORS.dressDark} />

        {/* 领口装饰 */}
        <path d="M85 190 Q120 200 155 190" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />

        {/* 眉毛 */}
        <path d="M80 100 Q95 95 105 100" stroke={hairColor} strokeWidth="2" fill="none" />
        <path d="M135 100 Q145 95 160 100" stroke={hairColor} strokeWidth="2" fill="none" />

        {/* 眼睛 */}
        {renderEyes()}

        {/* 鼻子 */}
        <ellipse cx="120" cy="130" rx="3" ry="2" fill="#E8B0B0" />

        {/* 嘴巴 */}
        {renderMouth()}

        {/* 腮红 (心情好时) */}
        {mood === 'happy' && (
          <>
            <circle cx="75" cy="125" r="8" fill={COLORS.blush} opacity="0.4" />
            <circle cx="165" cy="125" r="8" fill={COLORS.blush} opacity="0.4" />
          </>
        )}

        {/* 泪痕 (受伤时) */}
        {(mood === 'traumatized' || mood === 'scared') && (
          <>
            <path d="M82 120 Q78 135 82 145" stroke="rgba(100,150,255,0.5)" strokeWidth="2" fill="none" />
            <path d="M158 120 Q162 135 158 145" stroke="rgba(100,150,255,0.5)" strokeWidth="2" fill="none" />
          </>
        )}
      </svg>
    </div>
  );
}

export default memo(CharacterComponent);
