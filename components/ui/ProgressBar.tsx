'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'heal' | 'dark' | 'health' | 'sanity';
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  colorClass,
  size = 'md',
  variant
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  // 根据variant选择颜色
  const getVariantColor = () => {
    switch (variant) {
      case 'heal':
        return 'bar-heal';
      case 'dark':
        return 'bar-dark';
      case 'health':
        return 'bar-health';
      case 'sanity':
        return 'bar-sanity';
      default:
        return null;
    }
  };

  // 根据数值自动决定颜色（仅当没有variant时）
  const getAutoColor = () => {
    if (percentage >= 70) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    if (percentage >= 40) return 'bg-gradient-to-r from-amber-500 to-amber-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  const barColor = getVariantColor() || colorClass || getAutoColor();

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-gray-400">{label}</span>}
          {showValue && <span className="text-xs text-gray-500">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/5 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`progress-bar ${sizes[size]} rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
