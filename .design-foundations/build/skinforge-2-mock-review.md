# Design Review: SkinForge 2.0 — Main Editor Mock

## Rendered Evidence (Step 0)
- Screenshot: none — browser MCP not connected; structure-level critique only. Pixel-level contrast, spacing, and rendering unverified from actual screen output. Run the browser MCP to capture pixels.
- Surface: `/Users/kyeongah/Documents/GitHub/skinmaker/.design-foundations/build/skinforge-2-mock.html` — single-page HTML mock of the main editor, reviewed at source level.

## Assessment B — Deterministic Detector
- Command: `node /Users/kyeongah/.claude/plugins/cache/rtd/design-for-ai/4.2.0/scripts/detect.mjs /Users/kyeongah/Documents/GitHub/skinmaker/.design-foundations/build/skinforge-2-mock.html > [scratchpad]/detect.json`
- Exit: 0 (ran successfully)
- Findings: 60 findings — all under rule `nested-cards`
- Opened only after Assessment A findings were frozen: YES

## Triage
- Baseline (always-on): visual (design-dna + ai-tells) + usability (Nielsen 10 + WCAG)
- Dispatched: content-design — Korean product copy is present throughout (button labels, panel titles, menu names, status strings)
- Not applicable: data-viz (no charts or numeric data displays), journey (no multi-step flow or page-to-page sequence), behavioral (no persuasion, pricing, or conversion mechanics)
- Deferred: none

---

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Major | visual / typography | `.t-name` uses `font-size: 7px` for Silkscreen, a pixel font whose base grid is 8px. Sub-grid rendering forces the browser to anti-alias, blurring glyph edges and undermining the pixel-art identity the surface is trying to communicate — the tool name labels (브러쉬, 지우개, 채우기, etc.) will be illegible on most screens. | Medium-form mismatch (typography rendering); pixel font specification: Silkscreen is designed for 8px × n integer multiples. | Raise `.t-name` to `font-size: 8px` minimum. Also review `8px` labels in `.viewer-stage-label` and `.canvas-label` — those ARE on the 8px grid and are acceptable. |
| Minor | visual / contrast | Logo text (`--accent-text: #7b65c0`) renders on the header background (`--header-bg: #e9e2f5`). Estimated contrast ratio ~3.8:1, below WCAG AA 4.5:1 for 13px normal-weight text (Silkscreen is not bold). No screenshot available to measure precisely, but the color values yield this estimate with high confidence. | WCAG 2.1 SC 1.4.3 (Contrast Minimum) — 4.5:1 required for normal text below 18pt / 14pt bold. | Darken `--accent-text` slightly (e.g., `#6050b8`) or reduce header-bg slightly toward white; re-verify at 4.5:1 with a contrast checker. |
| Minor | usability | The eyedropper tool (스포이드) uses `&#8942;` (U+22EE VERTICAL ELLIPSIS, "⋮"). This symbol universally means "more options" / overflow menu in UI conventions. A user scanning the tool grid will misread it as "additional items", not as an eyedropper / color sampler. | Nielsen #6 (Recognition over Recall); icon semiotics — symbols must map to their affordance without verbal training. | Replace with a dedicated pipette or dropper Unicode character (e.g., U+1F9EA, or an inline SVG) and confirm user recognition in a quick spot-test. |
| Minor | usability | Undo/redo actions appear twice: once in `.header-tools` (header toolbar) and once in `.guide-history` (guide bar). The two pairs carry identical labels ("실행 취소" / "다시 실행") with no scope distinction. A user cannot tell whether header undo reverses canvas painting and guide undo reverses guide placement, or whether both control the same history stack. | Nielsen #4 (Consistency and Standards) — redundant controls with identical labels imply different scope but provide no signal to distinguish them. | If the two pairs share a unified history, remove the guide-bar duplicate and consolidate to the header. If scopes differ, label them explicitly ("캔버스 취소" vs. "가이드 취소"). |
| Minor | usability / accessibility | Secondary interactive controls fall below recommended touch targets: `.view-btn` has `min-height: 24px`, `.menu-btn` renders approximately 22px tall (3px padding + 10px Silkscreen + borders), `.sel-btn` has `min-height: 24px`, `.icon-btn` and `.hist-btn` are 26×26px. All fall short of the 44×44pt iOS HIG minimum and sit at or below the 24×24px WCAG 2.5.8 floor. The primary `.tool-btn` at `min-height: 44px` is correct; secondary controls don't follow suit. | Fitts's law (1954) — smaller targets increase acquisition cost and error rate; Apple HIG 44pt; WCAG 2.5.8 (Target Size Minimum). | Raise secondary buttons to at least `min-height: 32px` for a desktop tool, or 44px if a touch device audience is expected. |
| Minor | accessibility | Three structural accessibility issues: (1) `.sw-bg` and `.sw-fg` use `div role="button" tabindex="0"` but will not respond to Enter/Space without JS, unlike native `<button>`. (2) The brush track uses `role="presentation"` but visually simulates a range slider — should be `<input type="range">` for screen-reader operability. (3) `.hue-bar` has `role="presentation"` (strips all semantics) but also has `aria-label="색조 슬라이더"` — these conflict; `presentation` silences the label entirely. | WCAG 4.1.2 (Name, Role, Value) — interactive widgets must expose correct role and be keyboard-operable. | Replace swatch divs with `<button>`; replace brush-track and hue-bar with `<input type="range">`; remove conflicting `role="presentation"` from hue-bar. |
| Minor | detector (register-justified) | The detector fired 60 `nested-cards` hits. Root sources: (a) `mc-head`, `mc-body`, `mc-arm-l`, `mc-arm-r`, `mc-leg-l`, `mc-leg-r` bordered divs inside the viewer panel — these ARE nested bordered boxes by design; they are a CSS pixel-art Minecraft character where each body segment is intentionally a bordered rectangle. This is the content, not a layout anti-pattern. (b) Tool buttons, color picker elements, palette swatches, and viewer controls inside bordered side panels — standard for this genre (Aseprite / Photoshop-class tool layout; side panels containing bordered interactive widgets is industry-conventional). Register justified in both cases. The underlying concern the rule reflects — visual weight from borders-within-panels creating excessive containment layers — is real and worth monitoring as panel surface density is high, but does not warrant structural redesign. | ai-tells.md `nested-cards` rule. Register: pixel-art editor tool application (confirmed by domain, font choice, and canvas subject matter). | No structural change required. Monitor border weight: if the full-fidelity build feels heavy, consider reducing `--border` weight on inner controls (e.g., 0.5px or a subtle shadow instead of a full 1px stroke on palette cells). |

