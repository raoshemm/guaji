// ==================== 吃饭睡觉打豆豆 - Egret引擎版 ====================
//
// 视觉系统："星夜糖果屋"（Starry Candy Cottage）
// --------------------------------------------------------------
// 主题：深夜空魔法绘本 × 放置点击 RPG。所有界面色彩从 THEME 统一取值，
// 避免各模块各自写颜色常量导致风格碎裂。修改整站风格只需动 THEME。
// --------------------------------------------------------------
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

var CONFIG = {
  maxEnergy: 100,
  energyRecovery: 2,
  bossTimeLimit: 10,  // BOSS限时（秒）
  monsterHp: function(wave) { return Math.floor(100 * Math.pow(wave, 1.25)); },
  goldReward: function(wave, isBoss) { return Math.floor(5 * Math.pow(wave, 1.1) * (isBoss ? 5 : 1)); },
  mainDmg: function(level, gems) {
    var mult = 1 + (gems || 0) * 0.1;
    return Math.floor(80 * Math.pow(level, 1.35) * mult);
  },
  upgradeCost: function(level) { return Math.floor(30 * Math.pow(1.4, level - 1)); },
  supportCost: function(level) { return Math.floor(20 * Math.pow(1.35, level - 1)); },
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
  { name: '轻击', cd: 0,  dmg: 1,   hits: 1, lv: 1,  color: 0x5ec8ff, icon: 'slash',   glow: 0xa8e0ff },
  { name: '破岳', cd: 5,  dmg: 2,   hits: 1, lv: 3,  color: 0xef4444, icon: 'smash',   glow: 0xffb5b5 },
  { name: '连斩', cd: 8,  dmg: 0.8, hits: 3, lv: 5,  color: 0xfbbf24, icon: 'triple',  glow: 0xfff1b0 },
  { name: '裂光', cd: 12, dmg: 4,   hits: 1, lv: 8,  color: 0xc7a7ff, icon: 'crit',    glow: 0xe7d4ff },
  { name: '糖风', cd: 18, dmg: 2.5, hits: 0, lv: 12, color: 0x7be8b7, icon: 'whirl',   glow: 0xc5f5dd },
  { name: '雷霆', cd: 30, dmg: 6,   hits: 1, lv: 18, color: 0xffd166, icon: 'thunder', glow: 0xffe8a5 },
  { name: '星陨', cd: 60, dmg: 12,  hits: 1, lv: 25, color: 0xff7eb0, icon: 'meteor',  glow: 0xffcfe2 }
];

// 怪物类型定义（三层光影风格）
//   highlight 浅色高光 / accent 点缀色（牙爪等）
var MONSTER_TYPES = [
  { name: '史莱姆', shape: 'slime',  color: 0x2ecc71, highlight: 0xa8ffcf, outline: 0x1e5f38, hpColor: 0x2ecc71, badge: 0x1e5f38, accent: 0xfff59d },
  { name: '兔兔',   shape: 'rabbit', color: 0xffc9d9, highlight: 0xffe9f2, outline: 0xb83d6a, hpColor: 0xff69b4, badge: 0xb83d6a, accent: 0xe91e63 },
  { name: '蝙蝠',   shape: 'bat',    color: 0x7e3cb8, highlight: 0xbd85e2, outline: 0x32124a, hpColor: 0x9b59b6, badge: 0x32124a, accent: 0xff3030 },
  { name: '刺球',   shape: 'spike',  color: 0xe74c3c, highlight: 0xff8a7a, outline: 0x7a1a10, hpColor: 0xe74c3c, badge: 0x7a1a10, accent: 0xfff59d },
  { name: '幽灵',   shape: 'ghost',  color: 0xe8f1ff, highlight: 0xffffff, outline: 0x4a3a6c, hpColor: 0xa0afc8, badge: 0x4a3a6c, accent: 0x5ec8ff },
  { name: '骷髅',   shape: 'skull',  color: 0xf0ebe0, highlight: 0xffffff, outline: 0x2c2640, hpColor: 0xbdc3c7, badge: 0x2c2640, accent: 0xff3333 },
  { name: '火龙',   shape: 'dragon', color: 0xe67e22, highlight: 0xffbe76, outline: 0x7a2d06, hpColor: 0xf39c12, badge: 0x7a2d06, accent: 0xff4500 },
  { name: '暗影',   shape: 'shadow', color: 0x1a1030, highlight: 0x4b3a7a, outline: 0x000000, hpColor: 0x34495e, badge: 0x000000, accent: 0xff0000 }
];

// 辅助角色（糖果精灵队）
//   role     物理 phys / 法术 magic（决定攻击动画）
//   shape    createSupportView + bullet 绘制 key
var SUPPORTS_DEF = [
  { name: '糖糖',   dps: 15,  wave: 0,   atkInterval: 1200, color: 0xff7eb0, shape: 'candy',       role: 'phys',  symbol: '糖糖'   },
  { name: '棉花糖', dps: 28,  wave: 5,   atkInterval: 1500, color: 0xf8c4d9, shape: 'marshmallow', role: 'magic', symbol: '棉花糖' },
  { name: '肉丸',   dps: 45,  wave: 15,  atkInterval: 1000, color: 0xd96a31, shape: 'meatball',    role: 'phys',  symbol: '肉丸'   },
  { name: '布丁',   dps: 75,  wave: 30,  atkInterval: 1800, color: 0xf5c842, shape: 'pudding',     role: 'phys',  symbol: '布丁'   },
  { name: '蛋筒',   dps: 120, wave: 50,  atkInterval: 900,  color: 0xff9933, shape: 'cone',        role: 'phys',  symbol: '蛋筒'   },
  { name: '麻薯',   dps: 200, wave: 80,  atkInterval: 1400, color: 0xc7a7ff, shape: 'mochi',       role: 'magic', symbol: '麻薯'   },
  { name: '月棒冰', dps: 350, wave: 120, atkInterval: 1100, color: 0x7be8b7, shape: 'popsicle',    role: 'magic', symbol: '月棒冰' },
  { name: '草莓酱', dps: 600, wave: 180, atkInterval: 1600, color: 0xff5577, shape: 'cake',        role: 'magic', symbol: '草莓酱' }
];

var FOODS = [
  { name: '棒棒糖', icon: '🍭', price: 100, desc: '暴击+10%，攻速+10%' },
  { name: '牛奶',   icon: '🥛', price: 200, desc: '攻击+15%' },
  { name: '烤肉',   icon: '🍖', price: 500, desc: '全属性+20%' }
];

var SPIN_PRIZES = [
  { text: '50金',   type: 'gold', value: 50,   weight: 30 },
  { text: '100金',  type: 'gold', value: 100,  weight: 25 },
  { text: '200金',  type: 'gold', value: 200,  weight: 15 },
  { text: '500金',  type: 'gold', value: 500,  weight: 8 },
  { text: '🍭×1', type: 'food', value: '棒棒糖', weight: 8 },
  { text: '🥛×1', type: 'food', value: '牛奶', weight: 6 },
  { text: '20能量', type: 'energy', value: 20, weight: 5 },
  { text: '1000金', type: 'gold', value: 1000, weight: 3 }
];

var CHECKIN_REWARDS = [
  { gold: 100, bonus: null },
  { gold: 200, bonus: null },
  { gold: 300, bonus: { name: '棒棒糖', icon: '🍭' } },
  { gold: 400, bonus: null },
  { gold: 500, bonus: { name: '牛奶', icon: '🥛' } },
  { gold: 600, bonus: null },
  { gold: 1000, bonus: { name: '烤肉', icon: '🍖' } }
];

