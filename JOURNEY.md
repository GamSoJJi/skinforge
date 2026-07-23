# JOURNEY.md

<!-- The structural and temporal design spec for SkinForge 2.0. Pairs with DESIGN.md (visual tokens). -->
<!-- For visual tokens, see DESIGN.md (produced in Phase 2). -->

---

## Job

**Job story:** 친구에게 받은 뚜따 스킨 이미지로 내 마인크래프트 캐릭터 얼굴만 교체하고 싶을 때, 복잡한 에디터 없이 내 스킨 위에 얼굴 영역만 골라 덮어씌우고 싶다, 몇 분 안에 완성된 뚜따 스킨을 게임에 적용해서 친구들에게 뽐낼 수 있게.

**Functional job:** 두 개의 마인크래프트 스킨 PNG에서 한 스킨의 특정 픽셀 영역(얼굴/head)을 선택해 다른 스킨 위에 덮어 합성한다.

**Emotional job:** 실수할까봐 걱정하지 않고 빠르고 간편하게 완성하는 성취감을 느끼고 싶다.

**Social job:** 게임 로비에서 친구들에게 귀엽고 독특한 뚜따 스킨을 자랑하고 싶다.

**Switch interview (Moesta four forces):**

| Force | Content |
|-------|---------|
| **Push** | Photoshop/Blockbench은 64×64 스킨 레이아웃 구조를 알아야 해서 초보자에게 진입장벽이 높다. 모바일 앱은 픽셀 단위 선택이 부정확하다. 기존 도구에는 뚜따 특화(2-스킨 병합) 기능이 없다. |
| **Pull** | SkinForge는 설치 없이 브라우저에서 바로 열린다. 뚜따에 특화된 2-스킨 병합 인터페이스가 있어 영역 선택 → 적용이 직관적이다. undo/redo가 있어 실수를 쉽게 되돌릴 수 있다. |
| **Anxiety** | 내 소중한 스킨 파일을 잘못 덮어쓸까봐 걱정. 선택 영역이 정확히 얼굴 영역에만 맞을지 불확실. 완성 결과가 게임에서 이상하게 보일지 모름. |
| **Habit** | 친구에게 부탁하거나, 그냥 Photoshop을 억지로 사용하거나, 덜 귀엽더라도 그냥 기존 스킨을 쓴다. |

**JTBD school used:** Moesta (Switch interview — four forces model). Do not mix with Ulwick ODI or Christensen vocabulary.

---

## Journey

**Actor:** 뚜따 유저 — 10대~20대 마인크래프트 플레이어, 스킨 편집 초보자, 빠르게 귀엽게 만들고 싶은 라이트 유저.

**Scenario:** 친구 스킨 이미지를 자기 마인크래프트 스킨 얼굴에 뚜따로 적용하는 단일 세션.

**Scope:** SkinForge 웹 앱 세션 내 (파일 업로드 ~ 내보내기). 현재 상태(current-state). 게임 내 적용 과정은 스코프 밖.

