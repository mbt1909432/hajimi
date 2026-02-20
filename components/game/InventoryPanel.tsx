'use client';

import { memo, useMemo, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSound } from '@/components/providers/SoundProvider';
import { items, getItemTypeName } from '@/lib/items';
import type { InventoryItem } from '@/types/game';

interface InventoryPanelProps {
  onClose: () => void;
}

function InventoryPanelComponent({ onClose }: InventoryPanelProps) {
  const { inventory, useItem, cat } = useGameStore();
  const { playClick, playPositive, playNegative } = useSound();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleUseItem = (itemId: string) => {
    const result = useItem(itemId);
    if (result.success) {
      playPositive();
      setIsSuccess(true);
    } else {
      playNegative();
      setIsSuccess(false);
    }
    if (result.message) {
      setMessage(result.message);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleClose = () => {
    playClick();
    onClose();
  };

  const groupedInventory = useMemo(() => {
    const groups: Record<string, InventoryItem[]> = {};
    inventory.forEach(item => {
      const info = items[item.itemId];
      if (!info) return;
      const type = info.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });
    return groups;
  }, [inventory]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold" style={{ color: 'var(--heal-primary)' }}>
          背包
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors p-2"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>

      {inventory.length === 0 ? (
        <p className="text-gray-400 text-center py-8">背包是空的</p>
      ) : (
        <>
          {/* 使用反馈 Toast */}
          {message && (
            <div
              className={`
                mb-3 p-3 rounded-xl text-center text-sm animate-fade-in
                ${isSuccess ? 'bg-[var(--heal-primary)]/20 text-[var(--heal-primary)]' : 'bg-red-500/20 text-red-300'}
              `}
            >
              {message}
            </div>
          )}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedInventory).map(([type, itemsList]) => (
            <div key={type}>
              <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wider">
                {getItemTypeName(type as any)}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {itemsList.map(invItem => {
                  const item = items[invItem.itemId];
                  if (!item) return null;

                  const isDark = item.dark;

                  return (
                    <button
                      key={invItem.itemId}
                      onClick={() => handleUseItem(invItem.itemId)}
                      className={`
                        p-3 rounded-xl text-left transition-all duration-150
                        hover:-translate-y-0.5 active:translate-y-0
                        ${isDark ? 'border-red-500/30 bg-red-900/10' : 'border-white/10 bg-white/5'}
                        border
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-medium ${isDark ? 'text-red-300' : 'text-white'}`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded-full">
                          x{invItem.quantity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
}

export default memo(InventoryPanelComponent);
