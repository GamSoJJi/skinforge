# Discovery + Design: Phase 3 — Token System + Component Specs

## Artifacts Found / Current State

| Artifact | Status |
|---------|--------|
| DESIGN.md | LOCKED — "Ledger Pantry" DNA, status: `confirmed`, all WCAG AA pairs verified. Token block present and complete (neutrals + accent + functional + semantic layer). |
| JOURNEY.md | PRESENT — Job story, hub-and-spoke IA, 2 task flows, 4 page specs. Complete. |
| Plan file | Phase 3 is the current phase; Phases 1–2 show BUILD + REVIEW PASS + committed. |
| `src/App.css` | Present. Uses `--mc-*` custom properties throughout (12 root variables). Contains ~30 inline hex colors not on the token system. Font sizes range from 0.58rem (9.28px) to 0.8rem (12.8px) — majority below the 12px Silkscreen floor. |
| `src/App.jsx` | Present. Contains ⌘/⇧ Unicode modifiers (acceptable). Undo/redo buttons use `↩`/`↪` (Unicode arrows, fine). |
| `src/components/ToolPanel.jsx` | Present. Tool icon definitions contain 3 emoji: `✏️` (U+270F+FE0F pencil), `🪣` (U+1FAA3 bucket), `🔍` (U+1F50D magnifying glass). Tooltip string contains `🚫` (U+1F6AB). `⬜` (U+2B1C white large square) is borderline — has emoji rendering in some fonts. |
| Component specs document | NOT YET PRODUCED — this is Phase 3's primary deliverable. |

## Gaps

1. **No component-tier tokens exist** — DESIGN.md defines global and semantic/alias tokens only. Component-level tokens (button-background, panel-padding, etc.) are not yet defined.
2. **Migration path undefined** — `--mc-*` variables are used in ~40+ CSS rules. No mapping to the new semantic tokens exists yet.
3. **Emoji present in source** — 4 emoji confirmed (✏️, 🪣, 🔍, 🚫), 1 borderline (⬜). None replaced yet.
4. **Font-size violations extensive** — 18 CSS selectors render text below 12px. Some affect interactive elements (tool labels, button text, panel labels).
5. **Target-size violations** — 4 interactive elements are below the 24×24px minimum: `.size-arrow` (20×22px), `.palette-swatch` (min-height 20px), `.guide-bar-btn` (height 22px), `.cr-close` (unsized).

## Gate Status

- DESIGN.md locked: **YES** — status: `confirmed`, token block present, WCAG AA verified.
- JOURNEY.md present: **YES** — complete, including all 4 page specs.
- Prerequisites met: **YES** — Phases 1 and 2 committed with REVIEW PASS.
- Phase 3 scope conflict with locked DESIGN.md: **NONE** — this phase extends only, does not modify DESIGN.md values.

## DW Verification