| Phase | Actions | Mindset | Emotion | Touchpoints | Opportunities |
|-------|---------|---------|---------|-------------|---------------|
| 진입 | URL 접속, 기본 스킨 로드 확인, UI 탐색 | "여기서 어떻게 시작하지? 이게 뭐하는 앱이지?" | Medium | 브라우저, 헤더/로고, TipBanner | 온보딩 TipBanner 강화 — 뚜따 첫 단계 안내 명확화 |
| 스킨 준비 | 파일 메뉴 > 불러오기로 내 스킨 PNG 선택, 캔버스에 로드 확인 | "파일이 제대로 들어갔나? 3D 뷰어에서 내 스킨 맞나?" | Medium | 파일 드롭다운, 파일 다이얼로그, PixelEditor, SkinViewer3D | 드래그앤드롭 업로드 추가, 업로드 성공 시 명확한 피드백 |
| 편집 탐색 | 툴 탐색, 색상 패널 확인, 브러쉬 테스트 | "이 도구들이 다 뭐지? 뚜따는 어디서 하는 거지?" | Low — frustration 위험 구간 | ToolPanel, ColorPanel, guide-bar | 뚜따 진입 경로(옷입히기) 가시성 강화 — 현재 파일 메뉴 내 숨겨진 상태 |
| 뚜따 실행 | 파일 > 옷입히기 → SkinMergeModal 진입, 입힐 스킨 로드, 영역 선택(rect/wand), 결과 미리보기 확인 | "이 선택이 얼굴에 딱 맞게 됐나? 미리보기가 맞는 건가?" | High — 핵심 인터랙션 | SkinMergeModal, MiniCanvas A/B, ResultCanvas, SkinViewer3D | 얼굴 영역 선택 가이드라인 오버레이 추가 가능성; 결과 미리보기 크기 확대 옵션 |
| 결과 확인 | 3D 뷰어에서 실시간 병합 결과 확인, 만족 여부 판단 | "귀엽게 됐다! / 아 이 부분이 이상하다." | Peak(만족) or Valley(불만족 → 재선택) | SkinViewer3D, ResultCanvas | 이전/이후 비교(before/after toggle) 기능 없음 — 개선 기회 |
| 완료 | 에디터로 복귀, 파일 > 내보내기 → PNG 다운로드, 게임에 업로드 | "빨리 게임에서 써보고 싶다. 친구들한테 보여줘야지." | High | 파일 드롭다운, OS 파일 저장 다이얼로그 | 원클릭 다운로드 흐름 명확화 |

**Decision model:** McKinsey Loyalty Loop (2009). 첫 사용 성공 경험이 다음 세션의 직접 복귀(loyalty loop)를 만든다 — 뚜따 필요가 생길 때마다 SkinForge로 바로 돌아옴. 초기 구매 루프(탐색 → 평가)는 첫 세션에만 해당.

**Emotion curve:** Medium(진입) → Medium(준비) → Low/frustration(편집 탐색 — 뚜따 진입 경로 불명확) → High(뚜따 실행 진입) → Peak or Valley(결과 확인 — 만족도에 따라 분기) → High(완료). 설계 레버: Low 구간을 줄이려면 옷입히기 진입 경로를 더 눈에 띄게 만들어야 한다. Peak-end rule(Kahneman) 적용: 최종 다운로드 경험을 빠르고 명확하게 만드는 것이 재방문 의향에 큰 영향.

**Research basis:** UNGROUNDED — 실제 유저 인터뷰 또는 다이어리 스터디 미진행. 앱 동작 분석과 연구 브리프(`research/2026-07-23-skinforge-2.md`)로 추론. 이 맵을 행동 가능한 근거로 쓰려면 최소 5명 인터뷰 필요. 오너: TBD. 업데이트 케이던스: TBD.

---

## IA

**Organization scheme:** Task (기능 단위 그룹화 — "파일 작업" vs "색상 작업")

**Structure type:** Hub-and-spoke (Rosenfeld/Morville). 모든 기능이 주 에디터에서 파생되며, 스포크 간 직접 이동 경로 없음.

**Sitemap:**

```
Main Editor (Hub)
├── Spoke 1: 파일 메뉴 [dropdown]
│   ├── 불러오기 (PNG 파일 선택 → canvas 로드)
│   ├── 내보내기 (canvas → PNG 다운로드)
│   └── 옷입히기 → Spoke 3 진입
├── Spoke 2: 색상 메뉴 [dropdown]
│   ├── 색상 변경 → Spoke 4 진입
│   └── 색조 변경 → Spoke 5 진입
├── Spoke 3: 옷입히기 모드 (SkinMergeModal)
│   └── "← 에디터로" / ESC → Hub 복귀
├── Spoke 4: 색상 변경 패널 (ColorReplacePanel) [floating]
│   └── 닫기(×) → Hub 복귀
└── Spoke 5: 색조 변경 패널 (ShadeRemapPanel) [floating]
    └── 닫기(×) → Hub 복귀
```

**IA note — Spoke 3 vs Spoke 4/5:**
Spoke 3(옷입히기)은 캔버스 영역 전체를 대체하는 "모드" 성격이다 — 진입 시 PixelEditor가 언마운트되고 SkinMergeModal이 마운트된다. Spoke 4/5(색상/색조 패널)는 주 에디터 위에 띄워지는 독립 floating panel이다 — 동시 사용 가능하나 실제로는 상호 배타적으로 열림(코드상 둘 다 열 수 있으나 UX상 하나만 열도록 유도됨).

