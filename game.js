// ==================== 吃饭睡觉打豆豆 - Egret引擎版 ====================
//
// 视觉系统："星夜糖果屋"（Starry Candy Cottage）
// --------------------------------------------------------------
// 主题：深夜空魔法绘本 × 放置点击 RPG。所有界面色彩从 THEME 统一取值，
// 避免各模块各自写颜色常量导致风格碎裂。修改整站风格只需动 THEME。
// --------------------------------------------------------------

// 全局工具函数：绘制一对眼睛（必须在所有绘制代码之前定义）
function drawEyesPair(g, x1, y1, x2, y2, r, pr) {
  g.lineStyle(0);
  g.beginFill(0xffffff);
  g.drawCircle(x1, y1, r);
  g.drawCircle(x2, y2, r);
  g.endFill();
  g.beginFill(0x000000);
  g.drawCircle(x1, y1 + 0.5, pr);
  g.drawCircle(x2, y2 + 0.5, pr);
  g.endFill();
  g.beginFill(0xffffff);
  g.drawCircle(x1 - pr * 0.5, y1 - pr * 0.5, pr * 0.5);
  g.drawCircle(x2 - pr * 0.5, y2 - pr * 0.5, pr * 0.5);
  g.endFill();
}

var THEME = {
  // 背景层（从深到浅）
  bgDeep:   0x0a0820,
  bgMid:    0x1a1340,
  bgLite:   0x2a1f5c,
  bgRow:    0x1a153f,
  bgGlass:  0x140e36,
  // 边框
  strokeGold: 0xf5c842,
  strokeSoft: 0x4a3a8c,
  // 主色
  accent:     0xfbbf24,
  accentSoft: 0xfde68a,
  pink:       0xff7eb0,
  mint:       0x7be8b7,
  sky:        0x5ec8ff,
  lavender:   0xc7a7ff,
  // 状态色
  ok:      0x2ecc71,
  warn:    0xf39c12,
  danger:  0xef4444,
  // 文字
  textMain: 0xffffff,
  textDim:  0xb8b0db,
  textMute: 0x6a628f,
  textGold: 0xfbbf24
};

var ASSET_VERSION = (typeof BUILD_VERSION !== 'undefined' ? BUILD_VERSION : 'dev');
function assetUrl(path) {
  return path + '?v=' + ASSET_VERSION;
}

var UI_ASSETS = {
  battleBackground: assetUrl('assets/image2-backgrounds/sky-ruins-v1/battle-sky-ruins-375x423.png'),
  battleForest: assetUrl('assets/image2-backgrounds/scene-cycle-v1/battle-forest-375x423.png'),
  battleCrystal: assetUrl('assets/image2-backgrounds/scene-cycle-v1/battle-crystal-375x423.png'),
  battleTemple: assetUrl('assets/image2-backgrounds/scene-cycle-v1/battle-temple-375x423.png'),
  hero: assetUrl('assets/image2-character-sheets/v3/hero-mage-v3.png'),
  monsterSlime: assetUrl('assets/image2-monsters/v1/monster-slime-v1.png'),
  monsterRabbit: assetUrl('assets/image2-monsters/v1/monster-rabbit-v1.png'),
  monsterBat: assetUrl('assets/image2-monsters/v1/monster-bat-v1.png'),
  monsterSpike: assetUrl('assets/image2-monsters/v1/monster-spike-v1.png'),
  monsterGhost: assetUrl('assets/image2-monsters/v1/monster-ghost-v1.png'),
  monsterSkull: assetUrl('assets/image2-monsters/v1/monster-skull-v1.png'),
  monsterDragon: assetUrl('assets/image2-monsters/v1/monster-dragon-v1.png'),
  monsterShadow: assetUrl('assets/image2-monsters/v1/monster-shadow-v1.png'),
  bossEye: assetUrl('assets/image2-monsters/v1/boss-eye-v1.png'),
  bossIceGiant: assetUrl('assets/image2-monsters/v1/boss-ice-giant-v1.png'),
  bossSpider: assetUrl('assets/image2-monsters/v1/boss-spider-v1.png'),
  bossDemon: assetUrl('assets/image2-monsters/v1/boss-demon-v1.png'),
  bossPhoenix: assetUrl('assets/image2-monsters/v1/boss-phoenix-v1.png'),
  supportCandy: assetUrl('assets/image2-character-sheets/v3/support-candy-v3.png'),
  supportMarshmallow: assetUrl('assets/image2-character-sheets/v3/support-marshmallow-v3.png'),
  supportMeatball: assetUrl('assets/image2-character-sheets/v3/support-meatball-v3.png'),
  supportPudding: assetUrl('assets/image2-character-sheets/v3/support-pudding-v3.png'),
  supportCone: assetUrl('assets/image2-character-sheets/v3/support-cone-v3.png'),
  supportMochi: assetUrl('assets/image2-character-sheets/v3/support-mochi-v3.png'),
  supportPopsicle: assetUrl('assets/image2-character-sheets/v3/support-popsicle-v3.png'),
  supportCake: assetUrl('assets/image2-character-sheets/v3/support-cake-v3.png'),
  supportCandyR: assetUrl('assets/image2-character-sheets/v3/support-candy-v3.png'),
  supportLocked: assetUrl('assets/ui/sprites/support-locked.png'),
  supportHidden: assetUrl('assets/image2-character-sheets/hidden/support-hidden-silhouette-white-v1.png'),
  topCheckin: assetUrl('assets/image2-white-assets/layout-v2/top-checkin-white.png'),
  topDailyTask: assetUrl('assets/image2-white-assets/layout-v2/top-daily-task-white.png'),
  topMail: assetUrl('assets/image2-white-assets/layout-v2/top-mail-white.png'),
  hudBoss: assetUrl('assets/image2-white-assets/top-hud-v1/top-boss-white.png'),
  hudCodex: assetUrl('assets/image2-white-assets/top-hud-v1/top-codex-white.png'),
  hudCheckin: assetUrl('assets/image2-white-assets/top-hud-v1/top-checkin-white.png'),
  hudDailyTask: assetUrl('assets/image2-white-assets/top-hud-v1/top-daily-task-white.png'),
  hudMail: assetUrl('assets/image2-white-assets/top-hud-v1/top-mail-white.png'),
  hudAnnouncement: assetUrl('assets/image2-white-assets/top-hud-v1/top-announcement-white.png'),
  hudRebirth: assetUrl('assets/image2-white-assets/top-hud-v1/top-rebirth-white.png'),
  hudEnergy: assetUrl('assets/image2-white-assets/top-hud-v1/top-energy-white.png'),
  brandDmax: assetUrl('assets/image2-brand/dmax-v1/dmax-title-badge-compact-runtime.png'),
  skillLightWand: assetUrl('assets/image2-white-assets/layout-v2/skill-light-wand-white.png'),
  skillHeavySlash: assetUrl('assets/image2-white-assets/layout-v2/skill-heavy-slash-white.png'),
  skillIceCombo: assetUrl('assets/image2-white-assets/layout-v2/skill-ice-combo-white.png'),
  skillSkullCritical: assetUrl('assets/image2-white-assets/layout-v2/skill-skull-critical-white.png'),
  skillGreenWhirlwind: assetUrl('assets/image2-white-assets/layout-v2/skill-green-whirlwind-white.png'),
  skillThunderbolt: assetUrl('assets/image2-white-assets/layout-v2/skill-thunderbolt-white.png'),
  skillStarMeteor: assetUrl('assets/image2-white-assets/layout-v2/skill-star-meteor-white.png'),
  upgradeHero: assetUrl('assets/generated/upgrade-icons-v1/upgrade-hero-v1.png'),
  upgradeSkill: assetUrl('assets/generated/upgrade-icons-v1/upgrade-skill-v1.png'),
  upgradeSupport: assetUrl('assets/generated/upgrade-icons-v1/upgrade-support-v1.png'),
  upgradeEquipment: assetUrl('assets/generated/upgrade-icons-v1/upgrade-equipment-v1.png'),
  upgradeLevelup: assetUrl('assets/generated/upgrade-icons-v1/upgrade-levelup-v1.png'),
  upgradeBatch: assetUrl('assets/generated/upgrade-icons-v1/upgrade-batch-v1.png'),
  upgradeArchive: assetUrl('assets/generated/upgrade-icons-v1/upgrade-archive-v1.png'),
  upgradeGold: assetUrl('assets/generated/upgrade-icons-v1/upgrade-gold-v1.png'),
  codexBook: assetUrl('assets/generated/codex-icons-v1/codex-book-v1.png'),
  codexMonster: assetUrl('assets/generated/codex-icons-v1/codex-monster-v1.png'),
  codexBoss: assetUrl('assets/generated/codex-icons-v1/codex-boss-v1.png'),
  codexUnknown: assetUrl('assets/generated/codex-icons-v1/codex-unknown-v1.png'),
  codexResearch: assetUrl('assets/generated/codex-icons-v1/codex-research-v1.png'),
  codexWeakness: assetUrl('assets/generated/codex-icons-v1/codex-weakness-v1.png'),
  codexKills: assetUrl('assets/generated/codex-icons-v1/codex-kills-v1.png'),
  codexProgress: assetUrl('assets/generated/codex-icons-v1/codex-progress-v1.png'),
  moduleSpinWheel: assetUrl('assets/generated/module-icons-v1/module-spin-wheel-v1.png'),
  moduleSpinGift: assetUrl('assets/generated/module-icons-v1/module-spin-gift-v1.png'),
  moduleSpinTicket: assetUrl('assets/generated/module-icons-v1/module-spin-ticket-v1.png'),
  moduleSpinJackpot: assetUrl('assets/generated/module-icons-v1/module-spin-jackpot-v1.png'),
  moduleRebirthGem: assetUrl('assets/generated/module-icons-v1/module-rebirth-gem-v1.png'),
  moduleRebirthPortal: assetUrl('assets/generated/module-icons-v1/module-rebirth-portal-v1.png'),
  moduleRebirthTalent: assetUrl('assets/generated/module-icons-v1/module-rebirth-talent-v1.png'),
  moduleRebirthHourglass: assetUrl('assets/generated/module-icons-v1/module-rebirth-hourglass-v1.png'),
  moduleVaultChest: assetUrl('assets/generated/module-icons-v1/module-vault-chest-v1.png'),
  moduleVaultRelic: assetUrl('assets/generated/module-icons-v1/module-vault-relic-v1.png'),
  moduleVaultDiamondPouch: assetUrl('assets/generated/module-icons-v1/module-vault-diamond-pouch-v1.png'),
  moduleVaultEnergyPotion: assetUrl('assets/generated/module-icons-v1/module-vault-energy-potion-v1.png'),
  topHudGold: assetUrl('assets/generated/top-hud-icons-v1/top-hud-gold-v1.png'),
  topHudDiamond: assetUrl('assets/generated/top-hud-icons-v1/top-hud-diamond-blue-v1.png'),
  topHudSettings: assetUrl('assets/generated/top-hud-icons-v1/top-hud-settings-v1.png'),
  topHudBoss: assetUrl('assets/generated/top-hud-icons-v1/top-hud-boss-v1.png'),
  avatarStarMage: assetUrl('assets/generated/avatar-icons-v1/avatar-star-mage-v1.png'),
  avatarSwordApprentice: assetUrl('assets/generated/avatar-icons-v1/avatar-sword-apprentice-v1.png'),
  avatarForestArcher: assetUrl('assets/generated/avatar-icons-v1/avatar-forest-archer-v1.png'),
  avatarShrineHealer: assetUrl('assets/generated/avatar-icons-v1/avatar-shrine-healer-v1.png'),
  avatarShadowRogue: assetUrl('assets/generated/avatar-icons-v1/avatar-shadow-rogue-v1.png'),
  avatarCrystalKnight: assetUrl('assets/generated/avatar-icons-v1/avatar-crystal-knight-v1.png'),
  navUpgrade: assetUrl('assets/image2-white-assets/layout-v2/nav-upgrade-white.png'),
  navCodex: assetUrl('assets/image2-white-assets/layout-v2/nav-codex-white.png'),
  navSpinWheel: assetUrl('assets/image2-white-assets/layout-v2/nav-spin-wheel-white.png'),
  navSupermarket: assetUrl('assets/image2-white-assets/layout-v2/nav-supermarket-white.png'),
  navRanking: assetUrl('assets/image2-white-assets/layout-v2/nav-ranking-white.png'),
  navShop: assetUrl('assets/image2-white-assets/layout-v2/nav-shop-white.png')
};

if (typeof window !== 'undefined') {
  window.DMAX_CRITICAL_ASSETS = [
    UI_ASSETS.battleBackground,
    UI_ASSETS.hero,
    UI_ASSETS.brandDmax,
    UI_ASSETS.monsterSlime,
    UI_ASSETS.monsterRabbit,
    UI_ASSETS.monsterBat,
    UI_ASSETS.bossEye,
    UI_ASSETS.supportCandy,
    UI_ASSETS.topHudBoss,
    UI_ASSETS.topHudGold,
    UI_ASSETS.topHudDiamond,
    UI_ASSETS.avatarStarMage,
    UI_ASSETS.navUpgrade,
    UI_ASSETS.navShop
  ];
  window.DMAX_PRELOAD_ASSETS = window.DMAX_CRITICAL_ASSETS.concat(Object.keys(UI_ASSETS).map(function(key) {
    return UI_ASSETS[key];
  }).filter(function(asset) {
    return window.DMAX_CRITICAL_ASSETS.indexOf(asset) < 0;
  }));
}

var UI_ASSET_SIZES = {};
UI_ASSET_SIZES[UI_ASSETS.battleBackground] = { w: 375, h: 423 };
UI_ASSET_SIZES[UI_ASSETS.battleForest] = { w: 375, h: 423 };
UI_ASSET_SIZES[UI_ASSETS.battleCrystal] = { w: 375, h: 423 };
UI_ASSET_SIZES[UI_ASSETS.battleTemple] = { w: 375, h: 423 };
UI_ASSET_SIZES[UI_ASSETS.hero] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.monsterSlime] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.monsterRabbit] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.monsterBat] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.monsterSpike] = { w: 315, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.monsterGhost] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.monsterSkull] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.monsterDragon] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.monsterShadow] = { w: 315, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.bossEye] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.bossIceGiant] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.bossSpider] = { w: 313, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.bossDemon] = { w: 315, h: 313 };
UI_ASSET_SIZES[UI_ASSETS.bossPhoenix] = { w: 313, h: 315 };
UI_ASSET_SIZES[UI_ASSETS.supportCandy] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportMarshmallow] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportMeatball] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportPudding] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportCone] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportMochi] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportPopsicle] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportCake] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportCandyR] = { w: 418, h: 418 };
UI_ASSET_SIZES[UI_ASSETS.supportLocked] = { w: 44, h: 56 };
UI_ASSET_SIZES[UI_ASSETS.supportHidden] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.topCheckin] = { w: 248, h: 120 };
UI_ASSET_SIZES[UI_ASSETS.topDailyTask] = { w: 248, h: 120 };
UI_ASSET_SIZES[UI_ASSETS.topMail] = { w: 248, h: 120 };
UI_ASSET_SIZES[UI_ASSETS.hudBoss] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.hudCodex] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.hudCheckin] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.hudDailyTask] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.hudMail] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.hudAnnouncement] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.hudRebirth] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.hudEnergy] = { w: 1254, h: 1254 };
UI_ASSET_SIZES[UI_ASSETS.brandDmax] = { w: 1148, h: 730 };
UI_ASSET_SIZES[UI_ASSETS.skillLightWand] = { w: 188, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.skillHeavySlash] = { w: 188, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.skillIceCombo] = { w: 188, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.skillSkullCritical] = { w: 188, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.skillGreenWhirlwind] = { w: 188, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.skillThunderbolt] = { w: 188, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.skillStarMeteor] = { w: 188, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.upgradeHero] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.upgradeSkill] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.upgradeSupport] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.upgradeEquipment] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.upgradeLevelup] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.upgradeBatch] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.upgradeArchive] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.upgradeGold] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexBook] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexMonster] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexBoss] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexUnknown] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexResearch] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexWeakness] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexKills] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.codexProgress] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleSpinWheel] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleSpinGift] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleSpinTicket] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleSpinJackpot] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleRebirthGem] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleRebirthPortal] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleRebirthTalent] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleRebirthHourglass] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleVaultChest] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleVaultRelic] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleVaultDiamondPouch] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.moduleVaultEnergyPotion] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.topHudGold] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.topHudDiamond] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.topHudSettings] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.topHudBoss] = { w: 160, h: 160 };
UI_ASSET_SIZES[UI_ASSETS.avatarStarMage] = { w: 192, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.avatarSwordApprentice] = { w: 192, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.avatarForestArcher] = { w: 192, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.avatarShrineHealer] = { w: 192, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.avatarShadowRogue] = { w: 192, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.avatarCrystalKnight] = { w: 192, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.navUpgrade] = { w: 232, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.navCodex] = { w: 232, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.navSpinWheel] = { w: 232, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.navSupermarket] = { w: 232, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.navRanking] = { w: 232, h: 192 };
UI_ASSET_SIZES[UI_ASSETS.navShop] = { w: 232, h: 192 };

var SKILL_ICON_ASSETS = [
  UI_ASSETS.skillLightWand,
  UI_ASSETS.skillHeavySlash,
  UI_ASSETS.skillIceCombo,
  UI_ASSETS.skillSkullCritical,
  UI_ASSETS.skillGreenWhirlwind,
  UI_ASSETS.skillThunderbolt,
  UI_ASSETS.skillStarMeteor
];

var UPGRADE_ICON_ASSETS = {
  hero: UI_ASSETS.upgradeHero,
  skill: UI_ASSETS.upgradeSkill,
  support: UI_ASSETS.upgradeSupport,
  equipment: UI_ASSETS.upgradeEquipment,
  levelup: UI_ASSETS.upgradeLevelup,
  batch: UI_ASSETS.upgradeBatch,
  archive: UI_ASSETS.upgradeArchive,
  gold: UI_ASSETS.upgradeGold
};

var AVATAR_DEFS = [
  { name: '星语法师', asset: UI_ASSETS.avatarStarMage, color: 0x8e44ad },
  { name: '剑术学徒', asset: UI_ASSETS.avatarSwordApprentice, color: 0x3498db },
  { name: '森林游侠', asset: UI_ASSETS.avatarForestArcher, color: 0x27ae60 },
  { name: '圣堂医师', asset: UI_ASSETS.avatarShrineHealer, color: 0xf4a7c8 },
  { name: '影刃潜行者', asset: UI_ASSETS.avatarShadowRogue, color: 0x6d28d9 },
  { name: '晶甲骑士', asset: UI_ASSETS.avatarCrystalKnight, color: 0x5ec8ff }
];

// S2：职业加成已接入 getBuffs()。每个职业只提供 1 条明确的主加成，数值刻意保持小量级；
// 默认职业 trainee_mage 的 bonus 为空 —— 保证旧存档 / 未转职状态的所有数值零漂移。
// bonus 字段名与 getBuffs() 返回值对齐，后续新增职业只改这张表，不必再动战斗代码。
var JOB_DEFS = [
  { id: 'trainee_mage', name: '见习法师', cost: 0, color: 0xc7a7ff, bonus: {}, desc: '初始称号，无额外加成。', unlocked: true },
  { id: 'blade_mage', name: '魔剑士', cost: 30, color: 0x7be8b7, bonus: { attack: 0.08 }, desc: '把法术灌入武器，偏稳定输出。', unlocked: false },
  { id: 'star_oracle', name: '星术师', cost: 45, color: 0xfbbf24, bonus: { crit: 0.06 }, desc: '强化暴击窗口，适合高血量 BOSS。', unlocked: false },
  { id: 'spirit_guard', name: '灵卫者', cost: 60, color: 0x5ec8ff, bonus: { hp: 0.10 }, desc: '偏防御与续航，提升容错。', unlocked: false }
];

function makeDefaultPlayerName() {
  var n = Math.floor(Math.random() * 100000);
  return '玩家' + ('00000' + n).slice(-5);
}

var CODEX_ICON_ASSETS = {
  book: UI_ASSETS.codexBook,
  monster: UI_ASSETS.codexMonster,
  boss: UI_ASSETS.codexBoss,
  unknown: UI_ASSETS.codexUnknown,
  research: UI_ASSETS.codexResearch,
  weakness: UI_ASSETS.codexWeakness,
  kills: UI_ASSETS.codexKills,
  progress: UI_ASSETS.codexProgress
};

var MODULE_ICON_ASSETS = {
  spinWheel: UI_ASSETS.moduleSpinWheel,
  spinGift: UI_ASSETS.moduleSpinGift,
  spinTicket: UI_ASSETS.moduleSpinTicket,
  spinJackpot: UI_ASSETS.moduleSpinJackpot,
  rebirthGem: UI_ASSETS.moduleRebirthGem,
  rebirthPortal: UI_ASSETS.moduleRebirthPortal,
  rebirthTalent: UI_ASSETS.moduleRebirthTalent,
  rebirthHourglass: UI_ASSETS.moduleRebirthHourglass,
  vaultChest: UI_ASSETS.moduleVaultChest,
  vaultRelic: UI_ASSETS.moduleVaultRelic,
  vaultDiamondPouch: UI_ASSETS.moduleVaultDiamondPouch,
  vaultEnergyPotion: UI_ASSETS.moduleVaultEnergyPotion
};

var NAV_ICON_ASSETS = {
  upgrade: UI_ASSETS.navUpgrade,
  codex: UI_ASSETS.navCodex,
  spin: UI_ASSETS.navSpinWheel,
  market: UI_ASSETS.navSupermarket,
  vault: UI_ASSETS.navSupermarket,
  rebirth: UI_ASSETS.hudRebirth,
  rank: UI_ASSETS.navRanking,
  ranking: UI_ASSETS.navRanking,
  shop: UI_ASSETS.navShop
};

var SUPPORT_IMAGE_ASSETS = [
  UI_ASSETS.supportCandy,
  UI_ASSETS.supportMarshmallow,
  UI_ASSETS.supportMeatball,
  UI_ASSETS.supportPudding,
  UI_ASSETS.supportCone,
  UI_ASSETS.supportMochi,
  UI_ASSETS.supportPopsicle,
  UI_ASSETS.supportCake
];

var MONSTER_IMAGE_ASSETS = {
  slime: UI_ASSETS.monsterSlime,
  rabbit: UI_ASSETS.monsterRabbit,
  bat: UI_ASSETS.monsterBat,
  spike: UI_ASSETS.monsterSpike,
  ghost: UI_ASSETS.monsterGhost,
  skull: UI_ASSETS.monsterSkull,
  dragon: UI_ASSETS.monsterDragon,
  shadow: UI_ASSETS.monsterShadow,
  boss_eye: UI_ASSETS.bossEye,
  boss_giant: UI_ASSETS.bossIceGiant,
  boss_spider: UI_ASSETS.bossSpider,
  boss_demon: UI_ASSETS.bossDemon,
  boss_phoenix: UI_ASSETS.bossPhoenix,
  // F1：6 只隐藏怪复用现有怪物精灵（专属美术排在后续表现层批次）。
  // monsterSpriteSource() 按 shape 查表，因此隐藏怪进刷怪池后不会出现史莱姆 fallback。
  candy_bee: UI_ASSETS.monsterBat,
  jelly_knight: UI_ASSETS.monsterSpike,
  star_fox: UI_ASSETS.monsterRabbit,
  molten_golem: UI_ASSETS.monsterDragon,
  mirror_cat: UI_ASSETS.monsterGhost,
  void_whale: UI_ASSETS.monsterShadow
};

var BATTLE_SCENES = [
  { name: '星空遗迹', asset: UI_ASSETS.battleBackground },
  { name: '月光森林', asset: UI_ASSETS.battleForest },
  { name: '水晶峡谷', asset: UI_ASSETS.battleCrystal },
  { name: '天空神殿', asset: UI_ASSETS.battleTemple }
];

var BOSSES_PER_CHAPTER = 5;
var REBIRTH_MIN_BOSS_STAGE = 5;
var REBIRTH_MIN_NEW_BOSSES = 5;

var CONFIG = {
  maxEnergy: 100,
  energyRecovery: 1,
  energyRecoveryInterval: 1,
  attackEnergyCost: 2,
  skillEnergyCost: 0,
  killEnergyReward: 0,
  bossKillEnergyReward: 6,
  energyPotionValue: 30,
  bossTimeLimit: 10,  // BOSS限时（秒）
  playerHp: function(level, gems) { return Math.floor(520 + 72 * Math.pow(level, 1.25) * CONFIG.rebirthDamageMult(gems) * 0.55); },
  playerDefense: function(level, gems) { return Math.floor(8 + level * 0.9 + Math.log(1 + Math.max(0, gems || 0)) * 7); },
  monsterAtk: function(wave, isBoss) { return Math.floor((10 + 1.25 * Math.pow(wave, 0.92)) * (isBoss ? 2.65 : 1)); },
  monsterHp: function(wave) { return Math.floor(120 * Math.pow(wave, 1.36) * (1 + Math.floor((wave - 1) / 50) * 0.08)); },
  bossHpMult: function(wave) { return 7 + Math.min(4, Math.floor(Math.max(0, wave - 10) / 100)); },
  goldReward: function(wave, isBoss) { return Math.floor(6 * Math.pow(wave, 1.06) * (isBoss ? 6 : 1)); },
  rebirthDamageMult: function(gems) { return 1 + Math.log(1 + Math.max(0, gems || 0)) * 0.35; },
  rebirthSupportMult: function(gems) { return 1 + Math.log(1 + Math.max(0, gems || 0)) * 0.22; },
  mainDmg: function(level, gems) {
    var mult = CONFIG.rebirthDamageMult(gems);
    return Math.floor(80 * Math.pow(level, 1.35) * mult);
  },
  upgradeCost: function(level) { return Math.floor(80 * Math.pow(level, 2.05) + 500 * level); },
  supportRecruitGoldCost: function(idx) {
    var costs = [1800, 12000, 68000, 240000, 820000];
    return costs[idx] || Math.floor(820000 * Math.pow(2.2, Math.max(0, idx - 4)));
  },
  supportRecruitDiamondCost: function(idx) {
    var costs = [0, 0, 0, 0, 0, 8, 18, 36];
    return costs[idx] || 36;
  },
  supportCost: function(level) { return Math.floor(35 * Math.pow(level, 2) + 80 * level); },
  skillCost: function(level, idx) { return Math.floor((260 + idx * 180) * Math.pow(level, 1.72)); },
  killsNeeded: function(level) { return level * 4 + 4; }
};

// 技能定义
//   name   显示名
//   cd     冷却时间（秒）
//   dmg    伤害倍率
//   hits   命中次数；0 = 全屏 AOE
//   lv     解锁等级
//   color  技能按钮主色
//   icon   drawSkillIcon 消费的形状 key
//   glow   辉光色
var SKILLS = [
  { name: '轻击', cd: 4,  dmg: 1.2,  hits: 1, lv: 1,  type: 'phys',  effect: 'single',    color: 0x5ec8ff, icon: 'slash',   glow: 0xa8e0ff },
  { name: '破岳', cd: 14, dmg: 3.2,  hits: 1, lv: 3,  type: 'phys',  effect: 'boss',      color: 0xef4444, icon: 'smash',   glow: 0xffb5b5 },
  { name: '连斩', cd: 18, dmg: 0.85, hits: 5, lv: 5,  type: 'phys',  effect: 'multi',     color: 0xfbbf24, icon: 'triple',  glow: 0xfff1b0 },
  { name: '裂光', cd: 24, dmg: 2.4,  hits: 1, lv: 8,  type: 'magic', effect: 'critBuff',  color: 0xc7a7ff, icon: 'crit',    glow: 0xe7d4ff },
  { name: '糖风', cd: 30, dmg: 1.5,  hits: 0, lv: 12, type: 'magic', effect: 'aoe',       color: 0x7be8b7, icon: 'whirl',   glow: 0xc5f5dd },
  { name: '雷霆', cd: 40, dmg: 1.2,  hits: 0, lv: 18, type: 'magic', effect: 'speedBuff', color: 0xffd166, icon: 'thunder', glow: 0xffe8a5 },
  { name: '星陨', cd: 70, dmg: 5.2,  hits: 0, lv: 25, type: 'true',  effect: 'meteor',    color: 0xff7eb0, icon: 'meteor',  glow: 0xffcfe2 }
];

// 怪物类型定义（三层光影风格）
//   highlight 浅色高光 / accent 点缀色（牙爪等）
var MONSTER_TYPES = [
  { name: '史莱姆', shape: 'slime',  armor: 5,  resist: 5,  weakness: 'phys',  trait: 'soft',      traitName: '柔软', color: 0x2ecc71, highlight: 0xa8ffcf, outline: 0x1e5f38, hpColor: 0x2ecc71, badge: 0x1e5f38, accent: 0xfff59d, wave: 1   },
  { name: '兔兔',   shape: 'rabbit', armor: 10, resist: 12, weakness: 'magic', trait: 'dodge',     traitName: '灵巧', color: 0xffc9d9, highlight: 0xffe9f2, outline: 0xb83d6a, hpColor: 0xff69b4, badge: 0xb83d6a, accent: 0xe91e63, wave: 5   },
  { name: '蝙蝠',   shape: 'bat',    armor: 8,  resist: 35, weakness: 'phys',  trait: 'magicWall', traitName: '法抗', color: 0x7e3cb8, highlight: 0xbd85e2, outline: 0x32124a, hpColor: 0x9b59b6, badge: 0x32124a, accent: 0xff3030, wave: 10  },
  { name: '刺球',   shape: 'spike',  armor: 42, resist: 8,  weakness: 'magic', trait: 'spiked',    traitName: '硬壳', color: 0xe74c3c, highlight: 0xff8a7a, outline: 0x7a1a10, hpColor: 0xe74c3c, badge: 0x7a1a10, accent: 0xfff59d, wave: 20  },
  { name: '幽灵',   shape: 'ghost',  armor: 55, resist: 14, weakness: 'magic', trait: 'ethereal',  traitName: '虚体', color: 0xe8f1ff, highlight: 0xffffff, outline: 0x4a3a6c, hpColor: 0xa0afc8, badge: 0x4a3a6c, accent: 0x5ec8ff, wave: 35  },
  { name: '骷髅',   shape: 'skull',  armor: 24, resist: 28, weakness: 'true',  trait: 'antiCrit',  traitName: '抗暴', color: 0xf0ebe0, highlight: 0xffffff, outline: 0x2c2640, hpColor: 0xbdc3c7, badge: 0x2c2640, accent: 0xff3333, wave: 50  },
  { name: '火龙',   shape: 'dragon', armor: 30, resist: 45, weakness: 'phys',  trait: 'burn',      traitName: '灼烧', color: 0xe67e22, highlight: 0xffbe76, outline: 0x7a2d06, hpColor: 0xf39c12, badge: 0x7a2d06, accent: 0xff4500, wave: 80  },
  { name: '暗影',   shape: 'shadow', armor: 36, resist: 36, weakness: 'true',  trait: 'shield',    traitName: '暗盾', color: 0x1a1030, highlight: 0x4b3a7a, outline: 0x000000, hpColor: 0x34495e, badge: 0x000000, accent: 0xff0000, wave: 120 }
];

// F1：隐藏怪不再只是「预留图签位」。每只都有真实属性、出现波次与稀有遭遇概率。
// 形象暂复用现有怪物 PNG（专属美术属于后续表现层批次），靠名称 / 词缀 / 属性 / trait 区分。
var HIDDEN_ENCOUNTER_CHANCE = 0.045;
// 门槛波次一律避开 10 的倍数（BOSS 波不插入隐藏怪），保证「第 N 波起」字面可遭遇。
var HIDDEN_ENCOUNTER_MIN_WAVE = 25;

var HIDDEN_MONSTER_TYPES = [
  { name: '糖晶蜂',   shape: 'candy_bee',    armor: 12, resist: 32, weakness: 'phys',  trait: 'swarm',     traitName: '蜂群', desc: '成群时攻击更凶，物理连击最稳。', hidden: true, wave: 25,  unlockHint: '稀有遭遇：第 25 波起有概率出现' },
  { name: '果冻骑士', shape: 'jelly_knight', armor: 62, resist: 18, weakness: 'magic', trait: 'guard',     traitName: '守备', desc: '非弱点伤害会被额外抵挡，法术爆发更有效。', hidden: true, wave: 45,  unlockHint: '稀有遭遇：第 45 波起有概率出现' },
  { name: '星砂狐',   shape: 'star_fox',     armor: 18, resist: 46, weakness: 'true',  trait: 'phase',     traitName: '闪相', desc: '会规避物理攻击，真实伤害更稳定。', hidden: true, wave: 65,  unlockHint: '稀有遭遇：第 65 波起有概率出现' },
  { name: '熔糖魔偶', shape: 'molten_golem', armor: 70, resist: 40, weakness: 'magic', trait: 'meltArmor', traitName: '熔甲', desc: '攻击附带穿防伤害，优先快速击杀。', hidden: true, wave: 85,  unlockHint: '稀有遭遇：第 85 波起有概率出现' },
  { name: '镜影猫',   shape: 'mirror_cat',   armor: 28, resist: 28, weakness: 'phys',  trait: 'mirror',    traitName: '镜像', desc: '会反弹少量物理伤害，留意自身血量。', hidden: true, wave: 105, unlockHint: '稀有遭遇：第 105 波起有概率出现' },
  { name: '虚空鲸',   shape: 'void_whale',   armor: 48, resist: 65, weakness: 'true',  trait: 'void',      traitName: '虚空', desc: '常规伤害大幅削弱，需要真实伤害与图签研究。', hidden: true, wave: 125, unlockHint: '稀有遭遇：第 125 波起有概率出现' }
];

var MONSTER_SIZE_VARIANTS = [
  { id: 'tiny',   prefix: '幼小', scale: 0.78, hp: 0.72, atk: 0.78, armor: -4, resist: -4, move: 1.35, weight: 15 },
  { id: 'small',  prefix: '轻灵', scale: 0.9,  hp: 0.9,  atk: 0.9,  armor: -2, resist: -2, move: 1.18, weight: 22 },
  { id: 'normal', prefix: '',     scale: 1,    hp: 1,    atk: 1,    armor: 0,  resist: 0,  move: 1,    weight: 34 },
  { id: 'large',  prefix: '强壮', scale: 1.14, hp: 1.28, atk: 1.16, armor: 4,  resist: 3,  move: 0.9,  weight: 20 },
  { id: 'giant',  prefix: '巨型', scale: 1.32, hp: 1.7,  atk: 1.32, armor: 8,  resist: 6,  move: 0.78, weight: 9 }
];

var MONSTER_AFFIXES = [
  { id: 'plain',    prefix: '',     traitName: '',     hp: 1,    atk: 1,    armor: 0,  resist: 0,  move: 1,    weight: 36, minWave: 1 },
  { id: 'swift',    prefix: '疾行', traitName: '疾行', hp: 0.9,  atk: 0.95, armor: -2, resist: 0,  move: 1.45, weight: 14, minWave: 6 },
  { id: 'armored',  prefix: '铁甲', traitName: '重甲', hp: 1.18, atk: 1,    armor: 10, resist: 0,  move: 0.82, weight: 12, minWave: 12 },
  { id: 'arcane',   prefix: '秘法', traitName: '法盾', hp: 1.08, atk: 1.05, armor: 0,  resist: 12, move: 0.95, weight: 12, minWave: 18 },
  { id: 'raging',   prefix: '狂暴', traitName: '狂暴', hp: 0.95, atk: 1.28, armor: 0,  resist: 0,  move: 1.12, weight: 10, minWave: 25 },
  { id: 'veteran',  prefix: '精英', traitName: '精英', hp: 1.45, atk: 1.16, armor: 5,  resist: 5,  move: 0.96, weight: 8,  minWave: 40 },
  { id: 'crystal',  prefix: '晶化', traitName: '晶化', hp: 1.22, atk: 1.08, armor: 4,  resist: 9,  move: 0.9,  weight: 8,  minWave: 60 }
];

// BOSS 专属形象（每10波出现一次）
var BOSS_TYPES = [
  { name: '魔眼王',   shape: 'boss_eye',     armor: 30, resist: 24, weakness: 'phys',  trait: 'antiCrit', traitName: '凝视', color: 0x8b0000, highlight: 0xff6666, outline: 0x3a0000, hpColor: 0xe74c3c, badge: 0x5a0a08, accent: 0xff0000 },
  { name: '冰霜巨人', shape: 'boss_giant',   armor: 65, resist: 18, weakness: 'magic', trait: 'frost',    traitName: '重甲', color: 0x4fc3f7, highlight: 0xe1f5fe, outline: 0x0277bd, hpColor: 0x29b6f6, badge: 0x01579b, accent: 0xffffff },
  { name: '深渊蜘蛛', shape: 'boss_spider',  armor: 34, resist: 42, weakness: 'phys',  trait: 'web',      traitName: '蛛网', color: 0x4a148c, highlight: 0xce93d8, outline: 0x1a0030, hpColor: 0xab47bc, badge: 0x2d0050, accent: 0x00e5ff },
  { name: '炎魔将军', shape: 'boss_demon',   armor: 38, resist: 60, weakness: 'phys',  trait: 'burn',     traitName: '灼烧', color: 0xb71c1c, highlight: 0xff8a65, outline: 0x4a0000, hpColor: 0xef5350, badge: 0x7f0000, accent: 0xffeb3b },
  { name: '星界凤凰', shape: 'boss_phoenix', armor: 44, resist: 44, weakness: 'true',  trait: 'rebirth',  traitName: '涅槃', color: 0xff6f00, highlight: 0xffe082, outline: 0x7f3300, hpColor: 0xffa726, badge: 0x5d2600, accent: 0x40c4ff }
];

// 辅助角色（糖果精灵队）
//   role     物理 phys / 法术 magic（决定攻击动画）
//   shape    createSupportView + bullet 绘制 key
var SUPPORTS_DEF = [
  { name: '糖糖',   dps: 15,  wave: 0,   recruitLv: 1,   atkInterval: 1200, color: 0xff7eb0, shape: 'candy',       role: 'phys',  symbol: '糖糖'   },
  { name: '棉花糖', dps: 28,  wave: 5,   recruitLv: 8,   atkInterval: 1500, color: 0xf8c4d9, shape: 'marshmallow', role: 'magic', symbol: '棉花糖' },
  { name: '肉丸',   dps: 45,  wave: 15,  recruitLv: 16,  atkInterval: 1000, color: 0xd96a31, shape: 'meatball',    role: 'phys',  symbol: '肉丸'   },
  { name: '布丁',   dps: 75,  wave: 30,  recruitLv: 28,  atkInterval: 1800, color: 0xf5c842, shape: 'pudding',     role: 'phys',  symbol: '布丁'   },
  { name: '蛋筒',   dps: 120, wave: 50,  recruitLv: 42,  atkInterval: 900,  color: 0xff9933, shape: 'cone',        role: 'phys',  symbol: '蛋筒'   },
  { name: '麻薯',   dps: 200, wave: 80,  recruitLv: 60,  atkInterval: 1400, color: 0xc7a7ff, shape: 'mochi',       role: 'magic', symbol: '麻薯'   },
  { name: '月棒冰', dps: 350, wave: 120, recruitLv: 82,  atkInterval: 1100, color: 0x7be8b7, shape: 'popsicle',    role: 'magic', symbol: '月棒冰' },
  { name: '草莓酱', dps: 600, wave: 180, recruitLv: 110, atkInterval: 1600, color: 0xff5577, shape: 'cake',        role: 'magic', symbol: '草莓酱' }
];

var FOODS = [
  { name: '星芒戒指', icon: '✦', price: 2, max: 5, desc: '永久暴击+2%/级，适合爆发技能' },
  { name: '月蚀护符', icon: '☾', price: 3, max: 5, desc: '永久攻击+4%/级，不替代升级' },
  { name: '疾风靴',   icon: '↯', price: 3, max: 5, desc: '永久攻速+3%/级，提高清怪手感' },
  { name: '守护晶核', icon: '◆', price: 4, max: 5, desc: '永久辅助伤害+4%/级，强化队伍' },
  { name: '龙鳞护甲', icon: '▣', price: 4, max: 5, desc: '永久生命+6%/级，防御+4/级' }
];

var EQUIPMENT_DEFS = [
  { name: '星纹法杖', icon: '杖', color: 0xc7a7ff, stat: 'attack', desc: '主角攻击', per: 0.035, max: 12 },
  { name: '守夜披风', icon: '甲', color: 0x5ec8ff, stat: 'hp', desc: '生命上限', per: 0.045, max: 12 },
  { name: '猎魔徽章', icon: '徽', color: 0xff9f43, stat: 'boss', desc: 'BOSS伤害', per: 0.055, max: 10 },
  { name: '同心铃铛', icon: '铃', color: 0x7be8b7, stat: 'support', desc: '队友伤害', per: 0.04, max: 12 }
];

var REBIRTH_TALENTS = [
  { name: '破军星', icon: '破', color: 0xff6b6b, stat: 'attack', desc: '主角攻击', per: 0.03, max: 10 },
  { name: '长生印', icon: '生', color: 0x7be8b7, stat: 'survive', desc: '生命与防御', per: 0.04, max: 10 },
  { name: '疾咒轮', icon: '疾', color: 0x5ec8ff, stat: 'tempo', desc: '攻速与冷却', per: 0.025, max: 8 },
  { name: '寻宝契', icon: '宝', color: 0xffd166, stat: 'loot', desc: '金币与锻造石', per: 0.04, max: 8 }
];

var CORE_WEAPON_DEF = {
  name: '血月法杖',
  icon: '血',
  color: 0x9b1d35,
  unlockBossStage: 8,
  dropChance: 0.04,
  pity: 25,
  lifesteal: 0.018,
  healCap: 0.04
};

var SPIN_PRIZES = [
  { id: 'gold_s', text: '金币补给', type: 'goldScale', value: 1.2, weight: 28, rarity: '普通', color: 0xf39c12 },
  { id: 'gold_m', text: '金币宝箱', type: 'goldScale', value: 2.5, weight: 22, rarity: '普通', color: 0xfbbf24 },
  { id: 'energy', text: '能量药水', type: 'energy', value: 35, weight: 16, rarity: '普通', color: 0x5ec8ff },
  { id: 'candy', text: '星芒戒指', type: 'food', value: '星芒戒指', weight: 10, rarity: '优秀', color: 0xff7eb0 },
  { id: 'milk', text: '月蚀护符', type: 'food', value: '月蚀护符', weight: 8, rarity: '优秀', color: 0xe8f1ff },
  { id: 'ticket', text: '幸运券', type: 'ticket', value: 1, weight: 6, rarity: '稀有', color: 0xc7a7ff },
  { id: 'meat', text: '守护晶核', type: 'food', value: '守护晶核', weight: 5, rarity: '稀有', color: 0xff9f43 },
  { id: 'jackpot', text: '大奖宝箱', type: 'goldScale', value: 8, weight: 3, rarity: '大奖', color: 0xffd700, rare: true }
];

var SPIN_PITY_LIMIT = 10;

var CHECKIN_REWARDS = [
  { gold: 100, bonus: null },
  { gold: 200, bonus: null },
  { gold: 300, bonus: { name: '幸运券', icon: '🎡' } },
  { gold: 400, bonus: null },
  { gold: 500, bonus: { name: '星芒戒指', icon: '✦' } },
  { gold: 600, bonus: null },
  { gold: 1000, bonus: { name: '守护晶核', icon: '◆' } }
];

var DAILY_TASKS = [
  { id: 'kills', desc: '击杀50只怪物', target: 50, reward: 200, track: function(s) { return s._dailyKills || 0; } },
  { id: 'clicks', desc: '点击200次', target: 200, reward: 150, track: function(s) { return s._dailyClicks || 0; } },
  { id: 'waves', desc: '通关5波', target: 5, reward: 300, track: function(s) { return s._dailyWaves || 0; } }
];

// S2-C：邮件表是浏览器版的「本地固定内容」，随版本一起发布，不联网下发、不接 CMS。
// 8 封按主角等级解锁，领取标记写在存档的 mailClaimed；远端拉取需要后端，H5 静态托管不适用。
// 条数以 C1 代码实证为准（8 封），SPEC §11 的「3 封假邮件」已失真。
var MAIL_REWARDS = [
  { id: 'welcome', level: 1, from: '系统', title: '欢迎来到DMAX挂机英雄', body: '新手启程礼包', rewardText: '100金', type: 'gold', value: 100 },
  { id: 'lv5', level: 5, from: '训练官', title: '主角Lv.5奖励', body: '开始挑战更高波次', rewardText: '200金', type: 'gold', value: 200 },
  { id: 'lv10', level: 10, from: '补给站', title: '主角Lv.10奖励', body: '补充冲关能量', rewardText: '30能量', type: 'energy', value: 30 },
  { id: 'lv20', level: 20, from: '秘宝阁', title: '主角Lv.20奖励', body: '稀有装备试炼', rewardText: '星芒戒指x1', type: 'food', value: '星芒戒指' },
  { id: 'lv35', level: 35, from: '公会', title: '主角Lv.35奖励', body: 'BOSS挑战资助', rewardText: '2000金', type: 'gold', value: 2000 },
  { id: 'lv50', level: 50, from: '远征队', title: '主角Lv.50奖励', body: '准备跨章节作战', rewardText: '守护晶核x1', type: 'food', value: '守护晶核' },
  { id: 'lv80', level: 80, from: '星门', title: '主角Lv.80奖励', body: '高阶成长基金', rewardText: '8000金', type: 'gold', value: 8000 },
  { id: 'lv120', level: 120, from: '议会', title: '主角Lv.120奖励', body: '转生前冲刺补给', rewardText: '20000金', type: 'gold', value: 20000 }
];

// S2-C：公告同样是本地固定内容（9 条，C1 实证），不联网更新；版本号取 window.DMAX_GAME_VERSION。
var ANNOUNCEMENTS = [
  { tag: '生存', color: 0x7be8b7, text: '新增续航体系：击杀回血提高，雷霆附带护盾，棉花糖治疗，布丁定期守护。' },
  { tag: '武器', color: 0x9b1d35, text: '新增稀有核心武器血月法杖：中后期BOSS低概率掉落，获得后造成伤害可少量吸血。' },
  { tag: '转生', color: 0x9b59b6, text: '新增转生天赋：消耗转生钻石选择攻击、生存、节奏或资源路线，形成长期策略。' },
  { tag: '图签', color: 0x2ecc71, text: '新增图签研究：重复击杀同类怪物会提升研究等级，对该怪物和对应BOSS获得额外伤害。' },
  { tag: '装备', color: 0xe67e22, text: '新增装备锻造：BOSS必掉锻造石，高波怪物概率掉落，可在升级面板强化4件核心装备。' },
  { tag: '玩法', color: 0xe74c3c, text: '新增章节推进：每击杀5个BOSS进入新场地，阶段奖励会提高金币、能量与队友收益。' },
  { tag: '战斗', color: 0x3498db, text: '技能改为只看冷却，不再消耗能量；不同技能分别强化爆发、攻速、范围与暴击。' },
  { tag: '养成', color: 0x2ecc71, text: '辅助英雄需要达到主角等级并花费金币招募，未招募前不会攻击。' },
  { tag: '系统', color: 0xf39c12, text: '修正每日任务重复领取、邮件奖励、公告入口、转生说明与能量购买边界问题。' }
];

var ACHIEVEMENTS = [
  { id: 'w10',       icon: '🌊', name: '初出茅庐',   desc: '到达第10波',      reward: 300,   check: function(g) { return g.maxWaveReached >= 10; } },
  { id: 'w50',       icon: '🌊', name: '乘风破浪',   desc: '到达第50波',      reward: 3000,  check: function(g) { return g.maxWaveReached >= 50; } },
  { id: 'w100',      icon: '🌊', name: '波涛汹涌',   desc: '到达第100波',     reward: 10000, check: function(g) { return g.maxWaveReached >= 100; } },
  { id: 'w200',      icon: '🌊', name: '无尽征途',   desc: '到达第200波',     reward: 50000, check: function(g) { return g.maxWaveReached >= 200; } },
  { id: 'kill1000',  icon: '⚔️', name: '怪物克星',   desc: '击杀1000只怪物',  reward: 2000,  check: function(g) { return g.stats.totalKills >= 1000; } },
  { id: 'kill10000', icon: '⚔️', name: '杀戮之王',   desc: '击杀10000只怪物', reward: 10000, check: function(g) { return g.stats.totalKills >= 10000; } },
  { id: 'lv10',      icon: '⬆️', name: '实力不凡',   desc: '主角达到10级',    reward: 500,   check: function(g) { return g.mainLevel >= 10; } },
  { id: 'lv30',      icon: '⬆️', name: '登峰造极',   desc: '主角达到30级',    reward: 5000,  check: function(g) { return g.mainLevel >= 30; } },
  { id: 'rebirth1',  icon: '💎', name: '初次转生',   desc: '完成首次转生',    reward: 2000,  check: function(g) { return g.rebirthGems > 0; } },
  { id: 'rebirth10', icon: '💎', name: '转生大师',   desc: '累计获得50宝石',  reward: 20000, check: function(g) { return g.rebirthGems >= 50; } },
  { id: 'allskills', icon: '🔓', name: '技能大师',   desc: '解锁所有技能',     reward: 5000,  check: function(g) { return g.skillUnlocked.every(function(u){return u;}); } },
  { id: 'allsupport',icon: '👥', name: '满编战队',   desc: '解锁所有队友',     reward: 10000, check: function(g) { return g.supports.every(function(s, idx){return g.isSupportActive(idx);}); } },
  { id: 'boss1',     icon: '💀', name: 'BOSS终结者', desc: '击杀1个BOSS',     reward: 500,   check: function(g) { return g.stats.bossKills >= 1; } },
  { id: 'boss50',    icon: '💀', name: 'BOSS猎人',   desc: '击杀50个BOSS',    reward: 15000, check: function(g) { return g.stats.bossKills >= 50; } }
];

// ==================== Main 入口类 ====================
function Main() {
  eui.UILayer.call(this);
  this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
}
Main.prototype = Object.create(eui.UILayer.prototype);
Main.prototype.constructor = Main;

Main.prototype.showBootOverlay = function(text) {
  var stage = this.stage;
  var sw = stage ? stage.stageWidth : 375;
  var sh = stage ? stage.stageHeight : 667;
  var scale = Math.min(sw / 375, sh / 667);
  var overlay = new eui.Group();
  overlay.name = 'dmaxBootOverlay';
  overlay.touchEnabled = true;
  overlay.width = sw;
  overlay.height = sh;

  var bg = new eui.Rect();
  bg.width = sw;
  bg.height = sh;
  bg.fillColor = 0x070416;
  overlay.addChild(bg);

  var glow = new egret.Shape();
  var gg = glow.graphics;
  gg.beginFill(0x24164f, 0.64);
  gg.drawCircle(sw / 2, sh * 0.29, Math.max(sw, sh) * 0.32);
  gg.endFill();
  glow.alpha = 0.82;
  overlay.addChild(glow);

  var card = new eui.Group();
  card.width = Math.min(sw - 48 * scale, 310 * scale);
  card.height = 214 * scale;
  card.x = (sw - card.width) / 2;
  card.y = sh * 0.46 - card.height / 2;
  overlay.addChild(card);

  var cardBg = new eui.Rect();
  cardBg.percentWidth = 100;
  cardBg.percentHeight = 100;
  cardBg.fillColor = 0x0c0820;
  cardBg.fillAlpha = 0.92;
  cardBg.strokeColor = 0xfbbf24;
  cardBg.strokeAlpha = 0.76;
  cardBg.strokeWeight = Math.max(1, scale);
  cardBg.ellipseWidth = 18 * scale;
  cardBg.ellipseHeight = 18 * scale;
  card.addChild(cardBg);

  var markBg = new eui.Rect();
  markBg.width = 72 * scale;
  markBg.height = 72 * scale;
  markBg.ellipseWidth = markBg.width;
  markBg.ellipseHeight = markBg.height;
  markBg.fillColor = 0xfbbf24;
  markBg.x = (card.width - markBg.width) / 2;
  markBg.y = 22 * scale;
  card.addChild(markBg);

  var mark = new eui.Label();
  mark.text = 'D';
  mark.size = Math.round(34 * scale);
  mark.bold = true;
  mark.textColor = 0x170b1f;
  mark.width = markBg.width;
  mark.textAlign = egret.HorizontalAlign.CENTER;
  mark.verticalAlign = egret.VerticalAlign.MIDDLE;
  mark.x = markBg.x;
  mark.y = markBg.y + 17 * scale;
  card.addChild(mark);

  var title = new eui.Label();
  title.text = 'DMAX 挂机英雄';
  title.size = Math.round(24 * scale);
  title.bold = true;
  title.textColor = 0xfff7d6;
  title.width = card.width;
  title.textAlign = egret.HorizontalAlign.CENTER;
  title.y = 112 * scale;
  card.addChild(title);

  var sub = new eui.Label();
  sub.text = text || '正在唤醒星空遗迹';
  sub.size = Math.round(12 * scale);
  sub.textColor = 0xbdb4df;
  sub.width = card.width;
  sub.textAlign = egret.HorizontalAlign.CENTER;
  sub.y = 144 * scale;
  card.addChild(sub);

  var barBg = new eui.Rect();
  barBg.width = card.width - 48 * scale;
  barBg.height = 10 * scale;
  barBg.x = 24 * scale;
  barBg.y = 166 * scale;
  barBg.fillColor = 0x0d0926;
  barBg.ellipseWidth = 8 * scale;
  barBg.ellipseHeight = 8 * scale;
  card.addChild(barBg);

  var barFill = new eui.Rect();
  barFill.width = barBg.width * 0.86;
  barFill.height = barBg.height;
  barFill.x = barBg.x;
  barFill.y = barBg.y;
  barFill.fillColor = 0x7be8b7;
  barFill.ellipseWidth = barBg.ellipseWidth;
  barFill.ellipseHeight = barBg.ellipseHeight;
  card.addChild(barFill);

  var status = new eui.Label();
  status.text = '构建首帧中...';
  status.size = Math.round(12 * scale);
  status.textColor = 0xf4d789;
  status.width = card.width;
  status.textAlign = egret.HorizontalAlign.CENTER;
  status.y = 190 * scale;
  card.addChild(status);

  this.addChild(overlay);
  this._bootOverlay = overlay;
  this._bootOverlayShownAt = Date.now();
  return overlay;
};

Main.prototype.hideBootOverlay = function() {
  var overlay = this._bootOverlay;
  if (!overlay || !overlay.parent) return;
  var elapsed = Date.now() - (this._bootOverlayShownAt || Date.now());
  var wait = Math.max(0, 520 - elapsed);
  var self = this;
  var removed = false;
  var forceRemove = function() {
    if (removed) return;
    removed = true;
    if (overlay.parent) overlay.parent.removeChild(overlay);
    if (self._bootOverlay === overlay) self._bootOverlay = null;
  };
  // Egret Tween 依赖引擎 ticker（rAF）。iframe / 后台标签被浏览器节流时 tween 可能
  // 永不回调，启动遮罩会一直停在「构建首帧中...」。用原生 setTimeout 强制兜底移除。
  setTimeout(forceRemove, wait + 600);
  setTimeout(function() {
    try {
      egret.Tween.get(overlay).to({ alpha: 0 }, 260).call(forceRemove);
    } catch (e) { forceRemove(); }
  }, wait);
};

Main.prototype.onAdd = function() {
  this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
  var self = this;
  if (typeof window !== 'undefined') window.__dmaxMain = this;
  this.showBootOverlay('正在进入微信小游戏');
  // 启动兜底：new Game() 抛错或引擎 ticker 被节流时，遮罩也不能永久停留。
  var guard = setTimeout(function() { self.hideBootOverlay(); }, 800);
  setTimeout(function() {
    try {
      self.game = new Game(self);
      if (typeof window !== 'undefined') window.__dmaxGame = self.game;
      if (self._bootOverlay && self._bootOverlay.parent) self.setChildIndex(self._bootOverlay, self.numChildren - 1);
      if (typeof window !== 'undefined' && window.DMAX_HIDE_LOADING) window.DMAX_HIDE_LOADING();
      clearTimeout(guard);
      self.hideBootOverlay();
    } catch (e) {
      clearTimeout(guard);
      var msg = (e && e.message) ? e.message : String(e);
      if (typeof window !== 'undefined') {
        window.__dmaxBootError = msg;
        try { console.error('[DMAX] boot failed: ' + msg, e); } catch (e2) {}
        try {
          var st = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('status') : null;
          if (st) { st.style.display = 'block'; st.textContent = '启动失败：' + msg; }
        } catch (e3) {}
      }
      self.hideBootOverlay();
    }
  }, 80);
};

// ==================== Game 类 ====================
function Game(main) {
  this.main = main;
  // G 批次：先装全局错误记录，后续 buildUI / 存档 / 定时器出的问题都可被观测。
  this.installGlobalErrorHooks();

  // --- 游戏状态 ---
  this.gold = 0;
  this.energy = 100;
  this.playerHp = 0;
  this.mainLevel = 1;
  this.wave = 1;
  this.totalCleared = 0;
  this.killCount = 0;
  this.skillCD = [0,0,0,0,0,0,0];
  this.skillUnlocked = [true,false,false,false,false,false,false];
  this.skillLevels = [1,1,1,1,1,1,1];
  this.skillBuffs = { attackTime: 0, attackMult: 1, speedTime: 0, speedMult: 1, critTime: 0, critBonus: 0, shieldTime: 0, shieldReduce: 0 };
  this.bossDebuffs = { critDownTime: 0, cooldownSlowTime: 0, energyBurnTime: 0 };
  this.supports = SUPPORTS_DEF.map(function(s) {
    return { name: s.name, dps: s.dps, wave: s.wave, level: 1, unlocked: false, notified: false };
  });
  this.supportShopVersion = 3;
  this.monsters = [];
  this.foods = {};
  this.ensureRelics();
  this.equipmentLevels = [];
  this.forgeStones = 0;
  this.coreWeapon = { owned: false, pity: 0 };
  this.ensureEquipment();
  this.freeSpins = 3;
  this.spinDate = new Date().toDateString();
  this.spinTickets = 0;
  this.spinPity = 0;
  this.totalSpins = 0;
  this.lastSpinPrize = '';
  this.spinHistory = [];
  this.stats = { totalKills: 0, totalGold: 0, totalClicks: 0, playTime: 0, bossKills: 0 };
  this.achievements = [];
  this.bossRewards = {};
  this.checkinDay = 0;
  this.checkinDate = '';
  this.dailyTaskDate = '';
  this.dailyTaskDone = [false, false, false];
  this.dailyTaskClaimed = [false, false, false];
  this.mailClaimed = {};
  this.offlineCap = 8;
  this.autoAttackEnabled = true;
  this.musicMuted = false;
  this.sfxMuted = false;
  this.detailMode = true;

  // --- 转生系统 ---
  this.rebirthGems = 0;
  this.rebirthTalents = [];
  this.ensureRebirthTalents();
  this.maxWaveReached = 0;
  this.lastRebirthBossStage = 0;
  this.rebirthCount = 0;

  // --- 图签系统（怪物图鉴收集） ---
  this.monsterCodex = {}; // { 'slime': { encountered: true, kills: 数量 }, ... }

  // --- 玩家个性化 ---
  this.avatarIdx = 0;       // 头像索引（0-5）
  this.playerName = makeDefaultPlayerName(); // 玩家昵称
  this.jobId = 'trainee_mage'; // S2：默认职业为全 0 加成基线，转职后写入具体职业

  // --- BOSS计时器 ---
  this.bossActive = false;
  this.bossTimer = 0;
  this._bossTimerInterval = null;
  this.bossCounter = null;
  this.bossRetryLock = null;
  this.pendingBossReward = null;

  // --- UI引用 ---
  this.goldLabel = null;
  this.waveLabel = null;
  this.levelLabel = null;
  this.dpsLabel = null;
  this.energyLabel = null;
  this.playerHpFill = null;
  this.playerHpLabel = null;
  this.goalLabel = null;
  this.exploreLabel = null;
  this.waveFill = null;
  this.buffLabel = null;
  this.gemsLabel = null;
  this.bossTimerBg = null;
  this.bossTimerBar = null;
  this.autoBtnBg = null;
  this.autoBtnLabel = null;
  this.monsterViews = [];
  this.skillBtns = [];
  this.damageLayer = null;
  this.battleGroup = null;
  this.fieldSkin = null;
  this._detailViews = [];
  this._sceneIndex = -1;
  this._panelOverlay = null;
  this._activePanel = null;
  this._panelAutoCloseTimer = null;
  this._toastGroup = null;
  this._justHitMonster = false;
  this._bgmTimer = null;
  this._bgmStep = 0;
  this._lastSupportSfx = 0;
  this._lastBattleShake = 0;

  this.loadGame();
  try {
    var detailPref = localStorage.getItem('gujiyouxi_detail_mode');
    if (detailPref !== null) this.detailMode = detailPref !== '0';
  } catch(e) {}
  this.playerHp = Math.min(this.getMaxPlayerHp(), Math.max(1, this.playerHp || this.getMaxPlayerHp()));
  this.initSound();
  this.buildUI();
  this.spawnWave();
  this.bindEvents();
  this.startLoop();
  this.checkOfflineReward();

  // 监听舞台尺寸变化（设备旋转 / 地址栏伸缩 / 窗口拖拽）
  // fixedWidth 模式下宽度恒为 375，主要需要让全屏覆盖层跟随新高度
  if (this.main.stage) {
    this.main.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
  }
}

// ==================== 工具方法 ====================

Game.prototype.fmt = function(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n + '';
};

Game.prototype.getJobDef = function(jobId) {
  var id = jobId || this.jobId || 'trainee_mage';
  for (var i = 0; i < JOB_DEFS.length; i++) {
    if (JOB_DEFS[i].id === id) return JOB_DEFS[i];
  }
  return JOB_DEFS[0];
};

Game.prototype.getJobName = function() {
  return this.getJobDef(this.jobId).name;
};

// S2：把 JOB_DEFS.bonus 归一化为 getBuffs() 可直接合并的完整字段集。
// 未知 / 非法 jobId 由 getJobDef() 兜底到 trainee_mage → 全 0，不会污染战斗数值。
Game.prototype.getJobBuffs = function() {
  var b = this.getJobDef(this.jobId).bonus || {};
  return {
    attack: b.attack || 0, crit: b.crit || 0, hp: b.hp || 0,
    speed: b.speed || 0, defense: b.defense || 0, gold: b.gold || 0,
    bossDamage: b.bossDamage || 0, cooldown: b.cooldown || 0, forge: b.forge || 0
  };
};

// 玩家可读的加成摘要。职业页 / 转职 toast 共用同一真值源，避免文案与实装漂移。
Game.prototype.getJobBonusText = function(def) {
  var d = def || this.getJobDef(this.jobId);
  var b = d.bonus || {};
  if (b.attack) return '主角攻击 +' + Math.round(b.attack * 100) + '%';
  if (b.crit) return '暴击率 +' + Math.round(b.crit * 100) + '%';
  if (b.hp) return '生命上限 +' + Math.round(b.hp * 100) + '%';
  if (b.speed) return '攻速 +' + Math.round(b.speed * 100) + '%';
  if (b.gold) return '金币收益 +' + Math.round(b.gold * 100) + '%';
  if (b.bossDamage) return 'BOSS 伤害 +' + Math.round(b.bossDamage * 100) + '%';
  if (b.defense) return '防御 +' + b.defense;
  return '无额外加成（初始称号）';
};

Game.prototype.refreshJobHud = function() {
  var job = this.getJobDef(this.jobId);
  if (this.jobLabel) {
    this.jobLabel.text = job.name;
    this.jobLabel.textColor = job.color || 0xc7a7ff;
  }
  if (this._jobBtnBg) this._jobBtnBg.strokeColor = job.color || THEME.lavender;
};

Game.prototype.waveText = function() {
  return '第 ' + this.wave + ' 波' + (this.wave % 10 === 0 ? ' 💀BOSS' : '');
};

Game.prototype.compactWaveText = function() {
  return this.wave + (this.wave % 10 === 0 ? 'B' : '波');
};

Game.prototype.getProgressInfoForWave = function(wave) {
  var bossStage = Math.max(1, Math.ceil(Math.max(1, wave) / 10));
  var chapter = Math.floor((bossStage - 1) / BOSSES_PER_CHAPTER) + 1;
  var chapterBoss = ((bossStage - 1) % BOSSES_PER_CHAPTER) + 1;
  var scenes = BATTLE_SCENES || [];
  var scene = scenes.length ? scenes[(bossStage - 1) % scenes.length] : { name: '未知场地', asset: UI_ASSETS.battleBackground };
  return { bossStage: bossStage, chapter: chapter, chapterBoss: chapterBoss, scene: scene };
};

Game.prototype.getProgressInfoForBossStage = function(stage) {
  return this.getProgressInfoForWave(Math.max(1, stage) * 10);
};

Game.prototype.getProgressTitle = function(wave) {
  var p = this.getProgressInfoForWave(wave || this.wave);
  return '第' + p.chapter + '章 ' + p.scene.name;
};

Game.prototype.getExploreText = function() {
  var p = this.getProgressInfoForWave(this.wave);
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  if (this.wave % 10 === 0) return '第' + p.chapter + '章 ' + p.scene.name + ' · 第' + this.wave + '波 BOSS战';
  return '第' + p.chapter + '章 ' + p.scene.name + ' · 第' + this.wave + '波 · 距BOSS ' + (10 - waveInCycle);
};

Game.prototype.totalDps = function() {
  var buffs = this.getBuffs();
  var base = CONFIG.mainDmg(this.mainLevel, this.rebirthGems);
  var supMult = CONFIG.rebirthSupportMult(this.rebirthGems);
  var sup = 0;
  for (var i = 0; i < this.supports.length; i++) {
    if (this.isSupportActive(i)) sup += this.supports[i].dps * this.supports[i].level;
  }
  return Math.floor(base * buffs.attackMult) + Math.floor(sup * supMult * buffs.supportMult);
};

Game.prototype.getSupportDpsEstimate = function() {
  var buffs = this.getBuffs();
  var total = 0;
  for (var i = 0; i < this.supports.length; i++) {
    if (!this.isSupportActive(i)) continue;
    var def = SUPPORTS_DEF[i];
    var s = this.supports[i];
    var interval = def && def.atkInterval ? def.atkInterval / 1000 : 1.2;
    total += (s.dps * s.level * 0.8 * buffs.supportMult) / interval;
  }
  return Math.floor(total);
};

Game.prototype.getDamageTypeName = function(type) {
  if (type === 'phys') return '物理';
  if (type === 'magic') return '法术';
  if (type === 'true') return '真实';
  return '普通';
};

Game.prototype.getCodexResearchLevel = function(shape, isBossType) {
  var entry = this.monsterCodex && this.monsterCodex[shape];
  var kills = entry ? (entry.kills || 0) : 0;
  var marks = isBossType ? [1, 3, 8, 15, 30] : [10, 35, 100, 250, 600];
  var lv = 0;
  for (var i = 0; i < marks.length; i++) {
    if (kills >= marks[i]) lv++;
  }
  return lv;
};

Game.prototype.getCodexDamageBonus = function(shape, isBossType) {
  var lv = this.getCodexResearchLevel(shape, isBossType);
  return lv * (isBossType ? 0.035 : 0.02);
};

Game.prototype.getCodexNextResearchKills = function(shape, isBossType) {
  var entry = this.monsterCodex && this.monsterCodex[shape];
  var kills = entry ? (entry.kills || 0) : 0;
  var marks = isBossType ? [1, 3, 8, 15, 30] : [10, 35, 100, 250, 600];
  for (var i = 0; i < marks.length; i++) {
    if (kills < marks[i]) return marks[i];
  }
  return null;
};

Game.prototype.getBossStrategy = function(bossType) {
  if (!bossType) return '观察BOSS蓄力，保留一个技能用于打断。';
  var weak = this.getDamageTypeName(bossType.weakness);
  if (bossType.shape === 'boss_eye') return '弱点：' + weak + '。抗暴击，优先用破岳和连斩稳定输出，蓄力时立刻放技能打断。';
  if (bossType.shape === 'boss_giant') return '弱点：' + weak + '。物防很高，多用裂光、糖风、雷霆、星陨打穿重甲。';
  if (bossType.shape === 'boss_spider') return '弱点：' + weak + '。蛛网会扣能量和时间，保留轻击或破岳打断蓄力。';
  if (bossType.shape === 'boss_demon') return '弱点：' + weak + '。法抗高且会灼烧能量，先保证生命和能量再挑战。';
  if (bossType.shape === 'boss_phoenix') return '弱点：' + weak + '。低血会涅槃，留星陨或高爆发技能做斩杀。';
  return '弱点：' + weak + '。观察蓄力，保留技能打断。';
};

Game.prototype.getResistanceMultiplier = function(m, damageType, isCrit) {
  if (!m || damageType === 'true') return 1;
  var type = damageType || 'phys';
  var stat = type === 'magic' ? (m.resist || 0) : (m.armor || 0);
  if (m.weakness === type) stat -= 18;
  if (m.trait === 'antiCrit' && isCrit) stat += 22;
  if (m.trait === 'shield' && !m._shieldBroken && type !== 'true') stat += 45;
  // F1：隐藏怪真实特性。damageType === 'true' 已在开头绕过，此处 type 只会是 phys / magic。
  if (m.trait === 'guard' && m.weakness !== type) stat += 14; // 守备：非弱点伤害额外抵挡
  if (m.trait === 'void') stat += 18;                          // 虚空：常规伤害大幅削弱
  stat = Math.max(-35, Math.min(85, stat));
  return 100 / (100 + stat);
};

Game.prototype.getMonsterEffectiveHp = function(wave, isBoss, mType, damageType) {
  var hp = CONFIG.monsterHp(wave) * (isBoss ? CONFIG.bossHpMult(wave) : 1);
  var temp = { armor: mType && mType.armor || 0, resist: mType && mType.resist || 0, weakness: mType && mType.weakness, trait: mType && mType.trait };
  var mult = this.getResistanceMultiplier(temp, damageType || 'phys', false);
  return hp / Math.max(0.35, mult);
};

Game.prototype.getSkillBurstEstimate = function(targetIsBoss) {
  var buffs = this.getBuffs();
  var base = CONFIG.mainDmg(this.mainLevel, this.rebirthGems);
  var total = 0;
  for (var i = 0; i < SKILLS.length; i++) {
    if (!this.skillUnlocked[i]) continue;
    var s = SKILLS[i];
    var dmg = base * buffs.attackMult * s.dmg * this.getSkillPowerMultiplier(i);
    if (targetIsBoss) dmg *= (buffs.bossDamageMult || 1);
    if (s.effect === 'boss' && targetIsBoss) dmg *= 2.15;
    if (s.effect === 'multi') dmg *= s.hits || 1;
    if (s.effect === 'meteor' && targetIsBoss) dmg *= 1.35;
    if (s.effect === 'critBuff') dmg *= 1.8;
    total += dmg / Math.max(1, this.getSkillCooldown(s));
  }
  return Math.floor(total);
};

Game.prototype.getCombatPower = function() {
  var buffs = this.getBuffs();
  var base = CONFIG.mainDmg(this.mainLevel, this.rebirthGems);
  var bossMult = buffs.bossDamageMult || 1;
  var heroDps = base * buffs.attackMult * buffs.speedMult * bossMult * (1 + Math.min(0.8, buffs.critChance));
  return Math.floor(heroDps + this.getSupportDpsEstimate() * bossMult + this.getSkillBurstEstimate(true));
};

Game.prototype.getRecommendedBossPower = function(bossWave) {
  var bossIdx = Math.floor(bossWave / 10 - 1) % BOSS_TYPES.length;
  var bossType = BOSS_TYPES[Math.max(0, bossIdx)] || BOSS_TYPES[0];
  var hp = this.getMonsterEffectiveHp(bossWave, true, bossType, bossType.weakness || 'phys');
  return Math.floor((hp / CONFIG.bossTimeLimit) * 1.18);
};

Game.prototype.getNextBossWave = function() {
  if (this.wave % 10 === 0) return this.wave;
  return Math.floor((this.wave - 1) / 10) * 10 + 10;
};

Game.prototype.getBossPowerInfo = function(bossWave) {
  var targetWave = bossWave || this.getNextBossWave();
  var current = this.getCombatPower();
  var recommended = this.getRecommendedBossPower(targetWave);
  var ratio = recommended > 0 ? current / recommended : 1;
  return {
    wave: targetWave,
    current: current,
    recommended: recommended,
    ratio: ratio,
    enough: ratio >= 1
  };
};

Game.prototype.setBossRetryLock = function(failedBossWave) {
  if (!failedBossWave || failedBossWave % 10 !== 0) return;
  this.bossRetryLock = {
    bossWave: failedBossWave,
    ready: true
  };
};

Game.prototype.getBossRetryLock = function() {
  return null;
};

Game.prototype.getBossRetryReady = function() {
  var lock = this.bossRetryLock;
  if (!lock || !lock.bossWave) return null;
  if (this.getNextBossWave() !== lock.bossWave) {
    this.bossRetryLock = null;
    return null;
  }
  return lock;
};

Game.prototype.advanceBossRetryLock = function(clearedWave) {
  var lock = this.getBossRetryReady();
  if (!lock || clearedWave % 10 !== 0) return;
  this.bossRetryLock = null;
};

Game.prototype.getBossPowerAdvice = function(info, hpPct) {
  info = info || this.getBossPowerInfo();
  var mainCost = CONFIG.upgradeCost(this.mainLevel);
  this.ensureEquipment();
  for (var eq = 0; eq < EQUIPMENT_DEFS.length; eq++) {
    if ((this.equipmentLevels[eq] || 0) < EQUIPMENT_DEFS[eq].max && this.forgeStones >= this.getEquipmentCost(eq)) {
      return '锻造' + EQUIPMENT_DEFS[eq].name + '可立即提升' + EQUIPMENT_DEFS[eq].desc + '。';
    }
  }
  for (var i = 0; i < this.supports.length; i++) {
    if (this.isSupportAvailable(i) && !this.supports[i].unlocked) {
      return '优先招募' + this.supports[i].name + '，增加挂机输出。';
    }
  }
  if (this.gold >= mainCost) return '金币够升级主角，先提升技能伤害。';
  for (var s = 0; s < this.supports.length; s++) {
    if (this.isSupportActive(s) && this.gold >= CONFIG.supportCost(this.supports[s].level)) {
      return '金币够升级队友，先补挂机输出。';
    }
  }
  if (!this.skillUnlocked[1]) return '主角升到Lv.3解锁破岳，BOSS输出会明显提升。';
  if (!this.skillUnlocked[3]) return '继续刷到Lv.8解锁裂光，配合破岳更稳。';
  if (hpPct !== undefined && hpPct <= 0.25) return '只差一点，刷一轮金币或强化技能后再挑战。';
  if (info.ratio < 0.75) return '战力差距较大，先刷金币升主角和队友。';
  this.ensureRebirthTalents();
  for (var rt = 0; rt < REBIRTH_TALENTS.length; rt++) {
    if ((this.rebirthTalents[rt] || 0) < REBIRTH_TALENTS[rt].max && this.rebirthGems >= this.getRebirthTalentCost(rt)) {
      return '转生天赋可升级，优先补' + REBIRTH_TALENTS[rt].name + '提升长期战力。';
    }
  }
  return '战力接近，提升秘宝或技能后可以尝试挑战。';
};

Game.prototype.isSupportActive = function(idx) {
  var s = this.supports[idx];
  var def = SUPPORTS_DEF[idx];
  if (!s || !def) return false;
  return !!s.unlocked && this.isSupportAvailable(idx);
};

Game.prototype.isSupportAvailable = function(idx) {
  var def = SUPPORTS_DEF[idx];
  if (!def) return false;
  return this.mainLevel >= (def.recruitLv || 1);
};

Game.prototype.getSupportRecruitPrice = function(idx) {
  var usesDiamond = idx >= 5;
  var amount = usesDiamond ? CONFIG.supportRecruitDiamondCost(idx) : CONFIG.supportRecruitGoldCost(idx);
  return {
    currency: usesDiamond ? 'diamond' : 'gold',
    amount: amount,
    label: usesDiamond ? ('💎' + amount) : (this.fmt(amount) + '金'),
    color: usesDiamond ? 0x8e44ad : 0x27ae60,
    enough: usesDiamond ? (this.rebirthGems >= amount) : (this.gold >= amount)
  };
};

Game.prototype.paySupportRecruitPrice = function(price) {
  if (!price || price.amount <= 0) return true;
  if (price.currency === 'diamond') {
    if (this.rebirthGems < price.amount) {
      this.showToast('钻石不足，需要' + price.amount + '钻石');
      return false;
    }
    this.rebirthGems -= price.amount;
    return true;
  }
  if (this.gold < price.amount) {
    this.showToast('金币不足，需要' + this.fmt(price.amount) + '金');
    return false;
  }
  this.gold -= price.amount;
  return true;
};

Game.prototype.getSupportRoleText = function(idx, support) {
  if (idx === 1) return '治疗型\n每6秒回复生命';
  if (idx === 3) return '守护型\n定期提供护盾';
  return 'DPS ' + this.fmt(support.dps) + '\n招募后自动攻击';
};

Game.prototype.ensureRelics = function() {
  if (!this.foods) this.foods = {};
  for (var i = 0; i < FOODS.length; i++) {
    if (this.foods[FOODS[i].name] === undefined) this.foods[FOODS[i].name] = 0;
    if (FOODS[i].max !== undefined) this.foods[FOODS[i].name] = Math.min(FOODS[i].max, this.foods[FOODS[i].name] || 0);
  }
};

Game.prototype.findRelicDef = function(name) {
  for (var i = 0; i < FOODS.length; i++) {
    if (FOODS[i].name === name) return FOODS[i];
  }
  return null;
};

Game.prototype.addRelic = function(name, amount) {
  this.ensureRelics();
  var def = this.findRelicDef(name);
  if (!def) return false;
  var cur = this.foods[name] || 0;
  var max = def.max !== undefined ? def.max : 99;
  var next = Math.min(max, cur + (amount || 1));
  this.foods[name] = next;
  return next > cur;
};

Game.prototype.ensureEquipment = function() {
  if (!this.equipmentLevels) this.equipmentLevels = [];
  for (var i = 0; i < EQUIPMENT_DEFS.length; i++) {
    if (this.equipmentLevels[i] === undefined) this.equipmentLevels[i] = 0;
    this.equipmentLevels[i] = Math.max(0, Math.min(EQUIPMENT_DEFS[i].max, this.equipmentLevels[i] || 0));
  }
  if (this.forgeStones === undefined || this.forgeStones === null) this.forgeStones = 0;
  if (!this.coreWeapon) this.coreWeapon = { owned: false, pity: 0 };
  this.coreWeapon.owned = !!this.coreWeapon.owned;
  this.coreWeapon.pity = Math.max(0, this.coreWeapon.pity || 0);
};

Game.prototype.getEquipmentCost = function(idx) {
  this.ensureEquipment();
  var lv = this.equipmentLevels[idx] || 0;
  return Math.floor(5 + idx * 3 + Math.pow(lv + 1, 1.45) * (5 + idx * 2));
};

Game.prototype.getEquipmentBuffs = function() {
  this.ensureEquipment();
  var buffs = { attack: 0, hp: 0, boss: 0, support: 0 };
  for (var i = 0; i < EQUIPMENT_DEFS.length; i++) {
    var def = EQUIPMENT_DEFS[i];
    var lv = this.equipmentLevels[i] || 0;
    if (def && buffs[def.stat] !== undefined) buffs[def.stat] += lv * def.per;
  }
  return buffs;
};

Game.prototype.addForgeStones = function(amount, reason, quiet) {
  this.ensureEquipment();
  amount = Math.max(0, amount || 0);
  var base = Math.floor(amount);
  var extra = Math.random() < (amount - base) ? 1 : 0;
  amount = base + extra;
  if (amount <= 0) return;
  this.forgeStones += amount;
  if (!quiet) this.showToast('获得锻造石 +' + amount + (reason ? ' · ' + reason : ''));
};

Game.prototype.maybeDropCoreWeapon = function() {
  this.ensureEquipment();
  if (this.coreWeapon.owned) return;
  var bossStage = Math.floor(this.wave / 10);
  if (bossStage < CORE_WEAPON_DEF.unlockBossStage) return;
  this.coreWeapon.pity++;
  var hitPity = this.coreWeapon.pity >= CORE_WEAPON_DEF.pity;
  if (!hitPity && Math.random() > CORE_WEAPON_DEF.dropChance) return;
  this.coreWeapon.owned = true;
  this.coreWeapon.pity = 0;
  this.showToast('核心武器觉醒：' + CORE_WEAPON_DEF.name + '，获得少量吸血');
  this.saveGame();
};

Game.prototype.getCoreWeaponText = function() {
  this.ensureEquipment();
  if (this.coreWeapon.owned) {
    return '已获得：造成伤害的' + Math.floor(CORE_WEAPON_DEF.lifesteal * 1000) / 10 + '%转为生命，每次最多回复' + Math.floor(CORE_WEAPON_DEF.healCap * 100) + '%最大生命';
  }
  var need = Math.max(0, CORE_WEAPON_DEF.pity - (this.coreWeapon.pity || 0));
  return '未获得：第' + CORE_WEAPON_DEF.unlockBossStage + '个BOSS后低概率掉落，保底还需' + need + '次';
};

Game.prototype.upgradeEquipment = function(idx) {
  this.ensureEquipment();
  var def = EQUIPMENT_DEFS[idx];
  if (!def) return;
  var lv = this.equipmentLevels[idx] || 0;
  if (lv >= def.max) { this.showToast(def.name + '已满阶'); return; }
  var cost = this.getEquipmentCost(idx);
  if (this.forgeStones < cost) { this.showToast('锻造石不足：需要' + cost); return; }
  this.forgeStones -= cost;
  this.equipmentLevels[idx] = lv + 1;
  this.showToast(def.name + '升至' + this.equipmentLevels[idx] + '阶');
  this.saveGame();
  this.updateUI();
  this.refreshUpgradePanel('equipment');
};

Game.prototype.ensureRebirthTalents = function() {
  if (!this.rebirthTalents) this.rebirthTalents = [];
  for (var i = 0; i < REBIRTH_TALENTS.length; i++) {
    if (this.rebirthTalents[i] === undefined) this.rebirthTalents[i] = 0;
    this.rebirthTalents[i] = Math.max(0, Math.min(REBIRTH_TALENTS[i].max, this.rebirthTalents[i] || 0));
  }
};

Game.prototype.getRebirthTalentCost = function(idx) {
  this.ensureRebirthTalents();
  var lv = this.rebirthTalents[idx] || 0;
  return Math.floor(2 + idx + Math.pow(lv + 1, 1.35) * (2 + idx));
};

Game.prototype.getRebirthTalentBuffs = function() {
  this.ensureRebirthTalents();
  var buffs = { attack: 0, hp: 0, defense: 0, speed: 0, cooldown: 0, gold: 0, forge: 0 };
  for (var i = 0; i < REBIRTH_TALENTS.length; i++) {
    var def = REBIRTH_TALENTS[i];
    var lv = this.rebirthTalents[i] || 0;
    var value = lv * def.per;
    if (def.stat === 'attack') buffs.attack += value;
    if (def.stat === 'survive') { buffs.hp += value; buffs.defense += lv * 3; }
    if (def.stat === 'tempo') { buffs.speed += value; buffs.cooldown += value; }
    if (def.stat === 'loot') { buffs.gold += value; buffs.forge += value; }
  }
  return buffs;
};

Game.prototype.upgradeRebirthTalent = function(idx) {
  this.ensureRebirthTalents();
  var def = REBIRTH_TALENTS[idx];
  if (!def) return;
  var lv = this.rebirthTalents[idx] || 0;
  if (lv >= def.max) { this.showToast(def.name + '已满级'); return; }
  var cost = this.getRebirthTalentCost(idx);
  if (this.rebirthGems < cost) { this.showToast('钻石不足：需要💎' + cost); return; }
  this.rebirthGems -= cost;
  this.rebirthTalents[idx] = lv + 1;
  this.showToast(def.name + '提升至Lv.' + this.rebirthTalents[idx]);
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openRebirth();
};

Game.prototype.repairSupportUnlocks = function() {
  for (var i = 0; i < this.supports.length; i++) {
    var def = SUPPORTS_DEF[i];
    if (!def) continue;
    if (!this.isSupportAvailable(i)) {
      this.supports[i].unlocked = false;
    }
  }
};

Game.prototype.getBuffs = function() {
  this.ensureRelics();
  this.ensureEquipment();
  var star = this.foods['星芒戒指'] || 0;
  var moon = this.foods['月蚀护符'] || 0;
  var wind = this.foods['疾风靴'] || 0;
  var core = this.foods['守护晶核'] || 0;
  var scale = this.foods['龙鳞护甲'] || 0;
  var equip = this.getEquipmentBuffs();
  var talent = this.getRebirthTalentBuffs();
  var job = this.getJobBuffs(); // S2：职业加成，默认职业全 0
  var sb = this.skillBuffs || {};
  var bd = this.bossDebuffs || {};
  var stage = this.getStageBonuses();
  var skillAttack = sb.attackTime > 0 ? (sb.attackMult || 1) : 1;
  var skillSpeed = sb.speedTime > 0 ? (sb.speedMult || 1) : 1;
  var skillCrit = sb.critTime > 0 ? (sb.critBonus || 0) : 0;
  return {
    critChance: Math.max(0.02, Math.min(0.85, 0.1 + star * 0.02 + skillCrit + job.crit - (bd.critDownTime > 0 ? 0.2 : 0))),
    attackMult: (1 + moon * 0.04 + equip.attack + talent.attack + job.attack) * skillAttack,
    speedMult: (1 + wind * 0.03 + talent.speed + job.speed) * skillSpeed,
    supportMult: 1 + core * 0.04 + stage.support + equip.support,
    hpMult: 1 + scale * 0.06 + equip.hp + talent.hp + job.hp,
    defenseBonus: scale * 4 + talent.defense + job.defense,
    bossDamageMult: 1 + equip.boss + job.bossDamage,
    cooldownBonus: talent.cooldown + job.cooldown,
    goldBonus: talent.gold + job.gold,
    forgeBonus: talent.forge + job.forge
  };
};

Game.prototype.getStageBonuses = function() {
  var bonuses = { gold: 0, energy: 0, support: 0, cooldown: 0 };
  var rewards = this.bossRewards || {};
  for (var key in rewards) {
    if (!rewards.hasOwnProperty(key) || !rewards[key]) continue;
    var stage = parseInt(key, 10);
    if (!stage || stage < 1) continue;
    if (stage % BOSSES_PER_CHAPTER === 0) {
      bonuses.gold += 0.03;
      bonuses.support += 0.03;
      continue;
    }
    var type = (stage - 1) % 4;
    if (type === 0) bonuses.gold += 0.05;
    else if (type === 1) bonuses.energy += 10;
    else if (type === 2) bonuses.support += 0.05;
    else bonuses.cooldown += 0.05;
  }
  return bonuses;
};

Game.prototype.getMaxEnergy = function() {
  return CONFIG.maxEnergy + this.getStageBonuses().energy;
};

Game.prototype.getMaxPlayerHp = function() {
  return Math.floor(CONFIG.playerHp(this.mainLevel, this.rebirthGems) * this.getBuffs().hpMult);
};

Game.prototype.getPlayerDefense = function() {
  return CONFIG.playerDefense(this.mainLevel, this.rebirthGems) + this.getBuffs().defenseBonus;
};

Game.prototype.getGoldReward = function(wave, isBoss) {
  return Math.floor(CONFIG.goldReward(wave, isBoss) * (1 + this.getStageBonuses().gold + (this.getBuffs().goldBonus || 0)));
};

Game.prototype.getSkillCooldown = function(skill) {
  var idx = SKILLS.indexOf(skill);
  var lv = idx >= 0 && this.skillLevels ? (this.skillLevels[idx] || 1) : 1;
  var cut = Math.min(0.45, this.getStageBonuses().cooldown + (this.getBuffs().cooldownBonus || 0));
  var levelCut = Math.min(0.25, (lv - 1) * 0.025);
  var slow = this.bossDebuffs && this.bossDebuffs.cooldownSlowTime > 0 ? 2 : 0;
  return Math.max(2, Math.ceil(skill.cd * (1 - cut - levelCut)) + slow);
};

Game.prototype.getSkillPowerMultiplier = function(idx) {
  var lv = this.skillLevels && this.skillLevels[idx] ? this.skillLevels[idx] : 1;
  return 1 + (lv - 1) * 0.14;
};

Game.prototype.getSkillBuffBonus = function(idx) {
  var lv = this.skillLevels && this.skillLevels[idx] ? this.skillLevels[idx] : 1;
  return Math.max(0, lv - 1);
};

Game.prototype.getBossStageReward = function(stage) {
  if (stage % BOSSES_PER_CHAPTER === 0) {
    var p = this.getProgressInfoForBossStage(stage);
    return {
      title: '第' + p.chapter + '章突破',
      desc: '章节通关奖励：金币收益 +3%，队友伤害 +3%',
      color: 0xc7a7ff,
      chapterClear: true
    };
  }
  var type = (stage - 1) % 4;
  if (type === 0) return { title: '金币收益 +5%', desc: '所有刷怪和BOSS金币永久提高', color: 0xfbbf24 };
  if (type === 1) return { title: '能量上限 +10', desc: '点击输出空间更大，冲Boss更稳', color: 0x5ec8ff };
  if (type === 2) return { title: '队友伤害 +5%', desc: '挂机清怪效率永久提高', color: 0x7be8b7 };
  return { title: '技能冷却 -5%', desc: '爆发技能循环更快，Boss战更主动', color: 0xc7a7ff };
};

Game.prototype.claimBossStageReward = function(stage) {
  if (!this.bossRewards) this.bossRewards = {};
  if (this.bossRewards[stage]) return null;
  this.bossRewards[stage] = true;
  return this.getBossStageReward(stage);
};

Game.prototype.getRebirthPlan = function() {
  var highestBossStage = Math.floor((this.maxWaveReached || 0) / 10);
  var newBossStages = Math.max(0, highestBossStage - (this.lastRebirthBossStage || 0));
  var chapterClears = Math.floor(highestBossStage / BOSSES_PER_CHAPTER) - Math.floor((this.lastRebirthBossStage || 0) / BOSSES_PER_CHAPTER);
  chapterClears = Math.max(0, chapterClears);
  var levelBonus = Math.floor((this.mainLevel || 1) / 25);
  var gemsGain = newBossStages * 2 + chapterClears * 5 + levelBonus;
  var needStage = highestBossStage < REBIRTH_MIN_BOSS_STAGE;
  var needNewBosses = newBossStages < REBIRTH_MIN_NEW_BOSSES;
  var canRebirth = !needStage && !needNewBosses && gemsGain > 0;
  var reason = '';
  if (needStage) {
    reason = '需要先通关第1章：击杀第' + REBIRTH_MIN_BOSS_STAGE + '个BOSS';
  } else if (needNewBosses) {
    reason = '需要本轮新增击杀' + REBIRTH_MIN_NEW_BOSSES + '个BOSS（当前' + newBossStages + '/' + REBIRTH_MIN_NEW_BOSSES + '）';
  } else {
    reason = '条件满足：可把本轮进度兑换成永久宝石';
  }
  return {
    highestBossStage: highestBossStage,
    newBossStages: newBossStages,
    chapterClears: chapterClears,
    levelBonus: levelBonus,
    gemsGain: gemsGain,
    canRebirth: canRebirth,
    reason: reason
  };
};

Game.prototype.tickSkillBuffs = function() {
  if (!this.skillBuffs) this.skillBuffs = { attackTime: 0, attackMult: 1, speedTime: 0, speedMult: 1, critTime: 0, critBonus: 0, shieldTime: 0, shieldReduce: 0 };
  if (!this.bossDebuffs) this.bossDebuffs = { critDownTime: 0, cooldownSlowTime: 0, energyBurnTime: 0 };
  if (this.skillBuffs.attackTime > 0) this.skillBuffs.attackTime--;
  if (this.skillBuffs.speedTime > 0) this.skillBuffs.speedTime--;
  if (this.skillBuffs.critTime > 0) this.skillBuffs.critTime--;
  if (this.skillBuffs.shieldTime > 0) this.skillBuffs.shieldTime--;
  if (this.skillBuffs.shieldTime <= 0) this.skillBuffs.shieldReduce = 0;
  if (this.bossDebuffs.critDownTime > 0) this.bossDebuffs.critDownTime--;
  if (this.bossDebuffs.cooldownSlowTime > 0) this.bossDebuffs.cooldownSlowTime--;
  if (this.bossDebuffs.energyBurnTime > 0) {
    this.bossDebuffs.energyBurnTime--;
    if (this.bossActive) this.energy = Math.max(0, this.energy - 2);
  }
};

Game.prototype.findPriorityTargetIndex = function() {
  var targetIdx = -1;
  for (var i = 0; i < this.monsters.length; i++) {
    var m = this.monsters[i];
    if (!m || m.hp <= 0) continue;
    if (targetIdx < 0 || m.hp > this.monsters[targetIdx].hp) targetIdx = i;
  }
  return targetIdx;
};

Game.prototype.createButton = function(text, color, w, h, handler, ctx) {
  var g = new eui.Group();
  g.width = w; g.height = h;
  var bg = new eui.Rect();
  bg.width = w; bg.height = h; bg.fillColor = color;
  bg.ellipseWidth = 8; bg.ellipseHeight = 8;
  bg.percentWidth = 100; bg.percentHeight = 100;
  bg.strokeColor = THEME.accentSoft; bg.strokeWeight = 1; bg.strokeAlpha = 0.55;
  g.addChild(bg);
  var lb = new eui.Label();
  lb.text = text; lb.size = 12; lb.textColor = 0xffffff; lb.bold = true;
  lb.horizontalCenter = 0; lb.verticalCenter = 0;
  g.addChild(lb);
  g.touchEnabled = true;
  var self = this;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, function(e) {
    self.sfxClick();
    if (handler) handler.call(ctx || self, e);
  }, this);
  return g;
};

Game.prototype.fitImageToBox = function(img, source, boxW, boxH, x, y) {
  var meta = UI_ASSET_SIZES[source] || { w: boxW, h: boxH };
  var scale = Math.min(boxW / meta.w, boxH / meta.h);
  var w = Math.max(1, Math.round(meta.w * scale));
  var h = Math.max(1, Math.round(meta.h * scale));
  img.source = source;
  img.width = w;
  img.height = h;
  img.x = (x || 0) + Math.round((boxW - w) / 2);
  img.y = (y || 0) + Math.round((boxH - h) / 2);
  img.touchEnabled = false;
  return img;
};

Game.prototype.coverImageInBox = function(img, source, boxW, boxH, x, y) {
  var meta = UI_ASSET_SIZES[source] || { w: boxW, h: boxH };
  var scale = Math.max(boxW / meta.w, boxH / meta.h);
  var w = Math.max(1, Math.round(meta.w * scale));
  var h = Math.max(1, Math.round(meta.h * scale));
  img.source = source;
  img.width = w;
  img.height = h;
  img.x = (x || 0) + Math.round((boxW - w) / 2);
  img.y = (y || 0) + Math.round((boxH - h) / 2);
  img.touchEnabled = false;
  return img;
};

Game.prototype.getBattleSceneIndex = function() {
  var scenes = BATTLE_SCENES || [];
  if (scenes.length === 0) return 0;
  return (this.getProgressInfoForWave(this.wave).bossStage - 1) % scenes.length;
};

Game.prototype.getBattleScene = function() {
  var scenes = BATTLE_SCENES || [];
  if (scenes.length === 0) return { name: '', asset: UI_ASSETS.battleBackground };
  return scenes[this.getBattleSceneIndex()] || scenes[0];
};

Game.prototype.updateBattleScene = function(animate) {
  if (!this.fieldSkin) return;
  var idx = this.getBattleSceneIndex();
  if (idx === this._sceneIndex && this.fieldSkin.source) return; // V1-6 保留幂等短路
  var scene = this.getBattleScene();
  var oldSource = this.fieldSkin.source;
  this._sceneIndex = idx;
  this.coverImageInBox(this.fieldSkin, scene.asset, this._stageW || 375, this._battleH || 423, 0, 0);
  if (this._v1Crossfade === false) {
    // 单点回退：退回 V1 前的单图淡入，并拆掉持久色调层。
    if (this._v1DayTint && this._v1DayTint.parent) {
      this._v1DayTint.parent.removeChild(this._v1DayTint);
      this._v1DayTint = null;
    }
    if (animate) {
      this.fieldSkin.alpha = 0;
      egret.Tween.get(this.fieldSkin).to({ alpha: 1 }, 450);
    } else {
      this.fieldSkin.alpha = 1;
    }
    return;
  }
  if (animate && oldSource) this._v1CrossfadeScene(oldSource);
  if (animate) {
    this.fieldSkin.alpha = 0;
    egret.Tween.get(this.fieldSkin).to({ alpha: 1 }, 450);
  } else {
    this.fieldSkin.alpha = 1;
  }
  this._v1ApplyDayTint(idx, !!animate);
};

// V1-6：旧场景作为单例 ghost 在新图之上淡出，新图同时淡入 = 交叉淡化。
// ghost 只允许一个（_v1SceneGhost），换场太快也不会堆积；Tween 卡住时 900ms 原生兜底强制回收。
Game.prototype._v1CrossfadeScene = function(oldSource) {
  if (!this.battleGroup || !oldSource || this._v1SceneGhost) return;
  var bg = this.battleGroup;
  var ghost = new eui.Image();
  this.coverImageInBox(ghost, oldSource, this._stageW || 375, this._battleH || 423, 0, 0);
  ghost.touchEnabled = false;
  var fieldIdx = -1;
  try {
    if (bg.getChildIndex) fieldIdx = bg.getChildIndex(this.fieldSkin);
    else if (bg.children) fieldIdx = bg.children.indexOf(this.fieldSkin);
  } catch (e) { fieldIdx = -1; }
  bg.addChild(ghost);
  if (fieldIdx >= 0 && bg.setChildIndex) {
    bg.setChildIndex(ghost, Math.min(fieldIdx + 1, bg.numChildren - 1));
  }
  var self = this;
  var removed = false;
  this._v1SceneGhost = ghost;
  var forceRemove = function() {
    if (removed) return;
    removed = true;
    try { egret.Tween.removeTweens(ghost); } catch (e) {}
    if (ghost.parent) ghost.parent.removeChild(ghost);
    if (self._v1SceneGhost === ghost) self._v1SceneGhost = null;
  };
  egret.Tween.get(ghost).to({ alpha: 0 }, 450).call(forceRemove);
  this.safeTimeout('v1-scene-ghost', forceRemove, 900);
};

// V1-6：早晚色调层。一个持久 Rect 单例复用，不随换场新增显示对象；按场景序号轮转 4 段色调。
Game.prototype._v1ApplyDayTint = function(idx, animate) {
  if (!this.battleGroup || !this.fieldSkin) return;
  var TINTS = [
    { color: THEME.bgDeep,      alpha: 0.10 }, // 深夜
    { color: THEME.sky,         alpha: 0.06 }, // 清晨
    { color: THEME.accentSoft,  alpha: 0.05 }, // 白昼
    { color: THEME.pink,        alpha: 0.07 }  // 黄昏
  ];
  var t = TINTS[idx % TINTS.length] || TINTS[0];
  var rect = this._v1DayTint;
  if (!rect || !rect.parent) {
    rect = new eui.Rect();
    rect.width = this._stageW || 375;
    rect.height = this._battleH || 423;
    rect.touchEnabled = false;
    this._v1DayTint = rect;
    var bg = this.battleGroup;
    var fieldIdx = -1;
    try {
      if (bg.getChildIndex) fieldIdx = bg.getChildIndex(this.fieldSkin);
      else if (bg.children) fieldIdx = bg.children.indexOf(this.fieldSkin);
    } catch (e) { fieldIdx = -1; }
    bg.addChild(rect);
    if (fieldIdx >= 0 && bg.setChildIndex) {
      bg.setChildIndex(rect, Math.min(fieldIdx + 1, bg.numChildren - 1));
    }
  }
  rect.fillColor = t.color;
  rect.fillAlpha = t.alpha;
  try { egret.Tween.removeTweens(rect); } catch (e) {}
  if (animate) {
    rect.alpha = 0;
    egret.Tween.get(rect).to({ alpha: 1 }, 450);
  } else {
    rect.alpha = 1;
  }
};

Game.prototype.monsterSpriteSource = function(mType, isBoss) {
  var shape = mType && mType.shape;
  return MONSTER_IMAGE_ASSETS[shape] || UI_ASSETS.monsterSlime;
};

Game.prototype.createMysterySupportSprite = function(idx, available) {
  var g = new eui.Group();
  g.width = 70; g.height = 88;

  var sprite = new eui.Image();
  this.fitImageToBox(sprite, UI_ASSETS.supportHidden, 62, 62, 4, 3);
  sprite.alpha = available ? 1 : 0.78;
  g.addChild(sprite);

  return g;
};

// ==================== 角色外观绘制 ====================
//
// 统一风格：底座阴影 + 主体 + 描边 + 高光 + 眼睛（_drawEyes）
//
Game.prototype.createSupportView = function(idx, yPos) {
  var s = this.supports[idx];
  var def = SUPPORTS_DEF[idx];
  var active = this.isSupportActive(idx);
  var available = this.isSupportAvailable(idx);
  var sc = new eui.Group(); sc.width = 70; sc.height = 88;
  sc.name = 'support-' + idx;
  if (yPos !== undefined && yPos !== 0) sc.y = yPos;

  if (active) {
    var sprite = new eui.Image();
    var source = SUPPORT_IMAGE_ASSETS[idx] || UI_ASSETS.supportCandy;
    this.fitImageToBox(sprite, source, 68, 74, 1, 0);
    sprite.alpha = 1;
    sc.addChild(sprite);
  } else {
    sc.addChild(this.createMysterySupportSprite(idx, available));
  }

  var roleDot = new eui.Rect();
  roleDot.width = 11; roleDot.height = 11;
  roleDot.x = 52; roleDot.y = 9;
  roleDot.ellipseWidth = 9; roleDot.ellipseHeight = 9;
  roleDot.fillColor = active ? def.color : (available ? 0x7a4a1d : 0x2d2944);
  roleDot.strokeColor = 0xffffff; roleDot.strokeWeight = 0.8; roleDot.strokeAlpha = 0.7;
  sc.addChild(roleDot);

  var nameBg = new eui.Rect();
  nameBg.width = 58; nameBg.height = 15;
  nameBg.x = 6; nameBg.y = 69;
  nameBg.ellipseWidth = 7; nameBg.ellipseHeight = 7;
  nameBg.fillColor = active ? 0x17103b : 0x100c22;
  nameBg.fillAlpha = 0.78;
  nameBg.strokeColor = active ? THEME.strokeGold : 0x4a4566;
  nameBg.strokeWeight = 0.6; nameBg.strokeAlpha = active ? 0.52 : 0.35;
  sc.addChild(nameBg);

  var lb = new eui.Label();
  lb.text = active ? def.symbol.slice(0, 2) : (available ? '招募' : '???');
  lb.size = 9; lb.bold = true;
  lb.textColor = active ? THEME.accentSoft : THEME.textMute;
  lb.width = 58; lb.height = 13;
  lb.x = 6; lb.y = 72;
  lb.textAlign = 'center';
  sc.addChild(lb);
  return sc;

  var shape = new egret.Shape();
  var g = shape.graphics;
  var cx = 22, cy = 22;  // 绘制中心

  if (!s.unlocked) {
    // 未解锁：灰色剪影 + 锁
    g.beginFill(0x000000, 0.18);
    g.drawEllipse(cx - 12, cy + 12, 24, 5);
    g.endFill();
    g.lineStyle(1.5, 0x3a355a);
    g.beginFill(0x4a4566);
    g.drawCircle(cx, cy, 13);
    g.endFill();
    g.lineStyle(0);
    g.beginFill(0xb8b0db);
    g.drawRoundRect(cx - 5, cy - 1, 10, 9, 2, 2);
    g.endFill();
    g.lineStyle(1.6, 0xb8b0db);
    g.moveTo(cx - 3, cy - 1); g.lineTo(cx - 3, cy - 4);
    g.curveTo(cx - 3, cy - 7, cx, cy - 7);
    g.curveTo(cx + 3, cy - 7, cx + 3, cy - 4);
    g.lineTo(cx + 3, cy - 1);
    g.lineStyle(0);
    shape.x = 0; shape.y = 0;
    sc.addChild(shape);

    var lockNameBg = new eui.Rect();
    lockNameBg.width = 44; lockNameBg.height = 13;
    lockNameBg.ellipseWidth = 6; lockNameBg.ellipseHeight = 6;
    lockNameBg.fillColor = THEME.bgMid; lockNameBg.fillAlpha = 0.85;
    lockNameBg.horizontalCenter = 0; lockNameBg.top = 40;
    sc.addChild(lockNameBg);
    var lockLb = new eui.Label();
    lockLb.text = 'W' + def.wave; lockLb.size = 9; lockLb.bold = true;
    lockLb.textColor = 0x8881b0;
    lockLb.horizontalCenter = 0; lockLb.top = 41;
    sc.addChild(lockLb);
    return sc;
  }

  // === 底座阴影 ===
  g.beginFill(0x000000, 0.22);
  g.drawEllipse(cx - 13, cy + 13, 26, 5);
  g.endFill();

  // === 糖果精灵本体（按 shape 独立造型）===
  switch (def.shape) {
    case 'candy':
      // 糖果宝宝：圆球 + 两侧纸包扭结 + 条纹
      g.lineStyle(1.2, 0xc94f7a);
      g.beginFill(0xff9ec8);
      g.moveTo(cx - 18, cy); g.lineTo(cx - 10, cy - 6); g.lineTo(cx - 10, cy + 6); g.endFill();
      g.beginFill(0xff9ec8);
      g.moveTo(cx + 18, cy); g.lineTo(cx + 10, cy - 6); g.lineTo(cx + 10, cy + 6); g.endFill();
      g.lineStyle(1.5, 0xb83d6a);
      g.beginFill(def.color);
      g.drawCircle(cx, cy, 11); g.endFill();
      g.lineStyle(1.8, 0xffffff, 0.7);
      g.moveTo(cx - 6, cy - 7); g.lineTo(cx - 7, cy + 7);
      g.moveTo(cx + 6, cy - 7); g.lineTo(cx + 7, cy + 7);
      g.lineStyle(0);
      drawEyesPair(g, cx - 3, cy - 2, cx + 3, cy - 2, 2, 1);
      break;

    case 'marshmallow':
      g.lineStyle(1.5, 0xb83d6a);
      g.beginFill(def.color);
      g.drawCircle(cx - 6, cy + 2, 8);
      g.drawCircle(cx + 6, cy + 2, 8);
      g.drawCircle(cx, cy - 4, 9);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0xffffff, 0.55);
      g.drawEllipse(cx - 3, cy - 10, 7, 3);
      g.endFill();
      g.beginFill(0xff5599, 0.55);
      g.drawCircle(cx - 6, cy + 2, 2);
      g.drawCircle(cx + 6, cy + 2, 2);
      g.endFill();
      drawEyesPair(g, cx - 3, cy - 2, cx + 3, cy - 2, 2, 1);
      g.lineStyle(1.2, 0xb83d6a);
      g.moveTo(cx - 2, cy + 2); g.curveTo(cx, cy + 4, cx + 2, cy + 2);
      break;

    case 'meatball':
      g.lineStyle(0);
      g.beginFill(0x8b6914);
      g.drawRect(cx + 10, cy - 14, 2, 30);
      g.endFill();
      g.lineStyle(1.5, 0x5a2808);
      g.beginFill(def.color);
      g.drawCircle(cx, cy + 3, 10);
      g.drawCircle(cx - 7, cy - 6, 6);
      g.drawCircle(cx + 6, cy - 8, 5);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0xffd28a, 0.6);
      g.drawEllipse(cx - 4, cy - 2, 5, 2);
      g.endFill();
      drawEyesPair(g, cx - 3, cy + 1, cx + 3, cy + 1, 2, 1);
      break;

    case 'pudding':
      g.lineStyle(1.5, 0x8b6914);
      g.beginFill(def.color);
      g.moveTo(cx - 12, cy + 10);
      g.lineTo(cx + 12, cy + 10);
      g.lineTo(cx + 9, cy - 4);
      g.lineTo(cx - 9, cy - 4);
      g.endFill();
      g.beginFill(0xa05a14);
      g.drawEllipse(cx - 9, cy - 7, 18, 6);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0xe74c3c);
      g.drawCircle(cx, cy - 10, 3);
      g.endFill();
      g.beginFill(0x5a7d3d);
      g.drawRect(cx - 1, cy - 14, 2, 3);
      g.endFill();
      drawEyesPair(g, cx - 3, cy + 2, cx + 3, cy + 2, 2, 1);
      break;

    case 'cone':
      g.lineStyle(1.5, 0x8b6914);
      g.beginFill(0xd49a5a);
      g.moveTo(cx - 10, cy - 2);
      g.lineTo(cx + 10, cy - 2);
      g.lineTo(cx, cy + 14);
      g.endFill();
      g.lineStyle(0.6, 0x8b6914);
      g.moveTo(cx - 7, cy + 1); g.lineTo(cx + 7, cy + 1);
      g.moveTo(cx - 5, cy + 5); g.lineTo(cx + 5, cy + 5);
      g.lineStyle(1.5, 0xc25a10);
      g.beginFill(def.color);
      g.drawCircle(cx, cy - 7, 8);
      g.endFill();
      g.beginFill(0xffffff);
      g.drawCircle(cx, cy - 12, 6);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0xffffff, 0.55);
      g.drawEllipse(cx - 2, cy - 14, 4, 2);
      g.endFill();
      drawEyesPair(g, cx - 3, cy - 7, cx + 3, cy - 7, 2, 1);
      break;

    case 'mochi':
      g.lineStyle(1.5, 0x5d3a8c);
      g.beginFill(def.color);
      g.drawEllipse(cx - 12, cy - 8, 24, 24);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0x5a9a40, 0.55);
      g.drawEllipse(cx - 8, cy - 8, 16, 4);
      g.endFill();
      g.beginFill(0xffffff, 0.5);
      g.drawEllipse(cx - 6, cy - 4, 6, 2);
      g.endFill();
      drawEyesPair(g, cx - 4, cy + 1, cx + 4, cy + 1, 2, 1);
      g.beginFill(0xff5577, 0.8);
      g.drawCircle(cx, cy + 7, 1.5);
      g.endFill();
      break;

    case 'popsicle':
      g.lineStyle(0);
      g.beginFill(0x8b6914);
      g.drawRoundRect(cx - 2, cy + 2, 4, 14, 1, 1);
      g.endFill();
      g.lineStyle(1.5, 0x2a7d5e);
      g.beginFill(def.color);
      g.drawCircle(cx, cy - 2, 11);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0x1a0a2e);
      g.drawCircle(cx + 4, cy - 4, 9);
      g.endFill();
      g.beginFill(0xfbbf24);
      this.drawStar(g, cx - 5, cy - 6, 2, 1, 5);
      this.drawStar(g, cx - 7, cy + 1, 1.5, 0.7, 5);
      g.endFill();
      break;

    case 'cake':
      g.lineStyle(1.2, 0x8b3d5e);
      g.beginFill(0xfde8c4);
      g.drawRoundRect(cx - 12, cy + 4, 24, 10, 2, 2);
      g.endFill();
      g.beginFill(def.color);
      g.drawRoundRect(cx - 10, cy - 4, 20, 10, 2, 2);
      g.endFill();
      g.beginFill(0xffffff);
      g.drawRoundRect(cx - 8, cy - 11, 16, 9, 2, 2);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0xffffff);
      g.drawCircle(cx - 5, cy - 13, 2);
      g.drawCircle(cx, cy - 13, 2);
      g.drawCircle(cx + 5, cy - 13, 2);
      g.endFill();
      g.beginFill(0xe74c3c);
      g.moveTo(cx, cy - 18);
      g.lineTo(cx - 3, cy - 14);
      g.lineTo(cx + 3, cy - 14);
      g.endFill();
      g.beginFill(0xfff59d);
      g.drawCircle(cx - 1, cy - 15, 0.5);
      g.drawCircle(cx + 1, cy - 16, 0.5);
      g.endFill();
      drawEyesPair(g, cx - 3, cy, cx + 3, cy, 1.8, 0.9);
      break;

    default:
      g.lineStyle(1.5, 0x333333);
      g.beginFill(def.color);
      g.drawCircle(cx, cy, 13);
      g.endFill();
      drawEyesPair(g, cx - 4, cy - 2, cx + 4, cy - 2, 3, 1.5);
  }

  shape.x = 0; shape.y = 0;
  sc.addChild(shape);

  // 名字标签（金边胶囊，44px 宽）
  var nameBg = new eui.Rect();
  nameBg.width = 44; nameBg.height = 13;
  nameBg.ellipseWidth = 6; nameBg.ellipseHeight = 6;
  nameBg.fillColor = THEME.bgMid; nameBg.fillAlpha = 0.92;
  nameBg.strokeColor = THEME.strokeGold; nameBg.strokeWeight = 0.5;
  nameBg.horizontalCenter = 0; nameBg.top = 40;
  sc.addChild(nameBg);
  var sl = new eui.Label();
  sl.text = def.symbol.length > 2 ? def.symbol.slice(0, 2) : def.symbol;
  sl.size = 9; sl.bold = true;
  sl.textColor = THEME.textMain;
  sl.horizontalCenter = 0; sl.top = 41;
  sc.addChild(sl);
  return sc;
};

Game.prototype.drawStar = function(g, cx, cy, outerR, innerR, points) {
  var step = Math.PI / points;
  g.moveTo(cx, cy - outerR);
  for (var i = 0; i < 2 * points; i++) {
    var r = (i % 2 === 0) ? outerR : innerR;
    var angle = -Math.PI / 2 + (i + 1) * step;
    g.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
};

Game.prototype.getMonsterCenter = function(idx) {
  var mv = this.monsterViews && this.monsterViews[idx];
  if (mv && mv.parent) {
    return {
      x: mv.x + mv.width / 2,
      y: mv.y + Math.min(mv.height * 0.48, (mv._spriteSize || mv.height) * 0.55)
    };
  }
  var w = this.monsters.length || 1;
  var cx = this._centerX || 55;
  var cw = this._centerW || 265;
  return {
    x: cx + cw * ((idx >= 0 ? idx : 0) + 0.5) / w,
    y: this._monsterAreaY + this._monsterAreaH / 2
  };
};

// ==================== 攻击动画系统 ====================

// 主角攻击动画（法师前摇 + 追踪魔法弹 + 命中闪光）
Game.prototype.heroAttackAnim = function(targetIdx) {
  if (!this.heroGroup) return;
  var origY = this._heroBaseY;
  var origX = this.heroGroup.x;
  // 停止之前的动画，防止叠加
  egret.Tween.removeTweens(this.heroGroup);
  this.heroGroup.x = origX;
  this.heroGroup.y = origY;
  this.heroGroup.scaleX = 1;
  this.heroGroup.scaleY = 1;

  var cx = this._centerX || 55;
  var cw = this._centerW || 265;
  var startX = cx + cw / 2;
  var startY = origY + 36;
  var targetPos = this.getMonsterCenter(targetIdx);
  var endX = targetPos.x;
  var endY = targetPos.y;
  var angle = Math.atan2(endY - startY, endX - startX);

  // 主角只做轻微施法前摇，不再夸张冲刺。
  egret.Tween.get(this.heroGroup)
    .to({ y: origY - 5, scaleX: 0.96, scaleY: 1.04 }, 70, egret.Ease.quadOut)
    .to({ y: origY + 2, scaleX: 1.04, scaleY: 0.98 }, 70, egret.Ease.quadInOut)
    .to({ y: origY, scaleX: 1, scaleY: 1 }, 90, egret.Ease.quadOut);

  var castRing = new egret.Shape();
  castRing.graphics.lineStyle(2, THEME.accentSoft, 0.75);
  castRing.graphics.drawCircle(0, 0, 15);
  castRing.graphics.lineStyle(1, THEME.pink, 0.65);
  castRing.graphics.drawCircle(0, 0, 9);
  castRing.x = startX;
  castRing.y = startY;
  castRing.scaleX = 0.35;
  castRing.scaleY = 0.35;
  castRing.alpha = 0.9;
  this.damageLayer.addChild(castRing);
  egret.Tween.get(castRing)
    .to({ scaleX: 1.3, scaleY: 1.3, alpha: 0 }, 220, egret.Ease.quadOut)
    .call(function() { if (castRing.parent) castRing.parent.removeChild(castRing); });

  var bolt = new egret.Shape();
  var bg = bolt.graphics;
  bg.lineStyle(3, 0xffffff, 0.92);
  bg.moveTo(-18, 0);
  bg.lineTo(-4, 0);
  bg.lineStyle(6, THEME.sky, 0.42);
  bg.moveTo(-14, 0);
  bg.lineTo(-2, 0);
  bg.lineStyle(0);
  bg.beginFill(THEME.accentSoft, 0.96);
  bg.drawCircle(3, 0, 6);
  bg.endFill();
  bg.beginFill(THEME.pink, 0.58);
  bg.drawCircle(3, 0, 11);
  bg.endFill();
  bolt.x = startX;
  bolt.y = startY;
  bolt.rotation = angle * 180 / Math.PI;
  bolt.scaleX = 0.75;
  bolt.scaleY = 0.75;
  this.damageLayer.addChild(bolt);
  egret.Tween.get(bolt)
    .to({ x: endX, y: endY, scaleX: 1.05, scaleY: 1.05 }, 190, egret.Ease.sineOut)
    .to({ alpha: 0 }, 50)
    .call(function() { if (bolt.parent) bolt.parent.removeChild(bolt); });

  var impact = new egret.Shape();
  var ig = impact.graphics;
  ig.lineStyle(2, THEME.accentSoft, 0.9);
  this.drawStar(ig, 0, 0, 18, 7, 6);
  ig.lineStyle(0);
  ig.beginFill(0xffffff, 0.68);
  ig.drawCircle(0, 0, 6);
  ig.endFill();
  impact.x = endX;
  impact.y = endY;
  impact.scaleX = 0.2;
  impact.scaleY = 0.2;
  impact.alpha = 0;
  this.damageLayer.addChild(impact);
  egret.Tween.get(impact)
    .wait(150)
    .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 70, egret.Ease.quadOut)
    .to({ scaleX: 1.45, scaleY: 1.45, alpha: 0 }, 150, egret.Ease.quadIn)
    .call(function() { if (impact.parent) impact.parent.removeChild(impact); });
};

// 辅助英雄攻击动画（缩放 + 不同形状飞弹）
// 辅助英雄攻击动画（物理系前冲挥砍 / 法术系施法光环+飞弹）
Game.prototype.supportAttackAnim = function(supportIdx, targetIdx, dmg) {
  var group = supportIdx < 4 ? this.leftSupGroup : this.rightSupGroup;
  if (!group) return;
  var localIdx = supportIdx < 4 ? supportIdx : (supportIdx - 4);
  var sc = group.getChildByName ? group.getChildByName('support-' + supportIdx) : null;
  sc = sc || group.getChildAt(localIdx + 1) || group.getChildAt(localIdx);
  var def = SUPPORTS_DEF[supportIdx];
  var color = def.color;
  var sw = this._stageW || 375;
  var bh = this._battleH || 400;
  var slot = this._supportSlots && this._supportSlots[supportIdx];
  var startX = slot ? slot.x : (supportIdx < 4 ? 31 : (sw - 31));
  var startY = slot ? slot.y : (Math.floor(bh * 0.35) + localIdx * 46 + 24);
  var targetPos = this.getMonsterCenter(targetIdx);
  var endX = targetPos.x;
  var endY = targetPos.y;
  var self = this;
  // 物理 / 法术
  var isMagic = def.role === 'magic';

  if (sc) {
    if (isMagic) {
      egret.Tween.get(sc).to({ scaleX: 1.2, scaleY: 1.2 }, 80).to({ scaleX: 1, scaleY: 1 }, 100);
      var ring = new egret.Shape();
      ring.graphics.lineStyle(2, color, 0.7);
      ring.graphics.drawCircle(0, 0, 12);
      ring.graphics.endFill();
      ring.x = startX; ring.y = startY;
      ring.scaleX = 0.3; ring.scaleY = 0.3; ring.alpha = 0.8;
      this.damageLayer.addChild(ring);
      egret.Tween.get(ring).to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 250).call(function() {
        if (ring.parent) ring.parent.removeChild(ring);
      });
    } else {
      var origX = sc.x;
      var dir = supportIdx < 4 ? 1 : -1;
      egret.Tween.get(sc).to({ x: origX + dir * 8 }, 50).to({ x: origX }, 80);
    }
  }

  // 飞弹（形状匹配糖果精灵风格）
  var bullet = new egret.Shape();
  var bg = bullet.graphics;
  bg.beginFill(color);
  var sz = 5;
  switch (def.shape) {
    case 'candy':
      bg.drawCircle(0, 0, sz); bg.endFill();
      bg.lineStyle(1, 0xffffff, 0.8);
      bg.moveTo(-sz, 0); bg.lineTo(sz, 0); bg.lineStyle(0); break;
    case 'marshmallow':
      bg.drawCircle(-sz*0.5, 0, sz*0.7); bg.drawCircle(sz*0.5, 0, sz*0.7); bg.drawCircle(0, -sz*0.5, sz*0.7); break;
    case 'meatball':
      bg.drawCircle(0, 0, sz); bg.endFill();
      bg.beginFill(0xffd28a, 0.5); bg.drawEllipse(-sz*0.6, -sz*0.6, sz, sz*0.5); break;
    case 'pudding':
      bg.moveTo(-sz, sz*0.6); bg.lineTo(sz, sz*0.6); bg.lineTo(sz*0.7, -sz*0.6); bg.lineTo(-sz*0.7, -sz*0.6); break;
    case 'cone':
      bg.moveTo(0, sz); bg.lineTo(sz, -sz*0.2); bg.lineTo(-sz, -sz*0.2); bg.endFill();
      bg.beginFill(0xffffff); bg.drawCircle(0, -sz*0.5, sz*0.6); break;
    case 'mochi':
      this.drawStar(bg, 0, 0, sz, sz*0.45, 5); break;
    case 'popsicle':
      bg.drawCircle(0, 0, sz); bg.endFill();
      bg.beginFill(0x1a0a2e); bg.drawCircle(sz*0.4, -sz*0.2, sz*0.7); break;
    case 'cake':
      bg.drawCircle(-sz*0.4, -sz*0.4, sz*0.6); bg.drawCircle(sz*0.4, -sz*0.4, sz*0.6); bg.endFill();
      bg.beginFill(color);
      bg.moveTo(-sz, 0); bg.lineTo(0, sz); bg.lineTo(sz, 0); break;
    default:
      bg.drawCircle(0, 0, sz);
  }
  bg.endFill();
  bullet.x = startX; bullet.y = startY;
  bullet.rotation = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  this.damageLayer.addChild(bullet);

  egret.Tween.get(bullet)
    .to({ x: endX, y: endY }, isMagic ? 250 : 150)
    .call(function() {
      if (bullet.parent) bullet.parent.removeChild(bullet);
      var txt = new egret.TextField();
      txt.text = '-' + self.fmt(dmg);
      txt.size = 13; txt.textColor = color; txt.bold = true;
      txt.x = endX + (Math.random() * 16 - 8);
      txt.y = endY - 15;
      self.damageLayer.addChild(txt);
      egret.Tween.get(txt).to({ y: txt.y - 30, alpha: 0 }, 500).call(function() {
        if (txt.parent) txt.parent.removeChild(txt);
      });
    });
};

// ==================== UI 构建 ====================

Game.prototype.buildUI = function() {
  // fixedWidth 模式下 stageWidth 固定为 contentWidth（375），但优先读取真实值以适配未来调整
  var stageW = (this.main.stage && this.main.stage.stageWidth) ? this.main.stage.stageWidth : 375;
  var self = this;

  // 主容器使用绝对定位。战斗层背景较大，不能依赖 EUI 布局异步校准，
  // 否则某些浏览器首帧会把战斗层盖到顶部栏上。
  this.main.layout = null;

  var TOP_H = 140;   // 顶部HUD高度：玩家信息 + 血条 + 战斗入口
  var STATUS_BAR_H = 58; // 战斗底部状态条，属于 UI，不属于背景图
  var SKILL_H = 52;  // 技能栏高度
  var NAV_H = 50;    // 底部导航高度
  var stageH = this.main.stage ? this.main.stage.stageHeight : 667;
  var BATTLE_H = Math.max(300, stageH - TOP_H - STATUS_BAR_H - SKILL_H - NAV_H);
  this._stageW = stageW;
  this._battleH = BATTLE_H;

  // ===== 顶部栏 =====
  var topBar = new eui.Group();
  topBar.width = stageW; topBar.height = TOP_H;
  topBar.x = 0; topBar.y = 0;
  var topBgShape = new egret.Shape();
  var tg = topBgShape.graphics;
  tg.beginFill(0x070416);
  tg.drawRect(0, 0, stageW, TOP_H);
  tg.endFill();
  tg.beginFill(0x120c2d, 0.98);
  tg.drawRoundRect(6, 5, stageW - 12, TOP_H - 11, 14, 14);
  tg.endFill();
  tg.beginFill(0x1d1646, 0.82);
  tg.drawRoundRect(10, 9, stageW - 20, 54, 12, 12);
  tg.endFill();
  tg.beginFill(0x0b0820, 0.72);
  tg.drawRoundRect(10, 98, stageW - 20, 36, 12, 12);
  tg.endFill();
  tg.lineStyle(1, THEME.strokeGold, 0.52);
  tg.drawRoundRect(6.5, 5.5, stageW - 13, TOP_H - 12, 14, 14);
  tg.lineStyle(0);
  tg.beginFill(THEME.accent, 0.18);
  tg.drawRect(18, 66, stageW - 36, 1);
  tg.endFill();
  topBar.addChild(topBgShape);
  var topUnderline = new eui.Rect();
  topUnderline.percentWidth = 100; topUnderline.height = 2;
  topUnderline.bottom = 0; topUnderline.fillColor = THEME.strokeGold; topUnderline.fillAlpha = 0.26;
  topBar.addChild(topUnderline);

  // --- Row1：头像 + 玩家名 / 职业 ---
  var avatarDef = AVATAR_DEFS[this.avatarIdx || 0] || AVATAR_DEFS[0];
  var avatarGroup = new eui.Group();
  avatarGroup.width = 56; avatarGroup.height = 58;
  avatarGroup.x = 12; avatarGroup.y = 6;
  avatarGroup.touchEnabled = true;
  var avatarGlow = new eui.Rect();
  avatarGlow.width = 56; avatarGlow.height = 56; avatarGlow.ellipseWidth = 16; avatarGlow.ellipseHeight = 16;
  avatarGlow.fillColor = 0xfbbf24; avatarGlow.fillAlpha = 0.08;
  avatarGroup.addChild(avatarGlow);
  var avatarFrame = new eui.Rect();
  avatarFrame.width = 52; avatarFrame.height = 52; avatarFrame.ellipseWidth = 14; avatarFrame.ellipseHeight = 14;
  avatarFrame.x = 2; avatarFrame.y = 2;
  avatarFrame.fillColor = 0x0a0820; avatarFrame.strokeColor = THEME.strokeGold;
  avatarFrame.strokeWeight = 1.5; avatarFrame.strokeAlpha = 0.92;
  avatarGroup.addChild(avatarFrame);
  var avatarBg = new eui.Rect();
  avatarBg.width = 44; avatarBg.height = 44; avatarBg.ellipseWidth = 12; avatarBg.ellipseHeight = 12;
  avatarBg.fillColor = avatarDef.color;
  avatarBg.x = 6; avatarBg.y = 6;
  avatarGroup.addChild(avatarBg);
  var avatarHero = new eui.Image();
  this.fitImageToBox(avatarHero, avatarDef.asset, 50, 50, 3, 3);
  avatarGroup.addChild(avatarHero);
  var avatarLevelBg = new eui.Rect();
  avatarLevelBg.width = 42; avatarLevelBg.height = 14;
  avatarLevelBg.x = 7; avatarLevelBg.y = 40;
  avatarLevelBg.ellipseWidth = 8; avatarLevelBg.ellipseHeight = 8;
  avatarLevelBg.fillColor = 0x24170d; avatarLevelBg.fillAlpha = 0.9;
  avatarLevelBg.strokeColor = THEME.accent; avatarLevelBg.strokeAlpha = 0.72; avatarLevelBg.strokeWeight = 0.8;
  avatarGroup.addChild(avatarLevelBg);
  this.waveLabel = new eui.Label();
  this.waveLabel.text = 'Lv.' + this.mainLevel; this.waveLabel.size = 10; this.waveLabel.textColor = 0xfbbf24; this.waveLabel.bold = true;
  this.waveLabel.width = 42; this.waveLabel.height = 12; this.waveLabel.textAlign = 'center';
  this.waveLabel.x = 7; this.waveLabel.y = 41;
  avatarGroup.addChild(this.waveLabel);
  // 点击头像打开选择面板
  avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.openAvatarPicker(); }, this);
  this._avatarBg   = avatarBg;
  this._avatarImage = avatarHero;
  topBar.addChild(avatarGroup);

  // 玩家身份面板。昵称后续可接微信昵称，职业按钮打开转职详情。
  var namePlate = new eui.Rect();
  namePlate.width = 112; namePlate.height = 24;
  namePlate.x = 76; namePlate.y = 10;
  namePlate.ellipseWidth = 10; namePlate.ellipseHeight = 10;
  namePlate.fillColor = 0x0d0926; namePlate.fillAlpha = 0.72;
  namePlate.strokeColor = THEME.strokeGold; namePlate.strokeAlpha = 0.22; namePlate.strokeWeight = 0.8;
  topBar.addChild(namePlate);
  var nameLb = new eui.Label();
  nameLb.text = this.playerName || makeDefaultPlayerName();
  nameLb.size = 13; nameLb.textColor = THEME.textMain; nameLb.bold = true;
  nameLb.width = 102; nameLb.height = 18; nameLb.textAlign = 'center';
  nameLb.x = 81; nameLb.y = 13; nameLb.touchEnabled = true;
  nameLb.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.openNameEditor(); }, this);
  topBar.addChild(nameLb);
  this._nameLb = nameLb;

  var jobDef = this.getJobDef ? this.getJobDef(this.jobId) : JOB_DEFS[0];
  var jobGroup = new eui.Group();
  jobGroup.width = 80; jobGroup.height = 24;
  jobGroup.x = 193; jobGroup.y = 10;
  jobGroup.touchEnabled = true;
  var jobPlate = new eui.Rect();
  jobPlate.width = 80; jobPlate.height = 24;
  jobPlate.ellipseWidth = 10; jobPlate.ellipseHeight = 10;
  jobPlate.fillColor = 0x19113c; jobPlate.fillAlpha = 0.92;
  jobPlate.strokeColor = jobDef.color || THEME.lavender; jobPlate.strokeAlpha = 0.64; jobPlate.strokeWeight = 0.9;
  jobGroup.addChild(jobPlate);
  this.jobLabel = new eui.Label();
  this.jobLabel.text = jobDef.name || '见习法师';
  this.jobLabel.size = 12; this.jobLabel.bold = true; this.jobLabel.textColor = jobDef.color || 0xc7a7ff;
  this.jobLabel.width = 70; this.jobLabel.height = 16; this.jobLabel.textAlign = 'center';
  this.jobLabel.x = 5; this.jobLabel.y = 4;
  jobGroup.addChild(this.jobLabel);
  var jobArrow = new eui.Label();
  jobArrow.text = '›'; jobArrow.size = 13; jobArrow.bold = true; jobArrow.textColor = THEME.textGold;
  jobArrow.width = 10; jobArrow.height = 14; jobArrow.x = 66; jobArrow.y = 4;
  jobGroup.addChild(jobArrow);
  jobGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.openCareerPanel(); }, this);
  this._jobBtnBg = jobPlate;
  topBar.addChild(jobGroup);

  // --- Row2：金币和钻石同一行 ---
  var resX = 76;
  var goldPill = new eui.Rect();
  goldPill.width = 174; goldPill.height = 24; goldPill.ellipseWidth = 12; goldPill.ellipseHeight = 12;
  goldPill.fillColor = 0x24170d; goldPill.fillAlpha = 0.96;
  goldPill.strokeColor = THEME.accent; goldPill.strokeWeight = 0.9; goldPill.strokeAlpha = 0.62;
  goldPill.x = resX; goldPill.y = 39;
  topBar.addChild(goldPill);
  var goldIcon = new eui.Image();
  this.fitImageToBox(goldIcon, UI_ASSETS.topHudGold, 24, 24, resX + 3, 39);
  topBar.addChild(goldIcon);
  this.goldLabel = new eui.Label();
  this.goldLabel.text = this.fmt(this.gold);
  this.goldLabel.size = 13; this.goldLabel.textColor = 0xffd36e; this.goldLabel.bold = true;
  this.goldLabel.width = 140; this.goldLabel.height = 18; this.goldLabel.textAlign = 'right';
  this.goldLabel.x = resX + 28; this.goldLabel.y = 42;
  topBar.addChild(this.goldLabel);

  var gemPill = new eui.Rect();
  gemPill.width = 58; gemPill.height = 24; gemPill.ellipseWidth = 12; gemPill.ellipseHeight = 12;
  gemPill.fillColor = 0x19103d; gemPill.fillAlpha = 0.96;
  gemPill.strokeColor = THEME.lavender; gemPill.strokeWeight = 0.9; gemPill.strokeAlpha = 0.58;
  gemPill.x = 256; gemPill.y = 39;
  topBar.addChild(gemPill);
  var gemIcon = new eui.Image();
  this.fitImageToBox(gemIcon, UI_ASSETS.topHudDiamond, 22, 22, 259, 40);
  topBar.addChild(gemIcon);
  this.gemsLabel = new eui.Label();
  this.gemsLabel.text = String(this.rebirthGems || 0);
  this.gemsLabel.size = 13; this.gemsLabel.textColor = 0xc7a7ff; this.gemsLabel.bold = true;
  this.gemsLabel.width = 28; this.gemsLabel.height = 18; this.gemsLabel.textAlign = 'right';
  this.gemsLabel.x = 282; this.gemsLabel.y = 42;
  topBar.addChild(this.gemsLabel);

  // 保留 updateWaveNumbers 的引用，避免其他地方调用时崩溃
  this._waveNumBgs = [];
  this._waveNumLbs = [];

  // --- Row2：怪物 HP 汇总条（满宽） ---
  var HP_X = 12, HP_Y = 82, HP_W = stageW - 24, HP_H = 12;
  var hpBg = new eui.Rect();
  hpBg.width = HP_W; hpBg.height = HP_H; hpBg.ellipseWidth = 8; hpBg.ellipseHeight = 8;
  hpBg.fillColor = 0x090616; hpBg.strokeColor = THEME.strokeGold; hpBg.strokeWeight = 0.8; hpBg.strokeAlpha = 0.5;
  hpBg.x = HP_X; hpBg.y = HP_Y;
  topBar.addChild(hpBg);
  this.hpFill = new eui.Rect();
  this.hpFill.width = HP_W; this.hpFill.height = HP_H;
  this.hpFill.ellipseWidth = 8; this.hpFill.ellipseHeight = 8;
  this.hpFill.fillColor = THEME.mint; this.hpFill.x = HP_X; this.hpFill.y = HP_Y;
  topBar.addChild(this.hpFill);
  this._hpMaxWidth = HP_W; // 供 updateUI 用，替换硬编码 140
  // HP 文字居中叠在条上
  this.hpLabel = new eui.Label();
  this.hpLabel.text = '100 / 100'; this.hpLabel.size = 10; this.hpLabel.textColor = 0xffffff;
  this.hpLabel.bold = true;
  this.hpLabel.width = HP_W; this.hpLabel.height = 13; this.hpLabel.textAlign = 'center';
  this.hpLabel.x = HP_X; this.hpLabel.y = HP_Y + 1;
  topBar.addChild(this.hpLabel);

  // --- Row3：战斗入口区。把原本压在背景上的按钮收进顶部HUD，场景区域保持干净。---
  var ACTION_Y = 101;
  var ACTION_H = 36;
  var actionPanel = new eui.Rect();
  actionPanel.x = 8; actionPanel.y = ACTION_Y - 6;
  actionPanel.width = stageW - 16; actionPanel.height = ACTION_H + 12;
  actionPanel.ellipseWidth = 12; actionPanel.ellipseHeight = 12;
  actionPanel.fillColor = 0x0d0926; actionPanel.fillAlpha = 0.46;
  actionPanel.strokeColor = THEME.strokeGold; actionPanel.strokeWeight = 0.8; actionPanel.strokeAlpha = 0.58;
  topBar.addChild(actionPanel);

  var bossBtnGroup = new eui.Group();
  bossBtnGroup.width = 112; bossBtnGroup.height = ACTION_H;
  bossBtnGroup.x = 12; bossBtnGroup.y = ACTION_Y;
  bossBtnGroup.touchEnabled = true;
  this._bossBtnBg = new eui.Rect();
  this._bossBtnBg.width = bossBtnGroup.width; this._bossBtnBg.height = ACTION_H;
  this._bossBtnBg.ellipseWidth = 12; this._bossBtnBg.ellipseHeight = 12;
  this._bossBtnBg.fillColor = 0x861626; this._bossBtnBg.fillAlpha = 0.98;
  this._bossBtnBg.strokeColor = THEME.strokeGold; this._bossBtnBg.strokeWeight = 1.1; this._bossBtnBg.strokeAlpha = 0.86;
  bossBtnGroup.addChild(this._bossBtnBg);
  var bossIconBg = new eui.Rect();
  bossIconBg.width = 30; bossIconBg.height = 30;
  bossIconBg.x = 4; bossIconBg.y = 3;
  bossIconBg.ellipseWidth = 10; bossIconBg.ellipseHeight = 10;
  bossIconBg.fillColor = 0x260817; bossIconBg.fillAlpha = 0.55;
  bossIconBg.strokeColor = 0xffd36e; bossIconBg.strokeWeight = 0.7; bossIconBg.strokeAlpha = 0.34;
  bossBtnGroup.addChild(bossIconBg);
  var bossIconImg = new eui.Image();
  this.fitImageToBox(bossIconImg, UI_ASSETS.topHudBoss, 28, 28, 5, 4);
  bossBtnGroup.addChild(bossIconImg);
  this._bossBtnText = new eui.Label();
  this._bossBtnText.text = '挑战BOSS'; this._bossBtnText.size = 12;
  this._bossBtnText.textColor = 0xffffff; this._bossBtnText.bold = true;
  this._bossBtnText.width = 72; this._bossBtnText.height = 16;
  this._bossBtnText.x = 37; this._bossBtnText.y = 6;
  bossBtnGroup.addChild(this._bossBtnText);
  this._bossBtnHint = new eui.Label();
  this._bossBtnHint.text = '第9波开启'; this._bossBtnHint.size = 8;
  this._bossBtnHint.textColor = 0xffd7a3;
  this._bossBtnHint.width = 72; this._bossBtnHint.height = 12;
  this._bossBtnHint.x = 38; this._bossBtnHint.y = 22;
  bossBtnGroup.addChild(this._bossBtnHint);
  bossBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
    self.challengeBoss();
  }, this);
  topBar.addChild(bossBtnGroup);
  this._bossBtnGroup = bossBtnGroup;

  var quickDefs = [
    { asset: UI_ASSETS.hudCheckin, text: '签到', fn: function() { self.openCheckin(); } },
    { asset: UI_ASSETS.hudDailyTask, text: '任务', fn: function() { self.openDailyTasks(); } },
    { asset: UI_ASSETS.hudMail, text: '邮件', fn: function() { self.openMail(); } },
    { asset: UI_ASSETS.hudAnnouncement, text: '公告', fn: function() { self.openAnnouncement(); } },
    { asset: UI_ASSETS.topHudSettings, text: '设置', fn: function() { self.openSettingsPanel(); } }
  ];
  var quickX = 132;
  var quickW = 43;
  var quickGap = 3;
  for (var qi = 0; qi < quickDefs.length; qi++) {
    var qd = quickDefs[qi];
    var qg = new eui.Group();
    qg.width = quickW; qg.height = ACTION_H;
    qg.x = quickX + qi * (quickW + quickGap); qg.y = ACTION_Y;
    qg.touchEnabled = true;
    var qbg = new eui.Rect();
    qbg.width = quickW; qbg.height = ACTION_H;
    qbg.ellipseWidth = 12; qbg.ellipseHeight = 12;
    qbg.fillColor = 0x1b1444; qbg.fillAlpha = 0.96;
    qbg.strokeColor = THEME.strokeGold; qbg.strokeWeight = 0.7; qbg.strokeAlpha = 0.4;
    qg.addChild(qbg);
    var qiImg = new eui.Image();
    this.fitImageToBox(qiImg, qd.asset, 27, 24, 8, 2);
    qg.addChild(qiImg);
    var qtLb = new eui.Label();
    qtLb.text = qd.text; qtLb.size = 9; qtLb.bold = true;
    qtLb.textColor = THEME.accentSoft;
    qtLb.width = quickW; qtLb.height = 12;
    qtLb.textAlign = 'center'; qtLb.x = 0; qtLb.y = 24;
    qg.addChild(qtLb);
    (function(fn) {
      qg.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, self);
    })(qd.fn);
    topBar.addChild(qg);
  }
  this.updateBossBtn();

  this.main.addChild(topBar);

  // ===== 战斗区域 =====
  this.battleGroup = new eui.Group();
  this.battleGroup.width = stageW; this.battleGroup.height = BATTLE_H;
  this.battleGroup.x = 0; this.battleGroup.y = TOP_H;
  this.battleGroup.touchEnabled = true;
  if (egret.Rectangle) {
    this.battleGroup.scrollRect = new egret.Rectangle(0, 0, stageW, BATTLE_H);
  }

  // ============================================================
  // 魔幻场景背景
  // 层次（从后到前）：
  //   1. 深空底色（三段渐变色块）
  //   2. 远山轮廓（紫色山脉剪影）
  //   3. 魔法光柱（从地面射向天空）
  //   4. 星云 / 光晕（大圆形半透明）
  //   5. 星点（大小不一，多颗）
  //   6. 月亮（弦月，带光晕）
  //   7. 地面（魔法石板地，带裂缝发光）
  //   8. 地面装饰（蘑菇、水晶石）
  // ============================================================
  var bg = new egret.Shape();
  var bgG = bg.graphics;

  // --- 1. 深空底色（三段）---
  bgG.beginFill(0x04021a);
  bgG.drawRect(0, 0, stageW, Math.floor(BATTLE_H * 0.55));
  bgG.endFill();
  bgG.beginFill(0x0d0730);
  bgG.drawRect(0, Math.floor(BATTLE_H * 0.55), stageW, Math.floor(BATTLE_H * 0.12));
  bgG.endFill();
  bgG.beginFill(0x160b3a);
  bgG.drawRect(0, Math.floor(BATTLE_H * 0.67), stageW, Math.ceil(BATTLE_H * 0.33));
  bgG.endFill();

  // --- 2. 远山剪影（三层，深→浅）---
  // 最远层（最暗）
  bgG.lineStyle(0);
  bgG.beginFill(0x0e0630, 0.9);
  bgG.moveTo(0, Math.floor(BATTLE_H * 0.62));
  bgG.curveTo(40,  Math.floor(BATTLE_H * 0.38), 90,  Math.floor(BATTLE_H * 0.44));
  bgG.curveTo(130, Math.floor(BATTLE_H * 0.30), 160, Math.floor(BATTLE_H * 0.40));
  bgG.curveTo(200, Math.floor(BATTLE_H * 0.22), 230, Math.floor(BATTLE_H * 0.36));
  bgG.curveTo(270, Math.floor(BATTLE_H * 0.28), 310, Math.floor(BATTLE_H * 0.42));
  bgG.curveTo(345, Math.floor(BATTLE_H * 0.34), stageW, Math.floor(BATTLE_H * 0.48));
  bgG.lineTo(stageW, Math.floor(BATTLE_H * 0.62));
  bgG.endFill();
  // 中层
  bgG.beginFill(0x1a0d45, 0.85);
  bgG.moveTo(0, Math.floor(BATTLE_H * 0.65));
  bgG.curveTo(50,  Math.floor(BATTLE_H * 0.48), 100, Math.floor(BATTLE_H * 0.54));
  bgG.curveTo(145, Math.floor(BATTLE_H * 0.40), 185, Math.floor(BATTLE_H * 0.50));
  bgG.curveTo(225, Math.floor(BATTLE_H * 0.44), 260, Math.floor(BATTLE_H * 0.52));
  bgG.curveTo(305, Math.floor(BATTLE_H * 0.42), stageW, Math.floor(BATTLE_H * 0.56));
  bgG.lineTo(stageW, Math.floor(BATTLE_H * 0.65));
  bgG.endFill();
  // 近层（最亮）
  bgG.beginFill(0x22104e, 0.9);
  bgG.moveTo(0, Math.floor(BATTLE_H * 0.68));
  bgG.curveTo(60,  Math.floor(BATTLE_H * 0.56), 110, Math.floor(BATTLE_H * 0.60));
  bgG.curveTo(155, Math.floor(BATTLE_H * 0.50), 188, Math.floor(BATTLE_H * 0.58));
  bgG.curveTo(230, Math.floor(BATTLE_H * 0.52), 280, Math.floor(BATTLE_H * 0.60));
  bgG.curveTo(330, Math.floor(BATTLE_H * 0.54), stageW, Math.floor(BATTLE_H * 0.62));
  bgG.lineTo(stageW, Math.floor(BATTLE_H * 0.68));
  bgG.endFill();

  // --- 3. 魔法光柱（3根，从地面向上渐隐）---
  var pillarData = [
    { x: 80,  w: 18, color: 0x7c3aed, alpha: 0.18 },
    { x: 188, w: 28, color: 0xc026d3, alpha: 0.22 },
    { x: 295, w: 16, color: 0x2563eb, alpha: 0.16 }
  ];
  for (var pi = 0; pi < pillarData.length; pi++) {
    var pd = pillarData[pi];
    // 宽光柱（底部不透明→顶部透明，用多层矩形模拟）
    for (var li = 0; li < 8; li++) {
      var ly = Math.floor(BATTLE_H * (0.67 - li * 0.08));
      var lh = Math.floor(BATTLE_H * 0.09);
      var la = pd.alpha * (1 - li / 8);
      bgG.beginFill(pd.color, la);
      bgG.drawRect(pd.x - pd.w / 2, ly, pd.w, lh + 2);
      bgG.endFill();
    }
    // 中心亮线
    bgG.beginFill(0xffffff, 0.12);
    bgG.drawRect(pd.x - 1, 0, 2, Math.floor(BATTLE_H * 0.67));
    bgG.endFill();
  }

  // --- 4. 星云光晕（大圆形半透明）---
  var nebulaData = [
    { x: 60,  y: 60,  r: 55, color: 0x4c1d95, alpha: 0.25 },
    { x: 200, y: 40,  r: 70, color: 0x831843, alpha: 0.20 },
    { x: 320, y: 80,  r: 50, color: 0x1e3a8a, alpha: 0.22 },
    { x: 140, y: 110, r: 40, color: 0x5b21b6, alpha: 0.18 }
  ];
  for (var ni = 0; ni < nebulaData.length; ni++) {
    var nd = nebulaData[ni];
    bgG.beginFill(nd.color, nd.alpha);
    bgG.drawCircle(nd.x, nd.y, nd.r);
    bgG.endFill();
    bgG.beginFill(nd.color, nd.alpha * 0.5);
    bgG.drawCircle(nd.x, nd.y, nd.r * 1.6);
    bgG.endFill();
  }

  // --- 5. 星点（大小不一）---
  var starData = [
    [30,12,1.8],[68,8,1.2],[110,22,2.2],[155,6,1.0],[195,18,1.6],
    [240,10,1.4],[285,24,2.0],[330,14,1.2],[355,8,1.8],[15,45,1.0],
    [88,38,1.6],[145,50,1.2],[210,32,2.0],[265,44,1.4],[310,36,1.8],
    [50,70,1.0],[130,62,1.6],[220,68,1.2],[300,58,2.0],[360,72,1.4],
    [75,90,1.2],[170,82,1.8],[250,94,1.0],[340,86,1.6],[20,100,1.4]
  ];
  for (var sti = 0; sti < starData.length; sti++) {
    var sd = starData[sti];
    // 外光晕
    bgG.beginFill(0xfde68a, 0.15);
    bgG.drawCircle(sd[0], sd[1], sd[2] * 2.5);
    bgG.endFill();
    // 星核
    bgG.beginFill(0xffffff, 0.9);
    bgG.drawCircle(sd[0], sd[1], sd[2]);
    bgG.endFill();
  }
  // 十字星芒（4颗大星）
  var bigStars = [[110,22],[195,18],[285,24],[50,70]];
  for (var bsi = 0; bsi < bigStars.length; bsi++) {
    var bx = bigStars[bsi][0], by = bigStars[bsi][1];
    bgG.lineStyle(0.8, 0xfde68a, 0.6);
    bgG.moveTo(bx - 6, by); bgG.lineTo(bx + 6, by);
    bgG.moveTo(bx, by - 6); bgG.lineTo(bx, by + 6);
    bgG.lineStyle(0);
  }

  // --- 6. 弦月（右上角，带光晕）---
  var moonX = stageW - 52, moonY = 38, moonR = 22;
  // 外光晕（三层）
  bgG.beginFill(0xfde68a, 0.06); bgG.drawCircle(moonX, moonY, moonR * 3.5); bgG.endFill();
  bgG.beginFill(0xfde68a, 0.12); bgG.drawCircle(moonX, moonY, moonR * 2.2); bgG.endFill();
  bgG.beginFill(0xfde68a, 0.22); bgG.drawCircle(moonX, moonY, moonR * 1.4); bgG.endFill();
  // 月面
  bgG.beginFill(0xfef3c7);
  bgG.drawCircle(moonX, moonY, moonR);
  bgG.endFill();
  // 遮罩（弦月缺口）
  bgG.beginFill(0x04021a);
  bgG.drawCircle(moonX + 10, moonY - 4, moonR - 2);
  bgG.endFill();
  // 月面纹理（淡色环形）
  bgG.lineStyle(0.8, 0xfbbf24, 0.3);
  bgG.drawCircle(moonX - 4, moonY + 2, 6);
  bgG.lineStyle(0);

  // --- 6.5 星夜糖果屋剪影（概念稿的关键氛围：远景有可爱的发光屋群）---
  var houseY = Math.floor(BATTLE_H * 0.34);
  var houses = [
    { x: 72,  y: houseY + 18, w: 42, h: 52, roof: 0x5b21b6, wall: 0x2a1858, light: 0xffd166 },
    { x: 136, y: houseY + 4,  w: 52, h: 64, roof: 0x7c3aed, wall: 0x321b68, light: 0xffe7a3 },
    { x: 248, y: houseY + 10, w: 56, h: 66, roof: 0x4c1d95, wall: 0x261450, light: 0xffc66d },
    { x: 308, y: houseY + 28, w: 38, h: 44, roof: 0x831843, wall: 0x301340, light: 0xffe7a3 }
  ];
  for (var hi2 = 0; hi2 < houses.length; hi2++) {
    var hd = houses[hi2];
    // 软光晕
    bgG.beginFill(hd.light, 0.06);
    bgG.drawCircle(hd.x, hd.y + hd.h * 0.45, hd.w);
    bgG.endFill();
    // 糖果屋主体
    bgG.lineStyle(1, 0x6d4db8, 0.35);
    bgG.beginFill(hd.wall, 0.82);
    bgG.drawRoundRect(hd.x - hd.w / 2, hd.y, hd.w, hd.h, 12, 12);
    bgG.endFill();
    // 奶油屋顶
    bgG.lineStyle(1, 0xffb7e5, 0.35);
    bgG.beginFill(hd.roof, 0.92);
    bgG.moveTo(hd.x - hd.w * 0.62, hd.y + 10);
    bgG.curveTo(hd.x - hd.w * 0.25, hd.y - 20, hd.x, hd.y - 8);
    bgG.curveTo(hd.x + hd.w * 0.28, hd.y - 25, hd.x + hd.w * 0.62, hd.y + 10);
    bgG.lineTo(hd.x + hd.w * 0.5, hd.y + 18);
    bgG.lineTo(hd.x - hd.w * 0.5, hd.y + 18);
    bgG.endFill();
    // 发光窗户
    bgG.lineStyle(0);
    bgG.beginFill(hd.light, 0.88);
    bgG.drawRoundRect(hd.x - hd.w * 0.22, hd.y + hd.h * 0.35, hd.w * 0.18, hd.h * 0.22, 5, 5);
    bgG.drawRoundRect(hd.x + hd.w * 0.06, hd.y + hd.h * 0.33, hd.w * 0.20, hd.h * 0.24, 5, 5);
    bgG.endFill();
    bgG.beginFill(0xffffff, 0.18);
    bgG.drawCircle(hd.x - hd.w * 0.12, hd.y + hd.h * 0.45, hd.w * 0.18);
    bgG.drawCircle(hd.x + hd.w * 0.16, hd.y + hd.h * 0.45, hd.w * 0.2);
    bgG.endFill();
  }
  // 糖果路灯和棒棒糖剪影
  var candyLights = [
    { x: 106, y: houseY + 78, c: 0xff7eb0 },
    { x: 214, y: houseY + 86, c: 0x7be8b7 },
    { x: 332, y: houseY + 90, c: 0xfbbf24 }
  ];
  for (var cli = 0; cli < candyLights.length; cli++) {
    var cl = candyLights[cli];
    bgG.lineStyle(1, 0xfde68a, 0.28);
    bgG.moveTo(cl.x, cl.y); bgG.lineTo(cl.x, cl.y - 20);
    bgG.lineStyle(0);
    bgG.beginFill(cl.c, 0.28); bgG.drawCircle(cl.x, cl.y - 24, 11); bgG.endFill();
    bgG.beginFill(cl.c, 0.78); bgG.drawCircle(cl.x, cl.y - 24, 5); bgG.endFill();
  }

  bg.alpha = 0;
  this.battleGroup.addChild(bg);

  // --- 7. 地面（魔法石板）---
  var ground = new egret.Shape();
  var gg = ground.graphics;
  var groundY = Math.floor(BATTLE_H * 0.67);
  var groundH = BATTLE_H - groundY;
  // 地面底色
  gg.beginFill(0x0f0628);
  gg.drawRect(0, groundY, stageW, groundH);
  gg.endFill();
  // 透视石板小路（从怪物区延伸到主角脚下，呼应概念稿）
  var pathTop = Math.floor(BATTLE_H * 0.40);
  gg.lineStyle(1, 0x8b6bd8, 0.16);
  gg.beginFill(0x2a1a58, 0.42);
  gg.moveTo(stageW / 2 - 58, pathTop);
  gg.lineTo(stageW / 2 + 58, pathTop);
  gg.lineTo(stageW / 2 + 116, BATTLE_H - 48);
  gg.lineTo(stageW / 2 - 116, BATTLE_H - 48);
  gg.endFill();
  for (var pr = 0; pr < 7; pr++) {
    var py = pathTop + pr * 28;
    var widen = pr * 7;
    gg.lineStyle(0.8, 0xc7a7ff, 0.12);
    gg.moveTo(stageW / 2 - 54 - widen, py);
    gg.curveTo(stageW / 2, py + 8, stageW / 2 + 54 + widen, py);
    gg.lineStyle(0);
  }
  for (var pc = -2; pc <= 2; pc++) {
    gg.lineStyle(0.8, 0x5b4bb0, 0.12);
    gg.moveTo(stageW / 2 + pc * 24, pathTop + 8);
    gg.lineTo(stageW / 2 + pc * 42, BATTLE_H - 54);
    gg.lineStyle(0);
  }
  // 石板纹（横向分格）
  var slabW = 62, slabH = 18;
  for (var row = 0; row < 3; row++) {
    var gy = groundY + row * slabH;
    var offset = (row % 2) * (slabW / 2);
    for (var col = -1; col < Math.ceil(stageW / slabW) + 1; col++) {
      var gx = col * slabW + offset;
      gg.lineStyle(0.8, 0x3b1f6e, 0.7);
      gg.drawRect(gx + 1, gy + 1, slabW - 2, slabH - 2);
      gg.lineStyle(0);
    }
  }
  // 地面裂缝发光（3条）
  var crackData = [
    { x1: 30,  x2: 90,  y: groundY + 4,  color: 0x7c3aed },
    { x1: 160, x2: 240, y: groundY + 8,  color: 0xc026d3 },
    { x1: 290, x2: 360, y: groundY + 3,  color: 0x2563eb }
  ];
  for (var ci = 0; ci < crackData.length; ci++) {
    var cd = crackData[ci];
    gg.lineStyle(2, cd.color, 0.15); gg.moveTo(cd.x1, cd.y); gg.lineTo(cd.x2, cd.y); gg.lineStyle(0);
    gg.lineStyle(1, cd.color, 0.35); gg.moveTo(cd.x1 + 4, cd.y); gg.lineTo(cd.x2 - 4, cd.y); gg.lineStyle(0);
    gg.beginFill(cd.color, 0.5); gg.drawCircle((cd.x1 + cd.x2) / 2, cd.y, 1.5); gg.endFill();
  }
  // 地面边缘发光线
  gg.lineStyle(1.5, 0x7c3aed, 0.5);
  gg.moveTo(0, groundY); gg.lineTo(stageW, groundY);
  gg.lineStyle(0.8, 0xc026d3, 0.3);
  gg.moveTo(0, groundY + 1); gg.lineTo(stageW, groundY + 1);
  gg.lineStyle(0);
  ground.alpha = 0;
  this.battleGroup.addChild(ground);

  // --- 8. 地面装饰（水晶石 + 蘑菇）---
  var deco = new egret.Shape();
  var dg = deco.graphics;
  // 水晶石（左侧）
  var crystalData = [
    { x: 10, y: groundY - 2,  h: 14, w: 6,  color: 0x7c3aed },
    { x: 18, y: groundY - 6,  h: 20, w: 5,  color: 0xa855f7 },
    { x: 26, y: groundY - 3,  h: 12, w: 5,  color: 0x6d28d9 }
  ];
  for (var ki = 0; ki < crystalData.length; ki++) {
    var kd = crystalData[ki];
    dg.lineStyle(0.8, 0xffffff, 0.4);
    dg.beginFill(kd.color, 0.85);
    dg.moveTo(kd.x, kd.y);
    dg.lineTo(kd.x - kd.w / 2, kd.y + kd.h);
    dg.lineTo(kd.x + kd.w / 2, kd.y + kd.h);
    dg.endFill();
    // 高光
    dg.lineStyle(0);
    dg.beginFill(0xffffff, 0.35);
    dg.moveTo(kd.x, kd.y + 2);
    dg.lineTo(kd.x - 1, kd.y + kd.h * 0.5);
    dg.lineTo(kd.x + 1, kd.y + kd.h * 0.5);
    dg.endFill();
  }
  // 水晶石（右侧）
  var crystalR = [
    { x: stageW - 12, y: groundY - 4,  h: 16, w: 6,  color: 0x2563eb },
    { x: stageW - 20, y: groundY - 8,  h: 22, w: 5,  color: 0x3b82f6 },
    { x: stageW - 28, y: groundY - 3,  h: 13, w: 5,  color: 0x1d4ed8 }
  ];
  for (var kri = 0; kri < crystalR.length; kri++) {
    var kd = crystalR[kri];
    dg.lineStyle(0.8, 0xffffff, 0.4);
    dg.beginFill(kd.color, 0.85);
    dg.moveTo(kd.x, kd.y);
    dg.lineTo(kd.x - kd.w / 2, kd.y + kd.h);
    dg.lineTo(kd.x + kd.w / 2, kd.y + kd.h);
    dg.endFill();
    dg.lineStyle(0);
    dg.beginFill(0xffffff, 0.35);
    dg.moveTo(kd.x, kd.y + 2);
    dg.lineTo(kd.x - 1, kd.y + kd.h * 0.5);
    dg.lineTo(kd.x + 1, kd.y + kd.h * 0.5);
    dg.endFill();
  }
  // 发光蘑菇（中央左右各一）
  var mushData = [
    { x: 55,  y: groundY, color: 0xec4899, spotColor: 0xfce7f3 },
    { x: stageW - 55, y: groundY, color: 0x10b981, spotColor: 0xd1fae5 }
  ];
  for (var mi2 = 0; mi2 < mushData.length; mi2++) {
    var md = mushData[mi2];
    // 光晕
    dg.beginFill(md.color, 0.12); dg.drawCircle(md.x, md.y, 14); dg.endFill();
    // 菌柄
    dg.lineStyle(0.8, 0xffffff, 0.3);
    dg.beginFill(0xfde68a, 0.8);
    dg.drawRect(md.x - 3, md.y - 10, 6, 10);
    dg.endFill();
    // 菌盖
    dg.beginFill(md.color, 0.9);
    dg.moveTo(md.x - 12, md.y - 10);
    dg.curveTo(md.x, md.y - 24, md.x + 12, md.y - 10);
    dg.endFill();
    // 白点
    dg.lineStyle(0);
    dg.beginFill(md.spotColor, 0.9);
    dg.drawCircle(md.x - 4, md.y - 16, 2);
    dg.drawCircle(md.x + 4, md.y - 14, 1.5);
    dg.drawCircle(md.x, md.y - 20, 1.2);
    dg.endFill();
  }
  deco.alpha = 0;
  this.battleGroup.addChild(deco);

  // --- 9. 前景舞台框：保留星夜氛围，同时把可战斗区域收束成清晰舞台 ---
  var stageFrame = new egret.Shape();
  var sf = stageFrame.graphics;
  var stageTop = 30 + 28 + 10;
  var stageBottomPad = 43;
  var stageFrameH = BATTLE_H - stageTop - stageBottomPad;
  sf.beginFill(0x050316, 0.22);
  sf.drawRoundRect(46, stageTop, stageW - 92, stageFrameH, 14, 14);
  sf.endFill();
  sf.beginFill(0xfbbf24, 0.045);
  sf.drawRoundRect(47, stageTop + 1, stageW - 94, stageFrameH - 2, 14, 14);
  sf.endFill();
  sf.lineStyle(3.2, 0xff7eb0, 0.18);
  sf.drawRoundRect(47, stageTop + 1, stageW - 94, stageFrameH - 2, 14, 14);
  sf.lineStyle(1.2, THEME.strokeGold, 0.7);
  sf.drawRoundRect(48, stageTop + 2, stageW - 96, stageFrameH - 4, 12, 12);
  sf.lineStyle(0.7, 0xffffff, 0.22);
  sf.drawRoundRect(51, stageTop + 5, stageW - 102, stageFrameH - 10, 10, 10);
  sf.lineStyle(0.8, THEME.lavender, 0.24);
  sf.moveTo(56, stageTop + Math.floor(stageFrameH * 0.58));
  sf.lineTo(stageW - 56, stageTop + Math.floor(stageFrameH * 0.58));
  sf.lineStyle(0);
  sf.beginFill(0xffffff, 0.05);
  sf.drawRoundRect(54, stageTop + 8, stageW - 108, 30, 10, 10);
  sf.endFill();
  sf.beginFill(THEME.accent, 0.95);
  this.drawStar(sf, 60, stageTop + 12, 3.5, 1.6, 5);
  this.drawStar(sf, stageW - 60, stageTop + 12, 3.5, 1.6, 5);
  sf.endFill();
  stageFrame.alpha = 0;
  this.battleGroup.addChild(stageFrame);

  // 位图视觉层：使用分层素材里的全屏战斗背景，按战斗区 cover 适配。
  var fieldSkin = new eui.Image();
  this.fieldSkin = fieldSkin;
  this._battleH = BATTLE_H;
  this.updateBattleScene(false);
  this.battleGroup.addChild(fieldSkin);
  var controlsSkin = new eui.Image();
  controlsSkin.source = assetUrl('assets/ui/battle-skin-controls.png');
  controlsSkin.width = stageW; controlsSkin.height = 60;
  controlsSkin.x = 0; controlsSkin.y = 0;
  controlsSkin.touchEnabled = false;
  controlsSkin.alpha = 0;
  this.battleGroup.addChild(controlsSkin);

  // 顶部功能入口已经移入HUD，战斗区从这里开始只保留角色、怪物和场景。
  var TOP_BTN_H = 0;
  var ROW2_H = 0;

  // ③ 辅助/锁定位：按概念图放回战斗舞台两侧，中央只留给怪物和主角。
  var SUP_COL_W = 68;
  var SUPPORT_SLOT_W = 70;
  var SUPPORT_SLOT_H = 88;
  var SUP_AREA_Y = TOP_BTN_H + ROW2_H + 28;
  var SUP_AREA_H = BATTLE_H - SUP_AREA_Y - 36;
  var SUP_SLOT_H = Math.floor(SUP_AREA_H / 4);
  this._supportSlots = [];
  var leftSup = new eui.Group();
  leftSup.x = 3; leftSup.y = SUP_AREA_Y;
  leftSup.width = SUP_COL_W; leftSup.height = SUP_AREA_H;
  for (var i = 0; i < 4; i++) {
    var slotY = i * SUP_SLOT_H + Math.floor((SUP_SLOT_H - SUPPORT_SLOT_H) / 2);
    var slot = this.createSupportSlot(i, true);
    slot.x = -1;
    slot.y = slotY;
    leftSup.addChild(slot);
    this._supportSlots[i] = { x: leftSup.x + slot.x + SUPPORT_SLOT_W / 2, y: leftSup.y + slot.y + SUPPORT_SLOT_H / 2 };
  }
  this.leftSupGroup = leftSup;
  this.battleGroup.addChild(leftSup);

  var rightSup = new eui.Group();
  rightSup.x = stageW - SUP_COL_W - 3; rightSup.y = SUP_AREA_Y;
  rightSup.width = SUP_COL_W; rightSup.height = SUP_AREA_H;
  for (var i = 4; i < 8; i++) {
    var slotY = (i - 4) * SUP_SLOT_H + Math.floor((SUP_SLOT_H - SUPPORT_SLOT_H) / 2);
    var slot = this.createSupportSlot(i, false);
    slot.x = -1;
    slot.y = slotY;
    rightSup.addChild(slot);
    this._supportSlots[i] = { x: rightSup.x + slot.x + SUPPORT_SLOT_W / 2, y: rightSup.y + slot.y + SUPPORT_SLOT_H / 2 };
  }
  this.rightSupGroup = rightSup;
  this.battleGroup.addChild(rightSup);

  // ⑤ 中央区
  var CENTER_X = SUP_COL_W + 4;
  var CENTER_W = stageW - (SUP_COL_W + 4) * 2;
  this._centerX = CENTER_X;
  this._centerW = CENTER_W;

  // --- 怪物区域 ---
  this._monsterAreaY = TOP_BTN_H + ROW2_H + 56;
  this._monsterAreaH = Math.floor(BATTLE_H * 0.27);

  // --- 主角（居中，靠下，地面线上方）---
  var heroGroup = new eui.Group();
  heroGroup.width = 88; heroGroup.height = 110;
  heroGroup.x = CENTER_X + Math.floor((CENTER_W - 88) / 2);
  heroGroup.y = Math.floor(BATTLE_H * 0.66);
  this._heroBaseY = heroGroup.y;

  // 脚下魔法阵（旋转层）
  var magicCircle = new egret.Shape();
  var mcG = magicCircle.graphics;
  mcG.lineStyle(1.5, THEME.accent, 0.7);
  mcG.drawCircle(0, 0, 26);
  mcG.lineStyle(1, THEME.pink, 0.5);
  mcG.drawCircle(0, 0, 20);
  mcG.lineStyle(0.8, THEME.accentSoft, 0.6);
  for (var mi = 0; mi < 6; mi++) {
    var mangle = (mi / 6) * Math.PI * 2;
    mcG.moveTo(0, 0);
    mcG.lineTo(24 * Math.cos(mangle), 24 * Math.sin(mangle));
  }
  mcG.lineStyle(0);
  mcG.beginFill(THEME.accent, 0.8);
  for (var si = 0; si < 4; si++) {
    var sangle = (si / 4) * Math.PI * 2 + Math.PI / 4;
    this.drawStar(mcG, 24 * Math.cos(sangle), 24 * Math.sin(sangle), 2, 1, 5);
  }
  mcG.endFill();
  magicCircle.x = 44;
  magicCircle.y = 101;
  magicCircle.scaleY = 0.35;
  heroGroup.addChild(magicCircle);
  this._magicCircle = magicCircle;

  // 主角本体位图：从 image2 概念稿裁切，替代旧的矢量角色外观。
  var heroSprite = new eui.Image();
  this.fitImageToBox(heroSprite, UI_ASSETS.hero, 90, 90, -1, 5);
  heroGroup.addChild(heroSprite);

  // 旧矢量主角保留为代码兜底，但在战斗页隐藏，避免和位图叠影。
  var heroShape = new egret.Shape();
  var hg = heroShape.graphics;
  // 袍子（紫渐变）
  hg.lineStyle(1.6, 0x3a0764);
  hg.beginFill(0x6b21a8);
  hg.moveTo(22, 44);
  hg.curveTo(18, 60, 16, 76);
  hg.lineTo(56, 76);
  hg.curveTo(54, 60, 50, 44);
  hg.endFill();
  hg.lineStyle(0);
  hg.beginFill(0x8b3bc9, 0.8);
  hg.moveTo(36, 44);
  hg.curveTo(42, 60, 46, 76);
  hg.lineTo(56, 76);
  hg.curveTo(54, 60, 50, 44);
  hg.endFill();
  // 金腰带 + 心形扣
  hg.beginFill(THEME.strokeGold);
  hg.drawRect(20, 52, 32, 4);
  hg.endFill();
  hg.beginFill(THEME.pink);
  hg.drawCircle(34, 54, 2.2);
  hg.drawCircle(38, 54, 2.2);
  hg.endFill();
  hg.beginFill(THEME.pink);
  hg.moveTo(31.8, 55); hg.lineTo(36, 58.5); hg.lineTo(40.2, 55);
  hg.endFill();
  // 头
  hg.lineStyle(1.5, 0x3a0764);
  hg.beginFill(0xfde68a);
  hg.drawCircle(36, 28, 14);
  hg.endFill();
  // 头发（刘海）
  hg.lineStyle(0);
  hg.beginFill(0x2a1a5c);
  hg.moveTo(22, 26);
  hg.curveTo(24, 18, 30, 16);
  hg.curveTo(36, 20, 42, 16);
  hg.curveTo(48, 18, 50, 26);
  hg.curveTo(46, 22, 36, 24);
  hg.curveTo(26, 22, 22, 26);
  hg.endFill();
  // 月冠
  hg.beginFill(THEME.accent);
  hg.drawCircle(36, 8, 5);
  hg.endFill();
  hg.beginFill(0x2a1a5c);
  hg.drawCircle(38, 7, 4);
  hg.endFill();
  hg.beginFill(THEME.accentSoft);
  this.drawStar(hg, 28, 6, 2, 1, 5);
  this.drawStar(hg, 45, 10, 1.5, 0.8, 5);
  hg.endFill();
  // 眼
  hg.beginFill(0xffffff);
  hg.drawEllipse(28, 24, 7, 8);
  hg.drawEllipse(37, 24, 7, 8);
  hg.endFill();
  hg.beginFill(0x4a3aa0);
  hg.drawEllipse(29.5, 25, 4, 6);
  hg.drawEllipse(38.5, 25, 4, 6);
  hg.endFill();
  hg.beginFill(0x1e1b4b);
  hg.drawCircle(31.5, 28, 1.8);
  hg.drawCircle(40.5, 28, 1.8);
  hg.endFill();
  hg.beginFill(0xffffff);
  hg.drawCircle(30.5, 26.5, 1);
  hg.drawCircle(39.5, 26.5, 1);
  hg.endFill();
  // 腮红
  hg.beginFill(THEME.pink, 0.5);
  hg.drawEllipse(25, 32, 4, 2);
  hg.drawEllipse(43, 32, 4, 2);
  hg.endFill();
  // 嘴
  hg.lineStyle(1.2, 0x92400e);
  hg.moveTo(33, 35);
  hg.curveTo(36, 38, 39, 35);
  // 法杖
  hg.lineStyle(1.5, 0x5c3a0a);
  hg.beginFill(0x92400e);
  hg.drawRect(58, 20, 3, 54);
  hg.endFill();
  // 心形宝珠（光晕 + 实心）
  hg.lineStyle(0);
  hg.beginFill(THEME.pink, 0.35);
  hg.drawCircle(59.5, 14, 11);
  hg.endFill();
  hg.beginFill(THEME.pink);
  hg.drawCircle(57, 14, 5);
  hg.drawCircle(62, 14, 5);
  hg.endFill();
  hg.beginFill(THEME.pink);
  hg.moveTo(53, 16); hg.lineTo(59.5, 23); hg.lineTo(66, 16);
  hg.endFill();
  hg.beginFill(0xffffff, 0.7);
  hg.drawCircle(56, 12, 1.5);
  hg.endFill();
  heroShape.alpha = 0;
  heroGroup.addChild(heroShape);

  // 名字标签
  var heroNameBg = new eui.Rect();
  heroNameBg.width = 52; heroNameBg.height = 14;
  heroNameBg.ellipseWidth = 7; heroNameBg.ellipseHeight = 7;
  heroNameBg.fillColor = THEME.bgMid; heroNameBg.fillAlpha = 0.85;
  heroNameBg.strokeColor = THEME.strokeGold; heroNameBg.strokeWeight = 0.5;
  heroNameBg.horizontalCenter = 0; heroNameBg.top = 92;
  heroGroup.addChild(heroNameBg);
  this._heroNameBg = heroNameBg;
  var heroName = new eui.Label();
  heroName.text = '星语法师'; heroName.size = 10; heroName.bold = true;
  heroName.textColor = THEME.accentSoft; heroName.horizontalCenter = 0; heroName.top = 93;
  heroGroup.addChild(heroName);
  this._heroNameLabel = heroName;
  this.levelLabel = new eui.Label();
  this.levelLabel.text = 'Lv.' + this.mainLevel; this.levelLabel.size = 10;
  this.levelLabel.textColor = THEME.accent; this.levelLabel.bold = true;
  this.levelLabel.horizontalCenter = 0; this.levelLabel.top = 79;
  heroGroup.addChild(this.levelLabel);
  this.heroGroup = heroGroup;
  this.battleGroup.addChild(heroGroup);

  // 魔法阵自转（循环）
  egret.Tween.get(magicCircle, { loop: true }).to({ rotation: 360 }, 12000);

  // --- 攻击力显示（主角名字下方，居中）---
  this.dpsLabel = new eui.Label();
  this.dpsLabel.text = '攻击力: ' + this.fmt(this.totalDps());
  this.dpsLabel.size = 10; this.dpsLabel.textColor = THEME.textDim;
  this.dpsLabel.width = CENTER_W; this.dpsLabel.height = 14;
  this.dpsLabel.textAlign = 'center';
  this.dpsLabel.x = CENTER_X; this.dpsLabel.y = heroGroup.y + 108;
  this.battleGroup.addChild(this.dpsLabel);

  // --- 底部状态区（独立 UI 层，不占用战斗背景，避免压住技能栏） ---
  // 这里只保留普通战斗状态；BOSS 倒计时并入顶部总血条区域。
  var STATUS_H = 52;
  var statusY = 4;
  var STATUS_W = stageW - 20;
  var STATUS_X = 10;
  var statusBar = new eui.Group();
  statusBar.width = stageW; statusBar.height = STATUS_BAR_H;
  statusBar.x = 0; statusBar.y = TOP_H + BATTLE_H;
  var statusBarBg = new eui.Rect();
  statusBarBg.percentWidth = 100; statusBarBg.percentHeight = 100;
  statusBarBg.fillColor = 0x050918; statusBarBg.fillAlpha = 1;
  statusBarBg.includeInLayout = false;
  statusBar.addChild(statusBarBg);
  var statusDivider = new eui.Rect();
  statusDivider.percentWidth = 100; statusDivider.height = 1;
  statusDivider.top = 0; statusDivider.fillColor = 0x172647; statusDivider.fillAlpha = 1;
  statusDivider.includeInLayout = false;
  statusBar.addChild(statusDivider);

  var statusPanel = new eui.Rect();
  statusPanel.width = STATUS_W; statusPanel.height = STATUS_H;
  statusPanel.x = STATUS_X; statusPanel.y = statusY;
  statusPanel.ellipseWidth = 12; statusPanel.ellipseHeight = 12;
  statusPanel.fillColor = 0x08051c; statusPanel.fillAlpha = 0.56;
  statusPanel.strokeColor = THEME.strokeGold; statusPanel.strokeWeight = 0.6; statusPanel.strokeAlpha = 0.35;
  statusBar.addChild(statusPanel);

  this._bossBarMaxWidth = this._hpMaxWidth || (stageW - 126);
  this.bossTimerLabel = new eui.Label();
  this.bossTimerLabel.text = ''; this.bossTimerLabel.size = 1; this.bossTimerLabel.textColor = 0xff6666;
  this.bossTimerLabel.bold = true; this.bossTimerLabel.alpha = 0;
  this.bossTimerLabel.visible = false;
  statusBar.addChild(this.bossTimerLabel);

  this.exploreLabel = new eui.Label();
  this.exploreLabel.text = this.getExploreText();
  this.exploreLabel.size = 12; this.exploreLabel.bold = true;
  this.exploreLabel.textColor = 0xfbbf24;
  this.exploreLabel.x = STATUS_X + 10; this.exploreLabel.y = statusY + 5;
  this.exploreLabel.width = STATUS_W - 20; this.exploreLabel.height = 14;
  this.exploreLabel.textAlign = 'center';
  statusBar.addChild(this.exploreLabel);

  // Row B: 当前轮次（1-10波）进度条
  this.waveFillBg = new eui.Rect();
  this.waveFillBg.width = STATUS_W - 16; this.waveFillBg.height = 8;
  this.waveFillBg.fillColor = THEME.bgGlass; this.waveFillBg.ellipseWidth = 3;
  this.waveFillBg.x = STATUS_X + 8; this.waveFillBg.y = statusY + 20;
  statusBar.addChild(this.waveFillBg);
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  this.waveFill = new eui.Rect();
  this.waveFill.width = (waveInCycle / 10) * (STATUS_W - 16);
  this.waveFill.height = 8; this.waveFill.fillColor = THEME.accent; this.waveFill.ellipseWidth = 3;
  this.waveFill.x = STATUS_X + 8; this.waveFill.y = statusY + 20;
  statusBar.addChild(this.waveFill);
  this._waveFillMaxWidth = STATUS_W - 16; // 供 updateUI 使用

  this.goalLabel = new eui.Label();
  this.goalLabel.text = this.getNextGoal().text;
  this.goalLabel.size = 9; this.goalLabel.textColor = THEME.accentSoft; this.goalLabel.bold = true;
  this.goalLabel.x = STATUS_X + 10; this.goalLabel.y = statusY + 31;
  this.goalLabel.width = 142; this.goalLabel.height = 11;
  this.goalLabel.textAlign = 'left';
  this.goalLabel.touchEnabled = true;
  this.goalLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.handleGoalTap(); }, this);
  statusBar.addChild(this.goalLabel);

  // Row C: 能量条（左, 120px）+ DPS(中) + Buff(右)
  var ENERGY_W = 150;
  var energyBarBg = new eui.Rect();
  energyBarBg.width = ENERGY_W; energyBarBg.height = 12;
  energyBarBg.ellipseWidth = 6; energyBarBg.ellipseHeight = 6;
  energyBarBg.fillColor = THEME.bgGlass;
  energyBarBg.x = STATUS_X + 8; energyBarBg.y = statusY + 40;
  statusBar.addChild(energyBarBg);
  this.energyFill = new eui.Rect();
  this.energyFill.width = (this.energy / this.getMaxEnergy()) * ENERGY_W;
  this.energyFill.height = 12;
  this.energyFill.ellipseWidth = 6; this.energyFill.ellipseHeight = 6;
  this.energyFill.fillColor = THEME.sky;
  this.energyFill.x = STATUS_X + 8; this.energyFill.y = statusY + 40;
  statusBar.addChild(this.energyFill);
  this._energyMaxWidth = ENERGY_W; // 供 updateUI 使用（替换硬编码 100）
  // 能量文字：紧跟在条右边，不再压在条上
  this.energyLabel = new eui.Label();
  this.energyLabel.text = '⚡' + Math.floor(this.energy) + '/' + this.getMaxEnergy();
  this.energyLabel.size = 11; this.energyLabel.textColor = THEME.sky; this.energyLabel.bold = true;
  this.energyLabel.x = STATUS_X + ENERGY_W + 14; this.energyLabel.y = statusY + 40;
  statusBar.addChild(this.energyLabel);

  var HPBAR_W = 72;
  var hpBarBg2 = new eui.Rect();
  hpBarBg2.width = HPBAR_W; hpBarBg2.height = 12;
  hpBarBg2.ellipseWidth = 6; hpBarBg2.ellipseHeight = 6;
  hpBarBg2.fillColor = THEME.bgGlass;
  hpBarBg2.x = STATUS_X + ENERGY_W + 74; hpBarBg2.y = statusY + 40;
  statusBar.addChild(hpBarBg2);
  this.playerHpFill = new eui.Rect();
  this.playerHpFill.width = HPBAR_W; this.playerHpFill.height = 12;
  this.playerHpFill.ellipseWidth = 6; this.playerHpFill.ellipseHeight = 6;
  this.playerHpFill.fillColor = 0xef4444;
  this.playerHpFill.x = hpBarBg2.x; this.playerHpFill.y = hpBarBg2.y;
  statusBar.addChild(this.playerHpFill);
  this._playerHpMaxWidth = HPBAR_W;
  this.playerHpLabel = new eui.Label();
  this.playerHpLabel.text = '❤' + Math.floor(this.playerHp);
  this.playerHpLabel.size = 10; this.playerHpLabel.textColor = 0xffc7c7; this.playerHpLabel.bold = true;
  this.playerHpLabel.width = HPBAR_W; this.playerHpLabel.height = 12; this.playerHpLabel.textAlign = 'center';
  this.playerHpLabel.x = hpBarBg2.x; this.playerHpLabel.y = hpBarBg2.y + 1;
  statusBar.addChild(this.playerHpLabel);

  // Buff 文本（右侧）：去掉自动/手动按钮后，这里给状态信息更多横向空间。
  this.buffLabel = new eui.Label();
  this.buffLabel.text = this.renderBuffText();
  this.buffLabel.size = 9; this.buffLabel.textColor = 0xfbbf24;
  this.buffLabel.width = 52; this.buffLabel.height = 12; this.buffLabel.textAlign = 'right';
  this.buffLabel.right = 14; this.buffLabel.y = statusY + 40;
  statusBar.addChild(this.buffLabel);

  // 伤害飘字层（不可触摸）
  this.damageLayer = new eui.Group();
  this.damageLayer.width = stageW; this.damageLayer.height = BATTLE_H;
  this.damageLayer.touchEnabled = false;
  this.damageLayer.touchChildren = false;
  this.battleGroup.addChild(this.damageLayer);

  this.battleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBattleTouch, this);
  this.main.addChild(this.battleGroup);
  this.main.addChild(statusBar);

  // ===== 技能栏 =====
  var skillBar = new eui.Group();
  skillBar.width = stageW; skillBar.height = SKILL_H;
  skillBar.x = 0; skillBar.y = TOP_H + BATTLE_H + STATUS_BAR_H;
  var skillLayout = new eui.HorizontalLayout();
  skillLayout.horizontalAlign = 'center';
  skillLayout.verticalAlign = 'middle';
  skillLayout.gap = 4;
  skillLayout.paddingLeft = 8;
  skillLayout.paddingRight = 8;
  skillLayout.paddingTop = 2;
  skillLayout.paddingBottom = 2;
  skillBar.layout = skillLayout;
  var skillBg = new eui.Rect();
  skillBg.percentWidth = 100; skillBg.percentHeight = 100; skillBg.fillColor = 0x050918;
  skillBg.fillAlpha = 1;
  skillBg.includeInLayout = false;
  skillBar.addChildAt(skillBg, 0);
  var skillDivider = new eui.Rect();
  skillDivider.percentWidth = 100; skillDivider.height = 2;
  skillDivider.top = 0; skillDivider.fillColor = 0x0c1b34; skillDivider.fillAlpha = 1;
  skillDivider.includeInLayout = false;
  skillBar.addChild(skillDivider);
  var skillSkin = new eui.Image();
  skillSkin.source = assetUrl('assets/ui/battle-skin-skills-clean.png');
  skillSkin.width = stageW; skillSkin.height = SKILL_H;
  skillSkin.x = 0; skillSkin.y = 0;
  skillSkin.alpha = 0;
  skillSkin.includeInLayout = false;
  skillBar.addChild(skillSkin);
  var skillShelf = new eui.Rect();
  skillShelf.width = stageW - 14; skillShelf.height = SKILL_H - 8;
  skillShelf.x = 7; skillShelf.y = 4;
  skillShelf.ellipseWidth = 13; skillShelf.ellipseHeight = 13;
  skillShelf.fillColor = 0x060316; skillShelf.fillAlpha = 0;
  skillShelf.strokeColor = THEME.strokeGold; skillShelf.strokeWeight = 0.8; skillShelf.strokeAlpha = 0;
  skillShelf.includeInLayout = false;
  skillBar.addChild(skillShelf);
  var skillTopLine = new eui.Rect();
  skillTopLine.percentWidth = 100; skillTopLine.height = 1;
  skillTopLine.top = 0; skillTopLine.fillColor = THEME.strokeGold; skillTopLine.fillAlpha = 0;
  skillTopLine.includeInLayout = false;
  skillBar.addChild(skillTopLine);

  for (var i = 0; i < SKILLS.length; i++) {
    var btn = this.createSkillBtn(i);
    this.skillBtns.push(btn);
    skillBar.addChild(btn);
  }
  this.main.addChild(skillBar);

  // ===== 底部导航 =====
  var navBar = new eui.Group();
  navBar.width = stageW; navBar.height = NAV_H;
  navBar.x = 0; navBar.y = TOP_H + BATTLE_H + STATUS_BAR_H + SKILL_H;
  navBar.layout = new eui.HorizontalLayout();
  navBar.layout.horizontalAlign = 'justify';
  navBar.layout.verticalAlign = 'middle';
  navBar.paddingLeft = 8; navBar.paddingRight = 8;
  var navBg = new eui.Rect();
  navBg.percentWidth = 100; navBg.percentHeight = 100; navBg.fillColor = 0x06101e;
  navBg.fillAlpha = 1;
  navBg.includeInLayout = false;
  navBar.addChildAt(navBg, 0);
  var navSkin = new eui.Image();
  navSkin.source = assetUrl('assets/ui/battle-skin-nav-clean.png');
  navSkin.width = stageW; navSkin.height = NAV_H;
  navSkin.x = 0; navSkin.y = 0;
  navSkin.alpha = 0;
  navSkin.includeInLayout = false;
  navBar.addChild(navSkin);
  var navShelf = new eui.Rect();
  navShelf.width = stageW - 12; navShelf.height = NAV_H - 8;
  navShelf.x = 6; navShelf.y = 4;
  navShelf.ellipseWidth = 12; navShelf.ellipseHeight = 12;
  navShelf.fillColor = 0x1a1035; navShelf.fillAlpha = 0;
  navShelf.strokeColor = THEME.strokeGold; navShelf.strokeWeight = 0.8; navShelf.strokeAlpha = 0;
  navShelf.includeInLayout = false;
  navBar.addChild(navShelf);
  var navTopLine = new eui.Rect();
  navTopLine.percentWidth = 100; navTopLine.height = 1;
  navTopLine.top = 0; navTopLine.fillColor = THEME.strokeGold; navTopLine.fillAlpha = 0;
  navTopLine.includeInLayout = false;
  navBar.addChild(navTopLine);

  var navItems = [
    { text: '升级', icon: 'upgrade', fn: function() { self.openUpgrade(); } },
    { text: '图签', icon: 'codex', fn: function() { self.openMonsterCodex(); } },
    { text: '转盘', icon: 'spin', fn: function() { self.openSpinWheel(); } },
    { text: '转生', icon: 'rebirth', fn: function() { self.openRebirth(); } },
    { text: '宝库', icon: 'vault', fn: function() { self.openVault(); } },
    { text: '成绩', icon: 'ranking', fn: function() { self.openFriendRanking(); } }
  ];
  for (var i = 0; i < navItems.length; i++) {
    var nb = this.createNavBtn(navItems[i].text, navItems[i].icon, navItems[i].fn);
    navBar.addChild(nb);
  }
  this.main.addChild(navBar);

  // 顶部栏必须压在战斗背景之上，避免缓存旧资源或首帧布局时被背景层盖掉。
  topBar.x = 0; topBar.y = 0;
  this.battleGroup.x = 0; this.battleGroup.y = TOP_H;
  statusBar.x = 0; statusBar.y = TOP_H + BATTLE_H;
  skillBar.x = 0; skillBar.y = TOP_H + BATTLE_H + STATUS_BAR_H;
  navBar.x = 0; navBar.y = TOP_H + BATTLE_H + STATUS_BAR_H + SKILL_H;
  this.main.setChildIndex(topBar, this.main.numChildren - 1);
};

// 创建战斗区左/右侧圆角按钮（小方块+文字）
Game.prototype.createSideBtn = function(text, x, y, fn) {
  var g = new eui.Group();
  g.width = 26; g.height = 26; g.x = x; g.y = y;
  var bg = new eui.Rect();
  bg.width = 26; bg.height = 26; bg.ellipseWidth = 8; bg.ellipseHeight = 8;
  bg.fillColor = THEME.bgLite; bg.fillAlpha = 0.85;
  bg.strokeColor = THEME.strokeGold; bg.strokeWeight = 1; bg.strokeAlpha = 0.7;
  bg.alpha = 0;
  g.addChild(bg);
  var lb = new eui.Label();
  lb.text = text; lb.size = 10; lb.textColor = THEME.accentSoft; lb.bold = true;
  lb.horizontalCenter = 0; lb.verticalCenter = 0;
  lb.alpha = 0;
  g.addChild(lb);
  g.touchEnabled = true;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, this);
  return g;
};

Game.prototype.createSupportSlot = function(idx, faceRight) {
  var s = this.supports[idx];
  var def = SUPPORTS_DEF[idx];
  var active = this.isSupportActive(idx);
  var available = this.isSupportAvailable(idx);
  var g = new eui.Group();
  g.width = 70; g.height = 88;
  g.name = 'support-' + idx;
  if (active) {
    var sprite = new eui.Image();
    var source = SUPPORT_IMAGE_ASSETS[idx] || UI_ASSETS.supportCandy;
    this.fitImageToBox(sprite, source, 68, 74, 1, 0);
    sprite.alpha = 1;
    g.addChild(sprite);
  } else {
    g.addChild(this.createMysterySupportSprite(idx, available));
  }

  var lbBg = new eui.Rect();
  lbBg.width = 58; lbBg.height = 15;
  lbBg.x = 6; lbBg.y = 69;
  lbBg.ellipseWidth = 6; lbBg.ellipseHeight = 6;
  lbBg.fillColor = 0x050918; lbBg.fillAlpha = 0.66;
  g.addChild(lbBg);
  var lb = new eui.Label();
  lb.text = active ? def.symbol.slice(0, 2) : (available ? '招募' : '???');
  lb.size = 9; lb.bold = true;
  lb.textColor = active ? THEME.accentSoft : THEME.textMute;
  lb.width = 58; lb.height = 13;
  lb.textAlign = 'center';
  lb.x = 6; lb.y = 72;
  g.addChild(lb);
  return g;
};

// 创建导航按钮（图标+文字）
Game.prototype.createNavBtn = function(text, icon, fn) {
  var g = new eui.Group();
  g.width = 58; g.height = 48;
  g.touchEnabled = true;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, this);
  var bg = new eui.Rect();
  bg.width = 54; bg.height = 44;
  bg.ellipseWidth = 10; bg.ellipseHeight = 10;
  bg.fillColor = 0x120b2a; bg.fillAlpha = 0.96;
  bg.strokeColor = THEME.strokeGold; bg.strokeWeight = 1; bg.strokeAlpha = 0.56;
  bg.horizontalCenter = 0; bg.verticalCenter = 0;
  g.addChild(bg);
  var navAsset = NAV_ICON_ASSETS[icon];
  if (navAsset) {
    var navImg = new eui.Image();
    this.fitImageToBox(navImg, navAsset, 52, 42, 3, 2);
    navImg.name = 'navIconImage';
    g.addChild(navImg);
  } else {
    var iconShape = new egret.Shape();
    this.drawNavIcon(iconShape.graphics, icon, THEME.accentSoft);
    iconShape.x = 29;
    iconShape.y = 18;
    iconShape.name = 'navIcon';
    g.addChild(iconShape);
  }
  var labelBg = new eui.Rect();
  labelBg.width = 50; labelBg.height = 13;
  labelBg.x = 4; labelBg.y = 32;
  labelBg.ellipseWidth = 6; labelBg.ellipseHeight = 6;
  labelBg.fillColor = 0x050918; labelBg.fillAlpha = 0.72;
  labelBg.name = 'labelBg';
  g.addChild(labelBg);
  var textLb = new eui.Label();
  textLb.text = text; textLb.size = 10; textLb.textColor = THEME.accent; textLb.bold = true;
  textLb.width = 58; textLb.height = 12;
  textLb.textAlign = 'center';
  textLb.horizontalCenter = 0;
  textLb.top = 33;
  g.addChild(textLb);
  return g;
};

Game.prototype.createSkillBtn = function(idx) {
  var s = SKILLS[idx];
  var unlocked = this.mainLevel >= s.lv;
  var g = new eui.Group();
  g.width = 47; g.height = 48;
  var slot = new eui.Rect();
  slot.width = 45; slot.height = 46;
  slot.x = 1; slot.y = 1;
  slot.ellipseWidth = 10; slot.ellipseHeight = 10;
  slot.fillColor = unlocked ? 0x120b2a : 0x0c1024;
  slot.fillAlpha = 0.96;
  slot.strokeColor = unlocked ? THEME.strokeGold : 0x4a4566;
  slot.strokeWeight = 1; slot.strokeAlpha = unlocked ? 0.58 : 0.38;
  slot.name = 'slot';
  g.addChild(slot);
  var halo = new eui.Rect();
  halo.width = 32; halo.height = 32;
  halo.ellipseWidth = 16; halo.ellipseHeight = 16;
  halo.fillColor = unlocked ? s.color : 0x3a355a;
  halo.fillAlpha = 0.22;
  halo.x = 7; halo.y = 3;
  halo.name = 'halo';
  halo.visible = false;
  g.addChild(halo);
  var bg = new eui.Rect();
  bg.width = 28; bg.height = 28; bg.ellipseWidth = 14; bg.ellipseHeight = 14;
  bg.fillColor = unlocked ? s.color : 0x4a4566;
  bg.x = 9; bg.y = 5;
  bg.name = 'bg'; bg.visible = false; g.addChild(bg);
  var border = new eui.Rect();
  border.width = 28; border.height = 28; border.ellipseWidth = 14; border.ellipseHeight = 14;
  border.fillAlpha = 0;
  border.strokeColor = unlocked ? THEME.accentSoft : 0x6a628f;
  border.strokeWeight = 1.3;
  border.x = 9; border.y = 5;
  border.name = 'border'; border.visible = false; g.addChild(border);
  var skillAsset = SKILL_ICON_ASSETS[idx];
  if (skillAsset) {
    var skillImg = new eui.Image();
    this.fitImageToBox(skillImg, skillAsset, 43, 44, 2, 1);
    skillImg.name = 'iconImage';
    skillImg.alpha = unlocked ? 1 : 0.42;
    g.addChild(skillImg);
  } else {
    var iconShape = new egret.Shape();
    this.drawSkillIcon(iconShape.graphics, s.icon, unlocked);
    iconShape.x = 23; iconShape.y = 19;
    iconShape.name = 'iconShape';
    g.addChild(iconShape);
  }
  var cdLb = new eui.Label();
  cdLb.text = ''; cdLb.size = 12; cdLb.textColor = THEME.textMain; cdLb.bold = true;
  cdLb.horizontalCenter = 0; cdLb.top = 12;
  cdLb.name = 'cdLb';
  cdLb.visible = false;
  g.addChild(cdLb);
  var labelBg = new eui.Rect();
  labelBg.width = 43; labelBg.height = 13;
  labelBg.x = 2; labelBg.y = 34;
  labelBg.ellipseWidth = 6; labelBg.ellipseHeight = 6;
  labelBg.fillColor = 0x050918; labelBg.fillAlpha = 0.74;
  labelBg.name = 'labelBg';
  g.addChild(labelBg);
  var lb = new eui.Label();
  lb.text = unlocked ? s.name : 'Lv' + s.lv;
  lb.size = 9; lb.textColor = unlocked ? THEME.accentSoft : THEME.textMute;
  lb.bold = true;
  lb.width = 47; lb.height = 12;
  lb.textAlign = 'center';
  lb.x = 0; lb.y = 35;
  lb.name = 'lb';
  g.addChild(lb);

  g.touchEnabled = true;
  var self = this;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.useSkill(idx); }, this);
  return g;
};

Game.prototype.drawNavIcon = function(g, key, color) {
  var c = color || THEME.accentSoft;
  g.lineStyle(2, c, 1);
  g.beginFill(c, 0.12);
  switch (key) {
    case 'upgrade':
      g.moveTo(0, -11); g.lineTo(10, -1); g.lineTo(4, -1); g.lineTo(4, 10);
      g.lineTo(-4, 10); g.lineTo(-4, -1); g.lineTo(-10, -1); g.lineTo(0, -11);
      g.endFill();
      break;
    case 'codex':
      g.drawRoundRect(-10, -10, 20, 20, 3, 3);
      g.moveTo(0, -10); g.lineTo(0, 10);
      g.moveTo(-7, -5); g.lineTo(-3, -5);
      g.moveTo(3, -5); g.lineTo(7, -5);
      g.moveTo(-7, 1); g.lineTo(-3, 1);
      g.moveTo(3, 1); g.lineTo(7, 1);
      g.endFill();
      break;
    case 'spin':
      g.drawCircle(0, 0, 11);
      g.moveTo(0, 0); g.lineTo(0, -10);
      g.moveTo(0, 0); g.lineTo(9, 4);
      g.moveTo(0, 0); g.lineTo(-8, 6);
      g.endFill();
      break;
    case 'market':
      g.drawRoundRect(-10, -3, 20, 12, 2, 2);
      g.moveTo(-8, -3); g.lineTo(-6, -10); g.lineTo(6, -10); g.lineTo(8, -3);
      g.moveTo(-5, 10); g.lineTo(-5, 12);
      g.moveTo(5, 10); g.lineTo(5, 12);
      g.endFill();
      break;
    case 'rank':
      g.drawRect(-8, -1, 4, 11);
      g.drawRect(-2, -8, 4, 18);
      g.drawRect(4, -4, 4, 14);
      g.endFill();
      break;
    case 'shop':
      g.drawRoundRect(-9, -5, 18, 14, 3, 3);
      g.moveTo(-6, -5); g.lineTo(-6, -10);
      g.curveTo(-6, -14, 0, -14);
      g.curveTo(6, -14, 6, -10);
      g.lineTo(6, -5);
      g.endFill();
      break;
    default:
      g.drawCircle(0, 0, 9);
      g.endFill();
  }
};

Game.prototype.drawSupportMiniIcon = function(g, def, unlocked) {
  var cx = 20, cy = 22;
  var c = unlocked ? def.color : 0x5b547a;
  var ol = unlocked ? 0xffffff : 0x2a2446;
  g.lineStyle(1.2, ol, unlocked ? 0.58 : 0.35);

  if (!unlocked) {
    g.beginFill(0x4a4566, 0.72);
    g.drawCircle(cx, cy, 12);
    g.endFill();
    g.lineStyle(1.5, 0xb8b0db, 0.8);
    g.drawRoundRect(cx - 6, cy - 2, 12, 10, 3, 3);
    g.moveTo(cx - 4, cy - 2);
    g.lineTo(cx - 4, cy - 6);
    g.curveTo(cx - 4, cy - 10, cx, cy - 10);
    g.curveTo(cx + 4, cy - 10, cx + 4, cy - 6);
    g.lineTo(cx + 4, cy - 2);
    g.lineStyle(0);
    return;
  }

  switch (def.shape) {
    case 'candy':
      g.beginFill(0xff9ec8, 0.95);
      g.moveTo(cx - 18, cy); g.lineTo(cx - 10, cy - 7); g.lineTo(cx - 10, cy + 7); g.endFill();
      g.beginFill(0xff9ec8, 0.95);
      g.moveTo(cx + 18, cy); g.lineTo(cx + 10, cy - 7); g.lineTo(cx + 10, cy + 7); g.endFill();
      g.beginFill(c); g.drawCircle(cx, cy, 11); g.endFill();
      break;
    case 'marshmallow':
      g.beginFill(c);
      g.drawCircle(cx - 6, cy + 2, 8);
      g.drawCircle(cx + 6, cy + 2, 8);
      g.drawCircle(cx, cy - 5, 9);
      g.endFill();
      break;
    case 'meatball':
      g.lineStyle(1.4, 0x5a2808, 0.7);
      g.beginFill(c);
      g.drawCircle(cx, cy + 3, 10);
      g.drawCircle(cx - 7, cy - 6, 6);
      g.drawCircle(cx + 6, cy - 8, 5);
      g.endFill();
      break;
    case 'pudding':
      g.beginFill(c);
      g.moveTo(cx - 12, cy + 10); g.lineTo(cx + 12, cy + 10); g.lineTo(cx + 9, cy - 5); g.lineTo(cx - 9, cy - 5); g.endFill();
      g.beginFill(0xa05a14); g.drawEllipse(cx - 9, cy - 8, 18, 6); g.endFill();
      break;
    case 'cone':
      g.beginFill(0xd49a5a);
      g.moveTo(cx - 10, cy - 2); g.lineTo(cx + 10, cy - 2); g.lineTo(cx, cy + 14); g.endFill();
      g.beginFill(c); g.drawCircle(cx, cy - 8, 8); g.endFill();
      break;
    case 'mochi':
      g.beginFill(c);
      g.drawRoundRect(cx - 13, cy - 9, 26, 20, 10, 10);
      g.endFill();
      break;
    case 'popsicle':
      g.beginFill(c);
      g.drawRoundRect(cx - 8, cy - 14, 16, 26, 8, 8);
      g.endFill();
      g.beginFill(0xd49a5a); g.drawRect(cx - 2, cy + 10, 4, 8); g.endFill();
      break;
    case 'cake':
      g.beginFill(c);
      g.drawRoundRect(cx - 12, cy - 8, 24, 18, 6, 6);
      g.endFill();
      g.beginFill(0xffffff, 0.85);
      g.drawRoundRect(cx - 10, cy - 12, 20, 8, 5, 5);
      g.endFill();
      break;
    default:
      g.beginFill(c); g.drawCircle(cx, cy, 11); g.endFill();
  }

  g.lineStyle(0);
  g.beginFill(0xffffff, 0.62);
  g.drawEllipse(cx - 6, cy - 8, 7, 3);
  g.endFill();
  drawEyesPair(g, cx - 4, cy - 1, cx + 4, cy - 1, 1.6, 0.8);
};

/**
 * 绘制技能矢量图标（位于 (0,0) 中心）。
 */
Game.prototype.drawSkillIcon = function(g, key, enabled) {
  var line = enabled ? THEME.textMain : 0x8881b0;
  var fill = enabled ? THEME.textMain : 0xb8b0db;
  switch (key) {
    case 'slash':
      g.lineStyle(2.5, line);
      g.moveTo(-8, 6); g.lineTo(8, -6);
      g.lineStyle(1.5, line, 0.6);
      g.moveTo(4, -8); g.lineTo(8, -6); g.lineTo(6, -2);
      break;
    case 'smash':
      g.lineStyle(1.5, line);
      g.beginFill(fill);
      g.drawRoundRect(-8, -8, 16, 6, 2, 2);
      g.drawRect(-1, -2, 2, 10);
      g.endFill();
      break;
    case 'triple':
      g.lineStyle(2, line);
      g.moveTo(-9, 6); g.lineTo(-4, -4);
      g.moveTo(-3, 7); g.lineTo(2, -3);
      g.moveTo(3, 8); g.lineTo(8, -2);
      break;
    case 'crit':
      g.lineStyle(1.5, line);
      g.beginFill(fill);
      g.moveTo(0, -9); g.lineTo(8, 0); g.lineTo(0, 9); g.lineTo(-8, 0);
      g.endFill();
      g.lineStyle(1, line, 0.7);
      g.moveTo(-8, 0); g.lineTo(8, 0);
      g.moveTo(0, -9); g.lineTo(0, 9);
      break;
    case 'whirl':
      g.lineStyle(2, line);
      g.moveTo(8, 0); g.curveTo(6, 6, 0, 8);
      g.moveTo(0, -8); g.curveTo(6, -6, 8, 0);
      g.moveTo(-8, 0); g.curveTo(-6, -6, 0, -8);
      g.moveTo(0, 8); g.curveTo(-6, 6, -8, 0);
      break;
    case 'thunder':
      g.lineStyle(1.5, line);
      g.beginFill(fill);
      g.moveTo(-2, -9); g.lineTo(4, -2); g.lineTo(0, -1);
      g.lineTo(3, 9); g.lineTo(-4, 2); g.lineTo(0, 0);
      g.lineTo(-4, -1);
      g.endFill();
      break;
    case 'meteor':
      g.lineStyle(1.5, line);
      g.beginFill(fill);
      this.drawStar(g, 1, 1, 8, 3.5, 5);
      g.endFill();
      g.lineStyle(2, line, 0.7);
      g.moveTo(-8, -8); g.lineTo(-3, -3);
      g.lineStyle(1.2, line, 0.5);
      g.moveTo(-5, -8); g.lineTo(-1, -4);
      g.moveTo(-8, -5); g.lineTo(-4, -1);
      break;
    default:
      g.beginFill(fill);
      g.drawCircle(0, 0, 5);
      g.endFill();
  }
};

Game.prototype.renderBuffText = function() {
  var parts = [];
  this.ensureRelics();
  this.ensureEquipment();
  this.ensureRebirthTalents();
  for (var i = 0; i < FOODS.length; i++) {
    var count = this.foods[FOODS[i].name] || 0;
    if (count > 0) parts.push(FOODS[i].icon + count);
  }
  var equipTotal = 0;
  for (var e = 0; e < this.equipmentLevels.length; e++) equipTotal += this.equipmentLevels[e] || 0;
  if (equipTotal > 0) parts.push('装' + equipTotal);
  var talentTotal = 0;
  for (var t = 0; t < this.rebirthTalents.length; t++) talentTotal += this.rebirthTalents[t] || 0;
  if (talentTotal > 0) parts.push('天' + talentTotal);
  if (this.forgeStones > 0) parts.push('石' + this.forgeStones);
  var sb = this.skillBuffs || {};
  if (sb.attackTime > 0) parts.push('攻+' + sb.attackTime + 's');
  if (sb.speedTime > 0) parts.push('速+' + sb.speedTime + 's');
  if (sb.critTime > 0) parts.push('暴+' + sb.critTime + 's');
  if (sb.shieldTime > 0) parts.push('盾' + sb.shieldTime + 's');
  if (this.coreWeapon && this.coreWeapon.owned) parts.push('吸血');
  var bd = this.bossDebuffs || {};
  if (bd.critDownTime > 0) parts.push('暴降' + bd.critDownTime + 's');
  if (bd.cooldownSlowTime > 0) parts.push('冷却+' + bd.cooldownSlowTime + 's');
  if (bd.energyBurnTime > 0) parts.push('灼烧' + bd.energyBurnTime + 's');
  return parts.join(' ');
};

Game.prototype.getNextGoal = function() {
  this.resetDailyTasks();
  for (var i = 0; i < this.dailyTaskDone.length; i++) {
    if (this.dailyTaskDone[i] && !this.dailyTaskClaimed[i]) return { text: '目标：每日任务可领取', action: 'daily' };
  }
  if (this.pendingBossReward && this.pendingBossReward.reward) {
    return { text: '奖励：' + this.pendingBossReward.reward.title + '，点击查看', action: 'bossReward' };
  }
  if (this.playerHp < this.getMaxPlayerHp() * 0.28) {
    if (this.rebirthGems >= 4) return { text: '目标：生命偏低，去秘宝阁强化龙鳞护甲', action: 'relic' };
    return { text: '目标：生命偏低，先刷小怪回血或升级主角', action: 'battle' };
  }
  this.ensureRebirthTalents();
  for (var talentIdx = 0; talentIdx < REBIRTH_TALENTS.length; talentIdx++) {
    if ((this.rebirthTalents[talentIdx] || 0) < REBIRTH_TALENTS[talentIdx].max && this.rebirthGems >= this.getRebirthTalentCost(talentIdx)) {
      return { text: '目标：升级转生天赋' + REBIRTH_TALENTS[talentIdx].name + '，强化长期路线', action: 'rebirth' };
    }
  }
  var nextBossPower = this.getBossPowerInfo(this.getNextBossWave());
  if (this.bossActive) {
      if (this.bossCounter && this.bossCounter.charging) return { text: '目标：BOSS蓄力中，释放技能打断', action: 'battle' };
      return { text: '目标：限时击败BOSS · 战力' + this.fmt(nextBossPower.current) + '/' + this.fmt(nextBossPower.recommended), action: 'battle' };
  }
  var progress = this.getProgressInfoForWave(this.wave);
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  if (waveInCycle >= 9 && this.wave % 10 !== 0) {
    return { text: '目标：挑战BOSS ' + progress.chapterBoss + '/' + BOSSES_PER_CHAPTER + ' · 战力' + this.fmt(nextBossPower.current) + '/' + this.fmt(nextBossPower.recommended), action: 'boss' };
  }
  var mainCost = CONFIG.upgradeCost(this.mainLevel);
  if (this.gold >= mainCost) {
    return { text: '目标：升级主角，提升Boss通过率', action: 'upgrade' };
  }
  this.ensureEquipment();
  for (var eq = 0; eq < EQUIPMENT_DEFS.length; eq++) {
    if ((this.equipmentLevels[eq] || 0) < EQUIPMENT_DEFS[eq].max && this.forgeStones >= this.getEquipmentCost(eq)) {
      return { text: '目标：锻造' + EQUIPMENT_DEFS[eq].name + '，补强长期战力', action: 'equipment' };
    }
  }
  for (var s = 0; s < this.supports.length; s++) {
    if (this.isSupportActive(s) && this.gold >= CONFIG.supportCost(this.supports[s].level)) {
      return { text: '目标：升级队友，增加挂机输出', action: 'upgrade' };
    }
  }
  for (var r = 0; r < this.supports.length; r++) {
    if (this.isSupportAvailable(r) && !this.supports[r].unlocked) {
      return { text: '目标：招募' + this.supports[r].name + '，开启队友输出', action: 'upgrade' };
    }
  }
  for (var k = 0; k < SKILLS.length; k++) {
    if (!this.skillUnlocked[k]) {
      return { text: '目标：主角Lv.' + SKILLS[k].lv + '解锁' + SKILLS[k].name, action: 'upgrade' };
    }
  }
  var nextSupport = null;
  for (var j = 0; j < SUPPORTS_DEF.length; j++) {
    if (!this.isSupportAvailable(j)) { nextSupport = SUPPORTS_DEF[j]; break; }
  }
  if (nextSupport) {
    return { text: '目标：主角Lv.' + nextSupport.recruitLv + '解锁神秘队友', action: 'upgrade' };
  }
  var bestCodex = null;
  var bestNeed = 999999;
  var allTypes = MONSTER_TYPES.concat(BOSS_TYPES);
  for (var c = 0; c < allTypes.length; c++) {
    var mt = allTypes[c];
    if (!mt || !this.monsterCodex[mt.shape]) continue;
    var isBossCard = c >= MONSTER_TYPES.length;
    var nextKills = this.getCodexNextResearchKills(mt.shape, isBossCard);
    if (!nextKills) continue;
    var curKills = this.monsterCodex[mt.shape].kills || 0;
    var need = nextKills - curKills;
    if (need > 0 && need < bestNeed) {
      bestNeed = need;
      bestCodex = { type: mt, next: nextKills };
    }
  }
  if (bestCodex && bestNeed <= 8) {
    return { text: '目标：再击杀' + bestNeed + '只' + bestCodex.type.name + '，图签研究升级', action: 'codex' };
  }
  return { text: '目标：推进' + this.getProgressTitle() + '，准备下一轮BOSS', action: 'battle' };
};

Game.prototype.handleGoalTap = function() {
  var goal = this.getNextGoal();
  if (!goal) return;
  if (goal.action === 'daily') {
    this.openDailyTasks();
  } else if (goal.action === 'upgrade') {
    this.openUpgrade();
  } else if (goal.action === 'equipment') {
    this.openUpgrade('equipment');
  } else if (goal.action === 'boss') {
    this.challengeBoss();
  } else if (goal.action === 'bossReward') {
    this.openPendingBossReward();
  } else if (goal.action === 'relic') {
    this.openSupermarket();
  } else if (goal.action === 'codex') {
    this.openMonsterCodex();
  } else if (goal.action === 'rebirth') {
    this.openRebirth();
  } else {
    this.showToast(goal.text.replace('目标：', ''));
  }
};

Game.prototype.toggleAutoAttack = function(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  this.autoAttackEnabled = !this.autoAttackEnabled;
  this.updateAutoBtn();
  this.saveGame();
  this.showToast(this.autoAttackEnabled ? '↻ 自动战斗已开启' : '↻ 自动战斗已关闭');
};

Game.prototype.updateAutoBtn = function() {
  if (this.autoBtnBg) {
    this.autoBtnBg.fillColor = this.autoAttackEnabled ? 0x6b4a18 : 0x241746;
    this.autoBtnBg.strokeAlpha = this.autoAttackEnabled ? 0.82 : 0.48;
  }
  if (this.autoBtnLabel) {
    this.autoBtnLabel.text = this.autoAttackEnabled ? '↻ 自动' : '↻ 手动';
    this.autoBtnLabel.textColor = this.autoAttackEnabled ? THEME.accentSoft : THEME.textDim;
  }
};

// ==================== 事件 ====================

Game.prototype.bindEvents = function() {
  var self = this;
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      self.battleAreaClick();
    }
  });
  window.addEventListener('beforeunload', function() { self.saveGame(); });
};

Game.prototype.onBattleTouch = function(e) {
  if (this._justHitMonster) { this._justHitMonster = false; return; }
  this.battleAreaClick();
};

Game.prototype.battleAreaClick = function() {
  var cost = CONFIG.attackEnergyCost;
  if (this.monsters.length > 0 && this.energy >= cost) {
    this.sfxAttack(false);
    this.energy -= cost;
    this.stats.totalClicks++;
    this.checkDailyTasks('click');
    var target = this.monsters[0];
    var tIdx = 0;
    for (var i = 1; i < this.monsters.length; i++) {
      if (this.monsters[i].hp > target.hp) { target = this.monsters[i]; tIdx = i; }
    }
    this.heroAttackAnim(tIdx);
    this.doDamage(target, CONFIG.mainDmg(this.mainLevel, this.rebirthGems), tIdx, false, 'phys');
  }
};

Game.prototype.onMonsterTouch = function(idx) {
  this._justHitMonster = true;
  var m = this.monsters[idx];
  var cost = CONFIG.attackEnergyCost;
  if (!m || m.hp <= 0 || this.energy < cost) return;
  this.sfxAttack(false);
  this.energy -= cost;
  this.stats.totalClicks++;
  this.checkDailyTasks('click');
  this.heroAttackAnim(idx);
  this.doDamage(m, CONFIG.mainDmg(this.mainLevel, this.rebirthGems), idx, false, 'phys');
};

// ==================== 战斗逻辑 ====================

Game.prototype.doDamage = function(m, dmg, idx, isCrit, damageType) {
  damageType = damageType || 'phys';
  if (isCrit === undefined) isCrit = false;
  var buffs = this.getBuffs();
  dmg = Math.floor(dmg * buffs.attackMult);
  if (m.isBoss) dmg = Math.floor(dmg * (buffs.bossDamageMult || 1));
  var canCrit = damageType !== 'true' && m.trait !== 'antiCrit';
  if (!isCrit && canCrit && Math.random() < buffs.critChance) { dmg *= 2; isCrit = true; }
  var resistMult = this.getResistanceMultiplier(m, damageType, isCrit);
  if ((m.trait === 'dodge' || m.trait === 'phase') && damageType === 'phys' && Math.random() < 0.12) {
    this.showDamageText('闪避', false, idx);
    this.updateUI();
    return;
  }
  if (m.trait === 'shield' && !m._shieldBroken && damageType !== 'true') {
    m._shieldHits = (m._shieldHits || 0) + 1;
    if (m._shieldHits >= 2) {
      m._shieldBroken = true;
      this.showDamageText('破盾', true, idx);
    }
  }
  if (damageType === 'magic' && m.weakness === 'magic') dmg = Math.floor(dmg * 1.12);
  if (damageType === 'phys' && m.weakness === 'phys') dmg = Math.floor(dmg * 1.1);
  if (damageType === 'true' && m.weakness === 'true') dmg = Math.floor(dmg * 1.16);
  if (m.type && m.type.shape) {
    dmg = Math.floor(dmg * (1 + this.getCodexDamageBonus(m.type.shape, !!m.isBoss)));
  }
  dmg = Math.max(1, Math.floor(dmg * resistMult));
  var beforeHp = m.hp;
  m.hp -= dmg;
  var dealt = Math.max(0, Math.min(beforeHp, dmg));
  // F1 镜像：物理攻击反弹少量伤害。直接扣 HP，不走 takePlayerDamage，避免递归触发战败。
  if (m.trait === 'mirror' && damageType === 'phys' && dealt > 0) {
    this.playerHp = Math.max(1, this.playerHp - Math.max(1, Math.floor(dealt * 0.06)));
  }
  if (dealt > 0 && this.coreWeapon && this.coreWeapon.owned) {
    var leech = Math.min(this.getMaxPlayerHp() * CORE_WEAPON_DEF.healCap, dealt * CORE_WEAPON_DEF.lifesteal);
    this.healPlayer(leech, CORE_WEAPON_DEF.name, true);
  }
  if (isCrit) this.sfxCrit();
  var isWeakHit = !!(m.weakness && m.weakness === damageType);
  this.showDamageText(dmg, isCrit, idx, damageType, isWeakHit);
  if (this._v1HitFlash !== false) this._v1HitFlashFx(idx);
  // 怪物受击闪烁效果
  if (this.monsterViews[idx]) {
    var mv = this.monsterViews[idx];
    egret.Tween.get(mv).to({ alpha: 0.3 }, 50).to({ alpha: 1 }, 80);
    var hitSprite = mv._sprite || mv;
    var origX = hitSprite.x;
    egret.Tween.get(hitSprite, { override: false })
      .to({ x: origX + 3 }, 30)
      .to({ x: origX - 3 }, 30)
      .to({ x: origX }, 30);
  }
  if (m.hp <= 0) {
    this.onKill(m, idx);
  } else {
    this.updateMonsterHealthView(idx);
  }
  this.updateUI();
};

// ==================== V1 表现层 · 统一 FX 生命周期 ====================
// §12 事故教训：iframe / 后台标签下 rAF 被节流，egret.Tween 的 .call() 可能永不触发。
// 因此所有新增显示对象都走这里：幂等 forceRemove + 原生 setTimeout 兜底 + 数量上限。
// 四个开关（_v1HitFlash / _v1ShakeTiers / _v1Crossfade / _v1RareFx）缺省开启，
// 在实例上置 false 即可单点回退，不触碰任何数值 / 公式 / 存档结构。
var V1_FX_MAX_LIVE = 40;

Game.prototype._v1TrackFx = function(obj, parent, animate, ttl, tag) {
  if (!obj || !parent) return null;
  var live = this._v1FxLive || (this._v1FxLive = []);
  for (var i = live.length - 1; i >= 0; i--) {
    if (!live[i] || !live[i].obj || !live[i].obj.parent) live.splice(i, 1);
  }
  if (live.length >= V1_FX_MAX_LIVE) return null; // 超限直接不创建，绝不无界 addChild
  var entry = { obj: obj, parent: parent, removed: false };
  var forceRemove = function() {
    if (entry.removed) return;
    entry.removed = true;
    try { egret.Tween.removeTweens(obj); } catch (e) {}
    if (obj.parent) obj.parent.removeChild(obj);
    var k = live.indexOf(entry);
    if (k >= 0) live.splice(k, 1);
  };
  entry.forceRemove = forceRemove;
  live.push(entry);
  parent.addChild(obj);
  try {
    if (animate) animate(obj, forceRemove);
  } catch (e) {
    forceRemove();
    return null;
  }
  this.safeTimeout(tag || 'v1-fx', forceRemove, ttl || 900);
  return obj;
};

// V1-1：受击闪白。80ms 白色高光叠在怪物位置，自带幂等回收与 320ms 原生兜底。
Game.prototype._v1HitFlashFx = function(idx) {
  if (this._v1HitFlash === false) return null;
  if (!this.damageLayer) return null;
  var pos = this.getMonsterCenter(idx);
  var flash = new egret.Shape();
  flash.graphics.beginFill(0xffffff, 0.85);
  flash.graphics.drawRoundRect(-22, -22, 44, 44, 12);
  flash.graphics.endFill();
  flash.x = pos.x;
  flash.y = pos.y;
  flash.scaleX = 0.6;
  flash.scaleY = 0.6;
  flash.touchEnabled = false;
  return this._v1TrackFx(flash, this.damageLayer, function(o, done) {
    egret.Tween.get(o)
      .to({ scaleX: 1.1, scaleY: 1.1, alpha: 0.7 }, 40)
      .to({ scaleX: 1.25, scaleY: 1.25, alpha: 0 }, 80)
      .call(done);
  }, 320, 'v1-hit-flash');
};

// V1-7：稀有遭遇出场金色描边 + 缩放弹跳，挂在怪物 view 上，自带幂等回收与原生兜底。
// 专属美术仍留 V2；这里只补表现，不改刷怪表 / 数值 / 存档。
Game.prototype._v1RareSpawnFx = function(view, visualW, sz) {
  if (!view) return null;
  var ring = new egret.Shape();
  ring.graphics.lineStyle(2, THEME.strokeGold, 0.95);
  ring.graphics.drawCircle(0, 0, Math.max(18, Math.floor(sz * 0.55)));
  ring.graphics.lineStyle(1, THEME.accentSoft, 0.8);
  ring.graphics.drawCircle(0, 0, Math.max(24, Math.floor(sz * 0.72)));
  ring.x = Math.floor(visualW / 2);
  ring.y = Math.floor(sz / 2);
  ring.scaleX = 0.3;
  ring.scaleY = 0.3;
  ring.touchEnabled = false;
  return this._v1TrackFx(ring, view, function(o, done) {
    egret.Tween.get(o)
      .to({ scaleX: 1.15, scaleY: 1.15 }, 220)
      .to({ scaleX: 1.35, scaleY: 1.35, alpha: 0 }, 320)
      .call(done);
  }, 1100, 'v1-rare-spawn');
};

// V1-2：伤害飘字分级。第 4 参 damageType 缺省时严格走下方原分支（一字未改），
// 传入时才启用暴击 / 弱点 / 真实 / 法术的颜色、字号与缩放弹跳。
Game.prototype.showDamageText = function(dmg, isCrit, idx, damageType, isWeak) {
  var txt = new egret.TextField();
  var isWord = typeof dmg === 'string';
  txt.text = (isWord ? dmg : ('-' + this.fmt(dmg))) + (isCrit && !isWord ? '!' : '');
  txt.size = isCrit ? 26 : 20;
  txt.textColor = isCrit ? THEME.accent : THEME.pink;
  var graded = !isWord && !!damageType;
  if (graded) {
    if (isCrit) { txt.size = 30; txt.textColor = THEME.accent; }
    else if (isWeak) { txt.size = 24; txt.textColor = THEME.sky; }
    else if (damageType === 'true') { txt.size = 22; txt.textColor = THEME.lavender; }
    else if (damageType === 'magic') { txt.size = 21; txt.textColor = THEME.mint; }
    else { txt.size = 20; txt.textColor = THEME.pink; }
  }
  txt.bold = true;
  var pos = this.getMonsterCenter(idx);
  txt.x = pos.x - 18 + (Math.random() * 16 - 8);
  txt.y = pos.y - 26 + Math.random() * 10;
  if (!graded) {
    // 原分支：5 个旧调用点（3 个字符串 + 未透传的 2 处工具调用）严格保持原样。
    this.damageLayer.addChild(txt);
    egret.Tween.get(txt).to({ y: txt.y - 50, alpha: 0 }, 700).call(function() {
      if (txt.parent) txt.parent.removeChild(txt);
    });
    return;
  }
  txt.scaleX = 0.6;
  txt.scaleY = 0.6;
  this._v1TrackFx(txt, this.damageLayer, function(o, done) {
    egret.Tween.get(o)
      .to({ scaleX: 1.18, scaleY: 1.18 }, 90)
      .to({ scaleX: 1, scaleY: 1, y: o.y - 50, alpha: 0 }, 610)
      .call(done);
  }, 1200, 'v1-damage-text');
};

Game.prototype.getMonsterAttack = function(m) {
  if (!m) return 0;
  var atk = CONFIG.monsterAtk(this.wave, !!m.isBoss);
  if (m.trait === 'spiked') atk *= 1.18;
  if (m.trait === 'burn') atk *= 1.12;
  if (m.trait === 'web') atk *= 0.92;
  // F1 蜂群：同波还有其它存活怪时更凶。
  if (m.trait === 'swarm' && this.monsters && this.monsters.length >= 2) atk *= 1.15;
  if (m.attackMult) atk *= m.attackMult;
  return Math.floor(atk);
};

Game.prototype.healPlayer = function(amount, label, quiet) {
  amount = Math.floor(amount || 0);
  if (amount <= 0 || this.playerHp >= this.getMaxPlayerHp()) return 0;
  var heal = Math.min(amount, this.getMaxPlayerHp() - this.playerHp);
  this.playerHp += heal;
  if (!quiet && label) this.showToast(label + ' +' + this.fmt(heal) + '生命');
  this.showPlayerHealText(heal);
  this.updateUI();
  return heal;
};

Game.prototype.takePlayerDamage = function(raw, label) {
  if (!raw || raw <= 0) return;
  var def = this.getPlayerDefense();
  var dmg = Math.max(1, Math.floor(raw * 100 / (100 + def)));
  var shieldReduce = this.skillBuffs && this.skillBuffs.shieldTime > 0 ? (this.skillBuffs.shieldReduce || 0) : 0;
  if (shieldReduce > 0) dmg = Math.max(1, Math.floor(dmg * (1 - shieldReduce)));
  this.playerHp = Math.max(0, this.playerHp - dmg);
  if (label) this.showToast(label + ' -' + this.fmt(dmg) + '生命' + (shieldReduce > 0 ? '（护盾减伤）' : ''));
  this.showPlayerDamageText(dmg);
  if (this.shouldShakeOnPlayerDamage(raw, dmg, label)) {
    // V1-4：三档幅度。伤害数值与 shouldShakeOnPlayerDamage 的 1200ms 冷却 / 降频策略一字未改，
    // 这里只把「轻击 / BOSS / 重击」档位传给表现层。
    var hpCap = Math.max(1, this.getMaxPlayerHp());
    var heavyHit = dmg >= Math.max(25, hpCap * 0.12);
    this.shakeBattle(this.bossActive ? (heavyHit ? 8 : 5) : (heavyHit ? 6 : 3));
  }
  this.sfxHurt();
  if (this.playerHp <= 0) this.onPlayerDefeated();
  else this.updateUI();
};

Game.prototype.shouldShakeOnPlayerDamage = function(raw, dmg, label) {
  var now = Date.now ? Date.now() : new Date().getTime();
  if (this._lastBattleShake && now - this._lastBattleShake < 1200) return false;
  var maxHp = Math.max(1, this.getMaxPlayerHp());
  var isBossHit = !!this.bossActive || (label && String(label).indexOf('BOSS') >= 0);
  var isHeavyHit = dmg >= Math.max(25, maxHp * 0.12);
  var isDanger = this.playerHp > 0 && this.playerHp / maxHp <= 0.35;
  if (!isBossHit && !isHeavyHit && !isDanger) return false;
  this._lastBattleShake = now;
  return true;
};

Game.prototype.showPlayerDamageText = function(dmg) {
  if (!this.damageLayer || !this.heroGroup) return;
  var txt = new egret.TextField();
  txt.text = '-❤' + this.fmt(dmg);
  txt.size = 18; txt.textColor = 0xff6b6b; txt.bold = true;
  txt.x = this.heroGroup.x + 30 + (Math.random() * 12 - 6);
  txt.y = this.heroGroup.y + 20;
  this.damageLayer.addChild(txt);
  egret.Tween.get(txt).to({ y: txt.y - 34, alpha: 0 }, 650).call(function() {
    if (txt.parent) txt.parent.removeChild(txt);
  });
};

Game.prototype.showPlayerHealText = function(heal) {
  if (!this.damageLayer || !this.heroGroup || heal <= 0) return;
  var txt = new egret.TextField();
  txt.text = '+❤' + this.fmt(heal);
  txt.size = 17; txt.textColor = 0x7be8b7; txt.bold = true;
  txt.x = this.heroGroup.x + 38 + (Math.random() * 12 - 6);
  txt.y = this.heroGroup.y + 38;
  this.damageLayer.addChild(txt);
  egret.Tween.get(txt).to({ y: txt.y - 30, alpha: 0 }, 650).call(function() {
    if (txt.parent) txt.parent.removeChild(txt);
  });
};

Game.prototype.shakeBattle = function(power) {
  if (!this.battleGroup) return;
  var baseX = 0;
  egret.Tween.removeTweens(this.battleGroup);
  this.battleGroup.x = baseX;
  if (this._v1ShakeTiers === false) {
    // 单点回退：保持 V1 前的原 Tween 链。
    egret.Tween.get(this.battleGroup)
      .to({ x: baseX - power }, 35)
      .to({ x: baseX + power }, 55)
      .to({ x: baseX - Math.floor(power / 2) }, 45)
      .to({ x: baseX }, 45);
    return;
  }
  var tier = power >= 6 ? 3 : (power >= 4 ? 2 : 1);
  var amp = [0, 3, 5, 8][tier];
  this._v1ShakeTier = tier;
  egret.Tween.get(this.battleGroup)
    .to({ x: baseX - amp }, 35)
    .to({ x: baseX + amp }, 55)
    .to({ x: baseX - Math.floor(amp / 2) }, 45)
    .to({ x: baseX }, 45);
};

Game.prototype.monsterAttackAnim = function(idx) {
  var mv = this.monsterViews && this.monsterViews[idx];
  if (!mv || !this.heroGroup || !this.damageLayer) return;
  var start = this.getMonsterCenter(idx);
  var endX = this.heroGroup.x + this.heroGroup.width / 2;
  var endY = this.heroGroup.y + 42;
  var orb = new egret.Shape();
  var color = (this.monsters[idx] && this.monsters[idx].isBoss) ? 0xff4444 : 0xffb84d;
  orb.graphics.beginFill(color, 0.92);
  orb.graphics.drawCircle(0, 0, 5);
  orb.graphics.endFill();
  orb.graphics.lineStyle(1, 0xffffff, 0.45);
  orb.graphics.drawCircle(0, 0, 7);
  orb.x = start.x; orb.y = start.y;
  this.damageLayer.addChild(orb);
  var hitSprite = mv._sprite || mv;
  var spriteBaseY = hitSprite._baseY !== undefined ? hitSprite._baseY : hitSprite.y;
  hitSprite._baseY = spriteBaseY;
  egret.Tween.removeTweens(hitSprite);
  egret.Tween.get(hitSprite)
    .to({ y: spriteBaseY - 5 }, 70)
    .to({ y: spriteBaseY }, 110);
  egret.Tween.get(orb)
    .to({ x: endX, y: endY, scaleX: 1.4, scaleY: 1.4 }, 260, egret.Ease.quadIn)
    .call(function() { if (orb.parent) orb.parent.removeChild(orb); });
};

Game.prototype.processMonsterAttacks = function() {
  if (!this.monsters || this.monsters.length === 0 || this.playerHp <= 0) return;
  var total = 0;
  var burn = false;
  var web = false;
  var melt = false;
  for (var i = 0; i < this.monsters.length; i++) {
    var m = this.monsters[i];
    if (!m || m.hp <= 0) continue;
    total += this.getMonsterAttack(m);
    this.monsterAttackAnim(i);
    if (m.trait === 'burn') burn = true;
    if (m.trait === 'web') web = true;
    if (m.trait === 'meltArmor') melt = true;
  }
  if (total <= 0) return;
  // F1 熔甲：额外造成一笔无视主角部分防御的穿防伤害；下限 1 点，保证低等级也生效。
  if (melt) total += Math.max(1, Math.floor(this.getPlayerDefense() * 0.12));
  if (burn) this.energy = Math.max(0, this.energy - 3);
  if (web && this.bossActive) this.bossTimer = Math.max(0, this.bossTimer - 0.3);
  this.takePlayerDamage(total, this.bossActive ? 'BOSS压制' : '怪物反击');
};

Game.prototype.onPlayerDefeated = function() {
  var failedBossWave = this.wave % 10 === 0 ? this.wave : 0;
  this.stopBossTimer();
  var lostWave = this.wave;
  var retreatWave = Math.floor((Math.max(1, this.wave) - 1) / 10) * 10 + 1;
  this.wave = Math.max(1, retreatWave);
  if (failedBossWave) this.setBossRetryLock(failedBossWave);
  this.energy = Math.max(0, this.energy - 20);
  this.playerHp = Math.floor(this.getMaxPlayerHp() * 0.65);
  this.bossCounter = null;
  // P 批次：连续战败是挂机游戏最典型的卡关螺旋——玩家只会反复撤退，却不知道差在哪。
  // 第 2 次连续战败给一次结构化诊断（复用 BOSS 失败面板的等级 / 装备建议），每段只弹一次。
  this._defeatStreak = (this._defeatStreak || 0) + 1;
  if (this._defeatStreak >= 2 && !this._defeatHintShown) {
    this._defeatHintShown = true;
    var self = this;
    var streak = this._defeatStreak;
    this.safeTimeout('defeatAdvice', function() {
      if (self._panelOverlay && self._panelOverlay.parent) return; // 已有面板时不叠加
      self.openBossFailPanel(0, self.getNextBossWave(), {
        normalDefeat: true, streak: streak, lostWave: lostWave, retreatWave: retreatWave
      });
    }, 700);
  } else {
    this.showToast('💔 战败撤退：回到本轮起点，先强化再挑战');
  }
  this.spawnWave();
  this.updateUI();
};

Game.prototype.onKill = function(m, idx) {
  if (m.hp > 0) return;
  var realIdx = this.monsters.indexOf(m);
  if (realIdx === -1) return;
  var reward = this.getGoldReward(this.wave, m.isBoss);
  this.gold += reward;
  var energyBack = m.isBoss ? CONFIG.bossKillEnergyReward : CONFIG.killEnergyReward;
  if (energyBack > 0) this.energy = Math.min(this.getMaxEnergy(), this.energy + energyBack);
  var heal = Math.floor(this.getMaxPlayerHp() * (m.isBoss ? 0.28 : 0.045));
  if (heal > 0) this.healPlayer(heal, m.isBoss ? 'BOSS击杀恢复' : '击杀恢复', true);
  this.killCount++;
  this.stats.totalKills++;
  if (m.isBoss) {
    this.stats.bossKills++;
    this.sfxHitBoss();
    this.maybeDropSpinTicket();
    this.maybeDropCoreWeapon();
    this.addForgeStones((2 + Math.floor(Math.floor(this.wave / 10) / 3)) * (1 + (this.getBuffs().forgeBonus || 0)), 'BOSS掉落');
  } else {
    this.sfxKill();
    if (this.wave >= 15) {
      var dropChance = Math.min(0.075, 0.012 + this.wave / 9000 + (this.getBuffs().forgeBonus || 0) * 0.08);
      if (Math.random() < dropChance) this.addForgeStones(1, '怪物掉落');
    }
  }
  if (this.gold > this.stats.totalGold) this.stats.totalGold = this.gold;

  // 图签系统：记录击杀
  if (m.type && m.type.shape) {
    if (!this.monsterCodex[m.type.shape]) {
      this.monsterCodex[m.type.shape] = { encountered: true, kills: 0 };
      // S1/H-1：改走节流入口，连续发现多个新怪时不逐条刷屏。
      this.notifyCodexDiscovery(m.type.name);
    }
    this.monsterCodex[m.type.shape].kills++;
  }

  this.checkDailyTasks('kill');
  this.checkAchievements();
  this.monsters.splice(realIdx, 1);
  if (this.monsters.length === 0) {
    this.nextWave();
  } else {
    this.updateMonsterDisplay();
  }
  this.checkLevelUp();
};

Game.prototype.maybeDropSpinTicket = function() {
  var chance = 0.18 + Math.min(0.12, Math.floor((this.maxWaveReached || this.wave) / 100) * 0.02);
  if (Math.random() < chance) {
    this.spinTickets = (this.spinTickets || 0) + 1;
    this.showToast('🎡 BOSS掉落幸运券 +1');
  }
};

// ==================== 波次 ====================

Game.prototype.weightedPick = function(list, weightKey) {
  if (!list || !list.length) return null;
  weightKey = weightKey || 'weight';
  var total = 0;
  for (var i = 0; i < list.length; i++) total += Math.max(0, list[i][weightKey] || 1);
  var r = Math.random() * Math.max(1, total);
  for (var j = 0; j < list.length; j++) {
    r -= Math.max(0, list[j][weightKey] || 1);
    if (r <= 0) return list[j];
  }
  return list[list.length - 1];
};

Game.prototype.getRandomMonsterCount = function() {
  if (this.wave <= 3) return 2 + Math.floor(Math.random() * 2);
  if (this.wave <= 10) return 3 + Math.floor(Math.random() * 3);
  if (this.wave <= 30) return 3 + Math.floor(Math.random() * 4);
  var count = 4 + Math.floor(Math.random() * 4);
  if (this.wave >= 80 && Math.random() < 0.28) count++;
  return Math.min(8, count);
};

Game.prototype.pickMonsterVariant = function(isBoss) {
  if (isBoss) {
    return {
      size: MONSTER_SIZE_VARIANTS[2],
      affix: MONSTER_AFFIXES[0]
    };
  }
  var affixes = MONSTER_AFFIXES.filter(function(a) { return !a.minWave || this.wave >= a.minWave; }, this);
  if (!affixes.length) affixes = [MONSTER_AFFIXES[0]];
  return {
    size: this.weightedPick(MONSTER_SIZE_VARIANTS) || MONSTER_SIZE_VARIANTS[2],
    affix: this.weightedPick(affixes) || MONSTER_AFFIXES[0]
  };
};

Game.prototype.getMonsterDisplayName = function(mType, sizeVariant, affix) {
  var parts = [];
  if (affix && affix.prefix) parts.push(affix.prefix);
  if (sizeVariant && sizeVariant.prefix) parts.push(sizeVariant.prefix);
  parts.push(mType && mType.name ? mType.name : '怪物');
  return parts.join('');
};

Game.prototype.getMonsterFeatureText = function(mt, found) {
  if (!mt) return '';
  if (!found) {
    if (mt.hidden) return '稀有遭遇 · 第 ' + (mt.wave || HIDDEN_ENCOUNTER_MIN_WAVE) + ' 波后可能出现';
    return '特点待发现';
  }
  var parts = [];
  if (mt.traitName) parts.push(mt.traitName);
  if (mt.desc) parts.push(mt.desc);
  if (!parts.length) parts.push('常规敌人');
  return parts.join('：');
};

Game.prototype.getMonsterSpawnSlots = function(count) {
  var templates = [
    { x: 0.18, y: 0.18 }, { x: 0.50, y: 0.16 }, { x: 0.82, y: 0.20 },
    { x: 0.28, y: 0.38 }, { x: 0.62, y: 0.40 },
    { x: 0.16, y: 0.58 }, { x: 0.48, y: 0.62 }, { x: 0.80, y: 0.60 }
  ];
  for (var i = templates.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = templates[i];
    templates[i] = templates[j];
    templates[j] = tmp;
  }
  return templates.slice(0, Math.max(1, count));
};

// F1：稀有遭遇判定。roll 可由测试显式传入，避免依赖随机源。
// 每波最多替换 1 只普通怪；BOSS 波与低波次不触发；只从已达出现波次的隐藏怪里挑。
Game.prototype.pickHiddenEncounter = function(roll) {
  if (this.wave % 10 === 0) return null;
  if (this.wave < HIDDEN_ENCOUNTER_MIN_WAVE) return null;
  var r = (typeof roll === 'number') ? roll : Math.random();
  if (r >= HIDDEN_ENCOUNTER_CHANCE) return null;
  var pool = [];
  for (var i = 0; i < HIDDEN_MONSTER_TYPES.length; i++) {
    if (this.wave >= HIDDEN_MONSTER_TYPES[i].wave) pool.push(HIDDEN_MONSTER_TYPES[i]);
  }
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};

Game.prototype.spawnWave = function() {
  this.updateBattleScene(false);
  var isBoss = this.wave % 10 === 0;
  var count = isBoss ? 1 : this.getRandomMonsterCount();
  var hp = CONFIG.monsterHp(this.wave);
  this.monsters = [];
  var spawnSlots = this.getMonsterSpawnSlots(count);
  // BOSS用专属形象（按波次循环选取）
  var bossIdx = Math.floor(this.wave / 10 - 1) % BOSS_TYPES.length;
  var bossType = BOSS_TYPES[Math.max(0, bossIdx)];
  var availableTypes = MONSTER_TYPES.filter(function(t) { return !t.wave || this.wave >= t.wave; }, this);
  if (!availableTypes.length) availableTypes = [MONSTER_TYPES[0]];
  for (var i = 0; i < count; i++) {
    var mType = isBoss ? bossType : availableTypes[Math.floor(Math.random() * availableTypes.length)];
    // F1：每波首只有机会替换为稀有隐藏怪；替换后属性 / 弱点 / trait 全部走真实数据。
    if (!isBoss && i === 0) {
      var hiddenType = this.pickHiddenEncounter();
      if (hiddenType) {
        mType = hiddenType;
        this.showToast('✨ 稀有遭遇！' + hiddenType.name + ' 出现了');
      }
    }
    var variant = this.pickMonsterVariant(isBoss);
    var sizeVariant = variant.size || MONSTER_SIZE_VARIANTS[2];
    var affix = variant.affix || MONSTER_AFFIXES[0];
    var slot = spawnSlots[i % spawnSlots.length] || { x: 0.5, y: 0.4 };
    var spawnX = isBoss ? 0.5 : slot.x + (Math.random() * 0.08 - 0.04);
    var spawnY = isBoss ? 0.42 : slot.y + (Math.random() * 0.08 - 0.04);
    var hpMult = isBoss ? CONFIG.bossHpMult(this.wave) : (sizeVariant.hp || 1) * (affix.hp || 1) * (count >= 6 ? 0.86 : 1);
    var atkMult = (sizeVariant.atk || 1) * (affix.atk || 1);
    var moveMult = (sizeVariant.move || 1) * (affix.move || 1);
    var baseHp = Math.max(1, Math.floor(hp * hpMult));
    this.monsters.push({
      hp: baseHp,
      maxHp: baseHp,
      isBoss: isBoss,
      type: mType,
      displayName: isBoss ? mType.name : this.getMonsterDisplayName(mType, sizeVariant, affix),
      sizeVariant: sizeVariant,
      affix: affix,
      sizeScale: sizeVariant.scale || 1,
      attackMult: atkMult,
      armor: Math.max(0, (mType.armor || 0) + Math.floor(this.wave / 80) * (isBoss ? 4 : 2) + (sizeVariant.armor || 0) + (affix.armor || 0)),
      resist: Math.max(0, (mType.resist || 0) + Math.floor(this.wave / 80) * (isBoss ? 4 : 2) + (sizeVariant.resist || 0) + (affix.resist || 0)),
      weakness: mType.weakness || 'phys',
      trait: mType.trait || '',
      spawnX: Math.max(0.12, Math.min(0.88, spawnX)),
      spawnY: Math.max(0.08, Math.min(0.74, spawnY)),
      sizeJitter: isBoss ? Math.floor(Math.random() * 9) - 4 : Math.floor(Math.random() * 7) - 3,
      moveRange: isBoss ? 26 : Math.floor((10 + Math.floor(Math.random() * 22)) * moveMult),
      moveDur: isBoss ? 1900 + Math.floor(Math.random() * 500) : Math.floor((1050 + Math.floor(Math.random() * 1050)) / Math.max(0.7, moveMult)),
      floatRange: isBoss ? 7 : Math.max(2, Math.floor((3 + Math.floor(Math.random() * 5)) * moveMult)),
      phase: Math.floor(Math.random() * 500)
    });
    // 图签：标记遇到
    if (mType && mType.shape && !this.monsterCodex[mType.shape]) {
      this.monsterCodex[mType.shape] = { encountered: true, kills: 0 };
    }
  }
  this.updateMonsterDisplay();
  this.updateBossBtn();

  // BOSS计时器
  this.stopBossTimer();
  if (isBoss) {
    this.bossActive = true;
    this.bossTimer = CONFIG.bossTimeLimit;
    this.initBossCounter(bossType);
    this.startBossTimer();
    this.showBossFlash();
    this.showToast('💀 ' + bossType.name + ' 出现！注意蓄力反击');
  } else {
    this.bossActive = false;
    this.bossCounter = null;
  }
};

Game.prototype.initBossCounter = function(bossType) {
  this.bossCounter = {
    type: bossType || null,
    charging: false,
    charge: 0,
    chargeMax: 2,
    next: 2.8,
    casts: 0,
    phoenixHealed: false
  };
  this.bossDebuffs = { critDownTime: 0, cooldownSlowTime: 0, energyBurnTime: 0 };
};

Game.prototype.startBossTimer = function() {
  var self = this;
  this._bossTimerInterval = setInterval(function() {
    self.bossTimer -= 0.1;
    self.updateBossCounter(0.1);
    if (self.bossTimer <= 0) {
      self.bossTimer = 0;
      self.onBossFail();
    }
    self.updateBossTimerUI();
  }, 100);
};

Game.prototype.stopBossTimer = function() {
  if (this._bossTimerInterval) {
    clearInterval(this._bossTimerInterval);
    this._bossTimerInterval = null;
  }
  this.bossActive = false;
  this.bossTimer = 0;
  this.bossCounter = null;
  this.bossDebuffs = { critDownTime: 0, cooldownSlowTime: 0, energyBurnTime: 0 };
  this.updateBossTimerUI();
};

Game.prototype.updateBossCounter = function(dt) {
  if (!this.bossActive || !this.bossCounter || this.monsters.length === 0) return;
  var bc = this.bossCounter;
  if (!bc.charging) {
    bc.next -= dt;
    if (bc.next <= 0) {
      bc.charging = true;
      bc.charge = 0;
      this.showToast('⚠️ BOSS蓄力中，释放技能可打断！');
      this.pulseBossCounterWarning();
    }
    return;
  }
  bc.charge += dt;
  if (bc.charge >= bc.chargeMax) {
    this.applyBossCounter();
  }
};

Game.prototype.resetBossCounterWindow = function(extraDelay) {
  if (!this.bossCounter) return;
  this.bossCounter.charging = false;
  this.bossCounter.charge = 0;
  this.bossCounter.next = extraDelay || Math.min(5.2, 3.6 + (this.bossCounter.casts || 0) * 0.25);
};

Game.prototype.interruptBossCounter = function() {
  if (!this.bossActive || !this.bossCounter || !this.bossCounter.charging) return false;
  this.resetBossCounterWindow(4.2);
  this.showToast('✅ 已打断BOSS反击');
  this.showDamageText('打断', true, 0);
  return true;
};

Game.prototype.applyBossCounter = function() {
  var bc = this.bossCounter;
  if (!bc) return;
  bc.casts++;
  var boss = this.monsters && this.monsters.length ? this.monsters[0] : null;
  var shape = bc.type && bc.type.shape ? bc.type.shape : '';
  var msg = 'BOSS反击';
  if (shape === 'boss_eye') {
    this.energy = Math.max(0, this.energy - 12);
    this.bossDebuffs.critDownTime = 5;
    this.takePlayerDamage(CONFIG.monsterAtk(this.wave, true) * 0.9);
    msg = '魔眼凝视：暴击下降，能量-12';
  } else if (shape === 'boss_giant') {
    this.bossDebuffs.cooldownSlowTime = 6;
    for (var i = 0; i < this.skillCD.length; i++) this.skillCD[i] += 2;
    this.takePlayerDamage(CONFIG.monsterAtk(this.wave, true) * 1.15);
    msg = '冰霜震击：技能冷却延长';
  } else if (shape === 'boss_spider') {
    this.energy = Math.max(0, this.energy - 15);
    this.bossTimer = Math.max(0, this.bossTimer - 1.5);
    this.takePlayerDamage(CONFIG.monsterAtk(this.wave, true) * 0.75);
    msg = '蛛网束缚：能量-15，限时-1.5秒';
  } else if (shape === 'boss_demon') {
    this.energy = Math.max(0, this.energy - 10);
    this.bossDebuffs.energyBurnTime = 4;
    this.takePlayerDamage(CONFIG.monsterAtk(this.wave, true) * 1.0);
    msg = '炎魔灼烧：持续燃烧能量';
  } else if (shape === 'boss_phoenix' && boss && boss.maxHp && boss.hp < boss.maxHp * 0.45 && !bc.phoenixHealed) {
    bc.phoenixHealed = true;
    boss.hp = Math.min(boss.maxHp, boss.hp + boss.maxHp * 0.08);
    msg = '凤凰涅槃：回复生命';
  } else {
    this.energy = Math.max(0, this.energy - 20);
    this.bossTimer = Math.max(0, this.bossTimer - 1);
    this.takePlayerDamage(CONFIG.monsterAtk(this.wave, true));
    msg = 'BOSS重击：能量-20，限时-1秒';
  }
  this.showToast('⚠️ ' + msg);
  this.showDamageText('反击', true, 0);
  this.resetBossCounterWindow();
  this.updateMonsterHealthView(0);
  this.updateUI();
};

Game.prototype.getBossCounterLabel = function() {
  if (!this.bossActive || !this.bossCounter) return '';
  var bc = this.bossCounter;
  if (bc.charging) {
    return ' · 蓄力' + Math.max(0, bc.chargeMax - bc.charge).toFixed(1) + 's';
  }
  return '';
};

Game.prototype.pulseBossCounterWarning = function() {
  var mv = this.monsterViews && this.monsterViews[0];
  if (!mv) return;
  var tip = new egret.TextField();
  tip.text = '释放任意技能打断';
  tip.size = 16; tip.bold = true; tip.textColor = 0xfff1a8;
  var pos = this.getMonsterCenter(0);
  tip.x = pos.x - 64; tip.y = pos.y - 58;
  if (this.damageLayer) this.damageLayer.addChild(tip);
  egret.Tween.get(tip).to({ y: tip.y - 18, alpha: 0 }, 900).call(function() {
    if (tip.parent) tip.parent.removeChild(tip);
  });
  egret.Tween.get(mv, { override: false })
    .to({ scaleX: mv.scaleX * 1.08, scaleY: mv.scaleY * 1.08 }, 150)
    .to({ scaleX: mv.scaleX, scaleY: mv.scaleY }, 150)
    .to({ scaleX: mv.scaleX * 1.08, scaleY: mv.scaleY * 1.08 }, 150)
    .to({ scaleX: mv.scaleX, scaleY: mv.scaleY }, 150);
};

Game.prototype.onBossFail = function() {
  var boss = this.monsters && this.monsters.length ? this.monsters[0] : null;
  var hpPct = boss && boss.maxHp ? Math.max(0, boss.hp / boss.maxHp) : 1;
  var failedWave = this.wave;
  this.stopBossTimer();
  this.setBossRetryLock(failedWave);
  this.showToast('💀 BOSS挑战失败！从第1波重新开始');
  // 失败后波次重置到当前轮次的第1波
  var cycleStart = Math.floor((this.wave - 1) / 10) * 10 + 1;
  this.wave = cycleStart;
  this.updateBossBtn();
  var self = this;
  setTimeout(function() {
    self.spawnWave();
    self.updateUI();
    if (self._panelOverlay && self._panelOverlay.parent) return;
    self.openBossFailPanel(hpPct, failedWave);
  }, 1000);
};

Game.prototype.getBossFailAdvice = function(hpPct, bossWave) {
  return this.getBossPowerAdvice(this.getBossPowerInfo(bossWave || this.getNextBossWave()), hpPct);
};

Game.prototype.openBossFailPanel = function(hpPct, bossWave, opts) {
  opts = opts || {};
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 354);

  var title = new eui.Label();
  title.text = opts.normalDefeat ? '💔 连续战败，先强化一下' : '💀 BOSS挑战失败';
  title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var remain = Math.max(0, Math.round(hpPct * 100));
  var power = this.getBossPowerInfo(bossWave || this.getNextBossWave());
  var pct = Math.max(0, Math.min(1, power.current / power.recommended));
  var info = new eui.Label();
  if (opts.normalDefeat) {
    // 普通战败没有 BOSS 血量百分比，改为说明「退了多少」+ 可执行的强化建议。
    info.text = '已连续战败 ' + (opts.streak || 2) + ' 次，从第 ' + (opts.lostWave || this.wave) +
      ' 波退回第 ' + (opts.retreatWave || this.wave) + ' 波\n战力 ' + this.fmt(power.current) +
      ' / 下个BOSS建议 ' + this.fmt(power.recommended) + '\n' + this.getBossPowerAdvice(power);
  } else {
    info.text = 'Boss剩余生命约 ' + remain + '%\n战力 ' + this.fmt(power.current) + ' / 推荐 ' + this.fmt(power.recommended) +
      '\n' + this.getBossFailAdvice(hpPct, power.wave);
  }
  info.size = 12; info.textColor = 0xcccccc;
  info.x = panel._contentX; info.y = 56; info.width = panel._contentW; info.lineSpacing = 6;
  info.wordWrap = true;
  panel.addChild(info);

  var pbg = new eui.Rect();
  pbg.width = panel._contentW; pbg.height = 8; pbg.fillColor = 0x140e36;
  pbg.x = panel._contentX; pbg.y = 123; pbg.ellipseWidth = 6; pbg.ellipseHeight = 6;
  panel.addChild(pbg);
  var pfill = new eui.Rect();
  pfill.width = Math.floor(panel._contentW * pct); pfill.height = 8;
  pfill.fillColor = pct >= 1 ? THEME.ok : (pct >= 0.82 ? THEME.warn : THEME.danger);
  pfill.x = panel._contentX; pfill.y = 123; pfill.ellipseWidth = 6; pfill.ellipseHeight = 6;
  panel.addChild(pfill);

  var y = 144;
  var self = this;
  y = this.addPanelRow(panel, y, '升', 0x3498db, '提升主角\n技能伤害跟随主角等级成长', '去升级', 0x27ae60, function() {
    self.closePanel(); self.openUpgrade();
  }, false);
  y = this.addPanelRow(panel, y, '秘宝', 0xe67e22, '秘宝阁装备\n转生钻石换永久稀有属性', '去秘宝', 0x3498db, function() {
    self.closePanel(); self.openSupermarket();
  }, false);

  var autoHint = new eui.Label();
  autoHint.text = '4秒后自动关闭，继续刷怪';
  autoHint.size = 10; autoHint.textColor = THEME.textDim;
  autoHint.x = panel._contentX; autoHint.y = y + 2; autoHint.width = panel._contentW; autoHint.height = 14;
  autoHint.textAlign = 'center';
  panel.addChild(autoHint);

  var btn = this.createButton('继续刷怪(4)', 0x8e44ad, 132, 34, function() { self.closePanel(); }, this);
  btn.horizontalCenter = 0; btn.y = y + 18;
  panel.addChild(btn);

  var count = 4;
  var btnLabel = btn.getChildAt ? btn.getChildAt(1) : null;
  this._panelAutoCloseTimer = this.safeInterval('panelAutoClose', function() {
    count--;
    if (!overlay.parent || self._panelOverlay !== overlay) {
      if (self._panelAutoCloseTimer) clearInterval(self._panelAutoCloseTimer);
      self._panelAutoCloseTimer = null;
      return;
    }
    if (count <= 0) {
      self.closePanel();
      return;
    }
    if (btnLabel && btnLabel.text !== undefined) btnLabel.text = '继续刷怪(' + count + ')';
    if (autoHint && autoHint.text !== undefined) autoHint.text = count + '秒后自动关闭，继续刷怪';
  }, 1000);
};

// ==================== 挑战BOSS按钮逻辑 ====================

Game.prototype.canChallengeBossNow = function() {
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  return this.wave % 10 !== 0 && (waveInCycle >= 9 || !!this.getBossRetryReady());
};

Game.prototype.challengeBoss = function() {
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  if (this.wave % 10 === 0) {
    this.showToast('当前已是BOSS波！');
    return;
  }
  if (!this.canChallengeBossNow()) {
    // 条件不满足时提示（按钮本身已灰色）
    this.showToast('⚠️ 需通过第9波后才能挑战BOSS (' + waveInCycle + '/9)');
    return;
  }
  // 满足条件：直接跳到BOSS波，不再弹出战力评估二次确认。
  this.skipToBoss();
};

Game.prototype.openBossPrepPanel = function(power) {
  power = power || this.getBossPowerInfo(this.getNextBossWave());
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 330);

  var title = new eui.Label();
  title.text = '💀 BOSS战力评估'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var progress = this.getProgressInfoForWave(power.wave);
  var bossIdx = Math.floor(power.wave / 10 - 1) % BOSS_TYPES.length;
  var bossType = BOSS_TYPES[Math.max(0, bossIdx)] || BOSS_TYPES[0];
  var ratioPct = Math.floor(Math.min(1.2, power.ratio) * 100);
  var info = new eui.Label();
  info.text = this.getProgressTitle(power.wave) + ' · BOSS ' + progress.chapterBoss + '/' + BOSSES_PER_CHAPTER +
    '\n当前战力 ' + this.fmt(power.current) + ' / 推荐 ' + this.fmt(power.recommended) + '（' + ratioPct + '%）' +
    '\n' + this.getBossPowerAdvice(power) +
    '\n' + bossType.name + '：' + this.getDamageTypeName(bossType.weakness) + '弱  物防' + bossType.armor + ' / 法抗' + bossType.resist;
  info.size = 12; info.textColor = 0xcccccc;
  info.x = panel._contentX; info.y = 56; info.width = panel._contentW; info.lineSpacing = 6;
  info.wordWrap = true;
  panel.addChild(info);

  var strategy = new eui.Label();
  strategy.text = this.getBossStrategy(bossType);
  strategy.size = 10; strategy.textColor = 0xffd7a3;
  strategy.x = panel._contentX; strategy.y = 114; strategy.width = panel._contentW;
  strategy.wordWrap = true; strategy.lineSpacing = 3;
  panel.addChild(strategy);

  var pbg = new eui.Rect();
  pbg.width = panel._contentW; pbg.height = 8; pbg.fillColor = 0x140e36;
  pbg.x = panel._contentX; pbg.y = 148; pbg.ellipseWidth = 6; pbg.ellipseHeight = 6;
  panel.addChild(pbg);
  var pfill = new eui.Rect();
  pfill.width = Math.floor(panel._contentW * Math.max(0.05, Math.min(1, power.ratio)));
  pfill.height = 8;
  pfill.fillColor = power.ratio >= 1 ? THEME.ok : (power.ratio >= 0.82 ? THEME.warn : THEME.danger);
  pfill.x = panel._contentX; pfill.y = 148; pfill.ellipseWidth = 6; pfill.ellipseHeight = 6;
  panel.addChild(pfill);

  var self = this;
  var y = 172;
  y = this.addPanelRow(panel, y, '升', 0x3498db, '强化成长\n主角、队友会直接提高通过率', '去升级', 0x27ae60, function() {
    self.closePanel(); self.openUpgrade();
  }, false);
  y = this.addPanelRow(panel, y, '秘宝', 0xe67e22, '稀有装备\n小幅永久属性，不替代升级', '去秘宝', 0x3498db, function() {
    self.closePanel(); self.openSupermarket();
  }, false);

  var fightBtn = this.createButton('仍要挑战', 0x9b2335, 104, 32, function() {
    self.closePanel();
    self.skipToBoss();
  }, this);
  fightBtn.x = panel._contentX + 24; fightBtn.y = y + 4;
  panel.addChild(fightBtn);
  var closeBtn = this.createButton('继续刷怪', 0x8e44ad, 104, 32, function() { self.closePanel(); }, this);
  closeBtn.x = panel._contentX + panel._contentW - 128; closeBtn.y = y + 4;
  panel.addChild(closeBtn);
};

// 直接跳到BOSS波
Game.prototype.skipToBoss = function() {
  if (!this.canChallengeBossNow()) {
    var waveInCycle = ((this.wave - 1) % 10) + 1;
    this.showToast('⚠️ 当前进度不足，需推进到第9波后挑战 (' + waveInCycle + '/9)');
    this.updateBossBtn();
    return;
  }
  // 跳到当前轮次的第10波
  var cycleStart = Math.floor((this.wave - 1) / 10) * 10;
  this.wave = cycleStart + 10;
  this.stopBossTimer();
  this.showToast('💀 挑战BOSS！');
  this.sfxHitBoss();
  this.spawnWave();
  this.updateUI();
  this.updateBossBtn();
};

// 更新BOSS按钮状态
Game.prototype.updateBossBtn = function() {
  if (!this._bossBtnBg || !this._bossBtnText) return;
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  var isBossWave = this.wave % 10 === 0;
  var retryReady = this.getBossRetryReady();
  var canChallenge = this.canChallengeBossNow(); // 第9波及以上可挑战

  if (retryReady) {
    this._bossBtnBg.fillColor = 0x9b2335;
    this._bossBtnText.text = '挑战BOSS';
    this._bossBtnText.textColor = 0xffffff;
    if (this._bossBtnHint) {
      this._bossBtnHint.text = '可再战';
      this._bossBtnHint.textColor = 0xffd7a3;
    }
    if (this._bossBtnGroup) {
      this._bossBtnGroup.alpha = 1;
      this._bossBtnGroup.touchEnabled = true;
      this._bossBtnGroup.touchChildren = true;
    }
  } else if (isBossWave) {
    this._bossBtnBg.fillColor = 0xe74c3c;
    this._bossBtnText.text = 'BOSS战';
    this._bossBtnText.textColor = 0xffffff;
    if (this._bossBtnHint) {
      this._bossBtnHint.text = '限时击杀';
      this._bossBtnHint.textColor = 0xffe4e6;
    }
    if (this._bossBtnGroup) this._bossBtnGroup.alpha = 1;
    if (this._bossBtnGroup) {
      this._bossBtnGroup.touchEnabled = false;
      this._bossBtnGroup.touchChildren = false;
    }
  } else if (canChallenge) {
    var power = this.getBossPowerInfo(this.getNextBossWave());
    this._bossBtnBg.fillColor = 0x9b2335;
    this._bossBtnText.text = '挑战BOSS';
    this._bossBtnText.textColor = 0xffffff;
    if (this._bossBtnHint) {
      this._bossBtnHint.text = power.ratio >= 0.96 ? '战力达标' : '战力偏低';
      this._bossBtnHint.textColor = power.ratio >= 0.96 ? 0xffd7a3 : 0xff8888;
    }
    if (this._bossBtnGroup) this._bossBtnGroup.alpha = 1;
    if (this._bossBtnGroup) {
      this._bossBtnGroup.touchEnabled = true;
      this._bossBtnGroup.touchChildren = true;
    }
  } else {
    this._bossBtnBg.fillColor = 0x444444;
    this._bossBtnText.text = '挑战BOSS';
    this._bossBtnText.textColor = 0x888888;
    if (this._bossBtnHint) {
      this._bossBtnHint.text = waveInCycle + '/9 开启';
      this._bossBtnHint.textColor = 0xaaaaaa;
    }
    if (this._bossBtnGroup) this._bossBtnGroup.alpha = 0.6;
    if (this._bossBtnGroup) {
      this._bossBtnGroup.touchEnabled = false;
      this._bossBtnGroup.touchChildren = false;
    }
  }
};

Game.prototype.updateBossTimerUI = function() {
  if (!this.hpFill || !this.hpLabel) return;
  if (this.bossTimerBg) this.bossTimerBg.visible = false;
  if (this.bossTimerBar) this.bossTimerBar.visible = false;
  if (this.bossTimerLabel) this.bossTimerLabel.visible = false;
  if (this.bossActive && this.bossTimer > 0) {
    var pct = this.bossTimer / CONFIG.bossTimeLimit;
    var bMax = this._hpMaxWidth || this._bossBarMaxWidth || 140;
    this.hpFill.width = Math.max(0, bMax * pct);
    this.hpLabel.text = 'BOSS限时 ' + this.bossTimer.toFixed(1) + 's' + this.getBossCounterLabel();
    if (pct > 0.5) {
      this.hpFill.fillColor = 0x2ecc71;
    } else if (pct > 0.25) {
      this.hpFill.fillColor = 0xf39c12;
    } else {
      this.hpFill.fillColor = 0xe74c3c;
    }
  }
};

Game.prototype.nextWave = function() {
  // BOSS击杀成功，停止计时器
  var wasBoss = this.wave % 10 === 0;
  var clearedWave = this.wave;
  var bossStage = wasBoss ? Math.floor(this.wave / 10) : 0;
  var rewardInfo = wasBoss ? this.claimBossStageReward(bossStage) : null;
  this.stopBossTimer();
  this.wave++;
  this.advanceBossRetryLock(clearedWave);
  this.totalCleared++;
  // 成功推进一步即重置连续战败计数与引导标记，避免长期挂机后把偶发战败误判成卡关。
  this._defeatStreak = 0;
  this._defeatHintShown = false;
  if (this.wave > this.maxWaveReached) {
    this.maxWaveReached = this.wave;
    this.syncWxFriendRankScore(false);
  }
  if (wasBoss) {
    this.updateBattleScene(true);
    var nextProgress = this.getProgressInfoForWave(this.wave);
    if (rewardInfo) {
      this.pendingBossReward = { stage: bossStage, reward: rewardInfo };
      this.showToast('BOSS已击杀，' + rewardInfo.title + '已生效');
    } else {
      this.showToast('进入' + nextProgress.scene.name);
    }
  }
  this.checkDailyTasks('wave');
  this.checkSupports();
  this.updateBossBtn();
  this.updateUI();
  var self = this;
  setTimeout(function() {
    self.spawnWave();
  }, 300);
};

Game.prototype.openPendingBossReward = function() {
  if (!this.pendingBossReward || !this.pendingBossReward.reward) return;
  var stage = this.pendingBossReward.stage;
  var reward = this.pendingBossReward.reward;
  this.pendingBossReward = null;
  this.updateUI();
  this.openBossSuccessPanel(stage, reward);
};

Game.prototype.openBossSuccessPanel = function(stage, rewardInfo) {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 306);
  var cleared = this.getProgressInfoForBossStage(stage);
  var next = this.getProgressInfoForWave(this.wave);

  var title = new eui.Label();
  title.text = rewardInfo.chapterClear ? ('🏆 第' + cleared.chapter + '章通关') : ('🏆 BOSS ' + cleared.chapterBoss + '/' + BOSSES_PER_CHAPTER + ' 通关');
  title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var rewardBg = new eui.Rect();
  rewardBg.width = panel._contentW; rewardBg.height = 74;
  rewardBg.x = panel._contentX; rewardBg.y = 58;
  rewardBg.ellipseWidth = 10; rewardBg.ellipseHeight = 10;
  rewardBg.fillColor = 0x1a153f; rewardBg.strokeColor = rewardInfo.color;
  rewardBg.strokeWeight = 1.2; rewardBg.strokeAlpha = 0.7;
  panel.addChild(rewardBg);

  var rewardTitle = new eui.Label();
  rewardTitle.text = rewardInfo.title; rewardTitle.size = 17; rewardTitle.bold = true;
  rewardTitle.textColor = rewardInfo.color;
  rewardTitle.x = panel._contentX + 12; rewardTitle.y = 68; rewardTitle.width = panel._contentW - 24;
  panel.addChild(rewardTitle);

  var rewardDesc = new eui.Label();
  rewardDesc.text = rewardInfo.desc; rewardDesc.size = 11; rewardDesc.textColor = 0xcccccc;
  rewardDesc.x = panel._contentX + 12; rewardDesc.y = 96; rewardDesc.width = panel._contentW - 24;
  panel.addChild(rewardDesc);

  var bonuses = this.getStageBonuses();
  var summary = new eui.Label();
  summary.text = '当前永久加成：金币+' + Math.round(bonuses.gold * 100) + '%  能量+' + bonuses.energy +
    '\n队友+' + Math.round(bonuses.support * 100) + '%  冷却-' + Math.round(bonuses.cooldown * 100) + '%' +
    '\n下一目标：' + this.getProgressTitle(this.wave) + ' · BOSS ' + next.chapterBoss + '/' + BOSSES_PER_CHAPTER;
  summary.size = 12; summary.textColor = THEME.textDim;
  summary.x = panel._contentX; summary.y = 146; summary.width = panel._contentW; summary.lineSpacing = 5;
  panel.addChild(summary);

  var self = this;
  var nextBtn = this.createButton('知道了', 0x27ae60, 130, 34, function() { self.closePanel(); }, this);
  nextBtn.x = panel._contentX + 24; nextBtn.y = 224;
  panel.addChild(nextBtn);
  var upBtn = this.createButton('继续强化', 0x3498db, 110, 34, function() {
    self.closePanel(); self.openUpgrade();
  }, this);
  upBtn.x = panel._contentX + panel._contentW - 134; upBtn.y = 224;
  panel.addChild(upBtn);
};

// ==================== 升级 ====================

Game.prototype.checkLevelUp = function() {
  if (this.killCount >= CONFIG.killsNeeded(this.mainLevel)) {
    this.killCount = 0;
    this.mainLevel++;
    this.playerHp = Math.min(this.getMaxPlayerHp(), this.playerHp + Math.floor(this.getMaxPlayerHp() * 0.25));
    this.sfxLevelUp();
    this.showToast('⬆️ 主角升级！Lv.' + this.mainLevel + ' 伤害: ' + this.fmt(CONFIG.mainDmg(this.mainLevel, this.rebirthGems)));
    this.notifyLevelMail();
    this.checkAchievements();
    for (var i = 0; i < SKILLS.length; i++) {
      if (this.mainLevel >= SKILLS[i].lv && !this.skillUnlocked[i]) {
        this.skillUnlocked[i] = true;
        this.sfxUnlock();
        this.showToast('🔓【' + SKILLS[i].name + '】解锁！');
      }
    }
  }
};

Game.prototype.flashSkillBtn = function(idx) {
  var btn = this.skillBtns[idx];
  if (!btn) return;
  egret.Tween.get(btn, { loop: true })
    .to({ scaleX: 1.2, scaleY: 1.2 }, 200)
    .to({ scaleX: 1, scaleY: 1 }, 200);
  var self = this;
  setTimeout(function() {
    egret.Tween.removeTweens(btn);
    btn.scaleX = 1; btn.scaleY = 1;
  }, 3000);
};

Game.prototype.checkSupports = function() {
  this.repairSupportUnlocks();
  for (var i = 0; i < this.supports.length; i++) {
    var s = this.supports[i];
    var def = SUPPORTS_DEF[i];
    if (!s.unlocked && !s.notified && def && this.isSupportAvailable(i)) {
      s.notified = true;
      this.showToast('🌟【' + s.name + '】可招募！去升级面板购买');
    }
  }
  this.checkAchievements();
};

Game.prototype.upgradeMain = function() {
  this.upgradeMainBatch(1);
};

Game.prototype.notifyLevelMail = function() {
  for (var i = 0; i < MAIL_REWARDS.length; i++) {
    var mail = MAIL_REWARDS[i];
    if (mail.level === this.mainLevel && !this.mailClaimed[mail.id]) {
      this.showToast('📧 新邮件：' + mail.title);
      return;
    }
  }
};

Game.prototype.upgradeSupport = function(idx) {
  var s = this.supports[idx];
  if (!this.isSupportActive(idx)) { this.showToast('队友尚未激活！'); return; }
  var cost = CONFIG.supportCost(s.level);
  if (this.gold < cost) { this.showToast('金币不足！'); return; }
  this.gold -= cost;
  s.level++;
  this.showToast('⬆️ ' + s.name + '升级！Lv.' + s.level + ' DPS: ' + this.fmt(s.dps * s.level));
  this.saveGame();
  this.updateUI();
  this.refreshUpgradePanel('supports');
};

Game.prototype.upgradeSkill = function(idx) {
  if (!this.skillUnlocked[idx]) { this.showToast('技能未解锁！'); return; }
  if (!this.skillLevels) this.skillLevels = [1,1,1,1,1,1,1];
  var level = this.skillLevels[idx] || 1;
  var cost = CONFIG.skillCost(level, idx);
  if (this.gold < cost) { this.showToast('金币不足！'); return; }
  this.gold -= cost;
  this.skillLevels[idx] = level + 1;
  this.sfxLevelUp();
  this.showToast('✨ ' + SKILLS[idx].name + '强化！Lv.' + this.skillLevels[idx]);
  this.saveGame();
  this.updateUI();
  this.refreshUpgradePanel('skills');
};

Game.prototype.recruitSupport = function(idx) {
  var s = this.supports[idx];
  var def = SUPPORTS_DEF[idx];
  if (!s || !def) return;
  if (!this.isSupportAvailable(idx)) { this.showToast('尚未达到招募条件！'); return; }
  if (s.unlocked) { this.showToast(s.name + '已加入队伍'); return; }
  var price = this.getSupportRecruitPrice(idx);
  if (!this.paySupportRecruitPrice(price)) return;
  s.unlocked = true;
  s.notified = true;
  this.showToast('🌟 招募成功：【' + s.name + '】加入队伍！');
  this.refreshSupportViews();
  this.checkAchievements();
  this.saveGame();
  this.updateUI();
  this.refreshUpgradePanel('supports');
};

Game.prototype.checkLevelUpSkills = function() {
  for (var i = 0; i < SKILLS.length; i++) {
    if (this.mainLevel >= SKILLS[i].lv && !this.skillUnlocked[i]) {
      this.skillUnlocked[i] = true;
      this.sfxUnlock();
      this.showToast('🔓【' + SKILLS[i].name + '】解锁！');
    }
  }
  this.updateUI();
};

// ==================== 技能 ====================

Game.prototype.useSkill = function(idx) {
  if (!this.skillUnlocked[idx]) { this.showToast('技能未解锁！'); return; }
  if (this.skillCD[idx] > 0) { this.showToast('冷却中！'); return; }
  if (this.monsters.length === 0) { this.showToast('没有怪物！'); return; }
  var s = SKILLS[idx];
  this.sfxSkill(idx);
  this.skillCD[idx] = this.getSkillCooldown(s);
  var skillLv = this.skillLevels && this.skillLevels[idx] ? this.skillLevels[idx] : 1;
  var dmg = CONFIG.mainDmg(this.mainLevel, this.rebirthGems) * s.dmg * this.getSkillPowerMultiplier(idx);
  var self = this;
  var targetIdx = this.findPriorityTargetIndex();
  if (targetIdx < 0) { this.showToast('没有怪物！'); return; }
  this.interruptBossCounter();

  if (s.effect === 'aoe' || s.effect === 'meteor' || s.effect === 'speedBuff') {
    this.heroAttackAnim(targetIdx);
    var targets = this.monsters.slice();
    targets.forEach(function(m) {
      var liveIdx = self.monsters.indexOf(m);
      if (liveIdx < 0 || !m || m.hp <= 0) return;
      var aoeDmg = dmg;
      if (s.effect === 'meteor' && m.isBoss) aoeDmg *= 1.35;
      self.doDamage(m, aoeDmg, liveIdx, s.effect === 'meteor', s.type);
    });
    if (s.effect === 'speedBuff') {
      this.skillBuffs.speedTime = 10 + this.getSkillBuffBonus(idx);
      this.skillBuffs.speedMult = 1.75 + Math.min(0.35, (skillLv - 1) * 0.035);
      this.skillBuffs.shieldTime = 6 + Math.floor(this.getSkillBuffBonus(idx) / 2);
      this.skillBuffs.shieldReduce = 0.38 + Math.min(0.12, (skillLv - 1) * 0.01);
      this.showToast('⚡ 雷霆：攻速提升，并获得护盾' + this.skillBuffs.shieldTime + '秒');
    } else if (s.effect === 'meteor') {
      this.showToast('☄ 星陨：全屏爆发');
    } else {
      this.showToast('🌪 糖风：范围伤害');
    }
  } else if (s.effect === 'multi') {
    for (var i = 0; i < s.hits; i++) {
      if (this.monsters.length === 0) break;
      var alive = [];
      for (var a = 0; a < this.monsters.length; a++) {
        if (this.monsters[a] && this.monsters[a].hp > 0) alive.push(a);
      }
      if (alive.length === 0) break;
      var mi = alive[Math.floor(Math.random() * alive.length)];
      this.heroAttackAnim(mi);
      var m = this.monsters[mi];
      if (m) this.doDamage(m, dmg, mi, false, s.type);
    }
    this.showToast('⚔ 连斩：多段攻击');
  } else {
    var target = this.monsters[targetIdx];
    if (!target) return;
    if (s.effect === 'boss' && target.isBoss) dmg *= 2.15;
    if (s.effect === 'critBuff') {
      this.skillBuffs.critTime = 10 + this.getSkillBuffBonus(idx);
      this.skillBuffs.critBonus = 0.25 + Math.min(0.2, (skillLv - 1) * 0.02);
      dmg *= 1.8;
      this.showToast('✦ 裂光：暴击提升' + this.skillBuffs.critTime + '秒');
    }
    this.heroAttackAnim(targetIdx);
    this.doDamage(target, dmg, targetIdx, s.effect === 'critBuff' || s.effect === 'boss', s.type);
  }
  this.updateUI();
};

// ==================== UI 更新 ====================

Game.prototype.updateWaveNumbers = function() {
  if (!this._waveNumBgs || !this._waveNumLbs) return;
  if (this._waveNumBgs.length === 0) return;
  var waveNumStart = Math.max(1, this.wave - 2);
  for (var i = 0; i < this._waveNumBgs.length; i++) {
    var num = waveNumStart + i;
    var isCurrent = (num === this.wave);
    this._waveNumBgs[i].fillColor = isCurrent ? 0xe74c3c : 0x1a153f;
    this._waveNumLbs[i].text = '' + num;
  }
};

Game.prototype.updateUI = function() {
  if (this.goldLabel) this.goldLabel.text = this.fmt(this.gold);
  if (this.waveLabel) this.waveLabel.text = 'Lv.' + this.mainLevel;
  this.refreshJobHud();
  this.updateWaveNumbers();
  if (this.levelLabel) this.levelLabel.text = 'Lv.' + this.mainLevel;
  if (this.dpsLabel) this.dpsLabel.text = 'DPS: ' + this.fmt(this.totalDps());
  if (this.exploreLabel) this.exploreLabel.text = this.getExploreText();
  if (this.goalLabel) {
    var goal = this.getNextGoal();
    this.goalLabel.text = goal.text;
    this.goalLabel.textColor = goal.action === 'bossReward' ? THEME.textGold : (goal.action === 'boss' ? 0xffd7a3 : (goal.action === 'daily' ? 0x7be8b7 : (goal.action === 'equipment' ? 0xff9f43 : (goal.action === 'rebirth' ? 0xc7a7ff : (goal.action === 'codex' ? 0x7be8b7 : THEME.accentSoft)))));
  }
  if (this.energyLabel) this.energyLabel.text = '⚡' + Math.floor(this.energy) + '/' + this.getMaxEnergy();
  if (this.energyFill) {
    var eMax = this._energyMaxWidth || 100;
    this.energyFill.width = Math.max(0, (this.energy / this.getMaxEnergy()) * eMax);
  }
  if (this.playerHpFill) {
    var hpMax2 = this._playerHpMaxWidth || 82;
    var hpPct2 = Math.max(0, Math.min(1, this.playerHp / this.getMaxPlayerHp()));
    this.playerHpFill.width = Math.floor(hpMax2 * hpPct2);
    this.playerHpFill.fillColor = hpPct2 > 0.5 ? 0xef4444 : (hpPct2 > 0.25 ? 0xf59e0b : 0x8b0000);
  }
  if (this.playerHpLabel) this.playerHpLabel.text = '❤' + Math.max(0, Math.floor(this.playerHp));
  if (this.waveFill && this.waveFillBg) {
    var waveInCycle = ((this.wave - 1) % 10) + 1;
    var wMax = this._waveFillMaxWidth || this.waveFillBg.width;
    this.waveFill.width = (waveInCycle / 10) * wMax;
  }
  if (this.buffLabel) this.buffLabel.text = this.renderBuffText();
  if (this.gemsLabel) this.gemsLabel.text = String(this.rebirthGems || 0);
  this.applyDetailMode();
  // 更新HP条
  if (this.hpFill && this.hpLabel && this.monsters.length > 0) {
    var hpMax = this._hpMaxWidth || 140;
    if (this.bossActive && this.bossTimer > 0) {
      var timerPct = Math.max(0, Math.min(1, this.bossTimer / CONFIG.bossTimeLimit));
      this.hpFill.width = Math.floor(hpMax * timerPct);
      this.hpFill.fillColor = timerPct > 0.5 ? 0x2ecc71 : (timerPct > 0.25 ? 0xf39c12 : 0xe74c3c);
      this.hpLabel.text = 'BOSS限时 ' + this.bossTimer.toFixed(1) + 's' + this.getBossCounterLabel();
      this.hpLabel.textColor = 0xffffff;
    } else {
      var totalHp = 0;
      var maxHp = 0;
      for (var i = 0; i < this.monsters.length; i++) {
        totalHp += Math.max(0, this.monsters[i].hp);
        maxHp += this.monsters[i].maxHp;
      }
      if (maxHp > 0) {
        var hpPct = totalHp / maxHp;
        this.hpFill.width = Math.floor(hpMax * hpPct);
        this.hpFill.fillColor = THEME.mint;
        this.hpLabel.text = this.fmt(totalHp) + ' / ' + this.fmt(maxHp);
        this.hpLabel.textColor = 0xffffff;
      }
    }
  }
  this.updateSkillBtns();
};

Game.prototype.applyDetailMode = function() {
  var detail = this.detailMode !== false;
  if (this._heroNameBg) this._heroNameBg.visible = detail;
  if (this._heroNameLabel) this._heroNameLabel.visible = detail;
  if (this.levelLabel) this.levelLabel.visible = detail;
  if (this.dpsLabel) this.dpsLabel.visible = detail;
  if (!this.monsterViews) return;
  for (var i = 0; i < this.monsterViews.length; i++) {
    var mv = this.monsterViews[i];
    if (!mv || !mv._detailViews) continue;
    for (var j = 0; j < mv._detailViews.length; j++) {
      if (mv._detailViews[j]) mv._detailViews[j].visible = detail;
    }
  }
};

Game.prototype.updateMonsterDisplay = function() {
  // 清除旧的怪物显示
  for (var i = 0; i < this.monsterViews.length; i++) {
    var v = this.monsterViews[i];
    if (v.parent) v.parent.removeChild(v);
  }
  this.monsterViews = [];

  var w = this.monsters.length;
  if (w === 0) return;
  for (var i = 0; i < this.monsters.length; i++) {
    var m = this.monsters[i];
    var mv = this.createMonsterView(m, i, w);
    this.monsterViews.push(mv);
    this.battleGroup.addChild(mv);
  }
  // 确保伤害层在最上面
  if (this.damageLayer && this.damageLayer.parent) {
    this.battleGroup.setChildIndex(this.damageLayer, this.battleGroup.numChildren - 1);
  }
  this.applyDetailMode();
};

Game.prototype.updateMonsterHealthView = function(idx) {
  var m = this.monsters[idx];
  var mv = this.monsterViews[idx];
  if (!m || !mv) return;
  var pct = Math.max(0, Math.min(1, m.hp / m.maxHp));
  if (mv._hpFill) {
    mv._hpFill.width = Math.max(0, (mv._hpMaxWidth || mv._hpFill.width) * pct);
    var mType = m.type || MONSTER_TYPES[0];
    mv._hpFill.fillColor = m.isBoss ? 0xe74c3c : (pct > 0.5 ? (mType.hpColor || (mType.hidden ? THEME.strokeGold : THEME.ok)) : (pct > 0.2 ? 0xf39c12 : 0xe74c3c));
  }
  if (mv._hpText) {
    mv._hpText.text = Math.max(0, Math.floor(m.hp)) + '/' + m.maxHp;
  }
};

Game.prototype.createMonsterView = function(m, idx, total) {
  var g = new eui.Group();
  var cx = this._centerX || 48;
  var cw = this._centerW || 279;

  // 每只怪物大小不同：基础尺寸 + 按 idx 的随机偏移
  var baseSz = m.isBoss ? 84 : 54;
  var sizeVariants = [0, 8, -6, 10, -4, 6, -8, 4]; // 每个位置的大小偏移
  var sz = Math.floor(baseSz * (m.sizeScale || 1)) + (m.sizeJitter !== undefined ? m.sizeJitter : (sizeVariants[idx % sizeVariants.length] || 0));
  if (m.isBoss) sz = Math.max(78, Math.min(96, sz));
  else sz = Math.max(36, Math.min(74, sz));
  var mType = m.type || MONSTER_TYPES[0];

  // 怪物在中央战斗区随机出生，保留足够边界给来回走动。
  var centerMinX = 18;
  var centerMaxX = cw - 18;
  var spawnX = m.spawnX !== undefined ? m.spawnX : ((idx + 0.5) / Math.max(1, total));
  var spawnY = m.spawnY !== undefined ? m.spawnY : 0.45;
  var labelText = m.displayName || (m.isBoss ? mType.name : mType.name);
  var badgeW = m.isBoss ? 82 : Math.max(54, Math.min(86, labelText.length * 12 + 10));
  badgeW = Math.max(badgeW, m.isBoss ? 62 : 46);
  var visualW = Math.max(sz, badgeW);
  var labelBlockH = m.isBoss ? 42 : 38;
  var desiredCenterX = cx + centerMinX + (centerMaxX - centerMinX) * spawnX;
  var baseX = Math.round(desiredCenterX - visualW / 2);
  var minX = cx + 2;
  var maxX = cx + cw - visualW - 2;
  baseX = Math.max(minX, Math.min(maxX, baseX));
  var areaUsableH = Math.max(1, this._monsterAreaH - sz - labelBlockH);
  var baseY = this._monsterAreaY + Math.round(areaUsableH * spawnY);

  g.width = visualW; g.height = sz + labelBlockH;
  g.x = baseX;
  g.y = baseY;
  g.touchEnabled = true;
  var self = this;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.onMonsterTouch(idx); }, this);

  var monsterSprite = new eui.Image();
  var monsterSource = this.monsterSpriteSource(mType, m.isBoss);
  var spriteX = Math.floor((visualW - sz) / 2);
  this.fitImageToBox(monsterSprite, monsterSource, sz, sz, spriteX, 0);
  g._sprite = monsterSprite;
  g._spriteSize = sz;
  g.addChild(monsterSprite);

  // 旧矢量怪物保留为兜底和图签绘制能力，战斗页使用真实 PNG。
  var body = new egret.Shape();
  this.drawMonsterShape(body.graphics, mType, sz, m.isBoss);
  body.alpha = 0;
  g.addChild(body);

  // --- 名字图签（胶囊徽章）---
  var badgeH = m.isBoss ? 18 : 16;
  var badgeY = sz + 2;
  var badge = new eui.Rect();
  badge.width = badgeW; badge.height = badgeH;
  badge.ellipseWidth = badgeH; badge.ellipseHeight = badgeH;
  // V1-7：隐藏怪缺 badge / hpColor 色板字段，用 THEME 兜底，避免 fillColor=undefined。
  var isRare = !!mType.hidden;
  badge.fillColor = m.isBoss ? 0x5a0a08 : (mType.badge || (isRare ? THEME.bgGlass : THEME.bgLite));
  badge.fillAlpha = 0.92;
  badge.strokeColor = (m.isBoss || isRare) ? THEME.strokeGold : 0xffffff;
  badge.strokeWeight = m.isBoss ? 1.5 : 1;
  badge.strokeAlpha = m.isBoss ? 0.9 : 0.6;
  badge.x = Math.floor((visualW - badgeW) / 2); badge.y = badgeY;
  g.addChild(badge);
  var nameLabel = new eui.Label();
  nameLabel.text = labelText;
  nameLabel.size = m.isBoss ? 10 : (labelText.length > 4 ? 8 : 9);
  nameLabel.textColor = 0xffffff; nameLabel.bold = true;
  nameLabel.width = badgeW; nameLabel.height = badgeH;
  nameLabel.textAlign = 'center';
  nameLabel.verticalAlign = 'middle';
  nameLabel.x = Math.floor((visualW - badgeW) / 2); nameLabel.y = badgeY;
  g.addChild(nameLabel);

  var traitLabel = new eui.Label();
  var traitParts = [this.getDamageTypeName(m.weakness) + '弱'];
  if (m.affix && m.affix.traitName) traitParts.push(m.affix.traitName);
  if (mType.traitName) traitParts.push(mType.traitName);
  traitLabel.text = traitParts.join(' · ');
  traitLabel.size = 7; traitLabel.textColor = m.weakness === 'magic' ? 0x9be7ff : (m.weakness === 'true' ? 0xffd166 : 0xffc0a8);
  traitLabel.width = visualW; traitLabel.height = 10; traitLabel.textAlign = 'center';
  traitLabel.x = 0; traitLabel.y = Math.max(0, badgeY - 10);
  g.addChild(traitLabel);

  // --- 血条 ---
  var hpY = badgeY + badgeH + 2;
  var hpH = m.isBoss ? 6 : 4;
  var hpW = badgeW - 4;
  var hpBg = new eui.Rect();
  hpBg.width = hpW; hpBg.height = hpH;
  hpBg.fillColor = 0x1a1a1a; hpBg.ellipseWidth = hpH; hpBg.ellipseHeight = hpH;
  hpBg.x = Math.floor((visualW - hpW) / 2); hpBg.y = hpY;
  g.addChild(hpBg);
  var pct = Math.max(0, m.hp / m.maxHp);
  var hpFill = new eui.Rect();
  hpFill.width = Math.max(0, hpW * pct); hpFill.height = hpH;
  hpFill.fillColor = m.isBoss ? 0xe74c3c : (pct > 0.5 ? (mType.hpColor || (isRare ? THEME.strokeGold : THEME.ok)) : (pct > 0.2 ? 0xf39c12 : 0xe74c3c));
  hpFill.ellipseWidth = hpH; hpFill.ellipseHeight = hpH;
  hpFill.x = hpBg.x; hpFill.y = hpY;
  g.addChild(hpFill);
  g._hpFill = hpFill;
  g._hpMaxWidth = hpW;

  // --- 血量文字 ---
  var hpText = new eui.Label();
  hpText.text = Math.max(0, Math.floor(m.hp)) + '/' + m.maxHp;
  hpText.size = 8; hpText.textColor = 0xcccccc;
  hpText.width = visualW; hpText.height = 10; hpText.textAlign = 'center';
  hpText.verticalAlign = 'middle';
  hpText.x = 0; hpText.y = hpY + hpH + 1;
  g.addChild(hpText);
  g._hpText = hpText;
  g._detailViews = [badge, nameLabel, traitLabel, hpText];
  // V1-7：稀有遭遇出场表现（金色描边 / 出现动画），专属美术仍留 V2。
  if (this._v1RareFx !== false && isRare) this._v1RareSpawnFx(g, visualW, sz);
  if (this.detailMode === false) {
    for (var dv = 0; dv < g._detailViews.length; dv++) g._detailViews[dv].visible = false;
  }

  // === 走动动画 ===
  var moveRange = m.moveRange || (m.isBoss ? 18 : (10 + idx * 4));
  var moveDur   = m.moveDur || (m.isBoss ? 1800 : (900 + idx * 200 + Math.floor(Math.random() * 300)));
  var moveDelay = (m.phase || 0) + idx * 120;
  var floatRange = m.floatRange || (m.isBoss ? 8 : 4);
  var floatDur   = m.isBoss ? 1300 : (850 + idx * 160);

  var startX = g.x;
  var startY2 = g.y;
  var minWalkX = cx + 2;
  var maxWalkX = cx + cw - visualW - 2;
  var leftRange = Math.max(0, startX - minWalkX);
  var rightRange = Math.max(0, maxWalkX - startX);
  var walkLeft = Math.min(moveRange, leftRange);
  var walkRight = Math.min(moveRange, rightRange);
  if (walkLeft < 4 && walkRight < 4) {
    walkLeft = 0;
    walkRight = 0;
  }

  function startWalk() {
    if (!g.parent) return;
    egret.Tween.get(g, { loop: false })
      .to({ x: startX + walkRight }, moveDur, egret.Ease.sineInOut)
      .to({ x: startX - walkLeft }, moveDur * 2, egret.Ease.sineInOut)
      .to({ x: startX }, moveDur, egret.Ease.sineInOut)
      .call(startWalk);
  }
  function startFloat() {
    if (!g.parent) return;
    egret.Tween.get(g, { loop: false })
      .to({ y: startY2 - floatRange }, floatDur, egret.Ease.sineInOut)
      .to({ y: startY2 + floatRange }, floatDur * 2, egret.Ease.sineInOut)
      .to({ y: startY2 }, floatDur, egret.Ease.sineInOut)
      .call(startFloat);
  }

  setTimeout(startWalk, moveDelay);
  setTimeout(startFloat, moveDelay + Math.floor(floatDur / 2));

  return g;
};

/**
 * 所有怪物形状在此统一绘制。
 * 通用约定：
 *   - 先 lineStyle 设描边，beginFill 填充主色；复杂形状可多次 begin/end
 *   - 最后统一画眼睛（白底黑瞳 + 白色高光点）让所有怪物视觉风格一致
 * sz     = 怪物整体外接正方形边长（小怪 56，BOSS 76）
 * isBoss = BOSS 会画得更威严（加角、加獠牙等）
 */
Game.prototype.drawMonsterShape = function(g, mType, sz, isBoss) {
  var half = sz / 2;
  var c = mType.color;
  var ol = mType.outline;
  var hi = mType.highlight || 0xffffff;
  var ac = mType.accent || 0xffffff;

  // BOSS 专属：外层脉冲光晕（两圈半透明）
  if (isBoss) {
    g.lineStyle(0);
    g.beginFill(c, 0.18);
    g.drawCircle(half, half, half + 10);
    g.endFill();
    g.beginFill(c, 0.28);
    g.drawCircle(half, half, half + 4);
    g.endFill();
  }

  switch (mType.shape) {
    case 'slime':
      // 半球形史莱姆，底部扁平，头顶高光
      g.lineStyle(2, ol);
      g.beginFill(c);
      g.moveTo(half - half * 0.85, half + half * 0.55);
      g.curveTo(half - half * 0.95, half - half * 0.4, half, half - half * 0.7);
      g.curveTo(half + half * 0.95, half - half * 0.4, half + half * 0.85, half + half * 0.55);
      g.lineTo(half - half * 0.85, half + half * 0.55);
      g.endFill();
      // 头顶高光
      g.lineStyle(0);
      g.beginFill(0xffffff, 0.5);
      g.drawEllipse(half - 10, half - half * 0.5, 12, 5);
      g.endFill();
      // 眼睛（偏上）
      drawEyesPair(g, half - 7, half - 4, half + 7, half - 4, 3, 1.5);
      // 嘴（小弯线）
      g.lineStyle(1.5, ol);
      g.moveTo(half - 4, half + 6);
      g.curveTo(half, half + 9, half + 4, half + 6);
      break;

    case 'rabbit':
      // 兔子：两只长耳朵 + 圆脸 + 三瓣嘴
      g.lineStyle(2, ol);
      // 左耳
      g.beginFill(c);
      g.drawEllipse(half - 14, half - half * 0.95, 7, 22);
      g.endFill();
      g.beginFill(0xff9cc4);
      g.drawEllipse(half - 12, half - half * 0.85, 4, 16);
      g.endFill();
      // 右耳
      g.beginFill(c);
      g.drawEllipse(half + 7, half - half * 0.95, 7, 22);
      g.endFill();
      g.beginFill(0xff9cc4);
      g.drawEllipse(half + 9, half - half * 0.85, 4, 16);
      g.endFill();
      // 头
      g.beginFill(c);
      g.drawCircle(half, half + 2, half - 4);
      g.endFill();
      // 眼睛
      drawEyesPair(g, half - 7, half - 2, half + 7, half - 2, 3, 1.5);
      // 粉色鼻子
      g.lineStyle(0);
      g.beginFill(0xe91e63);
      g.drawCircle(half, half + 5, 2);
      g.endFill();
      // 三瓣嘴
      g.lineStyle(1.5, ol);
      g.moveTo(half, half + 7);
      g.lineTo(half, half + 10);
      g.moveTo(half, half + 10);
      g.lineTo(half - 3, half + 12);
      g.moveTo(half, half + 10);
      g.lineTo(half + 3, half + 12);
      // 兔子脸部高光
      g.lineStyle(0);
      g.beginFill(hi, 0.45);
      g.drawEllipse(half - 6, half - 6, 8, 3);
      g.endFill();
      break;

    case 'bat':
      // 蝙蝠：大翅膀 + 圆身 + 小尖耳
      g.lineStyle(2, ol);
      // 左翅（两段式）
      g.beginFill(c);
      g.moveTo(half - 4, half);
      g.lineTo(half - half * 0.95, half - 8);
      g.lineTo(half - half * 0.75, half - 2);
      g.lineTo(half - half * 0.9, half + 6);
      g.lineTo(half - half * 0.55, half + 2);
      g.lineTo(half - 4, half + 6);
      g.lineTo(half - 4, half);
      g.endFill();
      // 右翅
      g.beginFill(c);
      g.moveTo(half + 4, half);
      g.lineTo(half + half * 0.95, half - 8);
      g.lineTo(half + half * 0.75, half - 2);
      g.lineTo(half + half * 0.9, half + 6);
      g.lineTo(half + half * 0.55, half + 2);
      g.lineTo(half + 4, half + 6);
      g.lineTo(half + 4, half);
      g.endFill();
      // 身体
      g.beginFill(c);
      g.drawCircle(half, half + 2, 10);
      g.endFill();
      // 尖耳
      g.beginFill(c);
      g.moveTo(half - 8, half - 8);
      g.lineTo(half - 5, half - 14);
      g.lineTo(half - 3, half - 7);
      g.moveTo(half + 3, half - 7);
      g.lineTo(half + 5, half - 14);
      g.lineTo(half + 8, half - 8);
      g.endFill();
      // 红眼
      g.lineStyle(0);
      g.beginFill(0xff3030);
      g.drawCircle(half - 4, half, 2);
      g.drawCircle(half + 4, half, 2);
      g.endFill();
      // 獠牙
      g.beginFill(0xffffff);
      g.moveTo(half - 3, half + 6);
      g.lineTo(half - 2, half + 10);
      g.lineTo(half - 1, half + 6);
      g.moveTo(half + 1, half + 6);
      g.lineTo(half + 2, half + 10);
      g.lineTo(half + 3, half + 6);
      g.endFill();
      // 翅膀高光
      g.lineStyle(0);
      g.beginFill(hi, 0.3);
      g.drawEllipse(half - half*0.7, half - 6, 10, 3);
      g.endFill();
      break;

    case 'spike':
      // 刺球：圆身 + 向外放射的三角刺
      var spikes = 10, outerR = half - 1, innerR = half - 10;
      g.lineStyle(2, ol);
      g.beginFill(c);
      g.moveTo(half + innerR, half);
      for (var i = 0; i < spikes; i++) {
        var a1 = ((i + 0.5) / spikes) * Math.PI * 2;
        var a2 = ((i + 1) / spikes) * Math.PI * 2;
        g.lineTo(half + outerR * Math.cos(a1), half + outerR * Math.sin(a1));
        g.lineTo(half + innerR * Math.cos(a2), half + innerR * Math.sin(a2));
      }
      g.endFill();
      // 眼睛
      drawEyesPair(g, half - 5, half - 2, half + 5, half - 2, 2.5, 1.2);
      // 怒眉（斜线）
      g.lineStyle(2, ol);
      g.moveTo(half - 10, half - 8);
      g.lineTo(half - 4, half - 6);
      g.moveTo(half + 4, half - 6);
      g.lineTo(half + 10, half - 8);
      // 刺球中心高光
      g.lineStyle(0);
      g.beginFill(hi, 0.4);
      g.drawEllipse(half - 5, half - 8, 8, 3);
      g.endFill();
      break;

    case 'ghost':
      // 幽灵：圆头 + 波浪下摆 + 空洞眼睛
      g.lineStyle(2, ol);
      g.beginFill(c, 0.9);
      // 从左下开始顺时针画圆顶 + 波浪下摆
      g.moveTo(half - half * 0.75, half + half * 0.7);
      g.lineTo(half - half * 0.75, half - 4);
      g.curveTo(half - half * 0.75, half - half * 0.85, half, half - half * 0.85);
      g.curveTo(half + half * 0.75, half - half * 0.85, half + half * 0.75, half - 4);
      g.lineTo(half + half * 0.75, half + half * 0.7);
      // 三个波浪齿
      g.lineTo(half + half * 0.45, half + half * 0.5);
      g.lineTo(half + half * 0.2, half + half * 0.7);
      g.lineTo(half - half * 0.1, half + half * 0.5);
      g.lineTo(half - half * 0.35, half + half * 0.7);
      g.lineTo(half - half * 0.6, half + half * 0.5);
      g.lineTo(half - half * 0.75, half + half * 0.7);
      g.endFill();
      // 空洞眼睛（黑色椭圆）
      g.lineStyle(0);
      g.beginFill(ol);
      g.drawEllipse(half - 10, half - 8, 6, 9);
      g.drawEllipse(half + 4, half - 8, 6, 9);
      g.endFill();
      // 小圆嘴
      g.beginFill(ol);
      g.drawCircle(half, half + 4, 3);
      g.endFill();
      // 幽灵顶部高光
      g.lineStyle(0);
      g.beginFill(hi, 0.5);
      g.drawEllipse(half - 6, half - half*0.7, 10, 4);
      g.endFill();
      break;

    case 'skull':
      // 骷髅：圆颅 + 黑眼洞 + 牙齿栏栅
      g.lineStyle(2, ol);
      g.beginFill(c);
      g.drawCircle(half, half - 4, half - 4);
      g.endFill();
      // 下巴突出
      g.beginFill(c);
      g.drawRoundRect(half - 10, half + 6, 20, 12, 6, 6);
      g.endFill();
      // 眼洞（大黑圆）
      g.lineStyle(0);
      g.beginFill(ol);
      g.drawCircle(half - 7, half - 4, 5);
      g.drawCircle(half + 7, half - 4, 5);
      g.endFill();
      // 眼洞内红色邪光
      g.beginFill(0xff3333, 0.9);
      g.drawCircle(half - 7, half - 4, 1.8);
      g.drawCircle(half + 7, half - 4, 1.8);
      g.endFill();
      // 鼻洞
      g.beginFill(ol);
      g.moveTo(half, half + 1);
      g.lineTo(half - 2, half + 5);
      g.lineTo(half + 2, half + 5);
      g.endFill();
      // 牙齿（小矩形）
      g.beginFill(c);
      g.lineStyle(1, ol);
      g.drawRect(half - 8, half + 10, 3, 5);
      g.drawRect(half - 4, half + 10, 3, 5);
      g.drawRect(half,    half + 10, 3, 5);
      g.drawRect(half + 4, half + 10, 3, 5);
      g.endFill();
      // 骷髅颅顶高光
      g.lineStyle(0);
      g.beginFill(hi, 0.4);
      g.drawEllipse(half - 5, half - 14, 8, 3);
      g.endFill();
      break;

    case 'dragon':
      // 火龙 BOSS：带角 + 龙脸 + 獠牙 + 火焰背景
      // 火焰光晕
      g.lineStyle(0);
      g.beginFill(0xff6b1a, 0.3);
      g.drawCircle(half, half, half + 4);
      g.endFill();
      g.beginFill(0xffb347, 0.5);
      g.drawCircle(half, half, half - 1);
      g.endFill();
      // 头部
      g.lineStyle(2.5, ol);
      g.beginFill(c);
      g.drawCircle(half, half + 2, half - 6);
      g.endFill();
      // 吻部（椭圆向下突出）
      g.beginFill(c);
      g.drawEllipse(half - 10, half + 6, 20, 14);
      g.endFill();
      // 左右龙角（深色三角）
      g.beginFill(ol);
      g.moveTo(half - 12, half - half * 0.5);
      g.lineTo(half - 18, half - half * 0.95);
      g.lineTo(half - 8, half - half * 0.65);
      g.moveTo(half + 8, half - half * 0.65);
      g.lineTo(half + 18, half - half * 0.95);
      g.lineTo(half + 12, half - half * 0.5);
      g.endFill();
      // 眼睛（黄底黑瞳）
      g.lineStyle(1.5, ol);
      g.beginFill(0xfff59d);
      g.drawCircle(half - 8, half - 2, 5);
      g.drawCircle(half + 8, half - 2, 5);
      g.endFill();
      g.lineStyle(0);
      g.beginFill(0x000000);
      g.drawEllipse(half - 10, half - 5, 3, 7);
      g.drawEllipse(half + 7, half - 5, 3, 7);
      g.endFill();
      // 鼻孔
      g.beginFill(ol);
      g.drawCircle(half - 4, half + 10, 1.5);
      g.drawCircle(half + 4, half + 10, 1.5);
      g.endFill();
      // 獠牙
      g.beginFill(0xffffff);
      g.lineStyle(1, ol);
      g.moveTo(half - 5, half + 15);
      g.lineTo(half - 4, half + 22);
      g.lineTo(half - 2, half + 15);
      g.moveTo(half + 2, half + 15);
      g.lineTo(half + 4, half + 22);
      g.lineTo(half + 5, half + 15);
      g.endFill();
      // 龙头高光
      g.lineStyle(0);
      g.beginFill(hi, 0.4);
      g.drawEllipse(half - 6, half - 10, 10, 4);
      g.endFill();
      break;

    case 'shadow':
      // 暗影：模糊黑影 + 悬浮 + 红眼
      // 外层模糊（多层半透明扩散）
      g.lineStyle(0);
      g.beginFill(c, 0.25);
      g.drawCircle(half, half, half + 2);
      g.endFill();
      g.beginFill(c, 0.5);
      g.drawCircle(half, half, half - 2);
      g.endFill();
      // 实心主体（形状不规则）
      g.lineStyle(1.5, ol);
      g.beginFill(c);
      g.moveTo(half - half * 0.7, half);
      g.curveTo(half - half * 0.6, half - half * 0.85, half, half - half * 0.75);
      g.curveTo(half + half * 0.6, half - half * 0.85, half + half * 0.7, half);
      g.curveTo(half + half * 0.8, half + half * 0.5, half + half * 0.3, half + half * 0.75);
      g.curveTo(half, half + half * 0.9, half - half * 0.3, half + half * 0.75);
      g.curveTo(half - half * 0.8, half + half * 0.5, half - half * 0.7, half);
      g.endFill();
      // 发光红眼（带外圈光晕）
      g.lineStyle(0);
      g.beginFill(0xff3030, 0.35);
      g.drawCircle(half - 7, half - 4, 5);
      g.drawCircle(half + 7, half - 4, 5);
      g.endFill();
      g.beginFill(0xff0000);
      g.drawCircle(half - 7, half - 4, 2.5);
      g.drawCircle(half + 7, half - 4, 2.5);
      g.endFill();
      g.beginFill(0xffffff);
      g.drawCircle(half - 7, half - 5, 0.8);
      g.drawCircle(half + 7, half - 5, 0.8);
      g.endFill();
      // 暗影内核高光
      g.lineStyle(0);
      g.beginFill(hi, 0.2);
      g.drawEllipse(half - 5, half - 10, 8, 3);
      g.endFill();
      break;

    default:
      // ── BOSS 专属形象 ──────────────────────────────────────
      if (mType.shape === 'boss_eye') {
        // 魔眼王：巨大眼球 + 多条触手 + 竖瞳
        g.lineStyle(0);
        g.beginFill(c, 0.3); g.drawCircle(half, half, half + 6); g.endFill();
        // 触手（8条）
        for (var ti = 0; ti < 8; ti++) {
          var ta = (ti / 8) * Math.PI * 2;
          var tx1 = half + (half - 4) * Math.cos(ta);
          var ty1 = half + (half - 4) * Math.sin(ta);
          var tx2 = half + (half + 14) * Math.cos(ta);
          var ty2 = half + (half + 14) * Math.sin(ta);
          g.lineStyle(3, ol, 0.8);
          g.moveTo(tx1, ty1); g.lineTo(tx2, ty2);
        }
        g.lineStyle(2, ol);
        g.beginFill(0xfff0f0); g.drawCircle(half, half, half - 2); g.endFill();
        // 虹膜
        g.beginFill(c); g.drawCircle(half, half, half * 0.65); g.endFill();
        // 竖瞳
        g.beginFill(0x000000); g.drawEllipse(half - 5, half - half * 0.55, 10, half * 1.1); g.endFill();
        // 高光
        g.beginFill(0xffffff, 0.8); g.drawEllipse(half - 8, half - half * 0.4, 6, 3); g.endFill();
        g.beginFill(0xffffff, 0.5); g.drawCircle(half + 6, half - 4, 2); g.endFill();
        // 血丝
        g.lineStyle(1, 0xff0000, 0.5);
        g.moveTo(half - 14, half - 6); g.lineTo(half - 6, half - 2);
        g.moveTo(half + 14, half + 4); g.lineTo(half + 6, half + 1);
        g.lineStyle(0);
      } else if (mType.shape === 'boss_giant') {
        // 冰霜巨人：方形身躯 + 冰晶甲 + 大角
        g.lineStyle(2.5, ol);
        g.beginFill(c);
        g.drawRoundRect(half - half * 0.7, half - half * 0.5, half * 1.4, half * 1.3, 6, 6);
        g.endFill();
        // 头
        g.beginFill(hi);
        g.drawCircle(half, half - half * 0.35, half * 0.45);
        g.endFill();
        // 冰角（左右各一）
        g.lineStyle(1.5, 0x81d4fa);
        g.beginFill(0xe1f5fe);
        g.moveTo(half - 14, half - half * 0.6);
        g.lineTo(half - 22, half - half * 1.1);
        g.lineTo(half - 8, half - half * 0.7);
        g.endFill();
        g.beginFill(0xe1f5fe);
        g.moveTo(half + 14, half - half * 0.6);
        g.lineTo(half + 22, half - half * 1.1);
        g.lineTo(half + 8, half - half * 0.7);
        g.endFill();
        // 冰晶甲片
        g.lineStyle(1, 0x81d4fa, 0.8);
        g.beginFill(0xb3e5fc, 0.6);
        g.drawRoundRect(half - half * 0.6, half - half * 0.1, half * 0.5, half * 0.6, 3, 3);
        g.drawRoundRect(half + half * 0.1, half - half * 0.1, half * 0.5, half * 0.6, 3, 3);
        g.endFill();
        drawEyesPair(g, half - 6, half - half * 0.38, half + 6, half - half * 0.38, 4, 2);
        // 眼睛改为冰蓝色
        g.beginFill(0x29b6f6); g.drawCircle(half - 6, half - half * 0.38 + 0.5, 2); g.endFill();
        g.beginFill(0x29b6f6); g.drawCircle(half + 6, half - half * 0.38 + 0.5, 2); g.endFill();
        // 高光
        g.lineStyle(0); g.beginFill(0xffffff, 0.5); g.drawEllipse(half - 8, half - half * 0.7, 10, 3); g.endFill();
      } else if (mType.shape === 'boss_spider') {
        // 深渊蜘蛛：圆腹 + 8条腿 + 多眼
        // 腿（8条，左右各4）
        var legAngles = [-0.3, -0.6, -0.9, -1.2];
        for (var li2 = 0; li2 < 4; li2++) {
          var la = legAngles[li2];
          g.lineStyle(2.5, ol);
          // 左腿
          g.moveTo(half - 8, half);
          g.lineTo(half - 8 - 18 * Math.cos(la), half + 18 * Math.sin(la));
          g.lineTo(half - 8 - 28 * Math.cos(la + 0.4), half + 28 * Math.sin(la + 0.4));
          // 右腿
          g.moveTo(half + 8, half);
          g.lineTo(half + 8 + 18 * Math.cos(la), half + 18 * Math.sin(la));
          g.lineTo(half + 8 + 28 * Math.cos(la + 0.4), half + 28 * Math.sin(la + 0.4));
        }
        // 腹部
        g.lineStyle(2, ol);
        g.beginFill(c); g.drawCircle(half, half + 4, half * 0.7); g.endFill();
        // 头胸
        g.beginFill(0x6a1b9a); g.drawCircle(half, half - 8, half * 0.45); g.endFill();
        // 8只眼睛（2排）
        g.lineStyle(0);
        var eyePos = [[-8,-12],[-4,-14],[4,-14],[8,-12],[-6,-9],[0,-10],[6,-9]];
        for (var ei = 0; ei < eyePos.length; ei++) {
          g.beginFill(ac); g.drawCircle(half + eyePos[ei][0], half + eyePos[ei][1], 1.8); g.endFill();
        }
        // 毒液滴
        g.beginFill(0x76ff03, 0.8); g.drawCircle(half, half + 14, 3); g.endFill();
        g.beginFill(0x76ff03, 0.5); g.drawCircle(half, half + 18, 1.5); g.endFill();
        // 高光
        g.beginFill(hi, 0.3); g.drawEllipse(half - 6, half - 2, 10, 4); g.endFill();
      } else if (mType.shape === 'boss_demon') {
        // 炎魔将军：人形 + 双角 + 火焰翅膀
        // 火焰光晕
        g.lineStyle(0);
        g.beginFill(0xff6b1a, 0.2); g.drawCircle(half, half, half + 8); g.endFill();
        // 翅膀（左右火焰）
        g.beginFill(0xff6b1a, 0.7);
        g.moveTo(half - 6, half - 4);
        g.lineTo(half - half * 1.1, half - half * 0.8);
        g.lineTo(half - half * 0.8, half + half * 0.3);
        g.lineTo(half - 4, half + 4);
        g.endFill();
        g.beginFill(0xff6b1a, 0.7);
        g.moveTo(half + 6, half - 4);
        g.lineTo(half + half * 1.1, half - half * 0.8);
        g.lineTo(half + half * 0.8, half + half * 0.3);
        g.lineTo(half + 4, half + 4);
        g.endFill();
        // 身体
        g.lineStyle(2, ol);
        g.beginFill(c);
        g.drawRoundRect(half - 12, half - 4, 24, 28, 4, 4);
        g.endFill();
        // 头
        g.beginFill(c); g.drawCircle(half, half - 10, 14); g.endFill();
        // 双角
        g.beginFill(ol);
        g.moveTo(half - 8, half - 18); g.lineTo(half - 14, half - 32); g.lineTo(half - 4, half - 20); g.endFill();
        g.moveTo(half + 8, half - 18); g.lineTo(half + 14, half - 32); g.lineTo(half + 4, half - 20); g.endFill();
        // 眼（发光黄色）
        g.lineStyle(0);
        g.beginFill(ac); g.drawCircle(half - 5, half - 12, 3.5); g.drawCircle(half + 5, half - 12, 3.5); g.endFill();
        g.beginFill(0x000000); g.drawCircle(half - 5, half - 12, 1.5); g.drawCircle(half + 5, half - 12, 1.5); g.endFill();
        // 高光
        g.beginFill(hi, 0.35); g.drawEllipse(half - 6, half - 20, 10, 4); g.endFill();
      } else if (mType.shape === 'boss_phoenix') {
        // 星界凤凰：展翅 + 尾羽 + 星光
        // 尾羽（下方扇形）
        var tailColors = [0xff6f00, 0xffa726, 0x40c4ff, 0xffd740];
        for (var tfi = 0; tfi < 5; tfi++) {
          var tfa = -Math.PI * 0.3 + tfi * (Math.PI * 0.6 / 4);
          g.lineStyle(0);
          g.beginFill(tailColors[tfi % tailColors.length], 0.8);
          g.moveTo(half, half + 6);
          g.lineTo(half + Math.cos(tfa) * (half + 10), half + Math.sin(tfa) * (half + 10) + 6);
          g.lineTo(half + Math.cos(tfa + 0.12) * (half + 10), half + Math.sin(tfa + 0.12) * (half + 10) + 6);
          g.endFill();
        }
        // 翅膀
        g.lineStyle(1.5, 0xff8f00);
        g.beginFill(c, 0.9);
        g.moveTo(half - 4, half - 4);
        g.lineTo(half - half * 1.15, half - half * 0.6);
        g.curveTo(half - half * 0.9, half + half * 0.2, half - 4, half + 4);
        g.endFill();
        g.beginFill(c, 0.9);
        g.moveTo(half + 4, half - 4);
        g.lineTo(half + half * 1.15, half - half * 0.6);
        g.curveTo(half + half * 0.9, half + half * 0.2, half + 4, half + 4);
        g.endFill();
        // 翅膀高光
        g.lineStyle(0); g.beginFill(hi, 0.5);
        g.moveTo(half - 4, half - 4); g.lineTo(half - half * 0.9, half - half * 0.5);
        g.curveTo(half - half * 0.7, half - half * 0.1, half - 4, half); g.endFill();
        // 身体
        g.lineStyle(2, 0xff8f00);
        g.beginFill(hi); g.drawCircle(half, half - 4, half * 0.38); g.endFill();
        // 冠羽
        g.lineStyle(0);
        g.beginFill(ac); g.moveTo(half, half - half * 0.7); g.lineTo(half - 4, half - half * 0.42); g.lineTo(half + 4, half - half * 0.42); g.endFill();
        g.beginFill(0x40c4ff); g.moveTo(half - 5, half - half * 0.65); g.lineTo(half - 8, half - half * 0.38); g.lineTo(half - 2, half - half * 0.38); g.endFill();
        g.beginFill(0x40c4ff); g.moveTo(half + 5, half - half * 0.65); g.lineTo(half + 8, half - half * 0.38); g.lineTo(half + 2, half - half * 0.38); g.endFill();
        // 眼
        g.beginFill(ac); g.drawCircle(half - 4, half - 6, 3); g.drawCircle(half + 4, half - 6, 3); g.endFill();
        g.beginFill(0x000000); g.drawCircle(half - 4, half - 6, 1.2); g.drawCircle(half + 4, half - 6, 1.2); g.endFill();
        // 星光粒子
        g.beginFill(0xffffff, 0.9);
        this.drawStar(g, half - half * 0.85, half - half * 0.5, 2.5, 1, 5);
        this.drawStar(g, half + half * 0.85, half - half * 0.5, 2, 1, 5);
        this.drawStar(g, half, half - half * 0.85, 2, 1, 5);
        g.endFill();
      } else {
        // 通用 fallback
        g.lineStyle(2, ol);
        g.beginFill(c); g.drawCircle(half, half, half - 2); g.endFill();
        drawEyesPair(g, half - 6, half - 4, half + 6, half - 4, 3, 1.5);
      }
  } // end switch
}; // end drawMonsterShape

/**
 * 统一绘制一对眼睛（白底 + 黑瞳 + 高光）。
 */
Game.prototype._drawEyes = function(g, x1, y1, x2, y2, r, pr) {
  drawEyesPair(g, x1, y1, x2, y2, r, pr);
};

Game.prototype.updateSkillBtns = function() {
  for (var i = 0; i < this.skillBtns.length; i++) {
    var btn = this.skillBtns[i];
    if (!btn) continue;
    var s = SKILLS[i];
    var unlocked = this.mainLevel >= s.lv;
    var cd = this.skillCD[i] > 0;
    var slot = btn.getChildByName('slot');
    var bg = btn.getChildByName('bg');
    var halo = btn.getChildByName('halo');
    var border = btn.getChildByName('border');
    var lb = btn.getChildByName('lb');
    var cdLb = btn.getChildByName('cdLb');
    var icon = btn.getChildByName('iconShape');
    var iconImage = btn.getChildByName('iconImage');
    if (slot) {
      slot.fillColor = unlocked ? 0x120b2a : 0x0c1024;
      slot.strokeColor = unlocked ? THEME.strokeGold : 0x4a4566;
      slot.strokeAlpha = unlocked ? 0.58 : 0.38;
    }
    if (bg) bg.fillColor = cd ? 0x2a2440 : (unlocked ? s.color : 0x4a4566);
    if (halo) {
      halo.fillColor = unlocked ? s.color : 0x3a355a;
      halo.fillAlpha = cd ? 0.1 : 0.22;
    }
    if (border) border.strokeColor = cd ? 0x6a628f : (unlocked ? THEME.accentSoft : 0x6a628f);
    if (lb) {
      var skillLv = this.skillLevels && this.skillLevels[i] ? this.skillLevels[i] : 1;
      lb.text = unlocked ? (s.name + ' Lv.' + skillLv) : 'Lv' + s.lv;
      lb.textColor = cd ? THEME.textMute : (unlocked ? THEME.accentSoft : THEME.textMute);
    }
    if (cdLb) {
      if (cd) { cdLb.text = Math.ceil(this.skillCD[i]) + ''; cdLb.visible = true; }
      else { cdLb.visible = false; }
    }
    if (icon) icon.visible = !cd;
    if (iconImage) {
      iconImage.visible = !cd;
      iconImage.alpha = unlocked ? 1 : 0.42;
    }
  }
};

// ==================== 面板系统 ====================

Game.prototype.createPanelOverlay = function(options) {
  options = options || {};
  if (this._panelAutoCloseTimer) {
    clearInterval(this._panelAutoCloseTimer);
    this._panelAutoCloseTimer = null;
  }
  if (this._panelOverlay && this._panelOverlay.parent) {
    this._panelOverlay.parent.removeChild(this._panelOverlay);
  }
  this._activePanel = null;
  var overlay = new eui.Group();
  // 铺满整个舞台（包括动态调整后的尺寸），避免旋转 / 地址栏伸缩后出现裸露区域
  if (this.main.stage) {
    overlay.width = this.main.stage.stageWidth;
    overlay.height = this.main.stage.stageHeight;
  } else {
    overlay.width = 375;
    overlay.height = 667;
  }
  overlay.x = 0; overlay.y = 0;
  overlay.touchEnabled = true;
  var dim = new eui.Rect();
  dim.percentWidth = 100; dim.percentHeight = 100;
  var isWxLayout = typeof window !== 'undefined' && !!window.DMAX_WX_SAFE_AREA;
  dim.fillColor = options.dimColor !== undefined ? options.dimColor : 0x070416;
  dim.fillAlpha = options.dimAlpha !== undefined ? options.dimAlpha : (isWxLayout ? 0.42 : 0.58);
  overlay.addChild(dim);
  overlay._dim = dim;
  this._panelOverlay = overlay;
  // 加到 stage 上，不受布局影响
  if (this.main.stage) {
    this.main.stage.addChild(overlay);
  } else {
    this.main.addChild(overlay);
  }
  return overlay;
};

Game.prototype.closePanel = function() {
  if (this._panelAutoCloseTimer) {
    clearInterval(this._panelAutoCloseTimer);
    this._panelAutoCloseTimer = null;
  }
  if (this._panelOverlay && this._panelOverlay.parent) {
    this._panelOverlay.parent.removeChild(this._panelOverlay);
  }
  this._panelOverlay = null;
  this._activePanel = null;
  this._upgradeScroller = null;
};

// 舞台尺寸变化时同步内部缓存 + 已开面板的覆盖层尺寸
Game.prototype.onStageResize = function() {
  var stage = this.main && this.main.stage;
  if (!stage) return;
  this._stageW = stage.stageWidth;
  // 仅更新当前活跃的全屏遮罩尺寸，避免 UI 主体因状态问题全量重建
  if (this._panelOverlay) {
    this._panelOverlay.width = stage.stageWidth;
    this._panelOverlay.height = stage.stageHeight;
  }
  if (this._activePanel) {
    var safeTop = Math.max(0, this._safeTop || 0);
    var safeBottom = Math.max(0, this._safeBottom || 0);
    this._activePanel.width = stage.stageWidth;
    this._activePanel.height = Math.max(480, stage.stageHeight - safeTop - safeBottom);
    this._activePanel.y = safeTop;
    this._activePanel._contentW = this._activePanel.width - 32;
  }
};

Game.prototype.addPanelContent = function(overlay, options) {
  options = options || {};
  var panel = new eui.Group();
  var stageW = overlay.width || 375;
  var stageH = overlay.height || 667;
  var safeTop = Math.max(0, this._safeTop || 0);
  var safeBottom = Math.max(0, this._safeBottom || 0);
  panel.width = stageW;
  panel.height = Math.max(480, stageH - safeTop - safeBottom);
  panel.x = 0; panel.y = safeTop;
  panel._contentX = 16;
  panel._contentW = panel.width - 32;
  panel._pageMode = true;
  panel._pageHeight = panel.height;
  panel._headerH = 50;

  var panelBg = new eui.Rect();
  panelBg.percentWidth = 100; panelBg.percentHeight = 100;
  panelBg.fillColor = 0x100a2a; panelBg.ellipseWidth = 0; panelBg.ellipseHeight = 0;
  panelBg.strokeColor = THEME.strokeGold; panelBg.strokeWeight = 0; panelBg.strokeAlpha = 0;
  panel.addChild(panelBg);

  var innerStroke = new eui.Rect();
  innerStroke.width = panel.width - 12; innerStroke.height = panel.height - 12;
  innerStroke.x = 6; innerStroke.y = 6;
  innerStroke.ellipseWidth = 0; innerStroke.ellipseHeight = 0;
  innerStroke.fillAlpha = 0;
  innerStroke.strokeColor = THEME.strokeGold; innerStroke.strokeWeight = 0.8; innerStroke.strokeAlpha = 0.18;
  panel.addChild(innerStroke);

  var headerBg = new eui.Rect();
  headerBg.percentWidth = 100; headerBg.height = panel._headerH;
  headerBg.fillColor = 0x17103a; headerBg.fillAlpha = 0.98;
  headerBg.ellipseWidth = 0; headerBg.ellipseHeight = 0;
  panel.addChild(headerBg);

  var headerMask = new eui.Rect();
  headerMask.percentWidth = 100; headerMask.height = 1;
  headerMask.y = panel._headerH - 1; headerMask.fillColor = THEME.strokeGold; headerMask.fillAlpha = 0.38;
  panel.addChild(headerMask);

  var topGlow = new eui.Rect();
  topGlow.percentWidth = 100; topGlow.height = 3;
  topGlow.top = 0; topGlow.fillColor = THEME.accent; topGlow.fillAlpha = 0.55;
  panel.addChild(topGlow);
  overlay.addChild(panel);
  this._activePanel = panel;

  var closeBtnGroup = new eui.Group();
  closeBtnGroup.width = 84; closeBtnGroup.height = 34;
  closeBtnGroup.x = 12; closeBtnGroup.top = 8;
  closeBtnGroup.touchEnabled = true;
  var closeGlow = new eui.Rect();
  closeGlow.width = 84; closeGlow.height = 34;
  closeGlow.ellipseWidth = 14; closeGlow.ellipseHeight = 14;
  closeGlow.fillColor = 0xfbbf24; closeGlow.fillAlpha = 0.08;
  closeBtnGroup.addChild(closeGlow);
  var closeBtnBg = new eui.Rect();
  closeBtnBg.width = 84; closeBtnBg.height = 34;
  closeBtnBg.ellipseWidth = 14; closeBtnBg.ellipseHeight = 14;
  closeBtnBg.fillColor = 0x0b0820;
  closeBtnBg.strokeColor = THEME.strokeGold; closeBtnBg.strokeWeight = 1.2; closeBtnBg.strokeAlpha = 0.86;
  closeBtnGroup.addChild(closeBtnBg);
  var closeIconBg = new eui.Rect();
  closeIconBg.width = 24; closeIconBg.height = 24;
  closeIconBg.x = 6; closeIconBg.y = 5;
  closeIconBg.ellipseWidth = 12; closeIconBg.ellipseHeight = 12;
  closeIconBg.fillColor = 0x24183f; closeIconBg.strokeColor = THEME.accentSoft;
  closeIconBg.strokeWeight = 0.8; closeIconBg.strokeAlpha = 0.7;
  closeBtnGroup.addChild(closeIconBg);
  var closeArrow = new eui.Label();
  closeArrow.text = '‹'; closeArrow.size = 24; closeArrow.textColor = THEME.textGold; closeArrow.bold = true;
  closeArrow.width = 24; closeArrow.height = 24;
  closeArrow.x = 6; closeArrow.y = 3;
  closeArrow.textAlign = 'center'; closeArrow.verticalAlign = 'middle';
  closeBtnGroup.addChild(closeArrow);
  var closeBtn = new eui.Label();
  closeBtn.text = options.backText || '返回'; closeBtn.size = 13; closeBtn.textColor = THEME.accentSoft; closeBtn.bold = true;
  closeBtn.width = 48; closeBtn.height = 32;
  closeBtn.x = 31; closeBtn.y = 1;
  closeBtn.textAlign = 'center'; closeBtn.verticalAlign = 'middle';
  closeBtn.touchEnabled = false;
  closeBtnGroup.addChild(closeBtn);
  var self = this;
  var backHandler = options.onBack || function() { self.closePanel(); };
  closeBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
    self.sfxClick();
    backHandler.call(self);
  }, this);
  panel.addChild(closeBtnGroup);

  return panel;
};

Game.prototype.setPanelContentHeight = function(panel, height) {
  if (!panel) return;
  panel._contentDesiredHeight = height;
};

Game.prototype.addPageMetricCard = function(parent, x, y, w, h, title, value, color) {
  var bg = new eui.Rect();
  bg.width = w; bg.height = h;
  bg.ellipseWidth = 8; bg.ellipseHeight = 8;
  bg.fillColor = 0x151038; bg.fillAlpha = 0.96;
  bg.strokeColor = color || THEME.strokeGold; bg.strokeWeight = 1; bg.strokeAlpha = 0.5;
  bg.x = x; bg.y = y;
  parent.addChild(bg);

  var titleLb = new eui.Label();
  titleLb.text = title; titleLb.size = 9; titleLb.textColor = THEME.textDim;
  titleLb.x = x + 8; titleLb.y = y + 7; titleLb.width = w - 16; titleLb.height = 12;
  parent.addChild(titleLb);

  var valueLb = new eui.Label();
  valueLb.text = value; valueLb.size = 12; valueLb.bold = true; valueLb.textColor = color || THEME.textMain;
  valueLb.x = x + 8; valueLb.y = y + 23; valueLb.width = w - 16; valueLb.height = 16;
  valueLb.wordWrap = true;
  parent.addChild(valueLb);
  bg._titleLabel = titleLb;
  bg._valueLabel = valueLb;
  return bg;
};

Game.prototype.addPanelRow = function(panel, y, iconText, iconColor, infoText, btnText, btnColor, handler, disabled) {
  var lines = infoText.split('\n');
  var rowH = Math.max(48, lines.length > 1 ? 60 : 48);
  var rowX = panel._contentX !== undefined ? panel._contentX : 16;
  var rowW = panel._contentW !== undefined ? panel._contentW : (panel.width - rowX * 2);
  var rowBg = new eui.Rect();
  rowBg.width = rowW; rowBg.height = rowH; rowBg.fillColor = THEME.bgRow;
  rowBg.ellipseWidth = 10; rowBg.ellipseHeight = 10;
  rowBg.strokeColor = THEME.strokeSoft; rowBg.strokeWeight = 1; rowBg.strokeAlpha = 0.46;
  rowBg.x = rowX; rowBg.y = y;
  panel.addChild(rowBg);

  var iconBg = new eui.Rect();
  iconBg.width = 34; iconBg.height = 34; iconBg.ellipseWidth = 17; iconBg.ellipseHeight = 17;
  iconBg.fillColor = iconColor;
  iconBg.strokeColor = THEME.accentSoft; iconBg.strokeWeight = 1; iconBg.strokeAlpha = 0.7;
  iconBg.x = rowX + 8; iconBg.y = y + (rowH - 34) / 2;
  panel.addChild(iconBg);

  var iconLb = new eui.Label();
  iconLb.text = iconText; iconLb.size = iconText.length > 2 ? 9 : 11; iconLb.textColor = THEME.textMain; iconLb.bold = true;
  iconLb.width = 34; iconLb.height = 34;
  iconLb.x = iconBg.x; iconLb.y = iconBg.y;
  iconLb.textAlign = 'center'; iconLb.verticalAlign = 'middle';
  panel.addChild(iconLb);

  var infoLb = new eui.Label();
  infoLb.text = infoText; infoLb.size = 11; infoLb.textColor = THEME.textMain;
  infoLb.x = rowX + 52; infoLb.y = y + 7;
  infoLb.width = btnText ? rowW - 132 : rowW - 62;
  infoLb.lineSpacing = 4;
  infoLb.wordWrap = true;
  panel.addChild(infoLb);

  if (btnText) {
    var btnW = btnText.length > 5 ? 78 : 68;
    var btn = this.createButton(btnText, btnColor || THEME.accent, btnW, 28, handler, this);
    btn.x = rowX + rowW - btnW - 8; btn.y = y + (rowH - 28) / 2;
    if (disabled) {
      btn.alpha = 0.4;
      btn.touchEnabled = false;
      btn.touchChildren = false;
    }
    panel.addChild(btn);
  }

  return y + rowH + 6;
};

Game.prototype.createPanelScrollContent = function(panel, top, bottom) {
  var scroller = new eui.Scroller();
  scroller.x = panel._contentX !== undefined ? panel._contentX : 16;
  scroller.y = top;
  scroller.width = panel._contentW !== undefined ? panel._contentW : (panel.width - 32);
  scroller.height = Math.max(80, panel.height - top - (bottom || 14));
  scroller.scrollPolicyH = eui.ScrollPolicy ? eui.ScrollPolicy.OFF : 'off';
  scroller.scrollPolicyV = eui.ScrollPolicy ? eui.ScrollPolicy.AUTO : 'auto';
  scroller.bounces = false;
  var content = new eui.Group();
  content.width = scroller.width;
  content.scrollH = 0;
  scroller.viewport = content;
  scroller.addEventListener(egret.Event.CHANGE, function() {
    if (content.scrollH !== 0) content.scrollH = 0;
  }, this);
  panel.addChild(scroller);
  content._scroller = scroller;
  return content;
};

Game.prototype.addUpgradeCard = function(parent, x, y, w, iconText, iconColor, titleText, metaText, btnText, btnColor, handler, disabled, iconAsset) {
  var h = 96;
  var bg = new eui.Rect();
  bg.width = w; bg.height = h; bg.fillColor = THEME.bgRow;
  bg.strokeColor = THEME.strokeSoft; bg.strokeWeight = 1; bg.strokeAlpha = 0.7;
  bg.ellipseWidth = 10; bg.ellipseHeight = 10;
  bg.x = x; bg.y = y;
  parent.addChild(bg);

  var iconBg = new eui.Rect();
  iconBg.width = 48; iconBg.height = 48; iconBg.fillColor = iconColor;
  iconBg.strokeColor = THEME.accentSoft; iconBg.strokeWeight = 1; iconBg.strokeAlpha = 0.65;
  iconBg.ellipseWidth = 12; iconBg.ellipseHeight = 12;
  iconBg.x = x + 10; iconBg.y = y + 14;
  parent.addChild(iconBg);

  if (iconAsset) {
    var iconImg = new eui.Image();
    this.fitImageToBox(iconImg, iconAsset, 44, 44, iconBg.x + 2, iconBg.y + 2);
    parent.addChild(iconImg);
  } else {
    var iconLb = new eui.Label();
    iconLb.text = iconText; iconLb.size = iconText.length > 2 ? 10 : 13;
    iconLb.textColor = THEME.textMain; iconLb.bold = true;
    iconLb.width = 48; iconLb.height = 48; iconLb.x = iconBg.x; iconLb.y = iconBg.y;
    iconLb.textAlign = 'center'; iconLb.verticalAlign = 'middle';
    parent.addChild(iconLb);
  }

  var titleLb = new eui.Label();
  titleLb.text = titleText; titleLb.size = 13; titleLb.textColor = THEME.textMain; titleLb.bold = true;
  titleLb.x = x + 70; titleLb.y = y + 12; titleLb.width = w - 150;
  parent.addChild(titleLb);

  var metaLb = new eui.Label();
  metaLb.text = metaText; metaLb.size = 10; metaLb.textColor = THEME.textDim;
  metaLb.x = x + 70; metaLb.y = y + 34; metaLb.width = w - 150;
  metaLb.lineSpacing = 4; metaLb.wordWrap = true;
  parent.addChild(metaLb);

  if (btnText) {
    var btn = this.createButton(btnText, btnColor || THEME.accent, 78, 30, handler, this);
    btn.x = x + w - 90; btn.y = y + 34;
    if (disabled) {
      btn.alpha = 0.4;
      btn.touchEnabled = false;
      btn.touchChildren = false;
    }
    parent.addChild(btn);
  }

  return h;
};

Game.prototype.captureUpgradeScroll = function() {
  if (this._upgradeScroller && this._upgradeScroller.viewport) {
    this._upgradeScrollV = this._upgradeScroller.viewport.scrollV || 0;
  }
};

Game.prototype.refreshUpgradePanel = function(tabName) {
  this.captureUpgradeScroll();
  this.closePanel();
  this.openUpgrade(tabName || this.upgradePanelTab);
};

Game.prototype.getAffordableMainLevels = function(limit) {
  var gold = this.gold;
  var level = this.mainLevel;
  var count = 0;
  while (count < limit) {
    var cost = CONFIG.upgradeCost(level);
    if (gold < cost) break;
    gold -= cost;
    level++;
    count++;
  }
  return count;
};

Game.prototype.upgradeMainBatch = function(limit) {
  limit = Math.max(1, Math.floor(limit || 1));
  var bought = 0;
  while (bought < limit) {
    var cost = CONFIG.upgradeCost(this.mainLevel);
    if (this.gold < cost) break;
    this.gold -= cost;
    this.mainLevel++;
    bought++;
    this.notifyLevelMail();
  }
  if (bought <= 0) { this.showToast('金币不足！'); return; }
  this.playerHp = Math.min(this.getMaxPlayerHp(), this.playerHp + Math.floor(this.getMaxPlayerHp() * Math.min(0.8, 0.18 + bought * 0.04)));
  this.sfxLevelUp();
  this.showToast('⬆️ 主角连升' + bought + '级！当前Lv.' + this.mainLevel);
  this.checkLevelUpSkills();
  this.checkAchievements();
  this.saveGame();
  this.updateUI();
  this.refreshUpgradePanel('skills');
};

// ==================== 升级面板 ====================

Game.prototype.openUpgrade = function(tabName) {
  if (tabName) this.upgradePanelTab = tabName;
  if (!this.upgradePanelTab) this.upgradePanelTab = 'skills';
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  var restoreScroll = this._upgradeScrollV || 0;

  var title = new eui.Label();
  title.text = '⬆️ 升级'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var self = this;
  var bossInfo = this.getBossPowerInfo(this.getNextBossWave());
  var mainCost = CONFIG.upgradeCost(this.mainLevel);
  var mainNextDmg = CONFIG.mainDmg(this.mainLevel + 1, this.rebirthGems);
  var batch10 = this.getAffordableMainLevels(10);
  var batch100 = this.getAffordableMainLevels(100);

  var heroY = 58;
  var heroH = 106;
  var heroBg = new eui.Rect();
  heroBg.width = panel._contentW; heroBg.height = heroH;
  heroBg.x = panel._contentX; heroBg.y = heroY;
  heroBg.ellipseWidth = 12; heroBg.ellipseHeight = 12;
  heroBg.fillColor = 0x151038; heroBg.fillAlpha = 0.98;
  heroBg.strokeColor = THEME.strokeGold; heroBg.strokeWeight = 1; heroBg.strokeAlpha = 0.45;
  panel.addChild(heroBg);

  var heroIconBg = new eui.Rect();
  heroIconBg.width = 58; heroIconBg.height = 58;
  heroIconBg.x = panel._contentX + 10; heroIconBg.y = heroY + 12;
  heroIconBg.ellipseWidth = 12; heroIconBg.ellipseHeight = 12;
  heroIconBg.fillColor = 0x21164d;
  heroIconBg.strokeColor = THEME.accentSoft; heroIconBg.strokeWeight = 1; heroIconBg.strokeAlpha = 0.75;
  panel.addChild(heroIconBg);
  var heroIcon = new eui.Image();
  this.fitImageToBox(heroIcon, UPGRADE_ICON_ASSETS.hero, 54, 54, heroIconBg.x + 2, heroIconBg.y + 2);
  panel.addChild(heroIcon);

  var archiveBtn = this.createButton('  档案', 0x30245f, 58, 24, function() {
    self.openLeaderboard({ returnTo: 'upgrade', tab: self.upgradePanelTab || 'skills' });
  }, this);
  archiveBtn.x = panel._contentX + 10; archiveBtn.y = heroY + 76;
  panel.addChild(archiveBtn);
  var archiveIcon = new eui.Image();
  this.fitImageToBox(archiveIcon, UPGRADE_ICON_ASSETS.archive, 15, 15, archiveBtn.x + 6, archiveBtn.y + 4);
  panel.addChild(archiveIcon);

  var heroTitle = new eui.Label();
  heroTitle.text = '主角 Lv.' + this.mainLevel;
  heroTitle.size = 14; heroTitle.bold = true; heroTitle.textColor = 0xffffff;
  heroTitle.x = panel._contentX + 78; heroTitle.y = heroY + 12; heroTitle.width = panel._contentW - 236;
  panel.addChild(heroTitle);

  var heroStats = new eui.Label();
  heroStats.text = '战力 ' + this.fmt(bossInfo.current) + '  金币 ' + this.fmt(this.gold) + '\n' +
    '伤害 ' + this.fmt(CONFIG.mainDmg(this.mainLevel, this.rebirthGems)) + '  下级 +' + this.fmt(mainNextDmg - CONFIG.mainDmg(this.mainLevel, this.rebirthGems)) + '\n' +
    '生命 ' + this.fmt(this.getMaxPlayerHp()) + '  防御 ' + this.getPlayerDefense() + '  💎' + this.rebirthGems;
  heroStats.size = 10; heroStats.textColor = THEME.textDim;
  heroStats.x = panel._contentX + 78; heroStats.y = heroY + 34; heroStats.width = panel._contentW - 236;
  heroStats.lineSpacing = 4;
  panel.addChild(heroStats);

  var costIcon = new eui.Image();
  this.fitImageToBox(costIcon, UPGRADE_ICON_ASSETS.gold, 24, 24, panel._contentX + panel._contentW - 156, heroY + 10);
  panel.addChild(costIcon);
  var costText = new eui.Label();
  costText.text = this.fmt(mainCost) + ' 金';
  costText.size = 11; costText.bold = true; costText.textColor = this.gold >= mainCost ? THEME.textGold : THEME.danger;
  costText.x = panel._contentX + panel._contentW - 128; costText.y = heroY + 16; costText.width = 118;
  costText.textAlign = 'right';
  panel.addChild(costText);

  function setUpgradeButtonDisabled(btn, disabled) {
    if (!disabled) return;
    btn.alpha = 0.42;
    btn.touchEnabled = false;
    btn.touchChildren = false;
  }

  var btnY = heroY + 58;
  var btnX = panel._contentX + panel._contentW - 158;
  var up1 = this.createButton('升1', this.gold >= mainCost ? 0x27ae60 : 0x555555, 48, 30, function() { self.upgradeMain(); }, this);
  up1.x = btnX; up1.y = btnY;
  setUpgradeButtonDisabled(up1, this.gold < mainCost);
  panel.addChild(up1);
  var up10 = this.createButton('+10', batch10 >= 10 ? 0x2d8f62 : 0x555555, 48, 30, function() { self.upgradeMainBatch(10); }, this);
  up10.x = btnX + 54; up10.y = btnY;
  setUpgradeButtonDisabled(up10, batch10 < 10);
  panel.addChild(up10);
  var up100 = this.createButton('+100', batch100 >= 100 ? 0xd99022 : 0x555555, 56, 30, function() { self.upgradeMainBatch(100); }, this);
  up100.x = btnX + 108; up100.y = btnY;
  setUpgradeButtonDisabled(up100, batch100 < 100);
  panel.addChild(up100);

  var y = heroY + heroH + 12;

  var tabW = Math.floor((panel._contentW - 16) / 3);
  var skillsTab = this.createButton('技能强化', this.upgradePanelTab === 'skills' ? 0x3498db : 0x30245f, tabW, 30, function() {
    self._upgradeScrollV = 0;
    self.closePanel();
    self.openUpgrade('skills');
  }, this);
  skillsTab.x = panel._contentX; skillsTab.y = y;
  panel.addChild(skillsTab);
  var supportTab = this.createButton('辅助英雄', this.upgradePanelTab === 'supports' ? 0x9b59b6 : 0x30245f, tabW, 30, function() {
    self._upgradeScrollV = 0;
    self.closePanel();
    self.openUpgrade('supports');
  }, this);
  supportTab.x = panel._contentX + tabW + 8; supportTab.y = y;
  panel.addChild(supportTab);
  var equipTab = this.createButton('装备锻造', this.upgradePanelTab === 'equipment' ? 0xe67e22 : 0x30245f, tabW, 30, function() {
    self._upgradeScrollV = 0;
    self.closePanel();
    self.openUpgrade('equipment');
  }, this);
  equipTab.x = panel._contentX + (tabW + 8) * 2; equipTab.y = y;
  panel.addChild(equipTab);
  y += 40;

  var contentList = this.createPanelScrollContent(panel, y, 14);
  this._upgradeScroller = contentList._scroller;
  contentList._contentX = 0;
  contentList._contentW = panel._contentW;
  var rowY = 0;
  var cardGap = 10;
  var cardW = contentList._contentW;
  var cardH = 96;
  var cardCount = 0;
  var listIntro = new eui.Label();
  listIntro.text = this.upgradePanelTab === 'skills' ? '技能强化影响爆发、控制和BOSS击杀节奏。' :
    (this.upgradePanelTab === 'supports' ? '辅助英雄提供持续输出、治疗和护盾，未招募前不会参战。' :
    '装备锻造消耗锻造石，提供稳定的永久战斗属性。');
  listIntro.size = 11; listIntro.textColor = THEME.textDim;
  listIntro.x = 2; listIntro.y = 0; listIntro.width = contentList._contentW;
  listIntro.wordWrap = true;
  contentList.addChild(listIntro);
  var listStartY = 30;
  function placeCard() {
    var row = cardCount++;
    return { x: 0, y: listStartY + row * (cardH + cardGap) };
  }
  if (this.upgradePanelTab === 'skills') {
    var unlockedCount = 0;
    for (var sk = 0; sk < SKILLS.length; sk++) {
      var skill = SKILLS[sk];
      var unlocked = this.skillUnlocked[sk];
      var skillLv = this.skillLevels && this.skillLevels[sk] ? this.skillLevels[sk] : 1;
      if (!unlocked) {
        var lockedPos = placeCard();
        this.addUpgradeCard(contentList, lockedPos.x, lockedPos.y, cardW, 'Lv' + skill.lv, 0x4a4566,
          skill.name, '未解锁\n主角Lv.' + skill.lv + '后开放',
          '', 0x555555,
          function() {},
          true,
          UPGRADE_ICON_ASSETS.skill
        );
        break;
      }
      unlockedCount++;
      var skillCost = CONFIG.skillCost(skillLv, sk);
      var curMul = this.getSkillPowerMultiplier(sk);
      var nextMul = 1 + skillLv * 0.14;
      var curCd = this.getSkillCooldown(skill);
      var oldSkillLv = this.skillLevels[sk];
      this.skillLevels[sk] = skillLv + 1;
      var nextCd = this.getSkillCooldown(skill);
      this.skillLevels[sk] = oldSkillLv;
      (function(si, sd, lv, c, cm, nm, cd, ncd) {
        var pos = placeCard();
        self.addUpgradeCard(contentList, pos.x, pos.y, cardW, sd.name.slice(0,2), sd.color,
          sd.name + ' Lv.' + lv,
          self.getDamageTypeName(sd.type) + ' ×' + cm.toFixed(2) + ' / ' + cd + 's\n下级 ×' + nm.toFixed(2) + ' / ' + ncd + 's',
          self.fmt(c) + '金', 0x27ae60,
          function() { self.upgradeSkill(si); },
          self.gold < c,
          SKILL_ICON_ASSETS[si] || UPGRADE_ICON_ASSETS.skill
        );
      })(sk, skill, skillLv, skillCost, curMul, nextMul, curCd, nextCd);
    }
    if (unlockedCount >= SKILLS.length) {
      var allSkill = new eui.Label();
      allSkill.text = '所有技能已解锁，可继续强化已开放技能。';
      allSkill.size = 11; allSkill.textColor = THEME.textDim;
      allSkill.x = 2; allSkill.y = listStartY + cardCount * (cardH + cardGap) + 4; allSkill.width = contentList._contentW;
      contentList.addChild(allSkill);
      rowY = allSkill.y + 28;
    }
  } else if (this.upgradePanelTab === 'supports') {
    for (var i = 0; i < this.supports.length; i++) {
      var s = this.supports[i];
      if (!this.isSupportActive(i)) {
        if (this.isSupportAvailable(i)) {
          var recruitPrice = this.getSupportRecruitPrice(i);
          (function(si, sup, price) {
            var pos = placeCard();
            self.addUpgradeCard(contentList, pos.x, pos.y, cardW, sup.name.slice(0,2), 0x7a4a1d,
              sup.name + ' 可招募',
              self.getSupportRoleText(si, sup),
              price.label, price.color,
              function() { self.recruitSupport(si); },
              !price.enough,
              UPGRADE_ICON_ASSETS.support
            );
          })(i, s, recruitPrice);
        } else {
          var nextPos = placeCard();
          this.addUpgradeCard(contentList, nextPos.x, nextPos.y, cardW, '?', 0x4a4566,
            '神秘队友 ' + (i + 1) + '/8',
            '主角Lv.' + SUPPORTS_DEF[i].recruitLv + '后发现',
            '', 0x555555,
            function() {},
            true,
            UPGRADE_ICON_ASSETS.support
          );
        }
        continue;
      }
      var cost = CONFIG.supportCost(s.level);
      var nextDps = s.dps * (s.level + 1);
      var curDps = s.dps * s.level;
      (function(si, sup, c, n, cur) {
        var pos = placeCard();
        var roleText = si === 1 ? ('治疗 Lv.' + sup.level + '\n生命续航提升') : (si === 3 ? ('护盾 Lv.' + sup.level + '\n守护时间提升') : ('DPS ' + self.fmt(cur) + '\n下级 ' + self.fmt(n) + ' (+' + self.fmt(n - cur) + ')'));
        self.addUpgradeCard(contentList, pos.x, pos.y, cardW, sup.name.slice(0,2), 0x9b59b6,
          sup.name + ' Lv.' + sup.level,
          roleText,
          self.fmt(c) + '金', 0x27ae60,
          function() { self.upgradeSupport(si); },
          self.gold < c,
          UPGRADE_ICON_ASSETS.support
        );
      })(i, s, cost, nextDps, curDps);
    }
  } else {
    this.ensureEquipment();
    var stoneInfo = new eui.Label();
    stoneInfo.text = '锻造石: ' + this.fmt(this.forgeStones) + '  BOSS必掉，高波小怪低概率掉落';
    stoneInfo.size = 11; stoneInfo.textColor = THEME.textDim;
    stoneInfo.x = 2; stoneInfo.y = 20; stoneInfo.width = contentList._contentW;
    contentList.addChild(stoneInfo);
    rowY = 24;
    for (var eq = 0; eq < EQUIPMENT_DEFS.length; eq++) {
      var equip = EQUIPMENT_DEFS[eq];
      var equipLv = this.equipmentLevels[eq] || 0;
      var equipCost = this.getEquipmentCost(eq);
      var statNow = Math.floor(equipLv * equip.per * 100);
      var statNext = Math.floor((equipLv + 1) * equip.per * 100);
      (function(ei, ed, lv, cost, nowPct, nextPct) {
        var pos = placeCard();
        pos.y += rowY;
        var full = lv >= ed.max;
        self.addUpgradeCard(contentList, pos.x, pos.y, cardW, ed.icon, ed.color,
          ed.name + ' ' + lv + '/' + ed.max,
          ed.desc + ' +' + nowPct + '%\n下阶 +' + nextPct + '%',
          full ? '满阶' : (cost + '石'), 0xe67e22,
          function() { self.upgradeEquipment(ei); },
          full || self.forgeStones < cost,
          UPGRADE_ICON_ASSETS.equipment
        );
      })(eq, equip, equipLv, equipCost, statNow, statNext);
    }
    rowY += listStartY + cardCount * (cardH + cardGap);
    var coreY = rowY + 4;
    this.ensureEquipment();
    var coreBg = new eui.Rect();
    coreBg.width = contentList._contentW; coreBg.height = 68; coreBg.fillColor = this.coreWeapon.owned ? 0x2a0a18 : 0x17121f;
    coreBg.strokeColor = CORE_WEAPON_DEF.color; coreBg.strokeWeight = 1; coreBg.strokeAlpha = this.coreWeapon.owned ? 0.8 : 0.35;
    coreBg.ellipseWidth = 8; coreBg.ellipseHeight = 8; coreBg.x = 0; coreBg.y = coreY;
    contentList.addChild(coreBg);
    var coreIcon = new eui.Rect();
    coreIcon.width = 38; coreIcon.height = 38; coreIcon.fillColor = CORE_WEAPON_DEF.color;
    coreIcon.ellipseWidth = 8; coreIcon.ellipseHeight = 8; coreIcon.x = 10; coreIcon.y = coreY + 15;
    contentList.addChild(coreIcon);
    var coreIconLb = new eui.Label();
    coreIconLb.text = CORE_WEAPON_DEF.icon; coreIconLb.size = 14; coreIconLb.bold = true; coreIconLb.textColor = 0xffffff;
    coreIconLb.x = coreIcon.x; coreIconLb.y = coreIcon.y + 11; coreIconLb.width = 38; coreIconLb.textAlign = 'center';
    contentList.addChild(coreIconLb);
    var coreTitle = new eui.Label();
    coreTitle.text = '核心武器 · ' + CORE_WEAPON_DEF.name; coreTitle.size = 12; coreTitle.bold = true;
    coreTitle.textColor = this.coreWeapon.owned ? 0xffd7a3 : 0x9f8fa8;
    coreTitle.x = 58; coreTitle.y = coreY + 10; coreTitle.width = contentList._contentW - 68;
    contentList.addChild(coreTitle);
    var coreDesc = new eui.Label();
    coreDesc.text = this.getCoreWeaponText(); coreDesc.size = 9; coreDesc.textColor = THEME.textDim;
    coreDesc.x = 58; coreDesc.y = coreY + 31; coreDesc.width = contentList._contentW - 68;
    coreDesc.wordWrap = true; coreDesc.lineSpacing = 3;
    contentList.addChild(coreDesc);
    rowY = coreY + 76;
  }
  contentList.height = Math.max(rowY, listStartY + cardCount * (cardH + cardGap)) + 4;
  if (this._upgradeScroller && this._upgradeScroller.viewport && restoreScroll > 0) {
    var maxScroll = Math.max(0, contentList.height - this._upgradeScroller.height);
    this._upgradeScroller.viewport.scrollV = Math.min(restoreScroll, maxScroll);
  }
};

// ==================== 宝库 / 钻石消费入口 ====================

Game.prototype.openVault = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 430);

  var title = new eui.Label();
  title.text = '宝库'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);
  var vaultTitleIcon = new eui.Image();
  this.fitImageToBox(vaultTitleIcon, MODULE_ICON_ASSETS.vaultChest, 30, 30, Math.floor(panel.width / 2) - 54, 10);
  panel.addChild(vaultTitleIcon);

  this.ensureRelics();
  var relicOwned = 0;
  for (var rk in this.foods) {
    if (this.foods.hasOwnProperty(rk)) relicOwned += this.foods[rk] || 0;
  }
  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '当前钻石', '💎 ' + this.rebirthGems, 0xc7a7ff);
  var diamondIcon = new eui.Image();
  this.fitImageToBox(diamondIcon, UI_ASSETS.topHudDiamond, 24, 24, panel._contentX + metricW - 34, 68);
  panel.addChild(diamondIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '秘宝等级', relicOwned + ' 级', 0xe67e22);
  var relicMetricIcon = new eui.Image();
  this.fitImageToBox(relicMetricIcon, MODULE_ICON_ASSETS.vaultRelic, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 68);
  panel.addChild(relicMetricIcon);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '离线收益', this.offlineCap + ' 小时', 0x9b59b6);
  var offlineIcon = new eui.Image();
  this.fitImageToBox(offlineIcon, MODULE_ICON_ASSETS.rebirthHourglass, 24, 24, panel._contentX + metricW - 34, 120);
  panel.addChild(offlineIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '幸运券', String(this.spinTickets || 0), THEME.sky);
  var ticketMetricIcon = new eui.Image();
  this.fitImageToBox(ticketMetricIcon, MODULE_ICON_ASSETS.spinTicket, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 120);
  panel.addChild(ticketMetricIcon);

  var intro = new eui.Label();
  intro.text = '宝库统一管理钻石成长：秘宝偏永久属性，补给偏短期消耗；转生天赋强化在「转生」页，此处不重复入口。';
  intro.size = 11; intro.textColor = THEME.textDim;
  intro.x = panel._contentX; intro.y = 166; intro.width = panel._contentW;
  intro.wordWrap = true;
  panel.addChild(intro);

  var self = this;
  var y = 202;
  this.addUpgradeCard(panel, panel._contentX, y, panel._contentW, '秘宝', 0xe67e22,
    '秘宝阁',
    '永久属性成长，不会随转生重置\n适合卡BOSS时补攻击、生存或暴击路线',
    '进入', 0x27ae60,
    function() { self.closePanel(); self.openSupermarket({ returnTo: 'vault' }); },
    false,
    MODULE_ICON_ASSETS.vaultRelic
  );
  y += 106;
  this.addUpgradeCard(panel, panel._contentX, y, panel._contentW, '补给', 0x3498db,
    '钻石补给',
    '能量、离线收益、幸运券等消耗品\n承接原钻石商城，用钻石直接兑换',
    '进入', 0x3498db,
    function() { self.closePanel(); self.openShop({ returnTo: 'vault' }); },
    false,
    MODULE_ICON_ASSETS.vaultDiamondPouch
  );
  y += 106;

  var reserve = new eui.Label();
  reserve.text = '钻石来源：转生结算。天赋与秘宝共用钻石，可按路线分配。';
  reserve.size = 10; reserve.textColor = THEME.textDim;
  reserve.x = panel._contentX; reserve.y = y + 2; reserve.width = panel._contentW;
  reserve.textAlign = 'center';
  panel.addChild(reserve);
};

// ==================== 秘宝阁 ====================

Game.prototype.openSupermarket = function(options) {
  options = options || {};
  var overlay = this.createPanelOverlay();
  var self = this;
  var panel = this.addPanelContent(overlay, {
    backText: options.returnTo === 'vault' ? '宝库' : '返回',
    onBack: options.returnTo === 'vault' ? function() {
      self.openVault();
    } : null
  });

  var title = new eui.Label();
  title.text = '宝库 · 秘宝阁'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);
  var relicTitleIcon = new eui.Image();
  this.fitImageToBox(relicTitleIcon, MODULE_ICON_ASSETS.vaultRelic, 30, 30, Math.floor(panel.width / 2) - 86, 10);
  panel.addChild(relicTitleIcon);

  this.ensureRelics();
  var buffs = this.getBuffs();
  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '钻石', '💎 ' + this.rebirthGems, 0xc7a7ff);
  var relicDiamondIcon = new eui.Image();
  this.fitImageToBox(relicDiamondIcon, UI_ASSETS.topHudDiamond, 24, 24, panel._contentX + metricW - 34, 68);
  panel.addChild(relicDiamondIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '暴击率', Math.floor(buffs.critChance * 100) + '%', 0xffd36e);
  var relicCritIcon = new eui.Image();
  this.fitImageToBox(relicCritIcon, MODULE_ICON_ASSETS.vaultRelic, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 68);
  panel.addChild(relicCritIcon);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '攻击倍率', '×' + buffs.attackMult.toFixed(2), THEME.sky);
  var relicAtkIcon = new eui.Image();
  this.fitImageToBox(relicAtkIcon, MODULE_ICON_ASSETS.rebirthTalent, 24, 24, panel._contentX + metricW - 34, 120);
  panel.addChild(relicAtkIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '生存倍率', '×' + buffs.hpMult.toFixed(2), THEME.mint);
  var relicHpIcon = new eui.Image();
  this.fitImageToBox(relicHpIcon, UI_ASSETS.topHudDiamond, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 120);
  panel.addChild(relicHpIcon);

  var list = this.createPanelScrollContent(panel, 170, 14);
  list._contentX = 0;
  list._contentW = panel._contentW;
  var y = 0;
  var intro = new eui.Label();
  intro.text = '秘宝提供长期属性，不会在转生时重置。卡BOSS时优先补攻击、生存或暴击路线；转生天赋请在「转生」页升级。';
  intro.size = 11; intro.textColor = THEME.textDim;
  intro.x = 2; intro.y = y; intro.width = list._contentW; intro.wordWrap = true;
  list.addChild(intro);
  y += 34;
  for (var i = 0; i < FOODS.length; i++) {
    var f = FOODS[i];
    var count = this.foods[f.name] || 0;
    (function(fi, food, c) {
      var full = food.max !== undefined && c >= food.max;
      self.addUpgradeCard(list, 0, y, list._contentW, food.icon, 0xe67e22,
        food.name + ' Lv.' + c + '/' + food.max,
        food.desc + '\n消耗钻石：' + food.price,
        full ? '满级' : ('💎' + food.price),
        0x27ae60,
        function() { self.buyFood(fi, { returnTo: options.returnTo }); },
        full || self.rebirthGems < food.price,
        MODULE_ICON_ASSETS.vaultRelic
      );
      y += 106;
    })(i, f, count);
  }
  list.height = y + 8;
  this.setPanelContentHeight(panel, y + 16);
};

Game.prototype.buyFood = function(idx, options) {
  options = options || {};
  var f = FOODS[idx];
  this.ensureRelics();
  var cur = this.foods[f.name] || 0;
  if (f.max !== undefined && cur >= f.max) { this.showToast(f.name + '已满级'); return; }
  if (this.rebirthGems < f.price) { this.showToast('钻石不足，转生可获得钻石'); return; }
  this.rebirthGems -= f.price;
  this.foods[f.name] = (this.foods[f.name] || 0) + 1;
  this.showToast(f.icon + ' ' + f.name + '提升至Lv.' + this.foods[f.name]);
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openSupermarket({ returnTo: options.returnTo });
};

// ==================== 转盘面板 ====================

Game.prototype.resetSpinDaily = function() {
  var today = new Date().toDateString();
  if (this.spinDate !== today) {
    this.freeSpins = 3;
    this.spinDate = today;
  }
  if (this.spinTickets === undefined) this.spinTickets = 0;
  if (this.spinPity === undefined) this.spinPity = 0;
  if (this.totalSpins === undefined) this.totalSpins = 0;
  if (!this.spinHistory) this.spinHistory = [];
};

Game.prototype.getSpinGoldBase = function() {
  return Math.max(120, Math.floor(80 + this.mainLevel * 65 + this.getNextBossWave() * 18));
};

Game.prototype.getSpinPrizeText = function(prize) {
  if (!prize) return '';
  if (prize.type === 'goldScale') return this.fmt(Math.floor(this.getSpinGoldBase() * prize.value)) + '金';
  if (prize.type === 'energy') return '+' + prize.value + '能量';
  if (prize.type === 'food') return prize.value + '×1';
  if (prize.type === 'ticket') return '幸运券×' + prize.value;
  return prize.text;
};

Game.prototype.getSpinPrizeIconAsset = function(prize) {
  if (!prize) return MODULE_ICON_ASSETS.spinGift;
  if (prize.rare || prize.rarity === '大奖') return MODULE_ICON_ASSETS.spinJackpot;
  if (prize.type === 'ticket') return MODULE_ICON_ASSETS.spinTicket;
  if (prize.type === 'energy') return MODULE_ICON_ASSETS.vaultEnergyPotion;
  if (prize.type === 'food') return MODULE_ICON_ASSETS.vaultRelic;
  if (prize.type === 'goldScale') return MODULE_ICON_ASSETS.vaultDiamondPouch;
  return MODULE_ICON_ASSETS.spinGift;
};

Game.prototype.pickSpinPrize = function() {
  var forceRare = (this.spinPity || 0) >= SPIN_PITY_LIMIT - 1;
  var pool = forceRare ? SPIN_PRIZES.filter(function(p) { return p.rare || p.rarity === '稀有' || p.rarity === '大奖'; }) : SPIN_PRIZES;
  var totalWeight = 0;
  for (var i = 0; i < pool.length; i++) totalWeight += pool[i].weight;
  var r = Math.random() * totalWeight;
  for (var j = 0; j < pool.length; j++) {
    r -= pool[j].weight;
    if (r <= 0) return pool[j];
  }
  return pool[0];
};

Game.prototype.grantSpinPrize = function(prize) {
  var text = this.getSpinPrizeText(prize);
  if (prize.type === 'goldScale') {
    var gold = Math.floor(this.getSpinGoldBase() * prize.value);
    this.gold += gold;
    if (this.gold > this.stats.totalGold) this.stats.totalGold = this.gold;
  } else if (prize.type === 'food') {
    if (!this.addRelic(prize.value, 1)) {
      this.spinTickets = (this.spinTickets || 0) + 1;
      text = prize.value + '已满，转为幸运券×1';
    }
  } else if (prize.type === 'energy') {
    this.energy = Math.min(this.getMaxEnergy(), this.energy + prize.value);
  } else if (prize.type === 'ticket') {
    this.spinTickets = (this.spinTickets || 0) + prize.value;
  }
  this.totalSpins = (this.totalSpins || 0) + 1;
  this.spinPity = prize.rare || prize.rarity === '大奖' ? 0 : (this.spinPity || 0) + 1;
  this.lastSpinPrize = prize.text + ' · ' + text;
  this.pushSpinHistory(prize, text);
  return text;
};

Game.prototype.formatSpinHistoryTime = function(date) {
  var h = date.getHours();
  var m = date.getMinutes();
  return (h < 10 ? '0' + h : '' + h) + ':' + (m < 10 ? '0' + m : '' + m);
};

Game.prototype.pushSpinHistory = function(prize, rewardText) {
  if (!this.spinHistory) this.spinHistory = [];
  this.spinHistory.unshift({
    prize: prize.text,
    reward: rewardText,
    rarity: prize.rarity || '普通',
    time: this.formatSpinHistoryTime(new Date())
  });
  if (this.spinHistory.length > 6) this.spinHistory.length = 6;
};

Game.prototype.renderSpinHistory = function(group) {
  if (!group) return;
  while (group.numChildren > 0) group.removeChildAt(0);
  var rowW = group._rowW || 320;
  var title = new eui.Label();
  title.text = '最近中奖';
  title.size = 12; title.bold = true; title.textColor = THEME.textMain;
  title.x = 0; title.y = 0; title.width = rowW;
  group.addChild(title);
  var history = this.spinHistory || [];
  if (!history.length) {
    var emptyBg = new eui.Rect();
    emptyBg.width = rowW; emptyBg.height = 34; emptyBg.ellipseWidth = 8; emptyBg.ellipseHeight = 8;
    emptyBg.fillColor = 0x151038; emptyBg.fillAlpha = 0.86;
    emptyBg.strokeColor = THEME.strokeSoft; emptyBg.strokeWeight = 1; emptyBg.strokeAlpha = 0.3;
    emptyBg.y = 20;
    group.addChild(emptyBg);
    var empty = new eui.Label();
    empty.text = '暂无记录，抽一次后会显示在这里。';
    empty.size = 10; empty.textColor = THEME.textDim;
    empty.x = 10; empty.y = 30; empty.width = rowW - 20;
    group.addChild(empty);
    return;
  }
  var maxRows = Math.min(4, history.length);
  for (var i = 0; i < maxRows; i++) {
    var item = history[i];
    var y = 20 + i * 28;
    var isRare = item.rarity === '稀有' || item.rarity === '大奖';
    var bg = new eui.Rect();
    bg.width = rowW; bg.height = 24; bg.ellipseWidth = 8; bg.ellipseHeight = 8;
    bg.fillColor = isRare ? 0x2a1846 : 0x151038; bg.fillAlpha = 0.9;
    bg.strokeColor = isRare ? THEME.strokeGold : THEME.strokeSoft;
    bg.strokeWeight = 1; bg.strokeAlpha = isRare ? 0.58 : 0.28;
    bg.y = y;
    group.addChild(bg);
    var timeLb = new eui.Label();
    timeLb.text = item.time || '--:--';
    timeLb.size = 9; timeLb.textColor = THEME.textDim;
    timeLb.x = 8; timeLb.y = y + 7; timeLb.width = 34;
    group.addChild(timeLb);
    var nameLb = new eui.Label();
    nameLb.text = item.prize + ' · ' + item.reward;
    nameLb.size = 10; nameLb.textColor = isRare ? THEME.textGold : THEME.textMain;
    nameLb.x = 46; nameLb.y = y + 6; nameLb.width = rowW - 54;
    group.addChild(nameLb);
  }
};

Game.prototype.createSpinMachineSlot = function(parent, x, y, w, h, titleText, asset) {
  var slot = new eui.Group();
  slot.width = w; slot.height = h; slot.x = x; slot.y = y;
  var bg = new eui.Rect();
  bg.width = w; bg.height = h; bg.ellipseWidth = 12; bg.ellipseHeight = 12;
  bg.fillColor = 0x0d0926; bg.fillAlpha = 0.96;
  bg.strokeColor = THEME.strokeSoft; bg.strokeWeight = 1.2; bg.strokeAlpha = 0.48;
  slot.addChild(bg);
  var shine = new eui.Rect();
  shine.width = w - 10; shine.height = 18; shine.x = 5; shine.y = 5;
  shine.ellipseWidth = 9; shine.ellipseHeight = 9;
  shine.fillColor = 0xffffff; shine.fillAlpha = 0.08;
  slot.addChild(shine);
  var icon = new eui.Image();
  this.fitImageToBox(icon, asset || MODULE_ICON_ASSETS.spinGift, 52, 52, Math.floor((w - 52) / 2), 16);
  slot.addChild(icon);
  var lb = new eui.Label();
  lb.text = titleText || '待开奖';
  lb.size = 10; lb.bold = true; lb.textColor = THEME.textMain;
  lb.width = w; lb.height = 16; lb.x = 0; lb.y = h - 20;
  lb.textAlign = 'center';
  slot.addChild(lb);
  slot._bg = bg;
  slot._icon = icon;
  slot._label = lb;
  parent.addChild(slot);
  return slot;
};

Game.prototype.openSpinWheel = function() {
  this.resetSpinDaily();

  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 640);

  var title = new eui.Label();
  title.text = '转盘'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);
  var titleIcon = new eui.Image();
  this.fitImageToBox(titleIcon, MODULE_ICON_ASSETS.spinWheel, 30, 30, Math.floor(panel.width / 2) - 58, 10);
  panel.addChild(titleIcon);

  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  var freeCard = this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '今日免费', this.freeSpins + '/3', THEME.mint);
  var freeIcon = new eui.Image();
  this.fitImageToBox(freeIcon, MODULE_ICON_ASSETS.spinGift, 24, 24, panel._contentX + metricW - 34, 68);
  panel.addChild(freeIcon);
  var ticketCard = this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '幸运券', String(this.spinTickets || 0), THEME.sky);
  var ticketIcon = new eui.Image();
  this.fitImageToBox(ticketIcon, MODULE_ICON_ASSETS.spinTicket, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 68);
  panel.addChild(ticketIcon);
  var pityCard = this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '保底进度', (this.spinPity || 0) + '/' + SPIN_PITY_LIMIT, THEME.accentSoft);
  var pityIcon = new eui.Image();
  this.fitImageToBox(pityIcon, MODULE_ICON_ASSETS.spinJackpot, 24, 24, panel._contentX + metricW - 34, 120);
  panel.addChild(pityIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '金币基准', this.fmt(this.getSpinGoldBase()), THEME.textGold);
  var goldIcon = new eui.Image();
  this.fitImageToBox(goldIcon, MODULE_ICON_ASSETS.vaultDiamondPouch, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 120);
  panel.addChild(goldIcon);

  var info = new eui.Label();
  info.text = '改为摇奖机开奖，奖励随等级和关卡成长。';
  info.size = 11; info.textColor = 0x8f8aa8;
  info.x = panel._contentX; info.top = 164; info.width = panel._contentW;
  info.textAlign = 'center';
  panel.addChild(info);

  var machineTop = 184;
  var machineH = 152;
  var machine = new eui.Group();
  machine.width = panel._contentW; machine.height = machineH;
  machine.x = panel._contentX; machine.y = machineTop;
  panel.addChild(machine);

  var machineBg = new eui.Rect();
  machineBg.width = machine.width; machineBg.height = machineH;
  machineBg.ellipseWidth = 16; machineBg.ellipseHeight = 16;
  machineBg.fillColor = 0x151038; machineBg.fillAlpha = 0.98;
  machineBg.strokeColor = THEME.strokeGold; machineBg.strokeWeight = 1.2; machineBg.strokeAlpha = 0.52;
  machine.addChild(machineBg);
  var machineTopGlow = new eui.Rect();
  machineTopGlow.width = machine.width - 18; machineTopGlow.height = 24;
  machineTopGlow.x = 9; machineTopGlow.y = 8;
  machineTopGlow.ellipseWidth = 12; machineTopGlow.ellipseHeight = 12;
  machineTopGlow.fillColor = 0xfbbf24; machineTopGlow.fillAlpha = 0.08;
  machine.addChild(machineTopGlow);
  var machineTitle = new eui.Label();
  machineTitle.text = '幸运摇奖机';
  machineTitle.size = 12; machineTitle.bold = true; machineTitle.textColor = THEME.textGold;
  machineTitle.x = 14; machineTitle.y = 14; machineTitle.width = 120;
  machine.addChild(machineTitle);
  var machineHint = new eui.Label();
  machineHint.text = '中间奖格为本次结果';
  machineHint.size = 10; machineHint.textColor = THEME.textDim;
  machineHint.x = machine.width - 142; machineHint.y = 15; machineHint.width = 96; machineHint.textAlign = 'right';
  machine.addChild(machineHint);

  var slotY = 42;
  var leverW = 42;
  var slotGap = 8;
  var slotW = Math.floor((machine.width - leverW - 48 - slotGap * 2) / 3);
  var slotH = 88;
  var slotA = this.createSpinMachineSlot(machine, 14, slotY, slotW, slotH, '预热', MODULE_ICON_ASSETS.spinGift);
  var slotB = this.createSpinMachineSlot(machine, 14 + slotW + slotGap, slotY, slotW, slotH, '开奖', MODULE_ICON_ASSETS.spinWheel);
  var slotC = this.createSpinMachineSlot(machine, 14 + (slotW + slotGap) * 2, slotY, slotW, slotH, '结算', MODULE_ICON_ASSETS.spinJackpot);
  machine._slots = [slotA, slotB, slotC];
  machine._originX = machine.x;

  var lever = new eui.Group();
  lever.width = leverW; lever.height = 98;
  lever.x = machine.width - leverW - 12; lever.y = 42;
  lever.touchEnabled = true;
  var leverTrack = new eui.Rect();
  leverTrack.width = 12; leverTrack.height = 70; leverTrack.x = 15; leverTrack.y = 16;
  leverTrack.ellipseWidth = 6; leverTrack.ellipseHeight = 6;
  leverTrack.fillColor = 0x0b0820; leverTrack.strokeColor = THEME.strokeGold; leverTrack.strokeWeight = 1; leverTrack.strokeAlpha = 0.45;
  lever.addChild(leverTrack);
  var leverKnob = new eui.Rect();
  leverKnob.width = 28; leverKnob.height = 28; leverKnob.x = 7; leverKnob.y = 0;
  leverKnob.ellipseWidth = 14; leverKnob.ellipseHeight = 14;
  leverKnob.fillColor = 0xe74c3c; leverKnob.strokeColor = 0xffffff; leverKnob.strokeWeight = 1; leverKnob.strokeAlpha = 0.42;
  lever.addChild(leverKnob);
  var leverLb = new eui.Label();
  leverLb.text = '拉';
  leverLb.size = 11; leverLb.bold = true; leverLb.textColor = 0xffffff;
  leverLb.width = 28; leverLb.height = 28; leverLb.x = 7; leverLb.y = 7; leverLb.textAlign = 'center';
  lever.addChild(leverLb);
  lever._knob = leverKnob;
  lever._label = leverLb;
  machine.addChild(lever);
  machine._lever = lever;

  // 结果文字
  var resultLabel = new eui.Label();
  resultLabel.text = this.lastSpinPrize ? '上次: ' + this.lastSpinPrize : '奖励随等级和关卡成长';
  resultLabel.size = 13; resultLabel.textColor = 0xffd700;
  resultLabel.horizontalCenter = 0; resultLabel.top = machineTop + machineH + 10;
  panel.addChild(resultLabel);

  var remainLabel = new eui.Label();
  remainLabel.text = '剩余：免费 ' + this.freeSpins + '/3 · 幸运券 ' + (this.spinTickets || 0);
  remainLabel.size = 11; remainLabel.textColor = THEME.textDim;
  remainLabel.x = panel._contentX; remainLabel.top = machineTop + machineH + 31;
  remainLabel.width = panel._contentW; remainLabel.textAlign = 'center';
  panel.addChild(remainLabel);

  var historyGroup = new eui.Group();
  historyGroup.x = panel._contentX;
  historyGroup.y = machineTop + machineH + 56;
  historyGroup._rowW = panel._contentW;
  panel.addChild(historyGroup);
  this.renderSpinHistory(historyGroup);

  var prizeGrid = new eui.Group();
  prizeGrid.x = panel._contentX; prizeGrid.y = machineTop + machineH + 184;
  panel.addChild(prizeGrid);
  var poolTitle = new eui.Label();
  poolTitle.text = '奖池预览';
  poolTitle.size = 12; poolTitle.bold = true; poolTitle.textColor = THEME.textMain;
  poolTitle.x = 0; poolTitle.y = -22; poolTitle.width = panel._contentW;
  prizeGrid.addChild(poolTitle);
  for (var pi = 0; pi < SPIN_PRIZES.length; pi++) {
    var pp = SPIN_PRIZES[pi];
    var cellW = Math.floor((panel._contentW - 8) / 2);
    var cellH = 36;
    var cx = (pi % 2) * (cellW + 8);
    var cy = Math.floor(pi / 2) * 40;
    var cellBg = new eui.Rect();
    cellBg.width = cellW; cellBg.height = cellH; cellBg.fillColor = 0x1a153f;
    cellBg.ellipseWidth = 8; cellBg.ellipseHeight = 8;
    cellBg.strokeColor = pp.color || THEME.strokeSoft; cellBg.strokeWeight = 1; cellBg.strokeAlpha = pp.rare || pp.rarity === '大奖' ? 0.62 : 0.28;
    cellBg.x = cx; cellBg.y = cy;
    prizeGrid.addChild(cellBg);
    var prizeIcon = new eui.Image();
    this.fitImageToBox(prizeIcon, this.getSpinPrizeIconAsset(pp), 24, 24, cx + 7, cy + 6);
    prizeGrid.addChild(prizeIcon);
    var cellLb = new eui.Label();
    cellLb.text = pp.text + '  ' + this.getSpinPrizeText(pp);
    cellLb.size = 9; cellLb.textColor = pp.color || 0xffffff;
    cellLb.x = cx + 38; cellLb.y = cy + 12; cellLb.width = cellW - 44;
    prizeGrid.addChild(cellLb);
  }

  var rule = new eui.Label();
  rule.text = '10抽内必出稀有或大奖，BOSS有概率掉幸运券。';
  rule.size = 10; rule.textColor = 0x8f8aa8;
  rule.x = panel._contentX; rule.bottom = 56; rule.width = panel._contentW;
  rule.textAlign = 'center'; rule.wordWrap = true;
  panel.addChild(rule);

  var self = this;
  var canSpin = this.freeSpins > 0 || this.spinTickets > 0;
  if (!canSpin) {
    lever.alpha = 0.45;
    lever.touchEnabled = false;
    lever.touchChildren = false;
    if (lever._label) lever._label.text = '空';
  }
  lever.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
    self.spin(machine, resultLabel, lever, info, {
      free: freeCard._valueLabel,
      ticket: ticketCard._valueLabel,
      pity: pityCard._valueLabel,
      history: historyGroup,
      remain: remainLabel
    });
  }, this);
};

Game.prototype.spin = function(machine, resultLabel, trigger, infoLabel, metrics) {
  this.resetSpinDaily();
  if (this.freeSpins <= 0 && this.spinTickets <= 0) return;
  if (this.freeSpins > 0) this.freeSpins--;
  else this.spinTickets--;
  trigger.alpha = 0.5;
  trigger.touchEnabled = false;
  trigger.touchChildren = false;

  var prize = this.pickSpinPrize();
  var slots = machine && machine._slots ? machine._slots : [];
  var lever = machine && machine._lever;
  var visualPool = [
    MODULE_ICON_ASSETS.spinGift,
    MODULE_ICON_ASSETS.spinTicket,
    MODULE_ICON_ASSETS.vaultEnergyPotion,
    MODULE_ICON_ASSETS.vaultRelic,
    MODULE_ICON_ASSETS.vaultDiamondPouch,
    MODULE_ICON_ASSETS.spinJackpot
  ];
  for (var i = 0; i < slots.length; i++) {
    var slot = slots[i];
    egret.Tween.removeTweens(slot);
    egret.Tween.removeTweens(slot._icon);
    if (slot._bg) {
      slot._bg.strokeColor = THEME.strokeSoft;
      slot._bg.strokeAlpha = 0.48;
    }
    if (slot._label) {
      slot._label.text = i === 1 ? '开奖中' : '滚动中';
      slot._label.textColor = THEME.textMain;
    }
    if (slot._icon) {
      slot._icon.source = visualPool[(Math.floor(Math.random() * visualPool.length))];
      slot._icon.alpha = 0.62;
      slot._icon.y = 20;
      var tween = egret.Tween.get(slot._icon);
      for (var roll = 0; roll < 14; roll++) {
        (function(icon, offset) {
          tween.call(function() {
            icon.source = visualPool[(Math.floor(Math.random() * visualPool.length) + offset) % visualPool.length];
          });
        })(slot._icon, i + roll);
        tween.to({ y: 32, alpha: 0.3 }, 120, egret.Ease.sineInOut)
          .to({ y: 14, alpha: 0.86 }, 120, egret.Ease.sineInOut);
      }
    }
  }
  if (machine) {
    egret.Tween.removeTweens(machine);
    machine.x = machine._originX || machine.x;
    egret.Tween.get(machine)
      .to({ x: machine.x + 4 }, 90)
      .to({ x: machine.x - 4 }, 110)
      .to({ x: machine.x + 3 }, 110)
      .to({ x: machine._originX || machine.x }, 110)
      .wait(600)
      .to({ x: (machine._originX || machine.x) + 2 }, 90)
      .to({ x: machine._originX || machine.x }, 120);
  }
  if (lever && lever._knob) {
    egret.Tween.removeTweens(lever._knob);
    egret.Tween.get(lever._knob)
      .to({ y: 42 }, 260, egret.Ease.quadIn)
      .wait(2600)
      .to({ y: 0 }, 420, egret.Ease.backOut);
  }
  if (lever && lever._label) lever._label.text = '摇';
  if (resultLabel) resultLabel.text = '摇奖中...';
  if (metrics && metrics.remain) metrics.remain.text = '开奖中：免费 ' + this.freeSpins + '/3 · 幸运券 ' + (this.spinTickets || 0);

  var self = this;
  egret.Tween.get(machine || trigger).wait(3600).call(function() {
    var rewardText = self.grantSpinPrize(prize);
    var resultAsset = self.getSpinPrizeIconAsset(prize);
    if (slots[0] && slots[0]._icon) {
      slots[0]._icon.source = prize.rarity === '大奖' ? MODULE_ICON_ASSETS.spinJackpot : MODULE_ICON_ASSETS.spinGift;
      slots[0]._icon.alpha = 1;
      slots[0]._icon.y = 16;
      slots[0]._label.text = prize.rarity || '普通';
    }
    if (slots[1] && slots[1]._icon) {
      slots[1]._icon.source = resultAsset;
      slots[1]._icon.alpha = 1;
      slots[1]._icon.y = 16;
      slots[1]._label.text = prize.text;
      slots[1]._label.textColor = prize.rare || prize.rarity === '大奖' ? THEME.textGold : THEME.textMain;
      if (slots[1]._bg) {
        slots[1]._bg.strokeColor = prize.color || THEME.strokeGold;
        slots[1]._bg.strokeAlpha = 0.86;
      }
      egret.Tween.get(slots[1])
        .to({ scaleX: 1.06, scaleY: 1.06 }, 110, egret.Ease.backOut)
        .to({ scaleX: 1, scaleY: 1 }, 130, egret.Ease.quadOut);
    }
    if (slots[2] && slots[2]._icon) {
      slots[2]._icon.source = rewardText.indexOf('幸运券') >= 0 ? MODULE_ICON_ASSETS.spinTicket : resultAsset;
      slots[2]._icon.alpha = 1;
      slots[2]._icon.y = 16;
      slots[2]._label.text = '已入账';
    }
    resultLabel.text = '获得: ' + prize.text + ' · ' + rewardText;
    self.showToast('🎡 转盘奖励: ' + prize.text + ' ' + rewardText);
    self.saveGame();
    self.updateUI();
    if (infoLabel) infoLabel.text = '今日免费 ' + self.freeSpins + '/3 · 幸运券 ' + (self.spinTickets || 0) + ' · 保底 ' + (self.spinPity || 0) + '/' + SPIN_PITY_LIMIT;
    if (metrics) {
      if (metrics.free) metrics.free.text = self.freeSpins + '/3';
      if (metrics.ticket) metrics.ticket.text = String(self.spinTickets || 0);
      if (metrics.pity) metrics.pity.text = (self.spinPity || 0) + '/' + SPIN_PITY_LIMIT;
      if (metrics.history) self.renderSpinHistory(metrics.history);
      if (metrics.remain) metrics.remain.text = '剩余：免费 ' + self.freeSpins + '/3 · 幸运券 ' + (self.spinTickets || 0);
    }
    if (self.freeSpins > 0 || self.spinTickets > 0) {
      trigger.alpha = 1;
      trigger.touchEnabled = true;
      trigger.touchChildren = true;
      if (lever && lever._label) lever._label.text = '拉';
    } else {
      if (lever && lever._label) lever._label.text = '空';
      trigger.alpha = 0.45;
    }
  });
};

// ==================== 主角档案 ====================

Game.prototype.openLeaderboard = function(options) {
  options = options || {};
  var overlay = this.createPanelOverlay();
  var self = this;
  var panel = this.addPanelContent(overlay, {
    backText: options.returnTo === 'upgrade' ? '升级' : '返回',
    onBack: options.returnTo === 'upgrade' ? function() {
      self.openUpgrade(options.tab || self.upgradePanelTab || 'skills');
    } : null
  });
  this.setPanelContentHeight(panel, Math.min(500, (overlay.height || 667) - 74));

  var title = new eui.Label();
  title.text = '主角档案'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var list = this.createPanelScrollContent(panel, 52, 14);
  list._contentX = 0;
  list._contentW = panel._contentW;

  var y = 0;
  function header(text, color) {
    var lb = new eui.Label();
    lb.text = text; lb.size = 12; lb.bold = true; lb.textColor = color || THEME.accentSoft;
    lb.x = 0; lb.y = y; lb.width = list._contentW;
    list.addChild(lb);
    y += 20;
  }
  function row(icon, label, value, color) {
    y = self.addPanelRow(list, y, icon, color || 0x3498db, label + '\n' + value, '', 0, function() {}, false);
  }

  var s = this.stats;
  var playH = Math.floor(s.playTime / 3600);
  var playM = Math.floor((s.playTime % 3600) / 60);
  var bossInfo = this.getBossPowerInfo(this.getNextBossWave());
  var progress = this.getProgressInfoForWave(this.wave);
  var plan = this.getRebirthPlan();
  var bonuses = this.getStageBonuses();

  header('战力', THEME.sky);
  row('战', '当前战力', this.fmt(bossInfo.current) + ' / 推荐BOSS ' + this.fmt(bossInfo.recommended), 0x3498db);
  row('主', '主角等级', 'Lv.' + this.mainLevel + '  DPS ' + this.fmt(this.totalDps()), 0x8e44ad);
  row('防', '生存能力', '生命 ' + this.fmt(this.playerHp) + '/' + this.fmt(this.getMaxPlayerHp()) + '  防御 ' + this.getPlayerDefense(), 0xef4444);
  row('技', '技能成长', '已解锁 ' + this.skillUnlocked.filter(function(v){ return v; }).length + '/' + SKILLS.length + '  强化等级总和 ' + this.skillLevels.reduce(function(a,b){ return a + b; }, 0), 0x27ae60);

  header('探索', THEME.accentSoft);
  row('章', '当前章节', '第' + progress.chapter + '章 · BOSS ' + progress.chapterBoss + '/' + BOSSES_PER_CHAPTER + ' · 第' + this.wave + '波', 0xf39c12);
  row('峰', '历史最高', '第 ' + this.maxWaveReached + ' 波，击杀BOSS ' + this.fmt(s.bossKills), 0xe74c3c);
  row('转', '转生规划', '本轮新增BOSS ' + plan.newBossStages + '/' + REBIRTH_MIN_NEW_BOSSES + '，预计获得💎' + plan.gemsGain, 0xc7a7ff);

  header('收藏', THEME.mint);
  row('图', '图签/成就', '图签 ' + Object.keys(this.monsterCodex || {}).length + '  成就 ' + this.achievements.length + '/' + ACHIEVEMENTS.length, 0x2ecc71);
  row('奖', '资源记录', '最高金币 ' + this.fmt(s.totalGold) + '  转盘 ' + this.fmt(this.totalSpins || 0) + ' 次', 0xfbbf24);
  row('时', '游戏时间', playH + 'h ' + playM + 'm  阶段金币+' + Math.round(bonuses.gold * 100) + '%', 0x5ec8ff);

  header('下一步建议', THEME.textGold);
  row('目', '推荐行动', this.getNextGoal().text.replace('目标：', ''), 0xffd700);
  row('建', 'BOSS建议', this.getBossPowerAdvice(bossInfo), 0xff9f43);

  list.height = y + 4;
};

// ==================== 微信好友排行 ====================

Game.prototype.getFriendRankScore = function() {
  return Math.max(this.maxWaveReached || 0, this.wave || 1);
};

Game.prototype.syncWxFriendRankScore = function(force) {
  var score = this.getFriendRankScore();
  var now = Date.now ? Date.now() : new Date().getTime();
  if (!force && this._lastWxRankScore === score && this._lastWxRankSyncAt && now - this._lastWxRankSyncAt < 60000) return;
  this._lastWxRankScore = score;
  this._lastWxRankSyncAt = now;
  try {
    if (typeof wx === 'undefined' || !wx) return;
    if (wx.setUserCloudStorage) {
      wx.setUserCloudStorage({
        KVDataList: [
          { key: 'wave_rank', value: String(score) },
          { key: 'boss_kills', value: String(this.stats ? (this.stats.bossKills || 0) : 0) }
        ]
      });
    }
    if (wx.getOpenDataContext) {
      wx.getOpenDataContext().postMessage({
        type: 'updateFriendWaveRank',
        score: score,
        wave: this.wave || 1,
        maxWave: score,
        bossKills: this.stats ? (this.stats.bossKills || 0) : 0,
        width: 320,
        height: 270
      });
    }
  } catch(e) {}
};

Game.prototype.openFriendRanking = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 520);

  // S1/H-2：提前判定环境。H5（无 wx）降级为「本地成绩单」；微信侧仍走开放数据域冲关榜，保留不删。
  var wxReady = false;
  try {
    wxReady = typeof wx !== 'undefined' && !!wx && !!wx.getOpenDataContext;
  } catch (e) { wxReady = false; }

  var title = new eui.Label();
  title.text = wxReady ? '冲关排名' : '本地成绩单'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var score = this.getFriendRankScore();
  this.syncWxFriendRankScore(true);
  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '我的最高波次', '第 ' + score + ' 波', THEME.accentSoft);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '击杀BOSS', this.fmt(this.stats ? this.stats.bossKills : 0), 0xff8888);

  var board = new eui.Rect();
  board.width = panel._contentW; board.height = 270;
  board.x = panel._contentX; board.y = 124;
  board.ellipseWidth = 10; board.ellipseHeight = 10;
  board.fillColor = 0x0d0926; board.fillAlpha = 0.92;
  board.strokeColor = THEME.strokeGold; board.strokeWeight = 1; board.strokeAlpha = 0.46;
  panel.addChild(board);

  try {
    if (wxReady) {
      if (typeof sharedCanvas !== 'undefined') {
        sharedCanvas.width = Math.floor(board.width);
        sharedCanvas.height = Math.floor(board.height);
      }
      wx.getOpenDataContext().postMessage({
        type: 'showFriendWaveRank',
        score: score,
        wave: this.wave,
        maxWave: score,
        bossKills: this.stats ? this.stats.bossKills : 0,
        width: Math.floor(board.width),
        height: Math.floor(board.height)
      });
      if (typeof platform !== 'undefined' && platform.openDataContext && platform.openDataContext.createDisplayObject) {
        var rankCanvas = platform.openDataContext.createDisplayObject('bitmap', board.width, board.height);
        rankCanvas.x = board.x;
        rankCanvas.y = board.y;
        rankCanvas.touchEnabled = false;
        panel.addChild(rankCanvas);
        this._friendRankCanvas = rankCanvas;
      }
    }
  } catch(e) {
    wxReady = false;
  }

  // S1/H-2：H5 不再显示「占位 / 后期接入」，改为本机存档里可直接读到的真实成绩。
  var s = this.stats || {};
  var playSeconds = s.playTime || 0;
  var playH = Math.floor(playSeconds / 3600);
  var playM = Math.floor((playSeconds % 3600) / 60);
  var rows = wxReady ? [] : [
    ['历史最高波次', '第 ' + score + ' 波 · 当前第 ' + (this.wave || 1) + ' 波'],
    ['BOSS 击杀 / 转生', this.fmt(s.bossKills || 0) + ' 只 · ' + (this.rebirthCount || 0) + ' 次'],
    ['图签 / 成就', Object.keys(this.monsterCodex || {}).length + ' 项 · ' + this.achievements.length + '/' + ACHIEVEMENTS.length],
    ['累计金币 / 时长', this.fmt(s.totalGold || 0) + ' · ' + playH + 'h ' + playM + 'm']
  ];

  var rowGap = wxReady ? 70 : 58;
  var rowRanks = ['①', '②', '③', '④'];
  for (var i = 0; i < rows.length; i++) {
    var rowY = 146 + i * rowGap;
    var rankLb = new eui.Label();
    rankLb.text = rowRanks[i] || (i === 0 ? '榜' : String(i));
    rankLb.size = 12; rankLb.bold = true; rankLb.textColor = THEME.textGold;
    rankLb.x = panel._contentX + 14; rankLb.y = rowY + 8; rankLb.width = 28; rankLb.textAlign = 'center';
    panel.addChild(rankLb);

    var nameLb = new eui.Label();
    nameLb.text = rows[i][0]; nameLb.size = 12; nameLb.bold = true; nameLb.textColor = THEME.textMain;
    nameLb.x = panel._contentX + 50; nameLb.y = rowY + 2; nameLb.width = panel._contentW - 64;
    panel.addChild(nameLb);

    var valueLb = new eui.Label();
    valueLb.text = rows[i][1]; valueLb.size = 10; valueLb.textColor = THEME.textDim;
    valueLb.x = panel._contentX + 50; valueLb.y = rowY + 22; valueLb.width = panel._contentW - 64;
    panel.addChild(valueLb);
  }

  var hint = new eui.Label();
  hint.text = wxReady ? '已请求微信开放数据域绘制冲关榜' : '浏览器版本地成绩单 · 数据取自本机存档，不联网比较';
  hint.size = 10; hint.textColor = THEME.textDim;
  hint.x = panel._contentX; hint.y = 414; hint.width = panel._contentW; hint.textAlign = 'center';
  panel.addChild(hint);
};

// ==================== 钻石补给 ====================

Game.prototype.openShop = function(options) {
  options = options || {};
  var overlay = this.createPanelOverlay();
  var self = this;
  var panel = this.addPanelContent(overlay, {
    backText: options.returnTo === 'vault' ? '宝库' : '返回',
    onBack: options.returnTo === 'vault' ? function() {
      self.openVault();
    } : null
  });

  var title = new eui.Label();
  title.text = '宝库 · 钻石补给'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);
  var shopTitleIcon = new eui.Image();
  this.fitImageToBox(shopTitleIcon, MODULE_ICON_ASSETS.vaultDiamondPouch, 30, 30, Math.floor(panel.width / 2) - 104, 10);
  panel.addChild(shopTitleIcon);

  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '当前钻石', '💎 ' + this.rebirthGems, 0xc7a7ff);
  var shopDiamondIcon = new eui.Image();
  this.fitImageToBox(shopDiamondIcon, UI_ASSETS.topHudDiamond, 24, 24, panel._contentX + metricW - 34, 68);
  panel.addChild(shopDiamondIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '能量', Math.floor(this.energy) + '/' + this.getMaxEnergy(), THEME.sky);
  var shopEnergyIcon = new eui.Image();
  this.fitImageToBox(shopEnergyIcon, MODULE_ICON_ASSETS.vaultEnergyPotion, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 68);
  panel.addChild(shopEnergyIcon);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '离线收益', this.offlineCap + ' 小时', 0x9b59b6);
  var shopOfflineIcon = new eui.Image();
  this.fitImageToBox(shopOfflineIcon, MODULE_ICON_ASSETS.rebirthHourglass, 24, 24, panel._contentX + metricW - 34, 120);
  panel.addChild(shopOfflineIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '幸运券', String(this.spinTickets || 0), THEME.accentSoft);
  var shopTicketIcon = new eui.Image();
  this.fitImageToBox(shopTicketIcon, MODULE_ICON_ASSETS.spinTicket, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 120);
  panel.addChild(shopTicketIcon);

  var list = this.createPanelScrollContent(panel, 170, 14);
  list._contentX = 0;
  list._contentW = panel._contentW;
  var y = 0;
  var intro = new eui.Label();
  intro.text = '钻石补给偏短期消耗，适合冲关、补能量或补转盘机会。';
  intro.size = 11; intro.textColor = THEME.textDim;
  intro.x = 2; intro.y = y; intro.width = list._contentW; intro.wordWrap = true;
  list.addChild(intro);
  y += 34;
  var energyFull = this.energy >= this.getMaxEnergy();

  this.addUpgradeCard(list, 0, y, list._contentW, '⚡', 0x3498db,
    '能量药水',
    '恢复' + CONFIG.energyPotionValue + '能量' + (energyFull ? '\n当前能量已满' : '\n用于继续手动攻击冲关'),
    energyFull ? '已满' : '💎1', 0x27ae60,
    function() { self.shopBuy('energy', { returnTo: options.returnTo }); },
    this.rebirthGems < 1 || energyFull,
    MODULE_ICON_ASSETS.vaultEnergyPotion
  );
  y += 106;

  this.addUpgradeCard(list, 0, y, list._contentW, '💤', 0x9b59b6,
    '离线扩展包',
    '离线上限+4h\n当前上限 ' + this.offlineCap + 'h',
    '💎3', 0x27ae60,
    function() { self.shopBuy('offline', { returnTo: options.returnTo }); },
    this.rebirthGems < 3 || this.offlineCap >= 24,
    MODULE_ICON_ASSETS.rebirthHourglass
  );
  y += 106;

  this.addUpgradeCard(list, 0, y, list._contentW, '券', 0xc7a7ff,
    '幸运券礼包',
    '获得3张转盘券\n用于冲稀有奖励和保底进度',
    '💎2', 0x27ae60,
    function() { self.shopBuy('ticket', { returnTo: options.returnTo }); },
    this.rebirthGems < 2,
    MODULE_ICON_ASSETS.spinTicket
  );
  y += 106;

  this.addUpgradeCard(list, 0, y, list._contentW, '📋', 0xe67e22,
    '每日任务',
    '查看每日任务进度\n补充金币和日常目标',
    '查看', 0x3498db,
    function() { self.closePanel(); self.openDailyTasks(); },
    false,
    MODULE_ICON_ASSETS.spinGift
  );
  y += 106;

  this.addUpgradeCard(list, 0, y, list._contentW, '🏆', 0xf39c12,
    '成就系统',
    '已完成: ' + this.achievements.length + '/' + ACHIEVEMENTS.length + '\n达成即自动发放金币',
    '查看', 0x3498db,
    function() { self.closePanel(); self.openAchievements(); },
    false,
    MODULE_ICON_ASSETS.spinJackpot
  );
  y += 106;

  list.height = y + 8;
  this.setPanelContentHeight(panel, y + 16);
};

// ==================== 邮件系统 ====================

Game.prototype.openMail = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, Math.min(500, (overlay.height || 667) - 74));

  var title = new eui.Label();
  title.text = '📧 邮件'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  // S2-C：说明这是本地等级奖励，不暗示存在服务器邮件。
  var mailLocalHint = new eui.Label();
  mailLocalHint.text = '本地等级奖励 · 随浏览器版本发布，不联网下发，领取记录保存在本机存档';
  mailLocalHint.size = 9; mailLocalHint.textColor = THEME.textDim;
  mailLocalHint.horizontalCenter = 0; mailLocalHint.top = 38;
  mailLocalHint.width = panel._contentW; mailLocalHint.textAlign = 'center';
  panel.addChild(mailLocalHint);

  var self = this;
  var mails = MAIL_REWARDS.slice();
  var unlockedCount = 0;
  var claimedCount = 0;
  for (var mi = 0; mi < mails.length; mi++) {
    if (this.mainLevel >= mails[mi].level) unlockedCount++;
    if (this.mailClaimed[mails[mi].id]) claimedCount++;
  }
  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '已解锁', unlockedCount + '/' + mails.length, THEME.sky);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '已领取', claimedCount + '/' + mails.length, THEME.mint);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '主角等级', 'Lv.' + this.mainLevel, THEME.accentSoft);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '邮件奖励', '金币/能量/秘宝', THEME.textGold);

  var list = this.createPanelScrollContent(panel, 170, 14);
  list._contentX = 0;
  list._contentW = panel._contentW;
  var y = 0;
  for (var i = 0; i < mails.length; i++) {
    var m = mails[i];
    var unlocked = this.mainLevel >= m.level;
    var claimed = !!this.mailClaimed[m.id];
    var rowBg = new eui.Rect();
    rowBg.width = panel._contentW; rowBg.height = 62; rowBg.fillColor = unlocked ? 0x1a153f : 0x11111c;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.alpha = unlocked ? 1 : 0.62;
    rowBg.x = 0; rowBg.y = y;
    list.addChild(rowBg);

    var fromLb = new eui.Label();
    fromLb.text = '[' + m.from + '] Lv.' + m.level; fromLb.size = 10; fromLb.textColor = unlocked ? 0xf39c12 : 0x777777;
    fromLb.x = 10; fromLb.y = y + 7;
    list.addChild(fromLb);

    var titleLb = new eui.Label();
    titleLb.text = unlocked ? m.title : '等级不足，主角Lv.' + m.level + '解锁';
    titleLb.size = 12; titleLb.textColor = unlocked ? 0xffffff : 0x888888;
    titleLb.x = 10; titleLb.y = y + 23;
    titleLb.width = 154;
    list.addChild(titleLb);

    var bodyLb = new eui.Label();
    bodyLb.text = unlocked ? m.body : '继续升级会收到奖励邮件';
    bodyLb.size = 9; bodyLb.textColor = 0x8f8aa8;
    bodyLb.x = 10; bodyLb.y = y + 43;
    bodyLb.width = 154;
    list.addChild(bodyLb);

    var rewardLb = new eui.Label();
    rewardLb.text = m.rewardText; rewardLb.size = 11; rewardLb.textColor = unlocked ? 0xffd700 : 0x666666;
    rewardLb.x = panel._contentW - 132; rewardLb.y = y + 21;
    rewardLb.width = 68; rewardLb.textAlign = 'right';
    list.addChild(rewardLb);

    (function(idx, mail) {
      var canClaim = self.mainLevel >= mail.level && !self.mailClaimed[mail.id];
      var claimBtn = self.createButton(self.mailClaimed[mail.id] ? '已领' : '领取', canClaim ? 0x27ae60 : 0x555555, 50, 24, function() {
        self.claimMail(mail.id);
      }, self);
      claimBtn.x = panel._contentW - 58; claimBtn.y = y + 19;
      if (!canClaim) {
        claimBtn.alpha = 0.45;
        claimBtn.touchEnabled = false;
        claimBtn.touchChildren = false;
      }
      list.addChild(claimBtn);
    })(i, m);

    y += 68;
  }
  list.height = y;
};

Game.prototype.claimMail = function(id) {
  var mail = null;
  for (var i = 0; i < MAIL_REWARDS.length; i++) {
    if (MAIL_REWARDS[i].id === id) { mail = MAIL_REWARDS[i]; break; }
  }
  if (!mail) return;
  if (this.mainLevel < mail.level) { this.showToast('等级不足，主角Lv.' + mail.level + '解锁'); return; }
  if (this.mailClaimed[id]) { this.showToast('这封邮件已领取'); return; }

  if (mail.type === 'gold') {
    this.gold += mail.value;
    this.stats.totalGold += mail.value;
  } else if (mail.type === 'energy') {
    this.energy = Math.min(this.getMaxEnergy(), this.energy + mail.value);
  } else if (mail.type === 'food') {
    if (!this.addRelic(mail.value, 1)) {
      this.spinTickets = (this.spinTickets || 0) + 1;
    }
  }
  this.mailClaimed[id] = true;
  this.showToast('📧 邮件奖励: ' + mail.rewardText);
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openMail();
};

// ==================== 公告系统 ====================

Game.prototype.openAnnouncement = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 374);

  var title = new eui.Label();
  title.text = '📢 公告'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var version = new eui.Label();
  version.text = '版本：' + (window.DMAX_GAME_VERSION || ASSET_VERSION || 'local-dev') + '  ·  本地公告，不联网更新';
  version.size = 10; version.textColor = 0x8f8aa8;
  version.horizontalCenter = 0; version.top = 40;
  version.width = panel._contentW; version.textAlign = 'center';
  panel.addChild(version);

  var anns = ANNOUNCEMENTS;
  var y = 54;
  for (var i = 0; i < anns.length; i++) {
    var a = anns[i];
    var rowBg = new eui.Rect();
    rowBg.width = panel._contentW; rowBg.height = 54; rowBg.fillColor = 0x1a153f;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.x = panel._contentX; rowBg.y = y;
    panel.addChild(rowBg);

    var tagBg = new eui.Rect();
    tagBg.width = 28; tagBg.height = 16; tagBg.fillColor = a.color;
    tagBg.ellipseWidth = 4; tagBg.ellipseHeight = 4;
    tagBg.x = panel._contentX + 8; tagBg.y = y + 8;
    panel.addChild(tagBg);

    var tagLb = new eui.Label();
    tagLb.text = a.tag; tagLb.size = 9; tagLb.textColor = 0xffffff; tagLb.bold = true;
    tagLb.x = panel._contentX + 12; tagLb.y = y + 10;
    panel.addChild(tagLb);

    var textLb = new eui.Label();
    textLb.text = a.text; textLb.size = 11; textLb.textColor = 0xcccccc;
    textLb.x = panel._contentX + 44; textLb.y = y + 9;
    textLb.width = panel._contentW - 54;
    textLb.wordWrap = true; textLb.lineSpacing = 3;
    panel.addChild(textLb);

    y += 60;
  }
  this.setPanelContentHeight(panel, y + 16);
};

// ==================== 能量互助 ====================

Game.prototype.openEnergyHelp = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 420);

  var title = new eui.Label();
  title.text = '⚡ 能量互助'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '当前能量', Math.floor(this.energy) + '/' + this.getMaxEnergy(), THEME.sky);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '自然恢复', '+' + CONFIG.energyRecovery + '/秒', THEME.mint);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '点击消耗', '-' + CONFIG.attackEnergyCost + '/次', THEME.accentSoft);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '药水恢复', '+' + CONFIG.energyPotionValue, THEME.textGold);

  var guideBg = new eui.Rect();
  guideBg.width = panel._contentW; guideBg.height = 96;
  guideBg.x = panel._contentX; guideBg.y = 176;
  guideBg.ellipseWidth = 10; guideBg.ellipseHeight = 10;
  guideBg.fillColor = 0x151038;
  guideBg.strokeColor = THEME.strokeSoft; guideBg.strokeWeight = 1; guideBg.strokeAlpha = 0.45;
  panel.addChild(guideBg);

  var tip = new eui.Label();
  tip.text = '能量用于手动点击战斗区域。技能只受冷却限制，不消耗能量。\n能量会自动恢复；冲BOSS前不足时，可以从宝库补充药水。';
  tip.size = 12; tip.textColor = 0xcccccc;
  tip.x = panel._contentX + 12; tip.y = 194; tip.width = panel._contentW - 24; tip.lineSpacing = 6;
  tip.wordWrap = true;
  panel.addChild(tip);

  var self = this;
  var energyFull = this.energy >= this.getMaxEnergy();
  var buyBtn = this.createButton(energyFull ? '能量已满' : '💎1 购买能量药水', energyFull ? 0x555555 : 0x3498db, 160, 36,
    function() {
      if (self.energy >= self.getMaxEnergy()) { self.showToast('能量已满，不需要购买'); return; }
      if (self.rebirthGems < 1) { self.showToast('钻石不足，转生可获得钻石'); return; }
      self.closePanel();
      self.shopBuy('energy');
    }, this
  );
  buyBtn.horizontalCenter = 0; buyBtn.y = 304;
  if (energyFull) {
    buyBtn.alpha = 0.45;
    buyBtn.touchEnabled = false;
    buyBtn.touchChildren = false;
  }
  panel.addChild(buyBtn);
};

Game.prototype.shopBuy = function(type, options) {
  options = options || {};
  if (type === 'energy') {
    if (this.energy >= this.getMaxEnergy()) { this.showToast('能量已满，不需要购买'); return; }
    if (this.rebirthGems < 1) { this.showToast('钻石不足，转生可获得钻石'); return; }
    this.rebirthGems -= 1;
    this.energy = Math.min(this.getMaxEnergy(), this.energy + CONFIG.energyPotionValue);
    this.showToast('⚡ 购买能量药水！+' + CONFIG.energyPotionValue + '能量');
  } else if (type === 'offline') {
    if (this.offlineCap >= 24) { this.showToast('离线上限已满'); return; }
    if (this.rebirthGems < 3) { this.showToast('钻石不足，转生可获得钻石'); return; }
    this.rebirthGems -= 3;
    this.offlineCap = Math.min(24, this.offlineCap + 4);
    this.showToast('💤 离线上限提升至' + this.offlineCap + '小时！');
  } else if (type === 'ticket') {
    if (this.rebirthGems < 2) { this.showToast('钻石不足，转生可获得钻石'); return; }
    this.rebirthGems -= 2;
    this.spinTickets = (this.spinTickets || 0) + 3;
    this.showToast('🎡 幸运券 +3');
  }
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openShop({ returnTo: options.returnTo });
};

// ==================== 转生系统 ====================

Game.prototype.openRebirth = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, Math.min(620, (overlay.height || 667) - 60));

  var title = new eui.Label();
  title.text = '转生'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);
  var titleIcon = new eui.Image();
  this.fitImageToBox(titleIcon, UI_ASSETS.topHudDiamond, 30, 30, Math.floor(panel.width / 2) - 58, 10);
  panel.addChild(titleIcon);

  var self = this;
  var plan = this.getRebirthPlan();
  var gemsGain = plan.gemsGain;
  var canRebirth = plan.canRebirth;
  var dmgMult = CONFIG.rebirthDamageMult(this.rebirthGems);
  var supportMult = CONFIG.rebirthSupportMult(this.rebirthGems);

  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '当前宝石', '💎 ' + this.rebirthGems, 0xc7a7ff);
  var gemIcon = new eui.Image();
  this.fitImageToBox(gemIcon, UI_ASSETS.topHudDiamond, 24, 24, panel._contentX + metricW - 34, 68);
  panel.addChild(gemIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '本次预计', '+💎 ' + gemsGain, THEME.textGold);
  var portalMetricIcon = new eui.Image();
  this.fitImageToBox(portalMetricIcon, MODULE_ICON_ASSETS.rebirthPortal, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 68);
  panel.addChild(portalMetricIcon);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '历史最高', '第' + this.maxWaveReached + '波', THEME.sky);
  var hourIcon = new eui.Image();
  this.fitImageToBox(hourIcon, MODULE_ICON_ASSETS.rebirthHourglass, 24, 24, panel._contentX + metricW - 34, 120);
  panel.addChild(hourIcon);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '新增BOSS', plan.newBossStages + '/' + REBIRTH_MIN_NEW_BOSSES, canRebirth ? THEME.mint : THEME.danger);
  var talentMetricIcon = new eui.Image();
  this.fitImageToBox(talentMetricIcon, MODULE_ICON_ASSETS.rebirthTalent, 24, 24, panel._contentX + metricW + metricGap + metricW - 34, 120);
  panel.addChild(talentMetricIcon);

  var introBg = new eui.Rect();
  introBg.width = panel._contentW; introBg.height = 44;
  introBg.x = panel._contentX; introBg.y = 164;
  introBg.ellipseWidth = 10; introBg.ellipseHeight = 10;
  introBg.fillColor = 0x151038;
  introBg.strokeColor = canRebirth ? THEME.mint : THEME.strokeSoft;
  introBg.strokeWeight = 1; introBg.strokeAlpha = 0.48;
  panel.addChild(introBg);

  var intro = new eui.Label();
  intro.text = '转生是卡关后的主动重开：牺牲本轮养成换取永久宝石。本页是转生天赋强化的唯一入口，宝石也可在秘宝阁换永久属性。';
  intro.size = 11; intro.textColor = 0xcccccc;
  intro.x = panel._contentX + 46; intro.y = 178; intro.width = panel._contentW - 56;
  intro.wordWrap = true;
  panel.addChild(intro);
  var introIcon = new eui.Image();
  this.fitImageToBox(introIcon, MODULE_ICON_ASSETS.rebirthPortal, 30, 30, panel._contentX + 8, 171);
  panel.addChild(introIcon);

  var list = this.createPanelScrollContent(panel, 222, 14);
  var listW = panel._contentW;
  var y = 0;

  // 转生收益预览
  var previewBg = new eui.Rect();
  previewBg.width = listW; previewBg.height = 82; previewBg.fillColor = 0x1a153f;
  previewBg.ellipseWidth = 8; previewBg.x = 0; previewBg.y = y;
  list.addChild(previewBg);

  var previewTitle = new eui.Label();
  previewTitle.text = '转生收益预览'; previewTitle.size = 13; previewTitle.textColor = 0xf39c12;
  previewTitle.x = 48; previewTitle.y = y + 8;
  list.addChild(previewTitle);
  var previewIcon = new eui.Image();
  this.fitImageToBox(previewIcon, UI_ASSETS.topHudDiamond, 32, 32, 10, y + 8);
  list.addChild(previewIcon);

  var newGems = this.rebirthGems + gemsGain;
  var newDmgMult = CONFIG.rebirthDamageMult(newGems);
  var newSupportMult = CONFIG.rebirthSupportMult(newGems);
  var previewText = '本次获得 💎 ' + gemsGain + ' = 新BOSS×2 + 章节×5 + 等级奖励' + plan.levelBonus + '\n' +
    '累计: ' + newGems + '  主角×' + newDmgMult.toFixed(2) + '  队友×' + newSupportMult.toFixed(2);
  var preview = new eui.Label();
  preview.text = previewText; preview.size = 12; preview.textColor = 0xffd700;
  preview.x = 48; preview.y = y + 32; preview.width = listW - 58; preview.lineSpacing = 4;
  list.addChild(preview);
  y += 92;

  var talentTitleIcon = new eui.Image();
  this.fitImageToBox(talentTitleIcon, MODULE_ICON_ASSETS.rebirthTalent, 24, 24, 0, y - 4);
  list.addChild(talentTitleIcon);
  var talentTitle = new eui.Label();
  talentTitle.text = '转生天赋'; talentTitle.size = 13; talentTitle.textColor = 0xc7a7ff; talentTitle.bold = true;
  talentTitle.x = 30; talentTitle.y = y;
  list.addChild(talentTitle);
  y += 22;

  this.ensureRebirthTalents();
  var cardW = Math.floor((listW - 8) / 2);
  var cardH = 78;
  for (var ti = 0; ti < REBIRTH_TALENTS.length; ti++) {
    var talent = REBIRTH_TALENTS[ti];
    var lv = this.rebirthTalents[ti] || 0;
    var cost = this.getRebirthTalentCost(ti);
    var col = ti % 2;
    var row = Math.floor(ti / 2);
    var x = col * (cardW + 8);
    var cy = y + row * (cardH + 8);
    var bg = new eui.Rect();
    bg.width = cardW; bg.height = cardH; bg.fillColor = 0x1a153f;
    bg.ellipseWidth = 8; bg.ellipseHeight = 8;
    bg.strokeColor = talent.color; bg.strokeWeight = 1; bg.strokeAlpha = lv > 0 ? 0.75 : 0.35;
    bg.x = x; bg.y = cy;
    list.addChild(bg);
    var iconBg = new eui.Rect();
    iconBg.width = 34; iconBg.height = 34; iconBg.ellipseWidth = 8; iconBg.ellipseHeight = 8;
    iconBg.fillColor = talent.color; iconBg.x = x + 8; iconBg.y = cy + 8;
    list.addChild(iconBg);
    var talentIconImg = new eui.Image();
    this.fitImageToBox(talentIconImg, MODULE_ICON_ASSETS.rebirthTalent, 30, 30, iconBg.x + 2, iconBg.y + 2);
    list.addChild(talentIconImg);
    var name = new eui.Label();
    name.text = talent.name + ' Lv.' + lv + '/' + talent.max; name.size = 11; name.bold = true; name.textColor = 0xffffff;
    name.x = x + 48; name.y = cy + 8; name.width = cardW - 54;
    list.addChild(name);
    var desc = new eui.Label();
    desc.text = talent.desc + ' +' + Math.floor(lv * talent.per * 100) + '%'; desc.size = 9; desc.textColor = THEME.textDim;
    desc.x = x + 48; desc.y = cy + 27; desc.width = cardW - 54;
    list.addChild(desc);
    (function(idx, def, level, c, bx, by) {
      var full = level >= def.max;
      var tBtn = self.createButton(full ? '满级' : ('💎' + c), full ? 0x555555 : 0x8e44ad, 58, 22, function() {
        self.upgradeRebirthTalent(idx);
      }, self);
      tBtn.x = bx + cardW - 66; tBtn.y = by + 48;
      if (full || self.rebirthGems < c) {
        tBtn.alpha = 0.45;
        tBtn.touchEnabled = false;
        tBtn.touchChildren = false;
      }
      list.addChild(tBtn);
    })(ti, talent, lv, cost, x, cy);
  }
  y += Math.ceil(REBIRTH_TALENTS.length / 2) * (cardH + 8) + 2;

  // 转生代价说明
  var costBg = new eui.Rect();
  costBg.width = listW; costBg.height = 92; costBg.fillColor = 0x2c1340;
  costBg.ellipseWidth = 8; costBg.x = 0; costBg.y = y;
  list.addChild(costBg);

  var costText = new eui.Label();
  costText.text = '策略：不要一能转就转。建议打完一整章，或连续挑战BOSS明显卡住时再转。\n重置：等级、波次、金币、技能等级、辅助招募。\n保留：宝石、秘宝装备、成就、历史最高、图签、邮件、BOSS阶段加成。';
  costText.size = 10; costText.textColor = 0xff9f9f;
  costText.x = 50; costText.y = y + 10; costText.width = listW - 60; costText.lineSpacing = 5;
  costText.wordWrap = true;
  list.addChild(costText);
  var costIcon = new eui.Image();
  this.fitImageToBox(costIcon, MODULE_ICON_ASSETS.rebirthHourglass, 34, 34, 10, y + 28);
  list.addChild(costIcon);
  y += 106;

  // 转生条件提示
  var condText = new eui.Label();
  if (canRebirth) {
    condText.text = '✅ ' + plan.reason;
    condText.textColor = 0x2ecc71;
  } else {
    condText.text = '❌ ' + plan.reason;
    condText.textColor = 0xe74c3c;
  }
  condText.size = 12; condText.x = 0; condText.y = y; condText.width = listW;
  list.addChild(condText);
  y += 34;

  // 转生按钮
  var btn = this.createButton(
    canRebirth ? '确认转生 (+💎' + gemsGain + ')' : '无法转生',
    canRebirth ? 0x8e44ad : 0x555555,
    160, 40,
    function() {
      if (canRebirth) self.openRebirthConfirm(gemsGain);
    },
    this
  );
  btn.x = Math.floor((listW - 160) / 2); btn.y = y;
  if (!canRebirth) {
    btn.alpha = 0.4;
    btn.touchEnabled = false;
    btn.touchChildren = false;
  }
  list.addChild(btn);
  y += 52;
  list.height = y;
};

Game.prototype.openRebirthConfirm = function(gemsGain) {
  var plan = this.getRebirthPlan();
  if (!plan.canRebirth) { this.showToast(plan.reason); return; }
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 292);

  var title = new eui.Label();
  title.text = '确认转生'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var warn = new eui.Label();
  warn.text = '这是一次战略重开，会清空本轮等级、金币、技能强化和辅助招募，秘宝装备会保留。\n\n你将获得 💎 ' + plan.gemsGain + ' 转生宝石，并从第1波重新开始。建议确认当前BOSS已经明显打不过，或刚打完一整章。';
  warn.size = 12; warn.textColor = 0xffc7c7;
  warn.x = panel._contentX; warn.y = 58; warn.width = panel._contentW; warn.lineSpacing = 6;
  warn.wordWrap = true;
  panel.addChild(warn);

  var self = this;
  var cancelBtn = this.createButton('再想想', 0x555555, 100, 34, function() {
    self.closePanel();
    self.openRebirth();
  }, this);
  cancelBtn.x = panel._contentX + 24; cancelBtn.y = 216;
  panel.addChild(cancelBtn);

  var okBtn = this.createButton('确认转生', 0x8e44ad, 112, 34, function() {
    self.doRebirth(gemsGain);
  }, this);
  okBtn.x = panel._contentX + panel._contentW - 136; okBtn.y = 216;
  panel.addChild(okBtn);
};

Game.prototype.doRebirth = function(gemsGain) {
  var plan = this.getRebirthPlan();
  if (!plan.canRebirth) {
    this.showToast(plan.reason);
    return;
  }
  gemsGain = plan.gemsGain;
  // 增加宝石
  this.rebirthGems += gemsGain;
  this.lastRebirthBossStage = plan.highestBossStage;
  this.rebirthCount = (this.rebirthCount || 0) + 1;
  // 重置游戏状态
  this.gold = 0;
  this.energy = 100;
  this.mainLevel = 1;
  this.playerHp = this.getMaxPlayerHp();
  this.wave = 1;
  this.totalCleared = 0;
  this.killCount = 0;
  this.skillCD = [0,0,0,0,0,0,0];
  this.skillUnlocked = [true,false,false,false,false,false,false];
  this.skillLevels = [1,1,1,1,1,1,1];
  this.supports = SUPPORTS_DEF.map(function(s) {
    return { name: s.name, dps: s.dps, wave: s.wave, level: 1, unlocked: false, notified: false };
  });
  this.monsters = [];
  this.ensureRelics();
  this.pendingBossReward = null;
  this.bossCounter = null;
  this.stopBossTimer();
  // 保留: rebirthGems, maxWaveReached, achievements, stats

  this.saveGame();
  this.closePanel();
  this.showToast('💎 转生成功！获得 ' + gemsGain + ' 宝石');
  this.updateUI();
  this.refreshSupportViews(); // 刷新左右辅助角色外观（已重置为未解锁状态）
  this.spawnWave();
};

// ==================== 签到系统 ====================

Game.prototype.checkDailyCheckin = function() {
  var today = new Date().toDateString();
  if (this.checkinDate === today) return;
  if (this.checkinDate) {
    var lastDate = new Date(this.checkinDate);
    var diff = Math.floor((new Date(today) - lastDate) / 86400000);
    if (diff > 1) this.checkinDay = 0;
  }
};

Game.prototype.openCheckin = function(auto) {
  var today = new Date().toDateString();
  var alreadyChecked = this.checkinDate === today;
  var day = alreadyChecked ? this.checkinDay : (this.checkinDay % 7);

  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 366);

  var title = new eui.Label();
  title.text = '📅 每日签到'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var contText = new eui.Label();
  contText.text = alreadyChecked ? '今日已领取，明天继续累计连续签到。' : '今天可领取第' + (day + 1) + '天奖励。';
  contText.size = 11; contText.textColor = 0xaaaaaa;
  contText.x = panel._contentX; contText.top = 164; contText.width = panel._contentW;
  contText.textAlign = 'center';
  panel.addChild(contText);

  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '连续签到', this.checkinDay + '天', THEME.mint);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '今日状态', alreadyChecked ? '已领取' : '可领取', alreadyChecked ? THEME.textDim : THEME.textGold);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '金币奖励', '随天数递增', THEME.sky);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '额外奖励', '秘宝/券', THEME.accentSoft);

  var cardW = 72;
  var cardH = 78;
  var gapX = Math.floor((panel._contentW - cardW * 4) / 3);
  var startX = panel._contentX;
  for (var i = 0; i < CHECKIN_REWARDS.length; i++) {
    var r = CHECKIN_REWARDS[i];
    var done = alreadyChecked ? i < day : i < day;
    var isToday = !alreadyChecked && i === day;
    var col = i % 4; var row = Math.floor(i / 4);
    var cx = startX + col * (cardW + gapX); var cy = 190 + row * 88;

    var itemBg = new eui.Rect();
    itemBg.width = cardW; itemBg.height = cardH; itemBg.ellipseWidth = 8; itemBg.ellipseHeight = 8;
    itemBg.fillColor = isToday ? 0x2a3f5c : 0x1a153f;
    itemBg.x = cx; itemBg.y = cy;
    if (isToday) { itemBg.strokeWeight = 2; itemBg.strokeColor = 0x2ecc71; }
    panel.addChild(itemBg);

    var dayLb = new eui.Label();
    dayLb.text = '第' + (i+1) + '天'; dayLb.size = 10; dayLb.textColor = 0xaaaaaa;
    dayLb.x = cx + 4; dayLb.y = cy + 6;
    panel.addChild(dayLb);

    var rewardLb = new eui.Label();
    rewardLb.text = '💰' + r.gold + (r.bonus ? ' + ' + r.bonus.icon : '');
    rewardLb.size = 10; rewardLb.textColor = 0xffd700;
    rewardLb.x = cx + 4; rewardLb.y = cy + 30;
    rewardLb.width = cardW - 8; rewardLb.textAlign = 'center';
    panel.addChild(rewardLb);

    if (done) {
      var check = new eui.Label();
      check.text = '✓'; check.size = 18; check.textColor = 0x2ecc71;
      check.x = cx + 52; check.y = cy + 4;
      panel.addChild(check);
    }
  }

  var self = this;
  var signBtn = this.createButton(
    alreadyChecked ? '今日已签到' : '签到领取',
    alreadyChecked ? 0x555555 : 0x27ae60,
    120, 36,
    function() { self.doCheckin(); },
    this
  );
  signBtn.horizontalCenter = 0; signBtn.bottom = 16;
  if (alreadyChecked) signBtn.alpha = 0.4;
  panel.addChild(signBtn);
};

Game.prototype.doCheckin = function() {
  var today = new Date().toDateString();
  if (this.checkinDate === today) { this.showToast('今日已签到！'); return; }
  var day = this.checkinDay % 7;
  var reward = CHECKIN_REWARDS[day];
  this.gold += reward.gold;
  if (reward.bonus) {
    if (reward.bonus.name === '幸运券') {
      this.spinTickets = (this.spinTickets || 0) + 1;
    } else if (!this.addRelic(reward.bonus.name, 1)) {
      this.spinTickets = (this.spinTickets || 0) + 1;
    }
    this.showToast('📅 签到奖励: ' + reward.gold + '金 + ' + reward.bonus.icon + '×1');
  } else {
    this.showToast('📅 签到奖励: ' + reward.gold + '金');
  }
  this.checkinDay++;
  this.checkinDate = today;
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openCheckin();
};

// ==================== 每日任务 ====================

Game.prototype.resetDailyTasks = function() {
  var today = new Date().toDateString();
  if (this.dailyTaskDate !== today) {
    this.dailyTaskDate = today;
    this.dailyTaskDone = [false, false, false];
    this.dailyTaskClaimed = [false, false, false];
    this.stats._dailyKills = 0;
    this.stats._dailyClicks = 0;
    this.stats._dailyWaves = 0;
  }
  if (!this.dailyTaskClaimed) this.dailyTaskClaimed = [false, false, false];
  while (this.dailyTaskClaimed.length < DAILY_TASKS.length) this.dailyTaskClaimed.push(false);
};

Game.prototype.checkDailyTasks = function(type) {
  this.resetDailyTasks();
  if (type === 'kill') this.stats._dailyKills = (this.stats._dailyKills || 0) + 1;
  if (type === 'click') this.stats._dailyClicks = (this.stats._dailyClicks || 0) + 1;
  if (type === 'wave') this.stats._dailyWaves = (this.stats._dailyWaves || 0) + 1;
  for (var i = 0; i < DAILY_TASKS.length; i++) {
    var t = DAILY_TASKS[i];
    if (!this.dailyTaskDone[i] && !this.dailyTaskClaimed[i] && t.track(this.stats) >= t.target) {
      this.dailyTaskDone[i] = true;
      this.showToast('📋 任务完成: ' + t.desc + '！');
    }
  }
};

Game.prototype.openDailyTasks = function() {
  this.resetDailyTasks();
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, 430);

  var title = new eui.Label();
  title.text = '📋 每日任务'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var self = this;
  var claimedCount = 0;
  var doneCount = 0;
  for (var ci = 0; ci < DAILY_TASKS.length; ci++) {
    if (this.dailyTaskClaimed[ci]) claimedCount++;
    if (this.dailyTaskDone[ci]) doneCount++;
  }
  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '今日击杀', String(this.stats._dailyKills || 0), THEME.sky);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '今日点击', String(this.stats._dailyClicks || 0), THEME.accentSoft);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '推进波次', String(this.stats._dailyWaves || 0), THEME.mint);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '完成进度', claimedCount + '/' + DAILY_TASKS.length, THEME.textGold);

  var y = 174;

  for (var i = 0; i < DAILY_TASKS.length; i++) {
    var t = DAILY_TASKS[i];
    var done = this.dailyTaskDone[i];
    var claimed = this.dailyTaskClaimed[i];
    var progress = Math.min(t.track(this.stats), t.target);
    var pct = progress / t.target;

    var rowBg = new eui.Rect();
    rowBg.width = panel._contentW; rowBg.height = 58; rowBg.fillColor = 0x1a153f;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.x = panel._contentX; rowBg.y = y;
    panel.addChild(rowBg);

    var iconBg = new eui.Rect();
    iconBg.width = 32; iconBg.height = 32; iconBg.ellipseWidth = 16; iconBg.ellipseHeight = 16;
    iconBg.fillColor = claimed ? 0x555555 : (done ? 0x2ecc71 : 0x3498db);
    iconBg.x = panel._contentX + 8; iconBg.y = y + 13;
    panel.addChild(iconBg);

    var iconLb = new eui.Label();
    iconLb.text = claimed ? '领' : (done ? '✓' : '📋'); iconLb.size = claimed ? 11 : 14;
    iconLb.x = iconBg.x + 9; iconLb.y = y + 20;
    panel.addChild(iconLb);

    var descLb = new eui.Label();
    descLb.text = t.desc; descLb.size = 12; descLb.textColor = 0xcccccc;
    descLb.x = panel._contentX + 50; descLb.y = y + 8;
    descLb.width = panel._contentW - 128;
    panel.addChild(descLb);

    var progBg = new eui.Rect();
    progBg.width = 140; progBg.height = 6; progBg.fillColor = 0x140e36;
    progBg.x = panel._contentX + 50; progBg.y = y + 31;
    panel.addChild(progBg);

    var progFill = new eui.Rect();
    progFill.width = 140 * pct; progFill.height = 6; progFill.fillColor = 0x2ecc71;
    progFill.x = panel._contentX + 50; progFill.y = y + 31;
    panel.addChild(progFill);

    var progText = new eui.Label();
    progText.text = progress + '/' + t.target; progText.size = 10; progText.textColor = 0x888888;
    progText.x = panel._contentX + 196; progText.y = y + 28;
    progText.width = 44; progText.textAlign = 'right';
    panel.addChild(progText);

    if (done && !claimed) {
      (function(idx) {
        var claimBtn = self.createButton('+' + DAILY_TASKS[idx].reward + '金', 0x27ae60, 60, 26,
          function() { self.claimTask(idx); }, self);
        claimBtn.x = panel._contentX + panel._contentW - 70; claimBtn.y = y + 16;
        panel.addChild(claimBtn);
      })(i);
    } else if (claimed) {
      var claimedLb = new eui.Label();
      claimedLb.text = '已领'; claimedLb.size = 11; claimedLb.textColor = 0x888888;
      claimedLb.x = panel._contentX + panel._contentW - 52; claimedLb.y = y + 23;
      claimedLb.width = 42; claimedLb.textAlign = 'center';
      panel.addChild(claimedLb);
    }

    y += 62;
  }
  this.setPanelContentHeight(panel, y + 16);
};

Game.prototype.claimTask = function(idx) {
  this.resetDailyTasks();
  if (!this.dailyTaskDone[idx] || this.dailyTaskClaimed[idx]) return;
  var t = DAILY_TASKS[idx];
  this.gold += t.reward;
  this.showToast('📋 领取奖励: ' + t.reward + '金');
  this.dailyTaskClaimed[idx] = true;
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openDailyTasks();
};

// ==================== 成就系统 ====================

Game.prototype.checkAchievements = function() {
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i];
    if (this.achievements.indexOf(a.id) >= 0) continue;
    if (a.check(this)) {
      this.achievements.push(a.id);
      this.gold += a.reward;
      this.showToast('🏆 成就达成: ' + a.name + '！+' + a.reward + '金');
    }
  }
};

Game.prototype.openAchievements = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, Math.min(500, (overlay.height || 667) - 74));

  var title = new eui.Label();
  title.text = '🏆 成就';
  title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  var completePct = ACHIEVEMENTS.length ? Math.floor(this.achievements.length / ACHIEVEMENTS.length * 100) : 0;
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '完成数量', this.achievements.length + '/' + ACHIEVEMENTS.length, THEME.textGold);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '完成率', completePct + '%', THEME.mint);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '最高波次', '第' + this.maxWaveReached + '波', THEME.sky);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '击杀BOSS', this.fmt(this.stats ? this.stats.bossKills : 0), THEME.danger);

  // F4：成就是「达成即自动发放」，不是待领取奖励；同时给出下一个可追的目标。
  var nextTarget = null;
  for (var ni = 0; ni < ACHIEVEMENTS.length; ni++) {
    if (this.achievements.indexOf(ACHIEVEMENTS[ni].id) < 0) { nextTarget = ACHIEVEMENTS[ni]; break; }
  }
  var achHint = new eui.Label();
  achHint.text = nextTarget
    ? ('达成即自动发放金币，无需领取  ·  下一个：' + nextTarget.name + '（+' + nextTarget.reward + '金）')
    : '全部成就已达成，奖励均已自动发放';
  achHint.size = 9; achHint.textColor = THEME.textDim;
  achHint.x = panel._contentX; achHint.y = 158;
  achHint.width = panel._contentW;
  panel.addChild(achHint);

  var list = this.createPanelScrollContent(panel, 186, 14);
  var listW = panel._contentW;
  var y = 0;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i];
    var completed = this.achievements.indexOf(a.id) >= 0;

    var rowBg = new eui.Rect();
    rowBg.width = listW; rowBg.height = 44; rowBg.fillColor = 0x1a153f;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.x = 0; rowBg.y = y;
    rowBg.alpha = completed ? 1 : 0.5;
    list.addChild(rowBg);

    var iconBg = new eui.Rect();
    iconBg.width = 32; iconBg.height = 32; iconBg.ellipseWidth = 16; iconBg.ellipseHeight = 16;
    iconBg.fillColor = completed ? 0xf39c12 : 0x555555;
    iconBg.x = 8; iconBg.y = y + 6;
    list.addChild(iconBg);

    var nameLb = new eui.Label();
    nameLb.text = a.name; nameLb.size = 12; nameLb.textColor = completed ? 0xffffff : 0x888888;
    nameLb.x = 50; nameLb.y = y + 6;
    nameLb.width = listW - 126;
    list.addChild(nameLb);

    var descLb = new eui.Label();
    descLb.text = a.desc; descLb.size = 10; descLb.textColor = 0x888888;
    descLb.x = 50; descLb.y = y + 24;
    descLb.width = listW - 126;
    list.addChild(descLb);

    var rewardLb = new eui.Label();
    rewardLb.text = completed ? '✓ 已发 +' + a.reward + '金' : '待达成 +' + a.reward + '金';
    rewardLb.size = 10; rewardLb.textColor = completed ? 0xffd700 : 0x666666;
    rewardLb.x = listW - 88; rewardLb.y = y + 14;
    rewardLb.width = 78; rewardLb.textAlign = 'right';
    list.addChild(rewardLb);

    y += 50;
  }
  list.height = y + 4;
};

// ==================== 图签系统（怪物图鉴） ====================

// S1/H-1：图签新发现 toast 节流。只做提示合并，不改动 monsterCodex 记录逻辑。
// 窗口内的后续发现累计，窗口结束后合并成一条计数提示，避免连续击杀时刷屏。
Game.prototype.notifyCodexDiscovery = function(name) {
  var now = Date.now ? Date.now() : new Date().getTime();
  var WINDOW_MS = 1500;
  if (this._codexToastAt && now - this._codexToastAt < WINDOW_MS) {
    this._codexToastPending = (this._codexToastPending || 0) + 1;
    return;
  }
  var pending = this._codexToastPending || 0;
  this._codexToastAt = now;
  this._codexToastPending = 0;
  if (pending > 0) this.showToast('📖 新图签 ×' + (pending + 1) + '（已合并提示）');
  else this.showToast('📖 新图签！发现【' + name + '】');
};

Game.prototype.openMonsterCodex = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, Math.min(620, (overlay.height || 667) - 74));

  var discovered = 0;
  var totalKills = 0;
  var totalResearch = 0;
  for (var i = 0; i < MONSTER_TYPES.length; i++) {
    var normalEntry = this.monsterCodex[MONSTER_TYPES[i].shape];
    if (normalEntry) {
      discovered++;
      totalKills += normalEntry.kills || 0;
      totalResearch += this.getCodexResearchLevel(MONSTER_TYPES[i].shape, false);
    }
  }
  var bossDiscovered = 0;
  for (var i = 0; i < BOSS_TYPES.length; i++) {
    var bossEntry = this.monsterCodex[BOSS_TYPES[i].shape];
    if (bossEntry) {
      bossDiscovered++;
      totalKills += bossEntry.kills || 0;
      totalResearch += this.getCodexResearchLevel(BOSS_TYPES[i].shape, true);
    }
  }
  var hiddenDiscovered = 0;
  for (var hi = 0; hi < HIDDEN_MONSTER_TYPES.length; hi++) {
    var hiddenEntry = this.monsterCodex[HIDDEN_MONSTER_TYPES[hi].shape];
    if (hiddenEntry) {
      hiddenDiscovered++;
      totalKills += hiddenEntry.kills || 0;
      totalResearch += this.getCodexResearchLevel(HIDDEN_MONSTER_TYPES[hi].shape, false);
    }
  }
  var total = MONSTER_TYPES.length + HIDDEN_MONSTER_TYPES.length + BOSS_TYPES.length;
  var foundTotal = discovered + bossDiscovered;
  foundTotal += hiddenDiscovered;
  var progressPct = total ? Math.floor(foundTotal / total * 100) : 0;

  var title = new eui.Label();
  title.text = '图签收藏';
  title.size = 18; title.textColor = THEME.accentSoft; title.bold = true;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var titleIcon = new eui.Image();
  this.fitImageToBox(titleIcon, CODEX_ICON_ASSETS.book, 28, 28, Math.floor(panel.width / 2) - 74, 10);
  panel.addChild(titleIcon);

  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '收集进度', foundTotal + '/' + total + ' · ' + progressPct + '%', THEME.textGold);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '普通/隐藏', discovered + '+' + hiddenDiscovered + '/' + (MONSTER_TYPES.length + HIDDEN_MONSTER_TYPES.length), THEME.sky);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, 'BOSS 图签', bossDiscovered + '/' + BOSS_TYPES.length, 0xff8888);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '击杀研究', this.fmt(totalKills) + ' / Lv.' + totalResearch, THEME.accentSoft);

  var guideBg = new eui.Rect();
  guideBg.width = panel._contentW; guideBg.height = 42;
  guideBg.x = panel._contentX; guideBg.y = 166;
  guideBg.ellipseWidth = 10; guideBg.ellipseHeight = 10;
  guideBg.fillColor = 0x151038;
  guideBg.strokeColor = THEME.strokeSoft; guideBg.strokeWeight = 1; guideBg.strokeAlpha = 0.44;
  panel.addChild(guideBg);

  var guideIcon = new eui.Image();
  this.fitImageToBox(guideIcon, CODEX_ICON_ASSETS.research, 30, 30, panel._contentX + 8, 172);
  panel.addChild(guideIcon);

  var guide = new eui.Label();
  guide.text = '发现怪物后记录击杀，研究等级会提供对应克制伤害。';
  guide.size = 11; guide.textColor = THEME.textDim;
  guide.x = panel._contentX + 46; guide.y = 178; guide.width = panel._contentW - 56;
  guide.wordWrap = true;
  panel.addChild(guide);

  var list = this.createPanelScrollContent(panel, 222, 14);
  var listW = panel._contentW;
  var self = this;
  var y = 0;

  function addSection(iconAsset, text, subText, color) {
    var secBg = new eui.Rect();
    secBg.width = listW; secBg.height = 38;
    secBg.x = 0; secBg.y = y;
    secBg.ellipseWidth = 10; secBg.ellipseHeight = 10;
    secBg.fillColor = 0x100b2f;
    secBg.strokeColor = color; secBg.strokeWeight = 1; secBg.strokeAlpha = 0.45;
    list.addChild(secBg);

    var secIcon = new eui.Image();
    self.fitImageToBox(secIcon, iconAsset, 30, 30, 8, y + 4);
    list.addChild(secIcon);

    var secTitle = new eui.Label();
    secTitle.text = text; secTitle.size = 13; secTitle.bold = true; secTitle.textColor = color;
    secTitle.x = 46; secTitle.y = y + 6; secTitle.width = listW - 56;
    list.addChild(secTitle);

    var secSub = new eui.Label();
    secSub.text = subText; secSub.size = 9; secSub.textColor = THEME.textDim;
    secSub.x = 46; secSub.y = y + 23; secSub.width = listW - 56;
    list.addChild(secSub);
    y += 48;
  }

  function renderCard(mt, isBossType, isHiddenCard) {
    var codexEntry = self.monsterCodex[mt.shape];
    var found = !!codexEntry;
    var researchLv = found ? self.getCodexResearchLevel(mt.shape, isBossType) : 0;
    var bonusPct = Math.floor(self.getCodexDamageBonus(mt.shape, isBossType) * 100);
    var nextResearch = found ? self.getCodexNextResearchKills(mt.shape, isBossType) : null;
    var cardH = 98;
    var cx2 = 0;
    var cy2 = y;
    var color = found ? (isBossType ? 0xff6666 : (mt.badge || THEME.sky)) : 0x3b3654;

    var cardBg = new eui.Rect();
    cardBg.width = listW; cardBg.height = cardH;
    cardBg.ellipseWidth = 10; cardBg.ellipseHeight = 10;
    cardBg.fillColor = found ? (isBossType ? 0x24102a : 0x0e1a2a) : 0x14121f;
    cardBg.strokeColor = color;
    cardBg.strokeWeight = 1; cardBg.strokeAlpha = found ? 0.62 : 0.3;
    cardBg.x = cx2; cardBg.y = cy2;
    list.addChild(cardBg);

    var classIcon = new eui.Image();
    self.fitImageToBox(classIcon, isBossType ? CODEX_ICON_ASSETS.boss : CODEX_ICON_ASSETS.monster, 24, 24, cx2 + listW - 34, cy2 + 8);
    classIcon.alpha = found ? 1 : 0.38;
    list.addChild(classIcon);

    var thumbBg = new eui.Rect();
    thumbBg.width = 60; thumbBg.height = 60;
    thumbBg.x = cx2 + 10; thumbBg.y = cy2 + 18;
    thumbBg.ellipseWidth = 12; thumbBg.ellipseHeight = 12;
    thumbBg.fillColor = found ? 0x09071a : 0x1b1729;
    thumbBg.strokeColor = color; thumbBg.strokeWeight = 1; thumbBg.strokeAlpha = found ? 0.7 : 0.28;
    list.addChild(thumbBg);

    if (found) {
      var thumbImg = new eui.Image();
      self.fitImageToBox(thumbImg, self.monsterSpriteSource(mt, isBossType), isBossType ? 56 : 52, isBossType ? 56 : 52, thumbBg.x + (isBossType ? 2 : 4), thumbBg.y + (isBossType ? 2 : 4));
      list.addChild(thumbImg);
    } else {
      var unknownImg = new eui.Image();
      self.fitImageToBox(unknownImg, CODEX_ICON_ASSETS.unknown, 52, 52, thumbBg.x + 4, thumbBg.y + 4);
      unknownImg.alpha = 0.74;
      list.addChild(unknownImg);
    }

    var nameLb2 = new eui.Label();
    nameLb2.text = found ? mt.name : (isHiddenCard ? '隐藏目标' : '未知目标');
    nameLb2.size = 13; nameLb2.bold = true;
    nameLb2.textColor = found ? (isBossType ? 0xff8888 : 0xffffff) : 0x555555;
    nameLb2.x = cx2 + 82; nameLb2.y = cy2 + 10;
    nameLb2.width = listW - 128;
    list.addChild(nameLb2);

    var weakInfo = self.getDamageTypeName(mt.weakness) + '弱  物防' + (mt.armor || 0) + ' / 法抗' + (mt.resist || 0);
    var waveText = found ? ('出现：' + (mt.wave || (isBossType ? '每10波' : '?'))) : (isHiddenCard ? (mt.unlockHint || '稀有遭遇') : '继续推进关卡后解锁记录');
    var statText = found ? ('击杀 ' + (codexEntry.kills || 0) + '  研究 Lv.' + researchLv) : '未发现';
    var weakText = found ? weakInfo : (isHiddenCard ? weakInfo : '弱点与抗性未知');
    var bonusText = found ? ('克制 +' + bonusPct + '%' + (nextResearch ? '  下级 ' + nextResearch + '击杀' : '  已满研')) : '发现后开放研究加成';
    var featureText = self.getMonsterFeatureText(mt, found);

    var meta1 = new eui.Label();
    meta1.text = waveText + '\n' + statText + '  ·  ' + featureText;
    meta1.size = 10; meta1.textColor = found ? THEME.textDim : 0x666666;
    meta1.x = cx2 + 82; meta1.y = cy2 + 31; meta1.width = listW - 126;
    meta1.lineSpacing = 4;
    list.addChild(meta1);

    var weaknessIcon = new eui.Image();
    self.fitImageToBox(weaknessIcon, CODEX_ICON_ASSETS.weakness, 17, 17, cx2 + 82, cy2 + 68);
    weaknessIcon.alpha = found ? 1 : 0.35;
    list.addChild(weaknessIcon);

    var weakLb = new eui.Label();
    weakLb.text = weakText;
    weakLb.size = 9; weakLb.textColor = found ? THEME.accentSoft : 0x666666;
    weakLb.x = cx2 + 104; weakLb.y = cy2 + 71; weakLb.width = Math.floor((listW - 122) * 0.52);
    list.addChild(weakLb);

    var researchIcon = new eui.Image();
    self.fitImageToBox(researchIcon, CODEX_ICON_ASSETS.research, 17, 17, cx2 + Math.floor(listW * 0.62), cy2 + 68);
    researchIcon.alpha = found ? 1 : 0.35;
    list.addChild(researchIcon);

    var researchLb = new eui.Label();
    researchLb.text = bonusText;
    researchLb.size = 9; researchLb.textColor = found ? THEME.textGold : 0x666666;
    researchLb.x = cx2 + Math.floor(listW * 0.62) + 22; researchLb.y = cy2 + 71;
    researchLb.width = listW - researchLb.x - 8;
    list.addChild(researchLb);

    if (isBossType && found) {
      var bossTagBg = new eui.Rect();
      bossTagBg.width = 34; bossTagBg.height = 16;
      bossTagBg.ellipseWidth = 8; bossTagBg.ellipseHeight = 8;
      bossTagBg.fillColor = 0x641313; bossTagBg.x = cx2 + listW - 76; bossTagBg.y = cy2 + 12;
      bossTagBg.strokeColor = 0xff8888; bossTagBg.strokeWeight = 1; bossTagBg.strokeAlpha = 0.6;
      list.addChild(bossTagBg);
      var bossTag = new eui.Label();
      bossTag.text = 'BOSS'; bossTag.size = 8; bossTag.bold = true;
      bossTag.textColor = 0xffbbbb; bossTag.x = bossTagBg.x; bossTag.y = bossTagBg.y + 4;
      bossTag.width = bossTagBg.width; bossTag.textAlign = 'center';
      list.addChild(bossTag);
    }

    y += cardH + 8;
  }

  addSection(CODEX_ICON_ASSETS.monster, '普通怪物', '按首次出现波次排序，研究后提升克制伤害', THEME.sky);
  for (var i = 0; i < MONSTER_TYPES.length; i++) {
    renderCard(MONSTER_TYPES[i], false, false);
  }

  y += 4;
  addSection(CODEX_ICON_ASSETS.unknown, '隐藏怪物', '第 ' + HIDDEN_ENCOUNTER_MIN_WAVE + ' 波起稀有遭遇，共 ' + HIDDEN_MONSTER_TYPES.length + ' 只；发现后计入研究加成', 0xc7a7ff);
  for (var hi2 = 0; hi2 < HIDDEN_MONSTER_TYPES.length; hi2++) {
    renderCard(HIDDEN_MONSTER_TYPES[hi2], false, true);
  }

  y += 4;
  addSection(CODEX_ICON_ASSETS.boss, 'BOSS 图签', '每个章节阶段的关键敌人，记录弱点、抗性和研究进度', 0xff8888);
  for (var i = 0; i < BOSS_TYPES.length; i++) {
    renderCard(BOSS_TYPES[i], true, false);
  }

  list.height = y + 8;
};

// ==================== 离线收益 ====================

Game.prototype.checkOfflineReward = function() {
  try {
    if (this._offlineRewardShown) return;
    this._offlineRewardShown = true;
    var lastTime = parseInt(localStorage.getItem('gujiyouxi_egret_time') || '0');
    var now = Date.now();
    var elapsed = lastTime ? Math.max(0, Math.floor((now - lastTime) / 1000)) : 0;
    var maxOffline = this.offlineCap * 3600;
    var seconds = Math.min(Math.max(elapsed, 60), maxOffline);
    var dps = Math.max(1, this.totalDps());
    var reward = Math.max(1, Math.floor(dps * 0.1 * seconds));
    this.gold += reward;
    this.saveGame();
    var hours = Math.floor(seconds / 3600);
    var mins = Math.floor((seconds % 3600) / 60);
    var timeStr = hours > 0 ? hours + '小时' + mins + '分钟' : mins + '分钟';
    var timeHint = elapsed >= 60 ? '你离开了 ' + timeStr : '本次登录奖励，按1分钟计算';

    var self = this;
    self.safeTimeout('offlineReward', function() {
      try {
      var overlay = self.createPanelOverlay();
      var panel = new eui.Group();
      panel.width = 300; panel.height = 220;
      panel.horizontalCenter = 0; panel.verticalCenter = 0;
      var pBg = new eui.Rect();
      pBg.percentWidth = 100; pBg.percentHeight = 100;
      pBg.fillColor = 0x2a1f5c; pBg.ellipseWidth = 12; pBg.ellipseHeight = 12;
      panel.addChild(pBg);

      var t1 = new eui.Label();
      t1.text = '💤 离线收益'; t1.size = 18; t1.textColor = 0xffffff;
      t1.horizontalCenter = 0; t1.top = 20;
      panel.addChild(t1);

      var t2 = new eui.Label();
      t2.text = timeHint; t2.size = 12; t2.textColor = 0xaaaaaa;
      t2.horizontalCenter = 0; t2.top = 55;
      panel.addChild(t2);

      var t3 = new eui.Label();
      t3.text = '+' + self.fmt(reward) + ' 💰'; t3.size = 24; t3.textColor = 0xffd700;
      t3.horizontalCenter = 0; t3.top = 85;
      panel.addChild(t3);

      var t4 = new eui.Label();
      t4.text = 'DPS: ' + self.fmt(dps) + ' × 10% × ' + seconds + 's';
      t4.size = 11; t4.textColor = 0x666666;
      t4.horizontalCenter = 0; t4.top = 130;
      panel.addChild(t4);

      // S1/H-3：H5 无真实激励视频 SDK，按钮点一下就直接翻倍。文案必须说真话，
      // 但奖励逻辑（grantDoubleReward 的 doubled 单次守卫）一行不动。
      var canShowWxAd = false;
      try {
        canShowWxAd = typeof wx !== 'undefined' && !!wx && !!wx.createRewardedVideoAd &&
          typeof window !== 'undefined' && !!window.DMAX_OFFLINE_AD_UNIT_ID;
      } catch (e) { canShowWxAd = false; }

      var t5 = new eui.Label();
      t5.text = canShowWxAd ? '观看广告后收益翻倍' : '浏览器版无需广告，点击直接领取双倍';
      t5.size = 10; t5.textColor = 0x8f86c9;
      t5.horizontalCenter = 0; t5.top = 146;
      panel.addChild(t5);

      var doubled = false;
      var grantDoubleReward = function() {
        if (doubled) return;
        doubled = true;
        self.gold += reward; // 再加一次，等效 ×2
        t3.text = '+' + self.fmt(reward * 2) + ' 💰 (×2)';
        // S1/H-3：不再关闭 touchEnabled，置灰后仍可点击，由回调给出「已翻倍」反馈。
        adBtn.alpha = 0.4;
        var adLb = adBtn.getChildAt(1);
        if (adLb) adLb.text = '✓ 已翻倍';
        self.showToast('💰 收益已翻倍！');
        self.updateUI();
        self.saveGame();
      };
      var adBtn = self.createButton(canShowWxAd ? '📺 看广告 ×2' : '🎁 领取双倍收益', 0x27ae60, 150, 36, function() {
        // S1/H-3：二次点击给明确 toast，不再默默无响应；不重复发奖。
        if (doubled) { self.showToast('本次离线收益已翻倍'); return; }
        var wxApi = typeof wx !== 'undefined' ? wx : null;
        var adUnitId = typeof window !== 'undefined' ? (window.DMAX_OFFLINE_AD_UNIT_ID || '') : '';
        if (wxApi && wxApi.createRewardedVideoAd && adUnitId) {
          var ad = wxApi.createRewardedVideoAd({ adUnitId: adUnitId });
          var cleanup = function() {
            if (ad.offClose) ad.offClose(onClose);
            if (ad.offError) ad.offError(onError);
          };
          var onClose = function(res) {
            cleanup();
            if (!res || res.isEnded) grantDoubleReward();
            else self.showToast('看完广告可获得2倍收益');
          };
          var onError = function() {
            cleanup();
            grantDoubleReward();
          };
          if (ad.onClose) ad.onClose(onClose);
          if (ad.onError) ad.onError(onError);
          ad.show().catch(function() {
            ad.load().then(function() { return ad.show(); }).catch(function() { grantDoubleReward(); });
          });
        } else {
          grantDoubleReward();
        }
      }, self);
      adBtn.horizontalCenter = 0; adBtn.top = 160;
      panel.addChild(adBtn);

      var btn = self.createButton('收下', 0xe74c3c, 100, 36, function() { self.closePanel(); }, self);
      btn.horizontalCenter = 0; btn.top = 210;
      panel.height = 260;
      panel.addChild(btn);

      overlay.addChild(panel);
      } catch (e) {
        // 异步回调不受外层 try 保护：中途抛错会让遮罩永久停留（与 §12 同类）。
        try { self.closePanel(); } catch (e2) {}
        self.reportRuntimeError(e, 'offlineReward');
      }
    }, 500);
  } catch(e) {}
};

// ==================== 音效系统（Web Audio 程序合成，无需外部文件） ====================

Game.prototype.initSound = function() {
  var oldMuted = localStorage.getItem('gujiyouxi_mute') === '1';
  var musicPref = localStorage.getItem('gujiyouxi_music_mute');
  var sfxPref = localStorage.getItem('gujiyouxi_sfx_mute');
  this.musicMuted = musicPref !== null ? musicPref === '1' : (!!this.musicMuted || oldMuted);
  this.sfxMuted = sfxPref !== null ? sfxPref === '1' : (!!this.sfxMuted || oldMuted);
  this.soundMuted = this.musicMuted && this.sfxMuted;
  this._audioCtx = null;
  this._masterGain = null;
  this._bgmGain = null;
  this._sfxGain = null;
  // 首次用户交互时再创建 AudioContext（浏览器自动播放策略要求）
  var self = this;
  var unlock = function() {
    self.ensureAudio();
    if (self._audioCtx && self._audioCtx.state === 'suspended') {
      self._audioCtx.resume();
    }
    if (!self.musicMuted) self.startBgm();
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('mousedown', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('touchstart', unlock);
  document.addEventListener('mousedown', unlock);
  document.addEventListener('keydown', unlock);
};

Game.prototype.ensureAudio = function() {
  if (this._audioCtx) return this._audioCtx;
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var ctx = new AC();
    this._audioCtx = ctx;
    this._masterGain = ctx.createGain();
    this._masterGain.gain.value = 0.9;
    this._masterGain.connect(ctx.destination);
    this._bgmGain = ctx.createGain();
    this._bgmGain.gain.value = 0.42;
    this._bgmGain.connect(this._masterGain);
    this._sfxGain = ctx.createGain();
    this._sfxGain.gain.value = 0.9;
    this._sfxGain.connect(this._masterGain);
  } catch(e) {
    this._audioCtx = null;
  }
  return this._audioCtx;
};

// 内部：播放一个 envelope 包络的 oscillator
Game.prototype._beep = function(opts) {
  var bus = opts && opts.bus === 'bgm' ? 'bgm' : 'sfx';
  if (bus === 'bgm' ? this.musicMuted : this.sfxMuted) return;
  var ctx = this.ensureAudio();
  if (!ctx) return;
  try {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = opts.type || 'sine';
    var freq = opts.freq || 440;
    var freqEnd = opts.freqEnd || freq;
    var now = ctx.currentTime + (opts.delay || 0);
    var dur = opts.duration || 0.12;
    osc.frequency.setValueAtTime(freq, now);
    if (freqEnd !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + dur);
    }
    var vol = opts.volume || 0.15;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(bus === 'bgm' && this._bgmGain ? this._bgmGain : (this._sfxGain || ctx.destination));
    osc.start(now);
    osc.stop(now + dur + 0.02);
    // V1-5：可选双振荡器。harmonic 缺省时严格保持上方单 osc 分支不变，
    // 其余 10 个 sfx* 调用音色零变化；第二 osc 与主 osc 共用同一 gain / 同一 bus。
    if (opts && opts.harmonic) {
      var osc2 = ctx.createOscillator();
      osc2.type = osc.type;
      osc2.frequency.setValueAtTime(Math.max(1, freq * opts.harmonic), now);
      osc2.connect(gain);
      osc2.start(now);
      osc2.stop(now + dur + 0.02);
    }
  } catch(e) {}
};

Game.prototype.startBgm = function() {
  if (this.musicMuted || this._bgmTimer) return;
  if (!this.ensureAudio()) return;
  var self = this;
  this._bgmStep = this._bgmStep || 0;
  function playStep() {
    if (self.musicMuted || !self._audioCtx) return;
    var melody = [523, 587, 659, 784, 740, 659, 587, 494, 523, 659, 784, 880, 784, 659, 587, 523];
    var bass = [130, 130, 196, 196, 174, 174, 146, 146];
    var step = self._bgmStep % melody.length;
    self._beep({ bus: 'bgm', type: 'triangle', freq: melody[step], duration: 0.24, volume: 0.025 });
    if (step % 2 === 0) self._beep({ bus: 'bgm', type: 'sine', freq: bass[Math.floor(step / 2) % bass.length], duration: 0.42, volume: 0.018 });
    if (step % 4 === 2) self._beep({ bus: 'bgm', type: 'sine', freq: melody[step] * 2, duration: 0.12, volume: 0.01 });
    self._bgmStep++;
  }
  playStep();
  this._bgmTimer = setInterval(playStep, 420);
};

Game.prototype.stopBgm = function() {
  if (this._bgmTimer) {
    clearInterval(this._bgmTimer);
    this._bgmTimer = null;
  }
};

// --- 对外音效 + 静音切换 ---
Game.prototype.sfxClick = function() {
  this._beep({ type: 'square', freq: 880, freqEnd: 660, duration: 0.06, volume: 0.08 });
};
Game.prototype.sfxAttack = function() {
  this._beep({ type: 'triangle', freq: 360, freqEnd: 180, duration: 0.09, volume: 0.09 });
  this._beep({ type: 'square', freq: 620, freqEnd: 360, duration: 0.05, volume: 0.045, delay: 0.025 });
};
Game.prototype.sfxCrit = function() {
  // V1-5：暴击叠加高八度泛音，与受击的低八度形成事件音色层次。
  this._beep({ type: 'sawtooth', freq: 880, freqEnd: 1320, duration: 0.09, volume: 0.075, harmonic: 1.5 });
};
Game.prototype.sfxKill = function() {
  this._beep({ type: 'triangle', freq: 520, freqEnd: 780, duration: 0.11, volume: 0.06 });
};
Game.prototype.sfxHurt = function() {
  // V1-5：玩家受击叠低八度泛音，让「挨打」比「打人」更沉。
  this._beep({ type: 'sawtooth', freq: 180, freqEnd: 95, duration: 0.11, volume: 0.08, harmonic: 0.5 });
};
Game.prototype.sfxSupport = function() {
  var now = Date.now();
  if (now - (this._lastSupportSfx || 0) < 260) return;
  this._lastSupportSfx = now;
  this._beep({ type: 'sine', freq: 420, freqEnd: 560, duration: 0.08, volume: 0.035 });
};
Game.prototype.sfxHitBoss = function() {
  this._beep({ type: 'sawtooth', freq: 140, freqEnd: 60, duration: 0.35, volume: 0.2 });
  var self = this;
  setTimeout(function() { self._beep({ type: 'triangle', freq: 520, freqEnd: 260, duration: 0.22, volume: 0.15 }); }, 60);
};
Game.prototype.sfxLevelUp = function() {
  var self = this;
  this._beep({ type: 'triangle', freq: 523, duration: 0.1, volume: 0.13 });
  setTimeout(function() { self._beep({ type: 'triangle', freq: 659, duration: 0.1, volume: 0.13 }); }, 90);
  setTimeout(function() { self._beep({ type: 'triangle', freq: 784, duration: 0.18, volume: 0.15 }); }, 180);
};
Game.prototype.sfxSkill = function(idx) {
  var tones = [
    { type: 'triangle', freq: 720, freqEnd: 420, duration: 0.16, volume: 0.11 },
    { type: 'sawtooth', freq: 180, freqEnd: 70, duration: 0.24, volume: 0.16 },
    { type: 'square', freq: 520, freqEnd: 920, duration: 0.08, volume: 0.09 },
    { type: 'sine', freq: 760, freqEnd: 1260, duration: 0.18, volume: 0.12 },
    { type: 'triangle', freq: 440, freqEnd: 220, duration: 0.22, volume: 0.12 },
    { type: 'sawtooth', freq: 980, freqEnd: 360, duration: 0.2, volume: 0.13 },
    { type: 'sine', freq: 320, freqEnd: 1480, duration: 0.32, volume: 0.14 }
  ];
  var t = tones[idx] || tones[0];
  this._beep(t);
  if (idx === 2 || idx === 6) this._beep({ type: 'triangle', freq: t.freq * 1.5, freqEnd: t.freqEnd, duration: 0.12, volume: 0.06, delay: 0.08 });
};
Game.prototype.sfxUnlock = function() {
  this._beep({ type: 'sine', freq: 440, freqEnd: 1200, duration: 0.22, volume: 0.14 });
};

Game.prototype.toggleMute = function() {
  var muted = !(this.musicMuted && this.sfxMuted);
  this.musicMuted = muted;
  this.sfxMuted = muted;
  this.soundMuted = muted;
  localStorage.setItem('gujiyouxi_mute', muted ? '1' : '0');
  localStorage.setItem('gujiyouxi_music_mute', this.musicMuted ? '1' : '0');
  localStorage.setItem('gujiyouxi_sfx_mute', this.sfxMuted ? '1' : '0');
  if (this.musicMuted) this.stopBgm();
  else this.startBgm();
  this.updateMuteBtn();
  if (!this.sfxMuted) this.sfxClick();
  this.showToast(muted ? '已关闭音乐与音效' : '音乐与音效已开启');
};

Game.prototype.updateMuteBtn = function() {
  this.soundMuted = this.musicMuted && this.sfxMuted;
  if (this.muteLabel) this.muteLabel.text = '⚙ 设置';
};

Game.prototype.persistSettings = function() {
  this.soundMuted = this.musicMuted && this.sfxMuted;
  try {
    localStorage.setItem('gujiyouxi_mute', this.soundMuted ? '1' : '0');
    localStorage.setItem('gujiyouxi_music_mute', this.musicMuted ? '1' : '0');
    localStorage.setItem('gujiyouxi_sfx_mute', this.sfxMuted ? '1' : '0');
    localStorage.setItem('gujiyouxi_detail_mode', this.detailMode === false ? '0' : '1');
  } catch(e) {}
  this.saveGame();
};

Game.prototype.openSettingsPanel = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  this.setPanelContentHeight(panel, Math.min(548, (overlay.height || 667) - 72));
  var title = new eui.Label();
  title.text = '设置'; title.size = 18; title.textColor = 0xffffff; title.bold = true;
  title.horizontalCenter = 0; title.top = 13;
  panel.addChild(title);

  var self = this;
  var metricGap = 8;
  var metricW = Math.floor((panel._contentW - metricGap) / 2);
  this.addPageMetricCard(panel, panel._contentX, 58, metricW, 44, '音乐', this.musicMuted ? '关闭' : '开启', this.musicMuted ? THEME.textDim : THEME.mint);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 58, metricW, 44, '音效', this.sfxMuted ? '关闭' : '开启', this.sfxMuted ? THEME.textDim : THEME.sky);
  this.addPageMetricCard(panel, panel._contentX, 110, metricW, 44, '界面信息', this.detailMode === false ? '简洁' : '详细', THEME.accentSoft);
  this.addPageMetricCard(panel, panel._contentX + metricW + metricGap, 110, metricW, 44, '战斗提示', '居中浮层', THEME.textGold);

  function addToggle(y, icon, titleText, descText, getter, setter) {
    var rowX = panel._contentX;
    var rowW = panel._contentW;
    var row = new eui.Rect();
    row.width = rowW; row.height = 54;
    row.x = rowX; row.y = y;
    row.ellipseWidth = 10; row.ellipseHeight = 10;
    row.fillColor = 0x1a153f;
    row.strokeColor = THEME.strokeSoft; row.strokeWeight = 1; row.strokeAlpha = 0.45;
    panel.addChild(row);

    var iconLb = new eui.Label();
    iconLb.text = icon; iconLb.size = 18; iconLb.width = 30; iconLb.height = 30;
    iconLb.x = rowX + 10; iconLb.y = y + 12; iconLb.textAlign = 'center'; iconLb.verticalAlign = 'middle';
    panel.addChild(iconLb);

    var nameLb = new eui.Label();
    nameLb.text = titleText; nameLb.size = 12; nameLb.bold = true; nameLb.textColor = THEME.textMain;
    nameLb.x = rowX + 48; nameLb.y = y + 8; nameLb.width = rowW - 130; nameLb.height = 16;
    panel.addChild(nameLb);

    var descLb = new eui.Label();
    descLb.text = descText; descLb.size = 9; descLb.textColor = THEME.textDim;
    descLb.x = rowX + 48; descLb.y = y + 28; descLb.width = rowW - 130; descLb.height = 14;
    panel.addChild(descLb);

    var btn = self.createButton('', 0x27ae60, 64, 28, function() {
      setter(!getter());
      self.persistSettings();
      self.applyDetailMode();
      if (!self.musicMuted) self.startBgm();
      else self.stopBgm();
      if (!self.sfxMuted) self.sfxClick();
      self.closePanel();
      self.openSettingsPanel();
    }, self);
    btn.x = rowX + rowW - 74; btn.y = y + 13;
    panel.addChild(btn);

    var btnLabel = btn.getChildAt ? btn.getChildAt(1) : null;
    if (btnLabel && btnLabel.text !== undefined) btnLabel.text = getter() ? '开' : '关';
    if (!getter()) {
      var bg = btn.getChildAt ? btn.getChildAt(0) : null;
      if (bg && bg.fillColor !== undefined) bg.fillColor = 0x555555;
    }
  }

  addToggle(176, '♪', '音乐', '控制背景旋律', function() { return !self.musicMuted; }, function(v) { self.musicMuted = !v; });
  addToggle(238, '✦', '音效', '控制点击、攻击、击杀反馈', function() { return !self.sfxMuted; }, function(v) { self.sfxMuted = !v; });
  addToggle(300, '详', '详情显示', '显示怪物抗性、状态、血量数字与主角信息', function() { return self.detailMode !== false; }, function(v) { self.detailMode = v; });

  // F2+F3：本地数据管理与战绩分享。H5 无后端，存档迁移靠导出 / 导入，分享走 Web Share + 剪贴板降级。
  var sectionY = 366;
  var secBg = new eui.Rect();
  secBg.width = panel._contentW; secBg.height = 168;
  secBg.x = panel._contentX; secBg.y = sectionY;
  secBg.ellipseWidth = 10; secBg.ellipseHeight = 10;
  secBg.fillColor = 0x120e2e;
  secBg.strokeColor = THEME.strokeSoft; secBg.strokeWeight = 1; secBg.strokeAlpha = 0.4;
  panel.addChild(secBg);

  var secTitle = new eui.Label();
  secTitle.text = '本地数据与分享';
  secTitle.size = 13; secTitle.bold = true; secTitle.textColor = THEME.textGold;
  secTitle.x = panel._contentX + 12; secTitle.y = sectionY + 10;
  secTitle.width = panel._contentW - 24;
  panel.addChild(secTitle);

  var secDesc = new eui.Label();
  secDesc.text = '存档只保存在这台设备的浏览器里。复制备份可换机恢复；战绩可复制分享。';
  secDesc.size = 9; secDesc.textColor = THEME.textDim;
  secDesc.x = panel._contentX + 12; secDesc.y = sectionY + 30;
  secDesc.width = panel._contentW - 24; secDesc.wordWrap = true;
  panel.addChild(secDesc);

  var btnW = Math.floor((panel._contentW - 34) / 2);
  var copyBtn = self.createButton('📤 复制存档备份', 0x27ae60, btnW, 32, function() {
    self.copyTextToClipboard(self.exportSave(), function(ok) {
      self.showToast(ok ? '存档已复制，请粘贴保存' : '当前浏览器不支持复制，请用支持剪贴板的浏览器');
    });
  }, self);
  copyBtn.x = panel._contentX + 12; copyBtn.y = sectionY + 56;
  panel.addChild(copyBtn);

  var importBtn = self.createButton('📥 导入备份', 0x8e44ad, btnW, 32, function() {
    self.readClipboardText(function(text) {
      if (!text) { self.showToast('未读取到剪贴板内容'); return; }
      var result = self.importSave(text);
      self.closePanel();
      self.showToast(result.message);
    });
  }, self);
  importBtn.x = panel._contentX + 22 + btnW; importBtn.y = sectionY + 56;
  panel.addChild(importBtn);

  var shareBtn = self.createButton('🎉 分享我的战绩', 0x2980b9, panel._contentW - 24, 32, function() {
    self.shareRecord();
  }, self);
  shareBtn.x = panel._contentX + 12; shareBtn.y = sectionY + 98;
  panel.addChild(shareBtn);

  var verLb = new eui.Label();
  verLb.text = '版本 ' + (window.DMAX_GAME_VERSION || ASSET_VERSION || 'local-dev') + '  ·  存档格式 v1  ·  不联网';
  verLb.size = 9; verLb.textColor = 0x8f8aa8;
  verLb.x = panel._contentX + 12; verLb.y = sectionY + 140;
  verLb.width = panel._contentW - 24;
  panel.addChild(verLb);
};

// ==================== Toast ====================

Game.prototype.getToastY = function() {
  var wxHome = this._wxHomeLayout || (typeof DMAX_WX_HOME_LAYOUT !== 'undefined' ? DMAX_WX_HOME_LAYOUT : null);
  if (wxHome && wxHome.top && wxHome.top.actionPanel) {
    return Math.min(wxHome.bands.battle.y + 8, wxHome.top.actionPanel.y + wxHome.top.actionPanel.h + 7);
  }
  return Math.max(138, (this._safeTop || 0) + 138);
};

Game.prototype.showToast = function(msg) {
  if (this._toastGroup && this._toastGroup.parent) {
    egret.Tween.removeTweens(this._toastGroup);
    this._toastGroup.parent.removeChild(this._toastGroup);
  }
  var stageW = (this.main.stage && this.main.stage.stageWidth) ? this.main.stage.stageWidth : 375;
  var text = String(msg || '');
  var longText = text.length > 22;
  var toastW = Math.min(stageW - 28, Math.max(178, text.length * (longText ? 9 : 12) + 42));
  var toastH = longText ? 44 : 34;

  var el = new eui.Group();
  el.width = toastW; el.height = toastH;
  el.x = Math.floor((stageW - toastW) / 2);
  el.y = this.getToastY();
  el.alpha = 0.96;

  var bg = new eui.Rect();
  bg.width = toastW; bg.height = toastH;
  bg.ellipseWidth = 16; bg.ellipseHeight = 16;
  bg.fillColor = 0x070416; bg.fillAlpha = 0.88;
  bg.strokeColor = THEME.strokeGold; bg.strokeWeight = 1; bg.strokeAlpha = 0.5;
  el.addChild(bg);

  var lb = new eui.Label();
  lb.text = text; lb.size = longText ? 11 : 13; lb.textColor = 0xffffff; lb.bold = true;
  lb.width = toastW - 24; lb.height = toastH - 8;
  lb.x = 12; lb.y = 4;
  lb.textAlign = 'center'; lb.verticalAlign = 'middle';
  lb.wordWrap = longText;
  el.addChild(lb);

  this._toastGroup = el;
  this.main.addChild(el);
  egret.Tween.get(el)
    .wait(1600)
    .to({ alpha: 0, y: el.y - 12 }, 360)
    .call(function() { if (el.parent) el.parent.removeChild(el); });
};

// ==================== 运行时稳定性护栏（G 批次） ====================
// 挂机游戏的头号风险：setInterval 回调抛错时浏览器不会移除该定时器，回路会持续报错，
// 玩家只看到「卡住」却拿不到任何线索。这里统一做「记录 → 节流提示 → 让循环继续跑」。
// 另一风险是后台标签被节流后「每秒 ++」式计时严重失真，故统一按真实时间差推进。
Game.prototype.reportRuntimeError = function(err, tag) {
  var msg = '';
  try { msg = (err && err.message) ? String(err.message) : String(err); } catch (e) {}
  if (!msg) msg = 'unknown error';
  if (typeof window !== 'undefined' && window) {
    if (!window.__dmaxRuntimeErrors) window.__dmaxRuntimeErrors = [];
    if (window.__dmaxRuntimeErrors.length < 20) {
      window.__dmaxRuntimeErrors.push({ tag: tag || 'runtime', message: msg, at: Date.now() });
    }
    window.__dmaxLastRuntimeError = msg;
  }
  try { if (typeof console !== 'undefined' && console.error) console.error('[DMAX][' + (tag || 'runtime') + '] ' + msg); } catch (e) {}
  var now = Date.now();
  if (!this._lastErrorToastAt || now - this._lastErrorToastAt > 60000) {
    this._lastErrorToastAt = now;
    var self = this;
    // 提示本身也可能因 UI 未就绪而失败：延后一拍并再包一层，绝不让兜底逻辑二次抛错。
    try {
      setTimeout(function() {
        try { self.showToast('⚠ 遇到小问题已自动恢复，建议到设置页导出存档'); } catch (e2) {}
      }, 0);
    } catch (e3) {}
  }
};

Game.prototype.safeInterval = function(tag, fn, ms) {
  var self = this;
  return setInterval(function() {
    try { fn(); } catch (e) { self.reportRuntimeError(e, tag); }
  }, ms);
};

Game.prototype.safeTimeout = function(tag, fn, ms) {
  var self = this;
  return setTimeout(function() {
    try { fn(); } catch (e) { self.reportRuntimeError(e, tag); }
  }, ms);
};

Game.prototype.installGlobalErrorHooks = function() {
  if (typeof window === 'undefined' || !window) return;
  if (window.__dmaxErrorHooksInstalled) return; // 多实例 / 热重载时只装一次
  window.__dmaxErrorHooksInstalled = true;
  var self = this;
  var record = function(err, tag) {
    var msg = '';
    try { msg = (err && err.message) ? String(err.message) : String(err); } catch (e) {}
    if (!msg || msg === 'undefined') msg = tag;
    if (!window.__dmaxGlobalErrors) window.__dmaxGlobalErrors = [];
    if (window.__dmaxGlobalErrors.length < 20) {
      window.__dmaxGlobalErrors.push({ tag: tag, message: msg, at: Date.now() });
    }
  };
  try {
    window.addEventListener('error', function(ev) { record(ev && (ev.error || ev.message), 'window.onerror'); });
    window.addEventListener('unhandledrejection', function(ev) { record(ev && ev.reason, 'unhandledrejection'); });
  } catch (e) {}
  try {
    if (typeof document !== 'undefined' && document && document.addEventListener) {
      document.addEventListener('visibilitychange', function() {
        try { self.onVisibilityChange(); } catch (e2) { self.reportRuntimeError(e2, 'visibility'); }
      });
    }
  } catch (e) {}
};

// 后台补算只推进「按秒递减」的计时字段，不重复触发 tickSkillBuffs 里的能量扣除 / UI 副作用。
Game.prototype.decayBuffSeconds = function(secs) {
  if (!this.skillBuffs) return;
  var fields = ['attackTime', 'speedTime', 'critTime', 'shieldTime'];
  for (var i = 0; i < fields.length; i++) {
    var k = fields[i];
    if (this.skillBuffs[k] > 0) this.skillBuffs[k] = Math.max(0, this.skillBuffs[k] - secs);
  }
  if (this.skillBuffs.shieldTime <= 0) this.skillBuffs.shieldReduce = 0;
  if (this.bossDebuffs) {
    var dfields = ['critDownTime', 'cooldownSlowTime', 'energyBurnTime'];
    for (var j = 0; j < dfields.length; j++) {
      var dk = dfields[j];
      if (this.bossDebuffs[dk] > 0) this.bossDebuffs[dk] = Math.max(0, this.bossDebuffs[dk] - secs);
    }
  }
};

// 前台 dt 恒为 1，逐字段等价于原来的 playTime++ / skillCD-- / tickSkillBuffs()；
// 后台被节流后 dt>1，一次性补齐计时。明确不补发金币 / 伤害 / 击杀（那是离线收益，避免重复发放）。
Game.prototype.advanceSeconds = function(dt) {
  var secs = Math.max(1, Math.min(300, Math.floor(dt || 1)));
  var before = this.stats.playTime;
  this.stats.playTime = before + secs;
  var interval = CONFIG.energyRecoveryInterval;
  if (interval > 0) {
    var ticks = Math.floor(this.stats.playTime / interval) - Math.floor(before / interval);
    if (ticks > 0) this.energy = Math.min(this.getMaxEnergy(), this.energy + ticks * CONFIG.energyRecovery);
  }
  for (var i = 0; i < this.skillCD.length; i++) {
    if (this.skillCD[i] > 0) this.skillCD[i] = Math.max(0, this.skillCD[i] - secs);
  }
  if (secs === 1) this.tickSkillBuffs();
  else this.decayBuffSeconds(secs);
  return secs;
};

Game.prototype.scheduleTick = function() {
  var now = Date.now();
  var last = this._lastTickAt || now;
  this._lastTickAt = now;
  var dt = Math.floor((now - last) / 1000);
  this.advanceSeconds(dt < 1 ? 1 : dt);
  this.updateUI();
};

Game.prototype.onVisibilityChange = function() {
  var hidden = (typeof document !== 'undefined' && document && !!document.hidden);
  if (hidden) { this._hiddenAt = Date.now(); return; }
  this._hiddenAt = 0;
  // 回到前台立刻补一次，不必等下一次被节流的 interval；共用 _lastTickAt 防止重复补算。
  var now = Date.now();
  if (!this._lastTickAt || now - this._lastTickAt > 1500) this.scheduleTick();
};

// 存档写入失败（隐私模式 / quota 满）不能静默：玩家否则会玩很久才发现进度全丢。
Game.prototype.warnSaveFailure = function(err) {
  if (typeof window !== 'undefined' && window) window.__dmaxSaveFailed = true;
  var now = Date.now();
  if (this._lastSaveWarnAt && now - this._lastSaveWarnAt < 120000) return;
  this._lastSaveWarnAt = now;
  var self = this;
  try {
    setTimeout(function() {
      try { self.showToast('⚠ 本地存储不可用，进度可能丢失，请到设置页导出存档'); } catch (e) {}
    }, 0);
  } catch (e2) {}
  try { if (typeof console !== 'undefined' && console.error) console.error('[DMAX][saveGame] ' + ((err && err.message) ? err.message : String(err))); } catch (e3) {}
};

// ==================== 游戏主循环 ====================

Game.prototype.startLoop = function() {
  var self = this;

  // 每秒：技能CD + 游戏时长 + 能量恢复。G 批次改为按真实时间差推进（见 advanceSeconds），
  // 前台逐字段等价于原逻辑；后台标签被节流时不再把 60 秒计成 1 秒。
  self.safeInterval('tick', function() { self.scheduleTick(); }, 1000);

  // 怪物会周期性反击，形成生命值和防御压力。
  self.safeInterval('monsterAttack', function() {
    self.processMonsterAttacks();
  }, 2500);

  // 治疗/守护型辅助提供续航，避免反击体系只剩硬扛。
  self.safeInterval('supportHeal', function() {
    if (self.playerHp <= 0) return;
    if (self.isSupportActive(1)) {
      var healer = self.supports[1];
      var heal = self.getMaxPlayerHp() * (0.028 + Math.min(0.03, (healer.level || 1) * 0.002));
      self.healPlayer(heal, '棉花糖治疗', true);
    }
  }, 6000);

  self.safeInterval('supportGuard', function() {
    if (self.playerHp <= 0) return;
    if (self.isSupportActive(3) && (!self.skillBuffs || self.skillBuffs.shieldTime <= 0)) {
      var guard = self.supports[3];
      if (!self.skillBuffs) self.skillBuffs = { attackTime: 0, attackMult: 1, speedTime: 0, speedMult: 1, critTime: 0, critBonus: 0, shieldTime: 0, shieldReduce: 0 };
      self.skillBuffs.shieldTime = 4 + Math.min(4, Math.floor((guard.level || 1) / 5));
      self.skillBuffs.shieldReduce = 0.28;
      self.showToast('布丁守护：获得护盾' + self.skillBuffs.shieldTime + '秒');
      self.updateUI();
    }
  }, 12000);

  // 主角自动攻击（每秒1次，不消耗能量）
  self.safeInterval('heroAttack', function() {
    if (self.monsters.length === 0) return;
    // 只攻击 hp > 0 的怪物，避免已被辅助角色击杀后重复触发 onKill
    var aliveMonsters = self.monsters.filter(function(m) { return m.hp > 0; });
    if (aliveMonsters.length === 0) return;
    // 选血量最高目标（与点击逻辑一致）
    var target = aliveMonsters[0];
    for (var j = 1; j < aliveMonsters.length; j++) {
      if (aliveMonsters[j].hp > target.hp) { target = aliveMonsters[j]; }
    }
    var tIdx = self.monsters.indexOf(target);
    if (tIdx === -1 || target.hp <= 0) return; // 二次保险：获取 indexOf 后再确认
    self.heroAttackAnim(tIdx);
    var buffs = self.getBuffs();
    var baseDmg = CONFIG.mainDmg(self.mainLevel, self.rebirthGems);
    self.doDamage(target, baseDmg, tIdx, false, 'phys');
    var extraChance = Math.max(0, Math.min(1, buffs.speedMult - 1));
    if (target.hp > 0 && extraChance > 0 && Math.random() < extraChance) {
      self.doDamage(target, baseDmg, tIdx, false, 'phys');
    }
  }, 1000);

  // 辅助角色独立攻击（每个角色不同间隔，错开时间）
  for (var si = 0; si < self.supports.length; si++) {
    (function(idx) {
      var def = SUPPORTS_DEF[idx];
      // 初始延迟错开，避免同时攻击
      var initDelay = idx * 200 + Math.random() * 300;
      self.safeTimeout('supportStart' + idx, function() {
        self.safeInterval('support' + idx, function() {
          var s = self.supports[idx];
          if (!self.isSupportActive(idx) || self.monsters.length === 0) return;
          var aliveMonsters = self.monsters.filter(function(m) { return m.hp > 0; });
          if (aliveMonsters.length === 0) return;
          var buffs = self.getBuffs();
          var target = aliveMonsters[0];
          for (var j = 1; j < aliveMonsters.length; j++) {
            if (aliveMonsters[j].hp > target.hp) target = aliveMonsters[j];
          }
          var targetIdx = self.monsters.indexOf(target);
          var dmg = Math.floor(s.dps * s.level * 0.8 * buffs.supportMult);
          if (dmg <= 0) return;
          var dmgType = def && def.role === 'magic' ? 'magic' : 'phys';
          dmg = Math.max(1, Math.floor(dmg * self.getResistanceMultiplier(target, dmgType, false)));
          if (target.isBoss) dmg = Math.floor(dmg * (buffs.bossDamageMult || 1));
          if (target.type && target.type.shape) {
            dmg = Math.floor(dmg * (1 + self.getCodexDamageBonus(target.type.shape, !!target.isBoss)));
          }
          target.hp -= dmg;
          self.sfxSupport();
          self.supportAttackAnim(idx, targetIdx, dmg);
          if (target.hp <= 0) {
            self.onKill(target, targetIdx);
          } else {
            self.updateMonsterHealthView(targetIdx);
          }
          self.updateUI();
        }, def.atkInterval);
      }, initDelay);
    })(si);
  }

  // 每15秒自动存档
  self.safeInterval('autoSave', function() { self.saveGame(); }, 15000);
};

// ==================== 存档 ====================

Game.prototype.saveGame = function() {
  try {
    localStorage.setItem('gujiyouxi_egret', JSON.stringify({
      v: 1,
      gold: this.gold, energy: this.energy, playerHp: this.playerHp, mainLevel: this.mainLevel,
      wave: this.wave, totalCleared: this.totalCleared,
      killCount: this.killCount, skillCD: this.skillCD, skillUnlocked: this.skillUnlocked,
      skillLevels: this.skillLevels,
      supports: this.supports.map(function(s) { return { level: s.level, unlocked: s.unlocked, notified: !!s.notified }; }),
      foods: this.foods, freeSpins: this.freeSpins, spinDate: this.spinDate,
      equipmentLevels: this.equipmentLevels, forgeStones: this.forgeStones || 0, coreWeapon: this.coreWeapon,
      spinTickets: this.spinTickets || 0,
      spinPity: this.spinPity || 0,
      totalSpins: this.totalSpins || 0,
      lastSpinPrize: this.lastSpinPrize || '',
      spinHistory: this.spinHistory || [],
      stats: this.stats, checkinDay: this.checkinDay, checkinDate: this.checkinDate,
      dailyTaskDate: this.dailyTaskDate, dailyTaskDone: this.dailyTaskDone,
      dailyTaskClaimed: this.dailyTaskClaimed,
      mailClaimed: this.mailClaimed,
      achievements: this.achievements, bossRewards: this.bossRewards,
      supportShopVersion: this.supportShopVersion,
      offlineCap: this.offlineCap,
      autoAttackEnabled: this.autoAttackEnabled,
      rebirthGems: this.rebirthGems, maxWaveReached: this.maxWaveReached,
      rebirthTalents: this.rebirthTalents,
      lastRebirthBossStage: this.lastRebirthBossStage || 0,
      rebirthCount: this.rebirthCount || 0,
      bossRetryLock: this.bossRetryLock,
      monsterCodex: this.monsterCodex,
      avatarIdx: this.avatarIdx || 0,
      playerName: this.playerName || makeDefaultPlayerName(),
      jobId: this.jobId || 'trainee_mage',
      musicMuted: !!this.musicMuted,
      sfxMuted: !!this.sfxMuted,
      detailMode: this.detailMode !== false
    }));
    localStorage.setItem('gujiyouxi_egret_time', Date.now().toString());
  } catch(e) {
    // 隐私模式 / quota 满 / 被禁用：不能静默丢进度，给一次可执行的提示并留下标记。
    this.warnSaveFailure(e);
  }
};

// S0: 存档迁移入口。把任意历史版本存档归一化为 v1 完整结构。
// 纯数据函数：只读入参 d、不修改 this，返回新对象；原有字段一律原样保留（不重置既有进度）。
// 默认值统一用 d.x !== undefined ? d.x : DEFAULT，避免 || 把合法 0 / false 吞掉。
Game.prototype.migrateSave = function(d) {
  if (!d || typeof d !== 'object') return null;
  var out = {};
  for (var key in d) {
    if (Object.prototype.hasOwnProperty.call(d, key)) out[key] = d[key];
  }
  function def(name, value) {
    out[name] = out[name] !== undefined ? out[name] : value;
  }
  def('gold', 0);
  def('energy', 100);
  def('mainLevel', 1);
  def('wave', 1);
  def('totalCleared', 0);
  def('killCount', 0);
  def('skillCD', [0,0,0,0,0,0,0]);
  def('skillUnlocked', [true, false, false, false, false, false, false]);
  def('skillLevels', [1,1,1,1,1,1,1]);
  def('supports', null);
  def('foods', {});
  def('equipmentLevels', []);
  def('forgeStones', 0);
  def('coreWeapon', { owned: false, pity: 0 });
  def('freeSpins', 3);
  def('spinDate', new Date().toDateString());
  def('spinTickets', 0);
  def('spinPity', 0);
  def('totalSpins', 0);
  def('lastSpinPrize', '');
  def('spinHistory', []);
  def('stats', {});
  def('checkinDay', 0);
  def('checkinDate', '');
  def('dailyTaskDate', '');
  def('dailyTaskDone', [false, false, false]);
  def('dailyTaskClaimed', [false, false, false]);
  def('mailClaimed', {});
  def('achievements', []);
  def('bossRewards', {});
  def('offlineCap', 8);
  def('autoAttackEnabled', true);
  def('rebirthGems', 0);
  def('rebirthTalents', []);
  def('maxWaveReached', 0);
  def('lastRebirthBossStage', 0);
  def('rebirthCount', 0);
  def('bossRetryLock', null);
  def('monsterCodex', {});
  def('avatarIdx', 0);
  def('jobId', 'trainee_mage');
  def('musicMuted', false);
  def('sfxMuted', false);
  def('detailMode', true);
  // 畸形旧档兜底：数组字段保证是数组，对象字段保证是对象，字符串字段保证是字符串。
  if (!Array.isArray(out.skillCD)) out.skillCD = [0,0,0,0,0,0,0];
  if (!Array.isArray(out.skillUnlocked)) out.skillUnlocked = [true, false, false, false, false, false, false];
  if (!Array.isArray(out.skillLevels)) out.skillLevels = [1,1,1,1,1,1,1];
  if (!Array.isArray(out.spinHistory)) out.spinHistory = [];
  if (!Array.isArray(out.dailyTaskDone)) out.dailyTaskDone = [false, false, false];
  if (!Array.isArray(out.dailyTaskClaimed)) out.dailyTaskClaimed = [false, false, false];
  if (!Array.isArray(out.equipmentLevels)) out.equipmentLevels = [];
  if (!Array.isArray(out.rebirthTalents)) out.rebirthTalents = [];
  if (!Array.isArray(out.achievements)) out.achievements = [];
  if (!out.stats || typeof out.stats !== 'object') out.stats = {};
  // stats 原先直接沿用入参引用，畸形字符串会让 playTime++ 变成字符串拼接并污染主循环，
  // 这里重建对象并统一转成非负有限数。
  var cleanStats = {};
  var STAT_KEYS = { totalKills: 0, totalGold: 0, totalClicks: 0, playTime: 0, bossKills: 0 };
  for (var stk in STAT_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(STAT_KEYS, stk)) continue;
    cleanStats[stk] = Math.min(1e15, Math.max(0, toNum(out.stats[stk], STAT_KEYS[stk])));
  }
  out.stats = cleanStats;
  if (!out.foods || typeof out.foods !== 'object') out.foods = {};
  if (!out.mailClaimed || typeof out.mailClaimed !== 'object') out.mailClaimed = {};
  if (!out.bossRewards || typeof out.bossRewards !== 'object') out.bossRewards = {};
  if (!out.monsterCodex || typeof out.monsterCodex !== 'object') out.monsterCodex = {};
  if (!out.coreWeapon || typeof out.coreWeapon !== 'object') out.coreWeapon = { owned: false, pity: 0 };
  if (typeof out.playerName !== 'string') out.playerName = '';
  if (typeof out.jobId !== 'string' || out.jobId === '') out.jobId = 'trainee_mage';
  // S2：jobId 必须是已知职业。否则 getJobDef() 虽会静默兜底，存档里却留着脏值，
  // 后续新增职业时容易把脏值一并算进加成表。
  var jobKnown = false;
  for (var ji = 0; ji < JOB_DEFS.length; ji++) {
    if (JOB_DEFS[ji].id === out.jobId) { jobKnown = true; break; }
  }
  if (!jobKnown) out.jobId = 'trainee_mage';
  if (typeof out.spinDate !== 'string') out.spinDate = new Date().toDateString();
  if (typeof out.lastSpinPrize !== 'string') out.lastSpinPrize = '';
  if (typeof out.checkinDate !== 'string') out.checkinDate = '';
  if (typeof out.dailyTaskDate !== 'string') out.dailyTaskDate = '';
  // S1/P2：数字 / 布尔字段类型兜底。旧档可能把数值写成字符串、把布尔写成 0/1/'false'，
  // 不校正会原样写回存档，后续运算出现字符串拼接或真值误判（gold:'12345' 即典型）。
  function toNum(v, fallback) {
    if (typeof v === 'number' && isFinite(v)) return v;
    if (typeof v === 'string' && v.trim() !== '' && isFinite(Number(v))) return Number(v);
    return fallback;
  }
  function toBool(v, fallback) {
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === 1 || v === '1') return true;
    if (v === 'false' || v === 0 || v === '0' || v === '' || v === null || v === undefined) return false;
    return fallback;
  }
  function numArray(arr, fallback) {
    if (!Array.isArray(arr)) return arr;
    var res = [];
    for (var i = 0; i < arr.length; i++) res.push(toNum(arr[i], fallback));
    return res;
  }
  function boolArray(arr, fallback) {
    if (!Array.isArray(arr)) return arr;
    var res = [];
    for (var i = 0; i < arr.length; i++) res.push(toBool(arr[i], fallback));
    return res;
  }
  var NUM_FIELDS = {
    gold: 0, energy: 100, mainLevel: 1, wave: 1, totalCleared: 0, killCount: 0,
    freeSpins: 3, spinTickets: 0, spinPity: 0, totalSpins: 0, forgeStones: 0,
    checkinDay: 0, offlineCap: 8, rebirthGems: 0, maxWaveReached: 0,
    lastRebirthBossStage: 0, rebirthCount: 0, avatarIdx: 0
  };
  for (var nf in NUM_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(NUM_FIELDS, nf)) out[nf] = toNum(out[nf], NUM_FIELDS[nf]);
  }
  // G 批次：数值范围钳制。导入接口允许任意 JSON，NaN / 负数 / 超大波次会让 CONFIG.monsterHp()
  // 等公式产出 Infinity，随后 UI 与主循环一起失效。正常存档全部落在区间内，钳制为零漂移。
  var NUM_LIMITS = {
    gold: [0, 1e15], energy: [0, 1e9], mainLevel: [1, 100000], wave: [1, 100000],
    totalCleared: [0, 1e9], killCount: [0, 1e9], freeSpins: [0, 10000], spinTickets: [0, 100000],
    spinPity: [0, 100000], totalSpins: [0, 1e9], forgeStones: [0, 1e9], checkinDay: [0, 10000],
    offlineCap: [1, 24], rebirthGems: [0, 1e6], maxWaveReached: [0, 100000],
    lastRebirthBossStage: [0, 100000], rebirthCount: [0, 100000], avatarIdx: [0, 63]
  };
  for (var nl in NUM_LIMITS) {
    if (!Object.prototype.hasOwnProperty.call(NUM_LIMITS, nl)) continue;
    var lv = out[nl];
    if (typeof lv !== 'number' || !isFinite(lv)) lv = NUM_FIELDS[nl];
    out[nl] = Math.min(NUM_LIMITS[nl][1], Math.max(NUM_LIMITS[nl][0], lv));
  }
  var BOOL_FIELDS = { autoAttackEnabled: true, musicMuted: false, sfxMuted: false, detailMode: true };
  for (var bf in BOOL_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(BOOL_FIELDS, bf)) out[bf] = toBool(out[bf], BOOL_FIELDS[bf]);
  }
  out.skillCD = numArray(out.skillCD, 0);
  out.skillLevels = numArray(out.skillLevels, 1);
  out.equipmentLevels = numArray(out.equipmentLevels, 0);
  out.skillUnlocked = boolArray(out.skillUnlocked, false);
  out.dailyTaskDone = boolArray(out.dailyTaskDone, false);
  out.dailyTaskClaimed = boolArray(out.dailyTaskClaimed, false);
  // 超长数组会让 loadGame / UI 遍历卡死（导入接口可塞百万级元素），统一裁剪到合理上限。
  var ARRAY_FIELDS = ['skillCD', 'skillUnlocked', 'skillLevels', 'equipmentLevels', 'spinHistory',
    'dailyTaskDone', 'dailyTaskClaimed', 'rebirthTalents', 'achievements', 'supports'];
  for (var af = 0; af < ARRAY_FIELDS.length; af++) {
    var an = ARRAY_FIELDS[af];
    if (Array.isArray(out[an]) && out[an].length > 64) out[an] = out[an].slice(0, 64);
  }
  if (out.coreWeapon && typeof out.coreWeapon === 'object') {
    var cw = {};
    for (var cwk in out.coreWeapon) {
      if (Object.prototype.hasOwnProperty.call(out.coreWeapon, cwk)) cw[cwk] = out.coreWeapon[cwk];
    }
    cw.owned = toBool(cw.owned, false);
    cw.pity = toNum(cw.pity, 0);
    out.coreWeapon = cw;
  }
  if (Array.isArray(out.supports)) {
    var fixedSupports = [];
    for (var sp = 0; sp < out.supports.length; sp++) {
      var s = out.supports[sp];
      if (!s || typeof s !== 'object') { fixedSupports.push(s); continue; }
      var sc = {};
      for (var sk in s) {
        if (Object.prototype.hasOwnProperty.call(s, sk)) sc[sk] = s[sk];
      }
      sc.level = toNum(sc.level, 1);
      sc.unlocked = toBool(sc.unlocked, false);
      sc.notified = toBool(sc.notified, false);
      fixedSupports.push(sc);
    }
    out.supports = fixedSupports;
  }
  // playerHp 故意不设默认值：末尾需要区分「旧档没写」与「写了 0」；非法值按「没写」处理。
  if (out.playerHp !== undefined) {
    var hp = toNum(out.playerHp, null);
    if (hp === null) delete out.playerHp; else out.playerHp = hp;
  }
  // --- 历史迁移规则（集中在此，不再散落） ---
  out._resetSupports = out.supportShopVersion !== 3;
  out.supportShopVersion = 3;
  if (out.round && out.round > 1 && !out.maxWaveReached) {
    out.maxWaveReached = (out.round - 1) * 10 + out.wave;
  }
  out.v = 1; // 当前 schema 版本；saveGame 写回时同样为 1
  return out;
};

Game.prototype.loadGame = function() {
  try {
    var d = this.migrateSave(JSON.parse(localStorage.getItem('gujiyouxi_egret')));
    if (!d) return;
    // migrateSave 已保证以下字段存在，统一直接取值；不再用 || 吞掉合法 0 / false。
    this.gold = d.gold;
    this.energy = d.energy;
    if (d.playerHp !== undefined) this.playerHp = d.playerHp;
    this.mainLevel = d.mainLevel;
    this.wave = d.wave;
    this.totalCleared = d.totalCleared;
    this.killCount = d.killCount;
    this.skillCD = d.skillCD;
    this.skillUnlocked = d.skillUnlocked;
    this.skillLevels = d.skillLevels;
    while (this.skillLevels.length < SKILLS.length) this.skillLevels.push(1);
    if (Array.isArray(d.supports)) {
      for (var i = 0; i < d.supports.length; i++) {
        if (this.supports[i] && d.supports[i]) {
          this.supports[i].level = d.supports[i].level !== undefined ? d.supports[i].level : 1;
          this.supports[i].unlocked = d.supports[i].unlocked !== undefined ? d.supports[i].unlocked : false;
          this.supports[i].notified = !!d.supports[i].notified;
        }
      }
    }
    this.foods = {};
    for (var fk in d.foods) {
      if (Object.prototype.hasOwnProperty.call(d.foods, fk) && this.findRelicDef(fk)) {
        this.foods[fk] = d.foods[fk] !== undefined ? d.foods[fk] : 0;
      }
    }
    this.equipmentLevels = d.equipmentLevels;
    this.forgeStones = d.forgeStones;
    this.coreWeapon = d.coreWeapon;
    this.freeSpins = d.freeSpins;
    this.spinDate = d.spinDate;
    this.spinTickets = d.spinTickets;
    this.spinPity = d.spinPity;
    this.totalSpins = d.totalSpins;
    this.lastSpinPrize = d.lastSpinPrize;
    this.spinHistory = d.spinHistory.slice(0, 6);
    for (var k in d.stats) {
      if (Object.prototype.hasOwnProperty.call(d.stats, k)) this.stats[k] = d.stats[k];
    }
    this.checkinDay = d.checkinDay;
    this.checkinDate = d.checkinDate;
    this.dailyTaskDate = d.dailyTaskDate;
    this.dailyTaskDone = d.dailyTaskDone;
    this.dailyTaskClaimed = d.dailyTaskClaimed;
    while (this.dailyTaskDone.length < DAILY_TASKS.length) this.dailyTaskDone.push(false);
    while (this.dailyTaskClaimed.length < DAILY_TASKS.length) this.dailyTaskClaimed.push(false);
    this.mailClaimed = d.mailClaimed;
    this.achievements = d.achievements;
    this.bossRewards = d.bossRewards;
    this.offlineCap = d.offlineCap;
    this.autoAttackEnabled = d.autoAttackEnabled;
    this.rebirthGems = d.rebirthGems;
    this.rebirthTalents = d.rebirthTalents;
    this.maxWaveReached = d.maxWaveReached;
    this.lastRebirthBossStage = d.lastRebirthBossStage;
    this.rebirthCount = d.rebirthCount;
    this.bossRetryLock = d.bossRetryLock;
    this.monsterCodex = d.monsterCodex;
    this.avatarIdx = d.avatarIdx;
    this.playerName = (d.playerName !== '' && d.playerName !== '玩家') ? d.playerName : makeDefaultPlayerName();
    this.jobId = d.jobId;
    this.musicMuted = !!d.musicMuted;
    this.sfxMuted = !!d.sfxMuted;
    this.detailMode = d.detailMode !== false;

    // S0 收敛点：历史迁移与 4 项结构修补集中在此，且全部在字段赋值完成后执行。
    if (d._resetSupports) {
      for (var si = 0; si < this.supports.length; si++) {
        this.supports[si].unlocked = false;
        this.supports[si].notified = false;
      }
    }
    this.supportShopVersion = d.supportShopVersion;
    this.repairSupportUnlocks();
    this.ensureRelics();
    this.ensureEquipment();
    this.ensureRebirthTalents();

    this.energy = Math.min(this.getMaxEnergy(), this.energy);
    this.playerHp = Math.min(this.getMaxPlayerHp(), Math.max(1, d.playerHp !== undefined ? this.playerHp : this.getMaxPlayerHp()));
  } catch(e) {
    // 单字段畸形不应无声地丢整份进度：留下可观测标记，主循环护栏会兜住后续异常。
    this._loadError = (e && e.message) ? String(e.message) : String(e);
    if (typeof window !== 'undefined' && window) window.__dmaxLoadError = this._loadError;
    try { if (typeof console !== 'undefined' && console.error) console.error('[DMAX][loadGame] ' + this._loadError); } catch (e2) {}
  }
};


// ==================== 存档管理与分享（H5 纯本地，云存档 / CMS 的替代） ====================
// H5 静态托管无后端：存档只在本机 localStorage，导出 / 导入是唯一可跨设备迁移的手段。
// 所有浏览器能力都走 typeof 守卫 + try/catch，无 navigator / 无 clipboard 时静默降级，不抛错。

Game.prototype.exportSave = function() {
  this.saveGame();
  try { return localStorage.getItem('gujiyouxi_egret') || ''; }
  catch (e) { return ''; }
};

Game.prototype.importSave = function(text) {
  if (typeof text !== 'string') return { ok: false, message: '存档内容为空' };
  var raw = text.replace(/^\s+|\s+$/g, '');
  if (!raw) return { ok: false, message: '存档内容为空' };
  if (raw.length > 200000) return { ok: false, message: '存档过大，已拒绝导入' };
  var parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) { return { ok: false, message: '不是有效的存档 JSON' }; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, message: '存档格式不正确' };
  }
  var migrated = this.migrateSave(parsed);
  if (!migrated) return { ok: false, message: '存档无法识别' };
  if (migrated.v !== 1) migrated.v = 1;
  try {
    localStorage.setItem('gujiyouxi_egret', JSON.stringify(migrated));
    // 导入是「替换进度」，重置离线时间源，避免按旧时间戳补发一大笔离线收益。
    localStorage.setItem('gujiyouxi_egret_time', Date.now().toString());
  } catch (e) { return { ok: false, message: '本地存储写入失败' }; }
  this.loadGame();
  this.updateUI();
  this.spawnWave();
  return { ok: true, message: '存档导入成功，进度已恢复' };
};

Game.prototype.copyTextToClipboard = function(text, cb) {
  var finish = function(ok, how) { if (cb) cb(ok, how); };
  var promptFallback = function() {
    try {
      if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
        window.prompt('复制下面的文本（当前浏览器不支持自动复制）', text);
        finish(true, 'prompt');
        return;
      }
    } catch (e2) {}
    finish(false, 'none');
  };
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      var p = navigator.clipboard.writeText(text);
      if (p && typeof p.then === 'function') {
        p.then(function() { finish(true, 'clipboard'); }, function() { promptFallback(); });
      } else finish(true, 'clipboard');
      return;
    }
  } catch (e) {}
  promptFallback();
};

Game.prototype.readClipboardText = function(cb) {
  var fallback = function() {
    try {
      if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
        return window.prompt('粘贴之前复制的存档 JSON', '') || '';
      }
    } catch (e) {}
    return '';
  };
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
      var p = navigator.clipboard.readText();
      if (p && typeof p.then === 'function') {
        p.then(function(t) { cb(String(t || '')); }, function() { cb(fallback()); });
      } else cb(String(p || ''));
      return;
    }
  } catch (e) {}
  cb(fallback());
};

Game.prototype.getShareText = function() {
  var stats = this.stats || {};
  var codexCount = Object.keys(this.monsterCodex || {}).length;
  var codexTotal = MONSTER_TYPES.length + HIDDEN_MONSTER_TYPES.length + BOSS_TYPES.length;
  var version = (typeof window !== 'undefined' && window.DMAX_GAME_VERSION) || ASSET_VERSION || 'local-dev';
  return [
    '【DMAX挂机英雄 · 星夜糖果屋】我的挂机战绩',
    '最高波次：第 ' + this.maxWaveReached + ' 波',
    'BOSS 击杀 ' + this.fmt(stats.bossKills || 0) + ' · 累计击杀 ' + this.fmt(stats.totalKills || 0),
    '转生 ' + this.rebirthCount + ' 次 · 宝石 ' + this.rebirthGems + ' · 职业 ' + this.getJobName(),
    '图签 ' + codexCount + '/' + codexTotal + ' · 成就 ' + this.achievements.length + '/' + ACHIEVEMENTS.length,
    '版本 ' + version + '（H5 版，数据仅保存在本机）'
  ].join('\n');
};

Game.prototype.shareRecord = function(cb) {
  var self = this;
  var text = this.getShareText();
  var finish = function(ok, how) {
    if (ok) self.showToast(how === 'share' ? '分享面板已打开' : '战绩已复制，粘贴即可分享');
    else self.showToast('当前环境不支持分享，可在「本地成绩单」查看数据');
    if (cb) cb(ok, how);
  };
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      var p = navigator.share({ title: 'DMAX挂机英雄 · 我的战绩', text: text });
      if (p && typeof p.then === 'function') {
        p.then(function() { finish(true, 'share'); }, function() {
          self.copyTextToClipboard(text, function(ok2) { finish(ok2, 'clipboard'); });
        });
      } else finish(true, 'share');
      return;
    }
  } catch (e) {}
  this.copyTextToClipboard(text, function(ok) { finish(ok, 'clipboard'); });
};


// ==================== 头像选择器 ====================

Game.prototype.openAvatarPicker = function() {
  var overlay = this.createPanelOverlay();
  var panel = new eui.Group();
  panel.width = 338; panel.height = 302;
  panel.horizontalCenter = 0; panel.verticalCenter = 0;
  var pBg = new eui.Rect();
  pBg.percentWidth = 100; pBg.percentHeight = 100;
  pBg.fillColor = 0x151038; pBg.ellipseWidth = 14; pBg.ellipseHeight = 14;
  pBg.strokeColor = THEME.strokeGold; pBg.strokeWeight = 1; pBg.strokeAlpha = 0.56;
  panel.addChild(pBg);

  var title = new eui.Label();
  title.text = '选择头像'; title.size = 17; title.textColor = 0xffffff; title.bold = true;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var subtitle = new eui.Label();
  subtitle.text = '这里只选择形象；职业与加成在「职业详情」里查看。';
  subtitle.size = 10; subtitle.textColor = THEME.textDim;
  subtitle.horizontalCenter = 0; subtitle.top = 38; subtitle.width = 260; subtitle.textAlign = 'center';
  panel.addChild(subtitle);

  // 关闭按钮
  var closeBtn = new eui.Label();
  closeBtn.text = '×'; closeBtn.size = 24; closeBtn.textColor = 0xffffff;
  closeBtn.right = 12; closeBtn.top = 8; closeBtn.touchEnabled = true;
  var self = this;
  closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.closePanel(); }, this);
  panel.addChild(closeBtn);

  // 3列 × 2行 头像格子
  var COLS = 3, CELL_W = 92, CELL_H = 104, GAP = 10;
  var START_X = (338 - COLS * CELL_W - (COLS - 1) * GAP) / 2;
  var START_Y = 64;

  for (var i = 0; i < AVATAR_DEFS.length; i++) {
    (function(idx) {
      var def = AVATAR_DEFS[idx] || AVATAR_DEFS[0];
      var col = idx % COLS, row = Math.floor(idx / COLS);
      var cx = START_X + col * (CELL_W + GAP);
      var cy = START_Y + row * (CELL_H + GAP);

      var cell = new eui.Group();
      cell.width = CELL_W; cell.height = CELL_H;
      cell.x = cx; cell.y = cy;
      cell.touchEnabled = true;

      // 选中高亮边框
      var border = new eui.Rect();
      border.width = CELL_W; border.height = CELL_H;
      border.ellipseWidth = 10; border.ellipseHeight = 10;
      border.fillColor = 0x0d0926;
      border.strokeColor = (self.avatarIdx === idx) ? 0xfbbf24 : 0x3b2f66;
      border.strokeWeight = (self.avatarIdx === idx) ? 2 : 1;
      border.percentWidth = 100; border.percentHeight = 100;
      cell.addChild(border);

      // 头像圆形底色
      var iconBg = new eui.Rect();
      iconBg.width = 60; iconBg.height = 60;
      iconBg.ellipseWidth = 18; iconBg.ellipseHeight = 18;
      iconBg.fillColor = def.color;
      iconBg.strokeColor = THEME.accentSoft; iconBg.strokeWeight = 0.8; iconBg.strokeAlpha = 0.65;
      iconBg.horizontalCenter = 0; iconBg.top = 8;
      cell.addChild(iconBg);

      var iconImg = new eui.Image();
      self.fitImageToBox(iconImg, def.asset, 66, 66, 13, 4);
      cell.addChild(iconImg);

      var nameLb2 = new eui.Label();
      nameLb2.text = def.name; nameLb2.size = def.name.length > 4 ? 9 : 10;
      nameLb2.textColor = (self.avatarIdx === idx) ? THEME.textGold : 0xcccccc;
      nameLb2.width = CELL_W; nameLb2.height = 14; nameLb2.textAlign = 'center';
      nameLb2.x = 0; nameLb2.top = 76;
      cell.addChild(nameLb2);

      var jobHint = new eui.Label();
      jobHint.text = idx === 0 ? '当前职业' : '形象';
      jobHint.size = 8; jobHint.textColor = THEME.textDim;
      jobHint.width = CELL_W; jobHint.height = 10; jobHint.textAlign = 'center';
      jobHint.x = 0; jobHint.top = 91;
      cell.addChild(jobHint);

      cell.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
        self.avatarIdx = idx;
        // 刷新顶部头像显示
        if (self._avatarBg) self._avatarBg.fillColor = def.color;
        if (self._avatarImage) self.fitImageToBox(self._avatarImage, def.asset, 50, 50, 3, 3);
        self.saveGame();
        self.closePanel();
        self.showToast('✅ 头像已更换为' + def.name);
      }, self);

      panel.addChild(cell);
    })(i);
  }

  overlay.addChild(panel);
};

// ==================== 昵称编辑器 ====================

Game.prototype.openNameEditor = function() {
  var overlay = this.createPanelOverlay();
  var panel = new eui.Group();
  panel.width = 300; panel.height = 220;
  panel.horizontalCenter = 0; panel.verticalCenter = 0;
  var pBg = new eui.Rect();
  pBg.percentWidth = 100; pBg.percentHeight = 100;
  pBg.fillColor = 0x2a1f5c; pBg.ellipseWidth = 12; pBg.ellipseHeight = 12;
  panel.addChild(pBg);

  var title = new eui.Label();
  title.text = '修改昵称'; title.size = 16; title.textColor = 0xffffff; title.bold = true;
  title.horizontalCenter = 0; title.top = 16;
  panel.addChild(title);

  var closeBtn = new eui.Label();
  closeBtn.text = '×'; closeBtn.size = 24; closeBtn.textColor = 0xffffff;
  closeBtn.right = 12; closeBtn.top = 8; closeBtn.touchEnabled = true;
  var self = this;
  closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.closePanel(); }, this);
  panel.addChild(closeBtn);

  var hint = new eui.Label();
  hint.text = '当前昵称：' + (this.playerName || makeDefaultPlayerName());
  hint.size = 12; hint.textColor = 0xaaaaaa;
  hint.horizontalCenter = 0; hint.top = 52;
  panel.addChild(hint);

  var tip = new eui.Label();
  tip.text = '点击下方按钮，在弹出框中输入新昵称\n（最多8个字符）';
  tip.size = 11; tip.textColor = 0x888888;
  tip.horizontalCenter = 0; tip.top = 80; tip.lineSpacing = 4;
  panel.addChild(tip);

  // 快选昵称按钮
  var presets = ['勇者', '法师王', '打豆人', '无敌怪', '豆豆侠'];
  for (var i = 0; i < presets.length; i++) {
    (function(name, idx) {
      var col = idx % 3, row = Math.floor(idx / 3);
      var pb = self.createButton(name, 0x4a2d6b, 70, 26, function() {
        self.playerName = name;
        if (self._nameLb) self._nameLb.text = name;
        self.saveGame();
        self.closePanel();
        self.showToast('✅ 昵称已改为：' + name);
      }, self);
      pb.x = 30 + col * 82; pb.y = 120 + row * 34;
      panel.addChild(pb);
    })(presets[i], i);
  }

  // 手动输入按钮（调用 prompt）
  var inputBtn = self.createButton('✏️ 手动输入', 0x27ae60, 120, 34, function() {
    // Egret 环境中通过 prompt 获取输入
    var newName = window.prompt ? window.prompt('请输入新昵称（最多8个字符）：', self.playerName || makeDefaultPlayerName()) : self.playerName;
    if (newName && newName.trim()) {
      var trimmed = newName.trim().slice(0, 8);
      self.playerName = trimmed;
      if (self._nameLb) self._nameLb.text = trimmed;
      self.saveGame();
      self.closePanel();
      self.showToast('✅ 昵称已改为：' + trimmed);
    }
  }, self);
  inputBtn.horizontalCenter = 0; inputBtn.top = 168;
  panel.addChild(inputBtn);

  overlay.addChild(panel);
};

// ==================== 职业 / 转职 ====================

Game.prototype.openCareerPanel = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay, { title: '职业详情' });
  var self = this;
  var contentX = panel._contentX || 16;
  var contentW = panel._contentW || 343;
  var y = 66;
  var current = this.getJobDef(this.jobId);

  var title = new eui.Label();
  title.text = '职业详情';
  title.size = 18; title.bold = true; title.textColor = 0xffffff;
  title.x = contentX + 96; title.y = 16; title.width = contentW - 120; title.height = 22;
  title.textAlign = 'center';
  panel.addChild(title);

  var heroCard = new eui.Group();
  heroCard.width = contentW; heroCard.height = 100;
  heroCard.x = contentX; heroCard.y = y;
  var heroBg = new eui.Rect();
  heroBg.percentWidth = 100; heroBg.percentHeight = 100;
  heroBg.ellipseWidth = 10; heroBg.ellipseHeight = 10;
  heroBg.fillColor = 0x17103a; heroBg.fillAlpha = 0.98;
  heroBg.strokeColor = current.color || THEME.lavender; heroBg.strokeWeight = 1; heroBg.strokeAlpha = 0.58;
  heroCard.addChild(heroBg);
  var avatarDef = AVATAR_DEFS[this.avatarIdx || 0] || AVATAR_DEFS[0];
  var avatarBg = new eui.Rect();
  avatarBg.width = 68; avatarBg.height = 68; avatarBg.x = 12; avatarBg.y = 16;
  avatarBg.ellipseWidth = 18; avatarBg.ellipseHeight = 18;
  avatarBg.fillColor = avatarDef.color; avatarBg.strokeColor = THEME.strokeGold; avatarBg.strokeWeight = 0.9; avatarBg.strokeAlpha = 0.72;
  heroCard.addChild(avatarBg);
  var avatarImg = new eui.Image();
  this.fitImageToBox(avatarImg, avatarDef.asset, 74, 74, 9, 12);
  heroCard.addChild(avatarImg);
  var curName = new eui.Label();
  curName.text = (this.playerName || makeDefaultPlayerName()) + ' · ' + current.name;
  curName.size = 15; curName.bold = true; curName.textColor = current.color || THEME.textGold;
  curName.x = 94; curName.y = 17; curName.width = contentW - 108; curName.height = 20;
  heroCard.addChild(curName);
  var curInfo = new eui.Label();
  curInfo.text = '等级 Lv.' + this.mainLevel + '    钻石 ' + (this.rebirthGems || 0);
  curInfo.size = 11; curInfo.textColor = THEME.textDim;
  curInfo.x = 94; curInfo.y = 43; curInfo.width = contentW - 108; curInfo.height = 16;
  heroCard.addChild(curInfo);
  var desc = new eui.Label();
  desc.text = '当前加成：' + this.getJobBonusText(current);
  desc.size = 11; desc.textColor = 0xd9d2ff; desc.lineSpacing = 3;
  desc.x = 94; desc.y = 63; desc.width = contentW - 108; desc.height = 34;
  heroCard.addChild(desc);
  panel.addChild(heroCard);

  var hint = new eui.Label();
  hint.text = '转职消耗钻石并立即生效：每个职业提供 1 条专属加成，效果随存档保留。可随时再次转职，费用按目标职业收取。';
  hint.size = 11; hint.textColor = THEME.textDim; hint.lineSpacing = 4;
  hint.x = contentX; hint.y = y + 114; hint.width = contentW; hint.height = 36;
  panel.addChild(hint);

  var listY = y + 160;
  for (var i = 0; i < JOB_DEFS.length; i++) {
    (function(job, idx) {
      var row = new eui.Group();
      row.width = contentW; row.height = 70;
      row.x = contentX; row.y = listY + idx * 78;
      var selected = self.jobId === job.id;
      var canPay = (self.rebirthGems || 0) >= job.cost;
      var rowBg = new eui.Rect();
      rowBg.percentWidth = 100; rowBg.percentHeight = 100;
      rowBg.ellipseWidth = 9; rowBg.ellipseHeight = 9;
      rowBg.fillColor = selected ? 0x24183f : 0x151038;
      rowBg.fillAlpha = 0.98;
      rowBg.strokeColor = selected ? THEME.strokeGold : (job.color || THEME.lavender);
      rowBg.strokeWeight = selected ? 1.2 : 0.8; rowBg.strokeAlpha = selected ? 0.72 : 0.42;
      row.addChild(rowBg);

      var badge = new eui.Rect();
      badge.width = 42; badge.height = 42; badge.x = 12; badge.y = 14;
      badge.ellipseWidth = 14; badge.ellipseHeight = 14;
      badge.fillColor = job.color || THEME.lavender; badge.fillAlpha = 0.18;
      badge.strokeColor = job.color || THEME.lavender; badge.strokeWeight = 1; badge.strokeAlpha = 0.7;
      row.addChild(badge);
      var badgeLb = new eui.Label();
      badgeLb.text = selected ? '现' : '职'; badgeLb.size = 17; badgeLb.bold = true; badgeLb.textColor = job.color || THEME.textGold;
      badgeLb.width = 42; badgeLb.height = 24; badgeLb.x = 12; badgeLb.y = 23; badgeLb.textAlign = 'center';
      row.addChild(badgeLb);

      var name = new eui.Label();
      name.text = job.name; name.size = 14; name.bold = true; name.textColor = job.color || THEME.textGold;
      name.x = 66; name.y = 11; name.width = 92; name.height = 20;
      row.addChild(name);
      var detail = new eui.Label();
      detail.text = self.getJobBonusText(job) + '\n' + job.desc; detail.size = 10; detail.textColor = 0xd9d2ff; detail.lineSpacing = 3;
      detail.x = 66; detail.y = 34; detail.width = contentW - 172; detail.height = 30;
      row.addChild(detail);

      var btnText = selected ? '当前' : (job.cost ? ('钻石' + job.cost) : '选择');
      var btnColor = selected ? 0x555555 : (canPay ? 0x8e44ad : 0x3b3b46);
      var btn = self.createButton(btnText, btnColor, 74, 30, function() {
        if (selected) {
          self.showToast('当前已经是' + job.name);
          return;
        }
        if (self.rebirthGems < job.cost) {
          self.showToast('钻石不足，需要' + job.cost + '钻石');
          return;
        }
        self.rebirthGems -= job.cost;
        self.jobId = job.id;
        self.refreshJobHud();
        self.updateUI();
        self.saveGame();
        self.closePanel();
        self.showToast('转职成功：' + job.name + '（' + self.getJobBonusText(job) + '）');
      }, self);
      btn.x = contentW - 86; btn.y = 20;
      row.addChild(btn);
      panel.addChild(row);
    })(JOB_DEFS[i], i);
  }
};

// ==================== BOSS 全屏闪烁动效 ====================

Game.prototype.showBossFlash = function() {
  if (!this.main.stage) return;
  var sw = this.main.stage.stageWidth;
  var sh = this.main.stage.stageHeight;
  var flash = new eui.Group();
  flash.width = sw; flash.height = sh;
  flash.x = 0; flash.y = 0;
  flash.touchEnabled = false;
  var flashBg = new eui.Rect();
  flashBg.percentWidth = 100; flashBg.percentHeight = 100;
  flashBg.fillColor = 0xe74c3c; flashBg.fillAlpha = 0;
  flash.addChild(flashBg);
  // 「BOSS！」文字
  var bossLb = new eui.Label();
  bossLb.text = '💀 BOSS 出现！'; bossLb.size = 32; bossLb.textColor = 0xffffff;
  bossLb.bold = true; bossLb.alpha = 0;
  bossLb.horizontalCenter = 0; bossLb.verticalCenter = 0;
  flash.addChild(bossLb);
  this.main.stage.addChild(flash);

  // 闪烁 2 次后消失
  egret.Tween.get(flashBg)
    .to({ fillAlpha: 0.45 }, 120)
    .to({ fillAlpha: 0.05 }, 150)
    .to({ fillAlpha: 0.35 }, 100)
    .to({ fillAlpha: 0 }, 200)
    .call(function() { if (flash.parent) flash.parent.removeChild(flash); });
  egret.Tween.get(bossLb)
    .to({ alpha: 1 }, 120)
    .wait(300)
    .to({ alpha: 0, y: (bossLb.y || 0) - 30 }, 250);
};

// ==================== 辅助角色 UI 刷新 ====================

Game.prototype.refreshSupportViews = function() {
  var battleH = this._battleH || 400;
  var stageW = this._stageW || 375;
  var topBtnH = 0;
  var row2H = 0;
  var supColW = 68;
  var supportSlotW = 70;
  var supportSlotH = 88;
  var areaY = topBtnH + row2H + 28;
  var areaH = battleH - areaY - 36;
  var slotH = Math.floor(areaH / 4);
  this._supportSlots = [];
  if (this.leftSupGroup) {
    this.leftSupGroup.x = 3;
    this.leftSupGroup.y = areaY;
    this.leftSupGroup.width = supColW;
    this.leftSupGroup.height = areaH;
    while (this.leftSupGroup.numChildren > 0) {
      this.leftSupGroup.removeChildAt(0);
    }
    for (var i = 0; i < 4; i++) {
      var slotY = i * slotH + Math.floor((slotH - supportSlotH) / 2);
      var slot = this.createSupportSlot(i, true);
      slot.x = -1; slot.y = slotY;
      this.leftSupGroup.addChild(slot);
      this._supportSlots[i] = { x: this.leftSupGroup.x + slot.x + supportSlotW / 2, y: this.leftSupGroup.y + slot.y + supportSlotH / 2 };
    }
  }
  if (this.rightSupGroup) {
    this.rightSupGroup.x = stageW - supColW - 3;
    this.rightSupGroup.y = areaY;
    this.rightSupGroup.width = supColW;
    this.rightSupGroup.height = areaH;
    while (this.rightSupGroup.numChildren > 0) {
      this.rightSupGroup.removeChildAt(0);
    }
    for (var i = 4; i < 8; i++) {
      var slotY = (i - 4) * slotH + Math.floor((slotH - supportSlotH) / 2);
      var slot = this.createSupportSlot(i, false);
      slot.x = -1; slot.y = slotY;
      this.rightSupGroup.addChild(slot);
      this._supportSlots[i] = { x: this.rightSupGroup.x + slot.x + supportSlotW / 2, y: this.rightSupGroup.y + slot.y + supportSlotH / 2 };
    }
  }
};
