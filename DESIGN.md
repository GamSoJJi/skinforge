# SkinForge — Cute Studio
**Date:** 2026-07-23 · **Status:** locked · **Replaces:** Ledger Pantry (violet accent / system-ui body / gray-black chrome direction — fully retired, not merged with)

**Grounding:** Approved mock `.design-foundations/build/skinforge-cute-studio-mock.html`, confirmed PASS in `.design-foundations/build/skinforge-cute-studio-mock-review.md`. This document takes that mock's token decisions as locked pins and formalizes them as the project's design law.

---

## Brand DNA — Cute Studio

SkinForge is a pixel-cute creative studio, not a professional editing suite dressed down. Silkscreen's blocky pixel-grid identity stays as the load-bearing brand anchor — logo, panel titles, tool names, section headers — but everything a user reads at speed (labels, tooltips, hex values, menu items, Korean copy) switches to a warm, rounded sans-serif. Terracotta coral is the single active-state signal against a warm cream field; lavender is a quiet decorative second voice, never competing for the same job as coral; butter yellow is reserved for illustration accents only. The result should read as "a pixel game with a friendly UI," never as saccharine kawaii and never at the cost of the pixel canvas's own precision — grid boundaries and color values stay maximally legible under the cute chrome, not despite it.

---

## Typography

- **Display: Silkscreen** (Google Fonts, pixel-grid font, 400/700) — logo, panel titles, tool names, section headers only. **Locked floor: 12px.** Below 12px, Silkscreen is illegible (a 7px instance was measured and confirmed illegible in this project's prior iteration; the floor sits 2px above that failure point as safety margin) — anything smaller renders in the body sans stack instead, never in Silkscreen. This floor is a dealer pin carried forward unchanged from the direction this document replaces.
- **Body: Nunito** (Google Fonts, 400/500/600/700) — all UI labels, tooltips, hex/description text, panel body copy, menu items. Chosen over Fredoka One: Fredoka One's default weight reads too heavy immediately above the 12px Silkscreen floor (this project's UI-label sizes cluster at 11–14px), where Nunito's rounded terminals stay legible and light enough to sit *under* Silkscreen without competing with it. The reviewed mock exercises Nunito at 11–13px across every interactive element with all text-contrast pairs passing (see Contrast Verification).
- **Korean-script fallback**: the live app's UI copy is substantially Korean (파일, 색상, 크기, 모양, 가이드, 근접, 선택해제, etc.). Nunito has no Hangul glyphs, so the body stack appends a Korean-aware system fallback — this is script-coverage, not a third display font, and stays legal under the "no more than two families for text content" rule:
  ```css
  --font-body: 'Nunito', -apple-system, "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif;
  ```
- **Numeric fields** (hex values, brush size, coordinates): body font + `font-variant-numeric: tabular-nums` — no third font family introduced.
- Leading: body 1.4 · Silkscreen 1.2 (tight leading reads cleaner for a pixel font at small sizes).
- Weights: Silkscreen ships 400 (hierarchy from size, never faux-bold on a pixel font). Body sans: 400 regular / 600 semibold for emphasis and active-pill labels.

### Type scale

| Token | Size | Font | Silkscreen legal? |
|---|---|---|---|
| `--text-2xs` | 10px | body sans only | NO |
| `--text-xs` | 11px | body sans only | NO |
| `--text-sm` | 12px | Silkscreen or body sans | YES — minimum threshold |
| `--text-base` | 14px | body sans (default body copy) | YES for short labels |
| `--text-lg` | 16px | Silkscreen (tool names, section headers) | YES |
| `--text-xl` | 20px | Silkscreen (panel titles) | YES |
| `--text-2xl` | 28px | Silkscreen (logo / wordmark) | YES |

**Fix-forward note for Phase 2:** the reviewed mock renders `.panel-section-label` / `.viewer-label` at 9px Silkscreen (one instance overridden to 8px) — below this document's 12px floor. That mock predates this lock and was reviewed only for token/color correctness, not against this floor. Phase 2 component specs must move those specific labels to ≥12px Silkscreen or drop them to `--text-xs`/`--text-2xs` body sans; the floor itself is not negotiable.

---

## Color Tokens

Light theme ships first (locked below). Dark theme is a reserved variable-slot structure only — see `## Dark Mode Placeholders`.

