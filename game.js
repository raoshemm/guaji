// ==================== 吃饭睡觉打豆豆 - Egret引擎版 ====================

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

var SKILLS = [
  { name: '普攻', cd: 0, dmg: 1, hits: 1, lv: 1 },
  { name: '重击', cd: 5, dmg: 2, hits: 1, lv: 3 },
  { name: '连击', cd: 8, dmg: 0.8, hits: 3, lv: 5 },
  { name: '暴击', cd: 12, dmg: 4, hits: 1, lv: 8 },
  { name: '旋风', cd: 18, dmg: 2.5, hits: 0, lv: 12 },
  { name: '雷霆', cd: 30, dmg: 6, hits: 1, lv: 18 },
  { name: '终极', cd: 60, dmg: 12, hits: 1, lv: 25 }
];

// 怪物类型（外观、名称、血条颜色）
var MONSTER_TYPES = [
  { name: '史莱姆', shape: 'slime',  color: 0x3498db, hpColor: 0x2ecc71 },
  { name: '兔子',   shape: 'blob',   color: 0xff69b4, hpColor: 0x2ecc71 },
  { name: '蝙蝠',   shape: 'bat',    color: 0x8e44ad, hpColor: 0x9b59b6 },
  { name: '刺球',   shape: 'spike',  color: 0xe74c3c, hpColor: 0xe74c3c },
  { name: '幽灵',   shape: 'ghost',  color: 0xbdc3c7, hpColor: 0x95a5a6 },
  { name: '骷髅',   shape: 'skull',  color: 0xecf0f1, hpColor: 0xbdc3c7 },
  { name: '火龙',   shape: 'dragon', color: 0xe67e22, hpColor: 0xf39c12 },
  { name: '暗影',   shape: 'shadow', color: 0x2c3e50, hpColor: 0x34495e }
];

var SUPPORTS_DEF = [
  { name: '小毛绒', dps: 15, wave: 0,  atkInterval: 1200, color: 0xff69b4, shape: 'circle',   symbol: '毛' },
  { name: '棉花糖', dps: 28, wave: 5,  atkInterval: 1500, color: 0xff69b4, shape: 'cloud',    symbol: '棉' },
  { name: '肉丸',   dps: 45, wave: 15, atkInterval: 1000, color: 0xff69b4, shape: 'diamond',  symbol: '肉' },
  { name: '布丁',   dps: 75, wave: 30, atkInterval: 1800, color: 0xff69b4, shape: 'square',   symbol: '布' },
  { name: '蛋筒',   dps: 120, wave: 50, atkInterval: 900,  color: 0x808080, shape: 'triangle', symbol: '蛋' },
  { name: '麻薯',   dps: 200, wave: 80, atkInterval: 1400, color: 0x808080, shape: 'star',     symbol: '麻' },
  { name: '雪糕',   dps: 350, wave: 120, atkInterval: 1100, color: 0x808080, shape: 'crescent', symbol: '雪' },
  { name: '甜甜',   dps: 600, wave: 180, atkInterval: 1600, color: 0x808080, shape: 'heart',    symbol: '甜' }
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
  this.buildUI();
  this.spawnWave();
  this.bindEvents();
  this.startLoop();
  this.checkOfflineReward();
  var self = this;
  setTimeout(function() { self.checkDailyCheckin(); }, 1200);
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
  bg.width = w; bg.height = h; bg.fillColor = color; bg.ellipseWidth = 6; bg.ellipseHeight = 6;
  bg.percentWidth = 100; bg.percentHeight = 100;
  g.addChild(bg);
  var lb = new eui.Label();
  lb.text = text; lb.size = 12; lb.textColor = 0xffffff;
  lb.horizontalCenter = 0; lb.verticalCenter = 0;
  g.addChild(lb);
  g.touchEnabled = true;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, ctx);
  return g;
};

// ==================== 角色外观绘制 ====================