var DAILY_TASKS = [
  { id: 'kills', desc: '击杀50只怪物', target: 50, reward: 200, track: function(s) { return s._dailyKills || 0; } },
  { id: 'clicks', desc: '点击200次', target: 200, reward: 150, track: function(s) { return s._dailyClicks || 0; } },
  { id: 'waves', desc: '通关5波', target: 5, reward: 300, track: function(s) { return s._dailyWaves || 0; } }
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
  { id: 'allsupport',icon: '👥', name: '满编战队',   desc: '解锁所有队友',     reward: 10000, check: function(g) { return g.supports.every(function(s){return s.unlocked;}); } },
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

Main.prototype.onAdd = function() {
  this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
  this.game = new Game(this);
};

// ==================== Game 类 ====================
function Game(main) {
  this.main = main;

  // --- 游戏状态 ---
  this.gold = 0;
  this.energy = 100;
  this.mainLevel = 1;
  this.wave = 1;
  this.totalCleared = 0;
  this.killCount = 0;
  this.skillCD = [0,0,0,0,0,0,0];
  this.skillUnlocked = [true,false,false,false,false,false,false];
  this.supports = SUPPORTS_DEF.map(function(s) {
    return { name: s.name, dps: s.dps, wave: s.wave, level: 1, unlocked: s.wave === 0 };
  });
  this.monsters = [];
  this.foods = { '棒棒糖': 0, '牛奶': 0, '烤肉': 0 };
  this.freeSpins = 3;
  this.spinDate = new Date().toDateString();
  this.stats = { totalKills: 0, totalGold: 0, totalClicks: 0, playTime: 0, bossKills: 0 };
  this.achievements = [];
  this.checkinDay = 0;
  this.checkinDate = '';
  this.dailyTaskDate = '';
  this.dailyTaskDone = [false, false, false];
  this.offlineCap = 8;

  // --- 转生系统 ---
  this.rebirthGems = 0;
  this.maxWaveReached = 0;

  // --- 图签系统（怪物图鉴收集） ---
  this.monsterCodex = {}; // { 'slime': { encountered: true, kills: 数量 }, ... }

  // --- 玩家个性化 ---
  this.avatarIdx = 0;       // 头像索引（0-5）
  this.playerName = '玩家'; // 玩家昵称

  // --- BOSS计时器 ---
  this.bossActive = false;
  this.bossTimer = 0;
  this._bossTimerInterval = null;

  // --- UI引用 ---
  this.goldLabel = null;
  this.waveLabel = null;
  this.levelLabel = null;
  this.dpsLabel = null;
  this.energyLabel = null;
  this.waveFill = null;
  this.buffLabel = null;
  this.gemsLabel = null;
  this.bossTimerBar = null;
  this.monsterViews = [];
  this.skillBtns = [];
  this.damageLayer = null;
  this.battleGroup = null;
  this._panelOverlay = null;
  this._justHitMonster = false;

  this.loadGame();
  this.initSound();
  this.buildUI();
  this.spawnWave();
  this.bindEvents();
  this.startLoop();
  this.checkOfflineReward();
  var self = this;
  setTimeout(function() { self.checkDailyCheckin(); }, 1200);

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

Game.prototype.waveText = function() {
  return '第 ' + this.wave + ' 波' + (this.wave % 10 === 0 ? ' 💀BOSS' : '');
};

Game.prototype.totalDps = function() {
  var base = CONFIG.mainDmg(this.mainLevel, this.rebirthGems);
  var supMult = 1 + this.rebirthGems * 0.08;
  var sup = 0;
  for (var i = 0; i < this.supports.length; i++) {
    if (this.supports[i].unlocked) sup += this.supports[i].dps * this.supports[i].level;
  }
  return base + Math.floor(sup * supMult);
};

Game.prototype.getBuffs = function() {
  var l = this.foods['棒棒糖'] || 0;
  var m = this.foods['牛奶'] || 0;
  var r = this.foods['烤肉'] || 0;
  return {
    critChance: 0.1 + l * 0.1,
    attackMult: (1 + m * 0.15) * (1 + r * 0.2),
    speedMult: (1 + l * 0.1) * (1 + r * 0.2),
    supportMult: 1 + r * 0.2
  };
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
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, ctx);
  return g;
};

// ==================== 角色外观绘制 ====================
//
// 统一风格：底座阴影 + 主体 + 描边 + 高光 + 眼睛（_drawEyes）
//
Game.prototype.createSupportView = function(idx, yPos) {
  var s = this.supports[idx];
  var def = SUPPORTS_DEF[idx];
  // 每格 22px 宽，精灵绘制中心在 (11, 16)
  var sc = new eui.Group(); sc.width = 22; sc.height = 50;
  if (yPos !== undefined && yPos !== 0) sc.y = yPos;
  var shape = new egret.Shape();
  var g = shape.graphics;
  var cx = 11, cy = 16;  // 缩小后的中心点

  if (!s.unlocked) {
    // 未解锁：灰色剪影 + 锁
    g.beginFill(0x000000, 0.18);
    g.drawEllipse(cx - 7, cy + 9, 14, 4);
    g.endFill();
    g.lineStyle(1, 0x3a355a);
    g.beginFill(0x4a4566);
    g.drawCircle(cx, cy, 8);
    g.endFill();
    g.lineStyle(0);
    g.beginFill(0xb8b0db);
    g.drawRoundRect(cx - 3, cy - 1, 6, 6, 1, 1);
    g.endFill();
    g.lineStyle(1, 0xb8b0db);
    g.moveTo(cx - 2, cy - 1); g.lineTo(cx - 2, cy - 3);
    g.curveTo(cx - 2, cy - 5, cx, cy - 5);
    g.curveTo(cx + 2, cy - 5, cx + 2, cy - 3);
    g.lineTo(cx + 2, cy - 1);
    g.lineStyle(0);
    shape.x = 0; shape.y = 0;
    sc.addChild(shape);

    var lockNameBg = new eui.Rect();
    lockNameBg.width = 22; lockNameBg.height = 12;
    lockNameBg.ellipseWidth = 4; lockNameBg.ellipseHeight = 4;
    lockNameBg.fillColor = THEME.bgMid; lockNameBg.fillAlpha = 0.85;
    lockNameBg.horizontalCenter = 0; lockNameBg.top = 30;
    sc.addChild(lockNameBg);
    var lockLb = new eui.Label();
    lockLb.text = 'W' + def.wave; lockLb.size = 7; lockLb.bold = true;
    lockLb.textColor = 0x8881b0;
    lockLb.horizontalCenter = 0; lockLb.top = 31;
    sc.addChild(lockLb);
    return sc;
  }

  // === 底座阴影 ===
  g.beginFill(0x000000, 0.22);
  g.drawEllipse(cx - 8, cy + 9, 16, 4);
  g.endFill();

  // 精灵绘制以 (22,22) 为中心，通过 scale 缩小到 22px 格子
  shape.scaleX = 0.5; shape.scaleY = 0.5;
  shape.x = 0; shape.y = 0;
  // 重置 cx/cy 为原始绘制坐标（22,22），scale 后自动缩小
  cx = 22; cy = 22;

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
      this._drawEyes(g, cx - 3, cy - 2, cx + 3, cy - 2, 2, 1);
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
      this._drawEyes(g, cx - 3, cy - 2, cx + 3, cy - 2, 2, 1);
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
      this._drawEyes(g, cx - 3, cy + 1, cx + 3, cy + 1, 2, 1);
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
      this._drawEyes(g, cx - 3, cy + 2, cx + 3, cy + 2, 2, 1);
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
      this._drawEyes(g, cx - 3, cy - 7, cx + 3, cy - 7, 2, 1);
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
      this._drawEyes(g, cx - 4, cy + 1, cx + 4, cy + 1, 2, 1);
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
      this._drawEyes(g, cx - 3, cy, cx + 3, cy, 1.8, 0.9);
      break;

    default:
      g.lineStyle(1.5, 0x333333);
      g.beginFill(def.color);
      g.drawCircle(cx, cy, 13);
      g.endFill();
      this._drawEyes(g, cx - 4, cy - 2, cx + 4, cy - 2, 3, 1.5);
  }

  shape.x = 0; shape.y = 0;
  sc.addChild(shape);

  // 名字标签（金边胶囊，适配 22px 宽）
  var nameBg = new eui.Rect();
  nameBg.width = 22; nameBg.height = 12;
  nameBg.ellipseWidth = 4; nameBg.ellipseHeight = 4;
  nameBg.fillColor = THEME.bgMid; nameBg.fillAlpha = 0.92;
  nameBg.strokeColor = THEME.strokeGold; nameBg.strokeWeight = 0.5;
  nameBg.horizontalCenter = 0; nameBg.top = 30;
  sc.addChild(nameBg);
  var sl = new eui.Label();
  sl.text = def.symbol.length > 2 ? def.symbol.slice(0, 2) : def.symbol;
  sl.size = 7; sl.bold = true;
  sl.textColor = THEME.textMain;
  sl.horizontalCenter = 0; sl.top = 31;
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

// ==================== 攻击动画系统 ====================

// 主角攻击动画（向上冲刺 + 剑气弧线）
Game.prototype.heroAttackAnim = function(targetIdx) {
  if (!this.heroGroup) return;
  var origY = this._heroBaseY;
  // 停止之前的动画，防止叠加
  egret.Tween.removeTweens(this.heroGroup);
  this.heroGroup.y = origY;
  // 向上冲刺
  egret.Tween.get(this.heroGroup)
    .to({ y: origY - 16 }, 50, egret.Ease.quadOut)
    .to({ y: origY }, 70, egret.Ease.quadIn);

  // 剑气弧线（从主角飞向怪物，带弧度）
  var w = this.monsters.length || 1;
  var cx = this._centerX || 55;
  var cw = this._centerW || 265;
  var startX = cx + cw / 2;
  var startY = origY + 10;
  var endX = cx + cw * ((targetIdx >= 0 ? targetIdx : 0) + 0.5) / w;
  var endY = this._monsterAreaY + this._monsterAreaH / 2 + 10;

  var arc = new egret.Shape();
  arc.graphics.lineStyle(3, 0x5dade2, 0.9);
  // 弧形剑气
  arc.graphics.moveTo(-15, -3);
  arc.graphics.curveTo(0, -10, 15, -3);
  arc.graphics.moveTo(-15, 3);
  arc.graphics.curveTo(0, 10, 15, 3);
  arc.x = startX; arc.y = startY;
  arc.rotation = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  this.damageLayer.addChild(arc);
  egret.Tween.get(arc)
    .to({ x: endX, y: endY, scaleX: 0.6, scaleY: 0.6, alpha: 0.3 }, 140)
    .to({ alpha: 0 }, 60)
    .call(function() { if (arc.parent) arc.parent.removeChild(arc); });
};

// 辅助英雄攻击动画（缩放 + 不同形状飞弹）
// 辅助英雄攻击动画（物理系前冲挥砍 / 法术系施法光环+飞弹）
Game.prototype.supportAttackAnim = function(supportIdx, targetIdx, dmg) {
  var group = supportIdx < 4 ? this.leftSupGroup : this.rightSupGroup;
  if (!group) return;
  var localIdx = supportIdx < 4 ? supportIdx : (supportIdx - 4);
  var sc = group.getChildAt(localIdx);
  var def = SUPPORTS_DEF[supportIdx];
  var color = def.color;
  var sw = this._stageW || 375;
  var bh = this._battleH || 400;
  var startX = supportIdx < 4 ? (2 + 22) : (sw - 48 + 22);
  var startY = Math.floor(bh * 0.15) + localIdx * 56 + 20;
  var w = this.monsters.length || 1;
  var cx = this._centerX || 55;
  var cw = this._centerW || 265;
  var endX = cx + cw * ((targetIdx >= 0 ? targetIdx : 0) + 0.5) / w;
  var endY = this._monsterAreaY + this._monsterAreaH / 2;
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
      var dir = supportIdx < 4 ? -1 : 1;
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

  // 主容器用 VerticalLayout，固定高度确保子元素正确分配
  var layout = new eui.VerticalLayout();
  layout.gap = 0;
  this.main.layout = layout;

  var TOP_H = 70;    // 顶部栏高度（含HP条）
  var SKILL_H = 52;  // 技能栏高度
  var NAV_H = 50;    // 底部导航高度
  var stageH = this.main.stage ? this.main.stage.stageHeight : 667;
  var BATTLE_H = Math.max(300, stageH - TOP_H - SKILL_H - NAV_H);
  this._stageW = stageW;
  this._battleH = BATTLE_H;

  // ===== 顶部栏 =====
  var topBar = new eui.Group();
  topBar.width = stageW; topBar.height = TOP_H;
  var topBg = new eui.Rect();
  topBg.percentWidth = 100; topBg.percentHeight = 100; topBg.fillColor = THEME.bgMid;
  topBar.addChild(topBg);
  var topUnderline = new eui.Rect();
  topUnderline.percentWidth = 100; topUnderline.height = 1;
  topUnderline.bottom = 0; topUnderline.fillColor = THEME.strokeGold; topUnderline.fillAlpha = 0.6;
  topBar.addChild(topUnderline);

  // --- Row1 左：头像（36x36，可点击切换，无 VIP 徽章）---
  // 头像颜色调色板（6 种）
  var AVATAR_COLORS = [0x8b4513, 0x3498db, 0x27ae60, 0xe74c3c, 0x9b59b6, 0xe67e22];
  var AVATAR_ICONS  = ['🧙','🐼','🦊','🐯','🐸','🐺'];
  var avatarGroup = new eui.Group();
  avatarGroup.width = 38; avatarGroup.height = 38;
  avatarGroup.x = 4; avatarGroup.y = 3;
  avatarGroup.touchEnabled = true;
  var avatarBg = new eui.Rect();
  avatarBg.width = 38; avatarBg.height = 38; avatarBg.ellipseWidth = 8; avatarBg.ellipseHeight = 8;
  avatarBg.fillColor = AVATAR_COLORS[this.avatarIdx || 0];
  avatarBg.percentWidth = 100; avatarBg.percentHeight = 100;
  avatarGroup.addChild(avatarBg);
  var avatarIcon = new eui.Label();
  avatarIcon.text = AVATAR_ICONS[this.avatarIdx || 0];
  avatarIcon.size = 18; avatarIcon.horizontalCenter = 0; avatarIcon.verticalCenter = 0;
  avatarGroup.addChild(avatarIcon);
  // 点击头像打开选择面板
  avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.openAvatarPicker(); }, this);
  this._avatarBg   = avatarBg;
  this._avatarIcon = avatarIcon;
  topBar.addChild(avatarGroup);

  // --- Row1 中：昵称（可点击修改）+ 波次 ---
  var nameLb = new eui.Label();
  nameLb.text = (this.playerName || '玩家') + ' ✏️';
  nameLb.size = 13; nameLb.textColor = 0xffffff; nameLb.bold = true;
  nameLb.x = 50; nameLb.y = 6; nameLb.touchEnabled = true;
  nameLb.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.openNameEditor(); }, this);
  topBar.addChild(nameLb);
  this._nameLb = nameLb;
  this.waveLabel = new eui.Label();
  this.waveLabel.text = this.waveText(); this.waveLabel.size = 11; this.waveLabel.textColor = 0xfbbf24;
  this.waveLabel.x = 50; this.waveLabel.y = 23;
  topBar.addChild(this.waveLabel);

  // --- Row1 右：金币 / 钻石 / 成就（右对齐，避免重叠） ---
  this.goldLabel = new eui.Label();
  this.goldLabel.text = '💰 ' + this.fmt(this.gold);
  this.goldLabel.size = 13; this.goldLabel.textColor = 0xffd700; this.goldLabel.bold = true;
  this.goldLabel.right = 8; this.goldLabel.y = 6;
  topBar.addChild(this.goldLabel);

  this.gemsLabel = new eui.Label();
  this.gemsLabel.text = '💎 ' + this.rebirthGems;
  this.gemsLabel.size = 11; this.gemsLabel.textColor = 0xb28dd6;
  this.gemsLabel.right = 8; this.gemsLabel.y = 24;
  topBar.addChild(this.gemsLabel);

  // 成就按钮：放在 Row1 中段和右段之间
  var achBtn = new eui.Label();
  achBtn.text = '🏆 ' + this.achievements.length;
  achBtn.size = 12; achBtn.textColor = 0xf39c12; achBtn.touchEnabled = true;
  achBtn.right = 60; achBtn.y = 24;
  achBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openAchievements, this);
  topBar.addChild(achBtn);

  // 静音切换按钮
  this.muteLabel = new eui.Label();
  this.muteLabel.text = this.soundMuted ? '🔇' : '🔊';
  this.muteLabel.size = 14; this.muteLabel.touchEnabled = true;
  this.muteLabel.right = 108; this.muteLabel.y = 23;
  this.muteLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toggleMute, this);
  topBar.addChild(this.muteLabel);

  // 保留 updateWaveNumbers 的引用，避免其他地方调用时崩溃
  this._waveNumBgs = [];
  this._waveNumLbs = [];

  // --- Row2：怪物 HP 汇总条（满宽） ---
  var HP_X = 10, HP_Y = 44, HP_W = stageW - 20, HP_H = 16;
  var hpBg = new eui.Rect();
  hpBg.width = HP_W; hpBg.height = HP_H; hpBg.ellipseWidth = 8; hpBg.ellipseHeight = 8;
  hpBg.fillColor = 0x1a1a1a; hpBg.x = HP_X; hpBg.y = HP_Y;
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
  this.hpLabel.horizontalCenter = 0; this.hpLabel.y = HP_Y + 2;
  topBar.addChild(this.hpLabel);

  this.main.addChild(topBar);

  // ===== 战斗区域 =====
  this.battleGroup = new eui.Group();
  this.battleGroup.width = stageW; this.battleGroup.height = BATTLE_H;
  this.battleGroup.touchEnabled = true;

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
  this.battleGroup.addChild(deco);

  // =========================================================
  // 战斗区布局分区（375px 宽）
  //
  //   第一行(y:0~30)   满宽横排6个图标按钮（签到/每日/邮件/公告/磨转/能量）
  //   第二行(y:30~60)  满宽横排：BOSS挑战 + 图签（各占一半，居中）
  //   左辅助列  x:0~52   上下4个精灵（单列，scale=0.7放大）
  //   中央区    x:52~323 宽271（怪物 + 主角）
  //   右辅助列  x:323~375 上下4个精灵
  // =========================================================

  // ① 第一行：功能横排（6个图标按钮）
  var TOP_BTN_H = 30;
  var topBtnDefs = [
    { icon: '📅', text: '签到', fn: function() { self.openCheckin(); } },
    { icon: '📋', text: '每日', fn: function() { self.openDailyTasks(); } },
    { icon: '📬', text: '邮件', fn: function() { self.openMail(); } },
    { icon: '📢', text: '公告', fn: function() { self.openAnnouncement(); } },
    { icon: '🔄', text: '磨转', fn: function() { self.openRebirth(); } },
    { icon: '⚡', text: '能量', fn: function() { self.openEnergyHelp(); } }
  ];
  var topBtnW = Math.floor(stageW / topBtnDefs.length);
  for (var i = 0; i < topBtnDefs.length; i++) {
    var tbd = topBtnDefs[i];
    var tbg = new eui.Group();
    tbg.width = topBtnW; tbg.height = TOP_BTN_H;
    tbg.x = i * topBtnW; tbg.y = 0;
    tbg.touchEnabled = true;
    var tbbg = new eui.Rect();
    tbbg.width = topBtnW - 2; tbbg.height = TOP_BTN_H - 2;
    tbbg.x = 1; tbbg.y = 1;
    tbbg.ellipseWidth = 6; tbbg.ellipseHeight = 6;
    tbbg.fillColor = THEME.bgLite; tbbg.fillAlpha = 0.9;
    tbbg.strokeColor = THEME.strokeGold; tbbg.strokeWeight = 0.8; tbbg.strokeAlpha = 0.5;
    tbg.addChild(tbbg);
    var tbIcon = new eui.Label();
    tbIcon.text = tbd.icon; tbIcon.size = 13;
    tbIcon.x = Math.floor((topBtnW - 13) / 2) - 2; tbIcon.y = 1;
    tbg.addChild(tbIcon);
    var tbLb = new eui.Label();
    tbLb.text = tbd.text; tbLb.size = 8; tbLb.bold = true;
    tbLb.textColor = THEME.accentSoft;
    tbLb.width = topBtnW; tbLb.height = 10; tbLb.textAlign = 'center';
    tbLb.x = 0; tbLb.y = 18;
    tbg.addChild(tbLb);
    (function(fn) {
      tbg.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, self);
    })(tbd.fn);
    this.battleGroup.addChild(tbg);
  }

  // ② 第二行：BOSS挑战 + 图签（各占一半，横排居中）
  var ROW2_Y = TOP_BTN_H + 2;
  var ROW2_H = 28;
  var ROW2_BTN_W = Math.floor(stageW / 2) - 4;
  // BOSS按钮（左半）
  var bossBtnGroup = new eui.Group();
  bossBtnGroup.width = ROW2_BTN_W; bossBtnGroup.height = ROW2_H;
  bossBtnGroup.x = 2; bossBtnGroup.y = ROW2_Y;
  bossBtnGroup.touchEnabled = true;
  this._bossBtnBg = new eui.Rect();
  this._bossBtnBg.width = ROW2_BTN_W; this._bossBtnBg.height = ROW2_H;
  this._bossBtnBg.ellipseWidth = 8; this._bossBtnBg.ellipseHeight = 8;
  this._bossBtnBg.fillColor = 0x7a1520;
  this._bossBtnBg.strokeColor = 0xff4444; this._bossBtnBg.strokeWeight = 1.2; this._bossBtnBg.strokeAlpha = 0.8;
  bossBtnGroup.addChild(this._bossBtnBg);
  var bossIconLb = new eui.Label();
  bossIconLb.text = '💀'; bossIconLb.size = 14;
  bossIconLb.x = Math.floor(ROW2_BTN_W / 2) - 28; bossIconLb.y = 6;
  bossBtnGroup.addChild(bossIconLb);
  this._bossBtnText = new eui.Label();
  this._bossBtnText.text = '挑战BOSS'; this._bossBtnText.size = 11;
  this._bossBtnText.textColor = 0xffffff; this._bossBtnText.bold = true;
  this._bossBtnText.x = Math.floor(ROW2_BTN_W / 2) - 12; this._bossBtnText.y = 8;
  bossBtnGroup.addChild(this._bossBtnText);
  bossBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
    self.challengeBoss();
  }, this);
  this.battleGroup.addChild(bossBtnGroup);
  this._bossBtnGroup = bossBtnGroup;
  this.updateBossBtn();

  // 图签按钮（右半）
  var codexBtnGroup = new eui.Group();
  codexBtnGroup.width = ROW2_BTN_W; codexBtnGroup.height = ROW2_H;
  codexBtnGroup.x = stageW / 2 + 2; codexBtnGroup.y = ROW2_Y;
  codexBtnGroup.touchEnabled = true;
  var codexBtnBg = new eui.Rect();
  codexBtnBg.width = ROW2_BTN_W; codexBtnBg.height = ROW2_H;
  codexBtnBg.ellipseWidth = 8; codexBtnBg.ellipseHeight = 8;
  codexBtnBg.fillColor = 0x1a4d35;
  codexBtnBg.strokeColor = 0x4ade80; codexBtnBg.strokeWeight = 1; codexBtnBg.strokeAlpha = 0.7;
  codexBtnGroup.addChild(codexBtnBg);
  var codexIconLb = new eui.Label();
  codexIconLb.text = '📖'; codexIconLb.size = 14;
  codexIconLb.x = Math.floor(ROW2_BTN_W / 2) - 28; codexIconLb.y = 6;
  codexBtnGroup.addChild(codexIconLb);
  var codexBtnText = new eui.Label();
  codexBtnText.text = '怪物图签'; codexBtnText.size = 11;
  codexBtnText.textColor = 0xffffff; codexBtnText.bold = true;
  codexBtnText.x = Math.floor(ROW2_BTN_W / 2) - 12; codexBtnText.y = 8;
  codexBtnGroup.addChild(codexBtnText);
  codexBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
    self.openMonsterCodex();
  }, this);
  this.battleGroup.addChild(codexBtnGroup);

  // ③ 左侧辅助角色：单列4个，上下均分，scale=0.7放大
  var SUP_COL_W = 52;
  var SUP_AREA_Y = TOP_BTN_H + ROW2_H + 6;
  var SUP_AREA_H = BATTLE_H - SUP_AREA_Y - 44; // 留底部状态条空间
  var SUP_SLOT_H = Math.floor(SUP_AREA_H / 4);
  var SUP_SCALE = 0.7; // 精灵绘制坐标基于44px，×0.7≈31px实际
  var leftSup = new eui.Group();
  leftSup.x = 0; leftSup.y = SUP_AREA_Y;
  for (var i = 0; i < 4; i++) {
    var sc = this.createSupportView(i, 0);
    sc.scaleX = SUP_SCALE; sc.scaleY = SUP_SCALE;
    sc.x = Math.floor((SUP_COL_W - 22 * SUP_SCALE) / 2);
    sc.y = i * SUP_SLOT_H + Math.floor((SUP_SLOT_H - 50 * SUP_SCALE) / 2);
    leftSup.addChild(sc);
  }
  this.leftSupGroup = leftSup;
  this.battleGroup.addChild(leftSup);

  // ④ 右侧辅助角色：单列4个，上下均分
  var rightSup = new eui.Group();
  rightSup.x = stageW - SUP_COL_W; rightSup.y = SUP_AREA_Y;
  for (var i = 4; i < 8; i++) {
    var sc = this.createSupportView(i, 0);
    sc.scaleX = SUP_SCALE; sc.scaleY = SUP_SCALE;
    sc.x = Math.floor((SUP_COL_W - 22 * SUP_SCALE) / 2);
    sc.y = (i - 4) * SUP_SLOT_H + Math.floor((SUP_SLOT_H - 50 * SUP_SCALE) / 2);
    rightSup.addChild(sc);
  }
  this.rightSupGroup = rightSup;
  this.battleGroup.addChild(rightSup);

  // ⑤ 中央区
  var CENTER_X = SUP_COL_W;               // 52
  var CENTER_W = stageW - SUP_COL_W * 2;  // 271
  this._centerX = CENTER_X;
  this._centerW = CENTER_W;

  // --- 怪物区域 ---
  this._monsterAreaY = SUP_AREA_Y;
  this._monsterAreaH = Math.floor(BATTLE_H * 0.36);

  // --- 主角（居中，靠下，地面线上方）---
  var heroGroup = new eui.Group();
  heroGroup.width = 72; heroGroup.height = 96;
  heroGroup.x = CENTER_X + Math.floor((CENTER_W - 72) / 2);
  heroGroup.y = Math.floor(BATTLE_H * 0.64);
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
  magicCircle.x = 36;
  magicCircle.y = 92;
  magicCircle.scaleY = 0.35;
  heroGroup.addChild(magicCircle);
  this._magicCircle = magicCircle;

  // 主角本体
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
  heroGroup.addChild(heroShape);

  // 名字标签
  var heroNameBg = new eui.Rect();
  heroNameBg.width = 52; heroNameBg.height = 14;
  heroNameBg.ellipseWidth = 7; heroNameBg.ellipseHeight = 7;
  heroNameBg.fillColor = THEME.bgMid; heroNameBg.fillAlpha = 0.85;
  heroNameBg.strokeColor = THEME.strokeGold; heroNameBg.strokeWeight = 0.5;
  heroNameBg.horizontalCenter = 0; heroNameBg.top = 82;
  heroGroup.addChild(heroNameBg);
  var heroName = new eui.Label();
  heroName.text = '星语法师'; heroName.size = 10; heroName.bold = true;
  heroName.textColor = THEME.accentSoft; heroName.horizontalCenter = 0; heroName.top = 83;
  heroGroup.addChild(heroName);
  this.levelLabel = new eui.Label();
  this.levelLabel.text = 'Lv.' + this.mainLevel; this.levelLabel.size = 10;
  this.levelLabel.textColor = THEME.accent; this.levelLabel.bold = true;
  this.levelLabel.horizontalCenter = 0; this.levelLabel.top = 69;
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
  this.dpsLabel.x = CENTER_X; this.dpsLabel.y = heroGroup.y + 98;
  this.battleGroup.addChild(this.dpsLabel);

  // --- 底部状态区（重构：三行垂直分离，修复宽度常量不一致 BUG） ---
  // Row A (statusY)     : BOSS 计时条（条件显示，占满中央区宽度）
  // Row B (statusY+12)  : 当前10波进度条 + 两侧标签
  // Row C (statusY+26)  : 能量条(左) + Buff 文本(右)，文字分离不再压在条上
  var statusY = BATTLE_H - 42;
  var STATUS_W = stageW - 20;
  var STATUS_X = 10;

  // Row A: BOSS 计时条（默认隐藏）
  var bossBarW = STATUS_W - 50; // 左侧留空间给标签
  this.bossTimerBar = new eui.Rect();
  this.bossTimerBar.width = bossBarW; this.bossTimerBar.height = 8;
  this.bossTimerBar.fillColor = 0xe74c3c; this.bossTimerBar.ellipseWidth = 4;
  this.bossTimerBar.x = STATUS_X + 40; this.bossTimerBar.y = statusY;
  this.bossTimerBar.visible = false;
  this.battleGroup.addChild(this.bossTimerBar);
  this._bossBarMaxWidth = bossBarW; // 供 updateBossTimerUI 使用，替换硬编码 280
  this.bossTimerLabel = new eui.Label();
  this.bossTimerLabel.text = ''; this.bossTimerLabel.size = 11; this.bossTimerLabel.textColor = 0xff6666;
  this.bossTimerLabel.bold = true;
  this.bossTimerLabel.x = STATUS_X; this.bossTimerLabel.y = statusY - 2;
  this.bossTimerLabel.visible = false;
  this.battleGroup.addChild(this.bossTimerLabel);

  // Row B: 当前轮次（1-10波）进度条
  this.waveFillBg = new eui.Rect();
  this.waveFillBg.width = STATUS_W; this.waveFillBg.height = 6;
  this.waveFillBg.fillColor = THEME.bgGlass; this.waveFillBg.ellipseWidth = 3;
  this.waveFillBg.x = STATUS_X; this.waveFillBg.y = statusY + 12;
  this.battleGroup.addChild(this.waveFillBg);
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  this.waveFill = new eui.Rect();
  this.waveFill.width = (waveInCycle / 10) * STATUS_W;
  this.waveFill.height = 6; this.waveFill.fillColor = THEME.accent; this.waveFill.ellipseWidth = 3;
  this.waveFill.x = STATUS_X; this.waveFill.y = statusY + 12;
  this.battleGroup.addChild(this.waveFill);
  this._waveFillMaxWidth = STATUS_W; // 供 updateUI 使用

  // Row C: 能量条（左, 120px）+ DPS(中) + Buff(右)
  var ENERGY_W = 120;
  var energyBarBg = new eui.Rect();
  energyBarBg.width = ENERGY_W; energyBarBg.height = 12;
  energyBarBg.ellipseWidth = 6; energyBarBg.ellipseHeight = 6;
  energyBarBg.fillColor = THEME.bgGlass;
  energyBarBg.x = STATUS_X; energyBarBg.y = statusY + 24;
  this.battleGroup.addChild(energyBarBg);
  this.energyFill = new eui.Rect();
  this.energyFill.width = (this.energy / CONFIG.maxEnergy) * ENERGY_W;
  this.energyFill.height = 12;
  this.energyFill.ellipseWidth = 6; this.energyFill.ellipseHeight = 6;
  this.energyFill.fillColor = THEME.sky;
  this.energyFill.x = STATUS_X; this.energyFill.y = statusY + 24;
  this.battleGroup.addChild(this.energyFill);
  this._energyMaxWidth = ENERGY_W; // 供 updateUI 使用（替换硬编码 100）
  // 能量文字：紧跟在条右边，不再压在条上
  this.energyLabel = new eui.Label();
  this.energyLabel.text = '⚡' + this.energy + '/' + CONFIG.maxEnergy;
  this.energyLabel.size = 11; this.energyLabel.textColor = THEME.sky; this.energyLabel.bold = true;
  this.energyLabel.x = STATUS_X + ENERGY_W + 6; this.energyLabel.y = statusY + 25;
  this.battleGroup.addChild(this.energyLabel);

  // Buff 文本（右侧）
  this.buffLabel = new eui.Label();
  this.buffLabel.text = this.renderBuffText();
  this.buffLabel.size = 11; this.buffLabel.textColor = 0xfbbf24;
  this.buffLabel.right = 10; this.buffLabel.y = statusY + 25;
  this.battleGroup.addChild(this.buffLabel);

  // 伤害飘字层（不可触摸）
  this.damageLayer = new eui.Group();
  this.damageLayer.width = stageW; this.damageLayer.height = BATTLE_H;
  this.damageLayer.touchEnabled = false;
  this.damageLayer.touchChildren = false;
  this.battleGroup.addChild(this.damageLayer);

  this.battleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBattleTouch, this);
  this.main.addChild(this.battleGroup);

  // ===== 技能栏 =====
  var skillBar = new eui.Group();
  skillBar.width = stageW; skillBar.height = SKILL_H;
  var skillLayout = new eui.HorizontalLayout();
  skillLayout.horizontalAlign = 'center';
  skillLayout.verticalAlign = 'middle';
  skillLayout.gap = 2;
  skillLayout.paddingLeft = 4;
  skillLayout.paddingRight = 4;
  skillLayout.paddingTop = Math.floor((SKILL_H - 48) / 2);
  skillLayout.paddingBottom = Math.floor((SKILL_H - 48) / 2);
  skillBar.layout = skillLayout;
  var skillBg = new eui.Rect();
  skillBg.percentWidth = 100; skillBg.percentHeight = 100; skillBg.fillColor = THEME.bgMid;
  skillBar.addChildAt(skillBg, 0);
  var skillTopLine = new eui.Rect();
  skillTopLine.percentWidth = 100; skillTopLine.height = 1;
  skillTopLine.top = 0; skillTopLine.fillColor = THEME.strokeGold; skillTopLine.fillAlpha = 0.5;
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
  navBar.layout = new eui.HorizontalLayout();
  navBar.layout.horizontalAlign = 'justify';
  navBar.layout.verticalAlign = 'middle';
  navBar.paddingLeft = 8; navBar.paddingRight = 8;
  var navBg = new eui.Rect();
  navBg.percentWidth = 100; navBg.percentHeight = 100; navBg.fillColor = THEME.bgDeep;
  navBar.addChildAt(navBg, 0);
  var navTopLine = new eui.Rect();
  navTopLine.percentWidth = 100; navTopLine.height = 1;
  navTopLine.top = 0; navTopLine.fillColor = THEME.strokeGold; navTopLine.fillAlpha = 0.4;
  navBar.addChild(navTopLine);

  var navItems = [
    { text: '升级', icon: '⬆️', fn: function() { self.openUpgrade(); } },
    { text: '图签', icon: '📖', fn: function() { self.openMonsterCodex(); } },
    { text: '转盘', icon: '🎰', fn: function() { self.openSpinWheel(); } },
    { text: '超市', icon: '🛒', fn: function() { self.openSupermarket(); } },
    { text: '排行', icon: '🏆', fn: function() { self.openLeaderboard(); } },
    { text: '商城', icon: '💎', fn: function() { self.openShop(); } }
  ];
  for (var i = 0; i < navItems.length; i++) {
    var nb = this.createNavBtn(navItems[i].text, navItems[i].icon, navItems[i].fn);
    navBar.addChild(nb);
  }
  this.main.addChild(navBar);
};

