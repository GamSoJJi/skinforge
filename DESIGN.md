# Design: Ledger Pantry
**Date:** 2026-07-23 · **Status:** confirmed
**Archetype:** Innocent / Everyman, Jester inflection · **Register:** calm structure · expressive at: active tool/toggle state, 뚜따 merge-apply success (JOURNEY.md Peak), TipBanner onboarding warmth
**Grounding:** Game Boy Advance's SELECT/START button-grid bevel-spacing discipline + Hello Kitty stationery's mixed pastel color-block stickers
**DNA:** Playful Geometric + type voice (tabular-numeral precision) from Data-Dense Professional · **Dominant axis:** color strategy
**Composition:** \<dealt\> — Playful Geometric + Editorial Spread, variance 7 (seed `skinforge-2|2026-07-23|2|pin:chroma=muted,family=playful-geometric,hue=violet`, from `scripts/dealer.mjs`). Governs INTERNAL panel treatment (density, where a header breaks its own boundary, dominant-element emphasis) — the macro shell (header / viewer / canvas / side panels) is a separate locked pin from the plan's Constraints, held fixed.
**Pins:** hue = violet 280° (muted chroma), font = Silkscreen (display), background = warm off-white (never pure white), emoji = banned — all from the plan's Constraints block, non-negotiable; dealt around, never re-chosen. Harmony swapped complementary → mono at converge time (see discovery doc `Converge` section).

## Direction
A compact, gridded pixel-editor chrome — Game-Boy-button density colored with sticker-sheet pastel warmth — where lavender is the single, scarce signal of "this is active / this is the thing to press," and every number a user has to trust (a hex code, a brush size, a tolerance percentage) reads as aligned tabular data. It serves 10대-20대 뚜따 유저 doing a fast, low-stakes, one-session edit: nothing about the surface should demand study, and the one color that does pop should always mean the same thing.

## Signature move
라벤더(`--accent-solid`, `#5657ac`)는 활성 도구, ON 상태 토글, 그리고 주요 CTA(옷입히기 "입히기" 버튼, 색상/색조 패널의 "적용" 버튼)에서만 나타난다 — 패널 배경, 보더, 비활성 아이콘, 헤더 크롬 어디에도 라벤더는 쓰이지 않는다. 이 accent-scarcity 규칙이 성공 기준 "라벤더 포인트가 전체를 관통 (active 상태, 강조, 토글)"을 코드 레벨에서 강제 가능한 규칙으로 만든다.

## Expressive moments
1. **활성 도구 / 토글 ON** — 미세한 라벤더 팝 (accent-scarcity). 구조 레지스터에서 유일하게 벗어나는 상시 신호.
2. **뚜따 입히기 적용 성공** (JOURNEY.md 감정 곡선의 Peak 지점) — 버튼 마이크로 스케일 프레스(≈150ms) + 결과가 주 에디터에 반영되는 순간 부드러운 fade+scale 전환(300ms). Kahneman peak-end rule을 반영해 이 순간만 표준 타이밍보다 한 단계 위로 다이얼을 올린다.
3. **TipBanner 온보딩** (JOURNEY.md의 "편집 탐색" Low/frustration 구간 대응) — 나머지는 구조 레지스터를 유지하되, 첫 진입 힌트 카피의 어조만 약간 더 따뜻하게. 시각적으로는 배지 radius를 살짝 키우는 정도로 그친다 — 레지스터를 전역으로 올리지 않는다.

## Type
- Display: **Silkscreen** (Google Fonts, open-source, pixel-grid font — 8px base unit) — logo, panel titles, tool names, section headers, primary CTA labels.
- Body: **system-ui, Korean-aware stack** — `-apple-system, "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif` — all labels below the Silkscreen floor, tooltips, hex/description text, panel body copy. This is the plan's own carved-out exception (Decision Log: "폰트 혼용... 유저 확정") — legal here specifically because it is never the primary/display identity font, only the sub-12px eye-comfort fallback.
- Numeric fields (borrowed from Data-Dense Professional, Ledger Grid candidate): body font + `font-variant-numeric: tabular-nums` — hex values, brush size, coordinates, HSL tolerance %. No third font family introduced (fonts doctrine: no more than two families for text content).
- Leading: body 1.4 · Silkscreen 1.2 (tight leading reads cleaner for a pixel font at small sizes)
- Weights: Silkscreen ships one weight (400) — hierarchy comes from size + the accent-scarcity color rule, never from a faux-bold. Body sans: 400 / 600.

## Type scale

| Token | Size | Font | Silkscreen legal? |
|---|---|---|---|
| `--text-2xs` | 10px | body sans only | NO |
| `--text-xs` | 11px | body sans only | NO |
| `--text-sm` | 12px | Silkscreen or body sans | YES — minimum threshold |
| `--text-base` | 14px | body sans (default body copy) | YES for short labels |
| `--text-lg` | 16px | Silkscreen (tool names, section headers) | YES |
| `--text-xl` | 20px | Silkscreen (panel titles) | YES |
| `--text-2xl` | 28px | Silkscreen (logo / wordmark) | YES |