Game.prototype.createSupportView = function(idx, yPos) {
  var s = this.supports[idx];
  var def = SUPPORTS_DEF[idx];
  var sc = new eui.Group(); sc.width = 40; sc.height = 40; sc.y = yPos;
  var shape = new egret.Shape();
  var c = s.unlocked ? def.color : 0x444444;
  var g = shape.graphics;
  var cx = 20, cy = 20;

  // 身体形状
  g.beginFill(c);
  switch (def.shape) {
    case 'circle':   g.drawCircle(cx, cy, 14); break;
    case 'cloud':    g.drawCircle(cx - 5, cy + 2, 9); g.drawCircle(cx + 5, cy + 2, 9); g.drawCircle(cx, cy - 4, 9); break;
    case 'diamond':  g.moveTo(cx, cy - 15); g.lineTo(cx + 14, cy); g.lineTo(cx, cy + 15); g.lineTo(cx - 14, cy); break;
    case 'square':   g.drawRoundRect(cx - 13, cy - 13, 26, 26, 5); break;
    case 'triangle': g.moveTo(cx, cy - 15); g.lineTo(cx + 14, cy + 12); g.lineTo(cx - 14, cy + 12); break;
    case 'star':     this.drawStar(g, cx, cy, 15, 7, 5); break;
    case 'crescent': g.drawCircle(cx, cy, 14); g.endFill(); g.beginFill(s.unlocked ? 0x3d2b1f : 0x333333); g.drawCircle(cx + 5, cy - 3, 12); break;
    case 'heart':    g.drawCircle(cx - 5, cy - 4, 8); g.drawCircle(cx + 5, cy - 4, 8); g.endFill(); g.beginFill(c); g.moveTo(cx - 13, cy - 1); g.lineTo(cx, cy + 14); g.lineTo(cx + 13, cy - 1); break;
    default:         g.drawCircle(cx, cy, 14);
  }
  g.endFill();

  // 武器（根据角色不同）
  switch (idx) {
    case 0: // 小毛绒 - 小木棒
      g.beginFill(0x8b6914); g.drawRect(cx + 12, cy - 10, 3, 20); g.endFill();
      g.beginFill(0xa0522d); g.drawCircle(cx + 13, cy - 12, 5); break;
    case 1: // 棉花糖 - 魔法杖（星星）
      g.beginFill(0xd4a017); g.drawRect(cx + 10, cy - 12, 2, 24); g.endFill();
      g.beginFill(0xff69b4); this.drawStar(g, cx + 11, cy - 14, 6, 3, 5); break;
    case 2: // 肉丸 - 大锤
      g.beginFill(0x8b6914); g.drawRect(cx + 10, cy - 6, 3, 18); g.endFill();
      g.beginFill(0x666666); g.drawRoundRect(cx + 6, cy - 14, 12, 10, 3); break;
    case 3: // 布丁 - 汤勺
      g.beginFill(0xc0c0c0); g.drawRect(cx + 10, cy - 8, 2, 20); g.endFill();
      g.beginFill(0xf39c12); g.drawEllipse(cx + 7, cy - 14, 8, 6); break;
    case 4: // 蛋筒 - 长枪
      g.beginFill(0x8b6914); g.drawRect(cx + 11, cy - 16, 2, 32); g.endFill();
      g.beginFill(0xc0c0c0); g.moveTo(cx + 12, cy - 20); g.lineTo(cx + 16, cy - 14); g.lineTo(cx + 8, cy - 14); break;
    case 5: // 麻薯 - 魔法书
      g.beginFill(0x6c3483); g.drawRoundRect(cx + 8, cy - 10, 14, 18, 2); g.endFill();
      g.beginFill(0xf1c40f); g.drawRect(cx + 10, cy - 6, 10, 2); g.drawRect(cx + 10, cy - 2, 10, 2); break;
    case 6: // 雪糕 - 冰杖
      g.beginFill(0x85c1e9); g.drawRect(cx + 10, cy - 12, 2, 24); g.endFill();
      g.beginFill(0x00bcd4); g.drawCircle(cx + 11, cy - 14, 5); break;
    case 7: // 甜甜 - 爱心弓
      g.beginFill(0xc0392b); g.drawRect(cx + 10, cy - 10, 2, 20); g.endFill();
      g.lineStyle(2, 0xe74c3c); g.drawCircle(cx + 11, cy - 12, 6); g.lineStyle(0); break;
  }
  g.endFill();

  shape.x = 0; shape.y = 0;
  sc.addChild(shape);

  // 名字标签
  var sl = new eui.Label();
  sl.text = def.symbol; sl.size = 9; sl.bold = true;
  sl.textColor = s.unlocked ? 0xffffff : 0x888888;
  sl.horizontalCenter = 0; sl.verticalCenter = 12;
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
  var startX = supportIdx < 4 ? (5 + 20) : (sw - 45 + 20);
  var startY = Math.floor(bh * 0.18) + localIdx * 55 + 20;
  var w = this.monsters.length || 1;
  var cx = this._centerX || 55;
  var cw = this._centerW || 265;
  var endX = cx + cw * ((targetIdx >= 0 ? targetIdx : 0) + 0.5) / w;
  var endY = this._monsterAreaY + this._monsterAreaH / 2;
  var self = this;
  // 物理系: 0小毛绒 2肉丸 3布丁 4蛋筒 / 法术系: 1棉花糖 5麻薯 6雪糕 7甜甜
  var isMagic = (supportIdx === 1 || supportIdx === 5 || supportIdx === 6 || supportIdx === 7);

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

  // 飞弹
  var bullet = new egret.Shape();
  var bg = bullet.graphics;
  bg.beginFill(color);
  var sz = 5;
  switch (def.shape) {
    case 'circle':   bg.drawCircle(0, 0, sz); break;
    case 'cloud':    bg.drawCircle(-2, 0, sz*0.7); bg.drawCircle(2, 0, sz*0.7); bg.drawCircle(0, -2, sz*0.7); break;
    case 'diamond':  bg.moveTo(0, -sz); bg.lineTo(sz, 0); bg.lineTo(0, sz); bg.lineTo(-sz, 0); break;
    case 'square':   bg.drawRect(-sz, -sz, sz*2, sz*2); break;
    case 'triangle': bg.moveTo(0, -sz); bg.lineTo(sz, sz); bg.lineTo(-sz, sz); break;
    case 'star':     this.drawStar(bg, 0, 0, sz, sz*0.4, 5); break;
    case 'crescent': bg.drawCircle(0, 0, sz); bg.endFill(); bg.beginFill(0x16243a); bg.drawCircle(2, -1, sz*0.8); break;
    case 'heart':    bg.drawCircle(-2, -2, sz*0.6); bg.drawCircle(2, -2, sz*0.6); bg.endFill(); bg.beginFill(color);
                     bg.moveTo(-sz, 0); bg.lineTo(0, sz); bg.lineTo(sz, 0); break;
    default:         bg.drawCircle(0, 0, sz);
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
  var stageW = 375;
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
  topBg.percentWidth = 100; topBg.percentHeight = 100; topBg.fillColor = 0x1a0a2e;
  topBar.addChild(topBg);

  // 第一行：VIP + 头像 + 名字 + 波次进度数字 + 金币
  // VIP标识
  var vipBg = new eui.Rect();
  vipBg.width = 45; vipBg.height = 18; vipBg.ellipseWidth = 4; vipBg.ellipseHeight = 4;
  vipBg.fillColor = 0xc0392b; vipBg.x = 8; vipBg.y = 6;
  topBar.addChild(vipBg);
  var vipText = new eui.Label();
  vipText.text = 'VIP0'; vipText.size = 10; vipText.textColor = 0xffffff; vipText.bold = true;
  vipText.x = 12; vipText.y = 8;
  topBar.addChild(vipText);

  // 头像（方形）
  var avatarBg = new eui.Rect();
  avatarBg.width = 36; avatarBg.height = 36; avatarBg.ellipseWidth = 4; avatarBg.ellipseHeight = 4;
  avatarBg.fillColor = 0x8b4513; avatarBg.x = 8; avatarBg.y = 28;
  topBar.addChild(avatarBg);
  var avatarText = new eui.Label();
  avatarText.text = '头像'; avatarText.size = 9; avatarText.textColor = 0xffffff;
  avatarText.x = 10; avatarText.y = 40;
  topBar.addChild(avatarText);

  // 名字
  var nameLb = new eui.Label();
  nameLb.text = '玩家姓名'; nameLb.size = 12; nameLb.textColor = 0xffffff; nameLb.bold = true;
  nameLb.x = 50; nameLb.y = 32;
  topBar.addChild(nameLb);

  // 波次进度数字（动态显示当前波次附近4个数字）
  this._waveNumBgs = [];
  this._waveNumLbs = [];
  for (var i = 0; i < 4; i++) {
    var numBg = new eui.Rect();
    numBg.width = 28; numBg.height = 22; numBg.ellipseWidth = 4; numBg.ellipseHeight = 4;
    numBg.fillColor = 0x2d1f4e;
    numBg.x = 105 + i * 32; numBg.y = 6;
    topBar.addChild(numBg);
    this._waveNumBgs.push(numBg);
    var numLb = new eui.Label();
    numLb.text = ''; numLb.size = 12; numLb.textColor = 0xffffff; numLb.bold = true;
    numLb.x = 113 + i * 32; numLb.y = 9;
    topBar.addChild(numLb);
    this._waveNumLbs.push(numLb);
  }
  this.updateWaveNumbers();

  // 金币（右上）
  this.goldLabel = new eui.Label();
  this.goldLabel.text = '💰 ' + this.fmt(this.gold);
  this.goldLabel.size = 14; this.goldLabel.textColor = 0xffd700; this.goldLabel.bold = true;
  this.goldLabel.x = stageW - 80; this.goldLabel.y = 10;
  topBar.addChild(this.goldLabel);

  // 转生宝石
  this.gemsLabel = new eui.Label();
  this.gemsLabel.text = '💎' + this.rebirthGems;
  this.gemsLabel.size = 11; this.gemsLabel.textColor = 0x9b59b6;
  this.gemsLabel.x = stageW - 80; this.gemsLabel.y = 30;
  topBar.addChild(this.gemsLabel);

  // 成就按钮（最右）
  var achBtn = new eui.Label();
  achBtn.text = '🏆' + this.achievements.length;
  achBtn.size = 14; achBtn.textColor = 0xf39c12; achBtn.touchEnabled = true;
  achBtn.x = stageW - 30; achBtn.y = 12;
  achBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openAchievements, this);
  topBar.addChild(achBtn);

  // 第二行：波次 + HP条
  this.waveLabel = new eui.Label();
  this.waveLabel.text = this.waveText(); this.waveLabel.size = 13; this.waveLabel.textColor = 0xffffff;
  this.waveLabel.bold = true; this.waveLabel.x = 10; this.waveLabel.y = 50;
  topBar.addChild(this.waveLabel);

  // HP条背景
  var hpBg = new eui.Rect();
  hpBg.width = 160; hpBg.height = 12; hpBg.ellipseWidth = 6; hpBg.ellipseHeight = 6;
  hpBg.fillColor = 0x1a1a1a; hpBg.x = 90; hpBg.y = 50;
  topBar.addChild(hpBg);
  // HP条填充
  this.hpFill = new eui.Rect();
  this.hpFill.width = 140; this.hpFill.height = 12; this.hpFill.ellipseWidth = 6; this.hpFill.ellipseHeight = 6;
  this.hpFill.fillColor = 0x27ae60; this.hpFill.x = 90; this.hpFill.y = 50;
  topBar.addChild(this.hpFill);
  // HP文字
  this.hpLabel = new eui.Label();
  this.hpLabel.text = '100 / 100'; this.hpLabel.size = 9; this.hpLabel.textColor = 0xffffff;
  this.hpLabel.x = 120; this.hpLabel.y = 51;
  topBar.addChild(this.hpLabel);

  this.main.addChild(topBar);

  // ===== 战斗区域 =====
  this.battleGroup = new eui.Group();
  this.battleGroup.width = stageW; this.battleGroup.height = BATTLE_H;
  this.battleGroup.touchEnabled = true;

  // 天空渐变背景（从浅蓝到深蓝）
  var skyBg = new eui.Rect();
  skyBg.percentWidth = 100; skyBg.height = Math.floor(BATTLE_H * 0.45);
  skyBg.fillColor = 0x87CEEB;
  this.battleGroup.addChild(skyBg);
  // 中间过渡区
  var skyMid = new eui.Rect();
  skyMid.percentWidth = 100; skyMid.height = Math.floor(BATTLE_H * 0.15);
  skyMid.y = Math.floor(BATTLE_H * 0.45);
  skyMid.fillColor = 0x90EE90;
  this.battleGroup.addChild(skyMid);
  // 草地/战斗地面
  var groundBg = new eui.Rect();
  groundBg.percentWidth = 100; groundBg.height = Math.floor(BATTLE_H * 0.40);
  groundBg.y = Math.floor(BATTLE_H * 0.60);
  groundBg.fillColor = 0x2d8a4e;
  this.battleGroup.addChild(groundBg);
  // 地面深色边缘
  var groundEdge = new eui.Rect();
  groundEdge.percentWidth = 100; groundEdge.height = 4;
  groundEdge.y = Math.floor(BATTLE_H * 0.60);
  groundEdge.fillColor = 0x1e6b38;
  this.battleGroup.addChild(groundEdge);

  // === 布局分区 ===
  // 左边缘(0-45): 辅助角色作为敌人
  // 左按钮(48-100): 功能按钮
  // 中央(105-270): 怪物
  // 右边缘(330-375): 辅助角色作为敌人
  // 右上: 挑战BOSS按钮

  // --- 左侧辅助角色（作为敌人形象）---
  var leftSup = new eui.Group();
  leftSup.x = 5; leftSup.y = Math.floor(BATTLE_H * 0.18);
  for (var i = 0; i < 4; i++) {
    var sc = this.createSupportView(i, i * 55);
    leftSup.addChild(sc);
  }
  this.leftSupGroup = leftSup;
  this.battleGroup.addChild(leftSup);

  // --- 右侧辅助角色（作为敌人形象）---
  var rightSup = new eui.Group();
  rightSup.x = stageW - 45; rightSup.y = Math.floor(BATTLE_H * 0.18);
  for (var i = 4; i < 8; i++) {
    var sc = this.createSupportView(i, (i - 4) * 55);
    rightSup.addChild(sc);
  }
  this.rightSupGroup = rightSup;
  this.battleGroup.addChild(rightSup);

  // === 左侧功能按钮区（x: 48-100）===
  var leftBtnDefs = [
    [
      { text: '邀请', fn: function() { self.showToast('分享游戏给好友即可获得奖励！'); } },
      { text: '首冲', fn: function() { self.openShop(); } },
      { text: '邮件', fn: function() { self.openMail(); } }
    ],
    [
      { text: '关注', fn: function() { self.showToast('关注官方号获取最新资讯！'); } },
      { text: '每日', fn: function() { self.openDailyTasks(); } },
      { text: '签到', fn: function() { self.openCheckin(); } }
    ],
    [
      { text: '磨转石', fn: function() { self.openRebirth(); } },
      { text: '公告', fn: function() { self.openAnnouncement(); } },
      { text: '能量互助', fn: function() { self.openEnergyHelp(); } }
    ]
  ];
  var leftBtnGroup = new eui.Group();
  leftBtnGroup.x = 48; leftBtnGroup.y = 8;
  for (var col = 0; col < 2; col++) {
    for (var row = 0; row < leftBtnDefs[col].length; row++) {
      var lb = new eui.Label();
      lb.text = leftBtnDefs[col][row].text; lb.size = 9; lb.textColor = 0xffffff;
      lb.x = col * 26; lb.y = row * 18;
      lb.touchEnabled = true;
      lb.addEventListener(egret.TouchEvent.TOUCH_TAP, leftBtnDefs[col][row].fn, this);
      leftBtnGroup.addChild(lb);
    }
  }
  this.battleGroup.addChild(leftBtnGroup);

  // 第三列按钮
  var leftBtnGroup2 = new eui.Group();
  leftBtnGroup2.x = 48; leftBtnGroup2.y = 70;
  for (var row = 0; row < leftBtnDefs[2].length; row++) {
    var lb = new eui.Label();
    lb.text = leftBtnDefs[2][row].text; lb.size = 9; lb.textColor = 0xffffff;
    lb.x = 0; lb.y = row * 18;
    lb.touchEnabled = true;
    lb.addEventListener(egret.TouchEvent.TOUCH_TAP, leftBtnDefs[2][row].fn, this);
    leftBtnGroup2.addChild(lb);
  }
  this.battleGroup.addChild(leftBtnGroup2);

  // === 右侧：挑战BOSS按钮（右上）===
  var bossBtnBg = new eui.Rect();
  bossBtnBg.width = 65; bossBtnBg.height = 26; bossBtnBg.ellipseWidth = 6; bossBtnBg.ellipseHeight = 6;
  bossBtnBg.fillColor = 0x9b2335; bossBtnBg.x = stageW - 70; bossBtnBg.y = 8;
  bossBtnBg.touchEnabled = true;
  bossBtnBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
    if (self.wave % 10 === 0) {
      self.showToast('当前已是BOSS波！');
    } else {
      self.showToast('到达第10波才能挑战BOSS');
    }
  }, this);
  this.battleGroup.addChild(bossBtnBg);
  var bossBtnText = new eui.Label();
  bossBtnText.text = '挑战BOSS'; bossBtnText.size = 10; bossBtnText.textColor = 0xffffff; bossBtnText.bold = true;
  bossBtnText.x = stageW - 66; bossBtnText.y = 12;
  this.battleGroup.addChild(bossBtnText);

  // === 中央怪物区（x: 105-270）===
  var CENTER_X = 105;
  var CENTER_W = 165;
  this._centerX = CENTER_X;
  this._centerW = CENTER_W;

  // --- 怪物区域（上半部分）---
  this._monsterAreaY = Math.floor(BATTLE_H * 0.15);
  this._monsterAreaH = Math.floor(BATTLE_H * 0.35);

  // --- 主角（居中偏下）---
  var heroGroup = new eui.Group();
  heroGroup.width = 70; heroGroup.height = 80;
  heroGroup.x = CENTER_X + (CENTER_W - 70) / 2;
  heroGroup.y = Math.floor(BATTLE_H * 0.62);
  this._heroBaseY = heroGroup.y;
  // 身体（紫色圆形）
  var heroShape = new egret.Shape();
  var hg = heroShape.graphics;
  hg.beginFill(0x9b59b6);
  hg.drawCircle(35, 45, 25);
  hg.endFill();
  // 头部（浅紫色）
  hg.beginFill(0xd8b4fe);
  hg.drawCircle(35, 25, 18);
  hg.endFill();
  // 帽子（深紫色三角）
  hg.beginFill(0x6b21a8);
  hg.moveTo(35, 0);
  hg.lineTo(50, 30);
  hg.lineTo(20, 30);
  hg.endFill();
  // 帽子装饰
  hg.beginFill(0xfbbf24);
  hg.drawCircle(35, 30, 4);
  hg.endFill();
  // 眼睛
  hg.beginFill(0xffffff);
  hg.drawCircle(30, 25, 4);
  hg.drawCircle(40, 25, 4);
  hg.endFill();
  hg.beginFill(0x000000);
  hg.drawCircle(31, 25, 2);
  hg.drawCircle(41, 25, 2);
  hg.endFill();
  // 法杖
  hg.beginFill(0x8b4513);
  hg.drawRect(58, 20, 3, 40);
  hg.endFill();
  hg.beginFill(0xfbbf24);
  hg.drawCircle(59, 18, 5);
  hg.endFill();
  heroGroup.addChild(heroShape);
  var heroName = new eui.Label(); heroName.text = '魔法师'; heroName.size = 11; heroName.bold = true;
  heroName.textColor = 0xffffff; heroName.horizontalCenter = 0; heroName.top = 65;
  heroGroup.addChild(heroName);
  this.levelLabel = new eui.Label();
  this.levelLabel.text = 'Lv.' + this.mainLevel; this.levelLabel.size = 10;
  this.levelLabel.textColor = 0xd4a017; this.levelLabel.horizontalCenter = 0; this.levelLabel.top = 76;
  heroGroup.addChild(this.levelLabel);
  this.heroGroup = heroGroup;
  this.battleGroup.addChild(heroGroup);

  // --- DPS显示 ---
  this.dpsLabel = new eui.Label();
  this.dpsLabel.text = 'DPS: ' + this.fmt(this.totalDps());
  this.dpsLabel.size = 12; this.dpsLabel.textColor = 0xffffff;
  this.dpsLabel.x = CENTER_X + (CENTER_W - 80) / 2; this.dpsLabel.y = heroGroup.y + 90;
  this.battleGroup.addChild(this.dpsLabel);

  // --- 底部状态区 ---
  var statusY = BATTLE_H - 38;

  // 波次进度条（当前10波进度）
  this.waveFillBg = new eui.Rect();
  this.waveFillBg.width = Math.floor(CENTER_W * 0.8); this.waveFillBg.height = 5;
  this.waveFillBg.fillColor = 0x8b6914; this.waveFillBg.ellipseWidth = 3;
  this.waveFillBg.x = CENTER_X + (CENTER_W - this.waveFillBg.width) / 2; this.waveFillBg.y = statusY;
  this.battleGroup.addChild(this.waveFillBg);
  var waveInCycle = ((this.wave - 1) % 10) + 1;
  this.waveFill = new eui.Rect();
  this.waveFill.width = (waveInCycle / 10) * this.waveFillBg.width;
  this.waveFill.height = 5; this.waveFill.fillColor = 0xd4a017; this.waveFill.ellipseWidth = 3;
  this.waveFill.x = this.waveFillBg.x; this.waveFill.y = statusY;
  this.battleGroup.addChild(this.waveFill);

  // BOSS计时条（默认隐藏）
  this.bossTimerBar = new eui.Rect();
  this.bossTimerBar.width = CENTER_W - 40; this.bossTimerBar.height = 8;
  this.bossTimerBar.fillColor = 0xe74c3c; this.bossTimerBar.ellipseWidth = 4;
  this.bossTimerBar.x = CENTER_X + 20; this.bossTimerBar.y = statusY - 14;
  this.bossTimerBar.visible = false;
  this.battleGroup.addChild(this.bossTimerBar);
  this.bossTimerLabel = new eui.Label();
  this.bossTimerLabel.text = ''; this.bossTimerLabel.size = 12; this.bossTimerLabel.textColor = 0xff6666;
  this.bossTimerLabel.bold = true;
  this.bossTimerLabel.x = CENTER_X + CENTER_W + 5; this.bossTimerLabel.y = statusY - 17;
  this.bossTimerLabel.visible = false;
  this.battleGroup.addChild(this.bossTimerLabel);

  // 能量 + Buff 同一行
  // 能量条可视化
  var energyBarBg = new eui.Rect();
  energyBarBg.width = 100; energyBarBg.height = 10; energyBarBg.ellipseWidth = 5; energyBarBg.ellipseHeight = 5;
  energyBarBg.fillColor = 0x1a1a2e; energyBarBg.x = 12; energyBarBg.y = statusY + 10;
  this.battleGroup.addChild(energyBarBg);
  this.energyFill = new eui.Rect();
  this.energyFill.width = this.energy; this.energyFill.height = 10;
  this.energyFill.ellipseWidth = 5; this.energyFill.ellipseHeight = 5;
  this.energyFill.fillColor = 0x00d4ff; this.energyFill.x = 12; this.energyFill.y = statusY + 10;
  this.battleGroup.addChild(this.energyFill);
  this.energyLabel = new eui.Label();
  this.energyLabel.text = '⚡' + this.energy + '/' + CONFIG.maxEnergy;
  this.energyLabel.size = 9; this.energyLabel.textColor = 0xffffff;
  this.energyLabel.x = 14; this.energyLabel.y = statusY + 9;
  this.battleGroup.addChild(this.energyLabel);

  this.buffLabel = new eui.Label();
  this.buffLabel.text = this.renderBuffText();
  this.buffLabel.size = 11; this.buffLabel.textColor = 0xfbbf24;
  this.buffLabel.right = 12; this.buffLabel.y = statusY + 10;
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
  skillBar.layout = new eui.HorizontalLayout();
  skillBar.layout.horizontalAlign = 'center';
  skillBar.layout.verticalAlign = 'middle';
  skillBar.layout.gap = 6;
  var skillBg = new eui.Rect();
  skillBg.percentWidth = 100; skillBg.percentHeight = 100; skillBg.fillColor = 0x1a1a2e;
  skillBar.addChildAt(skillBg, 0);

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
  navBg.percentWidth = 100; navBg.percentHeight = 100; navBg.fillColor = 0x0d0d1a;
  navBar.addChildAt(navBg, 0);

  var navItems = [
    { text: '升级', icon: '⬆️', fn: function() { self.openUpgrade(); } },
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

// 创建导航按钮（图标+文字）
Game.prototype.createNavBtn = function(text, icon, fn) {
  var g = new eui.Group();
  g.width = 60; g.height = 40;
  g.layout = new eui.VerticalLayout();
  g.layout.horizontalAlign = 'center';
  g.layout.verticalAlign = 'middle';
  g.layout.gap = 2;
  g.touchEnabled = true;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, this);
  var iconLb = new eui.Label();
  iconLb.text = icon; iconLb.size = 18;
  iconLb.horizontalCenter = 0;
  g.addChild(iconLb);
  var textLb = new eui.Label();
  textLb.text = text; textLb.size = 10; textLb.textColor = 0x00d4ff; textLb.bold = true;
  textLb.horizontalCenter = 0;
  g.addChild(textLb);
  return g;
};

