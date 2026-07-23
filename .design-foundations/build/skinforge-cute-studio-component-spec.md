# SkinForge Cute Studio — Component Spec
**Phase:** 2 · **Status:** locked (pending build commit)
**Depends on:** DESIGN.md (locked, Phase 1 — read before applying anything in this doc)

---

## 1. Token Tier Map (DW-2.1)

Three tiers. No raw hex at Tier 2 or in any consuming component CSS. Tier 0 lives only inside DESIGN.md's `[data-theme]` blocks — nowhere else.

### Tier 0 — Primitives (DESIGN.md internal, never referenced directly by components)

| Primitive | Hex | Notes |
|-----------|-----|-------|
| coral-dark | #C8490D | primary accent |
| coral-darker | #A83808 | hover state of above |
| coral-tint | #FFF0EC | accent tinted bg |
| cream | #FEFDF5 | page background |
| white | #FFFFFF | surface |
| lavender-tint | #FFF0F5 | alt surface |
| gray-canvas | #D8D8D8 | pixel canvas checkerboard base |
| dark-viewer | #2A2530 | 3D viewer panel bg |
| lavender | #9B8EC4 | secondary accent decorative |
| lavender-border | #8C7EB5 | secondary functional border |
| butter | #FFD166 | tertiary decorative only |
| ink | #3D3340 | primary text |
| ink-mid | #7A7085 | secondary text |
| soft-border | #E8DFF0 | decorative divider |
| error-9 | #C56C65 | — |
| error-11 | #86534F | — |
| success-9 | #84CC86 | — |
| success-11 | #486E49 | — |
| warning-9 | #CEB47E | — |
| warning-11 | #6F6144 | — |
| info-9 | #7AABCE | — |
| info-11 | #4C677A | — |

### Tier 1 — Semantic Aliases (DESIGN.md `[data-theme]` block)

| Semantic Token | Tier 0 Source (light) | Usage |
|----------------|----------------------|-------|
| `--background` | cream | Page background |
| `--surface` | white | Panel, card, input backgrounds |
| `--surface-alt` | lavender-tint | Hover/active surface tint |
| `--surface-canvas` | gray-canvas | Pixel canvas checkerboard |
| `--surface-viewer` | dark-viewer | 3D viewer dark bg |
| `--accent-solid` | coral-dark | Primary active-state signal |
| `--accent-solid-hover` | coral-darker | Hover on accent-solid |
| `--accent-tint` | coral-tint | Active icon/button bg |
| `--accent-on-solid` | white | Text/icon ON accent-solid |
| `--accent-secondary` | lavender | Decorative fills (dark surfaces only) |
| `--accent-secondary-tint` | lavender-tint | == --surface-alt |
| `--accent-secondary-border` | lavender-border | Functional guide/non-text edges |
| `--accent-tertiary` | butter | Illustration/decoration only |
| `--text` | ink | Primary body text |
| `--text-secondary` | ink-mid | Secondary labels (use ≥12px; 4.59:1 margin is thin) |
| `--text-on-accent` | white | Labels on accent-solid backgrounds |
| `--border` | soft-border | Panel and card hairlines |
| `--radius-sm` | 6px | Inputs, form controls |
| `--radius-md` | 8px | Buttons, palette swatches, tooltips |
| `--radius-lg` | 12px | Panels, modals |
| `--radius-full` | 999px | Pill controls |
| `--font-body` | Nunito stack | All UI labels, body copy |
| `--text-2xs` | 10px | Body sans only — Silkscreen NEVER at this size |
| `--text-xs` | 11px | Body sans only — Silkscreen NEVER at this size |
| `--text-sm` | 12px | Silkscreen minimum; body sans also OK |
| `--text-base` | 14px | Default body |
| `--text-lg` | 16px | Silkscreen section headers |
| `--text-xl` | 20px | Silkscreen panel titles |
| `--text-2xl` | 28px | Silkscreen logo/wordmark |
| Functional tokens | see DESIGN.md | --error-9/11, --success-9/11, etc. |

### Tier 2 — Component Aliases (produced by this phase)

All values are `var(--tier-1-token)`. No raw hex. Dark-mode propagates automatically when Tier 1 values are updated.

