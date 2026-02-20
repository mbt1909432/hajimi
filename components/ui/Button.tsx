'use client';

import { ReactNode, ButtonHTMLAttributes, useRef, useCallback } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 点击涟漪效果
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button || disabled || loading) return;

    // 创建涟漪元素
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // 调用原始 onClick
    onClick?.(e);
  }, [disabled, loading, onClick]);

  const baseStyles = `
    relative overflow-hidden
    rounded-xl font-medium
    inline-flex items-center justify-center
    transition-all duration-150 ease-out
    select-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[var(--heal-primary)] to-[var(--neutral-purple)]
      text-white
      shadow-md shadow-[var(--heal-glow)]
      hover:shadow-lg hover:shadow-[var(--heal-glow)] hover:brightness-110
      hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md active:brightness-95
      focus-visible:ring-[var(--heal-primary)]
    `,
    secondary: `
      bg-[var(--heal-primary)]/10
      text-[var(--heal-primary)]
      border-2 border-[var(--heal-primary)]/40
      hover:bg-[var(--heal-primary)]/20 hover:border-[var(--heal-primary)]/60
      hover:-translate-y-0.5
      active:translate-y-0 active:bg-[var(--heal-primary)]/15
      focus-visible:ring-[var(--heal-primary)]
    `,
    danger: `
      bg-gradient-to-r from-[var(--dark-primary)] to-[var(--dark-secondary)]
      text-white
      shadow-md shadow-[var(--dark-glow)]
      hover:shadow-lg hover:shadow-[var(--dark-glow)] hover:brightness-110
      hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md active:brightness-95
      focus-visible:ring-[var(--dark-action)]
    `,
    success: `
      bg-gradient-to-r from-emerald-600 to-emerald-700
      text-white
      shadow-md shadow-emerald-500/20
      hover:shadow-lg hover:shadow-emerald-500/30 hover:brightness-110
      hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md active:brightness-95
      focus-visible:ring-emerald-500
    `,
    ghost: `
      bg-transparent
      text-gray-300
      border border-gray-600/30
      hover:bg-white/10 hover:text-white hover:border-gray-500/50
      hover:-translate-y-0.5
      active:translate-y-0 active:bg-white/5
      focus-visible:ring-gray-500
    `
  };

  // Ensure minimum touch target size of 44px
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px] rounded-lg',
    md: 'px-5 py-2.5 text-base min-h-[44px]',
    lg: 'px-8 py-3 text-lg min-h-[52px]'
  };

  const disabledStyles = (disabled || loading)
    ? 'opacity-40 cursor-not-allowed pointer-events-none grayscale-[30%]'
    : 'cursor-pointer';

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={handleClick}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
