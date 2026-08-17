function inRect(px, py, r) {
  return px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h
}

// ── 파트별 face 정의 ───────────────────────────────────────────
// type 'self' : 면 내부 수평 대칭  (f = { x, y, w, h })
// type 'pair' : f1(우측면) ↔ f2(좌측면) 교차 대칭

const SHARED_PARTS = [
  {
    id: 'head',
    faces: [
      { type: 'self', f: { x: 8,  y: 0, w: 8, h: 8  } },
      { type: 'self', f: { x: 16, y: 0, w: 8, h: 8  } },
      { type: 'pair', f1: { x: 0,  y: 8, w: 8, h: 8 }, f2: { x: 16, y: 8, w: 8, h: 8 } },
      { type: 'self', f: { x: 8,  y: 8, w: 8, h: 8  } },
      { type: 'self', f: { x: 24, y: 8, w: 8, h: 8  } },
    ],
  },
  {
    id: 'hat',
    faces: [
      { type: 'self', f: { x: 40, y: 0, w: 8, h: 8  } },
      { type: 'self', f: { x: 48, y: 0, w: 8, h: 8  } },
      { type: 'pair', f1: { x: 32, y: 8, w: 8, h: 8 }, f2: { x: 48, y: 8, w: 8, h: 8 } },
      { type: 'self', f: { x: 40, y: 8, w: 8, h: 8  } },
      { type: 'self', f: { x: 56, y: 8, w: 8, h: 8  } },
    ],
  },
  {
    id: 'body',
    faces: [
      { type: 'self', f: { x: 20, y: 16, w: 8, h: 4  } },
      { type: 'self', f: { x: 28, y: 16, w: 8, h: 4  } },
      { type: 'pair', f1: { x: 16, y: 20, w: 4, h: 12 }, f2: { x: 28, y: 20, w: 4, h: 12 } },
      { type: 'self', f: { x: 20, y: 20, w: 8, h: 12 } },
      { type: 'self', f: { x: 32, y: 20, w: 8, h: 12 } },
    ],
  },
  {
    id: 'jacket',
    faces: [
      { type: 'self', f: { x: 20, y: 32, w: 8, h: 4  } },
      { type: 'self', f: { x: 28, y: 32, w: 8, h: 4  } },
      { type: 'pair', f1: { x: 16, y: 36, w: 4, h: 12 }, f2: { x: 28, y: 36, w: 4, h: 12 } },
      { type: 'self', f: { x: 20, y: 36, w: 8, h: 12 } },
      { type: 'self', f: { x: 32, y: 36, w: 8, h: 12 } },
    ],
  },
  {
    id: 'rLeg',
    faces: [
      { type: 'self', f: { x: 4,  y: 16, w: 4, h: 4  } },
      { type: 'self', f: { x: 8,  y: 16, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 0,  y: 20, w: 4, h: 12 }, f2: { x: 8,  y: 20, w: 4, h: 12 } },
      { type: 'self', f: { x: 4,  y: 20, w: 4, h: 12 } },
      { type: 'self', f: { x: 12, y: 20, w: 4, h: 12 } },
    ],
  },
  {
    id: 'rLegOuter',
    faces: [
      { type: 'self', f: { x: 4,  y: 32, w: 4, h: 4  } },
      { type: 'self', f: { x: 8,  y: 32, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 0,  y: 36, w: 4, h: 12 }, f2: { x: 8,  y: 36, w: 4, h: 12 } },
      { type: 'self', f: { x: 4,  y: 36, w: 4, h: 12 } },
      { type: 'self', f: { x: 12, y: 36, w: 4, h: 12 } },
    ],
  },
  {
    id: 'lLeg',
    faces: [
      { type: 'self', f: { x: 20, y: 48, w: 4, h: 4  } },
      { type: 'self', f: { x: 24, y: 48, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 16, y: 52, w: 4, h: 12 }, f2: { x: 24, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 20, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 28, y: 52, w: 4, h: 12 } },
    ],
  },
  {
    id: 'lLegOuter',
    faces: [
      { type: 'self', f: { x: 4,  y: 48, w: 4, h: 4  } },
      { type: 'self', f: { x: 8,  y: 48, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 0,  y: 52, w: 4, h: 12 }, f2: { x: 8,  y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 4,  y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 12, y: 52, w: 4, h: 12 } },
    ],
  },
]