// 创建战斗区左/右侧圆角按钮（小方块+文字）
Game.prototype.createSideBtn = function(text, x, y, fn) {
  var g = new eui.Group();
  g.width = 26; g.height = 26; g.x = x; g.y = y;
  var bg = new eui.Rect();
  bg.width = 26; bg.height = 26; bg.ellipseWidth = 8; bg.ellipseHeight = 8;
  bg.fillColor = THEME.bgLite; bg.fillAlpha = 0.85;
  bg.strokeColor = THEME.strokeGold; bg.strokeWeight = 1; bg.strokeAlpha = 0.7;
  g.addChild(bg);
  var lb = new eui.Label();
  lb.text = text; lb.size = 10; lb.textColor = THEME.accentSoft; lb.bold = true;
  lb.horizontalCenter = 0; lb.verticalCenter = 0;
  g.addChild(lb);
  g.touchEnabled = true;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, this);
  return g;
};

// 创建导航按钮（图标+文字）
Game.prototype.createNavBtn = function(text, icon, fn) {
  var g = new eui.Group();
  g.width = 52; g.height = 40;
  g.layout = new eui.VerticalLayout();
  g.layout.horizontalAlign = 'center';
  g.layout.verticalAlign = 'middle';
  g.layout.gap = 1;
  g.touchEnabled = true;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, this);
  var iconLb = new eui.Label();
  iconLb.text = icon; iconLb.size = 18;
  iconLb.horizontalCenter = 0;
  g.addChild(iconLb);
  var textLb = new eui.Label();
  textLb.text = text; textLb.size = 9; textLb.textColor = THEME.accent; textLb.bold = true;
  textLb.horizontalCenter = 0;
  g.addChild(textLb);
  return g;
};

