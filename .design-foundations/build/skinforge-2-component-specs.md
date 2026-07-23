# SkinForge 2.0 — Component Specs
**Phase:** 3 · **Status:** Final · **Date:** 2026-07-23
**Source DNA:** DESIGN.md (locked, "Ledger Pantry") · **Extends:** DESIGN.md token block; does NOT replace it.

This document is the implementation contract for the SkinForge 2.0 build phase. A developer can apply every CSS and JSX change described here without making further design decisions.

---

## Contents

1. [Token System — 3-Tier Architecture](#1-token-system--3-tier-architecture)
   - 1A. Tier 1 — Global Tokens (from DESIGN.md)
   - 1B. Tier 2 — Alias / Semantic Tokens
   - 1C. Tier 3 — Component Tokens
2. [Atomic Component Decomposition](#2-atomic-component-decomposition)
3. [Icon Replacement List](#3-icon-replacement-list)
4. [Migration Map — `--mc-*` → Semantic Tokens](#4-migration-map----mc---semantic-tokens)
5. [Target Size & Font Floor Enforcement](#5-target-size--font-floor-enforcement)
6. [Hover / Active State Lightness Deltas](#6-hover--active-state-lightness-deltas)
7. [Per-Component Implementation Specs](#7-per-component-implementation-specs)

---

## 1. Token System — 3-Tier Architecture

### Tier relationship
```
Tier 1 (Global)   →   Tier 2 (Alias/Semantic)   →   Tier 3 (Component)
palette.mjs output     design intent mappings         per-component scope
"what colors exist"    "what role a color plays"      "what this component uses"
```

**Rule:** Components consume Tier 3 tokens. Tier 3 references Tier 2. Tier 2 references Tier 1. No component hard-codes a Tier 1 value directly; no Tier 2 token hard-codes a hex value — it always references Tier 1 via `var()`.

---

### 1A. Tier 1 — Global Tokens

These are the raw values from `palette.mjs`. They are already defined in DESIGN.md's `:root` block (the `--neutral-*` and `--accent-*` entries). Do not re-derive or edit them. Listed here in W3C DTCG format for reference.

**Format:** `{ "$type": "color", "$value": "#rrggbb", "$description": "..." }`

```jsonc
// neutral ramp — hue-40 warm run
{ "color.neutral.1":  { "$type": "color", "$value": "#fdfcfc", "$description": "Near-white warm off-white — app background" } }
{ "color.neutral.2":  { "$type": "color", "$value": "#faf8f8", "$description": "Surface default — panels, sidebars" } }
{ "color.neutral.3":  { "$type": "color", "$value": "#f3f0ee", "$description": "Surface hover state" } }
{ "color.neutral.4":  { "$type": "color", "$value": "#ebe7e5", "$description": "Surface active / pressed state" } }
{ "color.neutral.6":  { "$type": "color", "$value": "#d9d0cd", "$description": "Subtle decorative border (non-functional)" } }
{ "color.neutral.7":  { "$type": "color", "$value": "#cbc1be", "$description": "Non-interactive panel divider" } }
{ "color.neutral.8":  { "$type": "color", "$value": "#b4a8a4", "$description": "Disabled text / placeholder" } }
{ "color.neutral.10": { "$type": "color", "$value": "#90837f", "$description": "Interactive border (inputs, buttons) — 3.46:1 on surface" } }
{ "color.neutral.11": { "$type": "color", "$value": "#69615f", "$description": "Secondary text — 5.71:1 on surface" } }
{ "color.neutral.12": { "$type": "color", "$value": "#312d2b", "$description": "Primary text — 12.88:1 on surface" } }

// accent ramp — hue-280 violet run
{ "color.accent.3":        { "$type": "color", "$value": "#edefff", "$description": "Accent background subtle" } }
{ "color.accent.7":        { "$type": "color", "$value": "#b7befe", "$description": "Accent muted — selection tints, soft badges" } }
{ "color.accent.9":        { "$type": "color", "$value": "#5657ac", "$description": "Accent solid — active tool, ON toggle, primary CTA" } }
{ "color.accent.10":       { "$type": "color", "$value": "#474796", "$description": "Accent solid hover" } }
{ "color.accent.11":       { "$type": "color", "$value": "#5a5e90", "$description": "Accent text — 5.77:1 on surface" } }
{ "color.accent.12":       { "$type": "color", "$value": "#292b45", "$description": "Accent emphasis / strong" } }
{ "color.accent.on-solid": { "$type": "color", "$value": "#f9faff", "$description": "Text on accent-solid backgrounds — 6.01:1" } }

// functional status colors
{ "color.error.9":    { "$type": "color", "$value": "#c56c65" } }
{ "color.error.11":   { "$type": "color", "$value": "#86534f" } }
{ "color.success.9":  { "$type": "color", "$value": "#84cc86" } }
{ "color.success.11": { "$type": "color", "$value": "#486e49" } }
{ "color.warning.9":  { "$type": "color", "$value": "#ceb47e" } }
{ "color.warning.11": { "$type": "color", "$value": "#6f6144" } }
{ "color.info.9":     { "$type": "color", "$value": "#7aabce" } }
{ "color.info.11":    { "$type": "color", "$value": "#4c677a" } }

// spacing — 4px base unit
{ "space.1":  { "$type": "dimension", "$value": "4px" } }
{ "space.2":  { "$type": "dimension", "$value": "8px" } }
{ "space.3":  { "$type": "dimension", "$value": "12px" } }
{ "space.4":  { "$type": "dimension", "$value": "16px" } }
{ "space.6":  { "$type": "dimension", "$value": "24px" } }
{ "space.8":  { "$type": "dimension", "$value": "32px" } }
{ "space.12": { "$type": "dimension", "$value": "48px" } }

// radius
{ "radius.sm": { "$type": "dimension", "$value": "6px",  "$description": "Small controls — swatches, buttons, inputs" } }
{ "radius.md": { "$type": "dimension", "$value": "10px", "$description": "Panels, modals, floating surfaces" } }

// type scale
{ "font-size.2xs":  { "$type": "dimension", "$value": "10px", "$description": "Body sans only. Below Silkscreen floor." } }
{ "font-size.xs":   { "$type": "dimension", "$value": "11px", "$description": "Body sans only. Below Silkscreen floor." } }
{ "font-size.sm":   { "$type": "dimension", "$value": "12px", "$description": "Minimum Silkscreen threshold. Body sans or Silkscreen." } }
{ "font-size.base": { "$type": "dimension", "$value": "14px", "$description": "Body sans default — body copy, inputs" } }
{ "font-size.lg":   { "$type": "dimension", "$value": "16px", "$description": "Silkscreen — tool names, section headers" } }
{ "font-size.xl":   { "$type": "dimension", "$value": "20px", "$description": "Silkscreen — panel titles" } }
{ "font-size.2xl":  { "$type": "dimension", "$value": "28px", "$description": "Silkscreen — logo / wordmark" } }

// font families
{ "font.display": { "$type": "fontFamily", "$value": "Silkscreen", "$description": "Pixel display font. Use at ≥12px only." } }
{ "font.body":    { "$type": "fontFamily", "$value": "-apple-system, 'Malgun Gothic', 'Apple SD Gothic Neo', 'Segoe UI', sans-serif" } }
{ "font.mono":    { "$type": "fontFamily", "$value": "monospace", "$description": "Hex values, numeric coordinates" } }

// line-height
{ "leading.tight":  { "$type": "number", "$value": 1.2 } }
{ "leading.normal": { "$type": "number", "$value": 1.4 } }

// elevation shadow — lavender-tinted, never pure black
{ "shadow.elevation.1": { "$type": "shadow", "$value": "0 2px 6px rgb(86 87 172 / 0.12)" } }
{ "shadow.elevation.2": { "$type": "shadow", "$value": "0 4px 12px rgb(86 87 172 / 0.18)", "$description": "Floating panels (ColorReplacePanel, ShadeRemapPanel)" } }

// motion
{ "duration.micro":    { "$type": "duration", "$value": "100ms" } }
{ "duration.standard": { "$type": "duration", "$value": "250ms" } }
{ "duration.large":    { "$type": "duration", "$value": "350ms", "$description": "Merge-apply success transition only" } }
{ "easing.state":      { "$type": "cubicBezier", "$value": "0, 0, 0.2, 1", "$description": "ease-out for all state changes" } }
```

---

### 1B. Tier 2 — Alias / Semantic Tokens

These encode design *intent*. The CSS custom properties in the `:root` block are the implementation form. Add these to the existing DESIGN.md `:root` block (the existing `--background`, `--surface`, etc. are already Tier 2; this section extends them).

```css
:root {
  /* ── Already in DESIGN.md — carry forward unchanged ── */
  --background:         var(--neutral-1);    /* #fdfcfc */
  --surface:            var(--neutral-2);    /* #faf8f8 */
  --surface-hover:      var(--neutral-3);    /* #f3f0ee */
  --surface-active:     var(--neutral-4);    /* #ebe7e5 */
  --border-subtle:      var(--neutral-6);    /* decorative only */
  --border:             var(--neutral-7);    /* non-interactive dividers */
  --border-interactive: var(--neutral-10);   /* functional edges — 3.46:1 on surface */
  --text-secondary:     var(--neutral-11);
  --text:               var(--neutral-12);
  --accent-bg-subtle:   var(--accent-3);
  --accent-solid:       var(--accent-9);
  --accent-solid-hover: var(--accent-10);
  --accent-text:        var(--accent-11);
  --accent-muted:       var(--accent-7);

  /* ── NEW in Phase 3 — add these ── */

  /* surface extensions */
  --surface-raised:     var(--neutral-2);    /* floating panels — same value, elevated by shadow */
  
  /* border extensions */
  --border-focus:       var(--accent-9);     /* focus ring color — matches accent-solid */

  /* text extensions */
  --text-disabled:      var(--neutral-8);    /* #b4a8a4 — disabled labels and values */
  --text-placeholder:   var(--neutral-8);    /* same — empty state text */
  --text-on-accent:     var(--accent-on-solid); /* #f9faff — text on accent-solid bg */

  /* accent extensions */
  --accent-emphasis:    var(--accent-12);    /* #292b45 — strong accent, very rare */

  /* interactive state layers (background behind interactive controls) */
  --interactive-bg:             transparent;
  --interactive-bg-hover:       var(--neutral-3);
  --interactive-bg-active:      var(--neutral-4);
  --interactive-bg-accent:      var(--accent-9);
  --interactive-bg-accent-hover:var(--accent-10);
  --interactive-bg-disabled:    var(--neutral-4);

  /* status colors (for functional feedback only — never decorative) */
  --status-error:       var(--error-9);
  --status-error-text:  var(--error-11);
  --status-success:     var(--success-9);
  --status-success-text:var(--success-11);
  --status-warning:     var(--warning-9);
  --status-warning-text:var(--warning-11);
  --status-info:        var(--info-9);
  --status-info-text:   var(--info-11);

  /* spatial tokens */
  --gap-inline:   4px;   /* gap between icon + label, icon + icon */
  --gap-section:  8px;   /* gap between tool-panel sections */
  --gap-item:     3px;   /* gap between items in a grid (tool-grid, palette-grid) */
  --pad-control:  6px 8px; /* padding inside buttons and compact controls */
  --pad-panel:    8px;   /* padding inside side panels */
  --pad-modal:    16px;  /* padding inside floating panels */

  /* type tokens */
  --font-display: 'Silkscreen', monospace;
  --font-body:    -apple-system, 'Malgun Gothic', 'Apple SD Gothic Neo', 'Segoe UI', sans-serif;
  --font-mono:    monospace;
  --text-2xs:  10px;
  --text-xs:   11px;
  --text-sm:   12px;   /* minimum floor for interactive element labels */
  --text-base: 14px;
  --text-lg:   16px;
  --text-xl:   20px;
  --text-2xl:  28px;
  --leading-tight:  1.2;
  --leading-normal: 1.4;

  /* canvas-specific constants — NOT part of the color system */
  /* These surfaces exist to provide checkerboard contrast for the pixel canvas.
     They do not map to the palette. Per plan constraint, canvas rendering internals are untouched. */
  --canvas-void:  #111111;    /* dark canvas background for pixel editor and mini-canvases */
  --canvas-alt:   #0e0e0e;    /* result canvas dark background */
  --canvas-grid:  rgba(255, 255, 255, 0.07); /* pixel grid line on dark canvas */

  /* skinA / skinB selection overlay colors — canvas-functional, NOT theme colors */
  --merge-sel-a: rgba(80, 150, 255, 0.95);  /* blue — skinA selection */
  --merge-sel-b: rgba(255, 160, 40, 0.95);  /* orange — skinB selection */
}
```

**Accent-scarcity rule (from DESIGN.md Signature move):** `--accent-solid`, `--interactive-bg-accent`, and `--border-focus` appear ONLY on:
- Active tool state
- ON toggle state
- Primary CTA buttons ("입히기", "적용")
- Focus ring

Nowhere else. Panel backgrounds, decorative borders, inactive icons, and header chrome: no accent.

---

### 1C. Tier 3 — Component Tokens

Component tokens are defined locally in the component's own rule block. They reference Tier 2 tokens via `var()`. This provides a single point of change if a component needs to be restyled.

**Convention:** `--[component]-[property]-[state]`
Where state is omitted for the default (resting) state.

```css
/* ── Button (mc-btn) ── */
.mc-btn {
  --btn-bg:             var(--surface-active);      /* resting bg — was --mc-panel #8b8b8b */
  --btn-bg-hover:       var(--surface-hover);       /* hover */
  --btn-bg-active:      var(--surface);             /* pressed */
  --btn-bg-on:          var(--interactive-bg-accent);  /* .active state — lavender */
  --btn-bg-disabled:    var(--interactive-bg-disabled);
  --btn-color:          var(--text);
  --btn-color-on:       var(--text-on-accent);
  --btn-color-disabled: var(--text-disabled);
  --btn-border:         var(--border-interactive);
  --btn-radius:         var(--radius-sm, 6px);
  --btn-font-size:      var(--text-sm);   /* 12px — font floor */
  --btn-font:           var(--font-body);
  --btn-pad:            var(--pad-control);
  --btn-min-h:          24px;
  --btn-min-w:          24px;
}

/* ── Primary CTA Button (accent variant) ── */
.mc-btn.primary {
  --btn-bg:        var(--interactive-bg-accent);
  --btn-bg-hover:  var(--interactive-bg-accent-hover);
  --btn-color:     var(--text-on-accent);
  --btn-border:    var(--accent-solid);
  --btn-font:      var(--font-display);   /* Silkscreen for CTA labels ≥12px */
}

/* ── Tool Button (tool-btn, extends mc-btn) ── */
.tool-btn {
  --tool-icon-size: var(--text-base);   /* 14px for SVG icons */
  --tool-label-size: var(--text-sm);    /* 12px */
  --tool-label-font: var(--font-body);
  --tool-pad:        6px 4px;
  --tool-gap:        var(--gap-inline);
}

/* ── Input (mc-input) ── */
.mc-input {
  --input-bg:       var(--surface-active);
  --input-color:    var(--text);
  --input-border:   var(--border-interactive);
  --input-border-focus: var(--border-focus);   /* accent ring on focus */
  --input-font:     var(--font-mono);
  --input-font-size: var(--text-sm);   /* 12px */
  --input-radius:   var(--radius-sm, 6px);
  --input-pad:      3px 5px;
}

/* ── Color Swatch (palette-swatch, current-swatch) ── */
.palette-swatch, .current-swatch {
  --swatch-min-size: 24px;   /* target size floor */
  --swatch-radius:   var(--radius-sm, 6px);
  --swatch-focus-ring: var(--border-focus);
  --swatch-hover-ring: var(--border-interactive);
}

/* ── Toggle Switch (guide-bar / skin-type) ── */
.toggle-track {
  --toggle-bg:      var(--border-interactive);   /* #90837f — off state */
  --toggle-bg-on:   var(--accent-solid);          /* lavender — on state */
  --toggle-border:  var(--border);
  --toggle-radius:  9px;
  --toggle-w:       36px;
  --toggle-h:       18px;
}
.toggle-thumb {
  --thumb-bg:       var(--neutral-8, #b4a8a4);
  --thumb-bg-on:    var(--text-on-accent);
  --thumb-size:     12px;
}

/* ── Panel Label ── */
.panel-label {
  --label-font:     var(--font-body);
  --label-size:     var(--text-sm);   /* 12px — raised from 0.6rem=9.6px */
  --label-color:    var(--text-secondary);
  --label-weight:   600;
  --label-tracking: 0.4px;
  --label-transform: uppercase;
}

/* ── Section Label in Merge View (merge-section-label) ── */
.merge-section-label {
  --merge-label-font:  var(--font-body);
  --merge-label-size:  var(--text-sm);   /* 12px — raised from 0.6rem=9.6px */
  --merge-label-color: var(--text-secondary);
}

/* ── Tooltip (js-tooltip) ── */
.js-tooltip {
  --tip-bg:      var(--surface-active);          /* cream panel — replaces dark rgba */
  --tip-color:   var(--text);
  --tip-border:  var(--border);
  --tip-font:    var(--font-body);
  --tip-size:    var(--text-xs);   /* 11px — tooltip hint is non-interactive, xs allowed */
  --tip-radius:  var(--radius-sm, 6px);
  --tip-shadow:  var(--shadow-elevation-1, 0 2px 6px rgb(86 87 172 / 0.12));
}

/* ── Side Panel container ── */
.side-panel {
  --side-bg:       var(--surface);
  --side-border:   var(--border);
  --side-shadow:   none;   /* inline panel, not floating */
}

/* ── Tool Panel ── */
.tool-panel {
  --tool-panel-bg:     var(--surface);
  --tool-panel-border: var(--border);
  --tool-panel-pad:    var(--pad-panel);
}

/* ── Color Panel ── */
.color-panel {
  --color-panel-bg:  var(--surface);
  --color-panel-pad: var(--pad-panel);
  --color-panel-gap: var(--gap-section);
}

/* ── Floating Panel (ColorReplacePanel, ShadeRemapPanel) ── */
.cr-modal {
  --floating-bg:     var(--surface-raised);
  --floating-border: var(--border-interactive);
  --floating-radius: var(--radius-md, 10px);
  --floating-shadow: var(--shadow-elevation-2, 0 4px 12px rgb(86 87 172 / 0.18));
  --floating-pad:    var(--pad-modal);
}
.cr-header {
  --modal-header-bg:      var(--surface-active);
  --modal-header-border:  var(--border);
  --modal-header-color:   var(--text);
  --modal-header-font:    var(--font-display);   /* Silkscreen for panel title */
  --modal-header-size:    var(--text-sm);        /* 12px */
}

/* ── Header ── */
.mc-header {
  --header-bg:      var(--surface);
  --header-border:  var(--border);
  --header-shadow:  var(--shadow-elevation-1);
}
.mc-title {
  --logo-font:  var(--font-display);
  --logo-size:  var(--text-2xl);   /* 28px Silkscreen */
  --logo-color: var(--text);
}
.mc-menu-btn {
  --menu-btn-font:    var(--font-body);
  --menu-btn-size:    var(--text-sm);   /* 12px — was 0.8rem=12.8px, stays compliant */
  --menu-btn-color:   var(--text);
  --menu-btn-bg-hover:var(--interactive-bg-hover);
  --menu-btn-radius:  var(--radius-sm, 6px);
  --menu-btn-min-h:   24px;
}
.mc-dropdown {
  --dropdown-bg:     var(--surface-raised);
  --dropdown-border: var(--border);
  --dropdown-shadow: var(--shadow-elevation-2);
  --dropdown-radius: 0 0 var(--radius-sm, 6px) var(--radius-sm, 6px);
}
.mc-dropdown-item {
  --item-font:   var(--font-body);
  --item-size:   var(--text-sm);   /* 12px */
  --item-color:  var(--text);
  --item-hover:  var(--interactive-bg-hover);
  --item-pad:    6px 14px;
  --item-min-h:  28px;   /* dropdown items: 28px for comfortable click target */
}
.mc-dropdown-shortcut {
  --shortcut-size:  var(--text-xs);   /* 11px — meta hint, non-interactive */
  --shortcut-color: var(--text-secondary);
}

/* ── Merge View ── */
.merge-bar {
  --merge-bar-bg:     var(--surface-active);
  --merge-bar-border: var(--border);
}
.merge-bar-title {
  --merge-title-font: var(--font-display);   /* Silkscreen */
  --merge-title-size: var(--text-sm);        /* 12px */
  --merge-title-color:var(--text);
}
.merge-footer {
  --footer-bg:     var(--surface-active);
  --footer-border: var(--border);
}
.merge-hint {
  --hint-font:  var(--font-body);
  --hint-size:  var(--text-sm);    /* 12px — raised from 0.62rem=9.92px */
  --hint-color: var(--text-secondary);
}

/* ── Guide Bar ── */
.guide-bar {
  --guide-bg:     var(--surface-active);
  --guide-border: var(--border);
  /* NOTE: backdrop-filter: blur() is removed per DESIGN.md Never list (decorative blur ban) */
}
.guide-bar-label {
  --guide-label-font: var(--font-body);
  --guide-label-size: var(--text-sm);    /* 12px — raised from 0.62rem=9.92px */
  --guide-label-color:var(--text-secondary);
}
.guide-type-label {
  --guide-type-size:  var(--text-sm);    /* 12px — raised from 0.72rem=11.52px */
  --guide-type-font:  var(--font-body);
  --guide-type-color: var(--text-secondary);
  --guide-type-color-active: var(--text);
}

/* ── Resize Handles ── */
.resize-handle, .merge-resize-h, .merge-resize-v {
  --handle-bg:       var(--border);
  --handle-bg-hover: var(--accent-solid);   /* lavender on hover — within accent-scarcity rule (interactive signal) */
  --handle-line:     var(--border-subtle);
}

/* ── Tip Banner ── */
.tip-banner {
  --tip-banner-bg:     var(--surface-active);  /* cream semi-transparent replaces black */
  --tip-banner-radius: var(--radius-sm, 6px);
}
.tip-text {
  --tip-text-font:  var(--font-body);
  --tip-text-size:  var(--text-sm);    /* 12px — raised from 0.62rem=9.92px */
  --tip-text-color: var(--text-secondary);
}

/* ── Viewer Controls (3D viewer overlay buttons) ── */
.viewer-btn {
  --viewer-btn-bg:       var(--surface-active);
  --viewer-btn-bg-hover: var(--surface-hover);
  --viewer-btn-bg-on:    var(--interactive-bg-accent);
  --viewer-btn-border:   var(--border-interactive);
  --viewer-btn-color:    var(--text);
  --viewer-btn-size:     36px;   /* existing — above 24px floor */
  --viewer-btn-radius:   var(--radius-sm, 6px);
}

/* ── Palette Tab ── */
.tab-btn {
  --tab-font:   var(--font-body);
  --tab-size:   var(--text-sm);   /* 12px — raised from 0.62rem=9.92px */
  --tab-color:  var(--text-secondary);
  --tab-active-color: var(--text);
  --tab-active-border: var(--accent-solid);
}

/* ── Shade Remap Slider ── */
.shade-slider {
  --slider-accent: var(--accent-solid);   /* replaces hard-coded #6677dd */
}
.shade-tolerance-label {
  --tol-label-font:  var(--font-body);
  --tol-label-size:  var(--text-sm);   /* 12px — raised from 0.63rem=10.08px */
  --tol-label-color: var(--text-secondary);
}
.shade-tolerance-section-label {
  --tol-section-font:  var(--font-body);
  --tol-section-size:  var(--text-sm);   /* 12px — raised from 0.6rem=9.6px */
  --tol-section-color: var(--text-secondary);
}

/* ── Selection Mode Button (sel-mode-btn) ── */
.sel-mode-btn {
  --sel-btn-font: var(--font-body);
  --sel-btn-size: var(--text-sm);   /* 12px — raised from 0.67rem=10.72px */
}

/* ── Selection Clear Button (sel-clear-btn) ── */
.sel-clear-btn {
  --clear-bg:       var(--status-error);   /* replaces hard-coded #7a5555 */
  --clear-bg-hover: var(--error-11, #86534f);
  --clear-color:    var(--text-on-accent);
  --clear-size:     var(--text-sm);   /* 12px — raised from 0.65rem=10.4px */
}

/* ── Scrollbar (palette-grid) ── */
.palette-grid::-webkit-scrollbar { width: 6px; }
.palette-grid::-webkit-scrollbar-track { background: var(--surface-active); }
.palette-grid::-webkit-scrollbar-thumb { background: var(--border-interactive); border-radius: 3px; }
```

---

## 2. Atomic Component Decomposition

Frost atomic design (2013): atoms → molecules → organisms. Canvas-rendering components (PixelEditor, SkinViewer3D, ResultCanvas, MiniCanvas internals) are black-box organisms — surface tokens only, canvas internals untouched.

### Atoms

| Atom | Class(es) | Tokens consumed | Notes |
|------|-----------|----------------|-------|
| **Button** | `.mc-btn` | `--btn-bg`, `--btn-color`, `--btn-border`, `--btn-radius`, `--btn-font-size`, `--btn-min-h`, `--btn-min-w` | Base of all interactive controls. Variant `.primary` for accent CTA. |
| **Input** | `.mc-input` | `--input-bg`, `--input-color`, `--input-border`, `--input-border-focus`, `--input-font`, `--input-font-size`, `--input-radius` | Text inputs, hex fields, size fields. Always body font + mono for hex. |
| **ColorSwatch** | `.palette-swatch`, `.current-swatch`, `.cr-slot` | `--swatch-min-size`, `--swatch-radius`, `--swatch-hover-ring`, `--swatch-focus-ring` | Solid-fill square representing a color. Min-size: 24×24px. |
| **Icon** | `.tool-icon`, SVG `<svg>` elements | Inherits `currentColor` from parent | All icons are inline SVG at 12×12 viewport (see Section 3). Never emoji. |
| **Label** | `.panel-label`, `.setting-label`, `.guide-bar-label`, `.merge-section-label`, `.shade-tolerance-section-label` | `--label-font`, `--label-size`, `--label-color`, `--label-weight` | Text-only, non-interactive. All at `--text-sm` (12px) in `--font-body`. |
| **Tooltip** | `.js-tooltip` | `--tip-bg`, `--tip-color`, `--tip-border`, `--tip-font`, `--tip-size` | Positioned overlay. Text at `--text-xs` (11px) — non-interactive, xs allowed. |

### Molecules

| Molecule | Composed of | Class(es) | Key token additions | Notes |
|----------|-------------|-----------|-------------------|-------|
| **ToolButton** | Icon atom + Label atom | `.tool-btn` extends `.mc-btn` | `--tool-icon-size`, `--tool-label-size`, `--tool-pad`, `--tool-gap` | Stacked (column). Active state: `--btn-bg-on` (accent-solid). 3-column grid. |
| **ToggleSwitch** | toggle-track + toggle-thumb (no atom decomposition — purely CSS) | `.toggle-switch`, `.toggle-track`, `.toggle-thumb` | `--toggle-bg`, `--toggle-bg-on`, `--thumb-bg`, `--thumb-bg-on` | OFF: `--border-interactive` track. ON: `--accent-solid` track (accent-scarcity: toggle ON is an active state). |
| **PaletteSlot** | ColorSwatch atom | `.palette-swatch` | `--swatch-min-size: 24px` | Pin indicator (`.pinned::before`) uses `--status-error` red corner instead of hard-coded `#ff5533`. |
| **SelectionModeButton** | Icon atom + Label atom | `.sel-mode-btn` extends `.mc-btn` | `--sel-btn-font`, `--sel-btn-size` | Horizontal (row). Icon is Unicode mathematical symbol — no replacement needed for `⬚`, `⊕`, `⊖`. |
| **ColorSlot** | ColorSwatch atom + Button atom (eyedropper) + Input atom (hex) | `.cr-slot`, `.cr-slot-plus` | `--floating-border` when picking active; `--accent-solid` when slot is in picking state | Compound within FloatingPanel organism. Picking state: border becomes `--border-focus` (accent). |
| **BrushSizeControl** | Button atom (‹, ›) + Input atom (size-input) | `.brush-row`, `.size-arrow`, `.size-input` | `--btn-min-h: 24px; --btn-min-w: 24px` | Size arrows must be raised from 20×22px to 24×24px (see Section 5). |

### Organisms

| Organism | Composed of | Class(es) | Surface token | Canvas internal? |
|----------|-------------|-----------|--------------|-----------------|
| **ToolPanel** | ToolButton molecule ×6 + BrushSizeControl molecule + wand options + SelectionModeButton molecules | `.tool-panel` | `--tool-panel-bg: var(--surface)` | No |
| **ColorPanel** | ColorSwatch atom + Input atom + HexColorPicker (third-party widget) + PaletteSlot molecules | `.color-panel` | `--color-panel-bg: var(--surface)` | No |
| **Header** | Logo img + h1 Title + nav MenuItems + Dropdowns | `.mc-header`, `.mc-nav`, `.mc-dropdown` | `--header-bg: var(--surface)` | No |
| **FloatingPanel** | (ColorReplacePanel / ShadeRemapPanel) — draggable header + ColorSlot molecules + slider inputs + Button atom (CTA) | `.cr-modal`, `.cr-header`, `.cr-body` | `--floating-bg: var(--surface-raised)` | No |
| **SkinMergeModal** | merge-bar (merge-back Button, title Label, hints) + ResultCanvas + resizeH + skinA half (section label, MiniCanvas, upload Button) + skinB half + merge-footer (hint Label, 입히기 Button) | `.merge-view`, `.merge-bar`, `.merge-footer` | `--merge-bar-bg: var(--surface-active)` | Canvas internals (MiniCanvas, ResultCanvas) untouched |

**Template:** Main Editor = Header organism + viewer-panel (SkinViewer3D surface only) + canvas-area (PixelEditor surface + GuideBar molecule + TipBanner) + side-panel (ToolPanel organism + ColorPanel organism) + FloatingPanels (optional)

---

## 3. Icon Replacement List

**Policy:** 0 emoji anywhere. SVG inline at 12×12px viewport with `fill="currentColor"` (inherits parent text color automatically). Unicode mathematical/geometric symbols are acceptable where they do not have an emoji rendering path.

### Tool icons (ToolPanel.jsx — `tools` array)

| Tool | Current | Risk | Replacement | Form |
|------|---------|------|-------------|------|
| 브러쉬 (pen) | `✏️` U+270F+FE0F | EMOJI — pencil with variation selector FE0F forces emoji rendering | Inline SVG pencil | SVG (see below) |
| 지우개 (eraser) | `⬜` U+2B1C | EMOJI-RISK — renders as large color emoji on Apple/Google platforms | Inline SVG rectangle | SVG (see below) |
| 채우기 (fill) | `🪣` U+1FAA3 | EMOJI — bucket | Inline SVG bucket | SVG (see below) |
| 스포이드 (eyedropper) | `🔍` U+1F50D | EMOJI — magnifying glass | Inline SVG magnifier | SVG (see below) |
| 사각선택 (rect-select) | `⬚` U+2B1A | SAFE — Dotted Square in Mathematical Symbols block; no emoji rendering path | `⬚` keep | Unicode |
| 마법봉 (magic-wand) | `✦` U+2726 | BORDERLINE — Four Pointed Star; some platforms show color variant. Use SVG for safety | Inline SVG 4-point star | SVG (see below) |

### Selection mode icons (ToolPanel.jsx — `SEL_MODES` array)

| Mode | Current | Verdict |
|------|---------|---------|
| 교체 (replace) | `⬚` U+2B1A | SAFE — keep |
| 합집합 (union) | `⊕` U+2295 | SAFE — mathematical circled plus, no emoji path |
| 차집합 (diff) | `⊖` U+2296 | SAFE — mathematical circled minus, no emoji path |

### Tooltip string (ToolPanel.jsx — merge-disabled tooltip)

| Location | Current | Replacement |
|----------|---------|-------------|
| `mergeDisabled` tooltip text | `'🚫 옷입히기 모드 비활성'` | `'× 옷입히기 모드 비활성'` — U+00D7 MULTIPLICATION SIGN (plain text, no emoji risk) |

### Inline SVG definitions (paste into JSX)

All SVGs: `width="12" height="12" viewBox="0 0 12 12"`. Use inside `<span className="tool-icon">`.

**Pencil (브러쉬 / pen):**
```jsx
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
     fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M8 1.5 L10.5 4 L3.5 11 L1 11 L1 8.5 Z" />
  <path d="M6.5 3 L9 5.5" />
</svg>
```

**Rectangle (지우개 / eraser):**
```jsx
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
     fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
  <rect x="1.5" y="3" width="9" height="6" rx="1" />
  <path d="M6 3 L6 9" strokeWidth="0.8" strokeDasharray="1.5 1" />
</svg>
```

**Bucket (채우기 / fill):**
```jsx
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
     fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M2.5 2 L7 6.5 Q8 7.5 7 8.5 L5.5 10 Q4.5 11 3.5 10 L2 8.5 Q1 7.5 2 6.5 Z" />
  <path d="M7 6.5 L9.5 4 L8 2.5" />
  <circle cx="10" cy="9.5" r="1" fill="currentColor" stroke="none" />
</svg>
```

**Magnifier (스포이드 / eyedropper):**
```jsx
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
     fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="5" cy="5" r="3.5" />
  <path d="M7.5 7.5 L11 11" strokeWidth="1.6" />
</svg>
```

**Four-pointed star (마법봉 / magic-wand):**
```jsx
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
     fill="currentColor">
  <path d="M6 1 L6.7 5.3 L11 6 L6.7 6.7 L6 11 L5.3 6.7 L1 6 L5.3 5.3 Z" />
</svg>
```

---

## 4. Migration Map — `--mc-*` → Semantic Tokens

### Root variable replacements

Remove all `--mc-*` declarations from `:root`. Replace every usage in CSS rules per this map.

| Old variable | Old hex | New token | New value | Notes |
|-------------|---------|-----------|-----------|-------|
| `--mc-dark` | `#1d1d1d` | `var(--background)` | `#fdfcfc` | App chrome background. Dark canvas areas (`#0e0e0e`, `#111`, `#1a1a1a`) keep their values as `--canvas-void` and `--canvas-alt` constants — they are canvas surfaces, not chrome. |
| `--mc-bg` | `#3a3a3a` | `var(--surface)` | `#faf8f8` | Panel backgrounds. |
| `--mc-panel` | `#8b8b8b` | `var(--surface-active)` | `#ebe7e5` | Button resting background, slot fills. |
| `--mc-light` | `#c6c6c6` | `var(--surface-hover)` | `#f3f0ee` | Side-panel background (`.side-panel`), lighter fills. |
| `--mc-lighter` | `#dbdbdb` | `var(--surface-hover)` | `#f3f0ee` | Button hover state (`.mc-btn:hover`). |
| `--mc-border-light` | `#ffffff` | `var(--border-subtle)` | `#d9d0cd` | Pure white border removed — warm subtle border. |
| `--mc-border-dark` | `#373737` | `var(--border)` | `#cbc1be` | Dark border removed — warm mid-tone border. |
| `--mc-text` | `#1a1a1a` | `var(--text)` | `#312d2b` | Primary text. Never pure black. |
| `--mc-text-light` | `#f0f0f0` | `var(--text-on-accent)` | `#f9faff` | Used on dark surfaces — in new design, light text appears only on `--accent-solid` CTA backgrounds. On the cream surface, always use `--text`. |
| `--mc-accent` | `#555577` | `var(--accent-solid)` | `#5657ac` | Old muted purple → new lavender. |
| `--mc-slot` | `#8b8b8b` | `var(--surface-active)` | `#ebe7e5` | Duplicate of `--mc-panel`. |
| `--side-w` | `210px` | keep as `--side-w: 210px` | — | Layout variable, not a design token. Keep. |
| `--viewer-w` | `360px` | keep as `--viewer-w: 360px` | — | Layout variable, not a design token. Keep. |

### One-off inline hex replacements

| Where in App.css | Old hex | New token | Rationale |
|-----------------|---------|-----------|-----------|
| `.resize-handle:hover`, `.merge-resize-h:hover`, `.merge-resize-v:hover` | `#5566aa` | `var(--accent-solid)` | Resize handle hover — interactive signal, accent-scarcity compliant |
| `.toggle-switch input:checked + .toggle-track` | `#5577cc` | `var(--accent-solid)` | Toggle ON — active state, accent-scarcity compliant |
| `.mc-input:focus` border | `#8888cc` | `var(--border-focus)` / `var(--accent-solid)` | Focus ring → standard focus token |
| `.wand-option input[type="checkbox"]` accent-color | `#555577` | `var(--accent-solid)` | Checkbox accent color |
| `.shade-slider` accent-color | `#6677dd` | `var(--accent-solid)` | Slider fill → accent-solid |
| `.cr-slot` picking active border | `#6677dd` | `var(--border-focus)` | Slot active ring → standard focus token |
| `.sel-clear-btn` background | `#7a5555` | `var(--status-error)` | Selection clear — destructive action → error status color |
| `.sel-clear-btn:hover` | `#9a6060` | `var(--error-11, #86534f)` | Hover on error button → darker error tone |
| `.mc-btn.active` | `background: #a0a0b0; color: #111133` | `background: var(--interactive-bg-accent); color: var(--text-on-accent)` | Active tool → accent-solid fill |
| `body.picking-color` body bg | — | add `cursor: crosshair` only — no color | Background unchanged; cursor is the signal |

### Canvas-specific colors — DO NOT migrate

The following colors appear in SkinMergeModal.jsx and PixelEditor canvas rendering. They must NOT be mapped to design-system tokens:

| Value | Location | Reason to keep |
|-------|----------|---------------|
| `#1a1a1a` | MiniCanvas fillRect (no skin loaded) | Canvas void fill — visual surface for pixel art |
| `#111` | ResultCanvas fillRect (no merged skin) | Canvas void fill |
| `rgba(255,255,255,0.07)` | `drawGrid()` grid lines | Pixel grid on dark canvas — intentional low-contrast |
| `rgba(80,150,255,0.95)` | skinA selection overlay | Selection feedback on dark canvas — functional signal, not chrome |
| `rgba(255,160,40,0.95)` | skinB selection overlay | Selection feedback on dark canvas — functional signal, not chrome |
| `rgba(80,150,255,0.25)` | 입히기 button active bg in merge footer | **EXCEPTION:** This should be migrated → `var(--accent-bg-subtle)` or `rgba(86, 87, 172, 0.15)` using the accent palette. The blue tint is a remnant of the old palette. |

### Body class remnants — remove or restyle

| Old class | Old style | New approach |
|----------|-----------|--------------|
| `body.picking-color` | `cursor: crosshair` | Keep cursor, remove any bg or color overrides |
| `body.resizing-viewer` | `cursor: col-resize; user-select: none` | Keep as-is — functional |
| `body.resizing-row` | `cursor: row-resize; user-select: none` | Keep as-is — functional |
| `body.resizing-col` | `cursor: col-resize; user-select: none` | Keep as-is — functional |

---

## 5. Target Size & Font Floor Enforcement

### Interactive element target-size violations (minimum 24×24px)

| Element | Class | Current size | Fix |
|---------|-------|-------------|-----|
| Brush size dec/inc | `.size-arrow` | `width: 20px; height: 22px` | Change to `width: 24px; height: 24px; padding: 0; display: flex; align-items: center; justify-content: center;` |
| Palette swatch | `.palette-swatch` | `min-height: 20px; aspect-ratio: 1` | Change to `min-height: 24px; min-width: 24px` |
| Guide bar undo/redo | `.guide-bar-btn` | `height: 22px` | Change to `height: 24px; min-width: 24px` |
| Panel close button | `.cr-close` | No explicit size | Add `width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm, 6px);` |

**Already compliant (no change needed):**
- `.shape-btn`: 26×26px — OK
- `.current-swatch`: 32×32px — OK
- `.viewer-btn`: 36×36px — OK
- `.tool-btn`: ~62×46px (calculated from grid + padding) — OK
- `.cr-slot`: 52×52px — OK
- `label.toggle-switch` (wrapping label): encompasses track + thumb, click area ≥44px — OK

**Note on checkbox (`wand-option input`):** Native checkboxes are typically 16px. The wrapping `<label>` provides a click area extending to the label text. For accessibility, add `min-height: 24px` to `.wand-option` and `align-items: center` to ensure the touch target meets the floor.

```css
/* Add to .wand-option */
.wand-option {
  min-height: 24px;
  align-items: center;
}
```

### Font-size violations (minimum 12px for all text)

All elements below use `--text-sm` (12px) in `--font-body` after migration. Silkscreen is never used below 12px.

| Selector | Current rem | Current px | Replacement |
|----------|------------|-----------|-------------|
| `.panel-label` | 0.60rem | 9.6px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.tool-label` | 0.60rem | 9.6px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.guide-bar-label` | 0.62rem | 9.9px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.setting-label` | 0.62rem | 9.9px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.tab-btn` | 0.62rem | 9.9px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.tip-text` | 0.62rem | 9.9px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.merge-hint` | 0.62rem | 9.9px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.shade-tolerance-label` | 0.63rem | 10.1px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.mc-dropdown-shortcut` | 0.65rem | 10.4px | `font-size: var(--text-xs); font-family: var(--font-body)` ← shortcut meta, non-interactive — xs (11px) OK |
| `.file-btn` | 0.65rem | 10.4px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.sel-clear-btn` | 0.65rem | 10.4px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.palette-empty` | 0.65rem | 10.4px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.merge-upload-btn` | 0.66rem | 10.6px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.sel-mode-btn` | 0.67rem | 10.7px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.sel-mode-label` | 0.67rem | 10.7px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.merge-back-btn` | 0.68rem | 10.9px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.wand-option` | 0.70rem | 11.2px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.guide-type-label` | 0.72rem | 11.5px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.mc-btn` (base) | 0.72rem | 11.5px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.merge-section-label` | 0.60rem | 9.6px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.shade-tolerance-section-label` | 0.60rem | 9.6px | `font-size: var(--text-sm); font-family: var(--font-body)` |
| `.merge-mode-hints kbd` | 0.58rem | 9.3px | `font-size: var(--text-xs); font-family: var(--font-body)` ← keyboard hint, non-interactive — xs (11px) OK |

**Already compliant (no font change needed):**
- `.mc-menu-btn`: 0.80rem = 12.8px — OK (rounds above floor)
- `.mc-input`: 0.78rem = 12.5px — OK
- `.merge-tool-btn`: 0.75rem = 12px — OK (at floor exactly)
- `.merge-bar-title`: 0.75rem = 12px — OK (change to Silkscreen per component token spec)
- `.cr-header span`: 0.80rem = 12.8px — OK (change to Silkscreen per component token spec)

**Silkscreen applications (≥12px contexts where display font applies):**
- `.mc-title` (logo): 28px — `font-family: var(--font-display)`
- `.cr-header span` (panel title): 12px — `font-family: var(--font-display)`
- `.merge-bar-title`: 12px — `font-family: var(--font-display)`
- Primary CTA button (입히기, 적용): 12px — `font-family: var(--font-display)`
- Panel section headers where clarity needs the pixel-grid identity: 12px — `font-family: var(--font-display)`

---

## 6. Hover / Active State Lightness Deltas

Constraint: Hover/active state color changes ≤ 20% HSL lightness delta. Computed using HSL L value.

| Transition | From hex | L₁ (HSL) | To hex | L₂ (HSL) | Delta | Pass? |
|-----------|---------|---------|-------|---------|-------|-------|
| surface → surface-hover | `#faf8f8` | 97.6% | `#f3f0ee` | 94.3% | **3.3%** | PASS |
| surface → surface-active | `#faf8f8` | 97.6% | `#ebe7e5` | 91.0% | **6.6%** | PASS |
| accent-solid → accent-solid-hover | `#5657ac` | 50.6% | `#474796` | 43.3% | **7.3%** | PASS |
| border-interactive → border-focus | `#90837f` | 52.5% | `#5657ac` | 50.6% | **1.9%** | PASS (different hue, similar L) |
| interactive-bg-accent → interactive-bg-accent-hover | `#5657ac` | 50.6% | `#474796` | 43.3% | **7.3%** | PASS |
| surface-active → surface-hover (toggle OFF bg) | `#90837f` | 52.5% | `#5657ac` | 50.6% | **1.9%** | PASS |

All six transition pairs are within the ≤20% lightness delta constraint. The largest delta (7.3%) occurs on the accent-solid button, which is the most intentional state change in the system (active lavender CTA). Still well within range.

**How deltas were computed:**
HSL lightness L = (max(R,G,B) + min(R,G,B)) / 2 in 0–100% scale. Values are for sRGB (not gamma-expanded). Delta = |L₁ − L₂|.

---

## 7. Per-Component Implementation Specs

Implementation guidance for each component class in `App.css`. Each entry states what changes, what stays, and why.

### App / Body

```css
body {
  background: var(--background);   /* was: var(--mc-dark)=#1d1d1d → now: #fdfcfc */
  font-family: var(--font-body);   /* was: 'Segoe UI', system-ui, sans-serif → body stack */
  color: var(--text);              /* add: ensure base color cascades */
}

.app {
  background: var(--background);   /* was: var(--mc-dark) */
}
```

### Header

```css
.mc-header {
  background: var(--surface);              /* was: var(--mc-bg) */
  border-bottom: 1px solid var(--border);  /* was: 3px solid mc-border-dark */
  /* REMOVE: inset box-shadow (bevel effect — GBA bevel is in Composition axis but the 3-pixel inset bevel is the old dark theme's tell. In the new system, a single 1px border suffices.) */
  box-shadow: var(--shadow-elevation-1);   /* subtle lavender drop shadow instead */
}

.mc-title {
  font-family: var(--font-display);   /* Silkscreen */
  font-size: var(--text-2xl);         /* 28px */
  color: var(--text);
  /* REMOVE: text-shadow (was: 2px 2px 0 #000 — dark-mode tell) */
  letter-spacing: 1px;                /* keep */
}

.mc-menu-btn {
  color: var(--text);
  background: transparent;
  font-size: var(--text-sm);   /* 12px */
  min-height: 24px;
  border-radius: var(--radius-sm, 6px);
}
.mc-menu-btn:hover, .mc-menu-btn.active {
  background: var(--interactive-bg-hover);   /* was: rgba(255,255,255,0.15) */
}

.mc-dropdown {
  background: var(--surface-raised);
  border: 1px solid var(--border-interactive);   /* was: 2px solid mc-border-dark */
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  box-shadow: var(--shadow-elevation-2);          /* was: 2px 4px 0 rgba(0,0,0,0.5) */
}

.mc-dropdown-item {
  font-size: var(--text-sm);   /* 12px */
  color: var(--text);
  min-height: 28px;
}
.mc-dropdown-item:hover {
  background: var(--interactive-bg-hover);   /* was: rgba(255,255,255,0.12) */
}

.mc-dropdown-shortcut {
  font-size: var(--text-xs);         /* 11px */
  color: var(--text-secondary);      /* was: rgba(255,255,255,0.35) */
}
```

### Workspace + Panels

```css
.workspace {
  background: var(--background);   /* was: var(--mc-dark) */
}

.viewer-panel {
  background: var(--surface-active);  /* was: #2a2a2a */
  border: 1px solid var(--border);    /* was: 3px mc bevel borders */
  border-right: none;
}

.canvas-area {
  background: var(--surface-active);  /* was: #5a5a5a — provides contrast behind canvas */
  border: 1px solid var(--border);
}

.side-panel {
  background: var(--surface);
  border: 1px solid var(--border);    /* was: 3px bevel */
}
```

### Tool Panel

```css
.tool-panel {
  background: var(--surface);
  border-bottom: 1px solid var(--border);   /* was: 3px */
  padding: var(--pad-panel);
}

.panel-label {
  font-size: var(--text-sm);       /* 12px — raised from 0.6rem */
  font-family: var(--font-body);
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
```

### Button (mc-btn)

```css
.mc-btn {
  background: var(--surface-active);
  border: 1px solid var(--border-interactive);   /* was: 2px mc-border-dark */
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--text-sm);          /* 12px */
  border-radius: var(--radius-sm);    /* 6px */
  min-height: 24px;
  min-width: 24px;
  padding: 4px 6px;
  /* REMOVE: text-shadow */
  transition: background var(--duration-micro, 100ms) var(--easing-state, ease-out),
              border-color var(--duration-micro, 100ms) var(--easing-state, ease-out);
}
.mc-btn:hover {
  background: var(--surface-hover);   /* was: var(--mc-lighter) */
}
.mc-btn:active {
  background: var(--surface);         /* was: var(--mc-light) */
}
.mc-btn.active {
  background: var(--interactive-bg-accent);   /* lavender — was: #a0a0b0 */
  border-color: var(--accent-solid);
  color: var(--text-on-accent);
}
.mc-btn:disabled {
  opacity: 0.4;
  cursor: default;
  background: var(--interactive-bg-disabled);
}

/* Primary CTA variant (입히기, 적용) */
.mc-btn.primary {
  background: var(--interactive-bg-accent);
  color: var(--text-on-accent);
  border-color: var(--accent-solid);
  font-family: var(--font-display);   /* Silkscreen */
  font-size: var(--text-sm);
}
.mc-btn.primary:hover {
  background: var(--interactive-bg-accent-hover);
}
```

**JSX change for merge footer 입히기 button:** Remove the inline style `background: merged && selB?.size > 0 ? 'rgba(80,150,255,0.25)' : ''` and replace the button with `className="mc-btn primary"`.

### Tool Button (extends mc-btn)

```css
.tool-btn {
  flex-direction: column;
  gap: var(--gap-inline);   /* 4px */
  padding: 6px 4px;
}

.tool-icon {
  /* SVG inherits currentColor — no font-size change needed for SVG icons */
  /* For any remaining Unicode icons, set: */
  font-size: var(--text-base);   /* 14px for readable symbols */
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
}

.tool-label {
  font-size: var(--text-sm);    /* 12px */
  font-family: var(--font-body);
  color: inherit;               /* inherits from mc-btn color */
}
```

### Input (mc-input)

```css
.mc-input {
  background: var(--surface-active);     /* was: var(--mc-border-dark) */
  border: 1px solid var(--border-interactive);
  /* REMOVE: bevel effect (was: border-color mc-border-dark mc-border-light bevel) */
  color: var(--text);                    /* was: var(--mc-text-light) */
  font-family: var(--font-mono);
  font-size: var(--text-sm);             /* 12px */
  border-radius: var(--radius-sm);       /* add */
  padding: 3px 5px;
  outline: none;
}
.mc-input:focus {
  border-color: var(--border-focus);     /* was: #8888cc — now accent-solid */
  box-shadow: 0 0 0 2px var(--accent-bg-subtle);   /* soft focus ring */
}
```

### Color Swatch (palette-swatch, current-swatch)

```css
.palette-swatch {
  aspect-ratio: 1;
  min-height: 24px;   /* raised from 20px — meets target size floor */
  min-width: 24px;
  cursor: pointer;
  border: 1px solid var(--border);   /* REMOVE: none (invisible bordered swatches are inaccessible) */
  border-radius: var(--radius-sm);
}
.palette-swatch:hover {
  /* REMOVE: box-shadow inset bevel; REPLACE with: */
  box-shadow: 0 0 0 2px var(--border-focus);   /* focus-style ring on hover */
  z-index: 1;
}
.palette-swatch.pinned::before {
  background: linear-gradient(45deg, transparent 50%, var(--status-error) 50%);   /* was: #ff5533 */
}

.current-swatch {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-interactive);
  border-radius: var(--radius-sm);
}
.current-swatch:hover {
  box-shadow: 0 0 0 2px var(--border-focus);
}
```

### Toggle Switch

```css
.toggle-track {
  background: var(--border-interactive);   /* OFF state — was: #555 */
  border: 1px solid var(--border);
  border-radius: 9px;
  width: 36px;
  height: 18px;
  transition: background var(--duration-micro) var(--easing-state);
}
.toggle-switch input:checked + .toggle-track {
  background: var(--accent-solid);         /* ON state — was: #5577cc */
}

.toggle-thumb {
  background: var(--text-disabled);        /* was: #ccc */
  border-radius: 50%;
  width: 12px;
  height: 12px;
}
.toggle-switch input:checked + .toggle-track .toggle-thumb {
  background: var(--text-on-accent);       /* was: #ffffff */
}

.guide-type-label {
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--text-secondary);
  transition: color var(--duration-micro) var(--easing-state);
}
.guide-type-label.active {
  color: var(--text);
}
```

### Floating Panel (ColorReplacePanel / ShadeRemapPanel)

```css
.cr-modal {
  background: var(--surface-raised);
  border: 1px solid var(--border-interactive);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-elevation-2);
  /* REMOVE: 3px bevel borders */
  transition: opacity var(--duration-standard) var(--easing-state);
}

.cr-header {
  background: var(--surface-active);
  border-bottom: 1px solid var(--border);
  padding: 6px 10px;
  cursor: move;
}
.cr-header span {
  font-family: var(--font-display);   /* Silkscreen panel title */
  font-size: var(--text-sm);
  color: var(--text);
  /* REMOVE: letter-spacing 0.5px (Silkscreen has its own natural spacing) */
}

.cr-close {
  color: var(--text-secondary);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: none;
  background: none;
  cursor: pointer;
  font-size: var(--text-sm);
}
.cr-close:hover {
  background: var(--interactive-bg-hover);
  color: var(--text);
}

.cr-body {
  padding: var(--pad-modal);
}

.cr-slot {
  width: 52px;
  height: 52px;
  border: 2px dashed var(--border-interactive);   /* was: 2px dashed #666 */
  border-radius: var(--radius-sm);
  transition: border-color var(--duration-micro) var(--easing-state);
}
.cr-slot.picking-active {
  border-color: var(--border-focus);   /* was: #6677dd */
  border-style: solid;
}

.cr-arrow {
  color: var(--text-secondary);   /* was: #999 */
}
```

### Merge View

```css
.merge-bar {
  background: var(--surface-active);
  border-bottom: 1px solid var(--border);
}
.merge-bar-title {
  font-family: var(--font-display);   /* Silkscreen */
  font-size: var(--text-sm);
  color: var(--text);
}
.merge-back-btn {
  font-size: var(--text-sm);   /* 12px — raised from 0.68rem */
}

.merge-top {
  background: var(--canvas-alt);   /* keep dark — canvas surface */
}

.merge-section-label {
  font-size: var(--text-sm);    /* 12px */
  font-family: var(--font-body);
  color: var(--text-secondary);
}

.merge-dot-a { color: var(--merge-sel-a); }   /* rgba(80,150,255,0.9) — keep functional color */
.merge-dot-b { color: var(--merge-sel-b); }   /* rgba(255,160,40,0.9) — keep functional color */

.merge-upload-btn {
  font-size: var(--text-sm);   /* 12px */
}

.merge-footer {
  background: var(--surface-active);
  border-top: 1px solid var(--border);
}
.merge-hint {
  font-size: var(--text-sm);    /* 12px */
  font-family: var(--font-body);
  color: var(--text-secondary);
}

/* 입히기 button: use primary variant */
.merge-footer .mc-btn[disabled=false]:not([disabled]) {
  /* Apply .primary class in JSX instead of inline style */
}

.merge-mode-hints {
  font-size: var(--text-xs);    /* 11px — keyboard hint, non-interactive */
  color: var(--text-secondary);
}
.merge-mode-hints kbd {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text-secondary);
  padding: 0 3px;
}
```

### Resize Handles

```css
.resize-handle,
.merge-resize-h,
.merge-resize-v {
  background: var(--border);   /* was: var(--mc-border-dark) */
  transition: background var(--duration-micro) var(--easing-state);
}
.resize-handle:hover,
.resize-handle.dragging,
.merge-resize-h:hover,
.merge-resize-v:hover {
  background: var(--accent-solid);   /* was: #5566aa — lavender on interaction */
}
.resize-handle::after,
.merge-resize-h::after,
.merge-resize-v::after {
  background: var(--border-subtle);   /* was: rgba(255,255,255,0.25) */
}
```

### Guide Bar

```css
.guide-bar {
  background: var(--surface-active);
  border-top: 1px solid var(--border);
  /* REMOVE: backdrop-filter: blur(4px) — decorative blur ban (DESIGN.md Never list) */
}

.guide-bar-label {
  font-size: var(--text-sm);    /* 12px */
  font-family: var(--font-body);
  color: var(--text-secondary);
}

.guide-bar-btn {
  height: 24px;       /* raised from 22px */
  min-width: 24px;
  padding: 2px 8px;
  font-size: var(--text-sm);
}

.guide-divider {
  background: var(--border);   /* was: rgba(255,255,255,0.15) */
}
```

### Tip Banner

```css
.tip-banner {
  background: var(--surface-active);       /* was: rgba(0,0,0,0.45) — dark overlay removed */
  border: 1px solid var(--border);         /* add subtle border for definition on cream bg */
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-elevation-1);
}

.tip-text {
  font-size: var(--text-sm);    /* 12px */
  font-family: var(--font-body);
  color: var(--text-secondary);
}

.tip-icon {
  font-size: var(--text-sm);   /* 12px — was 0.75rem (OK); keep for icon */
}
```

### Viewer Controls

```css
.viewer-btn {
  background: var(--surface-active);
  border: 1px solid var(--border-interactive);
  /* REMOVE: bevel border (was: mc-border-light / mc-border-dark) */
  color: var(--text);
  border-radius: var(--radius-sm);
  width: 36px;
  height: 36px;
  transition: background var(--duration-micro) var(--easing-state);
}
.viewer-btn:hover {
  background: var(--surface-hover);
}
.viewer-btn.active {
  background: var(--interactive-bg-accent);
  border-color: var(--accent-solid);
  color: var(--text-on-accent);
}
```

### Selection Mode

```css
.sel-mode-btn {
  font-size: var(--text-sm);   /* 12px */
  font-family: var(--font-body);
}
.sel-mode-btn.active {
  background: var(--interactive-bg-accent);
  border-color: var(--accent-solid);
  color: var(--text-on-accent);
}

.sel-clear-btn {
  background: var(--status-error);    /* was: #7a5555 */
  color: var(--text-on-accent);
  border-color: var(--error-11, #86534f);
  font-size: var(--text-sm);          /* 12px */
}
.sel-clear-btn:hover {
  background: var(--error-11, #86534f);   /* was: #9a6060 */
}
```

### Shade Remap Sliders

```css
.shade-slider {
  accent-color: var(--accent-solid);   /* was: #6677dd */
}
.shade-tolerance-label {
  font-size: var(--text-sm);   /* 12px */
  font-family: var(--font-body);
  color: var(--text-secondary);
}
.shade-tolerance-section-label {
  font-size: var(--text-sm);   /* 12px */
  font-family: var(--font-body);
  color: var(--text-secondary);
}
.shade-tolerance-side-label {
  font-size: var(--text-sm);   /* 12px — was 0.72rem=11.52px */
  color: var(--text-secondary);
}
```

### Pixel Editor

No CSS changes beyond surface. The `.pixel-editor-scroll` and `.pixel-editor-wrap` elements receive updated surface colors only:

```css
.pixel-editor-scroll {
  background: var(--surface-active);   /* was: #4a4a4a — wraps the canvas on the cream chrome */
}

.pixel-editor-wrap {
  border: 1px solid var(--border);
  /* REMOVE: bevel box-shadow (was: inset mc-bevel corners) */
  box-shadow: var(--shadow-elevation-1);   /* lavender-tinted depth shadow */
}
/* Canvas background (#1a1a1a dark void) is set via canvas fillStyle in PixelEditor.jsx — do not change */
```

### Palette Grid + Color Panel

```css
.color-panel {
  background: var(--surface);
}

.palette-grid::-webkit-scrollbar-track {
  background: var(--surface-active);   /* was: var(--mc-border-dark) */
}
.palette-grid::-webkit-scrollbar-thumb {
  background: var(--border-interactive);   /* was: var(--mc-panel) */
  border-radius: 3px;
}

.palette-empty {
  font-size: var(--text-sm);   /* 12px */
  font-family: var(--font-body);
  color: var(--text-secondary);
}

.tab-btn {
  font-size: var(--text-sm);   /* 12px */
  font-family: var(--font-body);
}
/* Active tab indicator — add: */
.tab-btn.active {
  color: var(--accent-text);
  border-bottom: 2px solid var(--accent-solid);
}

.current-color-row {
  /* .mc-slot inset shadow → replace with border */
}
.mc-slot {
  box-shadow: none;   /* REMOVE bevel inset */
  border: 1px solid var(--border-interactive);
  border-radius: var(--radius-sm);
}
```

---

## Appendix: Silkscreen Import

Add to `index.html` (or CSS `@import` at top of App.css):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400&display=swap" rel="stylesheet">
```

Or in CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400&display=swap');
```

Silkscreen is a free open-source font (confirmed in plan Assumptions).

---

## Appendix: Canvas Areas — What Changes vs What Stays

| Area | Surface (change) | Canvas internals (keep) |
|------|-----------------|------------------------|
| `.viewer-panel` | `background: var(--surface-active)` | SkinViewer3D WebGL canvas — untouched |
| `.canvas-area` | `background: var(--surface-active)` | PixelEditor canvas fillStyle, grid, selection overlay — untouched |
| `.pixel-editor-wrap` | `border: 1px solid var(--border); box-shadow: var(--shadow-elevation-1)` | Canvas content — untouched |
| `.merge-top` | `background: var(--canvas-alt)` (keep dark) | ResultCanvas — untouched |
| `.merge-canvas-scroll` | `background: var(--canvas-void)` (keep dark) | MiniCanvas — untouched |
| SkinMerge MiniCanvas selection overlays | None | `rgba(80,150,255,0.95)` and `rgba(255,160,40,0.95)` stay — via `--merge-sel-a`/`--merge-sel-b` constants |