**Silkscreen minimum threshold: 12px.** Below 12px, always render in the body sans stack — never Silkscreen. The plan's original pin said "10px 미만," but the Phase-1 mock (`skinforge-2-mock-review.md`) measured Silkscreen at 7px and found it illegible (Major finding — pixel fonts need integer multiples of their grid; 7px falls off the 8px grid entirely). The floor here is raised to 12px, 2px above that failure point, so Phase 3 does not repeat the defect.

## Color tokens

Built from two `palette.mjs` runs, merged (see rationale in the discovery doc's Design Decisions — a single violet seed produces a cool-tinted near-white background that violates the plan's "no pure white, warm cream instead" pin, so neutrals are seeded independently from the accent hue):

```
node scripts/palette.mjs --seed 40  --chroma muted --harmony mono --scheme light   # warm neutrals (background/surface/border/text)
node scripts/palette.mjs --seed 280 --chroma muted --harmony mono --scheme light   # violet accent (the lavender point color)
```

```css
:root {
  /* neutrals — from the hue-40 (warm) run */
  --neutral-1: #fdfcfc;
  --neutral-2: #faf8f8;
  --neutral-3: #f3f0ee;
  --neutral-4: #ebe7e5;
  --neutral-6: #d9d0cd;
  --neutral-7: #cbc1be;
  --neutral-8: #b4a8a4;
  --neutral-10: #90837f;
  --neutral-11: #69615f;
  --neutral-12: #312d2b;

  /* accent — from the hue-280 (violet) run */
  --accent-3: #edefff;
  --accent-7: #b7befe;
  --accent-9: #5657ac;
  --accent-10: #474796;
  --accent-11: #5a5e90;
  --accent-12: #292b45;
  --accent-on-solid: #f9faff;

  /* functional — from either run (identical formula, hue-independent) */
  --error-9: #c56c65;    --error-11: #86534f;
  --success-9: #84cc86;  --success-11: #486e49;
  --warning-9: #ceb47e;  --warning-11: #6f6144;
  --info-9: #7aabce;     --info-11: #4c677a;

  /* semantic — DW-2.5 required tokens + supporting set */
  --background: var(--neutral-1);           /* #fdfcfc — warm off-white, never pure white */
  --surface: var(--neutral-2);               /* #faf8f8 */
  --surface-hover: var(--neutral-3);
  --surface-active: var(--neutral-4);
  --border-subtle: var(--neutral-6);         /* decorative hairlines only, ~1.7:1 by design */
  --border: var(--neutral-7);
  --border-interactive: var(--neutral-10);   /* #90837f — functional edges (inputs, buttons), verified 3:1+ */
  --text-secondary: var(--neutral-11);
  --text: var(--neutral-12);                 /* #312d2b — warm dark gray, never pure black */
  --accent-bg-subtle: var(--accent-3);
  --accent-solid: var(--accent-9);           /* #5657ac — the lavender point color */
  --accent-solid-hover: var(--accent-10);
  --accent-text: var(--accent-11);
  --accent-muted: var(--accent-7);           /* #b7befe — soft lavender for selection tints / muted badges, distinct from accent-solid */
}
```