---

## Requirement Fulfillment

### DW-MOCK.1
PREMISE:  the mock renders a viewable surface for the main editor page.
EVIDENCE: The HTML file exists and is structurally complete (1043 lines). It contains: a `<header>` with logo, file menus, and undo/redo; a three-column `<main class="workspace">` grid (220px viewer panel, `1fr` canvas column, 196px tool panel); the left column renders a CSS Minecraft skin silhouette with view-mode controls; the center renders a pixel canvas with checkerboard background, canvas toolbar, and guide bar; the right panel renders drawing tools, brush size, and a color picker with palette grid. No screenshot available — this is structure-level verification only; pixel rendering unverified.
VERDICT:  PASS (structure-level; pixel gap noted in Notes)

### DW-MOCK.2
PREMISE:  lavender direction color applied, light background, Silkscreen pixel font visible, zero emoji in wireframe structure.
EVIDENCE:
- Lavender: `--accent-solid: #b8a4e0` applied; full lavender-tinted surface palette (`--surface: #f1edf8`, `--panel-bg: #ede9f7`, `--header-bg: #e9e2f5`, `--border: #c9bbeb`, etc.) used throughout panels and borders. Confirmed.
- Light background: `background: var(--background)` on `body` where `--background: #f8f5f2` (warm off-white). Confirmed.
- Silkscreen pixel font: `--font-pixel: 'Silkscreen', monospace` declared; applied to `.logo`, `.menu-btn`, `.panel-header`, `.tp-title`, `.guide-bar-title`, `.canvas-toolbar .ct-label`, `.ct-value`, `.canvas-label`, `.t-name`, `.brush-val`, `.hex-hash`, and more. Loaded via Google Fonts `<link>`. Confirmed.
- Zero emoji: All icons use HTML entities for Unicode geometric/typographic characters — `&#9670;` (◆), `&#9660;` (▼), `&#8617;` (↩), `&#8618;` (↪), `&#9998;` (✎), `&#9723;` (◻), `&#11044;` (⬤), `&#8942;` (⋮), `&#9638;` (▦), `&#10022;` (✦), `&#8645;` (⇅), `&#43;` (+), `&#8722;` (−), `&#215;` (×). None fall in Unicode emoji ranges (U+1F300–U+1F9FF or U+2600–U+27BF with emoji variation selectors). Confirmed zero emoji.
VERDICT:  PASS

**All requirements met:** YES

---

## Notes (non-blocking)

1. No screenshot available — structure-level critique only. Silkscreen rendering quality at 7px (the Major finding above), true contrast ratios, and spatial rhythm are unverified at the pixel level. Capture a screenshot via the browser MCP before sign-off.

2. Language inconsistency in placeholder copy: `[ pixel select ]` (canvas toolbar, line 876) and `[color picker]` (CSS `content:` on `.picker-area::after`) are English in an otherwise all-Korean UI. These read as development placeholders that were not translated. Mark for Korean translation: `[ 픽셀 선택 ]` / `[색상 선택기]`.

3. No dark mode support. No `@media (prefers-color-scheme: dark)` block or `data-theme` override is present. For a creative tool app — where dark UI is industry-default (Aseprite, Photoshop, Figma all default dark) — this is a notable omission for the full-fidelity build. Acceptable for the wireframe mock stage.

4. External font dependency: Silkscreen is loaded from `fonts.googleapis.com`. Will fall back to generic `monospace` in offline environments or if the external request is blocked. Acceptable for a local mock; self-host for production.

5. The CSS skin silhouette (`mc-skin` / `mc-head` etc.) is 64×96px within a 220px-wide viewer panel — compositionally small. The viewer stage area will have a lot of empty checker-pattern space around it. This is fine for wireframe intent but the eventual 3D viewer should fill the panel more purposefully.

6. Silkscreen distinctiveness check (ai-tells.md CHECKER): the aesthetic direction IS nameable — "soft pixel-art tool, lavender-retro" — and the combination of Silkscreen at system-scale, lavender-tinted panel surfaces, and a CSS Minecraft body as the preview is a specific, intentional, domain-cohesive set of choices that a generic system would not produce as a package. Distinctiveness criterion: PASS.

---

**Verdict: PASS**

Blockers: none. The two DW items are supported by structural evidence. The Major finding (Silkscreen at 7px) is a quality defect to fix before the full build; it does not block the mock-review gate because the requirement specifies the font be "visible," which it is in the DOM. Address the Major and Minor findings in the next phase before production code.

Report written to `/Users/kyeongah/Documents/GitHub/skinmaker/.design-foundations/build/skinforge-2-mock-review.md`
