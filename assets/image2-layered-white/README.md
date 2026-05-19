# Image2 分层白底素材

用途：战斗页面重制素材中转。每个会被游戏加载、点击、替换的元素尽量单独绘制为白底 PNG，方便手动抠成透明 PNG 后再接回 `game.js`。

## 目录

- `background/`：全屏战斗背景。按竖屏 9:16 生成，后续游戏中按容器铺满/裁切适配。
- `characters/`：主角等战斗角色。
- `monsters/`：战斗怪物。
- `supports/`：左右辅助角色和锁定槽位。
- `skills/`：底部技能图标。
- `nav/`：底部导航按钮或图标。
- `buttons/`：顶部功能按钮、BOSS/图签按钮等。
- `top/`：顶部栏资源区域。
- `bars/`：血条、能量条、进度条等。

## 已生成

- `background/battle-background-fullscreen-9x16.png`
- `characters/hero-mage.png`
- `monsters/monster-fire-slime.png`
- `monsters/monster-ghost.png`
- `supports/support-candy.png`
- `supports/support-locked-slot.png`
- `skills/skill-light-wand.png`
- `skills/skill-heavy-slash.png`

## 抠图后替换约定

手动抠成透明 PNG 后，可以放到：

```text
assets/ui/sprites/
```

我会按实际文件名把它们接入战斗页面。
