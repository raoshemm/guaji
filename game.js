// ==================== 游戏主逻辑 ====================

class Game {
  constructor() {
    // === 玩家资源 ===
    this.gold = 0;
    this.diamond = 0;
    this.energy = 100;
    this.maxEnergy = 100;

    // === 主角属性 ===
    this.mainLevel = 1;
    this.mainBaseDmg = 50;
    this.mainDmgPerLevel = 0.3;

    // === 杀怪计数（用于升级）===
    this.killCount = 0;
    this.totalKills = 0;
    this.killsForNextLevel = 8;

    // === 波次系统 ===
    this.wave = 1;
    this.maxWave = 10;
    this.totalWaveCount = 0;
    this.totalWavesCleared = 0;

    // === 怪物状态 ===
    this.monsters = [];
    this.baseMonsterHp = 100;
    this.baseGoldReward = 10;
    this.lastGoldReward = 0;

    // === 攻击相关 ===
    this.lastAutoAttack = 0;
    this.autoAttackInterval = 1000;
    this.lastTapAttack = 0;
    this.tapAttackCooldown = 80;
    this.lastSupportAttack = 0;
    this.supportAttackInterval = 500; // 辅助角色攻击间隔

    // === 技能系统 ===
    this.skillLevel = [1, 0, 0, 0, 0, 0, 0];
    this.skillCD = [0, 0, 0, 0, 0, 0, 0];
    this.skillMaxCD = [0, 5, 8, 15, 20, 45, 90];
    this.skillDmg = [1, 1.5, 0.8, 3, 2, 5, 10];
    this.skillHits = [1, 1, 2, 1, 0, 1, 1];

    // === 辅助角色 ===
    this.supports = [
      { name: '小毛绒', dps: 22200, level: 1, unlocked: true, unlockWave: 0 },
      { name: '棉花糖', dps: 18500, level: 1, unlocked: false, unlockWave: 5 },
      { name: '肉丸', dps: 15000, level: 1, unlocked: false, unlockWave: 10 },
      { name: '布丁', dps: 12000, level: 1, unlocked: false, unlockWave: 20 },
      { name: '蛋筒', dps: 9800, level: 1, unlocked: false, unlockWave: 30 },
      { name: '麻薯', dps: 7600, level: 1, unlocked: false, unlockWave: 50 },
      { name: '雪糕', dps: 5500, level: 1, unlocked: false, unlockWave: 75 },
      { name: '甜甜', dps: 3500, level: 1, unlocked: false, unlockWave: 100 }
    ];
    this._supportDps = 0;

    // === 食物背包 ===
    this.foodInventory = { lollipop: 0, milk: 0, meat: 0 };

    // === 转盘 ===
    this.gachaCount = 3;
    this.gachaSpinning = false;

    // === 浮动提示队列 ===
    this.toastQueue = [];
    this.newUnlockedSkill = -1;

    // === 性能优化 ===
    this._lastEnergyTick = 0;
    this._lastSaveTime = 0;
    this._lastSupportAttackTime = 0;
    this._lastAutoAttackTime = 0;
    this._gameLoopId = null;

    this.init();
  }

  init() {
    this.loadGame();
    this.initUI();
    this.initEvents();
    this.spawnWave();
    this.startGameLoop();
    this.startToastLoop();
    this.checkTeamUnlock();
  }

  loadGame() {
    const saved = SaveManager.load();
    if (saved && saved.data) {
      const d = saved.data;
      this.gold = d.gold || 0;
      this.diamond = d.diamond || 0;
      this.energy = d.energy || 100;
      this.mainLevel = d.mainLevel || 1;
      this.totalKills = d.totalKills || 0;
      this.killCount = d.killCount || 0;
      this.wave = d.wave || 1;
      this.totalWavesCleared = d.totalWavesCleared || 0;
      this.skillLevel = d.skillLevel || [1, 0, 0, 0, 0, 0, 0];

      if (d.supports) {
        d.supports.forEach((s, i) => {
          if (this.supports[i]) {
            this.supports[i].level = s.level || 1;
            this.supports[i].unlocked = s.unlocked || this.supports[i].unlocked;
          }
        });
      }

      if (d.foodInventory) this.foodInventory = d.foodInventory;
      this.gachaCount = d.gachaCount !== undefined ? d.gachaCount : 3;

      const offline = SaveManager.getOfflineEarnings({ mainDps: this.getMainDmg() });
      if (offline.gold > 0) {
        this.gold += offline.gold;
        this.showToast(`离线收益: +${this.formatNumber(offline.gold)} 金币`);
      }
    }
    this.calcSupportDps();
    this.updateKillsForNextLevel();
  }

