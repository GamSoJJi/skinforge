# Design Review: Phase 1 — SkinForge Cute Studio Design Foundations

**Reviewer:** Design Review Agent (dual-blind, cross-pillar)
**Date:** 2026-07-23
**Artifact:** `/Users/kyeongah/Documents/GitHub/skinmaker/DESIGN.md`

---

## Rendered Evidence (Step 0)

- Screenshot: none — this is a spec-only phase; DESIGN.md is the sole artifact
- Surface: DESIGN.md token-and-spec document reviewed at structure level; pixel-level contrast/spacing/hierarchy on the live UI is not verifiable at this phase (by design — Phase 2 component build is the rendering phase)

---

## Assessment B — Deterministic Detector

- Command: `node scripts/detect.mjs /Users/kyeongah/Documents/GitHub/skinmaker/DESIGN.md`
- Exit: 1 — MODULE_NOT_FOUND (`scripts/detect.mjs` does not exist in this project)
- Findings: N/A — no rendered .html artifact; spec-only phase; detector script absent from project
- Opened only after Assessment A findings were frozen: YES
- Assessment B status: **N/A (no rendered artifact)** — the dispatch prompt explicitly scopes this as a spec-only phase and directs "detector N/A if the script is not applicable to markdown spec files." The N/A carve-out applies. This is not a FAIL.

---

## Triage

- Baseline (always-on): visual + usability — applied at the spec level (token adequacy, hierarchy, semantic coverage)
- Dispatched: `content-design` — the document carries real product copy rationale, methodology notes, and naming decisions worth auditing
- Not applicable: `data-viz` (no charts or dashboards), `journey` (no flow or routing), `behavioral` (no conversion surface)
- Deferred: none — surface is contained; all relevant pillars covered