Game.prototype.createSkillBtn = function(idx) {
  var s = SKILLS[idx];
  var unlocked = this.mainLevel >= s.lv;
  var g = new eui.Group();
  g.width = 44; g.height = 44;
  var bg = new eui.Rect();
  bg.width = 44; bg.height = 44; bg.ellipseWidth = 22; bg.ellipseHeight = 22;
  // 更丰富的配色方案：每个技能不同颜色
  var skillColors = [0x3498db, 0xe74c3c, 0xf39c12, 0x9b59b6, 0x1abc9c, 0x2980b9, 0xe67e22];
  bg.fillColor = unlocked ? skillColors[idx] : 0x4a4a4a; bg.percentWidth = 100; bg.percentHeight = 100;
  bg.name = 'bg'; g.addChild(bg);
  // 边框效果
  var border = new eui.Rect();
  border.width = 44; border.height = 44; border.ellipseWidth = 22; border.ellipseHeight = 22;
  border.fillAlpha = 0; border.strokeColor = unlocked ? 0xffffff : 0x666666;
  border.strokeWeight = 2; border.percentWidth = 100; border.percentHeight = 100;
  border.name = 'border'; g.addChild(border);
  var lb = new eui.Label();
  lb.text = s.name; lb.size = 10; lb.textColor = unlocked ? 0xffffff : 0x888888;
  lb.horizontalCenter = 0; lb.verticalCenter = 0; lb.name = 'lb';
  g.addChild(lb);
  g.touchEnabled = true;
  var self = this;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.useSkill(idx); }, this);
  return g;
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
  txt.textColor = isCrit ? 0xffff00 : 0xff4444;
  txt.bold = true;
  var w = this.monsters.length || 1;
  var cx = this._centerX || 55;
  var cw = this._centerW || 265;
  var xPct = ((idx >= 0 ? idx : 0) + 0.5) / w;
  txt.x = cx + cw * xPct + (Math.random() * 20 - 10);
  txt.y = this._monsterAreaY + Math.random() * 30;
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
  if (m.isBoss) this.stats.bossKills++;
  if (this.gold > this.stats.totalGold) this.stats.totalGold = this.gold;

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
  }
  this.updateMonsterDisplay();

  // BOSS计时器
  this.stopBossTimer();
  if (isBoss) {
    this.bossActive = true;
    this.bossTimer = CONFIG.bossTimeLimit;
    this.startBossTimer();
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
  this.showToast('💀 BOSS挑战失败！请升级后再来');
  // 重新刷新同一波BOSS
  var self = this;
  setTimeout(function() { self.spawnWave(); }, 1000);
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
    this.bossTimerBar.width = Math.max(0, 280 * pct);
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
  var self = this;
  setTimeout(function() { self.spawnWave(); }, 300);
};

