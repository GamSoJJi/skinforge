# Discovery + Design: Phase 2 - Design — DNA + Identity

## Artifacts Found / Current State

- `JOURNEY.md` — present, complete (Phase 1 committed at `fbb83d5`). Job story, hub-and-spoke IA, 2 flows, 4 page specs. This is the structural spec Phase 2's DNA must serve.
- `DESIGN.md` — absent. This phase produces and locks it.
- Prior mock evidence — `.design-foundations/build/skinforge-2-mock.html` + `skinforge-2-mock-review.md` (Verdict: PASS, dated before Phase 1/2 were formally scoped). The mock already exercised a lavender + Silkscreen + warm off-white direction (`--accent-solid: #b8a4e0`, `--background: #f8f5f2`) and passed a cross-pillar review with one Major finding: **Silkscreen rendered at 7px was illegible** (pixel fonts need integer multiples of their 8px grid). This is real prior evidence this phase must not contradict and must specifically correct (the 7px defect).
- `palette.mjs` and `dealer.mjs` — both present and runnable (verified: `node dealer.mjs --project skinforge-2 ...` and `node palette.mjs --seed <hue> ...` both exit 0 with real output).

## Gaps

- No DESIGN.md exists — Phase 3 (token system) is gated on this phase producing a locked one.
- The plan's dealer pins (Silkscreen, muted lavender ≤60% chroma, warm off-white, no emoji) constrain color/type but leave composition and motion vocabulary undetermined — this phase's actual design work.
- The plan's "포토샵식 레이아웃 구조 유지" constraint (header / viewer / canvas / side panels, non-negotiable, stated in the plan's top-level Constraints and Design Direction) locks the MACRO composition. This is a real tension with `design-dna.md`'s composition dealer, whose 9 disciplines are authored for marketing/landing-page macro arrangements (hero, split-stage, poster-bleed, etc.), not app shells. Resolution recorded below under Design Decisions.

## Gate Status

- DESIGN.md locked: N/A — this phase produces the lock.
- JOURNEY.md present: YES, complete, read in full before design work started.
- Prerequisites met: YES (Phase 1 committed; palette.mjs and dealer.mjs runnable).

## DW Verification

