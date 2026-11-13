/**
 * DMAX 挂机英雄 · 音频系统无侵入兼容桥
 *
 * 作用：不改 game.js 一个字节，把现有 20+ 个 sfx*() 调用点接到事件驱动的 AudioEngine。
 *   · 保留所有既有方法名与调用语义，玩法代码零改动
 *   · 保留旧设置面板（musicMuted / sfxMuted / persistSettings）与旧存档键
 *   · 支持 DMAXAudioUninstall(Game) 完整还原，验收失败可一键回退
 *
 * 加载顺序要求：必须在 game.js 中所有 `Game.prototype.xxx = ...` 执行完之后调用。
 *   · 微信小游戏：buildEgretWxgame.js 生成的入口里，`${mainBundle}` 之后调用
 *   · H5：egret-game.html 里 game.js 的 <script> 之后调用
 *
 * 用法：
 *   var A = require('./audio/AudioEngine.js');
 *   var install = require('./audio/install.js');
 *   install(Game, { assetRoot: 'assets/audio' });
 */
(function (global) {
  'use strict';

  function resolveAudio() {
    if (global.DMAXAudio) return global.DMAXAudio;
    if (typeof require === 'function') {
      var paths = ['./AudioEngine.js', '../runtime/AudioEngine.js', './audio/AudioEngine.js'];
      for (var i = 0; i < paths.length; i++) {
        try { return require(paths[i]); } catch (e) {}
      }
    }
    return null;
  }

  var A = resolveAudio();

  var JOB_PITCH = {
    trainee_mage: 1.00, blade_mage: 1.14, star_oracle: 1.28,
    spirit_guard: 0.90, shadow_rogue: 1.34, crystal_knight: 0.74
  };

  function cfg() {
    if (global.DMAX_AUDIO_CONFIG) return global.DMAX_AUDIO_CONFIG;
    if (typeof require === 'function') {
      try { return require('./audio-config.js'); } catch (e) {}
      try { return require('../runtime/audio-config.js'); } catch (e2) {}
    }
    return { jobMap: {}, skillSlots: ['volley', 'pierce', 'sweep', 'sigil', 'dome', 'bloom', 'cataclysm'] };
  }

  function install(Game, options) {
    if (!A) throw new Error('[audio] 未找到 AudioEngine.js');
    if (typeof Game !== 'function' || !Game.prototype) {
      throw new Error('[audio] Game 未定义：请在 game.js 主包执行完之后再调用 install(Game)');
    }
    var P = Game.prototype;
    if (P.__dmaxAudioSaved) return A;  // 幂等

    var CFG = cfg();
    var saved = {};
    function wrap(name, fn) {
      saved[name] = P[name];
      P[name] = fn;
    }
    function original(name, self, args) {
      var f = saved[name];
      if (typeof f === 'function') return f.apply(self, args || []);
    }

    A.init(options || {});

    // ---- 设置：沿用旧键，设置面板两个开关零改动继续生效 ----
    wrap('initSound', function () {
      var s = A.getSettings();
      this.musicMuted = !!s.musicMuted;
      this.sfxMuted = !!s.sfxMuted;
      this.soundMuted = this.musicMuted && this.sfxMuted;
      this._audioCtx = A.getContext();
      // 原 initSound 会用 localStorage 再覆盖一遍并挂 DOM 解锁监听；
      // 引擎的 bindLifecycle 已统一处理 wx / H5 两条链路，这里不再重复注册。
      return this._audioCtx;
    });

    wrap('persistSettings', function () {
      A.setMuted('music', !!this.musicMuted);
      A.setMuted('sfx', !!this.sfxMuted);
      this.soundMuted = this.musicMuted && this.sfxMuted;
      return original('persistSettings', this, arguments);
    });

    // ---- 底层原语：兼容 sfxCombo / game.js:8963 等内联 _beep 调用 ----
    wrap('ensureAudio', function () { return A.getContext(); });
    wrap('_beep', function (opts) { return A.rawTone(opts || {}); });
    wrap('_sndNoise', function (opts) { return A.rawNoise(opts || {}); });

    // ---- 事件映射：玩法调用点完全不用改 ----
    function hitEvent(self, kind) {
      if (kind === 'crit') return 'combat.crit';
      if (kind === 'boss') return 'boss.hit';
      var id = (CFG.jobMap && CFG.jobMap[self.jobId]) || 'mage';
      var gain = kind === 'heavy' ? 1.12 : 1;
      return { id: 'combat.hit.' + id, gain: gain };
    }

    wrap('sfxClick', function () { return A.post('ui.click'); });
    wrap('sfxHit', function (kind) {
      var h = hitEvent(this, kind);
      return A.post(h.id, { gain: h.gain });
    });
    wrap('sfxAttack', function (heavy) { return this.sfxHit(heavy ? 'heavy' : 'light'); });
    wrap('sfxCrit', function () { return A.post('combat.crit'); });
    wrap('sfxKill', function () { return A.post('combat.kill'); });
    wrap('sfxHurt', function () { return A.post('combat.hurt'); });
    wrap('sfxSupport', function () { return A.post('combat.support'); });
    wrap('sfxHitBoss', function () { return A.post('boss.hit'); });
    wrap('sfxLevelUp', function () { return A.post('player.levelup'); });
    wrap('sfxUnlock', function () { return A.post('player.unlock'); });
    wrap('sfxBossEnter', function () { return A.post('boss.enter'); });
    wrap('sfxVictory', function () { return A.post('meta.victory'); });
    wrap('sfxDefeat', function () { return A.post('meta.defeat'); });
    wrap('sfxCombo', function () { return A.post('combat.combo'); });

    // 技能音保留「位 × 职业」：位决定事件，职业决定运行时音高
    wrap('sfxSkillCast', function (idx) {
      var slots = CFG.skillSlots || ['volley'];
      var slot = slots[(idx | 0) % slots.length];
      var pitch = JOB_PITCH[this.jobId] || 1.00;
      return A.post('skill.' + slot, { pitch: pitch });
    });
    wrap('sfxSkill', function (idx) { return this.sfxSkillCast(idx); });

    // ---- 音乐：换成前瞻调度器 + 小节对齐淡入淡出 ----
    wrap('startBgm', function () {
      this._bgmTimer = null;  // 让旧代码里的 clearInterval 变成无害 no-op
      return A.startMusic();
    });
    wrap('stopBgm', function () {
      this._bgmTimer = null;
      return A.stopMusic();
    });
    wrap('setBgmScene', function (scene) {
      this._bgmScene = scene;
      return A.setMusicScene(scene);
    });

    // 保留 haptic 原语义（战败 / BOSS 登场等才震），不额外接管
    P.__dmaxAudioSaved = saved;
    if (typeof console !== 'undefined' && console.log) {
      console.log('[audio] installed, mode=' + A.getStats().mode);
    }
    return A;
  }

  function uninstall(Game) {
    if (!Game || !Game.prototype || !Game.prototype.__dmaxAudioSaved) return false;
    var P = Game.prototype;
    var saved = P.__dmaxAudioSaved;
    Object.keys(saved).forEach(function (k) {
      if (saved[k] === undefined) delete P[k];
      else P[k] = saved[k];
    });
    delete P.__dmaxAudioSaved;
    if (A) A.destroy();
    return true;
  }

  global.DMAXAudioInstall = install;
  global.DMAXAudioUninstall = uninstall;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { install: install, uninstall: uninstall };
  }
})(typeof globalThis !== 'undefined' ? globalThis
  : (typeof window !== 'undefined' ? window
    : (typeof global !== 'undefined' ? global : this)));
