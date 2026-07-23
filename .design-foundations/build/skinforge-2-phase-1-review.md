# Design Review: Phase 1 — 뚜따 Journey + IA

## Rendered Evidence (Step 0)

- Screenshot: none — spec-only phase, no visual mock
- Surface: structural document review — JOURNEY.md at `.claude/worktrees/skinforge-2/JOURNEY.md`
- Pixel-level critique: N/A (no rendered artifact). Structure-level critique only; pixel-level contrast/spacing/hierarchy unverified by design.

## Assessment B — Deterministic Detector

- Command: `node scripts/detect.mjs` (no HTML path supplied — spec-only phase)
- Exit: N/A — `scripts/detect.mjs` does not exist in this project, and no rendered `.html` artifact exists to feed it. No-artifact carve-out applies.
- Findings: N/A — no rendered artifact
- Opened only after Assessment A findings were frozen: YES

## Triage

- Baseline (always-on): visual + usability — N/A (no rendered surface; structure-level critique only)
- Dispatched: `journey` — the entire artifact is a JOURNEY.md; JTBD job story, journey map, IA, flows, and page specs are all present
- Not applicable: `data-viz` (no charts), `content-design` (no product copy surface), `behavioral` (no conversion surface), `design-dna` / `checklists` (no visual surface)
- Deferred: none — single applicable pillar

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Minor | journey | Flow 2 entry description states "(Flow 1의 스킨 준비 단계 이후)" implying a mandatory sequential dependency on Flow 1, but Flow 2 itself contains a "내 스킨(skinA) 변경 원함?" branch allowing fresh skinA load inside the merge flow — contradicting the stated prerequisite. A reader spec'ing Phase 2 may misinterpret this as a locked entry gate. | User flow notation principle (journey.md §E): entry conditions must accurately reflect actual branching — the flow itself is the truth source, not the header description. | Change the entry line to: "주 에디터 — skinA 로드된 상태 (기본 스킨 또는 업로드 스킨; Flow 1 선행 불필요)" and remove the "(Flow 1의 스킨 준비 단계 이후)" qualifier. |
| Minor | journey | Job story is written as a single flowing Korean sentence without explicit structural markers (When / I want / so I can). The three-part structure parses correctly on close reading but is not labeled — a reader unfamiliar with Moesta format may not recognize it as a compliant job story, and a future author editing the file may not know the sentence has structural significance. | Moesta switch interview (journey.md §B): "Author a job story: 'When [situation], I want [motivation], so I can [outcome].'" — structural labels make the school's vocabulary explicit and protect the format under edits. | Add bold inline labels: **When** / **I want** / **so I can** inside the existing Korean sentence, or break into three labeled lines. Do not rewrite the content. |
| Minor | journey | Dropdown menus (파일, 색상) are listed as Spokes 1 and 2 in the sitemap alongside the actual modals/panels (Spokes 3–5 = SkinMergeModal, ColorReplacePanel, ShadeRemapPanel). In Rosenfeld/Morville terms, dropdowns are global navigation labels embedded in the hub — not independent spokes. The DW requirement specifies "5개 모달/모드" but only 3 of the 5 entries are actual modals or modes; the other 2 are nav affordances within the hub itself. The JOURNEY.md correctly classifies these as "Global navigation labels" in the nav model section, creating an internal inconsistency with the sitemap. | Rosenfeld/Morville 4 IA systems (journey.md §D): navigation systems (global nav) and site structure (spokes) are distinct IA elements — conflating nav affordances with spokes distorts the structural model. | Promote Spokes 1–2 to a "Global navigation" note on the hub node itself (labeled as dropdowns, not spokes). Renumber SkinMergeModal/ColorReplacePanel/ShadeRemapPanel as Spokes 1–3. Add a parenthetical: "(2 global nav dropdowns + 3 modal/panel spokes = 5 total surface entry points)" if the DW's count of 5 must be preserved. |
| Note | journey | Journey map owner and update cadence are both "TBD." The research basis is correctly flagged as UNGROUNDED. This is doctrine-compliant disclosure (journey.md §C rule: "name the owner, the research basis, and the update cadence before treating the map as actionable") — but TBD is a deferral, not a resolution. A map with a TBD owner is at risk of becoming unmaintained theater by Phase 3. | Watermark 2023 theater risk (journey.md §C): "83% of CX pros can't make maps drive change" without clear ownership. | Before Phase 2 ships, assign a named owner (e.g., product lead or designer) and a review cadence (e.g., "분기별" or "after first 5 user tests"). Even a placeholder name is better than TBD. |

## Requirement Fulfillment

### DW-1.1
PREMISE:  JOURNEY.md에 Moesta 4 forces 기반 job story 1개 완성 ("When [뚜따 상황], I want [동기], so I can [결과]")
EVIDENCE: `## Job` section contains a single-sentence job story in three-part Korean structure: "친구에게 받은 뚜따 스킨 이미지로 내 마인크래프트 캐릭터 얼굴만 교체하고 싶을 때" (When), "복잡한 에디터 없이 내 스킨 위에 얼굴 영역만 골라 덮어씌우고 싶다" (I want), "몇 분 안에 완성된 뚜따 스킨을 게임에 적용해서 친구들에게 뽐낼 수 있게" (so I can). Followed by an explicit Push / Pull / Anxiety / Habit four-forces table. Footer reads: "JTBD school used: Moesta (Switch interview — four forces model)."
VERDICT:  PASS