// ==================== 升级 ====================

Game.prototype.checkLevelUp = function() {
  if (this.killCount >= CONFIG.killsNeeded(this.mainLevel)) {
    this.killCount = 0;
    this.mainLevel++;
    this.showToast('⬆️ 主角升级！Lv.' + this.mainLevel + ' 伤害: ' + this.fmt(CONFIG.mainDmg(this.mainLevel, this.rebirthGems)));
    this.checkAchievements();
    for (var i = 0; i < SKILLS.length; i++) {
      if (this.mainLevel >= SKILLS[i].lv && !this.skillUnlocked[i]) {
        this.skillUnlocked[i] = true;
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
  var waveNumStart = Math.max(1, this.wave - 2);
  for (var i = 0; i < 4; i++) {
    var num = waveNumStart + i;
    var isCurrent = (num === this.wave);
    this._waveNumBgs[i].fillColor = isCurrent ? 0xc0392b : 0x5d3a1a;
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
  if (this.energyFill) this.energyFill.width = Math.max(0, (this.energy / CONFIG.maxEnergy) * 100);
  if (this.waveFill && this.waveFillBg) {
    var waveInCycle = ((this.wave - 1) % 10) + 1;
    this.waveFill.width = (waveInCycle / 10) * this.waveFillBg.width;
  }
  if (this.buffLabel) this.buffLabel.text = this.renderBuffText();
  if (this.gemsLabel) this.gemsLabel.text = '💎' + this.rebirthGems;
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
      this.hpFill.width = Math.floor(140 * hpPct);
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
  var sz = m.isBoss ? 76 : 56;
  g.width = sz; g.height = sz + 40;
  var cx = this._centerX || 55;
  var cw = this._centerW || 265;
  g.x = cx + cw * (idx + 0.5) / total - sz / 2;
  g.y = this._monsterAreaY + (this._monsterAreaH - sz - 40) / 2;
  g.touchEnabled = true;
  var self = this;
  g.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.onMonsterTouch(idx); }, this);

  // 根据类型绘制不同怪物外形
  var mType = m.type || MONSTER_TYPES[0];
  var shape = new egret.Shape();
  var sg = shape.graphics;
  var c = mType.color;
  var half = sz / 2;

  sg.beginFill(c);
  switch (mType.shape) {
    case 'blob': // 圆胖怪
      sg.drawCircle(half, half, half - 2);
      sg.endFill();
      sg.beginFill(0xffffff); sg.drawCircle(half - 8, half - 6, 5); sg.drawCircle(half + 8, half - 6, 5);
      sg.endFill(); sg.beginFill(0x000000); sg.drawCircle(half - 7, half - 5, 2.5); sg.drawCircle(half + 9, half - 5, 2.5);
      sg.endFill(); sg.beginFill(0x000000);
      sg.drawCircle(half, half + 6, 8);
      break;
    case 'bat': // 蝙蝠
      sg.drawCircle(half, half, half * 0.6);
      sg.endFill(); sg.beginFill(c);
      sg.moveTo(half - 20, half - 5); sg.lineTo(half - 8, half - 15); sg.lineTo(half - 4, half);
      sg.moveTo(half + 20, half - 5); sg.lineTo(half + 8, half - 15); sg.lineTo(half + 4, half);
      sg.endFill(); sg.beginFill(0xff0000);
      sg.drawCircle(half - 6, half - 4, 3); sg.drawCircle(half + 6, half - 4, 3);
      break;
    case 'spike': // 刺球
      for (var a = 0; a < 8; a++) {
        var angle = (a / 8) * Math.PI * 2;
        var ox = half + Math.cos(angle) * (half - 2);
        var oy = half + Math.sin(angle) * (half - 2);
        sg.drawCircle(ox, oy, 6);
      }
      sg.drawCircle(half, half, half * 0.55);
      sg.endFill(); sg.beginFill(0xffffff);
      sg.drawCircle(half - 5, half - 3, 3); sg.drawCircle(half + 5, half - 3, 3);
      break;
    case 'slime': // 史莱姆（扁圆 + 滴液效果）
      sg.drawEllipse(half - 18, half - 8, 36, 24);
      sg.endFill(); sg.beginFill(0x1e8449);
      sg.drawEllipse(half - 14, half - 14, 28, 20);
      sg.endFill(); sg.beginFill(0xffffff);
      sg.drawCircle(half - 6, half - 10, 4); sg.drawCircle(half + 6, half - 10, 4);
      sg.endFill(); sg.beginFill(0x000000);
      sg.drawCircle(half - 5, half - 9, 2); sg.drawCircle(half + 7, half - 9, 2);
      break;
    case 'ghost': // 幽灵（上圆下波浪）
      sg.drawCircle(half, half - 4, half * 0.7);
      sg.endFill(); sg.beginFill(c);
      sg.moveTo(half - 16, half + 4);
      for (var w = 0; w < 5; w++) {
        var wx = half - 16 + w * 8;
        sg.curveTo(wx + 2, half + 14, wx + 4, half + 4);
      }
      sg.endFill(); sg.beginFill(0x000000);
      sg.drawCircle(half - 7, half - 8, 4); sg.drawCircle(half + 7, half - 8, 4);
      break;
    case 'skull': // 骷髅
      sg.drawCircle(half, half - 2, half * 0.75);
      sg.endFill(); sg.beginFill(0x000000);
      sg.drawCircle(half - 8, half - 6, 6); sg.drawCircle(half + 8, half - 6, 6);
      sg.endFill(); sg.beginFill(0x000000);
      sg.drawRect(half - 6, half + 6, 4, 6); sg.drawRect(half - 1, half + 6, 4, 6); sg.drawRect(half + 4, half + 6, 4, 6);
      break;
    case 'dragon': // 火龙BOSS
      sg.drawCircle(half, half, half - 2);
      sg.endFill(); sg.beginFill(0xd35400);
      sg.moveTo(half - 4, half - 18); sg.lineTo(half - 14, half - 8); sg.lineTo(half - 8, half - 6);
      sg.moveTo(half + 4, half - 18); sg.lineTo(half + 14, half - 8); sg.lineTo(half + 8, half - 6);
      sg.endFill(); sg.beginFill(0xffff00);
      sg.drawCircle(half - 8, half - 4, 5); sg.drawCircle(half + 8, half - 4, 5);
      sg.endFill(); sg.beginFill(0xff0000);
      sg.drawCircle(half - 8, half - 4, 2.5); sg.drawCircle(half + 8, half - 4, 2.5);
      break;
    case 'shadow': // 暗影（不规则形状）
      sg.drawCircle(half, half - 2, half * 0.7);
      sg.endFill(); sg.beginFill(0x1a252f);
      sg.drawCircle(half, half + 4, half * 0.5);
      sg.endFill(); sg.beginFill(0xe74c3c);
      sg.drawCircle(half - 8, half - 4, 4); sg.drawCircle(half + 8, half - 4, 4);
      break;
    default:
      sg.drawCircle(half, half, half - 2);
      sg.endFill(); sg.beginFill(0xffffff);
      sg.drawCircle(half - 6, half - 4, 4); sg.drawCircle(half + 6, half - 4, 4);
  }
  sg.endFill();
  shape.x = 0; shape.y = 0;
  g.addChild(shape);

  // 名称
  var name = new eui.Label();
  name.text = m.isBoss ? '💀BOSS·' + mType.name : mType.name;
  name.size = m.isBoss ? 12 : 10; name.textColor = 0xffffff; name.bold = m.isBoss;
  name.horizontalCenter = 0; name.top = sz + 2;
  g.addChild(name);

  // 血条（BOSS更粗）
  var hpH = m.isBoss ? 8 : 5;
  var hpBg = new eui.Rect();
  hpBg.width = sz - 4; hpBg.height = hpH; hpBg.fillColor = 0x333333; hpBg.ellipseWidth = 3;
  hpBg.horizontalCenter = 0; hpBg.top = sz + 16;
  g.addChild(hpBg);
  var pct = Math.max(0, m.hp / m.maxHp);
  var hpFill = new eui.Rect();
  hpFill.width = Math.max(0, (sz - 4) * pct); hpFill.height = hpH;
  hpFill.fillColor = m.isBoss ? 0xe74c3c : (pct > 0.5 ? mType.hpColor : (pct > 0.2 ? 0xf39c12 : 0xe74c3c));
  hpFill.x = 2; hpFill.top = sz + 16; hpFill.ellipseWidth = 3;
  g.addChild(hpFill);

  // 血量文字
  var hpText = new eui.Label();
  hpText.text = Math.max(0, Math.floor(m.hp)) + '/' + m.maxHp;
  hpText.size = 9; hpText.textColor = 0xaaaaaa;
  hpText.horizontalCenter = 0; hpText.top = sz + 16 + hpH + 2;
  g.addChild(hpText);

  return g;
};

Game.prototype.updateSkillBtns = function() {
  var skillColors = [0x3498db, 0xe74c3c, 0xf39c12, 0x9b59b6, 0x1abc9c, 0x2980b9, 0xe67e22];
  for (var i = 0; i < this.skillBtns.length; i++) {
    var btn = this.skillBtns[i];
    if (!btn) continue;
    var s = SKILLS[i];
    var unlocked = this.mainLevel >= s.lv;
    var cd = this.skillCD[i] > 0;
    var bg = btn.getChildByName('bg');
    var lb = btn.getChildByName('lb');
    if (bg) bg.fillColor = cd ? 0x2c2c2c : (unlocked ? skillColors[i] : 0x4a4a4a);
    if (lb) {
      lb.text = cd ? Math.ceil(this.skillCD[i]) + 's' : s.name;
      lb.textColor = cd ? 0x666666 : (unlocked ? 0xffffff : 0x888888);
    }
  }
};

// ==================== 面板系统 ====================

Game.prototype.createPanelOverlay = function() {
  if (this._panelOverlay && this._panelOverlay.parent) {
    this._panelOverlay.parent.removeChild(this._panelOverlay);
  }
  var overlay = new eui.Group();
  // 用显式尺寸 + 加到 stage 上，避免被 main 的 VerticalLayout 影响
  overlay.width = 375;
  overlay.height = this.main.stage ? this.main.stage.stageHeight : 667;
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

Game.prototype.addPanelContent = function(overlay) {
  var panel = new eui.Group();
  panel.width = 340; panel.height = 400;
  panel.horizontalCenter = 0; panel.verticalCenter = 0;
  var panelBg = new eui.Rect();
  panelBg.percentWidth = 100; panelBg.percentHeight = 100;
  panelBg.fillColor = 0x3d2b1f; panelBg.ellipseWidth = 12; panelBg.ellipseHeight = 12;
  panel.addChild(panelBg);
  overlay.addChild(panel);

  // 关闭按钮
  var closeBtn = new eui.Label();
  closeBtn.text = '×'; closeBtn.size = 24; closeBtn.textColor = 0xffffff;
  closeBtn.right = 12; closeBtn.top = 8; closeBtn.touchEnabled = true;
  var self = this;
  closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function() { self.closePanel(); }, this);
  panel.addChild(closeBtn);

  return panel;
};

Game.prototype.addPanelRow = function(panel, y, iconText, iconColor, infoText, btnText, btnColor, handler, disabled) {
  // 检测是否为多行文本（含预览信息）
  var lines = infoText.split('\n');
  var rowH = lines.length > 1 ? 56 : 44;
  var rowBg = new eui.Rect();
  rowBg.width = 310; rowBg.height = rowH; rowBg.fillColor = 0x2d1810;
  rowBg.ellipseWidth = 8; rowBg.ellipseHeight = 8;
  rowBg.x = 15; rowBg.y = y;
  panel.addChild(rowBg);

  var iconBg = new eui.Rect();
  iconBg.width = 36; iconBg.height = 36; iconBg.ellipseWidth = 18; iconBg.ellipseHeight = 18;
  iconBg.fillColor = iconColor; iconBg.x = 22; iconBg.y = y + (rowH - 36) / 2;
  panel.addChild(iconBg);

  var iconLb = new eui.Label();
  iconLb.text = iconText; iconLb.size = 10; iconLb.textColor = 0xffffff;
  iconLb.x = iconBg.x + 18; iconLb.y = iconBg.y + 18;
  iconLb.textAlign = 'center'; iconLb.width = 0;
  panel.addChild(iconLb);

  var infoLb = new eui.Label();
  infoLb.text = infoText; infoLb.size = 11; infoLb.textColor = 0xffffff;
  infoLb.x = 68; infoLb.y = y + 5; infoLb.width = 170; infoLb.lineSpacing = 3;
  panel.addChild(infoLb);

  if (btnText) {
    var btn = this.createButton(btnText, btnColor || 0xd4a017, 68, 28, handler, this);
    btn.x = 245; btn.y = y + (rowH - 28) / 2;
    if (disabled) btn.alpha = 0.4;
    panel.addChild(btn);
  }

  return y + rowH + 4;
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
  progBg.width = 300; progBg.height = 8; progBg.fillColor = 0x5d3a1a;
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
    rowBg.width = 310; rowBg.height = 32; rowBg.fillColor = 0x16213e;
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
    rowBg.width = 310; rowBg.height = 50; rowBg.fillColor = 0x16213e;
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
    rowBg.width = 310; rowBg.height = 50; rowBg.fillColor = 0x16213e;
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
  previewBg.width = 310; previewBg.height = 80; previewBg.fillColor = 0x16213e;
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
  costBg.width = 310; costBg.height = 60; costBg.fillColor = 0x2c1320;
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
    itemBg.fillColor = isToday ? 0x1a4a30 : 0x16213e;
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
    rowBg.width = 310; rowBg.height = 56; rowBg.fillColor = 0x16213e;
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
    progBg.width = 150; progBg.height = 6; progBg.fillColor = 0x0f3460;
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
    rowBg.width = 310; rowBg.height = 44; rowBg.fillColor = 0x16213e;
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
      pBg.fillColor = 0x3d2b1f; pBg.ellipseWidth = 12; pBg.ellipseHeight = 12;
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

      var btn = self.createButton('收下', 0xe74c3c, 100, 36, function() { self.closePanel(); }, self);
      btn.horizontalCenter = 0; btn.top = 165;
      panel.addChild(btn);

      overlay.addChild(panel);
    }, 500);
  } catch(e) {}
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
    var aliveMonsters = self.monsters.filter(function(m) { return m.hp > 0; });
    if (aliveMonsters.length === 0) return;
    var target = aliveMonsters[0];
    var tIdx = 0;
    for (var j = 1; j < aliveMonsters.length; j++) {
      if (aliveMonsters[j].hp > target.hp) { target = aliveMonsters[j]; tIdx = j; }
    }
    tIdx = self.monsters.indexOf(target);
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
      rebirthGems: this.rebirthGems, maxWaveReached: this.maxWaveReached
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
    // 兼容旧存档的 round 字段
    if (d.round && d.round > 1 && !d.maxWaveReached) {
      this.maxWaveReached = (d.round - 1) * 10 + (d.wave || 1);
    }
  } catch(e) {}
};
