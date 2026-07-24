const SHARED_PARTS = [
  // 머리
  { x: 8,  y: 0,  w: 8,  h: 8,  color: 'rgba(255,215,0,0.15)' },
  { x: 16, y: 0,  w: 8,  h: 8,  color: 'rgba(255,215,0,0.1)' },
  { x: 0,  y: 8,  w: 32, h: 8,  color: 'rgba(255,215,0,0.12)' },
  // 모자
  { x: 40, y: 0,  w: 8,  h: 8,  color: 'rgba(255,165,0,0.1)' },
  { x: 48, y: 0,  w: 8,  h: 8,  color: 'rgba(255,165,0,0.07)' },
  { x: 32, y: 8,  w: 32, h: 8,  color: 'rgba(255,165,0,0.1)' },
  // 몸통 — 상/하단
  { x: 20, y: 16, w: 8,  h: 4,  color: 'rgba(0,200,100,0.18)' },  // 위
  { x: 28, y: 16, w: 8,  h: 4,  color: 'rgba(0,200,100,0.1)' },   // 아래
  // 몸통 — 4면
  { x: 16, y: 20, w: 4,  h: 12, color: 'rgba(0,200,100,0.12)' },  // 우측면
  { x: 20, y: 20, w: 8,  h: 12, color: 'rgba(0,200,100,0.16)' },  // 앞
  { x: 28, y: 20, w: 4,  h: 12, color: 'rgba(0,200,100,0.12)' },  // 좌측면
  { x: 32, y: 20, w: 8,  h: 12, color: 'rgba(0,200,100,0.1)' },   // 뒤

  // 우다리 — 상/하단
  { x: 4,  y: 16, w: 4,  h: 4,  color: 'rgba(200,50,50,0.22)' },  // 위
  { x: 8,  y: 16, w: 4,  h: 4,  color: 'rgba(200,50,50,0.14)' },  // 아래
  // 우다리 — 4면
  { x: 0,  y: 20, w: 4,  h: 12, color: 'rgba(200,50,50,0.18)' },  // 우측면
  { x: 4,  y: 20, w: 4,  h: 12, color: 'rgba(200,50,50,0.18)' },  // 앞
  { x: 8,  y: 20, w: 4,  h: 12, color: 'rgba(200,50,50,0.18)' },  // 좌측면
  { x: 12, y: 20, w: 4,  h: 12, color: 'rgba(200,50,50,0.18)' },  // 뒤

  // 좌다리 — 상/하단
  { x: 20, y: 48, w: 4,  h: 4,  color: 'rgba(255,100,0,0.22)' },  // 위
  { x: 24, y: 48, w: 4,  h: 4,  color: 'rgba(255,100,0,0.14)' },  // 아래
  // 좌다리 — 4면
  { x: 16, y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.18)' },  // 우측면
  { x: 20, y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.18)' },  // 앞
  { x: 24, y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.18)' },  // 좌측면
  { x: 28, y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.18)' },  // 뒤

  // 재킷 — 상/하단
  { x: 20, y: 32, w: 8,  h: 4,  color: 'rgba(0,200,100,0.12)' },  // 위
  { x: 28, y: 32, w: 8,  h: 4,  color: 'rgba(0,200,100,0.07)' },  // 아래
  // 재킷 — 4면
  { x: 16, y: 36, w: 4,  h: 12, color: 'rgba(0,200,100,0.09)' },  // 우측면
  { x: 20, y: 36, w: 8,  h: 12, color: 'rgba(0,200,100,0.1)' },   // 앞
  { x: 28, y: 36, w: 4,  h: 12, color: 'rgba(0,200,100,0.09)' },  // 좌측면
  { x: 32, y: 36, w: 8,  h: 12, color: 'rgba(0,200,100,0.07)' },  // 뒤

  // 우다리 외피 — 상/하단
  { x: 4,  y: 32, w: 4,  h: 4,  color: 'rgba(200,50,50,0.12)' },  // 위
  { x: 8,  y: 32, w: 4,  h: 4,  color: 'rgba(200,50,50,0.07)' },  // 아래
  // 우다리 외피 — 4면
  { x: 0,  y: 36, w: 4,  h: 12, color: 'rgba(200,50,50,0.09)' },  // 우측면
  { x: 4,  y: 36, w: 4,  h: 12, color: 'rgba(200,50,50,0.1)' },   // 앞
  { x: 8,  y: 36, w: 4,  h: 12, color: 'rgba(200,50,50,0.09)' },  // 좌측면
  { x: 12, y: 36, w: 4,  h: 12, color: 'rgba(200,50,50,0.07)' },  // 뒤

  // 좌다리 외피 — 상/하단
  { x: 4,  y: 48, w: 4,  h: 4,  color: 'rgba(255,100,0,0.12)' },  // 위
  { x: 8,  y: 48, w: 4,  h: 4,  color: 'rgba(255,100,0,0.07)' },  // 아래
  // 좌다리 외피 — 4면
  { x: 0,  y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.09)' },  // 우측면
  { x: 4,  y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.1)' },   // 앞
  { x: 8,  y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.09)' },  // 좌측면
  { x: 12, y: 52, w: 4,  h: 12, color: 'rgba(255,100,0,0.07)' },  // 뒤
]

