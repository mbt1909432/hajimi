import type { Item, ItemType, InventoryItem } from '@/types/game';

// 物品定义
export const items: Record<string, Item> = {
  // ============ 食物类 ============
  bread: {
    id: 'bread',
    name: '面包',
    description: '普通的面包，能填饱肚子',
    type: 'food',
    effect: { health: 5, affection: 2 },
    price: 10,
    stackable: true
  },
  cake: {
    id: 'cake',
    name: '蛋糕',
    description: '甜美的蛋糕，会让她开心',
    type: 'food',
    effect: { health: 5, affection: 10, trauma: -3 },
    price: 30,
    stackable: true
  },
  medicine: {
    id: 'medicine',
    name: '药物',
    description: '治疗疾病的药物',
    type: 'medicine',
    effect: { health: 20, sanity: 3 },
    price: 50,
    stackable: true
  },
  special_meal: {
    id: 'special_meal',
    name: '特制料理',
    description: '精心准备的料理，饱含心意',
    type: 'food',
    effect: { health: 15, affection: 15, trauma: -5 },
    price: 80,
    stackable: true
  },
  warm_milk: {
    id: 'warm_milk',
    name: '热牛奶',
    description: '温暖的热牛奶，有助于睡眠',
    type: 'food',
    effect: { sanity: 5, trauma: -3 },
    price: 15,
    stackable: true
  },

  // ============ 玩具类 ============
  plush_toy: {
    id: 'plush_toy',
    name: '毛绒玩具',
    description: '柔软的毛绒玩具，可以陪伴她',
    type: 'toy',
    effect: { affection: 8, trauma: -5, sanity: 5 },
    price: 40,
    stackable: false,
    permanent: true
  },
  ball: {
    id: 'ball',
    name: '小球',
    description: '可以一起玩耍的小球',
    type: 'toy',
    effect: { affection: 5, trauma: -3 },
    price: 20,
    stackable: false,
    permanent: true
  },
  book: {
    id: 'book',
    name: '绘本',
    description: '温馨的绘本故事',
    type: 'toy',
    effect: { affection: 3, sanity: 8, corruption: -2 },
    price: 35,
    stackable: false,
    permanent: true
  },
  music_box: {
    id: 'music_box',
    name: '音乐盒',
    description: '播放悦耳旋律的音乐盒',
    type: 'toy',
    effect: { affection: 10, sanity: 10, trauma: -8 },
    price: 100,
    stackable: false,
    permanent: true
  },

  // ============ 衣饰类 ============
  ribbon: {
    id: 'ribbon',
    name: '丝带',
    description: '漂亮的丝带发饰',
    type: 'accessory',
    effect: { affection: 5, corruption: -2 },
    price: 25,
    stackable: false,
    permanent: true
  },
  dress: {
    id: 'dress',
    name: '新裙子',
    description: '漂亮的连衣裙',
    type: 'accessory',
    effect: { affection: 12, dependence: 3, trauma: -3 },
    price: 120,
    stackable: false,
    permanent: true
  },
  collar: {
    id: 'collar',
    name: '项圈',
    description: '......',
    type: 'accessory',
    effect: { corruption: 15, dependence: 10, sanity: -5 },
    price: 60,
    stackable: false,
    permanent: true,
    dark: true
  },

  // ============ 特殊类 ============
  flower: {
    id: 'flower',
    name: '花束',
    description: '美丽的花束',
    type: 'special',
    effect: { affection: 15, trauma: -8, sanity: 5 },
    price: 50,
    stackable: true
  },
  photo: {
    id: 'photo',
    name: '合照',
    description: '你们在一起的合照',
    type: 'special',
    effect: { affection: 20, dependence: 10, trauma: -10 },
    price: 0,
    stackable: false,
    permanent: true,
    unlockCondition: { minAffection: 70, minDay: 15 }
  },
  diary: {
    id: 'diary',
    name: '日记本',
    description: '让她记录心情的日记本',
    type: 'special',
    effect: { sanity: 10, trauma: -5 },
    price: 30,
    stackable: false,
    permanent: true
  }
};

// 商店库存
export const shopInventory: string[] = [
  'bread', 'cake', 'warm_milk', 'medicine',
  'plush_toy', 'ball', 'book', 'music_box',
  'ribbon', 'dress', 'flower', 'diary'
];

// 获取物品信息
export function getItem(id: string): Item | undefined {
  return items[id];
}

// 检查物品是否可用
export function canUseItem(
  itemId: string,
  state: { affection: number; corruption: number; health: number; sanity: number }
): { canUse: boolean; reason?: string } {
  const item = items[itemId];
  if (!item) return { canUse: false, reason: '物品不存在' };

  // 黑暗物品需要特定条件
  if (item.dark && state.affection > 50) {
    return { canUse: false, reason: '她的信任度太高，不愿接受这个' };
  }

  return { canUse: true };
}

// 获取物品类型名称
export function getItemTypeName(type: ItemType): string {
  const names: Record<ItemType, string> = {
    food: '食物',
    medicine: '药物',
    toy: '玩具',
    accessory: '服饰',
    special: '特殊'
  };
  return names[type];
}

// 检查商店物品是否解锁
export function isItemUnlocked(
  itemId: string,
  stats: { affection: number; daysPassed: number }
): boolean {
  const item = items[itemId];
  if (!item) return false;

  if (!item.unlockCondition) return true;

  const { minAffection, minDay } = item.unlockCondition;

  if (minAffection && stats.affection < minAffection) return false;
  if (minDay && stats.daysPassed < minDay) return false;

  return true;
}
