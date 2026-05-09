// ==================== 存档管理 ====================

const SaveManager = {
  SAVE_KEY: 'ddou_game_save',

  // 获取存档数据
  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('存档读取失败:', e);
      return null;
    }
  },

  // 保存游戏数据
  save(gameData) {
    try {
      const data = {
        version: 1,
        timestamp: Date.now(),
        data: gameData
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('存档保存失败:', e);
      return false;
    }
  },

  // 清除存档
  clear() {
    localStorage.removeItem(this.SAVE_KEY);
  },

  // 获取离线收益
  getOfflineEarnings(gameData) {
    const saved = this.load();
    if (!saved) return { gold: 0, seconds: 0 };

    const now = Date.now();
    const lastTime = saved.timestamp || now;
    const diffSeconds = Math.floor((now - lastTime) / 1000);

    if (diffSeconds <= 0) return { gold: 0, seconds: 0 };

    // 最多计算12小时离线
    const maxSeconds = CONFIG.offline.maxHours * 3600;
    const onlineSeconds = Math.min(diffSeconds, maxSeconds);

    // 离线收益 = 主角DPS * 离线收益比例 * 在线秒数
    const offlineDps = gameData.mainDps * CONFIG.offline.dpsPerSecond;
    const offlineGold = Math.floor(offlineDps * onlineSeconds);

    return { gold: offlineGold, seconds: onlineSeconds };
  }
};

if (typeof window !== 'undefined') {
  window.SaveManager = SaveManager;
}