**Global navigation labels:**
- 파일 (File operations: load / export / merge mode entry)
- 색상 (Color operations: replace / remap)

**Navigation model:** Hub-and-spoke. 헤더 글로벌 nav(파일, 색상)가 스포크 진입점. 스포크 간 직접 이동 없음. 뒤로가기는 항상 Hub로 복귀.

**Keyboard navigation shortcuts (현재 구현):**
- B/E/G/I/M: 도구 전환 (브러쉬/지우개/채우기/스포이드/사각선택)
- [/]: 브러쉬 크기 조절
- Cmd/Ctrl+Z: 되돌리기
- Cmd/Ctrl+Y 또는 Cmd/Ctrl+Shift+Z: 앞으로가기
- Cmd/Ctrl+Shift+R: 색상 변경 패널 토글
- Cmd/Ctrl+Shift+H: 색조 변경 패널 토글
- ESC: 선택 해제 / 스포이드 모드 취소 / 옷입히기 모드 닫기

**Validation:** NOT VALIDATED. 카드 소팅 및 트리 테스팅 미진행 (기존 구현된 앱의 IA를 문서화하는 단계). 2.0 IA 구조 변경을 고려한다면 사용자 테스트 선행 권장 (Rosenfeld/Morville).

---

## Flows

### Flow 1: 기본 편집 (Basic Pixel Edit)

**Type:** User flow (분기 포함)
**Entry:** SkinForge URL 접속 — 기본 스킨 로드된 주 에디터
**Goal:** 내 마인크래프트 스킨을 픽셀 에디터로 편집하고 PNG로 내보내기

**Steps:**

```
(start) 앱 접속 → 기본 스킨 자동 로드됨, 주 에디터 표시
   │
   ▽ [decision] 내 스킨 파일 있음?
   ├─ YES → 파일 메뉴 > 불러오기 → 파일 다이얼로그 → PNG 선택 → canvas 로드
   │         SkinViewer3D에서 내 스킨 확인
   └─ NO  → 기본 스킨으로 진행
   │
   ▽ ToolPanel에서 도구 선택 (브러쉬/지우개/채우기/스포이드/사각선택/마법봉)
   │
   ▽ ColorPanel에서 색상 선택 (HexColorPicker / 팔레트 스와치 / hex 직접 입력)
   │
   ▽ PixelEditor 캔버스에 픽셀 편집 (그리기 / 지우기 / 채우기 / 영역 선택 후 조작)
   │
   ▽ [decision] 실수했음?
   ├─ YES → Cmd+Z 되돌리기 (최대 50스텝) → 이전 상태 복원 → 재편집
   └─ NO  → 계속
   │
   ▽ [decision] 색상 전체 교체 필요?
   ├─ YES → 색상 메뉴 > 색상 변경 → ColorReplacePanel → from/to 설정 → 적용
   │         패널 유지 (추가 교체 가능) → 닫기
   └─ NO  → 계속
   │
   ▽ [decision] 색조 일괄 변환 필요?
   ├─ YES → 색상 메뉴 > 색조 변경 → ShadeRemapPanel → 소스/대상 + tolerance 설정 → 적용
   │         패널 유지 (추가 변환 가능) → 닫기
   └─ NO  → 계속
   │
   ▽ 3D 뷰어에서 결과 확인
   │
   ▽ 파일 메뉴 > 내보내기 → PNG 다운로드
   │
(end) 완료
```

**Error states:**
- 업로드 파일이 PNG가 아님 → 브라우저 파일 다이얼로그에서 필터링 (accept=".png")
- 되돌리기 스택 비어있음 → 되돌리기 버튼 비활성 (canUndo = false)
- 색상 변경: from/to 중 하나라도 유효하지 않으면 적용 버튼 비활성

**Success state:** PNG 파일 다운로드 완료 (`my_skin.png`)

---

### Flow 2: 뚜따 머지 (Face-Swap Merge)