Game.prototype.createSkillBtn = function(idx) {
  var s = SKILLS[idx];
  var unlocked = this.mainLevel >= s.lv;
  var g = new eui.Group();
  g.width = 42; g.height = 48;
  // 辉光层
  var halo = new eui.Rect();
  halo.width = 42; halo.height = 42;
  halo.ellipseWidth = 21; halo.ellipseHeight = 21;
  halo.fillColor = unlocked ? s.color : 0x3a355a;
  halo.fillAlpha = 0.35;
  halo.name = 'halo';
  g.addChild(halo);
  // 实心圆
  var bg = new eui.Rect();
  bg.width = 34; bg.height = 34; bg.ellipseWidth = 17; bg.ellipseHeight = 17;
  bg.fillColor = unlocked ? s.color : 0x4a4566;
  bg.x = 4; bg.y = 4;
  bg.name = 'bg'; g.addChild(bg);
  // 描边
  var border = new eui.Rect();
  border.width = 34; border.height = 34; border.ellipseWidth = 17; border.ellipseHeight = 17;
  border.fillAlpha = 0;
  border.strokeColor = unlocked ? THEME.accentSoft : 0x6a628f;
  border.strokeWeight = 1.5;
  border.x = 4; border.y = 4;
  border.name = 'border'; g.addChild(border);
  // 矢量图标
  var iconShape = new egret.Shape();
  this.drawSkillIcon(iconShape.graphics, s.icon, unlocked);
  iconShape.x = 21; iconShape.y = 21;
  iconShape.name = 'iconShape';
  g.addChild(iconShape);
  // CD 文字
  var cdLb = new eui.Label();
  cdLb.text = ''; cdLb.size = 11; cdLb.textColor = THEME.textMain; cdLb.bold = true;
  cdLb.horizontalCenter = 0; cdLb.top = 13;
  cdLb.name = 'cdLb';
  cdLb.visible = false;
  g.addChild(cdLb);
  // 技能名 / 解锁提示（固定在底部，不错位）
  var lb = new eui.Label();
  lb.text = unlocked ? s.name : 'Lv' + s.lv;
  lb.size = 9; lb.textColor = unlocked ? THEME.textMain : THEME.textMute;
  lb.bold = true;
  lb.width = 42; lb.height = 12;
  lb.textAlign = 'center';
  lb.x = 0; lb.y = 36;
  lb.name = 'lb';
  g.addChild(lb);

  g.touchEnabled = true;
  var self = this;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.useSkill(idx); }, this);
  return g;
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
  for (var i = 0; i < FOODS.length; i++) {
    var count = this.foods[FOODS[i].name] || 0;
    if (count > 0) parts.push(FOODS[i].icon + count);
  }
  return parts.join(' ');
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
  if (this.monsters.length > 0 && this.energy >= 1) {
    this.sfxClick();
    this.energy--;
    this.stats.totalClicks++;
    this.checkDailyTasks('click');
    var target = this.monsters[0];
    var tIdx = 0;
    for (var i = 1; i < this.monsters.length; i++) {
      if (this.monsters[i].hp > target.hp) { target = this.monsters[i]; tIdx = i; }
    }
    this.heroAttackAnim(tIdx);
    this.doDamage(target, CONFIG.mainDmg(this.mainLevel, this.rebirthGems), tIdx);
  }
};

Game.prototype.onMonsterTouch = function(idx) {
  this._justHitMonster = true;
  var m = this.monsters[idx];
  if (!m || m.hp <= 0 || this.energy < 1) return;
  this.sfxClick();
  this.energy--;
  this.stats.totalClicks++;
  this.checkDailyTasks('click');
  this.heroAttackAnim(idx);
  this.doDamage(m, CONFIG.mainDmg(this.mainLevel, this.rebirthGems), idx);
};

// ==================== 战斗逻辑 ====================

Game.prototype.doDamage = function(m, dmg, idx, isCrit) {
  if (isCrit === undefined) isCrit = false;
  var buffs = this.getBuffs();
  dmg = Math.floor(dmg * buffs.attackMult);
  if (!isCrit && Math.random() < buffs.critChance) { dmg *= 2; isCrit = true; }
  m.hp -= dmg;
  this.showDamageText(dmg, isCrit, idx);
  // 怪物受击闪烁效果
  if (this.monsterViews[idx]) {
    var mv = this.monsterViews[idx];
    egret.Tween.get(mv).to({ alpha: 0.3 }, 50).to({ alpha: 1 }, 80);
    // 轻微震动
    var origX = mv.x;
    egret.Tween.get(mv, { override: false })
      .to({ x: origX + 3 }, 30)
      .to({ x: origX - 3 }, 30)
      .to({ x: origX }, 30);
  }
  if (m.hp <= 0) this.onKill(m, idx);
  this.updateUI();
};

Game.prototype.showDamageText = function(dmg, isCrit, idx) {
  var txt = new egret.TextField();
  txt.text = '-' + this.fmt(dmg) + (isCrit ? '!' : '');
  txt.size = isCrit ? 26 : 20;
  txt.textColor = isCrit ? THEME.accent : THEME.pink;
  txt.bold = true;
  var w = this.monsters.length || 1;
  var cx = this._centerX || 100;
  var cw = this._centerW || 175;
  var slotW = cw / w;
  var xPct = (idx >= 0 ? idx : 0);
  txt.x = cx + slotW * xPct + slotW / 2 - 15 + (Math.random() * 16 - 8);
  txt.y = this._monsterAreaY + Math.random() * 20;
  this.damageLayer.addChild(txt);
  egret.Tween.get(txt).to({ y: txt.y - 50, alpha: 0 }, 700).call(function() {
    if (txt.parent) txt.parent.removeChild(txt);
  });
};

Game.prototype.onKill = function(m, idx) {
  if (m.hp > 0) return;
  var realIdx = this.monsters.indexOf(m);
  if (realIdx === -1) return;
  var reward = CONFIG.goldReward(this.wave, m.isBoss);
  this.gold += reward;
  this.energy = Math.min(CONFIG.maxEnergy, this.energy + (m.isBoss ? 10 : 2));
  this.killCount++;
  this.stats.totalKills++;
  if (m.isBoss) {
    this.stats.bossKills++;
    this.sfxHitBoss();
  }
  if (this.gold > this.stats.totalGold) this.stats.totalGold = this.gold;

  // 图签系统：记录击杀
  if (m.type && m.type.shape) {
    if (!this.monsterCodex[m.type.shape]) {
      this.monsterCodex[m.type.shape] = { encountered: true, kills: 0 };
      this.showToast('📖 新图签！发现【' + m.type.name + '】');
    }
    this.monsterCodex[m.type.shape].kills++;
  }

  this.checkDailyTasks('kill');
  this.checkAchievements();
  this.monsters.splice(realIdx, 1);
  if (this.monsters.length === 0) this.nextWave();
  this.checkLevelUp();
};

// ==================== 波次 ====================

