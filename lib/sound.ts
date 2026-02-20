// 音效系统

// 音效类型
export type SoundType =
  | 'click'      // 点击
  | 'positive'   // 正面效果
  | 'negative'   // 负面效果
  | 'event'      // 事件触发
  | 'heal'       // 治愈互动
  | 'dark'       // 黑暗互动
  | 'advance'    // 时间推进
  | 'ending';    // 结局

// 音效配置
const SOUND_CONFIG: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; volume: number }> = {
  click: { frequency: 800, duration: 50, type: 'sine', volume: 0.1 },
  positive: { frequency: 523, duration: 150, type: 'sine', volume: 0.15 },
  negative: { frequency: 200, duration: 200, type: 'sawtooth', volume: 0.1 },
  event: { frequency: 440, duration: 300, type: 'triangle', volume: 0.12 },
  heal: { frequency: 659, duration: 200, type: 'sine', volume: 0.12 },
  dark: { frequency: 150, duration: 250, type: 'sawtooth', volume: 0.1 },
  advance: { frequency: 350, duration: 100, type: 'triangle', volume: 0.1 },
  ending: { frequency: 392, duration: 500, type: 'sine', volume: 0.15 }
};

// 音频上下文
let audioContext: AudioContext | null = null;

// 获取或创建音频上下文
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      return null;
    }
  }

  // 恢复暂停的上下文（需要用户交互后）
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

// 播放音效
export function playSound(type: SoundType): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const config = SOUND_CONFIG[type];

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

    // 音量包络
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(config.volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration / 1000);
  } catch (e) {
    // 静默失败
  }
}

// 播放互动音效（根据类别自动选择）
export function playInteractionSound(category: string): void {
  switch (category) {
    case 'care':
    case 'affection':
      playSound('heal');
      break;
    case 'discipline':
    case 'dark':
      playSound('dark');
      break;
    case 'special':
      playSound('event');
      break;
    default:
      playSound('click');
  }
}

// BGM 相关（使用简单的循环音调）
let bgmOscillator: OscillatorNode | null = null;
let bgmGain: GainNode | null = null;
let bgmVolume = 0.02; // 默认音量

// 开始BGM（简单的环境音）
export function startBGM(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // 如果已经在播放，先停止
  if (bgmOscillator) {
    try {
      bgmOscillator.stop();
    } catch {
      // ignore
    }
    bgmOscillator = null;
    bgmGain = null;
  }

  try {
    bgmOscillator = ctx.createOscillator();
    bgmGain = ctx.createGain();

    // 低频环境音
    bgmOscillator.type = 'sine';
    bgmOscillator.frequency.setValueAtTime(60, ctx.currentTime);

    bgmGain.gain.setValueAtTime(bgmVolume, ctx.currentTime);

    bgmOscillator.connect(bgmGain);
    bgmGain.connect(ctx.destination);

    bgmOscillator.start();
  } catch (e) {
    bgmOscillator = null;
    bgmGain = null;
  }
}

// 停止BGM
export function stopBGM(): void {
  if (bgmOscillator) {
    try {
      bgmOscillator.stop();
    } catch (e) {
      // 忽略
    }
    bgmOscillator = null;
    bgmGain = null;
  }
}

// 设置BGM音量
export function setBGMVolume(volume: number): void {
  if (bgmGain) {
    bgmGain.gain.setValueAtTime(volume * 0.05, getAudioContext()?.currentTime || 0);
  }
}
