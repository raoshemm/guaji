# Image2 白底素材包

用途：战斗页面 UI 重制素材中转。这里的图片由 image2 按概念图风格重新绘制，统一放在纯白背景上，方便手动抠图。

## 文件

- `battle-elements-sheet-01.png`
  - 角色、怪物、辅助角色、技能图标、功能图标、按钮/条形组件。
- `battle-page-chrome-sheet-02.png`
  - 战斗背景、顶部栏、功能按钮行、BOSS/图签长按钮、侧边辅助卡、底部状态条、技能栏、导航栏。

## 后续替换建议

手动抠图后，把透明 PNG 放到：

```text
assets/ui/sprites/
```

建议命名：

```text
hero-mage-body.png
monster-fire-body.png
monster-ghost-body.png
support-candy.png
support-locked.png
skill-*.png
nav-*.png
```

我后续会按这些文件名接入 `game.js`。