Game.prototype.spawnWave = function() {
  var isBoss = this.wave % 10 === 0;
  var count;
  if (isBoss) {
    count = 1;
  } else if (this.wave <= 5) {
    count = 2;
  } else if (this.wave <= 15) {
    count = 3;
  } else {
    count = 4;
  }
  var hp = CONFIG.monsterHp(this.wave);
  this.monsters = [];
  // BOSS用专属类型，小怪随机
  var bossType = MONSTER_TYPES[6]; // 火龙作为BOSS
  for (var i = 0; i < count; i++) {
    var mType = isBoss ? bossType : MONSTER_TYPES[Math.floor(Math.random() * (MONSTER_TYPES.length - 1))];
    this.monsters.push({
      hp: isBoss ? hp * 5 : hp,
      maxHp: isBoss ? hp * 5 : hp,
      isBoss: isBoss,
      type: mType
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
    this.startBossTimer();
    this.showBossFlash(); // 全屏红色闪烁动效
    this.showToast('💀 BOSS出现！限时' + CONFIG.bossTimeLimit + '秒！');
  } else {
    this.bossActive = false;
  }
};

Game.prototype.startBossTimer = function() {
  var self = this;
  this._bossTimerInterval = setInterval(function() {
    self.bossTimer -= 0.1;
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
  this.updateBossTimerUI();
};

Game.prototype.onBossFail = function() {
  this.stopBossTimer();
  this.showToast('💀 BOSS挑战失败！从第1波重新开始');
  // 失败后波次重置到当前轮次的第1波
  var cycleStart = Math.floor((this.wave - 1) / 10) * 10 + 1;
  this.wave = cycleStart;
  var self = this;
  setTimeout(function() { self.spawnWave(); self.updateUI(); }, 1000);
};

// ==================== 挑战BOSS按钮逻辑 ====================

Game.prototype.challengeBoss = function() {
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  if (this.wave % 10 === 0) {
    this.showToast('当前已是BOSS波！');
    return;
  }
  if (waveInCycle < 9) {
    // 条件不满足时提示（按钮本身已灰色）
    this.showToast('⚠️ 需通过第9波后才能挑战BOSS (' + waveInCycle + '/9)');
    return;
  }
  // 满足条件：跳到BOSS波
  this.skipToBoss();
};

// 直接跳到BOSS波
Game.prototype.skipToBoss = function() {
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
  var canChallenge = (waveInCycle >= 9 && !isBossWave); // 第9波及以上可挑战

  if (isBossWave) {
    this._bossBtnBg.fillColor = 0xe74c3c;
    this._bossBtnText.text = '💀战斗中';
    this._bossBtnText.textColor = 0xffffff;
    if (this._bossBtnGroup) this._bossBtnGroup.alpha = 1;
  } else if (canChallenge) {
    this._bossBtnBg.fillColor = 0x9b2335;
    this._bossBtnText.text = '挑战BOSS';
    this._bossBtnText.textColor = 0xffffff;
    if (this._bossBtnGroup) this._bossBtnGroup.alpha = 1;
  } else {
    this._bossBtnBg.fillColor = 0x444444;
    this._bossBtnText.text = '挑战BOSS';
    this._bossBtnText.textColor = 0x888888;
    if (this._bossBtnGroup) this._bossBtnGroup.alpha = 0.6;
  }
};

Game.prototype.updateBossTimerUI = function() {
  if (!this.bossTimerBar) return;
  if (this.bossActive && this.bossTimer > 0) {
    this.bossTimerBar.visible = true;
    if (this.bossTimerLabel) {
      this.bossTimerLabel.visible = true;
      this.bossTimerLabel.text = this.bossTimer.toFixed(1) + 's';
    }
    var pct = this.bossTimer / CONFIG.bossTimeLimit;
    var bMax = this._bossBarMaxWidth || 280;
    this.bossTimerBar.width = Math.max(0, bMax * pct);
    if (pct > 0.5) {
      this.bossTimerBar.fillColor = 0x2ecc71;
      if (this.bossTimerLabel) this.bossTimerLabel.textColor = 0x2ecc71;
    } else if (pct > 0.25) {
      this.bossTimerBar.fillColor = 0xf39c12;
      if (this.bossTimerLabel) this.bossTimerLabel.textColor = 0xf39c12;
    } else {
      this.bossTimerBar.fillColor = 0xe74c3c;
      if (this.bossTimerLabel) this.bossTimerLabel.textColor = 0xe74c3c;
    }
  } else {
    this.bossTimerBar.visible = false;
    if (this.bossTimerLabel) this.bossTimerLabel.visible = false;
  }
};

Game.prototype.nextWave = function() {
  // BOSS击杀成功，停止计时器
  this.stopBossTimer();
  this.wave++;
  this.totalCleared++;
  if (this.wave > this.maxWaveReached) this.maxWaveReached = this.wave;
  this.checkDailyTasks('wave');
  this.checkSupports();
  this.updateBossBtn();
  var self = this;
  setTimeout(function() { self.spawnWave(); }, 300);
};

// ==================== 升级 ====================

Game.prototype.checkLevelUp = function() {
  if (this.killCount >= CONFIG.killsNeeded(this.mainLevel)) {
    this.killCount = 0;
    this.mainLevel++;
    this.sfxLevelUp();
    this.showToast('⬆️ 主角升级！Lv.' + this.mainLevel + ' 伤害: ' + this.fmt(CONFIG.mainDmg(this.mainLevel, this.rebirthGems)));
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
  for (var i = 0; i < this.supports.length; i++) {
    var s = this.supports[i];
    if (!s.unlocked && this.totalCleared >= s.wave) {
      s.unlocked = true;
      this.showToast('🌟【' + s.name + '】加入队伍！');
    }
  }
  this.checkAchievements();
};

Game.prototype.upgradeMain = function() {
  var cost = CONFIG.upgradeCost(this.mainLevel);
  if (this.gold < cost) { this.showToast('金币不足！'); return; }
  this.gold -= cost;
  this.mainLevel++;
  this.sfxLevelUp();
  this.showToast('⬆️ 主角升级！Lv.' + this.mainLevel + ' 伤害: ' + this.fmt(CONFIG.mainDmg(this.mainLevel, this.rebirthGems)));
  this.checkLevelUpSkills();
  this.checkAchievements();
  this.saveGame();
  this.updateUI();
  // 刷新升级面板，显示最新数据
  this.closePanel();
  this.openUpgrade();
};

Game.prototype.upgradeSupport = function(idx) {
  var s = this.supports[idx];
  var cost = CONFIG.supportCost(s.level);
  if (this.gold < cost) { this.showToast('金币不足！'); return; }
  this.gold -= cost;
  s.level++;
  this.showToast('⬆️ ' + s.name + '升级！Lv.' + s.level + ' DPS: ' + this.fmt(s.dps * s.level));
  this.saveGame();
  this.updateUI();
  // 刷新升级面板
  this.closePanel();
  this.openUpgrade();
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
  if (this.energy < 5) { this.showToast('能量不足！'); return; }
  var s = SKILLS[idx];
  this.sfxSkill();
  this.energy -= 5;
  this.skillCD[idx] = s.cd;
  var dmg = CONFIG.mainDmg(this.mainLevel, this.rebirthGems) * s.dmg;
  if (s.hits === 0) {
    // 全体技能，主角向中间冲刺
    this.heroAttackAnim(0);
    var self = this;
    this.monsters.slice().forEach(function(m, i) { self.doDamage(m, dmg, i, true); });
  } else {
    for (var i = 0; i < s.hits; i++) {
      if (this.monsters.length === 0) break;
      var mi = Math.floor(Math.random() * this.monsters.length);
      this.heroAttackAnim(mi);
      var m = this.monsters[mi];
      if (m) this.doDamage(m, dmg, mi, true);
    }
  }
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
  if (this.goldLabel) this.goldLabel.text = '💰 ' + this.fmt(this.gold);
  if (this.waveLabel) this.waveLabel.text = this.waveText();
  this.updateWaveNumbers();
  if (this.levelLabel) this.levelLabel.text = 'Lv.' + this.mainLevel;
  if (this.dpsLabel) this.dpsLabel.text = 'DPS: ' + this.fmt(this.totalDps());
  if (this.energyLabel) this.energyLabel.text = '⚡' + this.energy + '/' + CONFIG.maxEnergy;
  if (this.energyFill) {
    var eMax = this._energyMaxWidth || 100;
    this.energyFill.width = Math.max(0, (this.energy / CONFIG.maxEnergy) * eMax);
  }
  if (this.waveFill && this.waveFillBg) {
    var waveInCycle = ((this.wave - 1) % 10) + 1;
    var wMax = this._waveFillMaxWidth || this.waveFillBg.width;
    this.waveFill.width = (waveInCycle / 10) * wMax;
  }
  if (this.buffLabel) this.buffLabel.text = this.renderBuffText();
  if (this.gemsLabel) this.gemsLabel.text = '💎 ' + this.rebirthGems;
  // 更新HP条
  if (this.hpFill && this.hpLabel && this.monsters.length > 0) {
    var totalHp = 0;
    var maxHp = 0;
    for (var i = 0; i < this.monsters.length; i++) {
      totalHp += Math.max(0, this.monsters[i].hp);
      maxHp += this.monsters[i].maxHp;
    }
    if (maxHp > 0) {
      var hpPct = totalHp / maxHp;
      var hpMax = this._hpMaxWidth || 140;
      this.hpFill.width = Math.floor(hpMax * hpPct);
      this.hpLabel.text = this.fmt(totalHp) + ' / ' + this.fmt(maxHp);
    }
  }
  this.updateMonsterDisplay();
  this.updateSkillBtns();
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
};

Game.prototype.createMonsterView = function(m, idx, total) {
  var g = new eui.Group();
  // 根据怪物数量动态调整尺寸，避免堆叠
  var maxSz = m.isBoss ? 72 : 52;
  var minSz = m.isBoss ? 52 : 36;
  var sz = Math.max(minSz, Math.floor(maxSz / Math.max(1, total * 0.6)));
  sz = Math.min(maxSz, sz);
  // 每个怪物槽宽度 = 中央区宽度 / 怪物数量
  var cx = this._centerX || 100;
  var cw = this._centerW || 175;
  var slotW = Math.floor(cw / total);
  var slotX = cx + slotW * idx + Math.floor((slotW - sz) / 2);
  // 图签 + 血条 + HP文本合计约 40px
  g.width = sz; g.height = sz + 40;
  g.x = slotX;
  g.y = this._monsterAreaY + Math.floor((this._monsterAreaH - sz - 40) / 2);
  g.touchEnabled = true;
  var self = this;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.onMonsterTouch(idx); }, this);

  var mType = m.type || MONSTER_TYPES[0];
  var body = new egret.Shape();
  this.drawMonsterShape(body.graphics, mType, sz, m.isBoss);
  g.addChild(body);

  // --- 名字图签（胶囊徽章）---
  var labelText = m.isBoss ? '💀 ' + mType.name : mType.name;
  var badgeW = Math.min(sz, m.isBoss ? 64 : 48);
  var badgeH = m.isBoss ? 16 : 14;
  var badge = new eui.Rect();
  badge.width = badgeW; badge.height = badgeH;
  badge.ellipseWidth = badgeH; badge.ellipseHeight = badgeH;
  badge.fillColor = m.isBoss ? 0x5a0a08 : mType.badge;
  badge.fillAlpha = 0.92;
  badge.strokeColor = m.isBoss ? THEME.strokeGold : 0xffffff;
  badge.strokeWeight = m.isBoss ? 1.5 : 1;
  badge.strokeAlpha = m.isBoss ? 0.9 : 0.6;
  badge.horizontalCenter = 0; badge.top = sz + 1;
  g.addChild(badge);
  var name = new eui.Label();
  name.text = labelText;
  name.size = m.isBoss ? 10 : 9;
  name.textColor = 0xffffff;
  name.bold = true;
  name.width = badgeW; name.height = badgeH;
  name.textAlign = 'center';
  name.x = (sz - badgeW) / 2; name.y = sz + 1;
  g.addChild(name);

  // --- 血条 ---
  var hpY = sz + 1 + badgeH + 2;
  var hpH = m.isBoss ? 6 : 4;
  var hpW = sz - 2;
  var hpBg = new eui.Rect();
  hpBg.width = hpW; hpBg.height = hpH;
  hpBg.fillColor = 0x1a1a1a;
  hpBg.ellipseWidth = hpH; hpBg.ellipseHeight = hpH;
  hpBg.x = 1; hpBg.y = hpY;
  g.addChild(hpBg);
  var pct = Math.max(0, m.hp / m.maxHp);
  var hpFill = new eui.Rect();
  hpFill.width = Math.max(0, hpW * pct); hpFill.height = hpH;
  hpFill.fillColor = m.isBoss ? 0xe74c3c
    : (pct > 0.5 ? mType.hpColor : (pct > 0.2 ? 0xf39c12 : 0xe74c3c));
  hpFill.ellipseWidth = hpH; hpFill.ellipseHeight = hpH;
  hpFill.x = 1; hpFill.y = hpY;
  g.addChild(hpFill);

  // --- 血量文字 ---
  var hpText = new eui.Label();
  hpText.text = Math.max(0, Math.floor(m.hp)) + '/' + m.maxHp;
  hpText.size = 8; hpText.textColor = 0xcccccc;
  hpText.width = sz; hpText.height = 10;
  hpText.textAlign = 'center';
  hpText.x = 0; hpText.y = hpY + hpH + 1;
  g.addChild(hpText);

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
      this._drawEyes(g, half - 7, half - 4, half + 7, half - 4, 3, 1.5);
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
      this._drawEyes(g, half - 7, half - 2, half + 7, half - 2, 3, 1.5);
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
      this._drawEyes(g, half - 5, half - 2, half + 5, half - 2, 2.5, 1.2);
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
      // fallback：圆球 + 眼睛
      g.lineStyle(2, ol);
      g.beginFill(c);
      g.drawCircle(half, half, half - 2);
      g.endFill();
      this._drawEyes(g, half - 6, half - 4, half + 6, half - 4, 3, 1.5);
  }
};

/**
 * 统一绘制一对眼睛（白底 + 黑瞳 + 高光）。所有怪物都用同一风格。
 * x1/y1/x2/y2 为左右眼中心点，r 为眼白半径，pr 为瞳孔半径。
 */
Game.prototype._drawEyes = function(g, x1, y1, x2, y2, r, pr) {
  g.lineStyle(0);
  // 眼白
  g.beginFill(0xffffff);
  g.drawCircle(x1, y1, r);
  g.drawCircle(x2, y2, r);
  g.endFill();
  // 瞳孔（稍微偏下让表情更可爱）
  g.beginFill(0x000000);
  g.drawCircle(x1, y1 + 0.5, pr);
  g.drawCircle(x2, y2 + 0.5, pr);
  g.endFill();
  // 高光（左上角）
  g.beginFill(0xffffff);
  g.drawCircle(x1 - pr * 0.5, y1 - pr * 0.5, pr * 0.5);
  g.drawCircle(x2 - pr * 0.5, y2 - pr * 0.5, pr * 0.5);
  g.endFill();
};

Game.prototype.updateSkillBtns = function() {
  for (var i = 0; i < this.skillBtns.length; i++) {
    var btn = this.skillBtns[i];
    if (!btn) continue;
    var s = SKILLS[i];
    var unlocked = this.mainLevel >= s.lv;
    var cd = this.skillCD[i] > 0;
    var bg = btn.getChildByName('bg');
    var halo = btn.getChildByName('halo');
    var border = btn.getChildByName('border');
    var lb = btn.getChildByName('lb');
    var cdLb = btn.getChildByName('cdLb');
    var icon = btn.getChildByName('iconShape');
    if (bg) bg.fillColor = cd ? 0x2a2440 : (unlocked ? s.color : 0x4a4566);
    if (halo) {
      halo.fillColor = unlocked ? s.color : 0x3a355a;
      halo.fillAlpha = cd ? 0.12 : 0.35;
    }
    if (border) border.strokeColor = cd ? 0x6a628f : (unlocked ? THEME.accentSoft : 0x6a628f);
    if (lb) {
      lb.text = unlocked ? s.name : 'Lv' + s.lv;
      lb.textColor = cd ? THEME.textMute : (unlocked ? THEME.textMain : THEME.textMute);
    }
    if (cdLb) {
      if (cd) { cdLb.text = Math.ceil(this.skillCD[i]) + ''; cdLb.visible = true; }
      else { cdLb.visible = false; }
    }
    if (icon) icon.visible = !cd;
  }
};

// ==================== 面板系统 ====================

Game.prototype.createPanelOverlay = function() {
  if (this._panelOverlay && this._panelOverlay.parent) {
    this._panelOverlay.parent.removeChild(this._panelOverlay);
  }
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
  dim.fillColor = 0x000000; dim.fillAlpha = 0.5;
  overlay.addChild(dim);
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
  if (this._panelOverlay && this._panelOverlay.parent) {
    this._panelOverlay.parent.removeChild(this._panelOverlay);
  }
  this._panelOverlay = null;
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
};

Game.prototype.addPanelContent = function(overlay) {
  var panel = new eui.Group();
  panel.width = 340; panel.height = 400;
  panel.horizontalCenter = 0; panel.verticalCenter = 0;
  // 深紫底 + 金边
  var panelBg = new eui.Rect();
  panelBg.percentWidth = 100; panelBg.percentHeight = 100;
  panelBg.fillColor = THEME.bgLite; panelBg.ellipseWidth = 14; panelBg.ellipseHeight = 14;
  panelBg.strokeColor = THEME.strokeGold; panelBg.strokeWeight = 1.5; panelBg.strokeAlpha = 0.85;
  panel.addChild(panelBg);
  // 顶部金色光条
  var topGlow = new eui.Rect();
  topGlow.percentWidth = 100; topGlow.height = 3;
  topGlow.top = 0; topGlow.fillColor = THEME.accent; topGlow.fillAlpha = 0.55;
  panel.addChild(topGlow);
  overlay.addChild(panel);

  // 关闭按钮（圆底）
  var closeBtnBg = new eui.Rect();
  closeBtnBg.width = 24; closeBtnBg.height = 24;
  closeBtnBg.ellipseWidth = 12; closeBtnBg.ellipseHeight = 12;
  closeBtnBg.fillColor = THEME.bgDeep;
  closeBtnBg.strokeColor = THEME.strokeGold; closeBtnBg.strokeWeight = 1; closeBtnBg.strokeAlpha = 0.6;
  closeBtnBg.right = 10; closeBtnBg.top = 8;
  closeBtnBg.touchEnabled = true;
  panel.addChild(closeBtnBg);
  var closeBtn = new eui.Label();
  closeBtn.text = '×'; closeBtn.size = 18; closeBtn.textColor = THEME.accentSoft; closeBtn.bold = true;
  closeBtn.right = 18; closeBtn.top = 7; closeBtn.touchEnabled = true;
  var self = this;
  closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.closePanel(); }, this);
  closeBtnBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.closePanel(); }, this);
  panel.addChild(closeBtn);

  return panel;
};

Game.prototype.addPanelRow = function(panel, y, iconText, iconColor, infoText, btnText, btnColor, handler, disabled) {
  var lines = infoText.split('\n');
  var rowH = lines.length > 1 ? 56 : 44;
  var rowBg = new eui.Rect();
  rowBg.width = 310; rowBg.height = rowH; rowBg.fillColor = THEME.bgRow;
  rowBg.ellipseWidth = 10; rowBg.ellipseHeight = 10;
  rowBg.strokeColor = THEME.strokeSoft; rowBg.strokeWeight = 1; rowBg.strokeAlpha = 0.5;
  rowBg.x = 15; rowBg.y = y;
  panel.addChild(rowBg);

  var iconBg = new eui.Rect();
  iconBg.width = 36; iconBg.height = 36; iconBg.ellipseWidth = 18; iconBg.ellipseHeight = 18;
  iconBg.fillColor = iconColor;
  iconBg.strokeColor = THEME.accentSoft; iconBg.strokeWeight = 1; iconBg.strokeAlpha = 0.7;
  iconBg.x = 22; iconBg.y = y + (rowH - 36) / 2;
  panel.addChild(iconBg);

  var iconLb = new eui.Label();
  iconLb.text = iconText; iconLb.size = 11; iconLb.textColor = THEME.textMain; iconLb.bold = true;
  iconLb.width = 36; iconLb.height = 36;
  iconLb.x = iconBg.x; iconLb.y = iconBg.y;
  iconLb.textAlign = 'center'; iconLb.verticalAlign = 'middle';
  panel.addChild(iconLb);

  var infoLb = new eui.Label();
  infoLb.text = infoText; infoLb.size = 11; infoLb.textColor = THEME.textMain;
  infoLb.x = 68; infoLb.y = y + 5; infoLb.width = 170; infoLb.lineSpacing = 3;
  panel.addChild(infoLb);

  if (btnText) {
    var btn = this.createButton(btnText, btnColor || THEME.accent, 68, 28, handler, this);
    btn.x = 245; btn.y = y + (rowH - 28) / 2;
    if (disabled) btn.alpha = 0.4;
    panel.addChild(btn);
  }

  return y + rowH + 6;
};

// ==================== 升级面板 ====================

Game.prototype.openUpgrade = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);

  var title = new eui.Label();
  title.text = '⬆️ 升级'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var self = this;
  var y = 50;

  // 主角（显示当前 + 下一级预览）
  var mainCost = CONFIG.upgradeCost(this.mainLevel);
  var mainNextDmg = CONFIG.mainDmg(this.mainLevel + 1, this.rebirthGems);
  y = this.addPanelRow(panel, y, '主角', 0x3498db,
    '主角 Lv.' + this.mainLevel + '  伤害: ' + this.fmt(CONFIG.mainDmg(this.mainLevel, this.rebirthGems)) +
    '\n→ Lv.' + (this.mainLevel + 1) + ' 伤害: ' + this.fmt(mainNextDmg) + '  (+' + this.fmt(mainNextDmg - CONFIG.mainDmg(this.mainLevel, this.rebirthGems)) + ')',
    this.fmt(mainCost) + '金',
    0x27ae60,
    function() { self.upgradeMain(); },
    this.gold < mainCost
  );

  // 进度条
  var progBg = new eui.Rect();
  progBg.width = 300; progBg.height = 8; progBg.fillColor = 0x140e36;
  progBg.x = 20; progBg.y = y;
  panel.addChild(progBg);
  var progFill = new eui.Rect();
  progFill.width = 300 * (this.killCount / CONFIG.killsNeeded(this.mainLevel));
  progFill.height = 8; progFill.fillColor = 0xd4a017;
  progFill.x = 20; progFill.y = y;
  panel.addChild(progFill);
  y += 14;
  var progText = new eui.Label();
  progText.text = '击杀进度: ' + this.killCount + '/' + CONFIG.killsNeeded(this.mainLevel);
  progText.size = 11; progText.textColor = 0x888888; progText.x = 20; progText.y = y;
  panel.addChild(progText);
  y += 24;

  // 已解锁辅助角色（显示当前 + 下一级预览）
  for (var i = 0; i < this.supports.length; i++) {
    var s = this.supports[i];
    if (!s.unlocked) continue;
    if (y > 350) { panel.height = y + 20; break; }
    var cost = CONFIG.supportCost(s.level);
    var nextDps = s.dps * (s.level + 1);
    var curDps = s.dps * s.level;
    (function(si, sup, c, n, cur) {
      y = self.addPanelRow(panel, y, sup.name.slice(0,2), 0x9b59b6,
        sup.name + ' Lv.' + sup.level + '  DPS: ' + self.fmt(cur) +
        '\n→ Lv.' + (sup.level + 1) + ' DPS: ' + self.fmt(n) + '  (+' + self.fmt(n - cur) + ')',
        self.fmt(c) + '金', 0x27ae60,
        function() { self.upgradeSupport(si); },
        self.gold < c
      );
    })(i, s, cost, nextDps, curDps);
  }
  panel.height = y + 16;
};

// ==================== 超市面板 ====================

