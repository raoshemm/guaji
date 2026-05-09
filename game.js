// ==================== 游戏主逻辑 - Phaser 版本 ====================

// 数值配置
const CONFIG = {
  baseMonsterHp: 100,
  baseGoldReward: 10,
  mainBaseDmg: 50,
  mainDmgPerLevel: 1.3,
  maxWave: 10,
  maxEnergy: 100,
  energyPerAttack: 1,
  energyRecovery: 2,
  bossEnergyBonus: 10,
  upgradesForNextLevel: (level) => level * 5 + 3,
  upgradeCost: (level) => Math.floor(50 * Math.pow(1.5, level - 1)),
  monsterHp: (wave) => Math.floor(100 * Math.pow(wave, 1.2)),
  goldReward: (wave, isBoss) => Math.floor(10 * Math.pow(wave, 1.2) * (isBoss ? 5 : 1)),
  mainDmg: (level) => Math.floor(50 * Math.pow(level, 1.3))
};

// 技能配置
const SKILLS = [
  { name: '普攻', cd: 0, dmg: 1, hits: 1, unlockLevel: 1 },
  { name: '重击', cd: 5, dmg: 1.5, hits: 1, unlockLevel: 2 },
  { name: '连击', cd: 8, dmg: 0.8, hits: 2, unlockLevel: 3 },
  { name: '暴击', cd: 15, dmg: 3, hits: 1, unlockLevel: 5 },
  { name: '旋风', cd: 20, dmg: 2, hits: 0, unlockLevel: 8 },
  { name: '雷霆', cd: 45, dmg: 5, hits: 1, unlockLevel: 12 },
  { name: '终极', cd: 90, dmg: 10, hits: 1, unlockLevel: 18 }
];

// 辅助角色配置
const SUPPORTS = [
  { name: '小毛绒', dps: 22200, unlockWave: 0 },
  { name: '棉花糖', dps: 18500, unlockWave: 5 },
  { name: '肉丸', dps: 15000, unlockWave: 10 },
  { name: '布丁', dps: 12000, unlockWave: 20 },
  { name: '蛋筒', dps: 9800, unlockWave: 30 },
  { name: '麻薯', dps: 7600, unlockWave: 50 },
  { name: '雪糕', dps: 5500, unlockWave: 75 },
  { name: '甜甜', dps: 3500, unlockWave: 100 }
];

