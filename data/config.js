// ==================== 游戏数值配置 ====================

const CONFIG = {
  // 角色配置
  characters: {
    main: {
      id: 'main',
      name: '主角',
      baseDps: 1000,       // 基础秒伤
      baseHp: 100,         // 基础生命
      attackSpeed: 1.0,    // 攻击速度倍率
      critRate: 0.05,      // 暴击率
      critDamage: 1.5,     // 暴击伤害倍率
      skillCount: 7        // 技能数量
    },
    supports: [
      { id: 's1', name: '小毛绒',  baseDps: 22200, hungerTime: 310, hungerMax: 600 },
      { id: 's2', name: '棉花糖',  baseDps: 18500, hungerTime: 280, hungerMax: 600 },
      { id: 's3', name: '肉丸',    baseDps: 15000, hungerTime: 240, hungerMax: 600 },
      { id: 's4', name: '布丁',    baseDps: 12000, hungerTime: 200, hungerMax: 600 },
      { id: 's5', name: '蛋筒',    baseDps: 9800,  hungerTime: 180, hungerMax: 600 },
      { id: 's6', name: '麻薯',    baseDps: 7600,  hungerTime: 150, hungerMax: 600 },
      { id: 's7', name: '雪糕',    baseDps: 5500,  hungerTime: 120, hungerMax: 600 },
      { id: 's8', name: '甜甜',    baseDps: 3500,  hungerTime: 90,  hungerMax: 600 }
    ]
  },

  // 怪物配置
  monster: {
    baseHp: 30000,         // 第1波怪物血量
    hpPerWave: 1.15,       // 每波血量倍率
    goldPerKill: 100,      // 击杀金币基础奖励
    goldPerWaveBonus: 50,  // 每波通关额外金币
    waveCount: 10          // 总波次
  },

  // 技能配置
  skills: [
    { id: 1, name: '技能1', cdMax: 0,   damage: 0,    desc: '普通攻击' },
    { id: 2, name: '技能2', cdMax: 10,  damage: 0.5,  desc: '造成50%攻击伤害' },
    { id: 3, name: '技能3', cdMax: 15,  damage: 1.0,  desc: '造成100%攻击伤害' },
    { id: 4, name: '技能4', cdMax: 20,  damage: 0.3,  desc: '造成30%攻击伤害' },
    { id: 5, name: '技能5', cdMax: 30,  damage: 2.0,  desc: '造成200%攻击伤害' },
    { id: 6, name: '技能6', cdMax: 60,  damage: 5.0,  desc: '造成500%攻击伤害' },
    { id: 7, name: '技能7', cdMax: 120, damage: 10.0, desc: '造成1000%攻击伤害' }
  ],

  // 食物配置
  foods: {
    lollipop: { name: '棒棒糖', price: 100,  wakeTime: 60,  critBonus: 0.10, speedBonus: 0.10 },
    milk:     { name: '牛奶',   price: 200,  wakeTime: 120, atkBonus: 0.15 },
    meat:     { name: '烤肉',   price: 500,  wakeTime: 180, allBonus: 0.20 }
  },

  // 升级配置
  upgrade: {
    baseCost: 50,           // 主角1级升级基础金币
    costMultiplier: 1.5,    // 每级费用倍率
    dpsPerLevel: 0.1        // 每级DPS提升10%
  },

  // 离线收益
  offline: {
    maxHours: 12,
    dpsPerSecond: 0.1      // 离线DPS的10%作为离线收益
  },

  // 转盘配置
  gacha: {
    freeCount: 3,
    rewards: [
      { id: 'gold1',  name: '100金币',   weight: 30, type: 'gold',    value: 100 },
      { id: 'gold2',  name: '200金币',   weight: 25, type: 'gold',    value: 200 },
      { id: 'diamond', name: '50钻石',   weight: 10, type: 'diamond',  value: 50 },
      { id: 'gold3',  name: '300金币',   weight: 15, type: 'gold',    value: 300 },
      { id: 'food1',  name: '棒棒糖×1', weight: 10, type: 'food',     value: 1 },
      { id: 'gold4',  name: '500金币',   weight: 10, type: 'gold',    value: 500 }
    ]
  }
};

// 导出供外部使用
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}