**Type:** User flow (분기 포함)
**Entry:** 주 에디터 — 내 스킨이 로드된 상태 (Flow 1의 스킨 준비 단계 이후)
**Goal:** 다른 스킨의 얼굴 영역을 픽셀 단위로 선택해 내 스킨에 뚜따 적용

**Note on separation from Flow 1:** 이 플로우는 Flow 1(기본 편집)과 완전히 분리된다. 옷입히기 모드 진입 시 PixelEditor가 숨겨지고 SkinMergeModal이 캔버스 영역을 대체한다. 뚜따 모드 내에서는 브러쉬/채우기 등 편집 도구가 비활성화된다.

**Steps:**

```
(start) 주 에디터 — 내 스킨(skinA) 로드됨
   │
   ▽ 파일 메뉴 > 옷입히기 클릭
   │
   ▽ SkinMergeModal 진입 (canvas area 대체, PixelEditor 숨겨짐)
   │  skinA = 현재 편집 중인 스킨 자동 로드됨
   │  SkinViewer3D는 머지 결과를 실시간 반영 시작
   │
   ▽ [decision] 내 스킨(skinA) 변경 원함?
   ├─ YES → 내 스킨 패널 > 불러오기 버튼 → PNG 선택 → skinA 교체
   └─ NO  → 현재 skinA 유지
   │
   ▽ 입힐 스킨 패널 > 불러오기 버튼 → PNG 선택 → skinB MiniCanvas에 로드
   │  힌트: "입힐 스킨을 불러오세요" → 로드 후 사라짐
   │
   ▽ 영역 선택 도구(툴패널: rect-select 또는 magic-wand)로 skinB에서 얼굴 영역 선택
   │  - rect-select: 드래그로 사각형 선택
   │  - magic-wand: 색상 영역 클릭으로 선택 (근접/전체 모드)
   │  - Shift+클릭/드래그: 선택 영역 합집합(union)
   │  - Alt+클릭/드래그: 선택 영역 차집합(diff)
   │  - 우클릭: 선택 초기화
   │
   ▽ ResultCanvas에서 병합 결과 실시간 미리보기
   │  SkinViewer3D에서도 3D로 실시간 확인 가능
   │
   ▽ [decision] 결과 만족?
   ├─ NO  → 선택 영역 재조정 (위로 돌아가 재선택)
   │         또는 우클릭으로 선택 초기화 후 다시 선택
   └─ YES → 계속
   │
   ▽ 머지 푸터 > "입히기" 버튼 클릭
   │  (selB가 있어야 활성화; 없으면 비활성 + 힌트 표시)
   │
   ▽ 병합 결과가 주 에디터 skinCanvas에 덮어씌워짐 (undo 스택에 push)
   │
   ▽ SkinMergeModal 닫힘 → 주 에디터로 복귀
   │  mergedPreview 초기화, mergeHasSel 초기화
   │
   ▽ [decision] 추가 편집 필요?
   ├─ YES → Flow 1(기본 편집)으로 계속
   └─ NO  → 파일 메뉴 > 내보내기 → PNG 다운로드
   │
(end) 완료
```

**Error states:**
- skinA만 있고 skinB 없음 → "입힐 스킨을 불러오세요" 힌트, "입히기" 버튼 비활성
- skinB 있으나 선택 없음 → "입힐 스킨에서 영역을 선택하세요" 힌트, "입히기" 버튼 비활성
- ESC 키 → SkinMergeModal 닫힘, 변경사항 미적용 (주 에디터 skinCanvas 유지)
- "← 에디터로" 버튼 → ESC와 동일

**Success state:** 병합된 스킨이 주 에디터 캔버스에 적용됨. SkinViewer3D에 새 스킨 반영. Undo 가능.

---

## Page specs

### 주 에디터 (Main Editor)

**Purpose:** 마인크래프트 스킨 PNG를 픽셀 단위로 편집하고 3D로 미리보는 앱의 허브 화면 — 모든 기능의 진입점이자 기본 작업 공간.