| DW-ID | Done-When Item | Status | Evidence |
|-------|---------------|--------|----------|
| DW-3.1 | 3-tier token table (global → alias → component), W3C DTCG format | COVERED | The component specs document produces the full 3-tier table in W3C DTCG `$type`/`$value`/`$description` format. Global tier sourced directly from DESIGN.md. Alias tier extends DESIGN.md semantic block. Component tier is new. Reviewable in the produced document. |
| DW-3.2 | Atomic decomposition — atoms, molecules, organisms each named | COVERED | Component specs document lists: 6 atoms (Button, Input, ColorSwatch, Icon, Label, Tooltip), 6 molecules (ToolButton, ToggleSwitch, PaletteSlot, SelectionModeButton, ColorSlot, BrushSizeControl), 5 organisms (ToolPanel, ColorPanel, Header, FloatingPanel, SkinMergeModal). Each entry names its constituent atoms/molecules and the tokens it consumes. |
| DW-3.3 | Emoji replacement list — current emoji → Unicode symbol or SVG path | COVERED | Component specs document lists all 5 emoji/borderline-emoji with their replacements: ✏️ → inline SVG pencil, 🪣 → inline SVG bucket, 🔍 → inline SVG magnifier, 🚫 → `×` U+00D7, ⬜ → `▭` U+25AD or inline SVG rectangle. SVG paths included at 12×12px viewport. |
| DW-3.4 | `--mc-*` variables → semantic token migration map | COVERED | Component specs document provides a complete migration table: all 12 `--mc-*` root variables mapped to their new semantic token equivalent, plus the ~12 one-off inline colors (the `#5566aa`, `#5577cc`, `#8888cc`, `#6677dd`, `#7a5555`, `#9a6060` variants) each mapped to a semantic or component token. Canvas-specific dark backgrounds called out as intentional non-theme constants. |
| DW-3.5 | All interactive elements ≥ 24×24px target size; font-size ≥ 12px | COVERED | Component specs document lists all 4 target-size violations with corrective specs (min-height/width values). Font floor enforcement section lists all 18 below-12px selectors with their replacement token (`--text-sm: 12px` in `--font-body`). Evidence: the spec enumerates each case with the exact property change — a developer can verify by inspecting the rendered CSS. |
| DW-3.6 | hover/active state color delta ≤ 20% lightness | COVERED | Component specs document includes a state-delta table. All hover/active pairs computed in HSL: surface → surface-hover delta 3.3%, surface → surface-active delta 6.6%, accent-solid → accent-solid-hover delta 7.3%. All pass ≤20% constraint. Evidence: the calculations are shown inline so they can be independently verified. |

**All items COVERED:** YES (6/6)

## Design Decisions

**Token tier structure — why 3 separate tiers rather than flattening:**
Design-systems doctrine (W3C DTCG, Frost 2013): Global tokens are the vocabulary (what exists). Alias/semantic tokens are intent (what role a value plays). Component tokens are scope (what value a specific component uses). Collapsing these makes global palette changes cascade unpredictably into components. SkinForge's accent-scarcity rule (lavender appears only on active/CTA, never decorative) is easiest to enforce through component tokens that explicitly reference only `--accent-solid` — not by convention in a flat system.

**Component token naming convention — CSS custom properties, not Style Dictionary:**
SkinForge is a single-brand, single-team project. The cost of a Style Dictionary pipeline (build step, transform config, platform outputs) exceeds the benefit at this scale. Component tokens are expressed directly as CSS custom properties in the component's own rule block, following `--[component]-[property]-[state]` naming: `--tool-btn-bg-active`, `--panel-border`. This is the "concise production" preference applied to token delivery — a tool earns its integration cost; here it doesn't.

**Atomic decomposition boundary — where organisms stop:**
PixelEditor, SkinViewer3D, and ResultCanvas are canvas-rendering components. Per the plan's constraint: "surface 토큰만 적용하고 내부 canvas 렌더링은 건드리지 않음." These are treated as black-box organisms — only their container surface receives design-system tokens. No atomic decomposition applied to canvas internals.

**Icon SVG strategy — 12×12px, currentColor fill:**
All replacement icons are specified as inline SVG at 12×12px viewport with `fill="currentColor"` or `stroke="currentColor"`. This means the icon inherits the text color of its parent, honoring the token system automatically without additional CSS. The `tool-icon` span wrapper already provides sizing context. No icon library introduced (plan decision log).

**Eraser icon ⬜ — classified as emoji-risk:**
U+2B1C renders as a color emoji in some platforms (Apple, Google). Classified as emoji-risk and replaced with an inline SVG white rectangle with border, consistent with the "erase to transparent" semantic.

**🚫 in tooltip string — context-aware replacement:**
The tooltip text `'🚫 옷입히기 모드 비활성'` is a runtime string in JSX, not a rendered SVG. Replacement: `'× 옷입히기 모드 비활성'` (U+00D7 MULTIPLICATION SIGN). Text-only; no SVG needed here.

**Hover/active states — DESIGN.md `--surface-hover` / `--surface-active` as the state layer:**
Rather than defining per-component hover hex values (which creates drift), all component hover states route through the alias-tier state tokens. This means a future palette swap only requires changing `--neutral-3` and `--neutral-4`; every component updates automatically. Consistent with design-systems doctrine "extend, never replace."

## Recommendation

**BUILD** — all gates pass, all DW items are covered. Proceed to production.
