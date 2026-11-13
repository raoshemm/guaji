/**
 * DMAX 挂机英雄 · AudioEngine v1.0
 *
 * 事件驱动的运行时音频引擎，双端可用（微信小游戏 / H5 浏览器），零音频文件主路径。
 *
 *   · 总线：master → limiter → destination；music / sfx / ui / stinger 四条子总线
 *   · 限声：优先级抢占 + 每事件冷却 + 每事件并发上限 + 全局发声数预算
 *   · 闪避：独立 musicDuck 节点，不干扰音乐交叉淡化
 *   · 音乐：25ms tick + 150ms 音频时钟前瞻排程，小节对齐淡出淡入
 *   · 生命周期：wx.onHide/onShow、音频打断、H5 visibilitychange、首次手势解锁
 *   · 降级：无 createWebAudioContext 时用 InnerAudioContext 播放 assets/*.mp3
 *
 * 依赖：同目录 audio-config.js（由 tools/render_assets.py 生成，音色配方唯一真源）。
 * 用法：
 *   微信小游戏：var A = require('./audio/AudioEngine.js'); A.init({assetRoot:'assets/audio'});
 *   H5：       <script src="runtime/audio-config.js"></script><script src="runtime/AudioEngine.js"></script>
 *              DMAXAudio.init({assetRoot:'assets'});
 *
 * 本文件不修改任何既有游戏代码；install.js 提供无侵入的 prototype 兼容桥。
 */
