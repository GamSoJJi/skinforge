# Design Review: Phase 2 — DNA + Identity (Ledger Pantry)

## Rendered Evidence (Step 0)

- Screenshot: none — DESIGN.md is a token/spec document; no visual mock this phase. Structure-level critique only; pixel-level contrast/spacing/hierarchy unverified. Run the browser MCP on a Phase 3 mock to capture pixels.
- Surface: DESIGN.md (token/spec document), JOURNEY.md (structural spec), Phase 2 discovery file reviewed for DNA pipeline evidence.

---

## Assessment B — Deterministic Detector

- Command: `node scripts/detect.mjs /Users/kyeongah/Documents/GitHub/skinmaker/.claude/worktrees/skinforge-2/DESIGN.md > .../scratchpad/detect.json`
- Exit: **0 (ran)**
- Findings: **5 total — rules: purple-triplet (3 hits, line 139), em-dash-overuse (1 hit, "136 em-dashes"), numbered-section-markers (1 hit, advisory)**
- Opened only after Assessment A findings were frozen: **YES**

**Register analysis of all three firing rules:**

| Rule | Evidence | Register judgment |
|------|----------|-------------------|
| `purple-triplet` (3×, high) | `#6366f1`, `#8b5cf6`, `#a855f7` at line 139 | These hexes appear verbatim inside the `## Never` section as the explicitly BANNED values, alongside the statement "checked against this system's accent ramp — no collision." The detector found them in their own prohibition list. This is a false positive: the values are documentation of what is excluded, not design choices in use. Severity: Note. |
| `em-dash-overuse` (medium) | "136 em-dashes in body copy" | The rule counts `—` or `--`. DESIGN.md's `:root { ... }` CSS token block contains dozens of `--`-prefixed custom properties (`--background`, `--surface`, `--text`, etc.). DESIGN.md is a technical specification, not prose body copy. 136 hits are attributable to CSS variable syntax. False positive in register. Severity: Note. |
| `numbered-section-markers` (advisory) | "decorative sequence: 01, 07, 10, 11, 12" | The matched numbers likely correspond to token-ramp suffixes in CSS declarations (`--neutral-1`, `--neutral-7`, `--neutral-10`, `--neutral-11`, `--neutral-12`). Advisory severity; structural false positive in a spec document. Severity: Note. |

All detector findings are register-justified false positives in the context of a design token specification document. None evidence actual defects in the locked design.

---

## Triage

- Baseline (always-on): visual (design-dna) + ai-tells
- Dispatched: `design-dna` (DNA pipeline verification — 5 candidates, critique, convergence, lock), `ai-tells` CHECKER mode, `fonts` (Silkscreen minimum threshold, type scale), `color` (palette.mjs runs, contrast pairs, WCAG AA scope)
- Not applicable: `usability` (no interactive surface this phase), `journey` (JOURNEY.md reviewed for design alignment, not for usability scoring), `data-viz` (no data visualization), `behavioral` (no conversion surface)
- Deferred: none — surface is within cap