**Entry points:**
- 직접 URL 접속 (기본 스킨 자동 로드)
- 옷입히기 모드에서 "← 에디터로" 버튼 클릭 또는 ESC
- ColorReplacePanel 또는 ShadeRemapPanel 닫기 (패널 닫혀도 에디터는 항상 유지)

**Content blocks (in order):**
1. **헤더** — SkinForge 로고 + 파일 메뉴(불러오기/내보내기/옷입히기) + 색상 메뉴(색상 변경/색조 변경)
2. **3D 뷰어 패널** (왼쪽, 리사이즈 가능 180px~700px) — SkinViewer3D: 마우스 드래그로 360도 회전 가능한 3D 스킨 미리보기; 머지 모드에서는 병합 결과를 실시간 반영
3. **리사이즈 핸들** — 뷰어 패널과 캔버스 영역 경계; 드래그로 뷰어 너비 조절
4. **픽셀 에디터 캔버스** (중앙) — 64×64 픽셀 캔버스, 줌/팬 지원, 체크무늬 배경; 선택 영역 오버레이; 색상 피킹 모드 활성 시 커서 변경
5. **가이드 바** (캔버스 하단) — 가이드 오버레이 토글(on/off), 노말/슬림 스킨 타입 전환, Undo/Redo 버튼
6. **TipBanner** — 캔버스 위 상황별 도움말 (컨텍스트에 따라 내용 변동)
7. **툴 패널** (오른쪽 상단) — 6개 도구 (브러쉬/지우개/채우기/스포이드/사각선택/마법봉) + 활성 도구별 설정 (브러쉬 size/shape, 마법봉 근접옵션, 선택 모드 replace/union/diff)
8. **색상 패널** (오른쪽 하단) — 현재 색상 스와치 + hex 입력 + HexColorPicker(토글) + 팔레트 탭(기본/스킨 추출)

**States:**
- **Default:** 기본 스킨(`skin_example.png`) 로드, 브러쉬 도구 활성, 팔레트 기본 모드
- **스킨 업로드 후:** 업로드된 스킨 표시, 팔레트 탭 자동으로 스킨 추출 색상 모드 전환
- **선택 영역 있을 때:** ToolPanel 하단에 "✕ 선택해제" 버튼 표시
- **색상 피킹 모드 (ColorReplacePanel/ShadeRemapPanel):** 스포이드 버튼 활성화된 상태, 캔버스 클릭 시 해당 패널 슬롯에 색상 자동 입력, ESC로 취소
- **색상/색조 패널 열린 상태:** 패널이 캔버스 위 floating — 에디터 편집 계속 가능
- **머지 모드 (mergeOpen=true):** PixelEditor 숨겨짐, SkinMergeModal이 canvas-area를 대체, ToolPanel은 머지 전용 도구만 활성

**Primary CTA:** 파일 메뉴 > 내보내기 → PNG 파일 다운로드 (`my_skin.png`)

**Exit / next:**
- 파일 > 옷입히기 → 뚜따 모드(SkinMergeModal)
- 색상 > 색상 변경 → ColorReplacePanel 열림 (에디터 유지)
- 색상 > 색조 변경 → ShadeRemapPanel 열림 (에디터 유지)

---

### 옷입히기 모드 (SkinMergeModal)

**Purpose:** 두 개의 마인크래프트 스킨 이미지 중 한 스킨에서 선택한 픽셀 영역을 다른 스킨 위에 덮어 합성(뚜따)하는 전용 모드.

**Entry points:**
- 주 에디터 파일 메뉴 > 옷입히기 클릭