Game.prototype.openSupermarket = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);

  var title = new eui.Label();
  title.text = '🛒 超市'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var buffs = this.getBuffs();
  var buffText = new eui.Label();
  buffText.text = '当前buff: 暴击' + Math.floor(buffs.critChance*100) + '% | 攻击×' + buffs.attackMult.toFixed(2);
  buffText.size = 11; buffText.textColor = 0x888888; buffText.x = 15; buffText.y = 42;
  panel.addChild(buffText);

  var self = this;
  var y = 64;
  for (var i = 0; i < FOODS.length; i++) {
    var f = FOODS[i];
    var count = this.foods[f.name] || 0;
    (function(fi, food, c) {
      y = self.addPanelRow(panel, y, food.icon, 0xe67e22,
        food.name + ' ×' + c + '\n' + food.desc,
        food.price + '金', 0x27ae60,
        function() { self.buyFood(fi); },
        self.gold < food.price
      );
    })(i, f, count);
  }
  panel.height = y + 16;
};

Game.prototype.buyFood = function(idx) {
  var f = FOODS[idx];
  if (this.gold < f.price) { this.showToast('金币不足！'); return; }
  this.gold -= f.price;
  this.foods[f.name] = (this.foods[f.name] || 0) + 1;
  this.showToast(f.icon + ' 购买' + f.name + '成功！');
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openSupermarket();
};

// ==================== 转盘面板 ====================

Game.prototype.openSpinWheel = function() {
  var today = new Date().toDateString();
  if (this.spinDate !== today) { this.freeSpins = 3; this.spinDate = today; }

  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  panel.height = 480;

  var title = new eui.Label();
  title.text = '🎡 转盘'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var info = new eui.Label();
  info.text = '今日免费: ' + this.freeSpins + '/3 次'; info.size = 12; info.textColor = 0xaaaaaa;
  info.horizontalCenter = 0; info.top = 40;
  panel.addChild(info);

  // 转盘外圈
  var wheelSize = 180;
  var colors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xe67e22, 0x34495e];
  var wheel = new eui.Group();
  wheel.width = wheelSize; wheel.height = wheelSize;
  wheel.horizontalCenter = 0; wheel.top = 65;
  wheel.anchorOffsetX = wheelSize / 2; wheel.anchorOffsetY = wheelSize / 2;
  wheel.x = 170 + wheelSize / 2; wheel.y = 65 + wheelSize / 2;

  for (var i = 0; i < 8; i++) {
    var seg = new eui.Rect();
    seg.width = wheelSize; seg.height = wheelSize;
    seg.fillColor = colors[i]; seg.ellipseWidth = wheelSize; seg.ellipseHeight = wheelSize;
    wheel.addChild(seg);
    var segLabel = new eui.Label();
    segLabel.text = SPIN_PRIZES[i].text; segLabel.size = 10; segLabel.textColor = 0xffffff;
    var angle = (i * 45 + 22.5) * Math.PI / 180;
    var r = wheelSize * 0.32;
    segLabel.x = wheelSize / 2 + r * Math.cos(angle) - 20;
    segLabel.y = wheelSize / 2 + r * Math.sin(angle) - 6;
    segLabel.width = 40; segLabel.textAlign = 'center';
    wheel.addChild(segLabel);
  }
  panel.addChild(wheel);

  // 中心圆
  var centerCircle = new eui.Rect();
  centerCircle.width = 36; centerCircle.height = 36;
  centerCircle.ellipseWidth = 18; centerCircle.ellipseHeight = 18;
  centerCircle.fillColor = 0xffffff;
  centerCircle.horizontalCenter = 0; centerCircle.top = 65 + wheelSize / 2 - 18;
  panel.addChild(centerCircle);

  // 指针
  var pointer = new eui.Label();
  pointer.text = '▼'; pointer.size = 24; pointer.textColor = 0xffffff;
  pointer.horizontalCenter = 0; pointer.top = 55;
  panel.addChild(pointer);

  // 结果文字
  var resultLabel = new eui.Label();
  resultLabel.text = ''; resultLabel.size = 16; resultLabel.textColor = 0xffd700;
  resultLabel.horizontalCenter = 0; resultLabel.top = 65 + wheelSize + 15;
  panel.addChild(resultLabel);

  // 抽奖按钮
  var self = this;
  var spinBtn = this.createButton(
    this.freeSpins > 0 ? '开始抽奖！' : '今日次数已用完',
    this.freeSpins > 0 ? 0xe74c3c : 0x555555,
    120, 36,
    function() { self.spin(wheel, resultLabel, spinBtn, info); },
    this
  );
  spinBtn.horizontalCenter = 0; spinBtn.top = 65 + wheelSize + 45;
  if (this.freeSpins <= 0) spinBtn.alpha = 0.4;
  panel.addChild(spinBtn);
};

Game.prototype.spin = function(wheel, resultLabel, spinBtn, infoLabel) {
  if (this.freeSpins <= 0) return;
  this.freeSpins--;
  spinBtn.alpha = 0.4;
  spinBtn.touchEnabled = false;

  // 加权随机
  var totalWeight = 0;
  for (var i = 0; i < SPIN_PRIZES.length; i++) totalWeight += SPIN_PRIZES[i].weight;
  var r = Math.random() * totalWeight;
  var prize = SPIN_PRIZES[0];
  for (var i = 0; i < SPIN_PRIZES.length; i++) {
    r -= SPIN_PRIZES[i].weight;
    if (r <= 0) { prize = SPIN_PRIZES[i]; break; }
  }

  // 转盘旋转动画
  var targetRotation = 1440 + Math.random() * 360;
  var self = this;
  egret.Tween.get(wheel).to({ rotation: targetRotation }, 1500, egret.Ease.quadOut).call(function() {
    if (prize.type === 'gold') {
      self.gold += prize.value;
    } else if (prize.type === 'food') {
      self.foods[prize.value] = (self.foods[prize.value] || 0) + 1;
    } else if (prize.type === 'energy') {
      self.energy = Math.min(CONFIG.maxEnergy, self.energy + prize.value);
    }
    resultLabel.text = '🎉 获得: ' + prize.text;
    self.showToast('🎡 转盘奖励: ' + prize.text);
    self.saveGame();
    self.updateUI();
    if (infoLabel) infoLabel.text = '今日免费: ' + self.freeSpins + '/3 次';
    if (self.freeSpins > 0) {
      spinBtn.alpha = 1; spinBtn.touchEnabled = true;
      var btnLb = spinBtn.getChildAt(1);
      if (btnLb) btnLb.text = '再来一次 (' + self.freeSpins + ')';
    }
  });
};

// ==================== 排行榜 ====================

Game.prototype.openLeaderboard = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  panel.height = 390;

  var title = new eui.Label();
  title.text = '🏆 排行榜'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var s = this.stats;
  var playH = Math.floor(s.playTime / 3600);
  var playM = Math.floor((s.playTime % 3600) / 60);
  var rows = [
    ['💰 最高金币', this.fmt(s.totalGold)],
    ['🌊 最高波次', '第 ' + this.maxWaveReached + ' 波'],
    ['💎 转生宝石', this.rebirthGems + ' (×' + (1 + this.rebirthGems * 0.1).toFixed(1) + '伤害)'],
    ['⚔️ 总击杀数', this.fmt(s.totalKills)],
    ['👆 总点击数', this.fmt(s.totalClicks)],
    ['⏱️ 游戏时间', playH + 'h ' + playM + 'm'],
    ['💪 总DPS', this.fmt(this.totalDps())]
  ];

  for (var i = 0; i < rows.length; i++) {
    var rowBg = new eui.Rect();
    rowBg.width = 310; rowBg.height = 32; rowBg.fillColor = 0x1a153f;
    rowBg.x = 15; rowBg.y = 45 + i * 36;
    panel.addChild(rowBg);

    var label = new eui.Label();
    label.text = rows[i][0]; label.size = 13; label.textColor = 0xcccccc;
    label.x = 25; label.y = 45 + i * 36 + 8;
    panel.addChild(label);

    var val = new eui.Label();
    val.text = rows[i][1]; val.size = 13; val.textColor = 0xffd700; val.bold = true;
    val.x = 250; val.y = 45 + i * 36 + 8;
    panel.addChild(val);
  }

  var note = new eui.Label();
  note.text = '（排行榜数据为本地记录）'; note.size = 10; note.textColor = 0x555555;
  note.horizontalCenter = 0; note.bottom = 16;
  panel.addChild(note);
};

// ==================== 商城 ====================

Game.prototype.openShop = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);

  var title = new eui.Label();
  title.text = '🏪 商城'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var self = this;
  var y = 50;

  // 能量药水
  y = this.addPanelRow(panel, y, '⚡', 0x3498db,
    '能量药水\n恢复50能量',
    '50金', 0x27ae60,
    function() { self.shopBuy('energy'); },
    this.gold < 50
  );

  // 离线扩展包
  y = this.addPanelRow(panel, y, '💤', 0x9b59b6,
    '离线扩展包\n离线上限+4h (当前' + this.offlineCap + 'h)',
    '500金', 0x27ae60,
    function() { self.shopBuy('offline'); },
    this.gold < 500 || this.offlineCap >= 24
  );

  // 每日任务
  y = this.addPanelRow(panel, y, '📋', 0xe67e22,
    '每日任务\n查看每日任务进度',
    '查看', 0x3498db,
    function() { self.closePanel(); self.openDailyTasks(); },
    false
  );

  // 成就
  y = this.addPanelRow(panel, y, '🏆', 0xf39c12,
    '成就系统\n已完成: ' + this.achievements.length + '/' + ACHIEVEMENTS.length,
    '查看', 0x3498db,
    function() { self.closePanel(); self.openAchievements(); },
    false
  );

  panel.height = y + 16;
};

// ==================== 邮件系统 ====================

Game.prototype.openMail = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  panel.height = 300;

  var title = new eui.Label();
  title.text = '📧 邮件'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var mails = [
    { from: '系统', title: '欢迎来到打豆豆！', reward: '💰100金', claimed: false },
    { from: '系统', title: '新手礼包', reward: '⚡20能量', claimed: false },
    { from: 'GM', title: '感谢支持！', reward: '🍭×1', claimed: false }
  ];

  var self = this;
  var y = 50;
  for (var i = 0; i < mails.length; i++) {
    var m = mails[i];
    var rowBg = new eui.Rect();
    rowBg.width = 310; rowBg.height = 50; rowBg.fillColor = 0x1a153f;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.x = 15; rowBg.y = y;
    panel.addChild(rowBg);

    var fromLb = new eui.Label();
    fromLb.text = '[' + m.from + ']'; fromLb.size = 10; fromLb.textColor = 0xf39c12;
    fromLb.x = 25; fromLb.y = y + 6;
    panel.addChild(fromLb);

    var titleLb = new eui.Label();
    titleLb.text = m.title; titleLb.size = 12; titleLb.textColor = 0xffffff;
    titleLb.x = 25; titleLb.y = y + 22;
    panel.addChild(titleLb);

    var rewardLb = new eui.Label();
    rewardLb.text = m.reward; rewardLb.size = 11; rewardLb.textColor = 0xffd700;
    rewardLb.x = 180; rewardLb.y = y + 15;
    panel.addChild(rewardLb);

    (function(idx, mail) {
      var claimBtn = self.createButton('领取', 0x27ae60, 50, 24, function() {
        self.showToast('📧 已领取: ' + mail.reward);
      }, self);
      claimBtn.x = 255; claimBtn.y = y + 13;
      panel.addChild(claimBtn);
    })(i, m);

    y += 56;
  }
  panel.height = y + 16;
};

// ==================== 公告系统 ====================

Game.prototype.openAnnouncement = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  panel.height = 320;

  var title = new eui.Label();
  title.text = '📢 公告'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var anns = [
    { tag: '热', color: 0xe74c3c, text: 'v2.0版本上线！新增转生系统和成就系统！' },
    { tag: '新', color: 0x3498db, text: '新增8个辅助英雄，每个都有独特外形和武器！' },
    { tag: '活', color: 0x2ecc71, text: '每日签到领好礼，连续7天获得烤肉奖励！' },
    { tag: 'Tips', color: 0xf39c12, text: '升级辅助英雄可以大幅提升DPS，别忘了给他们升级！' }
  ];

  var y = 50;
  for (var i = 0; i < anns.length; i++) {
    var a = anns[i];
    var rowBg = new eui.Rect();
    rowBg.width = 310; rowBg.height = 50; rowBg.fillColor = 0x1a153f;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.x = 15; rowBg.y = y;
    panel.addChild(rowBg);

    var tagBg = new eui.Rect();
    tagBg.width = 28; tagBg.height = 16; tagBg.fillColor = a.color;
    tagBg.ellipseWidth = 4; tagBg.ellipseHeight = 4;
    tagBg.x = 22; tagBg.y = y + 6;
    panel.addChild(tagBg);

    var tagLb = new eui.Label();
    tagLb.text = a.tag; tagLb.size = 9; tagLb.textColor = 0xffffff; tagLb.bold = true;
    tagLb.x = 26; tagLb.y = y + 8;
    panel.addChild(tagLb);

    var textLb = new eui.Label();
    textLb.text = a.text; textLb.size = 11; textLb.textColor = 0xcccccc;
    textLb.x = 25; textLb.y = y + 26; textLb.width = 290;
    panel.addChild(textLb);

    y += 56;
  }
  panel.height = y + 16;
};

// ==================== 能量互助 ====================

Game.prototype.openEnergyHelp = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  panel.height = 260;

  var title = new eui.Label();
  title.text = '⚡ 能量互助'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var info = new eui.Label();
  info.text = '当前能量: ⚡' + this.energy + '/' + CONFIG.maxEnergy + '\n每秒恢复: +' + CONFIG.energyRecovery;
  info.size = 13; info.textColor = 0xcccccc;
  info.x = 25; info.top = 50; info.lineSpacing = 6;
  panel.addChild(info);

  var tip = new eui.Label();
  tip.text = '点击战斗区域消耗1能量\n使用技能消耗5能量\n能量会自动恢复，也可以在商城购买';
  tip.size = 11; tip.textColor = 0x888888;
  tip.x = 25; tip.top = 100; tip.lineSpacing = 4;
  panel.addChild(tip);

  var self = this;
  var buyBtn = this.createButton('购买能量药水 (+50⚡)', 0x3498db, 160, 36,
    function() {
      if (self.gold < 50) { self.showToast('金币不足！'); return; }
      self.gold -= 50;
      self.energy = Math.min(CONFIG.maxEnergy, self.energy + 50);
      self.showToast('⚡ +50能量！');
      self.saveGame();
      self.updateUI();
      self.closePanel();
    }, this
  );
  buyBtn.horizontalCenter = 0; buyBtn.y = 170;
  panel.addChild(buyBtn);
};

Game.prototype.shopBuy = function(type) {
  if (type === 'energy') {
    if (this.gold < 50) { this.showToast('金币不足！'); return; }
    this.gold -= 50;
    this.energy = Math.min(CONFIG.maxEnergy, this.energy + 50);
    this.showToast('⚡ 购买能量药水！+50能量');
  } else if (type === 'offline') {
    if (this.gold < 500) { this.showToast('金币不足！'); return; }
    this.gold -= 500;
    this.offlineCap = Math.min(24, this.offlineCap + 4);
    this.showToast('💤 离线上限提升至' + this.offlineCap + '小时！');
  }
  this.saveGame();
  this.updateUI();
  this.closePanel();
  this.openShop();
};

// ==================== 转生系统 ====================