const NORMAL_ARM_PARTS = [
  // 우팔 (Steve 4px) — 상/하단
  { x: 44, y: 16, w: 4,  h: 4,  color: 'rgba(50,100,255,0.22)' },  // 위
  { x: 48, y: 16, w: 4,  h: 4,  color: 'rgba(50,100,255,0.14)' },  // 아래
  // 우팔 — 4면
  { x: 40, y: 20, w: 4,  h: 12, color: 'rgba(50,100,255,0.18)' },  // 우측면
  { x: 44, y: 20, w: 4,  h: 12, color: 'rgba(50,100,255,0.18)' },  // 앞
  { x: 48, y: 20, w: 4,  h: 12, color: 'rgba(50,100,255,0.18)' },  // 좌측면
  { x: 52, y: 20, w: 4,  h: 12, color: 'rgba(50,100,255,0.18)' },  // 뒤
  // 좌팔 — 상/하단
  { x: 36, y: 48, w: 4,  h: 4,  color: 'rgba(180,0,255,0.22)' },  // 위
  { x: 40, y: 48, w: 4,  h: 4,  color: 'rgba(180,0,255,0.14)' },  // 아래
  // 좌팔 — 4면
  { x: 32, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.18)' },  // 우측면
  { x: 36, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.18)' },  // 앞
  { x: 40, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.18)' },  // 좌측면
  { x: 44, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.18)' },  // 뒤
  // 우팔 외피 — 상/하단
  { x: 44, y: 32, w: 4,  h: 4,  color: 'rgba(50,100,255,0.14)' },
  { x: 48, y: 32, w: 4,  h: 4,  color: 'rgba(50,100,255,0.09)' },
  // 우팔 외피 — 4면
  { x: 40, y: 36, w: 4,  h: 12, color: 'rgba(50,100,255,0.12)' },
  { x: 44, y: 36, w: 4,  h: 12, color: 'rgba(50,100,255,0.12)' },
  { x: 48, y: 36, w: 4,  h: 12, color: 'rgba(50,100,255,0.12)' },
  { x: 52, y: 36, w: 4,  h: 12, color: 'rgba(50,100,255,0.12)' },
  // 좌팔 외피 — 상/하단
  { x: 52, y: 48, w: 4,  h: 4,  color: 'rgba(180,0,255,0.14)' },
  { x: 56, y: 48, w: 4,  h: 4,  color: 'rgba(180,0,255,0.09)' },
  // 좌팔 외피 — 4면
  { x: 48, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.12)' },
  { x: 52, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.12)' },
  { x: 56, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.12)' },
  { x: 60, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.12)' },
]