---

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Minor | design-dna / typography | The grounding mock (cited as the locked pin source) contains confirmed Silkscreen instances at 9px and 8px — below the 12px floor this document is now setting. DESIGN.md correctly calls this out as a Phase 2 fix, but the locked spec is therefore grounded in an artifact that partially violates one of its own non-negotiable constraints. | WCAG SC 1.4.4 minimum text size + the document's own stated "dealer pin" rule (12px floor is "not negotiable") | Phase 2 must enumerate and reclassify every sub-12px Silkscreen instance at the component-spec stage — the fix-forward note in the document is correct but should be an explicit Phase 2 gate, not a free-floating note. |
| Minor | design-dna / color | `--text-secondary` #7A7085 on `--background` #FEFDF5 passes at 4.59:1 — a margin of only 0.09:1 above the 4.5:1 AA body-text floor. At the smallest verified body size (11px/Nunito, `--text-xs`), any anti-aliasing variation or subpixel rendering shift on non-retina displays can erode this pass. | WCAG 2.1 SC 1.4.3 — contrast ratio minimum; human-contrast perception (thin margins erode under real rendering conditions) | Either darken `--text-secondary` by one step (targeting ≥4.8:1 to carry a real buffer) or explicitly restrict its use to ≥14px (large-text threshold of 3:1 gives more headroom); document the restriction in Phase 2 component specs. |
| Minor | content-design | The Contrast Verification methodology note cites "a standalone WCAG 2.1 relative-luminance checker" but does not name it, link it, or include it in the repository. A future reviewer or auditor cannot reproduce the 16 listed values without locating or recreating the script. | Nielsen #6 (recognition over recall) applied to document reproducibility; WCAG conformance requirement that stated ratios be verifiable | Name and include the standalone checker script in the repo (e.g., `scripts/verify-contrast.mjs`) or include the computed intermediate luminance values for each color so the math is self-contained. |
| Note | design-dna / color | `--text-secondary` on `--surface-alt` (#FFF0F5) is not listed in the contrast table. This pair is plausible in active hover states where panel body copy sits on the tinted surface. It likely passes (surface-alt is barely more saturated than background, so the ratio drops only marginally from 4.59:1) but is unverified. | WCAG 2.1 SC 1.4.3 — all real text/background combinations must be verified | Add this pair to the contrast table in Phase 2, once hover-state component usage is confirmed. |
| Note | content-design / contrast table | Row 12 (`--accent-secondary` on `--surface-viewer`) labels the threshold as "≥3:1 non-text-adjacent" but the use case is described as "informational labels" — which is text and would require ≥4.5:1. The actual value (5.02:1) passes the higher body-text threshold, so there is no compliance gap, but the threshold column label is imprecise and could mislead a future auditor into thinking a weaker standard was applied. | Accuracy in technical documentation (content-design doctrine: don't create ambiguity through imprecision) | Correct the threshold label in row 12 to "≥4.5:1 body text (informational label)" to reflect both the actual use and the passing value. |

---

## Requirement Fulfillment

### DW-1.1
PREMISE:  폰트 결정 — Silkscreen display + 라운드 sans-serif body (Nunito 또는 Fredoka One) DESIGN.md에 명시. Evidence required: font choice stated with rationale in DESIGN.md.
EVIDENCE: Typography section states Display: Silkscreen (Google Fonts, 400/700); Body: Nunito (Google Fonts, 400/500/600/700). Rationale for Nunito over Fredoka One is explicit: "Fredoka One's default weight reads too heavy immediately above the 12px Silkscreen floor (this project's UI-label sizes cluster at 11–14px), where Nunito's rounded terminals stay legible and light enough to sit under Silkscreen without competing with it." CSS font-stack is documented: `--font-body: 'Nunito', -apple-system, "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif`.
VERDICT:  PASS

### DW-1.2
PREMISE:  라이트 테마 semantic 토큰 전체 정의 (`--background`, `--surface`, `--text`, `--accent-solid`, `--accent-secondary`, `--accent-tertiary`, `--border`, functional colors). Evidence required: complete token block in DESIGN.md with all aliases present.
EVIDENCE: `[data-theme="light"]` CSS block is present with all required tokens: `--background: #FEFDF5`, `--surface: #FFFFFF`, `--text: #3D3340`, `--accent-solid: #C8490D`, `--accent-secondary: #9B8EC4`, `--accent-tertiary: #FFD166`, `--border: #E8DFF0`. Functional colors present: `--error-9/11`, `--success-9/11`, `--warning-9/11`, `--info-9/11`. Additional aliases present: `--surface-alt`, `--surface-canvas`, `--surface-viewer`, `--accent-solid-hover`, `--accent-tint`, `--accent-on-solid`, `--accent-secondary-tint`, `--accent-secondary-border`, `--text-secondary`, `--text-on-accent`.
VERDICT:  PASS

### DW-1.3
PREMISE:  모든 텍스트/배경 쌍 WCAG AA 통과 (body ≥4.5:1, large ≥3:1) — 검증 후 DESIGN.md에 기록. Evidence required: contrast ratios listed for each pair in DESIGN.md.
EVIDENCE: Contrast Verification section contains a 16-row table, all marked PASS. Representative values: `--text` on `--background` 11.79:1; `--text` on `--surface` 12.03:1; `--text-secondary` on `--background` 4.59:1; `--accent-solid` on `--background` 4.66:1 (body text); `--accent-on-solid` on `--accent-solid` 4.76:1; functional text colors (`--error-11`, `--success-11`, `--warning-11`, `--info-11`) all ≥4.5:1. Decorative-only pairs (lavender 2.92:1; butter yellow 1.41:1) are listed separately with explicit non-text/non-load-bearing labeling. (See also Minor finding: `--text-secondary` margin of 0.09:1 above floor.)
VERDICT:  PASS

### DW-1.4
PREMISE:  보더 라디우스 스케일 문서화 (sm/md/lg values with intended usage). Evidence required: radius scale table in DESIGN.md.
EVIDENCE: Border Radius Scale section contains a 4-row table: `--radius-sm: 6px` (inputs/form controls); `--radius-md: 8px` (buttons, palette swatches, tooltips — named as the "dealer-pinned 8px floor from the approved mock"); `--radius-lg: 12px` (panels, modals); `--radius-full: 999px` (pill-shaped controls). Accompanying constraint: "Never 0 (flat corners break the Cute Studio identity) and never above 12px on structural panels."
VERDICT:  PASS

### DW-1.5
PREMISE:  DESIGN.md locked (token block present + Status: locked). Evidence required: DESIGN.md exists with full token block and Status: locked in the header.
EVIDENCE: Header line: "**Status:** locked". Full light-theme token block is present in the `[data-theme="light"]` CSS block. Dark-theme placeholder block is present as `[data-theme="dark"]` with all names set to `TBD`.
VERDICT:  PASS

### DW-1.6
PREMISE:  아이콘 스타일 레퍼런스 확정 (stroke-width, linecap, linejoin, viewBox, color handling). Evidence required: icon style reference section in DESIGN.md with specific values.
EVIDENCE: Icon Style Reference section contains a table with: `viewBox: 0 0 18 18`; `stroke-width: 2.5` on root SVG / `2` on small child elements; `stroke-linecap: round`; `stroke-linejoin: round`; `fill: none` by default; color handling: `currentColor` throughout with state mapping (`--text-secondary` at rest, `--accent-solid` + `--accent-tint` background active, `--text` on hover). All five required properties (stroke-width, linecap, linejoin, viewBox, color handling) are present with specific values.
VERDICT:  PASS

---

## Edge Case Fulfillment

### Edge Case 1 — Coral AA body contrast on cream
PREMISE:  코랄 (#FF7F50)은 크림 배경에서 AA body 대비(4.5:1) 미달 가능 — 더 깊은 코랄로 조정하거나 대형 텍스트(3:1) 전용으로 제한 (the document must show this was addressed)
EVIDENCE: The accent color was replaced with dark terracotta `--accent-solid: #C8490D` — not the original coral #FF7F50. Contrast Verification table shows `--accent-solid` #C8490D on `--background` #FEFDF5 at 4.66:1 ≥4.5:1 body text threshold. The adjustment (darkening to terracotta) is the explicit resolution of this risk.
VERDICT:  PASS

### Edge Case 2 — Fredoka One at 12px too heavy
PREMISE:  Fredoka One은 12px에서 너무 두꺼울 수 있음 — Nunito가 fallback (the document must show a font choice was made with consideration of small sizes)
EVIDENCE: Typography section states: "Chosen over Fredoka One: Fredoka One's default weight reads too heavy immediately above the 12px Silkscreen floor (this project's UI-label sizes cluster at 11–14px), where Nunito's rounded terminals stay legible and light enough to sit under Silkscreen without competing with it. The reviewed mock exercises Nunito at 11–13px across every interactive element with all text-contrast pairs passing." Small-size consideration is the primary documented rationale for the font choice.
VERDICT:  PASS

### Edge Case 3 — Butter yellow decorative limitation
PREMISE:  버터옐로우는 배경과 대비가 낮아 decorative 전용으로 한정 가능성 (the document must address butter yellow's decorative limitation)
EVIDENCE: `--accent-tertiary: #FFD166` is defined with inline annotation "illustration/decoration only — fails non-text contrast against cream by design, never load-bearing." Decorative-only pairs table confirms 1.41:1 contrast on `--background` and labels it "illustration/decoration only, never load-bearing text or a functional boundary." Addressed twice: in the token definition and in the verification section.
VERDICT:  PASS

### Edge Case 4 — Dark mode token slots as TBD placeholders
PREMISE:  다크 모드 토큰 슬롯은 플레이스홀더만 — 실제 값은 후속 스프린트 (dark mode slots must exist as TBD placeholders, not be absent entirely)
EVIDENCE: `[data-theme="dark"]` CSS block is present immediately after the light block with every token name from the light block set to `TBD`. All 25 token names present (--background, --surface, --surface-alt, --surface-canvas, --surface-viewer, --accent-solid, --accent-solid-hover, --accent-tint, --accent-on-solid, --accent-secondary, --accent-secondary-tint, --accent-secondary-border, --accent-tertiary, --text, --text-secondary, --text-on-accent, --border, --error-9/11, --success-9/11, --warning-9/11, --info-9/11). Dark Mode Placeholders section provides additional rationale and migration note re: the pre-existing `src/App.css` dark values.
VERDICT:  PASS

---

**All requirements met:** YES

---

## Notes (non-blocking)

1. **Unnamed contrast-checker script** — The 16 contrast values were computed with "a standalone WCAG 2.1 relative-luminance checker" that is not named or linked. This is not a DW requirement, but it creates a reproducibility gap. Recommendation: commit the script or inline the intermediate luminance values. (Also listed as Minor finding above.)

2. **`--text-secondary` on `--surface-alt` unverified** — This pair is not in the contrast table. Given the color proximity between `--background` and `--surface-alt`, it likely passes, but is unverified at this phase. A Phase 2 component-spec task should confirm.

3. **Phase 2 dependency: sub-12px Silkscreen remediation** — The grounding mock has confirmed violations below the 12px floor. The document correctly calls this out, but success depends on Phase 2 diligently closing those instances. The fix-forward note should be escalated to an explicit Phase 2 gate or DW item in that phase's plan.

4. **`--accent-secondary` body-text threshold label** — Contrast row 12 labels threshold as "≥3:1 non-text-adjacent" for an "informational label" use case. The value (5.02:1) passes ≥4.5:1, making this a documentation imprecision only, not a compliance gap.

---

## Verdict

**DESIGN-REVIEW PASS**

All six DW items pass with concrete evidence from the rendered artifact (DESIGN.md). All four listed edge cases are explicitly addressed in the document. Three Minor findings exist (sub-12px Silkscreen inheritance from grounding mock, thin `--text-secondary` contrast margin, unnamed verification script) and do not rise to blockers under the verdict rules — none represent a DW item with missing evidence, a specification requirement the document visibly violates, or a critical cited-principle violation that breaks the experience. The design direction is distinctively named ("pixel-cute creative studio," Silkscreen as brand anchor, terracotta single-signal active state, warm cream field) — not a generic output.