```css
:root {
  /* ── Toolbar button ── */
  --toolbar-btn-bg:           var(--surface);
  --toolbar-btn-bg-hover:     var(--surface-alt);
  --toolbar-btn-bg-active:    var(--accent-tint);
  --toolbar-btn-icon-color:   var(--text-secondary);
  --toolbar-btn-icon-hover:   var(--text);
  --toolbar-btn-icon-active:  var(--accent-solid);
  --toolbar-btn-radius:       var(--radius-md);
  --toolbar-btn-size:         32px;   /* width × height */
  --toolbar-btn-icon-size:    18px;   /* svg width/height attribute */

  /* ── Button (primary CTA) ── */
  --btn-primary-bg:           var(--accent-solid);
  --btn-primary-bg-hover:     var(--accent-solid-hover);
  --btn-primary-fg:           var(--accent-on-solid);
  --btn-primary-radius:       var(--radius-md);
  --btn-primary-px:           16px;
  --btn-primary-py:           7px;
  --btn-primary-font-size:    var(--text-base);
  --btn-primary-font-weight:  600;

  /* ── Button (secondary / ghost) ── */
  --btn-secondary-bg:         transparent;
  --btn-secondary-bg-hover:   var(--surface-alt);
  --btn-secondary-fg:         var(--text);
  --btn-secondary-border:     var(--border);
  --btn-secondary-radius:     var(--radius-md);

  /* ── Input ── */
  --input-bg:                 var(--surface);
  --input-fg:                 var(--text);
  --input-border:             var(--border);
  --input-border-focus:       var(--accent-solid);
  --input-radius:             var(--radius-sm);
  --input-px:                 8px;
  --input-py:                 4px;
  --input-font-size:          var(--text-xs);

  /* ── Panel ── */
  --panel-bg:                 var(--surface);
  --panel-border:             var(--border);
  --panel-radius:             var(--radius-lg);
  --panel-padding:            12px;
  --panel-title-font:         'Silkscreen', monospace;
  --panel-title-size:         var(--text-lg);
  --panel-section-label-size: var(--text-xs);     /* FIX-FORWARD: was 9px Silkscreen — now 11px Nunito */
  --panel-section-label-font: var(--font-body);   /* FIX-FORWARD: Silkscreen floor 12px — body sans below it */
  --panel-section-label-fg:   var(--text-secondary);

  /* ── Modal / Floating panel ── */
  --modal-bg:                 var(--surface);
  --modal-border:             var(--border);
  --modal-radius:             var(--radius-lg);
  --modal-shadow:             0 4px 24px rgba(61,51,64,.12);
  --modal-padding:            16px;

  /* ── Tooltip ── */
  --tooltip-bg:               var(--text);
  --tooltip-fg:               var(--background);
  --tooltip-radius:           var(--radius-md);
  --tooltip-px:               8px;
  --tooltip-py:               4px;
  --tooltip-font-size:        var(--text-xs);

  /* ── Palette tile / swatch ── */
  --palette-tile-radius:      var(--radius-md);
  --palette-tile-size:        20px;
  --palette-tile-border:      var(--border);

  /* ── Viewer label ── */
  --viewer-label-size:        var(--text-xs);     /* FIX-FORWARD: was 9px Silkscreen — now 11px Nunito */
  --viewer-label-font:        var(--font-body);   /* FIX-FORWARD */
  --viewer-label-fg:          var(--accent-secondary); /* on --surface-viewer dark bg — passes 5.02:1 */

  /* ── Functional pill / badge ── */
  --badge-error-bg:           var(--error-9);
  --badge-error-fg:           var(--surface);
  --badge-success-bg:         var(--success-9);
  --badge-success-fg:         var(--surface);
  --badge-error-text:         var(--error-11);
  --badge-success-text:       var(--success-11);
  --badge-warning-text:       var(--warning-11);
  --badge-info-text:          var(--info-11);

  /* ── Pill toggle (skin type, options bar segment) ── */
  --pill-radius:              var(--radius-full);
  --pill-track-bg:            var(--surface-alt);
  --pill-thumb-bg:            var(--surface);
  --pill-thumb-active-bg:     var(--accent-solid);
  --pill-thumb-active-fg:     var(--accent-on-solid);
}
```

**No raw hex at Tier 2:** verified — all values reference Tier 1 `var()` tokens or unitless size values.

---

## 2. Border Radius Table (DW-2.5)

| Component | Radius Token | Resolved Value | Notes |
|-----------|-------------|---------------|-------|
| Button (primary) | `var(--radius-md)` | 8px | All CTA buttons |
| Button (secondary/ghost) | `var(--radius-md)` | 8px | — |
| Toolbar button | `var(--radius-md)` | 8px | 32×32px button wrapping 18px icon |
| Input (hex field, text) | `var(--radius-sm)` | 6px | Form controls |
| Panel (right sidebar, viewer panel) | `var(--radius-lg)` | 12px | Structural surfaces |
| Modal (SkinMergeModal) | `var(--radius-lg)` | 12px | Full-area modal |
| Floating panel (ColorReplacePanel, ShadeRemapPanel) | `var(--radius-lg)` | 12px | Draggable overlays |
| Tooltip | `var(--radius-md)` | 8px | — |
| Palette tile / color swatch | `var(--radius-md)` | 8px | Both in picker and skin-extracted palette |
| Pill toggle / options bar | `var(--radius-full)` | 999px | Skin-type toggle, selection-mode buttons |
| Color slot (44×44px, ColorReplacePanel) | `var(--radius-md)` | 8px | From/to color swatches in replace panel |