  saveGame() {
    const data = {
      gold: this.gold, diamond: this.diamond, energy: this.energy,
      mainLevel: this.mainLevel, totalKills: this.totalKills, killCount: this.killCount,
      wave: this.wave, totalWavesCleared: this.totalWavesCleared,
      skillLevel: this.skillLevel,
      supports: this.supports.map(s => ({ level: s.level, unlocked: s.unlocked })),
      foodInventory: this.foodInventory, gachaCount: this.gachaCount
    };
    SaveManager.save(data);
  }

  // ==================== UI 更新（批量减少DOM操作）====================
  initUI() {
    this.updateResourceDisplay();
    this.updateWaveDisplay();
    this.updateDpsDisplay();
    this.updateKillProgress();
    this.updateSupportDisplay();
    this.updateMainLevelDisplay();
    this.updateSkillCD();
    this.renderMonsters();
    this.renderSkills();
    this.renderUpgradePanel();
  }

  updateMainLevelDisplay() {
    const lvl = document.getElementById('main-level');
    if (lvl) lvl.textContent = this.mainLevel;
    const upgradeLvl = document.getElementById('upgrade-main-level');
    if (upgradeLvl) upgradeLvl.textContent = this.mainLevel;
    const upgradeDps = document.getElementById('upgrade-main-dps');
    if (upgradeDps) upgradeDps.textContent = this.formatNumber(this.getMainDmg());
  }

  updateResourceDisplay() {
    const ge = document.getElementById('gold-value');
    if (ge) ge.textContent = this.formatNumber(this.gold);
    const de = document.getElementById('shop-diamond');
    if (de) de.textContent = this.formatNumber(this.diamond);
    const me = document.getElementById('my-rank-gold');
    if (me) me.textContent = this.formatNumber(this.gold);
  }

  updateWaveDisplay() {
    const wl = document.getElementById('wave-label');
    if (wl) wl.textContent = `第${this.totalWaveCount + 1}轮 第${this.wave}波`;
  }

  updateDpsDisplay() {
    const totalDps = this.getMainDmg() + this._supportDps;
    const de = document.getElementById('total-dps');
    if (de) de.textContent = this.formatNumber(totalDps);
  }

  updateKillProgress() {
    const fill = document.getElementById('kill-progress-fill');
    const text = document.getElementById('kill-count-text');
    if (fill) fill.style.width = `${(this.killCount / this.killsForNextLevel) * 100}%`;
    if (text) text.textContent = `${this.killCount}/${this.killsForNextLevel}`;
  }

  updateSkillCD() {
    const btns = document.querySelectorAll('.skill-btn');
    const names = ['普攻', '重击', '连击', '暴击', '旋风', '雷霆', '终极'];
    btns.forEach((btn, i) => {
      const cd = this.skillCD[i];
      const overlay = btn.querySelector('.cd-overlay');
      const nameSpan = btn.querySelector('.skill-name');
      if (this.skillLevel[i] === 0) {
        btn.classList.add('locked');
        if (nameSpan) nameSpan.textContent = '🔒';
        if (overlay) overlay.textContent = '';
        return;
      }
      btn.classList.remove('locked');
      if (cd > 0) {
        btn.classList.add('on-cooldown');
        if (overlay) overlay.textContent = Math.ceil(cd) + 's';
        if (nameSpan) nameSpan.textContent = Math.ceil(cd) + 's';
      } else {
        btn.classList.remove('on-cooldown');
        if (nameSpan) nameSpan.textContent = names[i];
        if (overlay) overlay.textContent = '';
      }
    });
  }

  updateSkillButtonsDisplay() {
    const btns = document.querySelectorAll('.skill-btn');
    btns.forEach((btn, i) => {
      if (i === this.newUnlockedSkill) {
        btn.classList.add('skill-unlocked');
        setTimeout(() => btn.classList.remove('skill-unlocked'), 3000);
      }
    });
    this.newUnlockedSkill = -1;
  }

