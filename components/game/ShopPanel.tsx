'use client';

import { memo, useMemo, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSound } from '@/components/providers/SoundProvider';
import { items, shopInventory, getItemTypeName, isItemUnlocked } from '@/lib/items';
import type { Item } from '@/types/game';

interface ShopPanelProps {
  onClose: () => void;
}

function ShopPanelComponent({ onClose }: ShopPanelProps) {
  const { buyItem, coins, cat, stats } = useGameStore();
  const { playClick, playPositive, playNegative } = useSound();
  const [message, setMessage] = useState<string | null>(null);

  const handleBuy = (itemId: string) => {
    const result = buyItem(itemId);
    if (result.success) {
      playPositive();
    } else {
      playNegative();
    }
    setMessage(result.message || (result.success ? '购买成功！' : '购买失败'));
    setTimeout(() => setMessage(null), 2000);
  };

  const handleClose = () => {
    playClick();
    onClose();
  };

  const availableItems = useMemo(() => {
    return shopInventory
      .map(id => items[id])
      .filter(item => item && isItemUnlocked(item.id, { affection: cat.affection, daysPassed: stats.daysPassed }));
  }, [cat.affection, stats.daysPassed]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    availableItems.forEach(item => {
      const type = item.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });
    return groups;
  }, [availableItems]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold" style={{ color: 'var(--heal-primary)' }}>
          商店
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-medium">
            💰 {coins}
          </span>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
      </div>

      {message && (
        <div className="text-center py-2 px-4 rounded-lg bg-white/10 text-sm animate-fade-in">
          {message}
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {Object.entries(groupedItems).map(([type, itemsList]) => (
          <div key={type}>
            <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wider">
              {getItemTypeName(type as any)}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {itemsList.map(item => {
                const canAfford = coins >= item.price;
                const isDark = item.dark;

                return (
                  <div
                    key={item.id}
                    className={`
                      p-3 rounded-xl border transition-all
                      ${isDark ? 'border-red-500/30 bg-red-900/10' : 'border-white/10 bg-white/5'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-medium ${isDark ? 'text-red-300' : 'text-white'}`}>
                        {item.name}
                      </span>
                      <span className="text-yellow-400 text-sm">
                        💰 {item.price}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <button
                      onClick={() => handleBuy(item.id)}
                      disabled={!canAfford}
                      className={`
                        w-full py-1.5 rounded-lg text-sm font-medium transition-all
                        ${canAfford
                          ? 'bg-[var(--heal-primary)]/20 text-[var(--heal-primary)] hover:bg-[var(--heal-primary)]/30'
                          : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {canAfford ? '购买' : '金币不足'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-center text-xs text-gray-500">
        每天推进时间可获得金币
      </div>
    </div>
  );
}

export default memo(ShopPanelComponent);