const ARM_PARTS_NORMAL = [
  {
    id: 'rArm',
    faces: [
      { type: 'self', f: { x: 44, y: 16, w: 4, h: 4  } },
      { type: 'self', f: { x: 48, y: 16, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 40, y: 20, w: 4, h: 12 }, f2: { x: 48, y: 20, w: 4, h: 12 } },
      { type: 'self', f: { x: 44, y: 20, w: 4, h: 12 } },
      { type: 'self', f: { x: 52, y: 20, w: 4, h: 12 } },
    ],
  },
  {
    id: 'rArmOuter',
    faces: [
      { type: 'self', f: { x: 44, y: 32, w: 4, h: 4  } },
      { type: 'self', f: { x: 48, y: 32, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 40, y: 36, w: 4, h: 12 }, f2: { x: 48, y: 36, w: 4, h: 12 } },
      { type: 'self', f: { x: 44, y: 36, w: 4, h: 12 } },
      { type: 'self', f: { x: 52, y: 36, w: 4, h: 12 } },
    ],
  },
  {
    id: 'lArm',
    faces: [
      { type: 'self', f: { x: 36, y: 48, w: 4, h: 4  } },
      { type: 'self', f: { x: 40, y: 48, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 32, y: 52, w: 4, h: 12 }, f2: { x: 40, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 36, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 44, y: 52, w: 4, h: 12 } },
    ],
  },
  {
    id: 'lArmOuter',
    faces: [
      { type: 'self', f: { x: 52, y: 48, w: 4, h: 4  } },
      { type: 'self', f: { x: 56, y: 48, w: 4, h: 4  } },
      { type: 'pair', f1: { x: 48, y: 52, w: 4, h: 12 }, f2: { x: 56, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 52, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 60, y: 52, w: 4, h: 12 } },
    ],
  },
]

const ARM_PARTS_SLIM = [
  {
    id: 'rArm',
    faces: [
      { type: 'self', f: { x: 44, y: 16, w: 3, h: 4  } },
      { type: 'self', f: { x: 47, y: 16, w: 3, h: 4  } },
      { type: 'pair', f1: { x: 40, y: 20, w: 4, h: 12 }, f2: { x: 47, y: 20, w: 4, h: 12 } },
      { type: 'self', f: { x: 44, y: 20, w: 3, h: 12 } },
      { type: 'self', f: { x: 51, y: 20, w: 3, h: 12 } },
    ],
  },
  {
    id: 'rArmOuter',
    faces: [
      { type: 'self', f: { x: 44, y: 32, w: 3, h: 4  } },
      { type: 'self', f: { x: 47, y: 32, w: 3, h: 4  } },
      { type: 'pair', f1: { x: 40, y: 36, w: 4, h: 12 }, f2: { x: 47, y: 36, w: 4, h: 12 } },
      { type: 'self', f: { x: 44, y: 36, w: 3, h: 12 } },
      { type: 'self', f: { x: 51, y: 36, w: 3, h: 12 } },
    ],
  },
  {
    id: 'lArm',
    faces: [
      { type: 'self', f: { x: 36, y: 48, w: 3, h: 4  } },
      { type: 'self', f: { x: 39, y: 48, w: 3, h: 4  } },
      { type: 'pair', f1: { x: 32, y: 52, w: 4, h: 12 }, f2: { x: 39, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 36, y: 52, w: 3, h: 12 } },
      { type: 'self', f: { x: 43, y: 52, w: 3, h: 12 } },
    ],
  },
  {
    id: 'lArmOuter',
    faces: [
      { type: 'self', f: { x: 52, y: 48, w: 3, h: 4  } },
      { type: 'self', f: { x: 55, y: 48, w: 3, h: 4  } },
      { type: 'pair', f1: { x: 48, y: 52, w: 4, h: 12 }, f2: { x: 55, y: 52, w: 4, h: 12 } },
      { type: 'self', f: { x: 52, y: 52, w: 3, h: 12 } },
      { type: 'self', f: { x: 59, y: 52, w: 3, h: 12 } },
    ],
  },
]

// 좌/우 파트 쌍 정의 (id 기준)
const PAIR_IDS = [
  ['rLeg', 'lLeg'],
  ['rLegOuter', 'lLegOuter'],
  ['rArm', 'lArm'],
  ['rArmOuter', 'lArmOuter'],
]

export function getParts(skinType) {
  return skinType === 'slim'
    ? [...SHARED_PARTS, ...ARM_PARTS_SLIM]
    : [...SHARED_PARTS, ...ARM_PARTS_NORMAL]
}

