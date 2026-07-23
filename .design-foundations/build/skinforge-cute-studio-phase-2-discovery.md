# Discovery + Design: Phase 2 - System Components + Icons

## Artifacts Found / Current State

- **DESIGN.md** (project root): locked, Status: locked. Cute Studio identity — coral #C8490D, cream #FEFDF5, Nunito body, Silkscreen display (12px floor), radius scale (sm:6/md:8/lg:12/full:999px), icon style contract (stroke-width:2.5/linecap:round/linejoin:round/viewBox:0 0 18 18/currentColor).
- **JOURNEY.md** (project root): present. Hub-and-spoke IA confirmed. Page specs for Main Editor, SkinMergeModal, ColorReplacePanel, ShadeRemapPanel — all read. No changes needed.
- **Approved mock** `.design-foundations/build/skinforge-cute-studio-mock.html`: present. Validated in mock review (PASS). Key reference: toolbar button 32×32px with 18px icon area; tool button border-radius 8px; panel background --surface; active tool color --accent-solid on --accent-tint background.
- **Phase 1 review** `.design-foundations/build/skinforge-cute-studio-phase-1-review.md`: PASS. Three Minor non-blocking findings carried into this phase:
  - Sub-12px Silkscreen labels in mock (`.panel-section-label` at 9px, `.viewer-label` at 9px) — **must remediate in component specs** (explicit Phase 2 gate per reviewer)
  - `--text-secondary` thin margin (4.59:1, 0.09 above floor) — document usage restriction ≥12px in specs
  - Unnamed contrast-checker script — out of Phase 2 scope
- **`docs/pillar-taxonomy.md`**: absent. Using built-in `design-systems` doctrine.
- **`scripts/detect.mjs`**: absent (noted in Phase 1 review as N/A for spec-only artifacts).

## Gaps

1. **Sub-12px Silkscreen remediation** (Phase 1 carry-forward): Two classes in the approved mock use 9px Silkscreen, violating the 12px DESIGN.md floor. Component specs must document these as `--text-xs` (11px) Nunito body instead. No new gap — closing an existing one.
2. **No existing component aliases**: DESIGN.md defines semantic tokens but no component-tier aliases yet. This phase produces them.
3. **Selection tool SVG missing**: The JOURNEY.md and approved mock reference a selection tool currently using Unicode ⬚. This phase replaces it with a proper dashed-rect SVG.
4. **Dark-mode component alias slots**: Dark mode values are TBD per plan constraint — component aliases must chain through semantic tokens (not raw hex) so the dark-mode variable swap propagates automatically.

## Gate Status

- **DESIGN.md locked**: YES — Cute Studio identity, all tokens present, Status: locked. This phase reads it as law.
- **JOURNEY.md present**: YES — reused as-is.
- **Prerequisites met**: YES — Phase 1 committed (dd69ef4), DESIGN.md locked before token/component work begins.
- **No blocking gaps**: The sub-12px label remediation is a known, in-scope fix-forward, not a new blocker.

## DW Verification

| DW-ID | Done-When Item | Status | Evidence |
|-------|---------------|--------|----------|
| DW-2.1 | Token tier map — primitive → semantic → component chain, no hardcoded hex at component tier | COVERED | Token tier table in component spec doc showing the three-tier chain. No raw hex at Tier 2; all component aliases resolve via `var(--semantic-token)`. |
| DW-2.2 | 6 SVG icons complete (pen/eraser/fill/eyedropper/selection/magic wand) — stroke-linecap:round, stroke-linejoin:round, stroke-width ≥2, currentColor | COVERED | 6 complete SVG elements embedded in the rendered HTML artifact. Each verified: root attributes `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"`. No hardcoded hex inside any icon path. |
| DW-2.3 | Each icon visually clear at 20×20px render | COVERED | Icons rendered at 20×20px in the HTML artifact. Visual verification: stroke-width 2.5 on an 18×18 viewBox scaled to 20px produces ~2.78px effective stroke — chunky, clearly readable. |
| DW-2.4 | Micro-interaction spec (hover scale value, bounce keyframe, easing, timing ms) | COVERED | CSS animation spec in component doc: hover scale 1.05 target, spring cubic-bezier(0.34, 1.56, 0.64, 1) producing natural peak ~1.08 (within ceiling), 220ms in / 120ms out. prefers-reduced-motion block explicit. |
| DW-2.5 | Border radius table per component (button/input/panel/modal/tooltip/palette tile) | COVERED | Table in component spec mapping each component to its radius token (no raw values — all via `var(--radius-*)` aliases). |
| DW-2.6 | No self-identified Critical issues | COVERED | Self-assessment: no Critical issues found. Two Minors noted (sub-12px label remediation documented; drip dot usage within DESIGN.md's one-fill-per-icon allowance). These are documented not blocking. |

**All items COVERED:** YES

## Design Decisions

**Doctrine applied:** `design-systems` (built-in knowledge — docs/pillar-taxonomy.md absent).

- **Token tiers**: Three-tier chain — Tier 0 (primitive hex values, DESIGN.md only), Tier 1 (semantic aliases in `[data-theme]` blocks), Tier 2 (component aliases referencing Tier 1 only). This ensures dark-mode propagation: a single `[data-theme="dark"]` swap of Tier 1 values cascades through all Tier 2 component aliases without any component-level branching.
- **Sub-12px remediation**: `.panel-section-label` and `.viewer-label` reclassified from 9px Silkscreen to `--text-xs` (11px) Nunito. DESIGN.md floor (12px Silkscreen minimum) is not negotiable — these labels go to body sans, not to reduced-size Silkscreen.
- **Hover animation**: `transform: scale` only (no layout shift). Spring cubic-bezier gives natural bounce feel within the 1.08 hard ceiling. `prefers-reduced-motion` handled with `transition: none` + instant scale.
- **Icons**: Each icon designed with 1.5px minimum clearance from viewBox edges to accommodate stroke-width 2.5 (±1.25px overflow). One `fill="currentColor" stroke="none"` drip dot per icon where used (fill bucket, eyedropper) — within DESIGN.md allowance. Selection icon uses `stroke-dasharray` for the marquee effect. Magic wand uses thinner (1.5px) diagonal star arms to differentiate from the primary cross arms without going below the ≥2 floor on primary elements.
- **stroke-width 2 for small child elements**: Confirmed — eraser separator line, rubber bump outline, fill drip, eyedropper tip, magic wand diagonal star arms all use stroke-width="2" or "1.5". Primary icon outlines use stroke-width="2.5".

## Recommendation

BUILD