Game.prototype.openRebirth = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  panel.height = 380;

  var title = new eui.Label();
  title.text = '💎 转生'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var self = this;
  var gemsGain = Math.floor(this.maxWaveReached / 10);
  var canRebirth = this.maxWaveReached >= 50;
  var dmgMult = 1 + this.rebirthGems * 0.1;
  var goldMult = 1 + this.rebirthGems * 0.05;

  // 当前状态
  var infoText = '当前转生宝石: 💎 ' + this.rebirthGems + '\n' +
    '伤害加成: ×' + dmgMult.toFixed(1) + '  金币加成: ×' + goldMult.toFixed(1) + '\n' +
    '历史最高波次: ' + this.maxWaveReached;
  var info = new eui.Label();
  info.text = infoText; info.size = 12; info.textColor = 0xcccccc;
  info.x = 20; info.top = 45; info.width = 310; info.lineSpacing = 6;
  panel.addChild(info);

  // 转生收益预览
  var previewBg = new eui.Rect();
  previewBg.width = 310; previewBg.height = 80; previewBg.fillColor = 0x1a153f;
  previewBg.ellipseWidth = 8; previewBg.x = 15; previewBg.y = 110;
  panel.addChild(previewBg);

  var previewTitle = new eui.Label();
  previewTitle.text = '转生收益预览'; previewTitle.size = 13; previewTitle.textColor = 0xf39c12;
  previewTitle.x = 25; previewTitle.y = 116;
  panel.addChild(previewTitle);

  var newGems = this.rebirthGems + gemsGain;
  var newDmgMult = 1 + newGems * 0.1;
  var newGoldMult = 1 + newGems * 0.05;
  var previewText = '获得 💎 ' + gemsGain + ' 宝石 (累计: ' + newGems + ')\n' +
    '伤害加成: ×' + newDmgMult.toFixed(1) + '  金币加成: ×' + newGoldMult.toFixed(1);
  var preview = new eui.Label();
  preview.text = previewText; preview.size = 12; preview.textColor = 0xffd700;
  preview.x = 25; preview.y = 138; preview.width = 290; preview.lineSpacing = 4;
  panel.addChild(preview);

  // 转生代价说明
  var costBg = new eui.Rect();
  costBg.width = 310; costBg.height = 60; costBg.fillColor = 0x2c1340;
  costBg.ellipseWidth = 8; costBg.x = 15; costBg.y = 200;
  panel.addChild(costBg);

  var costText = new eui.Label();
  costText.text = '⚠️ 转生代价:\n等级、波次、金币全部重置为初始值\n保留: 宝石、成就、辅助英雄解锁';
  costText.size = 11; costText.textColor = 0xe74c3c;
  costText.x = 25; costText.y = 208; costText.width = 290; costText.lineSpacing = 4;
  panel.addChild(costText);

  // 转生条件提示
  var condText = new eui.Label();
  if (canRebirth) {
    condText.text = '✅ 条件满足：最高波次 ≥ 50';
    condText.textColor = 0x2ecc71;
  } else {
    condText.text = '❌ 条件不足：需要最高波次 ≥ 50 (当前: ' + this.maxWaveReached + ')';
    condText.textColor = 0xe74c3c;
  }
  condText.size = 12; condText.x = 20; condText.y = 275; condText.width = 310;
  panel.addChild(condText);

  // 转生按钮
  var btn = this.createButton(
    canRebirth ? '确认转生 (+💎' + gemsGain + ')' : '无法转生',
    canRebirth ? 0x8e44ad : 0x555555,
    160, 40,
    function() {
      if (canRebirth) self.doRebirth(gemsGain);
    },
    this
  );
  btn.horizontalCenter = 0; btn.y = 310;
  if (!canRebirth) btn.alpha = 0.4;
  panel.addChild(btn);
};

Game.prototype.doRebirth = function(gemsGain) {
  // 增加宝石
  this.rebirthGems += gemsGain;
  // 重置游戏状态
  this.gold = 0;
  this.energy = 100;
  this.mainLevel = 1;
  this.wave = 1;
  this.totalCleared = 0;
  this.killCount = 0;
  this.skillCD = [0,0,0,0,0,0,0];
  this.skillUnlocked = [true,false,false,false,false,false,false];
  this.supports = SUPPORTS_DEF.map(function(s) {
    return { name: s.name, dps: s.dps, wave: s.wave, level: 1, unlocked: s.wave === 0 };
  });
  this.monsters = [];
  this.foods = { '棒棒糖': 0, '牛奶': 0, '烤肉': 0 };
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
  this.openCheckin(true);
};

Game.prototype.openCheckin = function(auto) {
  var today = new Date().toDateString();
  var alreadyChecked = this.checkinDate === today;
  var day = alreadyChecked ? this.checkinDay : (this.checkinDay % 7);

  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);
  panel.height = 360;

  var title = new eui.Label();
  title.text = '📅 每日签到'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var contText = new eui.Label();
  contText.text = '连续签到: ' + this.checkinDay + '天'; contText.size = 12; contText.textColor = 0xaaaaaa;
  contText.horizontalCenter = 0; contText.top = 40;
  panel.addChild(contText);

  for (var i = 0; i < CHECKIN_REWARDS.length; i++) {
    var r = CHECKIN_REWARDS[i];
    var done = alreadyChecked ? i < day : i < day;
    var isToday = !alreadyChecked && i === day;
    var col = i % 4; var row = Math.floor(i / 4);
    var cx = 20 + col * 80; var cy = 64 + row * 90;

    var itemBg = new eui.Rect();
    itemBg.width = 72; itemBg.height = 80; itemBg.ellipseWidth = 8; itemBg.ellipseHeight = 8;
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
    this.foods[reward.bonus.name] = (this.foods[reward.bonus.name] || 0) + 1;
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
    this.stats._dailyKills = 0;
    this.stats._dailyClicks = 0;
    this.stats._dailyWaves = 0;
  }
};

Game.prototype.checkDailyTasks = function(type) {
  this.resetDailyTasks();
  if (type === 'kill') this.stats._dailyKills = (this.stats._dailyKills || 0) + 1;
  if (type === 'click') this.stats._dailyClicks = (this.stats._dailyClicks || 0) + 1;
  if (type === 'wave') this.stats._dailyWaves = (this.stats._dailyWaves || 0) + 1;
  for (var i = 0; i < DAILY_TASKS.length; i++) {
    var t = DAILY_TASKS[i];
    if (!this.dailyTaskDone[i] && t.track(this.stats) >= t.target) {
      this.dailyTaskDone[i] = true;
      this.showToast('📋 任务完成: ' + t.desc + '！');
    }
  }
};

Game.prototype.openDailyTasks = function() {
  this.resetDailyTasks();
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);

  var title = new eui.Label();
  title.text = '📋 每日任务'; title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var self = this;
  var y = 50;

  for (var i = 0; i < DAILY_TASKS.length; i++) {
    var t = DAILY_TASKS[i];
    var done = this.dailyTaskDone[i];
    var progress = Math.min(t.track(this.stats), t.target);
    var pct = progress / t.target;

    var rowBg = new eui.Rect();
    rowBg.width = 310; rowBg.height = 56; rowBg.fillColor = 0x1a153f;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.x = 15; rowBg.y = y;
    panel.addChild(rowBg);

    var iconBg = new eui.Rect();
    iconBg.width = 32; iconBg.height = 32; iconBg.ellipseWidth = 16; iconBg.ellipseHeight = 16;
    iconBg.fillColor = done ? 0x2ecc71 : 0x3498db;
    iconBg.x = 25; iconBg.y = y + 12;
    panel.addChild(iconBg);

    var iconLb = new eui.Label();
    iconLb.text = done ? '✓' : '📋'; iconLb.size = 14;
    iconLb.x = iconBg.x + 9; iconLb.y = y + 20;
    panel.addChild(iconLb);

    var descLb = new eui.Label();
    descLb.text = t.desc; descLb.size = 12; descLb.textColor = 0xcccccc;
    descLb.x = 68; descLb.y = y + 6;
    panel.addChild(descLb);

    var progBg = new eui.Rect();
    progBg.width = 150; progBg.height = 6; progBg.fillColor = 0x140e36;
    progBg.x = 68; progBg.y = y + 28;
    panel.addChild(progBg);

    var progFill = new eui.Rect();
    progFill.width = 150 * pct; progFill.height = 6; progFill.fillColor = 0x2ecc71;
    progFill.x = 68; progFill.y = y + 28;
    panel.addChild(progFill);

    var progText = new eui.Label();
    progText.text = progress + '/' + t.target; progText.size = 10; progText.textColor = 0x888888;
    progText.x = 225; progText.y = y + 26;
    panel.addChild(progText);

    if (done) {
      (function(idx) {
        var claimBtn = self.createButton('+' + DAILY_TASKS[idx].reward + '金', 0x27ae60, 60, 26,
          function() { self.claimTask(idx); }, self);
        claimBtn.x = 245; claimBtn.y = y + 15;
        panel.addChild(claimBtn);
      })(i);
    }

    y += 62;
  }
  panel.height = y + 16;
};

Game.prototype.claimTask = function(idx) {
  if (!this.dailyTaskDone[idx]) return;
  var t = DAILY_TASKS[idx];
  this.gold += t.reward;
  this.showToast('📋 领取奖励: ' + t.reward + '金');
  this.dailyTaskDone[idx] = false;
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
  panel.height = Math.min(500, 70 + ACHIEVEMENTS.length * 54);

  var title = new eui.Label();
  title.text = '🏆 成就 (' + this.achievements.length + '/' + ACHIEVEMENTS.length + ')';
  title.size = 18; title.textColor = 0xffffff;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var y = 45;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i];
    var completed = this.achievements.indexOf(a.id) >= 0;

    var rowBg = new eui.Rect();
    rowBg.width = 310; rowBg.height = 44; rowBg.fillColor = 0x1a153f;
    rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
    rowBg.x = 15; rowBg.y = y;
    rowBg.alpha = completed ? 1 : 0.5;
    panel.addChild(rowBg);

    var iconBg = new eui.Rect();
    iconBg.width = 32; iconBg.height = 32; iconBg.ellipseWidth = 16; iconBg.ellipseHeight = 16;
    iconBg.fillColor = completed ? 0xf39c12 : 0x555555;
    iconBg.x = 25; iconBg.y = y + 6;
    panel.addChild(iconBg);

    var nameLb = new eui.Label();
    nameLb.text = a.name; nameLb.size = 12; nameLb.textColor = completed ? 0xffffff : 0x888888;
    nameLb.x = 68; nameLb.y = y + 6;
    panel.addChild(nameLb);

    var descLb = new eui.Label();
    descLb.text = a.desc; descLb.size = 10; descLb.textColor = 0x888888;
    descLb.x = 68; descLb.y = y + 24;
    panel.addChild(descLb);

    var rewardLb = new eui.Label();
    rewardLb.text = completed ? '✓ +' + a.reward + '金' : '+' + a.reward + '金';
    rewardLb.size = 11; rewardLb.textColor = completed ? 0xffd700 : 0x666666;
    rewardLb.x = 260; rewardLb.y = y + 14;
    panel.addChild(rewardLb);

    y += 50;
  }
};

// ==================== 图签系统（怪物图鉴） ====================

Game.prototype.openMonsterCodex = function() {
  var overlay = this.createPanelOverlay();
  var panel = this.addPanelContent(overlay);

  var discovered = 0;
  for (var i = 0; i < MONSTER_TYPES.length; i++) {
    if (this.monsterCodex[MONSTER_TYPES[i].shape]) discovered++;
  }

  var title = new eui.Label();
  title.text = '📖 怪物图签 (' + discovered + '/' + MONSTER_TYPES.length + ')';
  title.size = 16; title.textColor = 0xffffff; title.bold = true;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  var subtitle = new eui.Label();
  subtitle.text = '击杀怪物即可收集图签';
  subtitle.size = 11; subtitle.textColor = 0x888888;
  subtitle.horizontalCenter = 0; subtitle.top = 36;
  panel.addChild(subtitle);

  // 2列4行网格布局展示所有怪物
  var COLS = 2;
  var CARD_W = 148; var CARD_H = 72;
  var GAP_X = 10; var GAP_Y = 8;
  var START_X = 15; var START_Y = 55;
  var self = this;

  for (var i = 0; i < MONSTER_TYPES.length; i++) {
    var mt = MONSTER_TYPES[i];
    var codexEntry = this.monsterCodex[mt.shape];
    var found = !!codexEntry;
    var col = i % COLS; var row = Math.floor(i / COLS);
    var cx = START_X + col * (CARD_W + GAP_X);
    var cy = START_Y + row * (CARD_H + GAP_Y);

    // 卡片背景
    var cardBg = new eui.Rect();
    cardBg.width = CARD_W; cardBg.height = CARD_H;
    cardBg.ellipseWidth = 8; cardBg.ellipseHeight = 8;
    cardBg.fillColor = found ? 0x1a2a3a : 0x222222;
    cardBg.strokeColor = found ? mt.badge : 0x444444;
    cardBg.strokeWeight = found ? 2 : 1;
    cardBg.x = cx; cardBg.y = cy;
    panel.addChild(cardBg);

    // 怪物缩略图（小型绘制）
    var monsterThumb = new egret.Shape();
    if (found) {
      this.drawMonsterShape(monsterThumb.graphics, mt, 40, mt.shape === 'dragon');
    } else {
      // 未发现：显示问号剪影
      var tg = monsterThumb.graphics;
      tg.beginFill(0x555555);
      tg.drawCircle(20, 20, 16);
      tg.endFill();
      tg.beginFill(0x333333);
      tg.drawCircle(20, 20, 12);
      tg.endFill();
    }
    monsterThumb.x = cx + 6; monsterThumb.y = cy + 14;
    monsterThumb.scaleX = 0.7; monsterThumb.scaleY = 0.7;
    panel.addChild(monsterThumb);

    // 怪物名字
    var nameLb = new eui.Label();
    nameLb.text = found ? mt.name : '???';
    nameLb.size = 12; nameLb.bold = true;
    nameLb.textColor = found ? 0xffffff : 0x666666;
    nameLb.x = cx + 44; nameLb.y = cy + 8;
    panel.addChild(nameLb);

    // 击杀数
    var killLb = new eui.Label();
    killLb.text = found ? '击杀: ' + (codexEntry.kills || 0) : '未发现';
    killLb.size = 10;
    killLb.textColor = found ? 0xaaaaaa : 0x555555;
    killLb.x = cx + 44; killLb.y = cy + 26;
    panel.addChild(killLb);

    // 胶囊图签标记
    if (found) {
      var badgeBg = new eui.Rect();
      badgeBg.width = 46; badgeBg.height = 14;
      badgeBg.ellipseWidth = 7; badgeBg.ellipseHeight = 7;
      badgeBg.fillColor = mt.badge;
      badgeBg.fillAlpha = 0.9;
      badgeBg.x = cx + 44; badgeBg.y = cy + 44;
      panel.addChild(badgeBg);
      var badgeLb = new eui.Label();
      badgeLb.text = '✓ 已收集'; badgeLb.size = 9;
      badgeLb.textColor = 0xffffff; badgeLb.bold = true;
      badgeLb.x = cx + 48; badgeLb.y = cy + 45;
      panel.addChild(badgeLb);
    } else {
      var lockLb = new eui.Label();
      lockLb.text = '🔒'; lockLb.size = 14;
      lockLb.x = cx + 50; lockLb.y = cy + 42;
      panel.addChild(lockLb);
    }
  }

  var totalRows = Math.ceil(MONSTER_TYPES.length / COLS);
  panel.height = START_Y + totalRows * (CARD_H + GAP_Y) + 16;
};