export function getPartAt(px, py, skinType) {
  for (const part of getParts(skinType)) {
    for (const face of part.faces) {
      if (face.type === 'self' && inRect(px, py, face.f)) return part
      if (face.type === 'pair' && (inRect(px, py, face.f1) || inRect(px, py, face.f2))) return part
    }
  }
  return null
}

/** 파트에 속한 모든 face 사각형 목록을 반환합니다 (하이라이트 렌더링용). */
export function getPartFaceRects(part) {
  const rects = []
  for (const face of part.faces) {
    if (face.type === 'self') rects.push(face.f)
    else { rects.push(face.f1); rects.push(face.f2) }
  }
  return rects
}

/**
 * 호버된 픽셀 기준으로 하이라이트/클릭 대상 그룹을 반환합니다.
 * - 단일 파트: { isPair: false, parts, part }
 * - 좌우 쌍 파트: { isPair: true, parts, leftPart, rightPart }
 */
export function getHoverGroup(px, py, skinType) {
  const part = getPartAt(px, py, skinType)
  if (!part) return null

  const byId = Object.fromEntries(getParts(skinType).map(p => [p.id, p]))
  for (const [leftId, rightId] of PAIR_IDS) {
    if (part.id === leftId || part.id === rightId) {
      const leftPart = byId[leftId]
      const rightPart = byId[rightId]
      return {
        isPair: true,
        parts: [leftPart, rightPart].filter(Boolean),
        leftPart,
        rightPart,
      }
    }
  }
  return { isPair: false, parts: [part], part }
}

// src face → dst face, 수평 반전하여 복사 (snap = 원본 스냅샷)
function hFlipCopy(dst, width, src, dstRect, snap) {
  for (let dy = 0; dy < src.h; dy++) {
    for (let k = 0; k < src.w; k++) {
      const si = ((src.y + dy) * width + src.x + k) * 4
      const di = ((dstRect.y + dy) * width + dstRect.x + dstRect.w - 1 - k) * 4
      dst[di] = snap[si]; dst[di+1] = snap[si+1]
      dst[di+2] = snap[si+2]; dst[di+3] = snap[si+3]
    }
  }
}

/**
 * 좌/우 파트를 면 대응+수평반전하여 복사합니다.
 * - self face (Front/Back/Top/Bottom): 같은 면끼리 h-flip 복사
 * - pair face (Right↔Left): 교차(f1↔f2) + h-flip 복사
 */
export function copyPartMirrored(imageData, srcPart, dstPart) {
  const { data, width } = imageData
  const snap = new Uint8ClampedArray(data)
  for (let i = 0; i < srcPart.faces.length; i++) {
    const sf = srcPart.faces[i]
    const df = dstPart.faces[i]
    if (sf.type === 'self') {
      hFlipCopy(data, width, sf.f, df.f, snap)
    } else {
      hFlipCopy(data, width, sf.f1, df.f2, snap)
      hFlipCopy(data, width, sf.f2, df.f1, snap)
    }
  }
}

/**
 * 단일 파트 내 UV 좌우 대칭을 적용합니다.
 * direction 'ltr': UV 왼쪽 → 오른쪽, 'rtl': 반대
 */
export function applyPartSymmetry(imageData, part, direction) {
  const { data, width } = imageData
  for (const face of part.faces) {
    if (face.type === 'self') {
      const { x, y, w, h } = face.f
      const half = Math.floor(w / 2)
      for (let dy = 0; dy < h; dy++) {
        for (let k = 0; k < half; k++) {
          const [srcX, dstX] = direction === 'ltr'
            ? [x + k, x + w - 1 - k]
            : [x + w - 1 - k, x + k]
          const si = ((y + dy) * width + srcX) * 4
          const di = ((y + dy) * width + dstX) * 4
          data[di] = data[si]; data[di+1] = data[si+1]
          data[di+2] = data[si+2]; data[di+3] = data[si+3]
        }
      }
    } else {
      const { f1, f2 } = face
      const [src, dst] = direction === 'ltr' ? [f1, f2] : [f2, f1]
      for (let dy = 0; dy < src.h; dy++) {
        for (let k = 0; k < src.w; k++) {
          const si = ((src.y + dy) * width + src.x + k) * 4
          const di = ((dst.y + dy) * width + dst.x + dst.w - 1 - k) * 4
          data[di] = data[si]; data[di+1] = data[si+1]
          data[di+2] = data[si+2]; data[di+3] = data[si+3]
        }
      }
    }
  }
}
