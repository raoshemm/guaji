# Battle UI Icons Layout V2

This folder contains white-background image2 icon sources prepared for the current 375x667 battle layout.

- `battle-ui-icons-layout-v2-white-atlas.png`: grouped cutting atlas on a white background.
- `*-white.png`: individual white-background sources, scaled to 4x the in-game slot size.
- `manifest.json`: source file, intended in-game slot size, and atlas cell coordinates.

After manual background removal, put transparent PNGs in:

```text
assets/ui/sprites/layout-v2/
```

Suggested transparent output names should match the current `*-white.png` names without `-white`.
