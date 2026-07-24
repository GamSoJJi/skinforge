# Design Review: SkinForge Cute Studio Mock

## Rendered Evidence (Step 0)

- Screenshot: none — browser MCP unavailable; structure-level critique only. Pixel-level contrast values derived from the CSS token definitions and the WCAG relative-luminance formula; layout/spacing unverified visually.
- Surface: `.design-foundations/build/skinforge-cute-studio-mock.html` — single-page Main Editor mock, five structural regions (top bar, options bar, left toolbar, canvas, right panel, bottom bar).

---

## Assessment B — Deterministic Detector

- Command: `node scripts/detect.mjs` — file not found at `/Users/kyeongah/Documents/GitHub/skinmaker/scripts/detect.mjs`
- Exit: 3 (N/A — detector script absent)
- Findings: N/A — detector script does not exist in this repo
- Opened only after Assessment A findings were frozen: YES

---

## Triage

- Baseline (always-on): visual + usability
- Dispatched: `design-dna` / `checklists` (visual surface — typography, color, composition, AI-tells); `usability` (interactive buttons, toggles, inputs)
- Not applicable: `data-viz` (no charts), `content-design` (labels are minimal/decorative), `journey` (single-screen), `behavioral` (no conversion mechanics)
- Deferred: none

---

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Major | design-dna | Two `.logo-mark` elements both render simultaneously. The first SVG (lines 582–595) is an abandoned draft containing 7 rects that form a partial, incorrect pixel-S; the second (line 598) is the correct clean SVG, overlaid with `margin-left:-16px`. Both paint coral pixels, producing a doubled/corrupted logo mark composite. | Gestalt figure clarity; Nielsen #8 (aesthetic and minimalist design): dead DOM artifacts degrade perceived craft | Remove the first `.logo-mark` div entirely (lines 581–595). The second SVG is the correct logo mark and should stand alone. |
| Minor | usability | `.icon-btn` `transition` declares only `background 120ms, border-color 120ms` — `color` is absent. Text colour snaps from `--text-secondary` to `--text-primary` instantly on hover while the background fades. `.tool-btn` correctly includes `color 120ms` in its transition. | Nielsen #4 (consistency and standards): interaction behaviour diverges within the same design system | Add `color 120ms` to `.icon-btn` transition property. |
| Minor | tokens | `opts-btn` and `pill-btn` use hardcoded `border-radius: 20px` rather than `var(--r-btn)`. Requirement passes (20px ≥ 8px) but the token system is bypassed, undermining future-proofing. | Design-systems token hygiene: every radius should route through the token so changes propagate | Replace `border-radius: 20px` on both selectors with `var(--r-btn)` or introduce a dedicated `--r-pill` token if pill shape is intentional. |

---

## Contrast Calculations (key values)

All luminance values computed from the WCAG 2.1 relative-luminance formula: L = 0.2126·R_lin + 0.7152·G_lin + 0.0722·B_lin.

| Pairing | Contrast | Threshold | Result |
|---------|----------|-----------|--------|
| `--coral` #C8490D on `--bg-cream` #FEFDF5 | 4.68:1 | ≥4.5:1 text | PASS |
| `--text-on-coral` #FFFFFF on `--coral` #C8490D | 4.76:1 | ≥4.5:1 text | PASS |
| `--text-primary` #3D3340 on `--bg-cream` #FEFDF5 | 11.81:1 | ≥4.5:1 | PASS |
| `--text-primary` #3D3340 on `--lavender-tint` #FFF0F5 | 10.88:1 | ≥4.5:1 (hover) | PASS |
| `--text-secondary` #7A7085 on `--bg-surface` #FFFFFF | 4.68:1 | ≥4.5:1 | PASS |
| `--text-secondary` #7A7085 on `--bg-cream` #FEFDF5 | 4.60:1 | ≥4.5:1 | PASS |
| `#8C7EB5` border on `--bg-surface` #FFFFFF (guide off) | 3.64:1 | ≥3:1 non-text | PASS |
| `#8C7EB5` fill vs white surround (guide on) | 3.64:1 | ≥3:1 non-text | PASS |
| `--lavender` #9B8EC4 on `--bg-viewer` #2A2530 (aria-hidden label) | 5.03:1 | informational | PASS |

---

## Requirement Fulfillment

### DW-MOCK.1
PREMISE:  complete Main Editor renders
EVIDENCE: HTML contains all five structural regions: `header#top-bar` (logo + File/Color nav), `#options-bar` (Brush Size + Shape toggle groups), `aside#toolbar` (Pen, Eraser, Fill, Eyedropper, Rect Select, Magic Wand — 6 tools), `main#canvas-area` (320×320 SVG grid with skin silhouette and region guides), `aside#right-panel` (3D viewer + colour panel + 5×5 palette grid), `footer#bottom-bar` (guide toggle, skin-type pill toggle, undo/redo). All editor regions are structurally present. The logo-mark area has a rendering defect (duplicate SVGs) but does not prevent any region from rendering.
VERDICT:  PASS