// ==================== 离线收益 ====================

Game.prototype.checkOfflineReward = function() {
  try {
    var lastTime = parseInt(localStorage.getItem('gujiyouxi_egret_time') || '0');
    if (!lastTime) return;
    var now = Date.now();
    var elapsed = Math.floor((now - lastTime) / 1000);
    if (elapsed < 60) return;
    var maxOffline = this.offlineCap * 3600;
    var seconds = Math.min(elapsed, maxOffline);
    var dps = this.totalDps();
    var reward = Math.floor(dps * 0.1 * seconds);
    if (reward <= 0) return;
    this.gold += reward;
    var hours = Math.floor(seconds / 3600);
    var mins = Math.floor((seconds % 3600) / 60);
    var timeStr = hours > 0 ? hours + '小时' + mins + '分钟' : mins + '分钟';

    var self = this;
    setTimeout(function() {
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
      t2.text = '你离开了 ' + timeStr; t2.size = 12; t2.textColor = 0xaaaaaa;
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

      // 「×2 看广告」按钮（占位：模拟广告已看，直接翻倍）
      var adBtn = self.createButton('📺 看广告 ×2', 0x27ae60, 150, 36, function() {
        // 实际接入广告 SDK 时替换此处逻辑
        self.gold += reward; // 再加一次，等效 ×2
        t3.text = '+' + self.fmt(reward * 2) + ' 💰 (×2)';
        adBtn.alpha = 0.4; adBtn.touchEnabled = false;
        var adLb = adBtn.getChildAt(1);
        if (adLb) adLb.text = '✓ 已翻倍';
        self.showToast('💰 收益已翻倍！');
        self.updateUI();
      }, self);
      adBtn.horizontalCenter = 0; adBtn.top = 160;
      panel.addChild(adBtn);

      var btn = self.createButton('收下', 0xe74c3c, 100, 36, function() { self.closePanel(); }, self);
      btn.horizontalCenter = 0; btn.top = 210;
      panel.height = 260;
      panel.addChild(btn);

      overlay.addChild(panel);
    }, 500);
  } catch(e) {}
};

// ==================== 音效系统（Web Audio 程序合成，无需外部文件） ====================

Game.prototype.initSound = function() {
  this.soundMuted = (localStorage.getItem('gujiyouxi_mute') === '1');
  this._audioCtx = null;
  // 首次用户交互时再创建 AudioContext（浏览器自动播放策略要求）
  var self = this;
  var unlock = function() {
    if (!self._audioCtx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) self._audioCtx = new AC();
      } catch(e) { self._audioCtx = null; }
    }
    if (self._audioCtx && self._audioCtx.state === 'suspended') {
      self._audioCtx.resume();
    }
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('mousedown', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('touchstart', unlock);
  document.addEventListener('mousedown', unlock);
  document.addEventListener('keydown', unlock);
};

// 内部：播放一个 envelope 包络的 oscillator
Game.prototype._beep = function(opts) {
  if (this.soundMuted) return;
  var ctx = this._audioCtx;
  if (!ctx) return;
  try {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = opts.type || 'sine';
    var freq = opts.freq || 440;
    var freqEnd = opts.freqEnd || freq;
    var now = ctx.currentTime;
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
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch(e) {}
};

// --- 对外音效 + 静音切换 ---
Game.prototype.sfxClick = function() {
  this._beep({ type: 'square', freq: 880, freqEnd: 660, duration: 0.06, volume: 0.08 });
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
Game.prototype.sfxSkill = function() {
  this._beep({ type: 'sawtooth', freq: 660, freqEnd: 220, duration: 0.18, volume: 0.14 });
};
Game.prototype.sfxUnlock = function() {
  this._beep({ type: 'sine', freq: 440, freqEnd: 1200, duration: 0.22, volume: 0.14 });
};

Game.prototype.toggleMute = function() {
  this.soundMuted = !this.soundMuted;
  localStorage.setItem('gujiyouxi_mute', this.soundMuted ? '1' : '0');
  this.updateMuteBtn();
  if (!this.soundMuted) this.sfxClick();
  this.showToast(this.soundMuted ? '🔇 已静音' : '🔊 已开启音效');
};

Game.prototype.updateMuteBtn = function() {
  if (this.muteLabel) this.muteLabel.text = this.soundMuted ? '🔇' : '🔊';
};

// ==================== Toast ====================

Game.prototype.showToast = function(msg) {
  var el = new eui.Label();
  el.text = msg; el.size = 14; el.textColor = 0xffffff;
  el.horizontalCenter = 0; el.top = 60;
  el.background = true; el.backgroundColor = 0x000000; el.alpha = 0.85;
  el.paddingLeft = 16; el.paddingRight = 16; el.paddingTop = 8; el.paddingBottom = 8;
  this.main.addChild(el);
  egret.Tween.get(el)
    .wait(1600)
    .to({ alpha: 0, y: el.y - 20 }, 400)
    .call(function() { if (el.parent) el.parent.removeChild(el); });
};

// ==================== 游戏主循环 ====================

Game.prototype.startLoop = function() {
  var self = this;

  // 每秒：能量恢复 + 技能CD + 游戏时间
  setInterval(function() {
    self.stats.playTime++;
    self.energy = Math.min(CONFIG.maxEnergy, self.energy + CONFIG.energyRecovery);
    for (var i = 0; i < self.skillCD.length; i++) {
      if (self.skillCD[i] > 0) self.skillCD[i]--;
    }
    self.updateUI();
  }, 1000);

  // 主角自动攻击（每秒1次，不消耗能量）
  setInterval(function() {
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
    self.doDamage(target, CONFIG.mainDmg(self.mainLevel, self.rebirthGems), tIdx);
    self.updateMonsterDisplay();
  }, 1000);

  // 辅助角色独立攻击（每个角色不同间隔，错开时间）
  for (var si = 0; si < self.supports.length; si++) {
    (function(idx) {
      var def = SUPPORTS_DEF[idx];
      // 初始延迟错开，避免同时攻击
      var initDelay = idx * 200 + Math.random() * 300;
      setTimeout(function() {
        setInterval(function() {
          var s = self.supports[idx];
          if (!s.unlocked || self.monsters.length === 0) return;
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
          target.hp -= dmg;
          self.supportAttackAnim(idx, targetIdx, dmg);
          if (target.hp <= 0) {
            self.onKill(target, targetIdx);
          }
          self.updateMonsterDisplay();
        }, def.atkInterval);
      }, initDelay);
    })(si);
  }

  // 每15秒自动存档
  setInterval(function() { self.saveGame(); }, 15000);
};

// ==================== 存档 ====================

Game.prototype.saveGame = function() {
  try {
    localStorage.setItem('gujiyouxi_egret', JSON.stringify({
      gold: this.gold, energy: this.energy, mainLevel: this.mainLevel,
      wave: this.wave, totalCleared: this.totalCleared,
      killCount: this.killCount, skillCD: this.skillCD, skillUnlocked: this.skillUnlocked,
      supports: this.supports.map(function(s) { return { level: s.level, unlocked: s.unlocked }; }),
      foods: this.foods, freeSpins: this.freeSpins, spinDate: this.spinDate,
      stats: this.stats, checkinDay: this.checkinDay, checkinDate: this.checkinDate,
      dailyTaskDate: this.dailyTaskDate, dailyTaskDone: this.dailyTaskDone,
      achievements: this.achievements, offlineCap: this.offlineCap,
      rebirthGems: this.rebirthGems, maxWaveReached: this.maxWaveReached,
      monsterCodex: this.monsterCodex,
      avatarIdx: this.avatarIdx || 0,
      playerName: this.playerName || '玩家'
    }));
    localStorage.setItem('gujiyouxi_egret_time', Date.now().toString());
  } catch(e) {}
};

Game.prototype.loadGame = function() {
  try {
    var d = JSON.parse(localStorage.getItem('gujiyouxi_egret'));
    if (!d) return;
    this.gold = d.gold || 0;
    this.energy = d.energy || 100;
    this.mainLevel = d.mainLevel || 1;
    this.wave = d.wave || 1;
    this.totalCleared = d.totalCleared || 0;
    this.killCount = d.killCount || 0;
    this.skillCD = d.skillCD || [0,0,0,0,0,0,0];
    this.skillUnlocked = d.skillUnlocked || [true, false, false, false, false, false, false];
    if (d.supports) {
      for (var i = 0; i < d.supports.length; i++) {
        if (this.supports[i]) {
          this.supports[i].level = d.supports[i].level;
          this.supports[i].unlocked = d.supports[i].unlocked;
        }
      }
    }
    if (d.foods) this.foods = { '棒棒糖': d.foods['棒棒糖']||0, '牛奶': d.foods['牛奶']||0, '烤肉': d.foods['烤肉']||0 };
    if (d.freeSpins !== undefined) this.freeSpins = d.freeSpins;
    if (d.spinDate) this.spinDate = d.spinDate;
    if (d.stats) {
      for (var k in d.stats) { if (d.stats.hasOwnProperty(k)) this.stats[k] = d.stats[k]; }
    }
    if (d.checkinDay !== undefined) this.checkinDay = d.checkinDay;
    if (d.checkinDate) this.checkinDate = d.checkinDate;
    if (d.dailyTaskDate) this.dailyTaskDate = d.dailyTaskDate;
    if (d.dailyTaskDone) this.dailyTaskDone = d.dailyTaskDone;
    if (d.achievements) this.achievements = d.achievements;
    if (d.offlineCap) this.offlineCap = d.offlineCap;
    if (d.rebirthGems) this.rebirthGems = d.rebirthGems;
    if (d.maxWaveReached) this.maxWaveReached = d.maxWaveReached;
    if (d.monsterCodex) this.monsterCodex = d.monsterCodex;
    // 兼容旧存档的 round 字段
    if (d.round && d.round > 1 && !d.maxWaveReached) {
      this.maxWaveReached = (d.round - 1) * 10 + (d.wave || 1);
    }
    // 新增字段：头像索引、玩家昵称、邀请/关注奖励领取标记
    if (d.avatarIdx !== undefined) this.avatarIdx = d.avatarIdx;
    if (d.playerName) this.playerName = d.playerName;
  } catch(e) {}
};


// ==================== 头像选择器 ====================

Game.prototype.openAvatarPicker = function() {
  var AVATAR_COLORS = [0x8b4513, 0x3498db, 0x27ae60, 0xe74c3c, 0x9b59b6, 0xe67e22];
  var AVATAR_ICONS  = ['🧙','🐼','🦊','🐯','🐸','🐺'];
  var AVATAR_NAMES  = ['法师','熊猫','狐狸','老虎','青蛙','狼'];

  var overlay = this.createPanelOverlay();
  var panel = new eui.Group();
  panel.width = 320; panel.height = 260;
  panel.horizontalCenter = 0; panel.verticalCenter = 0;
  var pBg = new eui.Rect();
  pBg.percentWidth = 100; pBg.percentHeight = 100;
  pBg.fillColor = 0x2a1f5c; pBg.ellipseWidth = 12; pBg.ellipseHeight = 12;
  panel.addChild(pBg);

  var title = new eui.Label();
  title.text = '选择头像'; title.size = 16; title.textColor = 0xffffff; title.bold = true;
  title.horizontalCenter = 0; title.top = 14;
  panel.addChild(title);

  // 关闭按钮
  var closeBtn = new eui.Label();
  closeBtn.text = '×'; closeBtn.size = 24; closeBtn.textColor = 0xffffff;
  closeBtn.right = 12; closeBtn.top = 8; closeBtn.touchEnabled = true;
  var self = this;
  closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.closePanel(); }, this);
  panel.addChild(closeBtn);

  // 3列 × 2行 头像格子
  var COLS = 3, CELL_W = 80, CELL_H = 90, GAP = 10;
  var START_X = (320 - COLS * CELL_W - (COLS - 1) * GAP) / 2;
  var START_Y = 50;

  for (var i = 0; i < AVATAR_ICONS.length; i++) {
    (function(idx) {
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
      border.fillColor = 0x1a153f;
      border.strokeColor = (self.avatarIdx === idx) ? 0xfbbf24 : 0x333333;
      border.strokeWeight = (self.avatarIdx === idx) ? 2 : 1;
      border.percentWidth = 100; border.percentHeight = 100;
      cell.addChild(border);

      // 头像圆形底色
      var iconBg = new eui.Rect();
      iconBg.width = 44; iconBg.height = 44;
      iconBg.ellipseWidth = 22; iconBg.ellipseHeight = 22;
      iconBg.fillColor = AVATAR_COLORS[idx];
      iconBg.horizontalCenter = 0; iconBg.top = 8;
      cell.addChild(iconBg);

      var iconLb = new eui.Label();
      iconLb.text = AVATAR_ICONS[idx]; iconLb.size = 20;
      iconLb.horizontalCenter = 0; iconLb.top = 18;
      cell.addChild(iconLb);

      var nameLb2 = new eui.Label();
      nameLb2.text = AVATAR_NAMES[idx]; nameLb2.size = 11;
      nameLb2.textColor = 0xcccccc;
      nameLb2.horizontalCenter = 0; nameLb2.top = 56;
      cell.addChild(nameLb2);

      cell.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
        self.avatarIdx = idx;
        // 刷新顶部头像显示
        if (self._avatarBg)   self._avatarBg.fillColor = AVATAR_COLORS[idx];
        if (self._avatarIcon) self._avatarIcon.text = AVATAR_ICONS[idx];
        self.saveGame();
        self.closePanel();
        self.showToast('✅ 头像已更换为' + AVATAR_NAMES[idx]);
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
  hint.text = '当前昵称：' + (this.playerName || '玩家');
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
        if (self._nameLb) self._nameLb.text = name + ' ✏️';
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
    var newName = window.prompt('请输入新昵称（最多8个字符）：', self.playerName || '玩家');
    if (newName && newName.trim()) {
      var trimmed = newName.trim().slice(0, 8);
      self.playerName = trimmed;
      if (self._nameLb) self._nameLb.text = trimmed + ' ✏️';
      self.saveGame();
      self.closePanel();
      self.showToast('✅ 昵称已改为：' + trimmed);
    }
  }, self);
  inputBtn.horizontalCenter = 0; inputBtn.top = 168;
  panel.addChild(inputBtn);

  overlay.addChild(panel);
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
  // 清除并重建左侧辅助角色组
  if (this.leftSupGroup) {
    while (this.leftSupGroup.numChildren > 0) {
      this.leftSupGroup.removeChildAt(0);
    }
    for (var i = 0; i < 4; i++) {
      var sc = this.createSupportView(i, i * 56);
      this.leftSupGroup.addChild(sc);
    }
  }
  // 清除并重建右侧辅助角色组
  if (this.rightSupGroup) {
    while (this.rightSupGroup.numChildren > 0) {
      this.rightSupGroup.removeChildAt(0);
    }
    for (var i = 4; i < 8; i++) {
      var sc = this.createSupportView(i, (i - 4) * 56);
      this.rightSupGroup.addChild(sc);
    }
  }
};
