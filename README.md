# 吃饭睡觉打豆豆

一款纯前端 H5 放置类点击战斗小游戏（Tap RPG / Idle Clicker）。

- **类型**：放置点击战斗
- **技术栈**：Egret 5.x（主版本） + 原生 JS（备份版） + LocalStorage 存档，无后端
- **游戏设计**：参见 [SPEC.md](./SPEC.md)

---

## 在线体验

部署仓库：<https://github.com/raoshemm/guaji>
游戏地址：<https://raoshemm.github.io/guaji/egret-game.html>

---

## 项目结构

```
gujiadaima/
├─ egret-game.html       # Egret 版入口（★ 生产入口）
├─ egret-test.html       # Egret 引擎冒烟测试
├─ index.html            # H5 原生备份版入口
├─ game.js               # Egret 版主逻辑
├─ game-native.js        # H5 原生版主逻辑
├─ SPEC.md               # 游戏设计规范
├─ layout-reference.png  # UI 布局参考图
├─ Bxiaoguotu/           # UI 效果图（21 张设计稿）
└─ lib/                  # 引擎 vendor（Egret / eui / tween / res / game）
```

---

## 本地运行

项目是纯静态文件，任何静态服务器都可以：

```bash
# 任选其一
python3 -m http.server 8080
npx http-server .
```

然后访问：

- `http://localhost:8080/egret-game.html`（Egret 版，主入口）
- `http://localhost:8080/index.html`（H5 原生备份版）

---

## 部署流程

源码（本仓库 `gujiadaima`）→ 部署仓库（`raoshemm/guaji`）→ GitHub Pages。

当前采用手动同步：把本仓库内容复制推送到 `guaji` 的默认分支，GitHub Pages 自动发布。

> 后续计划：通过 GitHub Actions 实现"源码推送 → 自动构建/混淆 → 自动发布到 guaji"的全自动流水线。

---

## 已实现的系统

- 核心循环：点击/自动攻击、波次、BOSS（每 10 波，带限时计时器）
- 主角升级、技能系统（7 个按等级解锁，带 CD）
- 辅助角色（8 个按累计通关波次解锁，各自 DPS 与攻击动画）
- 怪物矢量绘制（8 种形象）
- 食物系统 / 超市 / 商城 / 转盘 / 排行榜
- 邮件 / 公告 / 能量互助面板
- 签到 / 每日任务 / 成就系统
- 离线收益 / 自动存档
- 转生系统（永久加成）

## 尚未实装

- 音效（点击 / 升级 / 击杀）
- UI 视觉对齐效果图（当前为矢量占位）
- 商业化：VIP / 首冲 / 充值 / 邀请有礼 / 关注有奖 / 观看视频
- 宝箱、批量购买、喂饭饥饿机制

---

## License

私有项目，未授权不得转载。