**Contrast — both source runs (exit 0 each, from `palette.mjs`'s own report):**
```
[hue 40, warm neutrals]   PASS neutral-11 on neutral-2:  5.70:1 (target 4.5)
                          PASS neutral-12 on neutral-2: 12.93:1 (target 7.0)
                          PASS neutral-12 on neutral-3: 12.01:1 (target 4.5)
                          PASS accent-11  on neutral-2:  5.81:1 (target 4.5)   [hue-40's own accent, not used — accent comes from hue-280 below]
                          PASS accent-on-solid on accent-9: 6.52:1 (target 4.5)
[hue 280, violet accent]  PASS neutral-11 on neutral-2:  5.69:1 (target 4.5)
                          PASS neutral-12 on neutral-2: 12.92:1 (target 7.0)
                          PASS neutral-12 on neutral-3: 12.00:1 (target 4.5)
                          PASS accent-11  on neutral-2:  5.79:1 (target 4.5)
                          PASS accent-on-solid on accent-9: 5.97:1 (target 4.5)
```

**Contrast — the merged CROSS pairs** (neither individual run validates these; verified with a standalone WCAG 2.1 relative-luminance checker since the merge combines tokens from two different runs):
```
PASS  text (#312d2b) on background (#fdfcfc):        13.31:1  (target 4.5, body)
PASS  text (#312d2b) on surface (#faf8f8):            12.88:1  (target 4.5, body)
PASS  text-secondary (#69615f) on surface (#faf8f8):   5.71:1  (target 4.5, body)
PASS  accent-text (#5a5e90) on surface (#faf8f8):      5.77:1  (target 4.5, body)
PASS  accent-text (#5a5e90) on background (#fdfcfc):   5.96:1  (target 4.5, body)
PASS  accent-on-solid (#f9faff) on accent-solid (#5657ac): 6.01:1 (target 4.5, body — button label text)
PASS  accent-solid (#5657ac) on background (#fdfcfc):  6.11:1  (target 3.0, UI/large — non-text boundary use)
PASS  border-interactive (#90837f) on surface (#faf8f8): 3.46:1 (target 3.0, WCAG 1.4.11 non-text — functional edges)
```
All DW-2.4-scoped text/background pairs (body ≥4.5:1, large ≥3:1) PASS. `--border` / `--border-subtle` (the decorative hairline tokens, ~1.7:1 against surface) are intentionally soft and are NOT used for anything functional — see `## Never` below; every interactive edge routes through `--border-interactive` instead, which independently clears the WCAG 1.4.11 non-text 3:1 minimum.

## Space, shape, depth
- Spacing scale: 4px base unit (pixel-grid aligned) — 4 / 8 / 12 / 16 / 24 / 32 / 48
- Radius: 6px small controls (swatches, buttons), 10px panels/modals. Never 0 (reads Swiss/Neo-Brutalist, not this DNA) and never >16px (stays compact/GBA-dense, not Soft-Futurism-floaty). Directly answers the taste signal "마인크래프트 베벨 테두리 → 제거 또는 라운드 처리로 대체."
- Borders: `--border` / `--border-subtle` for decorative panel dividers (soft on purpose, eye comfort over visibility); `--border-interactive` for every functional edge (input outline, button edge, active-panel outline) — see contrast table above.
- Shadows: lavender-tinted, never pure black — `0 2px 6px rgb(86 87 172 / 0.12)` as the base elevation shadow (hue-shifted per Color Theory ch09's "never pure black/white overlays" pattern).

## Motion
- Timing: micro 100-150ms (button press, toggle) · standard 200-300ms (panel open/close, tool switch) · large 300-400ms (merge-apply success transition only)
- Easing: ease-out for state changes; spring/scale ONLY on direct user interaction (press, toggle) — never ambient or auto-playing (Playful Geometric's documented rule: "Bounce easing is an AI-tell when ambient; here it's allowed ONLY on direct user interaction")
- Allowed: color pop on active state, scale-press on buttons/tools, fade+slight-y on panel open, the merge-apply celebratory transition · Never: auto-playing/looping motion, parallax, ambient bounce, motion as decoration
- `prefers-reduced-motion`: collapse all timing to ≤50ms and drop scale-press entirely; keep only opacity crossfades

## Never (this project's tells at risk)
- Emoji anywhere — 0 tolerance (the plan's #1 named problem)
- Inter / Roboto / Open Sans / system-ui as the PRIMARY font — system-ui is legal only as the sub-12px secondary label font, never for headers, logo, CTA, or tool names
- The purple-indigo-violet triplet (`#6366F1` / `#8B5CF6` / `#A855F7`) — checked against this system's accent ramp (`#5657ac` / `#5a5e90` / `#292b45` / `#b7befe`): no collision, muted vs. their high-chroma values
- Any gradient — plan states "그라데이션: 없음" explicitly; solid fills + the hue-shifted shadow above only
- Glassmorphism / decorative blur — floating panels (ColorReplacePanel, ShadeRemapPanel per JOURNEY.md) use solid `--surface` + the lavender-tinted shadow, never translucency-as-decoration (this was Candidate 3's flagged risk in the discovery doc; not picked, but the risk is worth naming since these panels DO float)
- Pure black (`#000`) / pure white (`#fff`) anywhere — `--text` is `#312d2b`, `--background` is `#fdfcfc`
- Nested-cards overuse — Claude Fable 5's own measured #1 default tell (6/6 fingerprint prevalence, `ai-tells.md` FINGERPRINT ADDENDUM). The prior mock's detector pass already found 60 hits (register-justified there — CSS pixel-art body segments and conventional tool-panel chrome). Phase 3 must still budget border-weight rather than reaching for an extra bordered wrapper by default.
- A second live accent hue competing with lavender — mono harmony was chosen at converge specifically so there is exactly one point color in the system; functional colors (error/success/warning/info) exist for status only, never as decoration.

## Open questions
- Dark mode is explicitly out of scope (plan Assumptions: "다크모드 불필요로 확정") — no dark-scheme token block was produced.
- Exact Korean microcopy tone for the TipBanner warmth moment (Expressive moment 3) is deferred to Phase 3's content pass.
- `--border-interactive` was chosen over further-darkening the decorative `--border` tokens site-wide, to keep panel dividers soft (eye comfort). If Phase 3 finds specific components where a soft divider reads as "broken" rather than "calm," swap that component's border to `--border-interactive`, not a new one-off hex.