(function (global) {
  'use strict';

  var CFG = (typeof global.DMAX_AUDIO_CONFIG !== 'undefined') ? global.DMAX_AUDIO_CONFIG : null;
  if (!CFG && typeof require === 'function') {
    // 入口被包成 CommonJS 模块时再试一次同目录文件；失败也不要抛 MODULE_NOT_FOUND，
    // 交给下面统一、可读的提示（audio-config.js 现在会显式挂全局，正常路径不会走到这里）。
    try { CFG = require('./audio-config.js'); } catch (e) {}
  }
  if (!CFG) {
    throw new Error('[DMAXAudio] 缺少 audio-config.js：请确认它先于 AudioEngine.js 加载，'
                    + '或运行 python tools/render_assets.py 重新生成');
  }

  var MAX_SFX_VOICES = 12;
  var MAX_STINGER_VOICES = 2;
  var FALLBACK_POOL_SIZE = 8;
  var LOOKAHEAD_MS = 150;
  var TICK_MS = 25;
  var BAR_STEPS = 8;
  var CALIBRATION = 0.90;
  var SETTINGS_KEY = 'dmax_audio_v1';

  var VARIATIONS = [
    { f: 1.00, v: 1.00, n: 1.00 },
    { f: 1.05, v: 0.90, n: 1.20 },
    { f: 0.95, v: 1.08, n: 0.85 }
  ];

  function nowMs() { return (typeof Date !== 'undefined' && Date.now) ? Date.now() : (+new Date()); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function wxApi() { return (typeof wx !== 'undefined' && wx) ? wx : null; }
  function isWx() { return !!wxApi(); }

  function storageGet(key) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage && localStorage.getItem) {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    try {
      var w = wxApi();
      if (w && w.getStorageSync) { var v = w.getStorageSync(key); return (v === '' || v === undefined) ? null : v; }
    } catch (e2) {}
    return null;
  }

  function storageSet(key, val) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage && localStorage.setItem) {
        localStorage.setItem(key, String(val)); return;
      }
    } catch (e) {}
    try {
      var w = wxApi();
      if (w && w.setStorageSync) w.setStorageSync(key, String(val));
    } catch (e2) {}
  }

  function defaults() {
    return {
      master: CFG.buses.master, music: CFG.buses.music, sfx: CFG.buses.sfx,
      ui: CFG.buses.ui, stinger: CFG.buses.stinger,
      musicMuted: false, sfxMuted: false,
      obeyMuteSwitch: true, assetRoot: 'assets/audio'
    };
  }

  var S = defaults();
  var ctx = null;
  var G = {};                 // 总线节点
  var noiseBuf = null;
  var mode = 'none';          // 'webaudio' | 'sample' | 'none'
  var voices = [];
  var lastAt = {};
  var varSeq = {};
  var fallbackPool = [];
  var fallbackMusic = null;
  var fallbackMusicPaused = false;
  var lifecycleBound = false;
  var unlockBound = false;
  var duckTimer = null;
  var duck = { db: 0, until: 0 };
  var fade = 1;
  var stats = { posted: 0, played: 0, droppedByCooldown: 0, droppedByBudget: 0,
                droppedByMute: 0, stolen: 0, unknown: 0, rawPlayed: 0 };

  var M = { timer: null, running: false, scene: 'battle', pending: null,
            step: 0, nextTime: 0, intensity: 0.6, switching: false };

  // ---------------------------------------------------------------- 上下文与总线

  function createContext() {
    var w = wxApi();
    if (w && typeof w.createWebAudioContext === 'function') {
      try {
        var c = w.createWebAudioContext();
        if (c && typeof c.createGain === 'function') return c;
      } catch (e) {}
    }
    var W = (typeof window !== 'undefined') ? window : null;
    var AC = W && (W.AudioContext || W.webkitAudioContext);
    if (AC) {
      try { return new AC(); } catch (e2) {}
    }
    return null;
  }

  function makeNoiseBuffer() {
    if (!ctx || typeof ctx.createBuffer !== 'function') return null;
    var rate = ctx.sampleRate || 44100;
    var len = Math.floor(rate * 0.5);
    var buf = ctx.createBuffer(1, len, rate);
    var d = buf.getChannelData(0);
    var seed = 20261112;
    for (var i = 0; i < len; i++) {
      seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
      d[i] = (seed / 0x7fffffff) * 2 - 1;
    }
    return buf;
  }

  function nodeGain(name) {
    var base = S[name];
    if (name === 'music' && S.musicMuted) return 0;
    if (name !== 'music' && S.sfxMuted) return 0;
    return base;
  }

  function buildGraph() {
    G.master = ctx.createGain();
    G.master.gain.value = S.master;
    var tail = G.master;
    if (typeof ctx.createDynamicsCompressor === 'function') {
      try {
        var comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -10;
        comp.knee.value = 0;
        comp.ratio.value = 12;
        comp.attack.value = 0.003;
        comp.release.value = 0.18;
        G.master.connect(comp);
        comp.connect(ctx.destination);
        G.limiter = comp;
      } catch (e) { G.master.connect(ctx.destination); }
    } else {
      G.master.connect(ctx.destination);
    }
    G.music = ctx.createGain();
    G.music.gain.value = nodeGain('music');
    G.musicDuck = ctx.createGain();
    G.musicDuck.gain.value = 1;
    G.music.connect(G.musicDuck);
    G.musicDuck.connect(tail);
    ['sfx', 'ui', 'stinger'].forEach(function (n) {
      G[n] = ctx.createGain();
      G[n].gain.value = nodeGain(n);
      G[n].connect(tail);
    });
  }

  function ramp(param, target, sec) {
    if (!ctx || !param) return;
    try {
      var t = ctx.currentTime;
      param.cancelScheduledValues(t);
      param.setValueAtTime(param.value, t);
      param.linearRampToValueAtTime(clamp(target, 0, 1.5), t + Math.max(0.005, sec));
    } catch (e) {}
  }

  function applyBusGain(name) {
    if (!ctx || !G[name]) return;
    if (name === 'music') ramp(G.music.gain, S.music * (S.musicMuted ? 0 : 1) * fade, 0.05);
    else ramp(G[name].gain, nodeGain(name), 0.05);
  }

  function applyDuck() {
    if (!ctx || !G.musicDuck) return;
    ramp(G.musicDuck.gain, Math.pow(10, -duck.db / 20), 0.06);
  }

  function doDuck(db, holdMs) {
    // 事件表里写的是负数 dB（如 -6），内部统一存「衰减量的正值」
    duck.db = Math.max(duck.db, Math.abs(db));
    duck.until = Math.max(duck.until, nowMs() + holdMs);
    applyDuck();
    if (duckTimer) clearTimeout(duckTimer);
    var release = function () {
      if (nowMs() >= duck.until) {
        duck.db = 0;
        duckTimer = null;
        applyDuck();
      } else {
        duckTimer = setTimeout(release, Math.max(60, duck.until - nowMs() + 420));
      }
    };
    duckTimer = setTimeout(release, holdMs + 420);
  }

  // ---------------------------------------------------------------- 设置

  function loadSettings() {
    var s = defaults();
    var legacyMute = storageGet('gujiyouxi_mute');
    var mm = storageGet('gujiyouxi_music_mute');
    var sm = storageGet('gujiyouxi_sfx_mute');
    if (mm !== null) s.musicMuted = (mm === '1' || mm === 1);
    else if (legacyMute !== null) s.musicMuted = (legacyMute === '1' || legacyMute === 1);
    if (sm !== null) s.sfxMuted = (sm === '1' || sm === 1);
    else if (legacyMute !== null) s.sfxMuted = (legacyMute === '1' || legacyMute === 1);
    var raw = storageGet(SETTINGS_KEY);
    if (raw) {
      try {
        var saved = (typeof raw === 'string') ? JSON.parse(raw) : raw;
        Object.keys(s).forEach(function (k) { if (saved[k] !== undefined) s[k] = saved[k]; });
      } catch (e) {}
    }
    return s;
  }

  function saveSettings() {
    try { storageSet(SETTINGS_KEY, JSON.stringify(S)); } catch (e) {}
    // 与旧设置面板共用三个键，老档 / 旧逻辑零改动即可继续工作
    storageSet('gujiyouxi_mute', (S.musicMuted && S.sfxMuted) ? '1' : '0');
    storageSet('gujiyouxi_music_mute', S.musicMuted ? '1' : '0');
    storageSet('gujiyouxi_sfx_mute', S.sfxMuted ? '1' : '0');
  }

  // ---------------------------------------------------------------- 发声管理

  function pruneVoices() {
    var t = nowMs();
    for (var i = voices.length - 1; i >= 0; i--) {
      if (voices[i].done || voices[i].end < t) {
        releaseVoice(voices[i]);
      }
    }
  }

  function releaseVoice(v) {
    if (!v || v.done) return;
    v.done = true;
    for (var i = 0; i < v.nodes.length; i++) {
      try { v.nodes[i].disconnect(); } catch (e) {}
    }
    v.nodes.length = 0;
    var idx = voices.indexOf(v);
    if (idx >= 0) voices.splice(idx, 1);
  }

  function newVoice(eventId, priority, bus, durMs) {
    var v = { eventId: eventId, priority: priority, bus: bus,
              start: nowMs(), end: nowMs() + durMs + 120, nodes: [], done: false };
    voices.push(v);
    setTimeout(function () { releaseVoice(v); }, durMs + 200);
    return v;
  }

  function countVoices(filter) {
    var n = 0;
    for (var i = 0; i < voices.length; i++) if (!voices[i].done && filter(voices[i])) n++;
    return n;
  }

  function nextVariation(eid) {
    var k = (varSeq[eid] = (varSeq[eid] || 0) + 1);
    return VARIATIONS[k % VARIATIONS.length];
  }

  // ---------------------------------------------------------------- 合成层

  function waveType(w) {
    return (w === 'square' || w === 'sawtooth' || w === 'triangle') ? w : 'sine';
  }

  function tone(L, t0, amp, dest, v, pitch) {
    if (!ctx || typeof ctx.createOscillator !== 'function') return;
    var f0 = Math.max(20, L.f0 * (pitch || 1));
    var f1 = Math.max(20, L.f1 * (pitch || 1));
    var start = t0 + L.t;
    var dur = Math.max(0.01, L.d);
    try {
      var osc = ctx.createOscillator();
      osc.type = waveType(L.w);
      osc.frequency.setValueAtTime(f0, start);
      if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), start + dur);
      var g = ctx.createGain();
      var atk = Math.min(L.atk || 0.002, dur * 0.3);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(Math.max(0.0002, amp), start + atk);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(g); g.connect(dest);
      osc.start(start); osc.stop(start + dur + 0.02);
      v.nodes.push(osc); v.nodes.push(g);
      var hs = L.h || [];
      for (var i = 0; i < hs.length; i++) {
        var o2 = ctx.createOscillator();
        o2.type = 'sine';
        o2.frequency.setValueAtTime(Math.max(20, f0 * hs[i]), start);
        o2.connect(g);
        o2.start(start); o2.stop(start + dur + 0.02);
        v.nodes.push(o2);
      }
      osc.onended = function () { /* 统一由 newVoice 的兜底定时器释放，避免重复 disconnect */ };
    } catch (e) {}
  }

  function noise(L, t0, amp, dest, v, pitch) {
    if (!ctx || !noiseBuf || typeof ctx.createBufferSource !== 'function') return;
    var start = t0 + L.t;
    var dur = Math.max(0.01, L.d);
    try {
      var src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      var g = ctx.createGain();
      var atk = Math.min(0.004, dur * 0.3);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(Math.max(0.0002, amp * 0.6), start + atk);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      var tail = g;
      if (typeof ctx.createBiquadFilter === 'function') {
        var f = ctx.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.setValueAtTime(Math.max(40, L.f0 * (pitch || 1)), start);
        if (L.f1 && L.f1 !== L.f0) {
          f.frequency.exponentialRampToValueAtTime(Math.max(40, L.f1), start + dur);
        }
        f.Q.value = clamp(L.q || 0.9, 0.1, 6);
        src.connect(f); f.connect(g);
        v.nodes.push(f);
      } else {
        src.connect(g);
      }
      g.connect(dest);
      src.start(start); src.stop(start + dur + 0.02);
      v.nodes.push(src); v.nodes.push(g);
    } catch (e) {}
  }

  function synth(eventId, spec, vari, params) {
    var r = CFG.recipes[eventId];
    if (!r) return false;
    var dest = G[spec.bus] || G.sfx || G.master;
    var t0 = ctx.currentTime + 0.002;
    var v = newVoice(eventId, spec.priority, spec.bus, r.dur * 1000);
    var pitch = (params && params.pitch) || 1;
    var extra = (params && params.gain) || 1;
    for (var i = 0; i < r.layers.length; i++) {
      var L = r.layers[i];
      var amp = L.a * r.gain * CALIBRATION * vari.v * extra;
      if (L.k === 't') tone(L, t0, amp, dest, v, pitch * vari.f);
      else noise(L, t0, amp * vari.n, dest, v, pitch * vari.f);
    }
    return true;
  }

  function rawVoice(opts, isNoise) {
    if (!ctx) return false;
    pruneVoices();
    if (countVoices(function (x) { return x.bus !== 'stinger'; }) >= MAX_SFX_VOICES) {
      stats.droppedByBudget++; return false;
    }
    var bus = (opts && opts.bus === 'bgm') ? 'music' : 'sfx';
    var dest = G[bus] || G.master;
    var t0 = ctx.currentTime + 0.002;
    var dur = (opts && opts.duration) || 0.1;
    var v = newVoice('raw', 20, bus, dur * 1000 + (opts && opts.delay ? opts.delay * 1000 : 0));
    var vol = (opts && opts.volume) || 0.1;
    var L = isNoise
      ? { k: 'n', t: opts.delay || 0, d: dur, f0: opts.freq || 2400,
          f1: opts.freqEnd || opts.freq || 2400, a: vol, q: opts.q || 0.9 }
      : { k: 't', t: opts.delay || 0, d: dur, f0: opts.freq || 440,
          f1: opts.freqEnd || opts.freq || 440, a: vol, w: opts.type || 'sine',
          atk: 0.004, h: opts.harmonic ? [opts.harmonic] : [] };
    if (isNoise) noise(L, t0, vol * 0.6, dest, v, 1);
    else tone(L, t0, vol, dest, v, 1);
    stats.rawPlayed++;
    return true;
  }

  // ---------------------------------------------------------------- 采样降级后端

  // 降级路径以 audio-config.js 的 file 字段为准（与 assets/manifest.json 同源），
  // 仅当配置缺失时才回退到命名约定，避免部署目录改名后「静默无声」难以排查。
  function samplePath(eventId, spec) {
    var rel = (spec && spec.file) ||
      ((CFG.events[eventId] && CFG.events[eventId].file) ||
       'sfx/' + eventId.replace(/\./g, '_') + '.mp3');
    return S.assetRoot + '/' + rel;
  }

  function sampleMusicPath(scene) {
    var rel = (CFG.music[scene] && CFG.music[scene].file) ||
      'bgm/music_' + scene + '.mp3';
    return S.assetRoot + '/' + rel;
  }

  function acquirePlayer() {
    var w = wxApi();
    if (!w || typeof w.createInnerAudioContext !== 'function') return null;
    for (var i = 0; i < fallbackPool.length; i++) {
      if (!fallbackPool[i].busy) { fallbackPool[i].busy = true; return fallbackPool[i]; }
    }
    if (fallbackPool.length >= FALLBACK_POOL_SIZE) {
      var oldest = fallbackPool.shift();
      try { oldest.a.destroy(); } catch (e) {}
    }
    try {
      var a = w.createInnerAudioContext();
      var slot = { a: a, busy: true, t: nowMs() };
      a.onEnded(function () { slot.busy = false; });
      a.onError(function () { slot.busy = false; });
      fallbackPool.push(slot);
      return slot;
    } catch (e2) { return null; }
  }

  function playSample(eventId, spec, vari, params) {
    var slot = acquirePlayer();
    if (!slot) return false;
    try {
      slot.a.src = samplePath(eventId, spec);
      // 相对混音电平来自 manifest.mixGain，这里用配置里的 sampleGain 复刻
      var g = (spec.sampleGain || 0.5) * (settingsFactor(spec.bus))
              * vari.v * ((params && params.gain) || 1);
      slot.a.volume = clamp(g, 0, 1);
      slot.a.play();
      setTimeout(function () { slot.busy = false; }, 1600);
    } catch (e) {
      slot.busy = false; return false;
    }
    return true;
  }

  function settingsFactor(bus) {
    if (bus === 'music') return S.music * (S.musicMuted ? 0 : 1);
    if (bus === 'ui') return S.ui * (S.sfxMuted ? 0 : 1);
    if (bus === 'stinger') return S.master * (S.sfxMuted ? 0 : 1);
    return S.sfx * S.master * (S.sfxMuted ? 0 : 1);
  }

  function startFallbackMusic() {
    var w = wxApi();
    if (!w || typeof w.createInnerAudioContext !== 'function') return;
    if (!fallbackMusic) {
      try { fallbackMusic = w.createInnerAudioContext(); } catch (e) { return; }
    }
    try {
      // 换曲必须先 stop：部分基础库在播放中改 src 不会生效
      fallbackMusic.stop();
      fallbackMusic.src = sampleMusicPath(M.scene);
      fallbackMusic.loop = true;
      fallbackMusic.volume = clamp(S.music * (S.musicMuted ? 0 : 1), 0, 1);
      fallbackMusic.play();
      fallbackMusicPaused = false;
    } catch (e2) {}
  }

  function stopFallbackMusic() {
    if (!fallbackMusic) return;
    try { fallbackMusic.stop(); } catch (e) {}
    fallbackMusicPaused = true;
  }

  // ---------------------------------------------------------------- 音乐调度器

  function musicNote(type, f0, f1, dur, vol, when, dest) {
    if (!ctx || typeof ctx.createOscillator !== 'function') return;
    try {
      var o = ctx.createOscillator();
      o.type = waveType(type);
      o.frequency.setValueAtTime(Math.max(20, f0), when);
      if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), when + dur);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(Math.max(0.0002, vol), when + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(g); g.connect(dest);
      o.start(when); o.stop(when + dur + 0.02);
      o.onended = function () {
        try { o.disconnect(); } catch (e) {}
        try { g.disconnect(); } catch (e2) {}
      };
      setTimeout(function () {
        try { o.disconnect(); } catch (e3) {}
        try { g.disconnect(); } catch (e4) {}
      }, (when - ctx.currentTime) * 1000 + dur * 1000 + 400);
    } catch (e) {}
  }

  function musicHat(vol, when, dest) {
    if (!noiseBuf || !ctx || typeof ctx.createBufferSource !== 'function') return;
    try {
      var src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(vol, when + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.035);
      var f = null;
      if (typeof ctx.createBiquadFilter === 'function') {
        f = ctx.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 7000; f.Q.value = 1.2;
        src.connect(f); f.connect(g);
      } else { src.connect(g); }
      g.connect(dest);
      src.start(when); src.stop(when + 0.05);
      src.onended = function () {
        try { src.disconnect(); } catch (e) {}
        try { g.disconnect(); } catch (e2) {}
        if (f) { try { f.disconnect(); } catch (e3) {} }
      };
    } catch (e) {}
  }

  function scheduleMusicStep(sc, step, when) {
    var unit = sc.stepMs / 1000;
    var dest = G.music || G.master;
    var mel = sc.melody[step % sc.melody.length];
    var intensity = 0.55 + M.intensity * 0.45;
    musicNote(sc.leadType, mel, mel * 0.995, unit * 0.78, sc.leadVol * intensity, when, dest);
    if (step % 2 === 0) {
      var bass = sc.bass[Math.floor(step / 2) % sc.bass.length];
      musicNote('sine', bass, bass, unit * 1.55, sc.bassVol, when, dest);
    }
    if (step % 4 === 2) {
      musicNote('sine', mel * 2, mel * 2, Math.min(0.10, unit * 0.6), sc.sparkVol, when, dest);
    }
    if (sc.hat > 0 && step % 2 === 1) musicHat(sc.hat * intensity, when, dest);
  }

  function tick() {
    if (!M.running || !ctx || ctx.state !== 'running' || S.musicMuted || M.switching) return;
    // H5 首次手势解锁 / 后台恢复后，nextTime 可能远在过去；不补播，直接从当前时间起拍
    if (M.nextTime < ctx.currentTime) M.nextTime = ctx.currentTime + 0.02;
    var horizon = ctx.currentTime + LOOKAHEAD_MS / 1000;
    var guard = 0;
    while (M.nextTime < horizon && guard++ < 16) {
      if (M.pending && !M.switching && M.step % BAR_STEPS === 0) {
        // 小节边界：先淡出，切换曲目，再淡入；不重建定时器、不叠音轨
        M.switching = true;
        var next = M.pending;
        fade = 0;
        ramp(G.music.gain, 0, 0.12);
        setTimeout(function () {
          M.scene = next; M.pending = null; M.step = 0; M.switching = false;
          M.nextTime = ctx.currentTime + 0.10;
          fade = 1;
          applyBusGain('music');
        }, 140);
        break;
      }
      var sc = CFG.music[M.scene] || CFG.music.battle;
      scheduleMusicStep(sc, M.step, M.nextTime);
      M.step++;
      M.nextTime += sc.stepMs / 1000;
      if (M.switching) break;
    }
  }

  // ---------------------------------------------------------------- 生命周期

  function ensureRunning() {
    if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      try { ctx.resume(); } catch (e) {}
    }
  }

  function suspend() {
    if (ctx && typeof ctx.suspend === 'function') { try { ctx.suspend(); } catch (e) {} }
    if (M.timer) { clearInterval(M.timer); M.timer = null; }
    stopFallbackMusic();
  }

  function resume() {
    ensureRunning();
    if (M.running && ctx) {
      M.step = Math.ceil(M.step / BAR_STEPS) * BAR_STEPS;  // 回到小节头，不补播后台拍子
      M.nextTime = ctx.currentTime + 0.08;
      if (!M.timer) M.timer = setInterval(tick, TICK_MS);
    }
    if (fallbackMusicPaused && M.running) startFallbackMusic();
  }

  function bindLifecycle() {
    if (lifecycleBound) return;
    lifecycleBound = true;
    var w = wxApi();
    if (w) {
      if (typeof w.setInnerAudioOption === 'function') {
        try {
          // 默认尊重 iOS 静音键；玩家在游戏设置里主动开启声音后可设 obeyMuteSwitch=false
          w.setInnerAudioOption({ mixWithOther: false, obeyMuteSwitch: S.obeyMuteSwitch !== false });
        } catch (e) {}
      }
      if (typeof w.onHide === 'function') { try { w.onHide(suspend); } catch (e2) {} }
      if (typeof w.onShow === 'function') { try { w.onShow(resume); } catch (e3) {} }
      if (typeof w.onAudioInterruptionBegin === 'function') {
        try { w.onAudioInterruptionBegin(suspend); } catch (e4) {}
      }
      if (typeof w.onAudioInterruptionEnd === 'function') {
        try { w.onAudioInterruptionEnd(resume); } catch (e5) {}
      }
    }
    if (typeof document !== 'undefined' && document && typeof document.addEventListener === 'function') {
      try {
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) suspend(); else resume();
        });
      } catch (e6) {}
      if (!isWx() && !unlockBound) {
        unlockBound = true;
        var unlock = function () {
          ensureRunning();
          if (M.running) resume();
          try {
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('mousedown', unlock);
            document.removeEventListener('keydown', unlock);
          } catch (e7) {}
        };
        document.addEventListener('touchstart', unlock);
        document.addEventListener('mousedown', unlock);
        document.addEventListener('keydown', unlock);
      }
    }
  }

  // ---------------------------------------------------------------- 对外 API

  var A = {
    init: function (opts) {
      opts = opts || {};
      S = loadSettings();
      if (opts.assetRoot) S.assetRoot = opts.assetRoot;
      if (opts.obeyMuteSwitch !== undefined) S.obeyMuteSwitch = !!opts.obeyMuteSwitch;
      ctx = createContext();
      if (ctx) {
        try {
          buildGraph();
          noiseBuf = makeNoiseBuffer();
          mode = 'webaudio';
        } catch (e) { ctx = null; }
      }
      if (!ctx) {
        mode = (wxApi() && typeof wxApi().createInnerAudioContext === 'function') ? 'sample' : 'none';
      }
      bindLifecycle();
      return mode;
    },

    /** 播放一个音频事件。params: { pitch, gain }；返回是否真正发声。 */
    post: function (eventId, params) {
      stats.posted++;
      var spec = CFG.events[eventId];
      if (!spec) { stats.unknown++; return false; }
      if ((spec.bus === 'music' && S.musicMuted) || (spec.bus !== 'music' && S.sfxMuted)) {
        stats.droppedByMute++; return false;
      }
      if (mode === 'none') return false;
      var t = nowMs();
      pruneVoices();
      if (t - (lastAt[eventId] || 0) < (spec.cooldownMs || 0)) {
        stats.droppedByCooldown++; return false;
      }
      var same = countVoices(function (v) { return v.eventId === eventId; });
      if (same >= (spec.cap || 1)) { stats.droppedByBudget++; return false; }

      var isStinger = spec.bus === 'stinger';
      if (isStinger) {
        if (countVoices(function (v) { return v.bus === 'stinger'; }) >= MAX_STINGER_VOICES) {
          stats.droppedByBudget++; return false;
        }
      } else if (countVoices(function (v) { return v.bus !== 'stinger'; }) >= MAX_SFX_VOICES) {
        var cand = null;
        for (var i = 0; i < voices.length; i++) {
          var v = voices[i];
          if (v.done || v.bus === 'stinger' || v.priority >= spec.priority) continue;
          if (!cand || v.priority < cand.priority ||
              (v.priority === cand.priority && v.start < cand.start)) cand = v;
        }
        if (!cand) { stats.droppedByBudget++; return false; }
        releaseVoice(cand); stats.stolen++;
      }

      lastAt[eventId] = t;
      if (spec.duck) doDuck(spec.duck[0], spec.duck[1] || 300);
      var vari = nextVariation(eventId);
      ensureRunning();
      var ok = (mode === 'webaudio')
        ? synth(eventId, spec, vari, params)
        : playSample(eventId, spec, vari, params);
      if (ok) stats.played++;
      return ok;
    },

    /** 兼容旧代码里直接调 _beep / _sndNoise 的内联音效。 */
    rawTone: function (opts) { return rawVoice(opts, false); },
    rawNoise: function (opts) { return rawVoice(opts, true); },

    startMusic: function () {
      if (S.musicMuted) return false;
      if (M.running && (M.timer || fallbackMusic)) return true;
      M.running = true;
      if (mode === 'webaudio') {
        ensureRunning();
        M.nextTime = ctx.currentTime + 0.08;
        M.timer = setInterval(tick, TICK_MS);
        tick();
      } else if (mode === 'sample') {
        startFallbackMusic();
      }
      return true;
    },

    stopMusic: function () {
      M.running = false;
      if (M.timer) { clearInterval(M.timer); M.timer = null; }
      stopFallbackMusic();
      return true;
    },

    /** 场景切换，小节边界生效；传 immediate=true 可立即切（首启动用）。 */
    setMusicScene: function (scene, immediate) {
      if (!CFG.music[scene] || scene === M.scene) return false;
      if (!M.running || immediate || mode !== 'webaudio') {
        M.scene = scene; M.step = 0;
        if (mode === 'sample' && M.running) startFallbackMusic();
        return true;
      }
      M.pending = scene;
      return true;
    },

    setMusicIntensity: function (v) { M.intensity = clamp(v, 0, 1); },

    setBusVolume: function (bus, value) {
      if (!(bus in CFG.buses)) return false;
      S[bus] = clamp(value, 0, 1);
      if (bus === 'master' && G.master) ramp(G.master.gain, S.master, 0.05);
      else applyBusGain(bus);
      if (mode === 'sample' && fallbackMusic) {
        try { fallbackMusic.volume = clamp(S.music * (S.musicMuted ? 0 : 1), 0, 1); } catch (e) {}
      }
      saveSettings();
      return true;
    },

    setMuted: function (kind, muted) {
      if (kind === 'music') { S.musicMuted = !!muted; applyBusGain('music'); }
      else if (kind === 'sfx') {
        S.sfxMuted = !!muted;
        ['sfx', 'ui', 'stinger'].forEach(applyBusGain);
      } else return false;
      if (mode === 'sample' && fallbackMusic) {
        try { fallbackMusic.volume = S.musicMuted ? 0 : S.music; } catch (e) {}
      }
      saveSettings();
      return true;
    },

    setObeyMuteSwitch: function (v) {
      S.obeyMuteSwitch = !!v;
      var w = wxApi();
      if (w && typeof w.setInnerAudioOption === 'function') {
        try { w.setInnerAudioOption({ mixWithOther: false, obeyMuteSwitch: S.obeyMuteSwitch }); } catch (e) {}
      }
      saveSettings();
    },

    getSettings: function () {
      var o = {}; Object.keys(S).forEach(function (k) { o[k] = S[k]; }); return o;
    },

    getStats: function () {
      var o = {}; Object.keys(stats).forEach(function (k) { o[k] = stats[k]; });
      o.mode = mode;
      o.musicScene = M.scene;
      o.musicPending = M.pending;
      o.musicRunning = M.running;
      o.activeVoices = voices.length;
      o.duckDb = duck.db;
      return o;
    },

    suspend: suspend,
    resume: resume,
    getContext: function () { return ctx; },

    destroy: function () {
      A.stopMusic();
      if (duckTimer) { clearTimeout(duckTimer); duckTimer = null; }
      duck.db = 0; duck.until = 0; fade = 1;
      M.pending = null; M.switching = false; M.step = 0;
      voices.slice().forEach(releaseVoice);
      fallbackPool.forEach(function (s) { try { s.a.destroy(); } catch (e) {} });
      fallbackPool = [];
      if (fallbackMusic) { try { fallbackMusic.destroy(); } catch (e2) {} fallbackMusic = null; }
      if (ctx) { try { ctx.close(); } catch (e3) {} ctx = null; }
      mode = 'none';
    }
  };

  global.DMAXAudio = A;
  if (typeof module !== 'undefined' && module.exports) module.exports = A;
})(typeof globalThis !== 'undefined' ? globalThis
  : (typeof window !== 'undefined' ? window
    : (typeof global !== 'undefined' ? global : this)));