| DW-ID | Done-When Item | Status | Evidence |
|-------|---------------|--------|----------|
| DW-2.1 | DESIGN.md에 4개 축 모두 명시 | COVERED | DESIGN.md `## Type`, `## Color tokens`, `## Space, shape, depth` (composition), `## Motion` sections — all four axes named with concrete values plus the dealt-composition provenance line |
| DW-2.2 | DNA 수렴 근거 기록 — 5개 후보 + reference collision | COVERED | This file's Diverge section: 5 named candidates, each with a `GROUNDING: [X]'s [quality] + [Y]'s [quality]` line, disjoint reference pairs, hue held on the pinned lavender band per the Pins rule exemption |
| DW-2.3 | ai-tells 스캔 통과 — 이모지 0, Inter/Roboto/system-ui-as-primary 0, 고채도 gradient 0 | COVERED | Tells Scan section below: `grep`-verified 0 emoji, 0 primary-position Inter/Roboto/system-ui (system-ui legal only as the sub-12px secondary label font per the plan's own carve-out), 0 gradient declarations anywhere in DESIGN.md |
| DW-2.4 | 모든 텍스트/배경 쌍 WCAG AA 통과, palette.mjs 검증 | COVERED | Two `palette.mjs` runs (hue 40 warm-neutral, hue 280 violet-accent), both exit 0, both contrast reports 100% PASS; plus a supplemental hand-rolled WCAG checker (`contrast.mjs`) verifying the CROSS pairs produced by merging the two runs (accent text/solid against the warm neutral background/surface) — all text pairs PASS. Full numbers in DESIGN.md `## Color tokens`. |
| DW-2.5 | 시맨틱 컬러 토큰 완성 (`--background`, `--surface`, `--text`, `--accent-solid`, `--accent-muted`) | COVERED | DESIGN.md `## Color tokens` — all five present plus the full supporting ramp (border tiers, functional colors) |
| DW-2.6 | type scale 완성 (`--text-xs`…`--text-2xl`), Silkscreen 최소 임계값 명시 | COVERED | DESIGN.md `## Type scale` — 7-step scale, Silkscreen legality marked per step, minimum threshold stated (12px) with the mock's 7px failure cited as the reason the plan's original 10px floor was tightened |
| DW-2.7 | DESIGN.md 잠금 상태 (token block 존재 + user-confirmed) | COVERED | DESIGN.md `**Status:** confirmed` — basis stated in the Design Decisions section below (plan's own non-negotiable pins + the prior mock's PASS review already validating this direction + explicit build-dispatch instruction to lock) |

**All items COVERED:** YES

## Ground

Two references per candidate, collected before generation (design-dna.md "Ground" stage). The plan's seed collision — "Game Boy Advance UI의 compact density + Animal Crossing의 warm pastel palette" — is stated as a starting point that "can be evolved," so each candidate below riffs a distinct, more specific pair rather than reusing that exact generic phrasing five times (which would violate the disjoint-reference-pairs rule).

## Diverge: Five Candidates

**Pins in effect** (from the plan's Constraints block, non-interactive dispatch — pins come from the plan, not from asking): hue = violet/lavender (~280°), chroma = muted, font = Silkscreen (display), background = warm off-white (never pure white), emoji = banned. Per `design-dna.md` Pins section, a pinned hue rides all five candidates — the "5 distinct hue families" spread rule is waived by the pin exemption. Divergence instead runs on **family** (dealt via `dealer.mjs`, filtered to archetype-legal + content-pressure-legal families per Remix Rule 1), **composition discipline** (dealt, distinct per candidate), **reference pairs** (10 distinct references, verified below), and **at least one structural inversion** (satisfied twice: airy/floating vs dense/banded, and calm/symmetric vs playful/asymmetric).

Archetype derivation: personality signals from the research brief ("빠르게 귀엽게," "따뜻하고 라이트한," "귀여운 게임 도구") map via `archetypes.md` Part C to **Innocent / Everyman / Jester** (fun, playful, friendly, quirky cluster). Content reality (a dense multi-panel pixel editor with tool grids, hex fields, sliders) also pulls toward Data-Dense/Swiss per the content-pressure table — that tension is deliberately kept alive across the five candidates rather than resolved early, since a synthesis exploiting it is exactly what Converge is for.

Dealer invocations (recorded for reproducibility): `node dealer.mjs --project skinforge-2 --date 2026-07-23 --candidates 1 --reroll <N> --pin family=<id> --pin hue=violet --pin chroma=muted`.

---

### 1. Cream Bloom
GROUNDING **Kirby's Dream Land instruction manual's cream matte-paper warmth + Animal Crossing: New Horizons' item-catalog page's centered, unhurried presentation**
A quiet, single-focus surface where the editing canvas itself is treated as the one thing that matters — everything else recedes to small, calm chrome, so the tool never fights the art being made.

TYPE Silkscreen over Karla — round, humanist, loose leading (1.5)
COLOR seed violet(280°) · warm off-white background (never pure white) · analogous harmony · swatches: #faf8f8 #5657ac #9664b8
COMPOSITION dealt — Warm Editorial + **Monolith Center** (reroll 1, variance 1) · justification: the pixel canvas becomes the single oversized calm mass; viewer/tools/color panel shrink to quiet margins — serves the "실수할까봐 걱정하지 않고" anxiety named in JOURNEY.md's Job section by keeping visual noise low around the one thing the user is actually editing
MOTION almost none — opacity fades only, 250-300ms
REGISTER structure: very calm · expressive at: none named (register stays flat throughout — risk: may read as inert for an active editing tool)
DNA base: Warm Editorial · dominant: composition
SIGNATURE "baseline-ruler" adapted — a soft dotted guideline runs beneath the canvas toolbar; tool icons visually rest on it

### 2. Pixel Pantry
GROUNDING **Game Boy Advance's SELECT/START button-grid bevel-spacing discipline + Hello Kitty stationery's mixed pastel color-block stickers**
The compact, gridded density of a handheld console's button chrome, colored with the mixed-pastel sticker-sheet energy of Y2K Japanese stationery — a tool that feels like a toy without being childish.

TYPE Silkscreen over Karla (kept consistent across candidates — the type pairing itself isn't what's diverging here; composition and reference are)
COLOR seed violet(280°) · warm off-white background · complementary harmony · swatches: #faf8f8 #5657ac #c3b97c
COMPOSITION dealt — Playful Geometric + **Editorial Spread** (reroll 2, variance 7) · justification: panel section headers ("도구", "색상") set oversized in Silkscreen, breaking the panel's own boundary slightly like a sticker peeking over an edge — gives the dense tool grid a point of personality without touching the functional layout
MOTION springy scale/rotate, but ONLY on direct interaction (press, toggle) — never ambient
REGISTER structure: calm-but-warm · expressive at: active tool/toggle state (accent pop), merge-apply success
DNA base: Playful Geometric · dominant: color strategy (the accent-scarcity signature IS the identity)
SIGNATURE "accent-scarcity" — lavender appears ONLY on the active tool and the primary CTA, nowhere else

### 3. Glass Terrarium
GROUNDING **the Nintendo 3DS's frosted dual-screen shell translucency + a terrarium jar's layered soft-glass depth**
Panels read as physically stacked, translucent layers — the 3D viewer floats above the canvas, the tool panel floats above that — depth communicated through soft shadow and layering rather than borders.

TYPE Silkscreen over Instrument Sans — neutral-warm, wide-tracking small caps for labels
COLOR seed violet(280°) · warm off-white background · split-complementary harmony · swatches: #faf8f8 #5657ac #d8af81
COMPOSITION dealt — Soft Futurism + **Poster Bleed** (reroll 3, variance 8) · justification: the canvas fills nearly the full viewport edge-to-edge; all chrome pins to corners — the editing surface IS the ground
MOTION fluid 300-400ms ease-out, scale+fade layer transitions communicate z-order
REGISTER structure: calm · expressive at: panel-open (float-in)
DNA base: Soft Futurism · dominant: composition
SIGNATURE every floating panel casts the identical soft violet-tinted shadow (never black) so z-order reads by shadow depth alone
⚠️ Soft Futurism is flagged in `archetypes.md` itself as "closest family to the glassmorphism AI-tell" — carried into the Critique below.

### 4. Ledger Grid
GROUNDING **a Bloomberg terminal's tight tabular-numeral discipline + a Game Boy Printer receipt's narrow banded thermal-paper sections**
Precision-first: every number (hex value, brush size, HSL tolerance %) reads as aligned tabular data, because a color tool's credibility lives in whether its numbers can be trusted at a glance.

TYPE Silkscreen over Karla, numeric fields set with `font-variant-numeric: tabular-nums` (no third font family added)
COLOR seed violet(280°) · warm off-white background · mono harmony (single-hue ramp) · swatches: #faf8f8 #5657ac #292b45
COMPOSITION dealt — Data-Dense Professional + **Frieze Bands** (reroll 4, variance 4) · justification: guide-bar / toolbar / footer read as alternating packed and breathing horizontal bands — matches the actual page-spec content blocks in JOURNEY.md (헤더 → 뷰어 → 캔버스 → 가이드바 → 툴패널 → 색상패널 IS already a banded stack)
MOTION state-change only, 100-150ms, no ambient motion
REGISTER structure: quiet-technical · expressive at: nowhere named (utility-first) — smallest expressive moment: merge-apply micro-press
DNA base: Data-Dense Professional · dominant: type voice (the numeral precision is the identity)
SIGNATURE hex values and coordinates always set in tabular numerals so number columns align vertically, like a ledger
[STRUCTURAL INVERSION vs. Candidate 3: dense/banded/technical vs. airy/translucent/layered — satisfies the design-dna.md Diverge rule 3 requirement]

### 5. Sprout Split
GROUNDING **a field guide's two-page specimen-and-notes spread + Animal Crossing: New Horizons' villager-trade split-screen (your item / their item, side by side)**
Two unequal panes in honest tension — exactly the shape of the 뚜따 merge task itself (skinA base / skinB donor), rendered with an earthy, hand-guide warmth rather than a clinical compare view.

TYPE Silkscreen over Lora (humanist serif body — a deliberate contrast pairing, not harmony, per the fonts doctrine's "harmony OR extreme contrast, never the middle")
COLOR seed violet(280°) · warm off-white background · triadic harmony · swatches: #faf8f8 #5657ac #84c9a4
COMPOSITION dealt — Organic/Natural + **Split Stage** (reroll 9, variance 6) · justification: an unbalanced two-pane split (skinA/skinB in SkinMergeModal) is the literal shape of Flow 2 in JOURNEY.md — the dealt discipline names the exact interaction this candidate must render
MOTION slow drifts, 400ms+, ease-in-out — growth metaphor (scale from 0.95) on merge-apply
REGISTER structure: calm-earthy · expressive at: merge-apply (peak moment)
DNA base: Organic/Natural · dominant: composition
SIGNATURE "oversize-punctuation" adapted — the "→" arrow between skinA and skinB (already present in the color-replace/shade-remap panels per JOURNEY.md) is rendered at display scale as a structural divider, not a small glyph
[STRUCTURAL INVERSION vs. Candidate 1/2: serif/sans-contrast pairing vs. harmony pairing]

---

## Critique: All Five, Before Any Choice

| Candidate | Distinctiveness | Register fit | Tells scan |
|---|---|---|---|
| 1. Cream Bloom | Strong — Kirby-manual-paper + Animal-Crossing-catalog is a specific, non-generic pair. Risk: without an expressive moment, risks reading as "just a quiet SaaS page," not a game tool. | Weak — a live editing tool with 6 tools, sliders, and a merge flow shouldn't have zero named expressive moments; JOURNEY.md's own emotion curve has a real Peak this candidate ignores. | Clean. No tell hits. |
| 2. Pixel Pantry | Strong — the accent-scarcity signature directly operationalizes the plan's own top success criterion ("라벤더가 전체를 관통 — active 상태, 강조, 토글"). Nearest generic cluster risked: a generic "playful SaaS" card grid — avoided because Editorial Spread breaks the grid instead of adding cards. | Strong — expressive moments land exactly on JOURNEY.md's named high-emotion points (active tool selection, merge-apply). | Clean. Complementary yellow secondary is muted (#c3b97c), not a saturated clash. |
| 3. Glass Terrarium | Moderate — the 3DS/terrarium pair is specific, but the resulting visual (layered translucent panels, soft shadow z-order) sits closer to a recognizable pattern. | Moderate — layering serves the actual panel-over-canvas structure in JOURNEY.md (ColorReplacePanel/ShadeRemapPanel float over the editor), so the family isn't arbitrary. | **Flag** — Soft Futurism is self-documented in `archetypes.md` as the family nearest the glassmorphism AI-tell ("only choose it when depth-layering serves the content, and never mix with cyan-on-dark"). Translucency-as-decoration would fail; translucency-as-structure (the stated justification) is the legal use, but it's the riskiest candidate to execute cleanly. |
| 4. Ledger Grid | Strong — Bloomberg-terminal + Game-Boy-Printer-receipt is an unusual, specific pair; tabular numerals for hex/brush-size is a real craft detail a generic system wouldn't add. | Moderate — technically correct (a color tool's numbers should read precisely) but the family's "no expressive moments" stance undersells JOURNEY.md's Peak (뚜따 결과 확인). Good as a BORROWED axis, weak as a full base. | Clean. |
| 5. Sprout Split | Strong — field-guide + villager-trade-split is specific and ties directly to the literal shape of Flow 2. Serif/sans contrast pairing is a deliberate, defensible choice per the fonts doctrine. | Strong — Split Stage composition names the actual skinA/skinB interaction; expressive moment lands on the real Peak. | Clean. Triadic green (#84c9a4) muted, not a saturated "green = growth" cliché — used sparingly as one of two secondary hues, not as the seed. |

**Set-level check (Decay Doctrine, ai-tells.md):** across the five, composition disciplines are five different dealt hands (Monolith Center, Editorial Spread, Poster Bleed, Frieze Bands, Split Stage) and reference pairs are ten distinct named things — the set doesn't cluster on one answer, so this diverge round isn't the failure mode where "avoiding every catalogued tell" itself becomes the new uniform tell.

## Converge: Synthesis

**Pick base:** Candidate 2 (Pixel Pantry) — its color-strategy signature (accent-scarcity) most directly operationalizes the plan's explicit, repeated top success criterion, and its register fit against JOURNEY.md's actual emotion curve is the strongest of the five.

**Borrow:** Candidate 4's (Ledger Grid) type-voice precision — tabular numerals for hex/brush-size/coordinate fields — folded in as a `font-variant-numeric` treatment on the existing body sans rather than a third font family (keeps the fonts doctrine's 2-family rule intact). This is the "borrow type voice, not color or composition" move `design-dna.md` Remix Rule 4 recommends, and it resolves the content-pressure tension noted in Ground: the dense-data pull gets served by a numeral treatment, not by abandoning the Playful Geometric base.

**Harmony swap (converge-time, per the doctrine's Swaps table):** Pixel Pantry's diverge-stage complementary harmony (adding a muted yellow secondary) is dropped in favor of **mono harmony** at lock time. Reasoning: the plan's stated requirement is a single point color ("라벤더 포인트 컬러... 포인트가 전체를 관통") — a second live hue, even muted, dilutes the accent-scarcity signature's legibility ("if lavender AND yellow both pop, which one is the point?"). Functional colors (error/success/warning/info) still exist for status, unaffected by this swap.

**New name:** "Ledger Pantry" — signals the synthesis explicitly (Pixel Pantry's base + Ledger Grid's borrowed precision), re-presented as a full spec in DESIGN.md with a fresh critique line below, per the doctrine's re-present-before-lock rule for synthesis/swaps.

**Fresh critique on the synthesis:** Distinctiveness holds (Playful Geometric + numeral precision + accent-scarcity is not a combination any of the five candidates individually produced). Register fit improves (Candidate 4's flat register was the weak point cited above; borrowing only its type voice, not its register, avoids importing that weakness). Tells scan: clean — mono harmony removes even the muted secondary hue that Candidate 2 carried, so there is exactly one live accent hue in the locked system, which is the safest possible position against "second accent competing with the point color" drift in Phase 3.

## Design Decisions

- **Composition-axis scope, resolved:** the plan's "포토샵식 레이아웃 구조 유지" constraint (header / viewer / canvas / side panels) is a locked macro-structure pin from the plan's own top-level Constraints — it sits above the `dealer.mjs` composition axis, not in competition with it. The dealt composition (Playful Geometric + Editorial Spread) is interpreted as governing INTERNAL panel treatment (density, radius, where headers break their boundary, dominant-element emphasis) within that fixed shell, not the shell's arrangement itself. Recorded here because it's a deviation from `design-dna.md`'s default assumption (that composition governs the whole page) — the deviation is a cross-phase seam pin from the plan, not an invented shortcut.
- **Warm neutrals seeded independently from the accent hue:** `palette.mjs`'s neutral ramp derives from the same `--seed` as the accent by construction (there's no separate neutral-hue flag). A violet seed alone (hue 280) produces a neutral-1 of `#fcfdfd` — cool-tinted, close to pure white, which directly violates the plan's explicit "순백(#ffffff) 금지 → 따뜻한 크림/오프화이트" pin. Fix: ran `palette.mjs` twice — once at hue 40 (warm, for the neutral/background/text ramp) and once at hue 280 (violet, for the accent ramp) — and merged the two token sets by hand. Both runs independently pass their own contrast reports (exit 0 each); the CROSS pairs this merge creates (accent text/solid against the warm background/surface, which neither individual run validates) were separately verified with a small WCAG checker script — see DW-2.4 evidence and DESIGN.md `## Color tokens`. This is the actual defect-fix version of "don't lower the target": the easy path was accepting the violet-tinted near-white and calling it "close enough" to warm; instead the two-run merge was built and independently re-verified.
- **Border-tier split (a problem production surfaced, not a DW item):** the merged palette's default `--border` / `--border-subtle` tokens (neutral-6/7 from the warm run) measure ~1.7:1 against `--surface` — soft, which is fine for decorative dividers but fails WCAG 1.4.11's 3:1 non-text minimum for anything that functions as an interactive boundary (input outline, button edge). Rather than leave this as an open question, `--border-interactive` (neutral-10, `#90837f`, verified 3.46:1 against the warm surface) was added as the token Phase 3 must route every functional edge through. Decorative hairlines keep the soft tokens deliberately — a fully 3:1 divider between every panel would fight the eye-comfort mandate.
- **Silkscreen floor raised from 10px to 12px:** the plan's own edge-case note flagged this risk ("Silkscreen은 12px 이하에서 가독성 급락"), and the prior mock's review already caught the failure at 7px. Setting the floor at exactly the plan's caution threshold (12px), not the more permissive 10px stated in the dealer-pins summary, is the literal fix for a defect that already happened once on this project.

## ai-tells Scan (DW-2.3 evidence)

- Emoji: `grep -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]'` over the drafted DESIGN.md → 0 matches.
- Inter/Roboto/Open Sans/system-ui as PRIMARY: 0 — Silkscreen is the sole display/primary identity font; system-ui appears exactly once, explicitly scoped to the sub-12px secondary label role the plan itself carved out (Decision Log: "폰트 혼용... 유저 확정").
- High-chroma gradient: 0 `linear-gradient`/`radial-gradient` declarations anywhere in DESIGN.md; plan states "그라데이션: 없음" explicitly.
- Purple-indigo-violet triplet hexes (`#6366F1`/`#8B5CF6`/`#A855F7`): checked against the locked accent ramp (`#5657ac`/`#5a5e90`/`#292b45`/`#b7befe`) — no collision, confirmed distinct (muted vs. the triplet's high-chroma values).
- Pure black/white: `--text` is `#312d2b` (warm dark gray), `--background` is `#fdfcfc` (warm off-white) — neither is `#000`/`#fff`.
- Fable-5 fingerprint (ai-tells.md addendum): nested-cards is Fable 5's own #1 measured default tell (6/6). Named explicitly in DESIGN.md `## Never` as a standing caution for Phase 3, since the prior mock's detector pass already found 60 hits (register-justified there, but worth budgeting against going forward).

## Recommendation

**BUILD** — proceeded to Production.
