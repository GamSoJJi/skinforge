# Discovery + Design: Phase 1 - Discover — 뚜따 Journey + IA

## Artifacts Found / Current State

| Artifact | Status |
|----------|--------|
| JOURNEY.md | ABSENT — this phase produces it |
| DESIGN.md | ABSENT — Phase 2 produces it (not required here) |
| Plan file | PRESENT: `.design-foundations/plans/2026-07-23-skinforge-2.md` |
| Research doc | PRESENT: `.design-foundations/research/2026-07-23-skinforge-2.md` |
| App source | PRESENT: all 8 components readable in `src/` |
| Build dir | PRESENT: `.design-foundations/build/` (prior mock artifacts unrelated to this phase) |
| Worktree | PRESENT: `.claude/worktrees/skinforge-2/` on `feature/skinforge-2` |

Prior build artifacts (`skinforge-2-mock.html`, `skinforge-2-mock-review.md`) belong to a pre-phase mock run and are out of scope for Phase 1.

## Gaps

None blocking. The app is fully implemented — source code provides a complete, accurate basis for IA mapping. No card sort or tree test has been conducted (expected at this stage; flagged in JOURNEY.md validation field per doctrine).

## Gate Status

- DESIGN.md locked: NO — not required for Phase 1 (JOURNEY.md ships first, DESIGN.md is Phase 2)
- JOURNEY.md present: NO — this phase produces it
- Prerequisites met: YES — research doc confirmed; plan file confirmed; app source readable
- Gate inversion risk: none — Phase 2 is gated on JOURNEY.md delivery from this phase

## DW Verification

| DW-ID | Done-When Item | Status | Evidence |
|-------|---------------|--------|----------|
| DW-1.1 | JOURNEY.md에 Moesta 4 forces 기반 job story 1개 완성 | COVERED | JOURNEY.md `## Job` section: job story in "When / I want / so I can" format + Push/Pull/Anxiety/Habit four forces table |
| DW-1.2 | 앱 IA가 hub-and-spoke 구조로 명확히 문서화됨 (주 에디터 + 5개 모달/모드) | COVERED | JOURNEY.md `## IA` section: sitemap block names hub + 5 spokes (파일 dropdown, 색상 dropdown, SkinMergeModal, ColorReplacePanel, ShadeRemapPanel) |
| DW-1.3 | 기본 편집 태스크 플로우와 뚜따 머지 플로우 각 1개, 분기 포함 완성 | COVERED | JOURNEY.md `## Flows` section: Flow 1 (기본 편집 — user flow with decision branches for upload, color panel, undo) + Flow 2 (뚜따 머지 — user flow with selection/re-selection and apply branches) |
| DW-1.4 | 4개 page spec 완성 (주 에디터, 머지 모드, 색상 변경 패널, 색조 변경 패널) — 각각 목적 + 진입점 + 컨텐츠 블록 + 상태 + 종료 포함 | COVERED | JOURNEY.md `## Page specs` section: 4 entries, each with Purpose / Entry points / Content blocks / States / Primary CTA / Exit fields |
| DW-1.5 | JOURNEY.md `## Page specs` 섹션에 ≥1개 완전한 page entry 존재 | COVERED | Satisfied by DW-1.4 (all 4 specs are complete; "주 에디터" spec is the canonical complete entry) |

**All items COVERED:** YES

DW-ID count in this table: 5. DW-ID count in dispatch prompt: 5. Match confirmed.

Evidence type note: Phase 1 produces a structural document (JOURNEY.md), not a visual artifact. Contrast (palette.mjs) and render (prototype) are N/A this phase — those gates apply from Phase 2 onward. The evidence here is content inspection of the produced JOURNEY.md.

## Design Decisions

**Doctrine applied:** `journey` (Moesta Switch interview for JTBD; Rosenfeld/Morville IA 4 systems; hub-and-spoke structure; page spec template from journey-stack.md)

**JTBD school:** Moesta (four forces) — picked for immediacy; do not mix with Ulwick/Christensen vocabulary. (Doctrine rule: pick one school per project.)

**IA structure:** Hub-and-spoke confirmed by code inspection. App.jsx is the single orchestrator — all 5 modals/modes mount/unmount from the root `<>` wrapper or replace the canvas area; none navigate independently. This is structurally hub-and-spoke, not tree or sequential.

**5 spokes identified:**
1. 파일 dropdown (파일 메뉴 — 불러오기, 내보내기, 옷입히기)
2. 색상 dropdown (색상 메뉴 — 색상 변경, 색조 변경)
3. SkinMergeModal (옷입히기 모드 — canvas area 전체 대체, quasi full-screen)
4. ColorReplacePanel (색상 변경 — draggable floating overlay, rendered outside .app div)
5. ShadeRemapPanel (색조 변경 — draggable floating overlay, rendered outside .app div)

Note: SkinMergeModal differs from the two floating panels — it replaces the entire canvas area (controlled by `mergeOpen` state) rather than overlaying it, giving it a "mode" character rather than a "panel" character. The distinction is captured in the page spec states section.

**Two flows:** The plan requires these to be "completely separate" (edge case note). Flow 1 (기본 편집) does not enter merge mode. Flow 2 (뚜따 머지) enters via 파일 > 옷입히기 and returns to the editor, never touching Flow 1's edit tools. This separation is explicit in both flows.

**Journey map scope:** Flagged UNGROUNDED (no actual user interviews conducted). Emotion curve is inferred from app behavior and research doc. Theater risk noted in JOURNEY.md. (Doctrine: "A journey map without a named owner, a cadence for updates, and a clear research basis is theater" — Watermark 2023.)

**Card sort / tree test:** NOT VALIDATED. This is a documentation phase for an already-implemented app; validating the existing IA structure was not in scope. Flagged in JOURNEY.md validation field.

**2.0 improvement opportunities:** Identified and placed in JOURNEY.md `## Opportunities` column in the Journey table, not as scope changes:
- 드래그앤드롭 파일 업로드 (missing; currently only via file dialog)
- 뚜따 모드 진입 경로가 파일 메뉴에만 있어 discoverability 낮음
- 색상/색조 패널의 keyboard shortcut이 유일한 진입 경로 (Cmd+Shift+R/H) — 헤더 메뉴로도 접근 가능하나 시각적으로 숨겨져 있음

## Recommendation

**BUILD** — all prerequisites met, no gaps, all 5 DW items mappable to concrete JOURNEY.md sections. Proceed to production.