  updateSupportDisplay() {
    this.supports.forEach((s, i) => {
      const sidebarId = i < 4 ? 'support-sidebar-right' : 'support-sidebar-left';
      const localIndex = i < 4 ? i : i - 4;
      const el = document.querySelector(`#${sidebarId} .support-char:nth-child(${localIndex + 1})`);
      if (!el) return;
      const tag = el.querySelector('.char-level-tag');
      if (tag) tag.textContent = s.unlocked ? `${s.level}级` : `波次${s.unlockWave}`;
      const circle = el.querySelector('.char-circle');
      if (circle) {
        circle.style.opacity = s.unlocked ? '1' : '0.3';
        circle.style.filter = s.unlocked ? 'none' : 'grayscale(1)';
      }
    });
  }

  // ==================== 怪物渲染 ====================
  renderMonsters() {
    const container = document.getElementById('monsters-grid');
    if (!container) return;
    container.innerHTML = '';

    this.monsters.forEach((m, i) => {
      const div = document.createElement('div');
      div.className = `monster-item ${m.isBoss ? 'boss' : ''}`;
      div.dataset.index = i;
      const hpPercent = Math.max(0, (m.hp / m.maxHp) * 100);
      div.innerHTML = `
        <div class="monster-name">${m.isBoss ? '💀 BOSS' : '豆豆怪'}</div>
        <div class="monster-hp-bar"><div class="monster-hp-fill" style="width:${hpPercent}%"></div></div>
        <div class="monster-hp-text">${this.formatNumber(Math.max(0, m.hp))} / ${this.formatNumber(m.maxHp)}</div>
      `;
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onMonsterClick(i);
      });
      container.appendChild(div);
    });
  }

  updateMonsterHp(index) {
    const m = this.monsters[index];
    if (!m) return;
    const items = document.querySelectorAll('.monster-item');
    const item = items[index];
    if (!item) return;
    const hpFill = item.querySelector('.monster-hp-fill');
    const hpText = item.querySelector('.monster-hp-text');
    const hpPercent = Math.max(0, (m.hp / m.maxHp) * 100);
    if (hpFill) hpFill.style.width = `${hpPercent}%`;
    if (hpText) hpText.textContent = `${this.formatNumber(Math.max(0, m.hp))} / ${this.formatNumber(m.maxHp)}`;
  }

  // ==================== 技能渲染 ====================
  renderSkills() {
    const container = document.getElementById('skill-buttons');
    if (!container) return;
    container.innerHTML = '';
    const names = ['普攻', '重击', '连击', '暴击', '旋风', '雷霆', '终极'];
    names.forEach((name, i) => {
      const btn = document.createElement('button');
      btn.className = 'skill-btn';
      btn.dataset.index = i;
      btn.innerHTML = `<span class="skill-name">${this.skillLevel[i] > 0 ? name : '🔒'}</span><div class="cd-overlay"></div>`;
      btn.addEventListener('click', () => this.onSkillClick(i));
      container.appendChild(btn);
    });
    this.updateSkillCD();
    this.updateSkillButtonsDisplay();
  }

  // ==================== 升级面板渲染 ====================
  renderUpgradePanel() {
    const mainLvl = document.getElementById('upgrade-main-level');
    const mainDps = document.getElementById('upgrade-main-dps');
    const mainCost = document.getElementById('upgrade-main-cost');
    if (mainLvl) mainLvl.textContent = this.mainLevel;
    if (mainDps) mainDps.textContent = this.formatNumber(this.getMainDmg());
    if (mainCost) mainCost.textContent = this.formatNumber(this.calcUpgradeCost(this.mainLevel));
    const list = document.getElementById('upgrade-list');
    if (!list) return;
    list.innerHTML = '';
    this.supports.forEach((s, i) => {
      if (!s.unlocked) return;
      const cost = this.calcUpgradeCost(s.level);
      const div = document.createElement('div');
      div.className = 'upgrade-char-mini';
      div.innerHTML = `
        <div class="char-circle type-${i < 2 ? 'a' : 'b'}" style="width:30px;height:30px;font-size:9px">${s.name.substring(0,2)}</div>
        <div style="flex:1;font-size:12px">${s.name} <span style="color:#888">Lv.${s.level}</span></div>
        <span style="font-size:10px;color:#f39c12">${this.formatNumber(s.dps * s.level)}/s</span>
        <button class="btn-upgrade-action" data-idx="${i}" style="padding:4px 8px;font-size:10px">${this.formatNumber(cost)}金</button>
      `;
      div.querySelector('.btn-upgrade-action').addEventListener('click', () => this.upgradeSupport(i));
      list.appendChild(div);
    });
  }

  // ==================== 事件绑定 ====================
  initEvents() {
    const battleArea = document.getElementById('battle-area');
    if (battleArea) {
      battleArea.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onBattleClick();
      });
      battleArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.onBattleClick();
      }, { passive: false });
    }

    // 空格键攻击
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.keyCode === 32) {
        e.preventDefault();
        this.onBattleClick();
      }
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.openPanel(btn.dataset.panel));
    });
    document.querySelectorAll('.btn-close').forEach(btn => {
      btn.addEventListener('click', () => this.closePanel(btn.dataset.close));
    });
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', () => this.closeAllPanels());
    document.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', () => this.buyFood(btn.dataset.food));
    });
    const gachaBtn = document.getElementById('btn-gacha');
    if (gachaBtn) gachaBtn.addEventListener('click', () => this.doGacha());
    const mainUpgradeBtn = document.getElementById('btn-upgrade-main');
    if (mainUpgradeBtn) mainUpgradeBtn.addEventListener('click', () => this.upgradeMain());
    window.addEventListener('beforeunload', () => this.saveGame());
  }

  // ==================== 攻击 ====================
  onBattleClick() {
    if (this.monsters.length === 0) return;
    const now = Date.now();
    if (now - this.lastTapAttack < this.tapAttackCooldown) return;
    this.lastTapAttack = now;
    this.doTapAttack();
  }

  onMonsterClick(index) {
    if (this.monsters.length === 0) return;
    const now = Date.now();
    if (now - this.lastTapAttack < this.tapAttackCooldown) return;
    this.lastTapAttack = now;
    this.doTapAttack(index);
  }

  doTapAttack(targetIndex = null) {
    if (this.monsters.length === 0) return;
    let target = this.monsters[0];
    if (targetIndex !== null && this.monsters[targetIndex]) {
      target = this.monsters[targetIndex];
    } else {
      this.monsters.forEach(m => { if (m.hp > target.hp) target = m; });
    }
    const damage = this.getMainDmg();
    const isCrit = Math.random() < 0.1;
    const finalDamage = isCrit ? damage * 2 : damage;
    target.hp = Math.max(0, target.hp - finalDamage);
    this.showDamageText(finalDamage, isCrit, target.isBoss);
    this.energy = Math.max(0, this.energy - 1);
    const idx = this.monsters.indexOf(target);
    if (idx >= 0) this.updateMonsterHp(idx);
    if (target.hp <= 0) this.onMonsterKilled(target, idx);
    this.updateResourceDisplay();
  }

  // ==================== 辅助角色攻击 ====================
  doSupportAttack() {
    if (this.monsters.length === 0) return;
    const now = Date.now();
    if (now - this._lastSupportAttackTime < this.supportAttackInterval) return;
    this._lastSupportAttackTime = now;

    this.supports.forEach(s => {
      if (!s.unlocked) return;
      // 辅助角色每秒约2次攻击
      if (Math.random() < 0.4) return; // 40%几率攻击
      let target = this.monsters[0];
      this.monsters.forEach(m => { if (m.hp > target.hp) target = m; });
      const damage = Math.floor(s.dps * s.level * 0.5);
      target.hp = Math.max(0, target.hp - damage);
      const idx = this.monsters.indexOf(target);
      if (idx >= 0) this.updateMonsterHp(idx);
      if (target.hp <= 0) this.onMonsterKilled(target, idx);
    });
  }

  // ==================== 游戏主循环（统一用requestAnimationFrame）====================
  startGameLoop() {
    let lastFrame = 0;
    const tick = (timestamp) => {
      if (!lastFrame) lastFrame = timestamp;
      const delta = timestamp - lastFrame;
      lastFrame = timestamp;

      // 自动攻击（约1秒1次）
      const now = Date.now();
      if (this.monsters.length > 0 && now - this._lastAutoAttackTime >= this.autoAttackInterval) {
        this._lastAutoAttackTime = now;
        this.autoAttack();
      }

      // 辅助角色攻击（约0.5秒1次）
      if (this.monsters.length > 0) {
        this.doSupportAttack();
      }

      // 技能CD递减
      for (let i = 0; i < this.skillCD.length; i++) {
        if (this.skillCD[i] > 0) this.skillCD[i] = Math.max(0, this.skillCD[i] - delta / 1000);
      }
      this.updateSkillCD();

      // 能量恢复（每0.5秒+1）
      if (this.energy < this.maxEnergy && now - this._lastEnergyTick >= 500) {
        this.energy = Math.min(this.maxEnergy, this.energy + 1);
        this._lastEnergyTick = now;
      }

      // 自动存档（每15秒）
      if (now - this._lastSaveTime >= 15000) {
        this.saveGame();
        this._lastSaveTime = now;
      }

      this._gameLoopId = requestAnimationFrame(tick);
    };
    this._gameLoopId = requestAnimationFrame(tick);
  }

  autoAttack() {
    if (this.monsters.length === 0) return;
    let target = this.monsters[0];
    this.monsters.forEach(m => { if (m.hp > target.hp) target = m; });
    const damage = this.getMainDmg();
    const isCrit = Math.random() < 0.05;
    const finalDamage = isCrit ? damage * 2 : damage;
    target.hp = Math.max(0, target.hp - finalDamage);
    if (isCrit) this.showDamageText(finalDamage, true, target.isBoss);
    const idx = this.monsters.indexOf(target);
    if (idx >= 0) this.updateMonsterHp(idx);
    if (target.hp <= 0) this.onMonsterKilled(target, idx);
  }

  // ==================== 怪物击杀 ====================
  onMonsterKilled(monster, index) {
    const goldReward = Math.floor(this.baseGoldReward * Math.pow(this.wave, 1.2) * (monster.isBoss ? 5 : 1));
    this.gold += goldReward;
    this.lastGoldReward = goldReward;
    this.energy = Math.min(this.maxEnergy, this.energy + 2);
    this.killCount++;
    this.totalKills++;
    this.checkLevelUp();
    this.monsters.splice(index, 1);
    if (this.monsters.length === 0) {
      this.onWaveComplete();
    }
    this.renderMonsters();
    this.updateResourceDisplay();
    this.updateKillProgress();
  }

  onWaveComplete() {
    this.totalWavesCleared++;
    const waveGold = Math.floor(this.baseGoldReward * Math.pow(this.wave, 1.2) * (this.wave === this.maxWave ? 5 : 1));
    this.showToast(`通关第${this.wave}波！+${waveGold}金`);
    if (this.wave >= this.maxWave) {
      this.wave = 1;
      this.totalWaveCount++;
      this.showToast('🎉 一轮结束！新一轮开始！');
    } else {
      this.wave++;
    }
    this.checkTeamUnlock();
    this.spawnWave();
    this.updateWaveDisplay();
  }

  spawnWave() {
    this.monsters = [];
    const isBoss = this.wave === this.maxWave;
    let count = 2;
    if (this.wave >= 6 && this.wave <= 9) count = 3;
    else if (this.wave >= 11 && this.wave <= 15) count = 3;
    else if (this.wave >= 16 && this.wave <= 19) count = 4;
    if (isBoss) count = 1;
    const hp = Math.floor(this.baseMonsterHp * Math.pow(this.wave, 1.2));
    for (let i = 0; i < count; i++) {
      this.monsters.push({ hp, maxHp: hp, isBoss, wave: this.wave });
    }
    this.renderMonsters();
    this.updateWaveDisplay();
    if (isBoss) this.showToast('💀 BOSS出现！');
  }

  // ==================== 升级 ====================
  updateKillsForNextLevel() {
    this.killsForNextLevel = this.mainLevel * 5 + 3;
  }

  checkLevelUp() {
    if (this.killCount >= this.killsForNextLevel) {
      this.killCount = 0;
      this.mainLevel++;
      this.updateKillsForNextLevel();
      this.checkSkillUnlock();
      this.showToast(`⬆️ 升级！Lv.${this.mainLevel}`);
      this.updateMainLevelDisplay();
      this.updateKillProgress();
      this.renderSkills();
      this.checkTeamUnlock();
      this.saveGame();
    }
  }

  checkSkillUnlock() {
    const skillUnlockLevels = [0, 2, 3, 5, 8, 12, 18];
    const names = ['普攻', '重击', '连击', '暴击', '旋风', '雷霆', '终极'];
    skillUnlockLevels.forEach((unlockLv, i) => {
      if (i === 0) return;
      if (this.mainLevel >= unlockLv && this.skillLevel[i] === 0) {
        this.skillLevel[i] = 1;
        this.newUnlockedSkill = i;
        this.showToast(`🔓 【${names[i]}】解锁！`);
        this.renderSkills();
      }
    });
  }

  upgradeMain() {
    const cost = this.calcUpgradeCost(this.mainLevel);
    if (this.gold < cost) { this.showToast('金币不足！'); return; }
    this.gold -= cost;
    this.mainLevel++;
    this.updateKillsForNextLevel();
    this.checkTeamUnlock();
    this.checkSkillUnlock();
    this.updateMainLevelDisplay();
    this.renderSkills();
    this.saveGame();
    this.showToast(`升级成功！现在是 Lv.${this.mainLevel}`);
  }

  calcUpgradeCost(level) {
    return Math.floor(50 * Math.pow(1.5, level - 1));
  }

  upgradeSupport(index) {
    const s = this.supports[index];
    const cost = this.calcUpgradeCost(s.level);
    if (this.gold < cost) { this.showToast('金币不足！'); return; }
    this.gold -= cost;
    s.level++;
    this.calcSupportDps();
    this.updateDpsDisplay();
    this.renderUpgradePanel();
    this.saveGame();
    this.showToast(`${s.name} 升级！DPS: ${this.formatNumber(s.dps * s.level)}`);
  }

  getMainDmg() {
    return Math.floor(this.mainBaseDmg * Math.pow(this.mainLevel, this.mainDmgPerLevel));
  }

  calcSupportDps() {
    this._supportDps = 0;
    this.supports.forEach(s => {
      if (s.unlocked) this._supportDps += s.dps * s.level;
    });
  }

  // ==================== 技能 ====================
  onSkillClick(index) {
    if (this.skillLevel[index] === 0) { this.showToast('技能未解锁！'); return; }
    if (this.skillCD[index] > 0) { this.showToast('冷却中！'); return; }
    if (this.monsters.length === 0) { this.showToast('没有怪物！'); return; }
    if (this.energy < 10) { this.showToast('能量不足！'); return; }
    this.energy -= 10;
    this.skillCD[index] = this.skillMaxCD[index];
    const hits = this.skillHits[index];
    const dmgMult = this.skillDmg[index];
    const names = ['普攻', '重击', '连击', '暴击', '旋风', '雷霆', '终极'];
    if (hits > 1) {
      for (let h = 0; h < hits; h++) {
        setTimeout(() => { this.applySkillDamage(dmgMult, index); }, h * 200);
      }
    } else {
      this.applySkillDamage(dmgMult, index);
    }
    this.showToast(`⚔️ 【${names[index]}】！`);
  }

  applySkillDamage(dmgMult, skillIndex) {
    if (this.monsters.length === 0) return;
    const damage = Math.floor(this.getMainDmg() * dmgMult);
    if (skillIndex === 4) {
      this.monsters.forEach((m, i) => {
        m.hp = Math.max(0, m.hp - damage);
        this.updateMonsterHp(i);
        if (m.hp <= 0) this.onMonsterKilled(m, i);
      });
    } else {
      let target = this.monsters[0];
      this.monsters.forEach(m => { if (m.hp > target.hp) target = m; });
      const idx = this.monsters.indexOf(target);
      target.hp = Math.max(0, target.hp - damage);
      this.showDamageText(damage, true, target.isBoss);
      this.updateMonsterHp(idx);
      if (target.hp <= 0) this.onMonsterKilled(target, idx);
    }
    this.renderMonsters();
  }

  // ==================== 特效 ====================
  showDamageText(damage, isCrit, isBoss) {
    const container = document.getElementById('damage-texts');
    if (!container) return;
    const text = document.createElement('div');
    text.className = `damage-text ${isCrit ? 'crit' : ''}`;
    text.textContent = `-${this.formatNumber(damage)}${isCrit ? '!' : ''}`;
    text.style.left = `${25 + Math.random() * 50}%`;
    text.style.top = `${25 + Math.random() * 20}%`;
    container.appendChild(text);
    setTimeout(() => text.remove(), 800);
  }

  // ==================== 浮动提示 ====================
  showToast(msg) {
    if (this.toastQueue.length < 3) this.toastQueue.push(msg);
  }

  startToastLoop() {
    const showNext = () => {
      if (this.toastQueue.length === 0) { setTimeout(showNext, 500); return; }
      const msg = this.toastQueue.shift();
      this.displayToast(msg);
      setTimeout(showNext, 2500);
    };
    setTimeout(showNext, 500);
  }

  displayToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:300;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;width:90%;max-width:350px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = 'background:rgba(22,33,62,0.95);color:#fff;padding:10px 16px;border-radius:20px;font-size:13px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:1px solid #0f3460;animation:toastIn 0.3s ease';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // ==================== 超市/转盘/面板 ====================
  buyFood(foodKey) {
    const prices = { lollipop: 100, milk: 200, meat: 500 };
    const names = { lollipop: '棒棒糖', milk: '牛奶', meat: '烤肉' };
    const price = prices[foodKey];
    if (!price) return;
    if (this.gold < price) { this.showToast('金币不足！'); return; }
    this.gold -= price;
    this.foodInventory[foodKey] = (this.foodInventory[foodKey] || 0) + 1;
    this.showToast(`购买了 ${names[foodKey]}！`);
    this.updateResourceDisplay();
    this.saveGame();
  }

  doGacha() {
    if (this.gachaCount <= 0) { this.showToast('免费次数已用完！'); return; }
    if (this.gachaSpinning) return;
    this.gachaSpinning = true;
    const rewards = [
      { name: '100金币', type: 'gold', value: 100 },
      { name: '200金币', type: 'gold', value: 200 },
      { name: '50钻石', type: 'diamond', value: 50 },
      { name: '300金币', type: 'gold', value: 300 },
      { name: '棒棒糖', type: 'food', value: 1 },
      { name: '500金币', type: 'gold', value: 500 }
    ];
    const selected = rewards[Math.floor(Math.random() * rewards.length)];
    const wheel = document.getElementById('gacha-wheel');
    if (wheel) {
      wheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      wheel.style.transform = `rotate(${1800 + Math.random() * 360}deg)`;
      setTimeout(() => {
        this.gachaCount--;
        if (selected.type === 'gold') this.gold += selected.value;
        else if (selected.type === 'diamond') this.diamond += selected.value;
        else if (selected.type === 'food') this.foodInventory.lollipop += selected.value;
        this.showToast(`🎉 获得：${selected.name}！`);
        this.updateResourceDisplay();
        const cntEl = document.getElementById('gacha-count');
        if (cntEl) cntEl.textContent = this.gachaCount;
        wheel.style.transition = 'none';
        wheel.style.transform = 'rotate(0deg)';
        this.gachaSpinning = false;
        this.saveGame();
      }, 3100);
    }
  }

  openPanel(name) {
    const panel = document.getElementById(`panel-${name}`);
    const overlay = document.getElementById('overlay');
    if (panel) { panel.style.display = 'flex'; if (overlay) overlay.style.display = 'block'; }
    if (name === 'upgrade') this.renderUpgradePanel();
  }

  closePanel(name) {
    const panel = document.getElementById(`panel-${name}`);
    if (panel) panel.style.display = 'none';
    this.checkOverlay();
  }

  closeAllPanels() {
    document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';
  }

  checkOverlay() {
    const anyOpen = [...document.querySelectorAll('.panel')].some(p => p.style.display !== 'none');
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = anyOpen ? 'block' : 'none';
  }

  // ==================== 辅助角色解锁 ====================
  checkTeamUnlock() {
    let unlocked = false;
    this.supports.forEach(s => {
      if (!s.unlocked && this.totalWavesCleared >= s.unlockWave) {
        s.unlocked = true;
        unlocked = true;
        this.showToast(`🌟 【${s.name}】加入队伍！`);
      }
    });
    if (unlocked) {
      this.calcSupportDps();
      this.updateSupportDisplay();
      this.updateDpsDisplay();
      this.renderUpgradePanel();
    }
  }

  // ==================== 工具 ====================
  formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return Math.floor(n).toString();
  }
}

// ==================== 启动 ====================
let game;
document.addEventListener('DOMContentLoaded', () => {
  game = new Game();
  window.game = game;
});
if (typeof window !== 'undefined') window.Game = Game;