---

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Minor | color | `--accent-muted` (`#b7befe`, accent-7) has no explicitly recorded contrast pair in DESIGN.md. The palette.mjs hue-280 run quotes pairs for accent-11/neutral-2 and accent-on-solid/accent-9, but not for accent-7. The edge case specifically asks whether palette.mjs verification for muted lavender is recorded. It is not recorded — `#b7befe` against `--background` (#fdfcfc) is approximately 1.67:1, which fails WCAG AA for text use. The DESIGN.md's stated usage ("selection tints / muted badges") scopes it to fills, and estimated text-on-fill contrast (--text #312d2b on #b7befe) is ~6.84:1 which passes — but this pair is not in the verification table. | ch08 color: contrast verification must be recorded for all tokens with text-bearing potential; WCAG AA scope must be explicit | Add a row to the contrast table: `PASS --text (#312d2b) on --accent-muted (#b7befe): ~6.84:1` (for badge/tint contexts where text appears on this fill), OR add a note explicitly scoping accent-muted to background-fill-only use and prohibiting text of any color other than --text on this surface. One line closes the gap before Phase 3 implementation. |
| Minor | fonts | The `## Type scale` section provides a 7-step table (token names + px values + Silkscreen legality) but does NOT include a corresponding CSS `:root { ... }` custom-property declaration block. The color tokens section provides the CSS block verbatim (Phase 3 pastes it directly); the type scale section provides only a table. Phase 3 must derive `--text-xs`, `--text-sm`, `--text-base`, etc. declarations from the table without a ready-to-paste block. | design-dna.md DESIGN.md Template: token blocks should be paste-ready; Phase 3 re-reads DESIGN.md at every checkpoint | Add a small CSS block under Type scale listing `--text-2xs: 10px;` through `--text-2xl: 28px;`. Mirrors the color token block's format and removes a source of drift in Phase 3. |
| Note | detector / purple-triplet | Detector fired on `#6366F1`, `#8B5CF6`, `#A855F7` at line 139. As analyzed above, these appear in the `## Never` list as the explicit ban targets, not as used colors. The DESIGN.md accent ramp (`#5657ac` / `#5a5e90` / `#292b45` / `#b7befe`) is verified distinct from these triplet values (muted vs. high-chroma). Register-justified false positive; no design defect. | ai-tells.md: `purple-triplet` / Checkable Signatures | No change needed in DESIGN.md. If the detector is rerun on Phase 3's HTML, ensure the Never list is in a code comment rather than live CSS text to reduce false-positive noise. |
| Note | detector / em-dash-overuse | Detector reports 136 em-dashes; these are CSS `--` variable prefixes in the token block, not prose. | ai-tells.md: `em-dash-overuse` (counts `--` as well as `—`) | No design change needed. False positive from CSS syntax; not a copy/prose defect. |
| Note | detector / numbered-section-markers | Advisory hit on "01, 07, 10, 11, 12" — likely token-ramp suffixes, not decorative section headers. | ai-tells.md: `numbered-section-markers` (advisory) | No change needed. |
| Note | ai-tells / system-ui | Body font stack leads with `system-ui`. ai-tells.md flags system-ui as a tell when it is the PRIMARY font. Here it is the secondary label font for sub-12px use (Silkscreen is the display/primary identity font). The plan's own Decision Log carves this out explicitly; the `## Never` section restates the scoping. Register-legitimate. | ai-tells.md: "Inter/Roboto/system-ui as primary font" (tell only when PRIMARY); design-dna.md Remix Rule 7 (harmony check) | No change needed. The carve-out is explicit and bounded. |
| Note | journey | JOURNEY.md (ColorReplacePanel States) documents `#6677dd` as the existing code's active-sprioid border color. This is a hardcoded hex not in the DESIGN.md token system. Phase 3 must replace it with a semantic token (`--accent-text` #5a5e90 is the closest match at 5.77:1 on surface). | design-dna.md Gate: deviations require editing DESIGN.md first, not improvising in code; every implementation pass re-reads DESIGN.md | No DESIGN.md change needed this phase; flag for Phase 3 implementation: route the active-sprioid border through `--accent-text` or `--accent-solid`, not the legacy hex. |

---

## Requirement Fulfillment

### DW-2.1
PREMISE:  DESIGN.md에 4개 축 모두 명시 (type voice, color strategy, composition, motion vocabulary)
EVIDENCE: DESIGN.md contains:
- **Type voice** — `## Type` section: display = Silkscreen (Google Fonts, pixel-grid font, 8px base unit), body = system-ui Korean-aware stack, numeric fields use `font-variant-numeric: tabular-nums`, leading (body 1.4 / Silkscreen 1.2), weights (Silkscreen 400; body 400/600). `## Type scale` — 7 steps from `--text-2xs` 10px to `--text-2xl` 28px, each marked with Silkscreen legality.
- **Color strategy** — `## Color tokens`: seed hue violet 280°, chroma muted, harmony mono (complementary dropped at converge time with rationale), two `palette.mjs` runs quoted, full CSS `:root { ... }` block, semantic token mapping.
- **Composition** — header block: "Playful Geometric + Editorial Spread, variance 7 (seed `skinforge-2|2026-07-23|2|...`, from `scripts/dealer.mjs`)." `## Space, shape, depth`: spacing scale (4px base, 7 steps), radius (6px controls, 10px panels), border tier split, shadow formula.
- **Motion vocabulary** — `## Motion`: timing (micro 100-150ms / standard 200-300ms / large 300-400ms), easing (ease-out; spring/scale on direct interaction only), allowed/never list, prefers-reduced-motion strategy.
VERDICT:  **PASS**

---

### DW-2.2
PREMISE:  DNA 수렴 근거가 기록됨 — 5개 후보, 각 후보의 reference collision (X의 [특정 품질] + Y의 [특정 품질]) 포함
EVIDENCE: Discovery file (`skinforge-2-phase-2-discovery.md`) Diverge section contains all five candidates:
1. **Cream Bloom**: "Kirby's Dream Land instruction manual's cream matte-paper warmth + Animal Crossing: New Horizons' item-catalog page's centered, unhurried presentation"
2. **Pixel Pantry**: "Game Boy Advance's SELECT/START button-grid bevel-spacing discipline + Hello Kitty stationery's mixed pastel color-block stickers"
3. **Glass Terrarium**: "the Nintendo 3DS's frosted dual-screen shell translucency + a terrarium jar's layered soft-glass depth"
4. **Ledger Grid**: "a Bloomberg terminal's tight tabular-numeral discipline + a Game Boy Printer receipt's narrow banded thermal-paper sections"
5. **Sprout Split**: "a field guide's two-page specimen-and-notes spread + Animal Crossing: New Horizons' villager-trade split-screen (your item / their item, side by side)"

All ten references are distinct (disjoint reference pairs verified). Each collision names X's [specific quality] + Y's [specific quality] as required by design-dna.md Ground section. Critique pass and Converge/Synthesis are also recorded. DESIGN.md header carries the winning candidate's grounding line verbatim.
VERDICT:  **PASS**

---

### DW-2.3
PREMISE:  ai-tells 스캔 통과 — 이모지 0, Inter/Roboto/system-ui as primary 0, 채도 높은 gradient 0
EVIDENCE: Discovery file ai-tells Scan section documents:
- Emoji: grep over DESIGN.md → 0 matches. DESIGN.md `## Never` states "Emoji anywhere — 0 tolerance."
- Inter/Roboto/Open Sans/system-ui as PRIMARY: 0. Silkscreen is the sole display/primary identity font. system-ui appears once in the body font stack, explicitly scoped to sub-12px secondary label role with a plan Decision Log citation.
- High-chroma gradient: 0 `linear-gradient`/`radial-gradient` declarations. `## Never` states "Any gradient — plan states '그라데이션: 없음' explicitly."
- Purple-indigo-violet triplet (`#6366F1`/`#8B5CF6`/`#A855F7`): accent ramp (`#5657ac`/`#5a5e90`/`#292b45`/`#b7befe`) verified distinct — muted chroma vs. triplet's high-chroma values.
- Pure black/white: `--text` is `#312d2b` (warm dark gray), `--background` is `#fdfcfc` (warm off-white).
Detector false positives on these hexes (purple-triplet rule) are in the `## Never` ban list, not used values — confirms the negative space is clean.
VERDICT:  **PASS**

---

### DW-2.4
PREMISE:  모든 텍스트/배경 쌍이 WCAG AA 통과 (≥4.5:1 body, ≥3:1 large), palette.mjs 검증
EVIDENCE: DESIGN.md `## Color tokens` records two `palette.mjs` runs (hue 40 warm neutrals, hue 280 violet accent), both exit 0. Quoted contrast reports:
- neutral-11 on neutral-2: 5.70:1 and 5.69:1 (both runs) ✓
- neutral-12 on neutral-2: 12.93:1 and 12.92:1 ✓
- accent-11 on neutral-2: 5.81:1 and 5.79:1 ✓
- accent-on-solid on accent-9: 6.52:1 and 5.97:1 ✓
Cross pairs (separately verified with WCAG 2.1 relative-luminance checker):
- --text (#312d2b) on --background (#fdfcfc): 13.31:1 ✓
- --text on --surface: 12.88:1 ✓
- --text-secondary (#69615f) on --surface: 5.71:1 ✓
- --accent-text (#5a5e90) on --surface: 5.77:1 ✓
- --accent-text on --background: 5.96:1 ✓
- --accent-on-solid (#f9faff) on --accent-solid (#5657ac): 6.01:1 ✓
- --accent-solid on --background: 6.11:1 (≥3:1 non-text) ✓
- --border-interactive on --surface: 3.46:1 (WCAG 1.4.11 non-text) ✓
DESIGN.md states: "All DW-2.4-scoped text/background pairs PASS." Decorative hairline tokens (~1.7:1) explicitly scoped to non-functional use.
Gap: --accent-muted (#b7befe, used as fill/badge background) has no recorded contrast pair — documented as Minor finding above.
VERDICT:  **PASS** (with Minor documentation gap on accent-muted — see findings table)

---

### DW-2.5
PREMISE:  시맨틱 컬러 토큰 완성 (`--background`, `--surface`, `--text`, `--accent-solid`, `--accent-muted`)
EVIDENCE: DESIGN.md `## Color tokens` — semantic block contains all five required tokens:
- `--background: var(--neutral-1);` → #fdfcfc ✓
- `--surface: var(--neutral-2);` → #faf8f8 ✓
- `--text: var(--neutral-12);` → #312d2b ✓
- `--accent-solid: var(--accent-9);` → #5657ac ✓
- `--accent-muted: var(--accent-7);` → #b7befe ✓
Plus supporting set: --surface-hover, --surface-active, three border tiers, --text-secondary, --accent-bg-subtle, --accent-solid-hover, --accent-text, --accent-on-solid, plus functional color set (error/success/warning/info at -9 and -11 steps).
VERDICT:  **PASS**

---

### DW-2.6
PREMISE:  type scale 완성 (`--text-xs`…`--text-2xl`), Silkscreen 사용 최소 임계값 명시
EVIDENCE: DESIGN.md `## Type scale` — 7-step table covering the full required range plus one extra step below xs:
| Token | Size | Font | Silkscreen legal? |
|`--text-2xs`|10px|body sans only|NO|
|`--text-xs`|11px|body sans only|NO|
|`--text-sm`|12px|Silkscreen or body sans|YES — minimum threshold|
|`--text-base`|14px|body sans|YES for short labels|
|`--text-lg`|16px|Silkscreen|YES|
|`--text-xl`|20px|Silkscreen|YES|
|`--text-2xl`|28px|Silkscreen|YES|

Silkscreen minimum threshold explicitly stated: "Silkscreen minimum threshold: 12px. Below 12px, always render in the body sans stack — never Silkscreen." The plan's original 10px floor is tightened to 12px with the Phase 1 mock's 7px defect (illegible Silkscreen — Major finding in `skinforge-2-mock-review.md`) cited as evidence.
Gap: No CSS custom-property declaration block for type tokens (only a table) — documented as Minor finding above.
VERDICT:  **PASS** (Minor gap: no paste-ready CSS block; table values are complete and correct)

---

### DW-2.7
PREMISE:  DESIGN.md 잠금 상태 (token block 존재 + user-confirmed)
EVIDENCE:
- Status line: `**Date:** 2026-07-23 · **Status:** confirmed`
- Token block: CSS `:root { ... }` custom-property block exists under `## Color tokens` (the only token block DESIGN.md produces — type tokens are in table form, not a separate CSS block).
- Confirmation basis: Discovery file Design Decisions section records: "plan's own non-negotiable pins + the prior mock's PASS review already validating this direction + explicit build-dispatch instruction to lock." Per design-dna.md Pins section, in a non-interactive dispatch (build path — agent can't prompt), pins come from the research doc / plan Constraints and unpinned axes are dealt without asking. The plan's top-level Constraints block (Silkscreen, muted lavender, warm off-white, no emoji, macro layout) constitutes user-law approval; the Status: confirmed reflects execution of that instruction.
VERDICT:  **PASS**

---

**All requirements met:** YES (with Minor documentation gaps noted; no DW items failed)

---

## Edge Case Verification

### EC-1: DESIGN.md 잠금 없이 Phase 3 진행 불가
CHECK: Is DESIGN.md actually locked?
EVIDENCE: `**Status:** confirmed` in DESIGN.md header line 1. Discovery file Design Decisions documents the lock basis. Phase 3 is cleared to proceed.
RESULT: **HANDLED** ✓

### EC-2: Silkscreen은 12px 이하에서 가독성 급락 — 최소 font-size 기준이 type scale에 명시됐는지 확인
CHECK: Is the Silkscreen minimum font-size threshold stated in the type scale?
EVIDENCE: DESIGN.md `## Type scale` states verbatim: "Silkscreen minimum threshold: 12px. Below 12px, always render in the body sans stack — never Silkscreen. The plan's original pin said '10px 미만,' but the Phase-1 mock measured Silkscreen at 7px and found it illegible (Major finding — pixel fonts need integer multiples of their grid; 7px falls off the 8px grid entirely). The floor here is raised to 12px." Every scale step below 12px is marked "NO" in the Silkscreen legal column.
RESULT: **HANDLED** ✓

### EC-3: muted lavender가 AA 대비율을 만족하는지 — palette.mjs 검증 결과가 DESIGN.md에 기록됐는지 확인
CHECK: Is the palette.mjs verification result for --accent-muted (#b7befe) recorded in DESIGN.md?
EVIDENCE: DESIGN.md contrast table does NOT include any pair involving `--accent-muted` (#b7befe, accent-7). The two quoted palette.mjs run reports cover: neutral-11/12 on neutral-2, accent-11 on neutral-2, accent-on-solid on accent-9 — but not accent-7. The DESIGN.md scopes accent-muted to "selection tints / muted badges" (fill/background role, not text), and the general note "All DW-2.4-scoped text/background pairs PASS" implicitly excludes it. Estimated contrast: --text (#312d2b) on --accent-muted (#b7befe) ≈ 6.84:1 (passes 4.5:1); --accent-muted as a text color on --background ≈ 1.67:1 (fails, but not a claimed use). The specific verification result is not recorded in DESIGN.md.
RESULT: **PARTIALLY HANDLED** — functional scoping is addressed (accent-muted is fill-only); explicit palette.mjs evidence is absent from the document. See Minor finding above.

---

## Notes (non-blocking)

1. **No pixel evidence this phase**: All critique is structure-level. The cross-pair contrast values in DESIGN.md are self-reported from a WCAG checker script (`contrast.mjs`) rather than from palette.mjs directly. These cannot be independently verified without running the checker. Phase 3 mock review should confirm rendered contrast values against the actual applied tokens.

2. **Composition dealer scope resolution**: The plan's macro layout pin (header / viewer / canvas / side panels) sits above the dealer's composition axis — the design-dna.md composition disciplines are authored for marketing surfaces (hero, split-stage, poster-bleed), not app shells. The discovery file resolves this explicitly: the dealt composition (Playful Geometric + Editorial Spread) governs INTERNAL panel treatment, not the macro shell. This is a legitimate cross-phase seam interpretation; it's documented, not hidden.

3. **Organic/Natural candidate (Sprout Split) with Lora serif**: The discovery file notes Lora (humanist serif) as a deliberate body font for one candidate. This was not selected — the synthesis uses Silkscreen + system-ui. No defect, but Phase 3 should note that Lora was considered and rejected (its warm earthy register fit the Sprout Split direction, not the selected Ledger Pantry direction).

4. **JOURNEY.md hardcoded hex `#6677dd`** in ColorReplacePanel States: This is a pre-existing implementation detail not yet aligned to the token system. Phase 3 must remap to `--accent-text` (#5a5e90) or `--accent-solid` (#5657ac) for the active-sprioid border.

5. **Dark mode explicitly out of scope**: Confirmed in DESIGN.md Open Questions ("다크모드 불필요로 확정"). No dark-scheme token block was produced — correct per the plan.

---

## Issues (PASS — no blockers)

No blocking issues. Two Minor findings (accent-muted documentation gap, type scale CSS block missing) are polish items for Phase 2 close or Phase 3 handoff. Three detector findings are register-justified false positives.

---

**Verdict: PASS**