// ==================== 游戏场景 ====================
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // 游戏状态
    this.gold = 0;
    this.diamond = 0;
    this.energy = 100;
    this.mainLevel = 1;
    this.wave = 1;
    this.totalWaveCount = 0;
    this.totalWavesCleared = 0;
    this.killCount = 0;
    this.totalKills = 0;
    this.gachaCount = 3;
    this.skillCD = [0, 0, 0, 0, 0, 0, 0];
    this.skillLevel = [1, 0, 0, 0, 0, 0, 0];
    this.toastQueue = [];

    // 辅助角色
    this.supports = SUPPORTS.map(s => ({
      ...s,
      level: 1,
      unlocked: s.unlockWave === 0
    }));

    this.monsters = [];

    // 加载存档
    this.loadGame();

    // 创建UI
    this.createUI();

    // 绑定事件
    this.input.on('pointerdown', this.onAttack, this);
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.keyCode === 32) {
        e.preventDefault();
        this.onAttack();
      }
    });

    // 生成波次
    this.spawnWave();

    // 启动定时器
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecondTick,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 500,
      callback: this.onSupportAttack,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.onAutoAttack,
      callbackScope: this,
      loop: true
    });

    // 启动Toast循环
    this.time.addEvent({
      delay: 500,
      callback: this.showNextToast,
      callbackScope: this,
      loop: true
    });

    // 每15秒存档
    this.time.addEvent({
      delay: 15000,
      callback: this.saveGame,
      callbackScope: this,
      loop: true
    });
  }

  createUI() {
    const w = 500;

    // 顶部状态栏
    const topBar = this.add.graphics()
      .fillStyle(0x16213e, 1)
      .fillRect(0, 0, w, 60)
      .setDepth(10);

    // 用户头像
    this.add.rectangle(50, 30, 40, 40, 0x3498db).setDepth(11);
    this.add.text(35, 20, '微信', { fontSize: '10px', color: '#fff' }).setDepth(12);
    this.add.text(35, 32, '头像', { fontSize: '10px', color: '#fff' }).setDepth(12);

    // VIP标签
    this.add.rectangle(90, 15, 40, 18, 0xf39c12).setDepth(11);
    this.add.text(72, 10, 'VIP0', { fontSize: '10px', color: '#fff' }).setDepth(12);

    // 用户名
    this.add.text(10, 42, 'admin', { fontSize: '12px', color: '#fff' }).setDepth(11);

    // 波次显示
    this.waveLabel = this.add.text(w / 2, 30, '第1轮 第1波', {
      fontSize: '16px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(11);

    // 金币显示
    this.goldIcon = this.add.rectangle(w - 100, 30, 24, 24, 0xffd700).setDepth(11);
    this.goldLabel = this.add.text(w - 120, 20, '0', {
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setDepth(11);

    // 战斗区域背景
    const battleBg = this.add.rectangle(w / 2, 200, w, 250, 0x1a1a2e).setDepth(1);

    // 怪物显示区域
    this.monsterContainer = this.add.container(0, 0).setDepth(5);

    // 主角显示
    this.mainCharBg = this.add.circle(w / 2, 280, 35, 0x3498db).setDepth(2);
    this.mainCharLabel = this.add.text(w / 2, 270, '主角', { fontSize: '14px', color: '#fff' }).setOrigin(0.5).setDepth(3);
    this.mainLevelLabel = this.add.text(w / 2, 285, 'Lv.1', { fontSize: '12px', color: '#ccc' }).setOrigin(0.5).setDepth(3);

    // DPS显示
    this.dpsLabel = this.add.text(w / 2, 330, 'DPS 0', {
      fontSize: '14px',
      color: '#888'
    }).setOrigin(0.5).setDepth(2);

    // 辅助角色（左侧）
    this.supports.forEach((s, i) => {
      if (i < 4) {
        s.display = this.add.container(20, 180 + i * 50).setDepth(3);
      } else {
        s.display = this.add.container(w - 50, 180 + (i - 4) * 50).setDepth(3);
      }

      const color = s.unlocked ? 0x9b59b6 : 0x555555;
      const circle = this.add.circle(0, 0, 18, color).setDepth(3);
      const nameText = this.add.text(0, 0, s.name.substring(0, 2), {
        fontSize: '9px',
        color: '#fff'
      }).setOrigin(0.5).setDepth(4);
      const levelText = this.add.text(0, 20, s.unlocked ? `1级` : '未解锁', {
        fontSize: '8px',
        color: '#888'
      }).setOrigin(0.5).setDepth(4);

      s.display.add([circle, nameText, levelText]);
    });

    // 技能栏背景
    const skillBg = this.add.graphics()
      .fillStyle(0x16213e, 1)
      .fillRect(0, 380, w, 50)
      .setDepth(10);

    // 技能按钮
    this.skillBtns = [];
    const skillStartX = 50;
    const skillSpacing = 60;

    SKILLS.forEach((skill, i) => {
      const x = skillStartX + i * skillSpacing;
      const btn = this.add.container(x, 405).setDepth(11);

      // 技能背景
      const bg = this.add.circle(0, 0, 22, i === 0 ? 0x27ae60 : 0x555555).setDepth(11);
      btn.add(bg);

      // 技能名称
      const text = this.add.text(0, 0, skill.name, {
        fontSize: '10px',
        color: '#fff'
      }).setOrigin(0.5).setDepth(12);
      btn.add(text);

      // CD遮罩
      const cdOverlay = this.add.circle(0, 0, 22, 0x000000, 0.7).setDepth(13);
      cdOverlay.setVisible(false);
      btn.add(cdOverlay);
      btn.cdOverlay = cdOverlay;

      // 设为可点击
      btn.setSize(44, 44);
      btn.setInteractive();
      btn.on('pointerdown', () => this.onSkillClick(i));

      this.skillBtns.push(btn);
    });

    // 底部导航栏
    const navBg = this.add.graphics()
      .fillStyle(0x16213e, 1)
      .fillRect(0, 430, w, 50)
      .setDepth(10);

    const navItems = ['升级', '超市', '转盘', '排行', '商城'];
    navItems.forEach((item, i) => {
      const x = 50 + i * 90;
      const btn = this.add.container(x, 455).setDepth(11);
      const bg = this.add.roundRect(-35, -18, 70, 36, 8, 0x0f3460).setDepth(11);
      const text = this.add.text(0, 0, item, {
        fontSize: '12px',
        color: '#fff'
      }).setOrigin(0.5).setDepth(12);
      btn.add([bg, text]);

      btn.setSize(70, 36);
      btn.setInteractive();
      btn.on('pointerdown', () => this.openPanel(item));
    });

    // 伤害文字容器
    this.damageTextContainer = this.add.container(0, 0).setDepth(100);

    // Toast容器
    this.toastContainer = this.add.container(w / 2, 70).setDepth(200);
  }

  // ==================== 攻击 ====================
  onAttack() {
    if (this.monsters.length === 0) return;
    if (this.energy < 1) {
      this.showToast('能量不足！');
      return;
    }

    this.energy -= 1;
    this.doAttack();
    this.updateUI();
  }

  onAutoAttack() {
    if (this.monsters.length === 0) return;
    this.doAttack();
  }

  doAttack(targetIndex = null) {
    if (this.monsters.length === 0) return;

    let target = this.monsters[0];
    if (targetIndex !== null && this.monsters[targetIndex]) {
      target = this.monsters[targetIndex];
    } else {
      this.monsters.forEach(m => {
        if (m.hp > target.hp) target = m;
      });
    }

    const damage = CONFIG.mainDmg(this.mainLevel);
    const isCrit = Math.random() < 0.1;
    const finalDamage = isCrit ? damage * 2 : damage;

    target.hp -= finalDamage;
    this.showDamageText(finalDamage, isCrit, target.container.x, target.container.y);

    if (target.hp <= 0) {
      this.onMonsterKilled(target);
    }

    this.updateMonsterDisplay();
  }

  onSupportAttack() {
    if (this.monsters.length === 0) return;

    this.supports.forEach(s => {
      if (!s.unlocked) return;
      if (Math.random() < 0.4) return;

      let target = this.monsters[0];
      this.monsters.forEach(m => {
        if (m.hp > target.hp) target = m;
      });

      const damage = Math.floor(s.dps * s.level * 0.5);
      target.hp -= damage;

      if (target.hp <= 0) {
        this.onMonsterKilled(target);
      }
    });

    this.updateMonsterDisplay();
  }

  onMonsterKilled(monster) {
    const goldReward = CONFIG.goldReward(this.wave, monster.isBoss);
    this.gold += goldReward;
    this.energy = Math.min(CONFIG.maxEnergy, this.energy + 2);
    if (monster.isBoss) this.energy = Math.min(CONFIG.maxEnergy, this.energy + 10);

    this.killCount++;
    this.totalKills++;
    this.checkLevelUp();

    // 移除怪物
    const idx = this.monsters.indexOf(monster);
    if (idx >= 0) {
      this.monsters.splice(idx, 1);
      monster.container.destroy();
    }

    if (this.monsters.length === 0) {
      this.onWaveComplete();
    }

    this.updateUI();
  }

  onSkillClick(index) {
    if (this.skillLevel[index] === 0) {
      this.showToast('技能未解锁！');
      return;
    }
    if (this.skillCD[index] > 0) {
      this.showToast('冷却中！');
      return;
    }
    if (this.monsters.length === 0) {
      this.showToast('没有怪物！');
      return;
    }
    if (this.energy < 10) {
      this.showToast('能量不足！');
      return;
    }

    this.energy -= 10;
    this.skillCD[index] = SKILLS[index].cd;

    const skill = SKILLS[index];
    const dmg = CONFIG.mainDmg(this.mainLevel) * skill.dmg;

    if (skill.hits === 0) {
      // 全体攻击
      this.monsters.forEach(m => {
        m.hp -= dmg;
        this.showDamageText(dmg, true, m.container.x, m.container.y);
        if (m.hp <= 0) this.onMonsterKilled(m);
      });
    } else {
      for (let i = 0; i < skill.hits; i++) {
        let target = this.monsters[Math.floor(Math.random() * this.monsters.length)];
        target.hp -= dmg;
        this.showDamageText(dmg, true, target.container.x, target.container.y);
        if (target.hp <= 0) this.onMonsterKilled(target);
        if (this.monsters.length === 0) break;
      }
    }

    this.updateMonsterDisplay();
    this.updateUI();
  }

  // ==================== 波次系统 ====================
  spawnWave() {
    const isBoss = this.wave === 10 && this.totalWaveCount > 0;
    const monsterCount = isBoss ? 1 : (this.wave <= 5 ? 2 : (this.wave <= 9 ? 3 : 4));
    const hp = CONFIG.monsterHp(this.wave);

    if (isBoss) {
      this.showToast('💀 BOSS出现！');
    }

    const positions = this.getMonsterPositions(monsterCount);

    for (let i = 0; i < monsterCount; i++) {
      const monster = {
        hp: isBoss ? hp * 5 : hp,
        maxHp: isBoss ? hp * 5 : hp,
        isBoss: isBoss,
        container: this.monsterContainer
      };

      const container = this.add.container(positions[i].x, positions[i].y).setDepth(5);
      monster.container = container;

      // 怪物背景
      const bg = this.add.circle(0, 0, 28, isBoss ? 0xe74c3c : 0xff6666).setDepth(5);
      container.add(bg);

      // 怪物名称
      const name = this.add.text(0, -5, '豆豆怪', {
        fontSize: '12px',
        color: '#fff'
      }).setOrigin(0.5).setDepth(6);
      container.add(name);

      // 血量条背景
      const hpBg = this.add.rectangle(0, 15, 56, 8, 0x333333).setDepth(6);
      container.add(hpBg);

      // 血量条
      const hpBar = this.add.rectangle(-28, 15, 56, 8, 0x2ecc71).setDepth(7);
      hpBar.setOrigin(0, 0.5);
      container.add(hpBar);
      monster.hpBar = hpBar;

      // 血量文字
      const hpText = this.add.text(0, 25, `${monster.hp}/${monster.maxHp}`, {
        fontSize: '10px',
        color: '#ccc'
      }).setOrigin(0.5).setDepth(6);
      container.add(hpText);
      monster.hpText = hpText;

      // 点击事件
      container.setSize(56, 56);
      container.setInteractive();
      container.on('pointerdown', () => {
        if (this.energy >= 1) {
          this.energy -= 1;
          this.doAttack(this.monsters.indexOf(monster));
          this.updateUI();
        }
      });

      this.monsters.push(monster);
    }
  }

  getMonsterPositions(count) {
    const centerX = 250;
    const startY = 120;
    const positions = [];

    if (count === 1) {
      positions.push({ x: centerX, y: startY + 30 });
    } else if (count === 2) {
      positions.push({ x: centerX - 80, y: startY + 30 });
      positions.push({ x: centerX + 80, y: startY + 30 });
    } else if (count === 3) {
      positions.push({ x: centerX, y: startY });
      positions.push({ x: centerX - 80, y: startY + 50 });
      positions.push({ x: centerX + 80, y: startY + 50 });
    } else {
      positions.push({ x: centerX - 100, y: startY });
      positions.push({ x: centerX + 100, y: startY });
      positions.push({ x: centerX - 60, y: startY + 50 });
      positions.push({ x: centerX + 60, y: startY + 50 });
    }

    return positions;
  }

  onWaveComplete() {
    this.wave++;
    this.totalWavesCleared++;

    if (this.wave > CONFIG.maxWave) {
      this.wave = 1;
      this.totalWaveCount++;
      this.showToast(`🎉 通关！进入第${this.totalWaveCount + 1}轮`);
    }

    this.checkTeamUnlock();
    this.updateUI();
    this.spawnWave();
  }

  // ==================== 升级 ====================
  checkLevelUp() {
    const needed = CONFIG.upgradesForNextLevel(this.mainLevel);
    if (this.killCount >= needed) {
      this.killCount = 0;
      this.mainLevel++;
      this.showToast(`⬆️ 升级成功！现在是 Lv.${this.mainLevel}`);
      this.checkSkillUnlock();
      this.checkTeamUnlock();
    }
  }

  checkSkillUnlock() {
    SKILLS.forEach((skill, i) => {
      if (i > 0 && this.mainLevel >= skill.unlockLevel && this.skillLevel[i] === 0) {
        this.skillLevel[i] = 1;
        this.showToast(`🔓【${skill.name}】解锁！`);
        this.skillBtns[i].getAt(0).setFillStyle(0x27ae60);
      }
    });
  }

  checkTeamUnlock() {
    this.supports.forEach((s, i) => {
      if (!s.unlocked && this.totalWavesCleared >= s.unlockWave) {
        s.unlocked = true;
        this.showToast(`🌟【${s.name}】加入队伍！`);
        this.updateSupportDisplay(i);
      }
    });
  }

  upgradeMain() {
    const cost = CONFIG.upgradeCost(this.mainLevel);
    if (this.gold < cost) {
      this.showToast('金币不足！');
      return;
    }
    this.gold -= cost;
    this.mainLevel++;
    this.killCount = 0;
    this.checkSkillUnlock();
    this.checkTeamUnlock();
    this.showToast(`升级成功！现在是 Lv.${this.mainLevel}`);
    this.updateUI();
    this.saveGame();
  }

  upgradeSupport(index) {
    const s = this.supports[index];
    const cost = CONFIG.upgradeCost(s.level);
    if (this.gold < cost) {
      this.showToast('金币不足！');
      return;
    }
    this.gold -= cost;
    s.level++;
    this.showToast(`${s.name} 升级！`);
    this.updateUI();
    this.saveGame();
  }

  // ==================== UI更新 ====================
  updateUI() {
    this.goldLabel.setText(this.formatNumber(this.gold));
    this.waveLabel.setText(`第${this.totalWaveCount + 1}轮 第${this.wave}波`);
    this.mainLevelLabel.setText(`Lv.${this.mainLevel}`);

    const totalDps = CONFIG.mainDmg(this.mainLevel) + this.getSupportDps();
    this.dpsLabel.setText(`DPS ${this.formatNumber(totalDps)}`);

    this.updateSkillCD();
  }

  updateMonsterDisplay() {
    this.monsters.forEach(m => {
      const hpPercent = Math.max(0, m.hp / m.maxHp);
      m.hpBar.setDisplaySize(56 * hpPercent, 8);
      m.hpText.setText(`${Math.max(0, Math.floor(m.hp))}/${m.maxHp}`);
    });
  }

  updateSkillCD() {
    this.skillBtns.forEach((btn, i) => {
      if (this.skillCD[i] > 0) {
        btn.cdOverlay.setVisible(true);
        btn.cdOverlay.setAlpha(0.5);
      } else {
        btn.cdOverlay.setVisible(false);
      }
    });
  }

  updateSupportDisplay(index) {
    const s = this.supports[index];
    s.display.getAt(0).setFillStyle(s.unlocked ? 0x9b59b6 : 0x555555);
    s.display.getAt(2).setText(s.unlocked ? `${s.level}级` : '未解锁');
  }

  // ==================== 特效 ====================
  showDamageText(damage, isCrit, x, y) {
    const text = this.add.text(x, y, `-${this.formatNumber(damage)}${isCrit ? '!' : ''}`, {
      fontSize: isCrit ? '24px' : '18px',
      color: isCrit ? '#ff0' : '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(101);

    this.tweens.add({
      targets: text,
      y: y - 60,
      alpha: 0,
      duration: 800,
      onComplete: () => text.destroy()
    });
  }

  showToast(msg) {
    if (this.toastQueue.length < 3) {
      this.toastQueue.push(msg);
    }
  }

  showNextToast() {
    if (this.toastQueue.length === 0) return;
    const msg = this.toastQueue.shift();

    const bg = this.add.rectangle(0, 0, 200, 40, 0x000000, 0.8).setOrigin(0.5);
    const text = this.add.text(0, 0, msg, {
      fontSize: '14px',
      color: '#fff'
    }).setOrigin(0.5);

    const toast = this.add.container(250, 70, [bg, text]).setDepth(201);

    this.tweens.add({
      targets: toast,
      y: 50,
      alpha: 0,
      duration: 2000,
      onComplete: () => toast.destroy()
    });
  }

  // ==================== 定时事件 ====================
  onSecondTick() {
    // 能量恢复
    this.energy = Math.min(CONFIG.maxEnergy, this.energy + CONFIG.energyRecovery);

    // 技能CD递减
    for (let i = 0; i < this.skillCD.length; i++) {
      if (this.skillCD[i] > 0) {
        this.skillCD[i] = Math.max(0, this.skillCD[i] - 1);
      }
    }

    this.updateUI();
  }

  // ==================== 工具方法 ====================
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  getSupportDps() {
    let total = 0;
    this.supports.forEach(s => {
      if (s.unlocked) total += s.dps * s.level;
    });
    return total;
  }

  openPanel(name) {
    this.showToast(`打开${name}面板`);
  }

  // ==================== 存档 ====================
  saveGame() {
    const data = {
      gold: this.gold,
      diamond: this.diamond,
      energy: this.energy,
      mainLevel: this.mainLevel,
      wave: this.wave,
      totalWaveCount: this.totalWaveCount,
      totalWavesCleared: this.totalWavesCleared,
      totalKills: this.totalKills,
      supports: this.supports.map(s => ({ level: s.level, unlocked: s.unlocked })),
      skillLevel: this.skillLevel,
      gachaCount: this.gachaCount
    };
    localStorage.setItem('gujiyouxi_save', JSON.stringify(data));
  }

  loadGame() {
    const saved = localStorage.getItem('gujiyouxi_save');
    if (saved) {
      const data = JSON.parse(saved);
      this.gold = data.gold || 0;
      this.diamond = data.diamond || 0;
      this.energy = data.energy || 100;
      this.mainLevel = data.mainLevel || 1;
      this.wave = data.wave || 1;
      this.totalWaveCount = data.totalWaveCount || 0;
      this.totalWavesCleared = data.totalWavesCleared || 0;
      this.totalKills = data.totalKills || 0;
      this.gachaCount = data.gachaCount || 3;
      this.skillLevel = data.skillLevel || [1, 0, 0, 0, 0, 0, 0];

      if (data.supports) {
        data.supports.forEach((s, i) => {
          if (this.supports[i]) {
            this.supports[i].level = s.level || 1;
            this.supports[i].unlocked = s.unlocked || SUPPORTS[i].unlockWave === 0;
          }
        });
      }
    }
  }
}

// ==================== 游戏配置 ====================
const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 480,
  parent: 'game-wrapper',
  backgroundColor: '#16243a',
  scene: GameScene
};

// 启动游戏
const game = new Phaser.Game(config);