// 슬림 팔: 앞/뒤 너비 3px, 옆면 4px
const SLIM_ARM_PARTS = [
  // 우팔 — 상/하단
  { x: 44, y: 16, w: 3,  h: 4,  color: 'rgba(50,100,255,0.18)' },
  { x: 47, y: 16, w: 3,  h: 4,  color: 'rgba(50,100,255,0.18)' },
  // 우팔 — 4면
  { x: 40, y: 20, w: 4,  h: 12, color: 'rgba(50,100,255,0.18)' },
  { x: 44, y: 20, w: 3,  h: 12, color: 'rgba(50,100,255,0.18)' },
  { x: 47, y: 20, w: 4,  h: 12, color: 'rgba(50,100,255,0.18)' },
  { x: 51, y: 20, w: 3,  h: 12, color: 'rgba(50,100,255,0.18)' },
  // 우팔 미사용 픽셀
  { x: 47, y: 16, w: 1,  h: 4,  color: 'rgba(255,0,0,0.25)', unused: true },
  { x: 50, y: 16, w: 2,  h: 4,  color: 'rgba(255,0,0,0.18)', unused: true },
  // 좌팔 — 상/하단
  { x: 36, y: 48, w: 3,  h: 4,  color: 'rgba(180,0,255,0.18)' },
  { x: 39, y: 48, w: 3,  h: 4,  color: 'rgba(180,0,255,0.18)' },
  // 좌팔 — 4면
  { x: 32, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.18)' },
  { x: 36, y: 52, w: 3,  h: 12, color: 'rgba(180,0,255,0.18)' },
  { x: 39, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.18)' },
  { x: 43, y: 52, w: 3,  h: 12, color: 'rgba(180,0,255,0.18)' },
  // 좌팔 미사용
  { x: 39, y: 48, w: 1,  h: 4,  color: 'rgba(255,0,0,0.25)', unused: true },
  { x: 42, y: 48, w: 2,  h: 4,  color: 'rgba(255,0,0,0.18)', unused: true },
  // 우팔 외피 슬림 — 상/하단
  { x: 44, y: 32, w: 3,  h: 4,  color: 'rgba(50,100,255,0.1)' },
  { x: 47, y: 32, w: 3,  h: 4,  color: 'rgba(50,100,255,0.1)' },
  // 우팔 외피 — 4면
  { x: 40, y: 36, w: 4,  h: 12, color: 'rgba(50,100,255,0.1)' },
  { x: 44, y: 36, w: 3,  h: 12, color: 'rgba(50,100,255,0.1)' },
  { x: 47, y: 36, w: 4,  h: 12, color: 'rgba(50,100,255,0.1)' },
  { x: 51, y: 36, w: 3,  h: 12, color: 'rgba(50,100,255,0.1)' },
  // 좌팔 외피 슬림 — 상/하단
  { x: 52, y: 48, w: 3,  h: 4,  color: 'rgba(180,0,255,0.1)' },
  { x: 55, y: 48, w: 3,  h: 4,  color: 'rgba(180,0,255,0.1)' },
  // 좌팔 외피 — 4면
  { x: 48, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.1)' },
  { x: 52, y: 52, w: 3,  h: 12, color: 'rgba(180,0,255,0.1)' },
  { x: 55, y: 52, w: 4,  h: 12, color: 'rgba(180,0,255,0.1)' },
  { x: 59, y: 52, w: 3,  h: 12, color: 'rgba(180,0,255,0.1)' },
]

const LABEL_NAMES = {
  ko: {
    head: '머리', hat: '모자', body: '몸통',
    rLeg: '우다리', lLeg: '좌다리', jacket: '재킷',
    rLegOuter: '우다리 겉면', lLegOuter: '좌다리 겉면',
    rArm: '우팔', lArm: '좌팔',
    rArmOuter: '우팔 겉면', lArmOuter: '좌팔 겉면',
  },
  en: {
    head: 'Head', hat: 'Hat', body: 'Body',
    rLeg: 'R.Leg', lLeg: 'L.Leg', jacket: 'Jacket',
    rLegOuter: 'R.Leg Out', lLegOuter: 'L.Leg Out',
    rArm: 'R.Arm', lArm: 'L.Arm',
    rArmOuter: 'R.Arm Out', lArmOuter: 'L.Arm Out',
  },
}

function makeLabels(n) {
  return {
    shared: [
      { key: 'head',       x: 8,  y: 8,  color: '#c8a000' },
      { key: 'hat',        x: 40, y: 8,  color: '#c87800' },
      { key: 'body',       x: 20, y: 20, color: '#009650' },
      { key: 'rLeg',       x: 4,  y: 20, color: '#c83232' },
      { key: 'lLeg',       x: 20, y: 52, color: '#c85000' },
      { key: 'jacket',     x: 20, y: 36, color: '#009650' },
      { key: 'rLegOuter',  x: 4,  y: 36, color: '#c83232' },
      { key: 'lLegOuter',  x: 4,  y: 52, color: '#c85000' },
    ].map(l => ({ ...l, name: n[l.key] })),
    arm: [
      { key: 'rArm',      x: 44, y: 20, color: '#2050d0' },
      { key: 'lArm',      x: 36, y: 52, color: '#8000c0' },
      { key: 'rArmOuter', x: 44, y: 36, color: '#2050d0' },
      { key: 'lArmOuter', x: 52, y: 52, color: '#8000c0' },
    ].map(l => ({ ...l, name: n[l.key] })),
  }
}

export function getSkinLayout(slim = false, lang = 'ko') {
  const n = LABEL_NAMES[lang] ?? LABEL_NAMES.ko
  const { shared, arm } = makeLabels(n)
  return {
    parts: [...SHARED_PARTS, ...(slim ? SLIM_ARM_PARTS : NORMAL_ARM_PARTS)],
    labels: [...shared, ...arm],
  }
}
