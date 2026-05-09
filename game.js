// ==================== 吃饭睡觉打豆豆 - H5原生版 ====================

const CONFIG = {
  maxWave: 10,
  maxEnergy: 100,
  energyRecovery: 2,
  monsterHp: (wave) => Math.floor(100 * Math.pow(wave, 1.2)),
  goldReward: (wave, isBoss) => Math.floor(10 * Math.pow(wave, 1.2) * (isBoss ? 5 : 1)),
  mainDmg: (level) => Math.floor(50 * Math.pow(level, 1.3)),
  upgradeCost: (level) => Math.floor(50 * Math.pow(1.5, level - 1)),
  killsNeeded: (level) => level * 5 + 3
};

const SKILLS = [
  { name: '普攻', cd: 0, dmg: 1, hits: 1, lv: 1 },
  { name: '重击', cd: 5, dmg: 1.5, hits: 1, lv: 2 },
  { name: '连击', cd: 8, dmg: 0.8, hits: 2, lv: 3 },
  { name: '暴击', cd: 15, dmg: 3, hits: 1, lv: 5 },
  { name: '旋风', cd: 20, dmg: 2, hits: 0, lv: 8 },
  { name: '雷霆', cd: 45, dmg: 5, hits: 1, lv: 12 },
  { name: '终极', cd: 90, dmg: 10, hits: 1, lv: 18 }
];

// DPS = 每0.5秒投骰子时投出的伤害值（实际DPS ≈ DPS × 0.6 / 0.5 = DPS × 1.2/秒）
const SUPPORTS = [
  { name: '小毛绒', dps: 30, wave: 0 },
  { name: '棉花糖', dps: 55, wave: 5 },
  { name: '肉丸',   dps: 90, wave: 10 },
  { name: '布丁',   dps: 150, wave: 20 },
  { name: '蛋筒',   dps: 250, wave: 30 },
  { name: '麻薯',   dps: 420, wave: 50 },
  { name: '雪糕',   dps: 700, wave: 75 },
  { name: '甜甜',   dps: 1100, wave: 100 }
];

// 食物系统（堆叠型buff，每购买一个永久生效）
const FOODS = [
  { name: '棒棒糖', icon: '🍭', price: 100,  desc: '暴击+10%，攻速+10%' },
  { name: '牛奶',   icon: '🥛', price: 200,  desc: '攻击+15%' },
  { name: '烤肉',   icon: '🍖', price: 500,  desc: '全属性+20%' }
];

// 转盘奖品
const SPIN_PRIZES = [
  { text: '50金',   type: 'gold', value: 50,   weight: 30 },
  { text: '100金',  type: 'gold', value: 100,  weight: 25 },
  { text: '200金',  type: 'gold', value: 200,  weight: 15 },
  { text: '500金',  type: 'gold', value: 500,  weight: 8 },
  { text: '🍭×1',   type: 'food', value: '棒棒糖', weight: 8 },
  { text: '🥛×1',   type: 'food', value: '牛奶', weight: 6 },
  { text: '20能量', type: 'energy', value: 20, weight: 5 },
  { text: '1000金', type: 'gold', value: 1000, weight: 3 }
];

class Game {
  constructor() {
    this.gold = 0;
    this.energy = 100;
    this.mainLevel = 1;
    this.wave = 1;
    this.round = 1;
    this.totalCleared = 0;
    this.killCount = 0;
    this.skillCD = new Array(7).fill(0);
    this.skillUnlocked = [true, false, false, false, false, false, false];
    this.supports = SUPPORTS.map(s => ({ ...s, level: 1, unlocked: s.wave === 0 }));
    this.monsters = [];
    this.foods = { '棒棒糖': 0, '牛奶': 0, '烤肉': 0 };
    this.freeSpins = 3;
    this.spinDate = new Date().toDateString();
    this.loadGame();
    this.render();
    this.bindEvents();
    this.spawnWave();
    this.startLoop();
  }

  // ---------- 工具方法 ----------

  fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n + '';
  }

  roundText() { return `第${this.round}轮 第${this.wave}波`; }

  totalDps() {
    return CONFIG.mainDmg(this.mainLevel) +
      this.supports.filter(s => s.unlocked).reduce((a, s) => a + s.dps * s.level, 0);
  }

  // 食物buff计算（堆叠型）
  getBuffs() {
    const lollipop = this.foods['棒棒糖'] || 0;
    const milk = this.foods['牛奶'] || 0;
    const meat = this.foods['烤肉'] || 0;
    return {
      critChance: 0.1 + lollipop * 0.1,        // 基础10% + 每个棒棒糖+10%
      attackMult: (1 + milk * 0.15) * (1 + meat * 0.2),  // 攻击倍率
      speedMult: (1 + lollipop * 0.1) * (1 + meat * 0.2), // 攻速倍率（影响能量恢复）
      supportMult: 1 + meat * 0.2                // 辅助角色倍率
    };
  }

  // ---------- 渲染 ----------

  render() {
    const game = document.getElementById('game');
    game.innerHTML = `
      <div class="bar">
        <div class="avatar">头像</div>
        <span>admin</span>
        <div class="wave" id="wave">${this.roundText()}</div>
        <div class="gold">💰 <span id="gold">${this.fmt(this.gold)}</span></div>
      </div>
      <div class="battle" id="battle">
        <div class="supports left">
          ${this.supports.slice(4).map(s =>
            `<div class="support ${s.unlocked ? 'on' : 'off'}">${s.name.slice(0,2)}</div>`
          ).join('')}
        </div>
        <div class="supports right">
          ${this.supports.slice(0, 4).map(s =>
            `<div class="support ${s.unlocked ? 'on' : 'off'}">${s.name.slice(0,2)}</div>`
          ).join('')}
        </div>
        <div id="monsters-area"></div>
        <div class="main-char">
          <span class="label">主角</span>
          <span class="level" id="main-level">Lv.${this.mainLevel}</span>
        </div>
        <div class="dps" id="dps">DPS: ${this.fmt(this.totalDps())}</div>
        <div class="wave-progress">
          <div class="wave-progress-fill" id="wave-fill" style="width:${(this.wave / CONFIG.maxWave) * 100}%"></div>
        </div>
        <div class="energy-bar" id="energy-bar">⚡ ${this.energy}/${CONFIG.maxEnergy}</div>
        <div class="buff-bar" id="buff-bar">${this.renderBuffs()}</div>
        <div id="damage-layer" style="position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden;"></div>
      </div>
      <div class="skills" id="skills">${this.renderSkills()}</div>
      <div class="nav">
        <button onclick="game.openUpgrade()">升级</button>
        <button onclick="game.openSupermarket()">超市</button>
        <button onclick="game.openSpinWheel()">转盘</button>
        <button onclick="game.showToast('功能开发中')">排行</button>
        <button onclick="game.showToast('功能开发中')">商城</button>
      </div>
    `;
    this.renderMonsters();
  }

  renderBuffs() {
    return FOODS.map(f => {
      const count = this.foods[f.name] || 0;
      if (count === 0) return '';
      return `<span class="buff-icon" title="${f.name} ×${count}">${f.icon}${count}</span>`;
    }).join('');
  }

  renderSkills() {
    return SKILLS.map((s, i) => {
      const unlocked = this.mainLevel >= s.lv;
      const cd = this.skillCD[i] > 0;
      return `<div class="skill ${unlocked ? 'active' : ''} ${cd ? 'cd' : ''}" onclick="game.useSkill(${i})">${s.name}${cd ? `(${Math.ceil(this.skillCD[i])}s)` : ''}</div>`;
    }).join('');
  }

  renderMonsters() {
    const area = document.getElementById('monsters-area');
    if (!area) return;
    const w = this.monsters.length;
    area.innerHTML = this.monsters.map((m, i) => {
      const pct = Math.max(0, m.hp / m.maxHp * 100);
      // 水平等分居中，垂直30%位置
      const xPct = (i + 0.5) / w * 100;
      return `<div class="monster ${m.isBoss ? 'boss' : ''}" style="left:${xPct}%;top:25%;transform:translate(-50%,-50%)" onclick="game.hitMonster(${i})">
        <span class="name">${m.isBoss ? 'BOSS' : '豆豆怪'}</span>
        <div class="hp-bar"><div class="hp-fill" style="width:${pct}%"></div></div>
        <div class="hp-text">${Math.max(0, Math.floor(m.hp))}/${m.maxHp}</div>
      </div>`;
    }).join('');
  }

  // ---------- 波次 & 怪物 ----------

  spawnWave() {
    const isBoss = this.wave === CONFIG.maxWave && this.round > 1;
    const count = isBoss ? 1 : (this.wave <= 5 ? 2 : 3);
    const hp = CONFIG.monsterHp(this.wave + (this.round - 1) * CONFIG.maxWave);
    this.monsters = [];
    for (let i = 0; i < count; i++) {
      this.monsters.push({
        hp: isBoss ? hp * 5 : hp,
        maxHp: isBoss ? hp * 5 : hp,
        isBoss
      });
    }
    this.renderMonsters();
  }

  nextWave() {
    this.wave++;
    this.totalCleared++;
    if (this.wave > CONFIG.maxWave) {
      this.wave = 1;
      this.round++;
      this.showToast(`🎉 通关！进入第${this.round}轮`);
    }
    this.checkSupports();
    setTimeout(() => this.spawnWave(), 300);
  }

  // ---------- 战斗逻辑 ----------

  hitMonster(idx) {
    const m = this.monsters[idx];
    if (!m || m.hp <= 0 || this.energy < 1) return;
    this.energy--;
    this.doDamage(m, CONFIG.mainDmg(this.mainLevel), idx);
  }

  doDamage(m, dmg, idx, isCrit = false) {
    const buffs = this.getBuffs();
    dmg = Math.floor(dmg * buffs.attackMult);
    if (!isCrit && Math.random() < buffs.critChance) { dmg *= 2; isCrit = true; }
    m.hp -= dmg;
    this.showDamage(dmg, isCrit, idx);
    if (m.hp <= 0) this.onKill(m, idx);
    this.updateUI();
  }

  showDamage(dmg, isCrit, idx) {
    const layer = document.getElementById('damage-layer');
    if (!layer) return;
    const el = document.createElement('div');
    el.className = 'damage-text' + (isCrit ? ' crit' : '');
    el.textContent = `-${this.fmt(dmg)}${isCrit ? '!' : ''}`;
    const w = this.monsters.length || 1;
    const xPct = ((idx >= 0 ? idx : 0) + 0.5) / w * 100 + (Math.random() * 6 - 3);
    el.style.left = xPct + '%';
    el.style.top = (20 + Math.random() * 15) + '%';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  onKill(m, idx) {
    // 安全检查：防止重复击杀
    if (m.hp > 0) return;
    const realIdx = this.monsters.indexOf(m);
    if (realIdx === -1) return;

    const reward = CONFIG.goldReward(this.wave, m.isBoss);
    this.gold += reward;
    this.energy = Math.min(CONFIG.maxEnergy, this.energy + (m.isBoss ? 10 : 2));
    this.killCount++;
    this.monsters.splice(realIdx, 1);
    if (this.monsters.length === 0) this.nextWave();
    this.checkLevelUp();
  }

  // ---------- 升级 ----------

  checkLevelUp() {
    if (this.killCount >= CONFIG.killsNeeded(this.mainLevel)) {
      this.killCount = 0;
      this.mainLevel++;
      this.showToast(`⬆️ 主角升级！Lv.${this.mainLevel}`);
      SKILLS.forEach((s, i) => {
        if (this.mainLevel >= s.lv && !this.skillUnlocked[i]) {
          this.skillUnlocked[i] = true;
          this.showToast(`🔓【${s.name}】解锁！`);
        }
      });
    }
  }

  checkSupports() {
    this.supports.forEach(s => {
      if (!s.unlocked && this.totalCleared >= s.wave) {
        s.unlocked = true;
        this.showToast(`🌟【${s.name}】加入队伍！`);
      }
    });
  }

  openUpgrade() {
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
      <div class="panel" style="position:relative;">
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        <h3>升级</h3>
        <div class="upgrade-row">
          <div class="char-icon">主角</div>
          <div class="info">主角 Lv.${this.mainLevel}<br>伤害: ${this.fmt(CONFIG.mainDmg(this.mainLevel))}</div>
          <button onclick="game.upgradeMain()" ${this.gold < CONFIG.upgradeCost(this.mainLevel) ? 'disabled' : ''}>${this.fmt(CONFIG.upgradeCost(this.mainLevel))}金</button>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${this.killCount / CONFIG.killsNeeded(this.mainLevel) * 100}%"></div></div>
        <p style="font-size:11px;color:#888;">击杀进度: ${this.killCount}/${CONFIG.killsNeeded(this.mainLevel)}</p>
        ${this.supports.filter(s => s.unlocked).map(s => `
          <div class="upgrade-row">
            <div class="char-icon" style="background:#9b59b6">${s.name.slice(0,2)}</div>
            <div class="info">${s.name} Lv.${s.level}<br>DPS: ${this.fmt(s.dps * s.level)}</div>
            <button onclick="game.upgradeSupport(${SUPPORTS.indexOf(s)})" ${this.gold < CONFIG.upgradeCost(s.level) ? 'disabled' : ''}>${this.fmt(CONFIG.upgradeCost(s.level))}金</button>
          </div>
        `).join('')}
      </div>
    `;
    document.body.appendChild(overlay);
  }

  upgradeMain() {
    const cost = CONFIG.upgradeCost(this.mainLevel);
    if (this.gold < cost) { this.showToast('金币不足！'); return; }
    this.gold -= cost;
    this.mainLevel++;
    this.showToast(`主角升级！Lv.${this.mainLevel}`);
    this.checkLevelUpSkills();
    this.saveGame();
    document.querySelector('.panel-overlay')?.remove();
    this.updateUI();
  }

  checkLevelUpSkills() {
    SKILLS.forEach((s, i) => {
      if (this.mainLevel >= s.lv && !this.skillUnlocked[i]) {
        this.skillUnlocked[i] = true;
        this.showToast(`🔓【${s.name}】解锁！`);
      }
    });
  }

  upgradeSupport(idx) {
    const s = this.supports[idx];
    const cost = CONFIG.upgradeCost(s.level);
    if (this.gold < cost) { this.showToast('金币不足！'); return; }
    this.gold -= cost;
    s.level++;
    this.showToast(`${s.name}升级！Lv.${s.level}`);
    this.saveGame();
    document.querySelector('.panel-overlay')?.remove();
    this.updateUI();
  }

  // ---------- 超市 ----------

  openSupermarket() {
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    const buffs = this.getBuffs();
    overlay.innerHTML = `
      <div class="panel" style="position:relative;">
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        <h3>🛒 超市</h3>
        <div style="font-size:11px;color:#888;margin-bottom:10px;">
          当前buff: 暴击${Math.floor(buffs.critChance*100)}% | 攻击×${buffs.attackMult.toFixed(2)} | 攻速×${buffs.speedMult.toFixed(2)}
        </div>
        ${FOODS.map((f, i) => {
          const count = this.foods[f.name] || 0;
          return `<div class="upgrade-row">
            <div class="char-icon" style="background:#e67e22;font-size:18px;">${f.icon}</div>
            <div class="info">${f.name} ×${count}<br><span style="color:#aaa;font-size:10px;">${f.desc}</span></div>
            <button onclick="game.buyFood(${i})" ${this.gold < f.price ? 'disabled' : ''}>${f.price}金</button>
          </div>`;
        }).join('')}
      </div>
    `;
    document.body.appendChild(overlay);
  }

  buyFood(idx) {
    const f = FOODS[idx];
    if (this.gold < f.price) { this.showToast('金币不足！'); return; }
    this.gold -= f.price;
    this.foods[f.name] = (this.foods[f.name] || 0) + 1;
    this.showToast(`${f.icon} 购买${f.name}成功！`);
    this.saveGame();
    document.querySelector('.panel-overlay')?.remove();
    this.updateUI();
  }

  // ---------- 转盘 ----------

  openSpinWheel() {
    // 检查日期重置
    const today = new Date().toDateString();
    if (this.spinDate !== today) {
      this.freeSpins = 3;
      this.spinDate = today;
    }
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
      <div class="panel" style="position:relative;text-align:center;">
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        <h3>🎡 转盘</h3>
        <p style="color:#aaa;font-size:12px;margin-bottom:12px;">今日免费: ${this.freeSpins}/3 次</p>
        <div id="spin-wheel" class="spin-wheel">
          ${SPIN_PRIZES.map((p, i) => `<div class="spin-segment" style="--i:${i}">${p.text}</div>`).join('')}
          <div class="spin-pointer">▼</div>
        </div>
        <div id="spin-result" style="margin:12px 0;font-size:16px;min-height:30px;"></div>
        <button id="spin-btn" class="spin-btn" onclick="game.spin()" ${this.freeSpins <= 0 ? 'disabled' : ''}>
          ${this.freeSpins > 0 ? '开始抽奖！' : '今日次数已用完'}
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  spin() {
    if (this.freeSpins <= 0) return;
    this.freeSpins--;
    const btn = document.getElementById('spin-btn');
    const result = document.getElementById('spin-result');
    const wheel = document.getElementById('spin-wheel');
    if (btn) { btn.disabled = true; btn.textContent = '抽奖中...'; }

    // 加权随机选择奖品
    const totalWeight = SPIN_PRIZES.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * totalWeight;
    let prize = SPIN_PRIZES[0];
    for (const p of SPIN_PRIZES) {
      r -= p.weight;
      if (r <= 0) { prize = p; break; }
    }

    // 转盘动画
    if (wheel) {
      wheel.classList.remove('spinning');
      void wheel.offsetWidth; // 强制重排
      wheel.classList.add('spinning');
    }

    // 1.5秒后显示结果
    setTimeout(() => {
      if (prize.type === 'gold') {
        this.gold += prize.value;
      } else if (prize.type === 'food') {
        this.foods[prize.value] = (this.foods[prize.value] || 0) + 1;
      } else if (prize.type === 'energy') {
        this.energy = Math.min(CONFIG.maxEnergy, this.energy + prize.value);
      }
      if (result) result.textContent = `🎉 获得: ${prize.text}`;
      this.showToast(`🎡 转盘奖励: ${prize.text}`);
      this.saveGame();
      this.updateUI();
      if (btn) {
        btn.disabled = this.freeSpins <= 0;
        btn.textContent = this.freeSpins > 0 ? `再来一次 (${this.freeSpins})` : '今日次数已用完';
      }
      // 更新免费次数显示
      const info = document.querySelector('.panel p');
      if (info) info.textContent = `今日免费: ${this.freeSpins}/3 次`;
    }, 1500);
  }

  // ---------- 技能 ----------

  useSkill(idx) {
    if (!this.skillUnlocked[idx]) { this.showToast('技能未解锁！'); return; }
    if (this.skillCD[idx] > 0) { this.showToast('冷却中！'); return; }
    if (this.monsters.length === 0) { this.showToast('没有怪物！'); return; }
    if (this.energy < 5) { this.showToast('能量不足！'); return; }
    const s = SKILLS[idx];
    this.energy -= 5;
    this.skillCD[idx] = s.cd;
    const dmg = CONFIG.mainDmg(this.mainLevel) * s.dmg;
    if (s.hits === 0) {
      // 旋风：全体攻击
      this.monsters.slice().forEach((m, i) => this.doDamage(m, dmg, i, true));
    } else {
      for (let i = 0; i < s.hits; i++) {
        if (this.monsters.length === 0) break;
        const mi = Math.floor(Math.random() * this.monsters.length);
        const m = this.monsters[mi];
        if (m) this.doDamage(m, dmg, mi, true);
      }
    }
  }

  // ---------- UI 更新 ----------

  updateUI() {
    const g = document.getElementById('gold');
    const w = document.getElementById('wave');
    const ml = document.getElementById('main-level');
    const d = document.getElementById('dps');
    const eb = document.getElementById('energy-bar');
    const wf = document.getElementById('wave-fill');
    if (g) g.textContent = this.fmt(this.gold);
    if (w) w.textContent = this.roundText();
    if (ml) ml.textContent = `Lv.${this.mainLevel}`;
    if (d) d.textContent = `DPS: ${this.fmt(this.totalDps())}`;
    if (eb) eb.textContent = `⚡ ${this.energy}/${CONFIG.maxEnergy}`;
    if (wf) wf.style.width = `${(this.wave / CONFIG.maxWave) * 100}%`;
    const bb = document.getElementById('buff-bar');
    if (bb) bb.innerHTML = this.renderBuffs();
    this.renderMonsters();
    const sk = document.getElementById('skills');
    if (sk) sk.innerHTML = this.renderSkills();
  }

  // ---------- 事件绑定 ----------

  bindEvents() {
    // 点击战斗区域攻击（排除点击怪物和技能的情况）
    document.getElementById('battle').addEventListener('click', (e) => {
      if (e.target.closest('.monster') || e.target.closest('.skill')) return;
      if (this.monsters.length > 0 && this.energy >= 1) {
        this.energy--;
        const m = this.monsters.reduce((a, b) => a.hp > b.hp ? a : b);
        this.doDamage(m, CONFIG.mainDmg(this.mainLevel), this.monsters.indexOf(m));
      }
    });
    // 空格键攻击
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.monsters.length > 0 && this.energy >= 1) {
          this.energy--;
          const m = this.monsters.reduce((a, b) => a.hp > b.hp ? a : b);
          this.doDamage(m, CONFIG.mainDmg(this.mainLevel), this.monsters.indexOf(m));
        }
      }
    });
    // 页面关闭时存档
    window.addEventListener('beforeunload', () => this.saveGame());

    // 检查离线收益
    this.checkOfflineReward();
  }

  // ---------- 离线收益 ----------

  checkOfflineReward() {
    try {
      const lastTime = parseInt(localStorage.getItem('gujiyouxi_time') || '0');
      if (!lastTime) return;
      const now = Date.now();
      const elapsed = Math.floor((now - lastTime) / 1000); // 秒
      if (elapsed < 60) return; // 少于1分钟不计算
      const maxOffline = 8 * 3600; // 最多8小时
      const seconds = Math.min(elapsed, maxOffline);
      // 离线收益 = 所有角色DPS总和 × 10% × 秒数
      const dps = this.totalDps();
      const reward = Math.floor(dps * 0.1 * seconds);
      if (reward <= 0) return;
      this.gold += reward;
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const timeStr = hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
      // 延迟显示，等页面渲染完
      setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.className = 'panel-overlay';
        overlay.innerHTML = `
          <div class="panel" style="text-align:center;">
            <h3>💤 离线收益</h3>
            <p style="color:#aaa;font-size:12px;margin:8px 0;">你离开了 ${timeStr}</p>
            <p style="font-size:24px;color:#ffd700;margin:16px 0;">+${this.fmt(reward)} 💰</p>
            <p style="font-size:11px;color:#666;">DPS: ${this.fmt(dps)} × 10% × ${seconds}s</p>
            <button class="spin-btn" onclick="this.parentElement.parentElement.remove()" style="margin-top:12px;">收下</button>
          </div>
        `;
        document.body.appendChild(overlay);
      }, 500);
    } catch(e) {}
  }

  // ---------- Toast ----------

  showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  // ---------- 游戏主循环 ----------

  startLoop() {
    // 每秒：能量恢复 + 技能CD
    setInterval(() => {
      this.energy = Math.min(CONFIG.maxEnergy, this.energy + CONFIG.energyRecovery);
      for (let i = 0; i < this.skillCD.length; i++) {
        if (this.skillCD[i] > 0) this.skillCD[i]--;
      }
      this.updateUI();
    }, 1000);

    // 每0.5秒：辅助角色自动攻击（安全迭代）
    setInterval(() => {
      if (this.monsters.length === 0) return;
      // 创建当前怪物快照，避免迭代中修改数组的问题
      const aliveMonsters = this.monsters.filter(m => m.hp > 0);
      if (aliveMonsters.length === 0) return;
      this.supports.forEach(s => {
        if (!s.unlocked || Math.random() < 0.4) return;
        // 找血最多的活着的怪物
        const target = aliveMonsters.reduce((a, b) => a.hp > b.hp ? a : b);
        const dmg = Math.floor(s.dps * s.level * 0.5 * this.getBuffs().supportMult);
        target.hp -= dmg;
        if (target.hp <= 0) this.onKill(target, -1);
      });
      this.renderMonsters();
    }, 500);

    // 每15秒自动存档
    setInterval(() => this.saveGame(), 15000);
  }

  // ---------- 存档 ----------

  saveGame() {
    try {
      localStorage.setItem('gujiyouxi', JSON.stringify({
        gold: this.gold, energy: this.energy, mainLevel: this.mainLevel,
        wave: this.wave, round: this.round, totalCleared: this.totalCleared,
        killCount: this.killCount, skillCD: this.skillCD, skillUnlocked: this.skillUnlocked,
        supports: this.supports.map(s => ({ level: s.level, unlocked: s.unlocked })),
        foods: this.foods, freeSpins: this.freeSpins, spinDate: this.spinDate
      }));
      localStorage.setItem('gujiyouxi_time', Date.now().toString());
    } catch(e) {}
  }

  loadGame() {
    try {
      const d = JSON.parse(localStorage.getItem('gujiyouxi'));
      if (!d) return;
      this.gold = d.gold || 0;
      this.energy = d.energy || 100;
      this.mainLevel = d.mainLevel || 1;
      this.wave = d.wave || 1;
      this.round = d.round || 1;
      this.totalCleared = d.totalCleared || 0;
      this.killCount = d.killCount || 0;
      this.skillCD = d.skillCD || new Array(7).fill(0);
      this.skillUnlocked = d.skillUnlocked || [true, ...new Array(6).fill(false)];
      if (d.supports) d.supports.forEach((s, i) => {
        if (this.supports[i]) {
          this.supports[i].level = s.level;
          this.supports[i].unlocked = s.unlocked;
        }
      });
      if (d.foods) this.foods = { ...this.foods, ...d.foods };
      if (d.freeSpins !== undefined) this.freeSpins = d.freeSpins;
      if (d.spinDate) this.spinDate = d.spinDate;
    } catch(e) {}
  }
}

// 启动游戏
const game = new Game();
