'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

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
  ...props
}: ButtonProps) {
  const baseStyles = 'btn-interact rounded-xl font-medium inline-flex items-center justify-center transition-all duration-200';

  const variants = {
    primary: 'bg-gradient-to-r from-[var(--heal-primary)] to-[var(--neutral-purple)] text-white border border-transparent hover:shadow-lg hover:shadow-[var(--heal-glow)]',
    secondary: 'bg-transparent text-[var(--heal-primary)] border border-[var(--heal-primary)]/30 hover:bg-[var(--heal-primary)]/10 hover:border-[var(--heal-primary)]/50',
    danger: 'bg-gradient-to-r from-[var(--dark-primary)] to-[var(--dark-secondary)] text-white border border-transparent hover:shadow-lg hover:shadow-[var(--dark-glow)]',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border border-transparent hover:shadow-lg hover:shadow-emerald-500/30',
    ghost: 'bg-transparent text-gray-300 border border-gray-600/30 hover:bg-white/5 hover:text-white hover:border-gray-500/50'
  };

  // Ensure minimum touch target size of 44px (ux-touch-target-size)
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px] rounded-lg',
    md: 'px-5 py-2.5 text-base min-h-[44px]', // 44px minimum
    lg: 'px-8 py-3 text-lg min-h-[52px]'
  };

  const disabledStyles = (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
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