**Content blocks (in order):**
1. **머지 헤더 바** — "← 에디터로" 버튼 (주 에디터 복귀) + "옷입히기" 모드 타이틀 + 조작 힌트("우클릭 선택 초기화")
2. **결과 미리보기 영역** (상단, 높이 조절 가능) — ResultCanvas: 병합 결과를 4× 배율로 표시, 줌/팬 지원, 어두운 배경에 체크무늬 그리드; skinB 선택 없으면 빈 어두운 상태
3. **수직 리사이즈 핸들** — 결과 영역(상) vs 스킨 패널 영역(하) 높이 비율 조절 (기본 60:40)
4. **내 스킨 패널 (skinA, 하단 왼쪽)** — "내 스킨 (베이스)" 라벨 + MiniCanvas A (3× 배율, 파란색 선택 오버레이) + 불러오기/변경 버튼
5. **수평 리사이즈 핸들** — 좌/우 스킨 패널 비율 조절 (기본 50:50)
6. **입힐 스킨 패널 (skinB, 하단 오른쪽)** — "입힐 스킨 (선택 영역 덮어씀)" 라벨 + MiniCanvas B (3× 배율, 주황색 선택 오버레이) + 불러오기/변경 버튼
7. **머지 푸터** — 단계 힌트 텍스트 + "입히기" 적용 버튼

**States:**
- **초기 (skinB 없음):** ResultCanvas 어두운 상태, 힌트 "입힐 스킨을 불러오세요", "입히기" 버튼 비활성
- **skinB 로드됨, 선택 없음:** ResultCanvas = skinA만 표시, 힌트 "입힐 스킨에서 영역을 선택하세요", "입히기" 버튼 비활성
- **선택 완료 (selB 있음):** ResultCanvas에 병합 결과 실시간 반영, SkinViewer3D도 실시간 업데이트, "입히기" 버튼 활성
- **적용 직후:** SkinMergeModal 닫힘, 주 에디터 캔버스에 결과 적용, undo 스택에 이전 상태 저장

**Primary CTA:** 입히기 → 병합 결과를 주 에디터 캔버스에 적용 후 주 에디터 복귀

**Exit / next:**
- "← 에디터로" 버튼 → 주 에디터 복귀 (변경사항 미적용, skinCanvas 유지)
- ESC 키 → "← 에디터로"와 동일
- "입히기" 버튼 → 주 에디터 복귀 (병합 결과 적용)

---

### 색상 변경 패널 (ColorReplacePanel)

**Purpose:** 현재 스킨에서 지정한 색상(from)을 다른 색상(to)으로 픽셀 단위 일괄 교체하는 플로팅 도구 패널.

**Entry points:**
- 헤더 색상 메뉴 > 색상 변경 클릭
- 키보드 Cmd+Shift+R (또는 Ctrl+Shift+R on Windows)

