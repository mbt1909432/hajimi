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
  // 隐晦的食物
  special_candy: {
    id: 'special_candy',
    name: '特制糖果',
    description: '颜色奇异的糖果，散发着微弱的香气...',
    type: 'food',
    effect: { affection: 5, sanity: -3, corruption: 5 },
    price: 40,
    stackable: true,
    dark: true
  },
  red_wine: {
    id: 'red_wine',
    name: '红酒',
    description: '深红色的液体，散发着醇香',
    type: 'food',
    effect: { sanity: -8, corruption: 8, trauma: 3 },
    price: 80,
    stackable: true,
    dark: true,
    unlockCondition: { minDay: 10 }
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
  // 隐晦玩具
  mirror: {
    id: 'mirror',
    name: '镜子',
    description: '精致的镜子，她看着自己的倒影出神...',
    type: 'toy',
    effect: { sanity: -5, corruption: 3, dependence: 3 },
    price: 45,
    stackable: false,
    permanent: true
  },
  mask: {
    id: 'mask',
    name: '面具',
    description: '精美的面具，戴上后仿佛变成了另一个人',
    type: 'toy',
    effect: { trauma: -5, sanity: -8, corruption: 10 },
    price: 70,
    stackable: false,
    permanent: true,
    dark: true
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
  // 隐晦衣饰
  silk_rope: {
    id: 'silk_rope',
    name: '丝绳',
    description: '柔软的丝绳，可以做装饰...或者别的',
    type: 'accessory',
    effect: { dependence: 8, corruption: 12, sanity: -5 },
    price: 55,
    stackable: false,
    permanent: true,
    dark: true
  },
  perfume: {
    id: 'perfume',
    name: '香水',
    description: '浓郁的香气，让人微微眩晕',
    type: 'accessory',
    effect: { affection: 5, sanity: -3, corruption: 5 },
    price: 65,
    stackable: false,
    permanent: true
  },

  // ============ 宗教类 ============
  cross_necklace: {
    id: 'cross_necklace',
    name: '十字架项链',
    description: '银质的十字架，闪烁着神圣的光芒',
    type: 'religious',
    effect: { sanity: 10, trauma: -8, corruption: -5 },
    price: 90,
    stackable: false,
    permanent: true
  },
  holy_water: {
    id: 'holy_water',
    name: '圣水',
    description: '据说能净化一切的水',
    type: 'religious',
    effect: { trauma: -15, corruption: -10, sanity: 5 },
    price: 100,
    stackable: true
  },
  prayer_book: {
    id: 'prayer_book',
    name: '祈祷书',
    description: '古老的祈祷书，文字晦涩难懂',
    type: 'religious',
    effect: { sanity: 8, trauma: -5 },
    price: 60,
    stackable: false,
    permanent: true
  },
  incense: {
    id: 'incense',
    name: '香薰',
    description: '神秘的熏香，气味让人平静...或麻木',
    type: 'religious',
    effect: { sanity: 5, trauma: -3, corruption: 3 },
    price: 35,
    stackable: true
  },
  // 黑暗宗教物品
  cursed_talisman: {
    id: 'cursed_talisman',
    name: '旧护符',
    description: '泛黄的护符，上面刻着陌生的符号',
    type: 'religious',
    effect: { sanity: -10, corruption: 15, dependence: 5 },
    price: 120,
    stackable: false,
    permanent: true,
    dark: true,
    unlockCondition: { minDay: 15 }
  },
  ritual_candles: {
    id: 'ritual_candles',
    name: '仪式蜡烛',
    description: '黑色的蜡烛，点燃后散发奇异的香气',
    type: 'religious',
    effect: { sanity: -5, corruption: 10, trauma: 5 },
    price: 80,
    stackable: true,
    dark: true,
    unlockCondition: { minDay: 12 }
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
  },
  // 特殊隐晦物品
  music_disc: {
    id: 'music_disc',
    name: '神秘唱片',
    description: '一张没有标签的唱片，音乐让人恍惚...',
    type: 'special',
    effect: { sanity: -8, corruption: 12, dependence: 5 },
    price: 150,
    stackable: false,
    permanent: true,
    dark: true,
    unlockCondition: { minDay: 20 }
  },
  contract: {
    id: 'contract',
    name: '契约书',
    description: '一份空白契约，等待着签名...',
    type: 'special',
    effect: { dependence: 20, corruption: 25, sanity: -15 },
    price: 200,
    stackable: false,
    permanent: true,
    dark: true,
    unlockCondition: { minDay: 25, minAffection: 50 }
  }
};

// 物品类型名称（新增宗教类）
export function getItemTypeName(type: ItemType): string {
  const names: Record<string, string> = {
    food: '食物',
    medicine: '药物',
    toy: '玩具',
    accessory: '服饰',
    special: '特殊',
    religious: '宗教'
  };
  return names[type] || type;
}

// 商店库存
export const shopInventory: string[] = [
  // 普通物品
  'bread', 'cake', 'warm_milk', 'medicine',
  'plush_toy', 'ball', 'book', 'music_box',
  'ribbon', 'dress', 'flower', 'diary',
  // 新增物品
  'mirror', 'perfume', 'incense',
  'cross_necklace', 'holy_water', 'prayer_book'
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