```css
[data-theme="light"] {
  /* ---- Backgrounds ---- */
  --background:      #EAE6FF;  /* lavender base — axis swap from cream (user direction 2026-07-23) */
  --surface:          #FFFFFF;  /* panels, toolbars, bars — white so coral accent still passes AA */
  --surface-alt:      #DDD8F8;  /* hover/active surface on white panels — deeper lavender */
  --surface-canvas:   #D8D8D8;  /* pixel-canvas checkerboard base, functional not decorative */
  --surface-viewer:   #2A2530;  /* 3D preview panel, intentionally dark for contrast framing */

  /* ---- Accent: monochromatic purple — ONE hue, shade steps only (axis swap 2026-07-23) ---- */
  --accent-solid:        #7250C0;  /* vibrant deep purple — 5.80:1 on white ✓ */
  --accent-solid-hover:  #5D3FA8;  /* darker purple — 7.66:1 on white ✓ */
  --accent-tint:         #C8BCFF;  /* saturated light purple for active btn bg on white */
  --accent-on-solid:     #FFFFFF;  /* white on #7250C0 — 5.80:1 ✓ */

  /* ---- Accent secondary: mid-shade of same hue ---- */
  --accent-secondary:         #9B8EC4;  /* mid lavender — viewer labels, decorative fills */
  --accent-secondary-tint:    #EAE6FF;  /* == --background; unified with page base */
  --accent-secondary-border:  #8C7EB5;  /* guide-track / functional non-text edges — 3.63:1 on white ✓ */
  /* NOTE: --accent-tertiary removed — single-hue palette has no tertiary color role */

  /* ---- Text ---- */
  --text:            #2D2040;  /* deep purple-navy — 15.1:1 on white ✓, 12.4:1 on lavender bg ✓ */
  --text-secondary:  #5C5570;  /* deeper purple-grey — 7.0:1 on white ✓, 5.8:1 on lavender bg ✓ (was #7A7085 which fails on lavender) */
  --text-on-accent:  #FFFFFF;  /* == --accent-on-solid; alias for button-label use */

  /* ---- Borders ---- */
  --border: #D4CCEE;  /* lavender-tinted hairline — tuned to lavender base (was warm #E8DFF0) */

  /* ---- Functional colors (from palette.mjs, hue-independent formula) ---- */
  --error-9:    #C56C65;  --error-11:    #86534F;
  --success-9:  #84CC86;  --success-11:  #486E49;
  --warning-9:  #CEB47E;  --warning-11:  #6F6144;
  --info-9:     #7AABCE;  --info-11:     #4C677A;
  /* -11 steps are text-safe (verified below). -9 steps are solid-fill
     primitives for badges/pills; their on-color pairing is a per-component
     decision (Phase 2), not evaluated against page background directly —
     same convention the prior DESIGN.md used for its own functional scale. */
}

[data-theme="dark"] {
  /* TBD — reserved structure only, values deferred to a follow-up sprint
     (plan Constraint: dark-mode final values explicitly OUT of Phase 1 scope).
     Every custom property below MUST exist here before dark mode ships;
     names match the light block 1:1 so consuming CSS never branches on theme.
     `src/App.css` already carries an earlier, unrelated dark palette
     (`--bg: #1a1726` etc.) that predates this token system — it is NOT
     wired to these names yet and is out of this phase's scope to migrate. */
  --background: TBD;
  --surface: TBD;
  --surface-alt: TBD;
  --surface-canvas: TBD;
  --surface-viewer: TBD;
  --accent-solid: TBD;
  --accent-solid-hover: TBD;
  --accent-tint: TBD;
  --accent-on-solid: TBD;
  --accent-secondary: TBD;
  --accent-secondary-tint: TBD;
  --accent-secondary-border: TBD;
  --accent-tertiary: TBD;
  --text: TBD;
  --text-secondary: TBD;
  --text-on-accent: TBD;
  --border: TBD;
  --error-9: TBD;   --error-11: TBD;
  --success-9: TBD; --success-11: TBD;
  --warning-9: TBD; --warning-11: TBD;
  --info-9: TBD;    --info-11: TBD;
}
```

---

## Contrast Verification

Computed with the WCAG 2.1 relative-luminance formula. **Lavender-base axis swap (2026-07-23):** `--background` changed from cream #FEFDF5 to lavender #EAE6FF; `--text-secondary` deepened from #7A7085 (fails on lavender) to #5C5570; `--text` shifted to #2D2040; `--border` to #D4CCEE. Coral (`--accent-solid`) is constrained to `--surface` (white) panels only — NOT placed directly on the lavender background. All pairs re-verified.

| Pairing | Contrast | Threshold | Result |
|---|---|---|---|
| `--text` #2D2040 on `--surface` #FFFFFF | 15.1:1 | ≥4.5:1 body | PASS |
| `--text` #2D2040 on `--background` #EAE6FF | 12.4:1 | ≥4.5:1 body | PASS |
| `--text` #2D2040 on `--surface-alt` #DDD8F8 | 11.0:1 | ≥4.5:1 body (hover state) | PASS |
| `--text-secondary` #5C5570 on `--surface` #FFFFFF | 7.0:1 | ≥4.5:1 body | PASS |
| `--text-secondary` #5C5570 on `--background` #EAE6FF | 5.8:1 | ≥4.5:1 body | PASS |
| `--text-secondary` #5C5570 on `--surface-alt` #DDD8F8 | 5.1:1 | ≥4.5:1 body (hover) | PASS |
| `--accent-solid` #7250C0 on `--surface` #FFFFFF | 5.80:1 | ≥4.5:1 body (purple on white panels) | PASS |
| `--accent-on-solid` #FFFFFF on `--accent-solid` #7250C0 | 5.80:1 | ≥4.5:1 body (button label) | PASS |
| `--accent-secondary-border` #8C7EB5 on `--surface` #FFFFFF | 3.63:1 | ≥3:1 non-text | PASS |
| `--accent-secondary` #9B8EC4 on `--surface-viewer` #2A2530 | 5.02:1 | ≥3:1 non-text-adjacent | PASS |
| `--error-11` #86534F on `--surface` #FFFFFF | 6.98:1 | ≥4.5:1 functional text | PASS |
| `--success-11` #486E49 on `--surface` #FFFFFF | 6.49:1 | ≥4.5:1 functional text | PASS |
| `--warning-11` #6F6144 on `--surface` #FFFFFF | 6.75:1 | ≥4.5:1 functional text | PASS |
| `--info-11` #4C677A on `--surface` #FFFFFF | 6.63:1 | ≥4.5:1 functional text | PASS |

**Purple accent on lavender background — informational:**

| Pairing | Contrast | Note |
|---|---|---|
| `--accent-solid` #7250C0 on `--background` #EAE6FF | 4.77:1 | Passes AA body text on lavender bg ✓ — monochromatic advantage: same hue means accent reads as deeper shade, not a competing color. |
| `--accent-secondary` #9B8EC4 on `--background` #EAE6FF | 1.9:1 | Decorative depth only — mid lavender on pale lavender. Never load-bearing text. |

**Methodology note:** These accent values are locked pins (user-selected direction, WCAG verified with standalone relative-luminance calculator). The functional-color scale (error/success/warning/info) was derived via `palette.mjs --seed` and is a fresh, hue-independent derivation.

---

## Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Inputs / form controls (hex field, text inputs) |
| `--radius-md` | 8px | Buttons, palette swatches, tooltips — the dealer-pinned 8px floor from the approved mock |
| `--radius-lg` | 12px | Panels, modals |
| `--radius-full` | 999px | Pill-shaped controls (options-bar segment buttons, skin-type toggle) — closes the mock review's Minor finding that these hardcoded `20px` instead of routing through a token |

Never 0 (flat corners break the Cute Studio identity) and never above 12px on structural panels (stays compact, not floaty-soft).

---

## Icon Style Reference

Chunky rounded stroke icons — custom SVG, no icon library, all 6 toolbar icons (pen, eraser, fill, eyedropper, selection, magic wand/star) redrawn from scratch in Phase 2. This phase locks the shared style contract; actual path data is Phase 2 scope.

| Property | Value |
|---|---|
| `viewBox` | `0 0 18 18` |
| `stroke-width` | `2.5` on the root `<svg>`; `2` on small child elements (e.g. circles) — never below 2 |
| `stroke-linecap` | `round` |
| `stroke-linejoin` | `round` |
| `fill` | `none` by default (stroke-based silhouettes); a single small `fill="currentColor" stroke="none"` accent dot is permitted per icon for a decorative center-point (as in the reviewed mock's magic-wand icon) |
| Color handling | `currentColor` throughout — no hardcoded hex inside icon SVGs. Parent element's CSS `color` drives state: `--text-secondary` at rest, `--accent-solid` (with `--accent-tint` background) when active/selected, `--text` on hover |
| Size guidance | Icon glyph renders at 18px within its button; the reviewed mock validated this at an 18×18 icon inside a 32×32 button. Phase 2's own plan constraint targets an 18–20px icon area inside a 36×32px toolbar button — final button/icon pixel dimensions are a Phase 2 component-spec decision, referenced here for continuity, not built |

---

## Dark Mode Placeholders

Dark-mode final values are explicitly out of Phase 1 scope (plan Constraint). The `[data-theme="dark"]` block above reserves every token name 1:1 with the light block so consuming CSS never has to branch on theme — only the values are TBD. `src/App.css` currently carries an earlier, unrelated dark implementation (`--bg: #1a1726` and similar) that predates this token system; it is not wired to these names and migrating it is not this phase's job. A follow-up sprint resolves the dark values and performs that migration.