### DW-1.2
PREMISE:  앱 IA가 hub-and-spoke 구조로 명확히 문서화됨 (주 에디터 + 5개 모달/모드)
EVIDENCE: `## IA` section explicitly states "Structure type: Hub-and-spoke (Rosenfeld/Morville)." Sitemap ASCII block labels "Main Editor (Hub)" with 5 labeled spokes (파일 메뉴, 색상 메뉴, SkinMergeModal, ColorReplacePanel, ShadeRemapPanel). Navigation model section confirms: "Hub-and-spoke. 스포크 간 직접 이동 없음. 뒤로가기는 항상 Hub로 복귀." The Minor finding above (dropdown menus as spokes vs. nav labels) does not block this requirement — the hub-and-spoke structure is unambiguously documented and all 5 surface entry points are named.
VERDICT:  PASS

### DW-1.3
PREMISE:  기본 편집 태스크 플로우와 뚜따 머지 플로우 각 1개, 분기 포함 완성
EVIDENCE: `## Flows` section contains Flow 1 (기본 편집) and Flow 2 (뚜따 머지). Flow 1 has 4 explicit decision branches: "내 스킨 파일 있음?", "실수했음?", "색상 전체 교체 필요?", "색조 일괄 변환 필요?" Flow 2 has 3 decision branches: "내 스킨(skinA) 변경 원함?", "결과 만족?", "추가 편집 필요?" Both flows include error states and success states. Both are rendered as text-based flowcharts with ▽/├─/└─ notation clearly distinguishing linear steps from decision nodes.
VERDICT:  PASS

### DW-1.4
PREMISE:  4개 page spec 완성 (주 에디터, 머지 모드, 색상 변경 패널, 색조 변경 패널) — 각각 목적 + 진입점 + 컨텐츠 블록 + 상태 + 종료 포함
EVIDENCE: `## Page specs` section contains all 4 entries. Each entry includes: **Purpose** (one-sentence job), **Entry points** (named sources), **Content blocks (in order)** (numbered list), **States** (bulleted list with named states), **Primary CTA** (action + outcome), **Exit / next** (destinations). Verified across all 4:
- 주 에디터: 3 entry points, 8 content blocks, 6 named states, 3 exit paths
- 옷입히기 모드: 1 entry point, 7 content blocks, 4 named states, 3 exit paths
- 색상 변경 패널: 2 entry points (menu + keyboard shortcut), 6 content blocks, 5 named states, 2 exit paths
- 색조 변경 패널: 2 entry points, 8 content blocks, 5 named states, 2 exit paths
VERDICT:  PASS

### DW-1.5
PREMISE:  JOURNEY.md `## Page specs` 섹션에 ≥1개 완전한 page entry 존재
EVIDENCE: `## Page specs` section header is present. 주 에디터 entry is the canonical complete example: Purpose / Entry points (3) / Content blocks (8, numbered) / States (6 named) / Primary CTA / Exit (3 destinations). Three additional complete entries follow. Requirement of ≥1 is satisfied with 4 present.
VERDICT:  PASS

---

**All requirements met:** YES

## Edge Case Verification

**Edge case 1 — JOURNEY.md 없이 Phase 2 진행하면 gate inversion:**
JOURNEY.md confirmed present at `.claude/worktrees/skinforge-2/JOURNEY.md` (file read successfully, 376 lines). Gate inversion risk is resolved — Phase 2 now has its required input.

**Edge case 2 — 뚜따 특화 플로우(머지 모드)가 기본 편집 플로우와 완전히 분리됨:**
Flow 2 contains an explicit separation note: "이 플로우는 Flow 1(기본 편집)과 완전히 분리된다. 옷입히기 모드 진입 시 PixelEditor가 숨겨지고 SkinMergeModal이 캔버스 영역을 대체한다. 뚜따 모드 내에서는 브러쉬/채우기 등 편집 도구가 비활성화된다." The IA note section independently confirms: "Spoke 3(옷입히기)은 캔버스 영역 전체를 대체하는 '모드' 성격이다." Separation is unambiguously expressed.

Both edge cases handled.

## Notes (non-blocking)

- **No screenshot / pixel-level critique unavailable.** This is a spec-only phase. All critique is structure-level from JOURNEY.md content. Contrast, typography, spacing, and hierarchy are unverifiable until Phase 2 mock. This is expected and not a coverage gap in this phase.
- **Journey map UNGROUNDED.** Correctly disclosed in the document. Minimum 5 user interviews recommended before treating the emotion curve as actionable design input. Owner and cadence remain TBD — should be assigned before the map is referenced in Phase 2 design decisions.
- **IA not validated via card sort / tree test.** Correctly disclosed. This is appropriate at a documentation phase for an already-implemented app. If the 2.0 IA structure changes, tree testing is recommended before visual design (Rosenfeld/Morville).
- **Flow 2 entry prerequisite wording** (Minor finding above) is the only item that could mislead a Phase 2 author reading the spec cold — worth a one-line fix before Phase 2 begins.

---

**Verdict: PASS**