**Content blocks (in order):**
1. **드래그 가능 헤더** — "색상 교체" 타이틀 + 닫기(×) 버튼; 헤더 드래그로 패널 위치 변경 가능
2. **픽킹 힌트** (조건부 표시) — 스포이드 활성 시 "캔버스를 클릭해 색상을 선택하세요 (ESC 취소)"
3. **From 색상 슬롯** — 44×44px 색상 사각형 + 스포이드 버튼 + hex 직접 입력 (#rrggbb)
4. **화살표 구분자** — → (방향 표시)
5. **To 색상 슬롯** — From과 동일 구성
6. **적용 버튼** — from/to 모두 유효한 hex일 때 활성화; 클릭 시 스킨 전체에 색상 교체 즉시 적용

**States:**
- **Default:** from/to 슬롯 모두 빈 상태 (dashed border, 투명 배경), 적용 버튼 비활성
- **단일 색상 입력:** 입력된 슬롯은 해당 색상 표시, 미입력 슬롯은 빈 상태, 적용 버튼 비활성
- **두 색상 모두 입력:** 적용 버튼 활성화
- **스포이드 활성 (slot 0 또는 slot 1):** 해당 슬롯 테두리 보라색(#6677dd) 강조, 스포이드 버튼 active 스타일, 픽킹 힌트 표시; 캔버스 클릭 시 해당 슬롯에 색상 자동 입력
- **적용 후:** 주 에디터 skinCanvas에 즉시 반영 (undo 가능), 패널 유지 (연속 교체 가능)

**Primary CTA:** 적용 → 현재 스킨 전체에서 from 색상을 to 색상으로 픽셀 일괄 교체

**Exit / next:**
- 닫기(×) 버튼 → 패널 닫힘, 주 에디터로 포커스 복귀
- ESC (스포이드 활성 상태) → 스포이드 모드 취소, 패널 유지

---

### 색조 변경 패널 (ShadeRemapPanel)

**Purpose:** 소스 색상의 색조(Hue) 범위에 해당하는 픽셀들의 색조를 대상 색조로 일괄 변환해 스킨의 전체적인 색감을 빠르게 바꾸는 플로팅 도구 패널.

**Entry points:**
- 헤더 색상 메뉴 > 색조 변경 클릭
- 키보드 Cmd+Shift+H (또는 Ctrl+Shift+H on Windows)

**Content blocks (in order):**
1. **드래그 가능 헤더** — "색조 변경" 타이틀 + 닫기(×) 버튼
2. **픽킹 힌트** (조건부) — 스포이드 활성 시 안내
3. **소스 색상 슬롯** — 라벨 "소스" + 44×44px 색상 사각형 + 스포이드 버튼 + hex 입력
4. **화살표 구분자** — →
5. **대상 색상 슬롯** — 라벨 "대상" + 동일 구성
6. **색조 범위 섹션 (H)** — 라벨 "색조 범위 (H)":
   - 음수 범위(−) 슬라이더 (0~90°, 기본 30°) + 값 표시
   - 양수 범위(+) 슬라이더 (0~90°, 기본 30°) + 값 표시
7. **명도 범위 섹션 (L)** — 라벨 "명도 범위 (L)":
   - 명도 허용 범위(±) 슬라이더 (0~50%, 기본 50%) + 값 표시
8. **적용 버튼** — 소스/대상 모두 유효 hex일 때 활성

**States:**
- **Default:** 빈 소스/대상 슬롯, tolerance 기본값 (H: −30/+30°, L: ±50%), 적용 버튼 비활성
- **소스 색상 입력 후:** 해당 색조 ± tolerance 범위에 해당하는 캔버스 픽셀들이 선택 미리보기로 강조됨 (`shadePreviewSel` — PixelEditor에 오버레이); 슬라이더 조정 시 미리보기 실시간 업데이트
- **두 색상 모두 입력:** 적용 버튼 활성화
- **스포이드 활성:** 색상 변경 패널과 동일 패턴
- **적용 후:** 주 에디터 skinCanvas에 색조 변환 즉시 반영 (undo 가능), 패널 유지, shadePreviewSel 계속 표시

**Primary CTA:** 적용 → tolerance 범위 내 픽셀들의 색조·명도를 대상 색상 기준으로 일괄 변환

**Exit / next:**
- 닫기(×) 버튼 → 패널 닫힘, shadePreviewSel 제거, 주 에디터 복귀
- ESC (스포이드 활성 상태) → 스포이드 모드 취소, 패널 유지

---

## 2.0 개선 기회 (Phase 2 Design 참고용)

이 섹션은 IA 문서화 과정에서 식별된 UX 기회다. 시각 디자인 범위가 아닌 IA/UX 인사이트로만 기록 — 실제 2.0 scope 변경 시 별도 결정 필요.

| 기회 | 현재 상태 | 개선 방향 |
|------|---------|---------|
| 옷입히기 진입 경로 가시성 | 파일 드롭다운 내부 3번째 항목으로 숨겨짐 | 헤더에 "옷입히기" 전용 버튼 또는 캔버스 영역 내 CTA 추가 |
| 파일 업로드 방식 | 파일 다이얼로그만 지원 | 드래그앤드롭 추가 (주 에디터 캔버스 또는 뷰어 패널 대상) |
| 색상/색조 패널 진입 가시성 | Cmd+Shift+R/H 단축키 또는 색상 드롭다운 내부 — 탐색성 낮음 | 사이드 패널에 색상 작업 섹션 노출 |
| 뚜따 결과 비교 | before/after 비교 기능 없음 | ResultCanvas에 토글 기능 추가 가능 |
| 스킨 타입 설명 | "노말/슬림" 레이블만 — 초보자에게 의미 불명확 | 툴팁 또는 시각적 비교로 설명 보완 |

---

<!-- For visual tokens, see DESIGN.md (Phase 2). -->
<!-- IA school: Rosenfeld/Morville 4 systems (task-based organization, hub-and-spoke structure). -->
<!-- JTBD school: Moesta (four forces). Do not mix with other JTBD schools. -->
