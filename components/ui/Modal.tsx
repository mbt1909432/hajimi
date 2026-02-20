'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';

      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 模态框内容 */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md mx-4 rounded-2xl p-6 animate-fade-in shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heal-primary)]"
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(201, 160, 220, 0.2)'
        }}
      >
        {title && (
          <h2
            id="modal-title"
            className="text-xl font-bold mb-4 font-title"
            style={{ color: 'var(--heal-primary)' }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