### DW-MOCK.2
PREMISE:  cream bg (#FEFDF5), coral (#C8490D) ≥4.5:1 text / ≥3:1 non-text, all buttons ≥8px radius, panels ≥12px, inputs ≥6px, Silkscreen + Nunito
EVIDENCE: `--bg-cream: #FEFDF5` defined and applied to `body`. `--coral: #C8490D` defined; computed contrast on cream = 4.68:1 (≥4.5:1 ✓); non-text threshold 3:1 also satisfied. `--r-btn: 8px` applied to `.tool-btn`, `.icon-btn`; `.opts-btn` and `.pill-btn` use `20px` (>8px, satisfies minimum). `--r-panel: 12px` applied to `#right-panel`. `--r-input: 6px` applied to `.hex-input`. `--font-display: 'Silkscreen'` applied to display labels; `--font-body: 'Nunito'` applied to body and all interactive text elements.
VERDICT:  PASS

### DW-MOCK.3
PREMISE:  All interactive text (including hover states) WCAG AA ≥4.5:1
EVIDENCE: All computed text-on-background pairings for interactive elements: nav buttons rest (11.81:1 ✓); nav buttons hover (10.88:1 ✓); opts-btn inactive (11.81:1 ✓); opts-btn hover (10.88:1 ✓); opts-btn active #FFF/coral (4.76:1 ✓); pill-btn inactive text-secondary/white (4.68:1 ✓); pill-btn active (10.88:1 ✓); icon-btn rest text-secondary/cream (4.60:1 ✓); icon-btn hover (10.88:1 ✓). All ≥4.5:1.
VERDICT:  PASS

### DW-MOCK.4
PREMISE:  Guide toggle: off-state border #8C7EB5 on white ≥3:1; on-state fill #8C7EB5 on white ≥3:1
EVIDENCE: `guide-track` parent `footer#bottom-bar` background = `var(--bg-surface) = #FFFFFF`. Off-state: `background: var(--bg-surface)`, `border: 1.5px solid #8C7EB5`. On-state: `background: #8C7EB5`. Both cases: L(#8C7EB5) = 0.2389, L(#FFFFFF) = 1.0; contrast = 3.64:1 ≥ 3:1 ✓.
VERDICT:  PASS

### DW-MOCK.5
PREMISE:  tool-btn:hover and icon-btn:hover foreground = var(--text-primary) #3D3340 on lavender-tint #FFF0F5 ≥4.5:1
EVIDENCE: `.tool-btn:hover { background: var(--lavender-tint); color: var(--text-primary); }` confirmed at CSS lines 240–243. `.icon-btn:hover { background: var(--lavender-tint); color: var(--text-primary); }` confirmed at lines 568–572. Contrast #3D3340 / #FFF0F5 = 10.88:1 ≥ 4.5:1 ✓.
VERDICT:  PASS

### DW-MOCK.6
PREMISE:  Logo SVG currentColor (no hardcoded hex in UI roles)
EVIDENCE: Both `.logo-mark` SVGs declare `fill="currentColor"` with no inline `fill="#..."` attributes. Parent container sets `color: var(--coral)` via CSS. `.logo-title` uses `color: var(--coral)`. Hardcoded hex values appear only inside the decorative 3D viewer illustration and skin-silhouette SVG fills — neither are UI-role colours.
VERDICT:  PASS

### DW-MOCK.7
PREMISE:  Palette swatches --r-swatch = 8px
EVIDENCE: Token defined: `--r-swatch: 8px` at line 45. Applied: `.swatch { border-radius: var(--r-swatch) }` at line 447. All 25 palette swatch divs carry class `swatch`.
VERDICT:  PASS

### DW-MOCK.8
PREMISE:  Chunky stroke icons: stroke-linecap round, stroke-linejoin round, stroke-width ≥2
EVIDENCE: All 6 tool-button SVGs (Pen, Eraser, Fill, Eyedropper, Rect Select, Magic Wand) carry `stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"` on the root `<svg>` element. Child `<circle>` elements that carry their own `stroke-width` use `"2"` (≥2 ✓). One circle uses `stroke="none"` as a decorative filled dot — no stroke required.
VERDICT:  PASS

**All requirements met:** YES

---

## Notes (non-blocking)

- **Pixel-level coverage gap**: no screenshot was available and the browser MCP was not connected. Contrast values are computed algebraically from the CSS tokens. Actual rendered spacing, alignment, and font rendering (especially Silkscreen at 8–9px) are unverified at the pixel level. A browser-capture pass is recommended before final sign-off.
- **No dark-mode support**: no `@media (prefers-color-scheme: dark)` block is present. Not a listed requirement for this mock, but will need to be addressed if carried forward to production.
- **"Palette" label at 8px**: inline override `style="font-size:8px"` drops below the base 9px. Silkscreen was designed for small-grid use so 8px is its native size; computed contrast remains 11.81:1 (PASS). Flagged as a readability edge case only.
- **`current-swatch` uses `--r-panel` (12px) not `--r-swatch` (8px)**: the 40×40px active-colour swatch uses the panel radius token. Not a spec violation but diverges from the palette swatch token. Consider `--r-swatch` or a new `--r-swatch-lg` token.
- **Distinctiveness**: the design has a clear, nameable aesthetic direction — "cute kawaii pixel studio": cream + coral + lavender palette, Silkscreen pixel font, near-circular palette swatches, blocky Minecraft 3D figure. At least one non-generic choice is present (Silkscreen as the display font in a productivity context). Passes ai-tells.md CHECKER mode.

---

**Verdict: PASS**

One Major defect (duplicate logo-mark SVGs causing visual corruption of the logo area) and two Minor issues are noted. No DW requirement is unmet and no Critical principle violation was found. The Major logo defect should be resolved before the next build phase.