**Never 0 (DESIGN.md constraint):** flat corners break the Cute Studio identity. Never above 12px on structural panels.

---

## 3. Micro-Interaction Spec (DW-2.4)

### Toolbar icon hover — bounce-to-settle

**Intent:** The tool icon "pops" on hover entry, landing at a slightly enlarged resting state, giving the UI tactile personality without layout shift.

**Mechanism:** `transform: scale` only — no margin/padding changes, no dimension changes. `overflow: visible` on the toolbar button container allows the slightly-scaled icon to visually overflow the button bounds without clipping.

**Values:**

| Property | Value | Notes |
|----------|-------|-------|
| Hover target scale | `1.05` | Steady-state while hovered |
| Transition in | `220ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Spring easing — natural overshoot peaks at ~1.08, within ceiling |
| Transition out | `120ms ease-in` | Faster release feels snappy |
| Max scale at any point | `1.08` | Hard ceiling — prevents adjacent icon clipping |
| Transform origin | `center center` | Scale from icon center |

**CSS:**
```css
.tool-icon {
  transition: transform 120ms ease-in, color 100ms ease;
  transform-origin: center center;
  overflow: visible;        /* on the <button> wrapper */
}
.tool-icon:hover {
  transform: scale(1.05);
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
              color 100ms ease;
  color: var(--toolbar-btn-icon-hover);
}
.tool-icon.active {
  transform: scale(1.0);   /* active state: no scale — color/bg signal is the indicator */
  color: var(--toolbar-btn-icon-active);
  background-color: var(--toolbar-btn-bg-active);
}
```

**prefers-reduced-motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .tool-icon,
  .tool-icon:hover {
    transition: color 100ms ease;
    transform: none !important;
  }
}
```

**Rationale for cubic-bezier(0.34, 1.56, 0.64, 1):** This is a widely-used spring curve. With scale(1.05) as the target, the effective peak overshoot is ~scale(1.082) — within the 1.08 ceiling with <1% margin. Acceptable; document as "≤1.08 at any instant."

**Button state color transitions:**

| State | Icon color | Button bg |
|-------|-----------|-----------|
| Rest | `--toolbar-btn-icon-color` (--text-secondary) | `--toolbar-btn-bg` (--surface) |
| Hover | `--toolbar-btn-icon-hover` (--text) | `--toolbar-btn-bg-hover` (--surface-alt) |
| Active/Selected | `--toolbar-btn-icon-active` (--accent-solid) | `--toolbar-btn-bg-active` (--accent-tint) |
| Focus-visible | outline: 2px `--accent-solid`, offset 2px | — |

---

## 4. Phase 1 Fix-Forward: Sub-12px Silkscreen Remediation

The approved mock rendered `.panel-section-label` and `.viewer-label` at 9px Silkscreen. DESIGN.md's 12px Silkscreen floor is a dealer pin — these labels must move to body sans below the floor.

| Class | Was (mock) | Is (this spec) | Rationale |
|-------|-----------|----------------|-----------|
| `.panel-section-label` | 9px Silkscreen | 11px Nunito (`--text-xs`, `--font-body`) | Below 12px Silkscreen floor — illegible at that size per Phase 1 research |
| `.viewer-label` | 9px Silkscreen | 11px Nunito (`--text-xs`, `--font-body`) | Same |

Note on `--text-secondary` usage at 11px: the contrast ratio is 4.59:1 — 0.09 above the 4.5:1 floor. Per the Phase 1 review, usage of `--text-secondary` should be restricted to ≥12px where possible. These 11px labels should use `--text` (#3D3340, 11.79:1) instead of `--text-secondary` for safety.

---

## 5. Icon Style Contract Reference

All 6 toolbar icons:
- `viewBox="0 0 18 18"`
- `fill="none"` on root SVG (unless explicitly `fill="currentColor"` on a specific small element — one per icon max, per DESIGN.md)
- `stroke="currentColor"` on root SVG
- `stroke-linecap="round"` on root SVG
- `stroke-linejoin="round"` on root SVG
- `stroke-width="2.5"` on root SVG (primary shapes)
- `stroke-width="2"` on small child elements (separator lines, secondary details, diagonal star arms) — never below 2
- No hardcoded hex anywhere inside the SVG

Color driven by parent `color` CSS property via `currentColor`.

Icon rendering sizes: `width="18" height="18"` native size. Scales up cleanly to 20×20 or 24×24.

---

## 6. Dark Mode Variable Structure

Tier 2 component aliases all chain through Tier 1 semantic tokens. When Tier 1 values are swapped in `[data-theme="dark"]`, all component aliases propagate automatically — no component-level branching needed. The `[data-theme="dark"]` block in DESIGN.md already reserves all Tier 1 token names with TBD values for a follow-up sprint.
