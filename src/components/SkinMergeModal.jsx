import { useEffect, useRef, useState } from 'react'

const MS = 3           // mini scale (pixel per skin-pixel)
const MINI = 64 * MS   // 192
const RS = 4           // result scale
const RESULT = 64 * RS // 256

// ── Canvas utilities (local copies, adapted for variable scale) ──────────────

function buildPath(sel, scale) {
  const path = new Path2D()
  for (const k of sel) {
    const x = k % 64, y = Math.floor(k / 64)
    const x0 = x*scale, y0 = y*scale, x1 = x0+scale, y1 = y0+scale
    if (y === 0  || !sel.has((y-1)*64+x)) { path.moveTo(x0,y0); path.lineTo(x1,y0) }
    if (y === 63 || !sel.has((y+1)*64+x)) { path.moveTo(x0,y1); path.lineTo(x1,y1) }
    if (x === 0  || !sel.has(y*64+(x-1))) { path.moveTo(x0,y0); path.lineTo(x0,y1) }
    if (x === 63 || !sel.has(y*64+(x+1))) { path.moveTo(x1,y0); path.lineTo(x1,y1) }
  }
  return path
}

function drawAnts(ctx, path, offset, c1, c2) {
  ctx.lineWidth = 1.2
  ctx.setLineDash([3, 3])
  ctx.lineDashOffset = -offset;   ctx.strokeStyle = c1; ctx.stroke(path)
  ctx.lineDashOffset = -offset+3; ctx.strokeStyle = c2; ctx.stroke(path)
  ctx.setLineDash([])
}

function drawGrid(ctx, size, scale) {
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= 8; i++) {
    const p = i * 8 * scale
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke()
  }
}

function magicWand(imgData, px, py) {
  const { data, width, height } = imgData
  const i0 = (py*width+px)*4
  const [tR,tG,tB,tA] = [data[i0],data[i0+1],data[i0+2],data[i0+3]]
  const sel = new Set()
  const queue = [[px,py]]
  const vis = new Uint8Array(width*height)
  while (queue.length) {
    const [x,y] = queue.pop()
    if (x<0||x>=width||y<0||y>=height||vis[y*width+x]) continue
    const j = (y*width+x)*4
    if (data[j]!==tR||data[j+1]!==tG||data[j+2]!==tB||data[j+3]!==tA) continue
    vis[y*width+x]=1; sel.add(y*width+x)
    queue.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])
  }
  return sel
}

// ── MiniCanvas ───────────────────────────────────────────────────────────────

function MiniCanvas({ skinCanvas, selection, onSelectionChange, c1, c2 }) {
  const skinRef = useRef(null)
  const selRef  = useRef(null)
  const dashRef = useRef(0)
  const animRef = useRef(null)
  const dragStart = useRef(null)
  const isDragging = useRef(false)

  // Draw skin + block grid
  useEffect(() => {
    const cv = skinRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    ctx.clearRect(0, 0, MINI, MINI)
    if (!skinCanvas) {
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, MINI, MINI)
    } else {
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(skinCanvas, 0, 0, MINI, MINI)
    }
    drawGrid(ctx, MINI, MS)
  }, [skinCanvas])

  // Marching ants RAF
  useEffect(() => {
    const cv = selRef.current
    if (!cv) return
    if (!selection || selection.size === 0) {
      cv.getContext('2d').clearRect(0, 0, MINI, MINI)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }
    let running = true
    const path = buildPath(selection, MS)
    const tick = () => {
      if (!running) return
      dashRef.current = (dashRef.current + 0.3) % 6
      const ctx = cv.getContext('2d')
      ctx.clearRect(0, 0, MINI, MINI)
      drawAnts(ctx, path, dashRef.current, c1, c2)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { running = false; if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [selection, c1, c2])

  const getCoords = (e) => {
    const rect = selRef.current.getBoundingClientRect()
    return [
      Math.max(0, Math.min(63, Math.floor(((e.clientX - rect.left) / rect.width) * 64))),
      Math.max(0, Math.min(63, Math.floor(((e.clientY - rect.top)  / rect.height) * 64))),
    ]
  }

  const handleMouseDown = (e) => {
    if (e.button === 2) { onSelectionChange(null); return }
    if (e.button !== 0) return
    e.preventDefault()
    isDragging.current = false
    dragStart.current = { x: getCoords(e)[0], y: getCoords(e)[1] }
  }

  const handleMouseMove = (e) => {
    if (!dragStart.current) return
    const [px, py] = getCoords(e)
    if (!isDragging.current &&
      (Math.abs(px - dragStart.current.x) > 1 || Math.abs(py - dragStart.current.y) > 1)) {
      isDragging.current = true
    }
    if (!isDragging.current) return
    const { x: sx, y: sy } = dragStart.current
    const minX = Math.min(sx,px)*MS, minY = Math.min(sy,py)*MS
    const w = (Math.abs(px-sx)+1)*MS, h = (Math.abs(py-sy)+1)*MS
    const ctx = selRef.current.getContext('2d')
    ctx.clearRect(0, 0, MINI, MINI)
    ctx.strokeStyle = c1; ctx.lineWidth = 1.2
    ctx.setLineDash([3,3]); ctx.strokeRect(minX, minY, w, h); ctx.setLineDash([])
  }

  const handleMouseUp = (e) => {
    if (e.button !== 0 || !dragStart.current) return
    const [px, py] = getCoords(e)
    if (isDragging.current) {
      const { x: sx, y: sy } = dragStart.current
      const minX = Math.min(sx,px), maxX = Math.max(sx,px)
      const minY = Math.min(sy,py), maxY = Math.max(sy,py)
      const newSel = new Set()
      for (let y = minY; y <= maxY; y++)
        for (let x = minX; x <= maxX; x++)
          newSel.add(y*64+x)
      onSelectionChange(newSel.size > 0 ? newSel : null)
    } else {
      if (!skinCanvas) return
      const imgData = skinCanvas.getContext('2d').getImageData(0, 0, 64, 64)
      const newSel = magicWand(imgData, px, py)
      if (e.shiftKey && selection) {
        onSelectionChange(new Set([...selection, ...newSel]))
      } else {
        onSelectionChange(newSel.size > 0 ? newSel : null)
      }
    }
    dragStart.current = null; isDragging.current = false
  }

  const handleMouseLeave = () => {
    dragStart.current = null; isDragging.current = false
    selRef.current?.getContext('2d').clearRect(0, 0, MINI, MINI)
    if (selection && selection.size > 0) {
      // Re-trigger ants by resetting dashRef (effect will pick up selection)
    }
  }

  return (
    <div style={{ position: 'relative', width: MINI, height: MINI, flexShrink: 0 }}>
      <canvas ref={skinRef} width={MINI} height={MINI}
        style={{ position: 'absolute', top: 0, left: 0, imageRendering: 'pixelated' }} />
      <canvas ref={selRef} width={MINI} height={MINI}
        style={{ position: 'absolute', top: 0, left: 0,
          cursor: skinCanvas ? 'crosshair' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}

// ── ResultCanvas ─────────────────────────────────────────────────────────────

function ResultCanvas({ merged }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    ctx.clearRect(0, 0, RESULT, RESULT)
    if (!merged) {
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, RESULT, RESULT)
    } else {
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(merged, 0, 0, RESULT, RESULT)
    }
    drawGrid(ctx, RESULT, RS)
  }, [merged])
  return (
    <canvas ref={ref} width={RESULT} height={RESULT}
      style={{ imageRendering: 'pixelated', cursor: 'not-allowed', display: 'block' }} />
  )
}

// ── File upload helper ────────────────────────────────────────────────────────

function loadSkinFile(file, onLoad) {
  const reader = new FileReader()
  reader.onload = (evt) => {
    const img = new Image()
    img.onload = () => {
      const cv = new OffscreenCanvas(64, 64)
      cv.getContext('2d').drawImage(img, 0, 0)
      onLoad(cv)
    }
    img.src = evt.target.result
  }
  reader.readAsDataURL(file)
}

// ── SkinMergeModal ────────────────────────────────────────────────────────────

export default function SkinMergeModal({ onClose }) {
  const [skinA, setSkinA] = useState(null)
  const [skinB, setSkinB] = useState(null)
  const [selA, setSelA] = useState(null)
  const [selB, setSelB] = useState(null)
  const [merged, setMerged] = useState(null)
  const inputARef = useRef(null)
  const inputBRef = useRef(null)

  const updateSelA = (newSel) => {
    setSelA(newSel)
    if (newSel) setSelB(prev => {
      if (!prev) return prev
      const next = new Set(prev)
      for (const k of newSel) next.delete(k)
      return next.size > 0 ? next : null
    })
  }

  const updateSelB = (newSel) => {
    setSelB(newSel)
    if (newSel) setSelA(prev => {
      if (!prev) return prev
      const next = new Set(prev)
      for (const k of newSel) next.delete(k)
      return next.size > 0 ? next : null
    })
  }

  // Recompute merge result
  useEffect(() => {
    if (!skinA) { setMerged(null); return }
    const out = new OffscreenCanvas(64, 64)
    const ctx = out.getContext('2d')
    ctx.drawImage(skinA, 0, 0)
    if (skinB && selB && selB.size > 0) {
      const rImg = ctx.getImageData(0, 0, 64, 64)
      const bImg = skinB.getContext('2d').getImageData(0, 0, 64, 64)
      for (const k of selB) {
        const i = k*4
        rImg.data[i]=bImg.data[i]; rImg.data[i+1]=bImg.data[i+1]
        rImg.data[i+2]=bImg.data[i+2]; rImg.data[i+3]=bImg.data[i+3]
      }
      ctx.putImageData(rImg, 0, 0)
    }
    setMerged(out)
  }, [skinA, skinB, selB])

  const handleDownload = () => {
    if (!merged) return
    merged.convertToBlob({ type: 'image/png' }).then(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'merged_skin.png'; a.click()
      URL.revokeObjectURL(url)
    })
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const hint = !skinA ? '스킨A를 먼저 불러오세요'
    : !skinB ? '스킨B를 불러온 후 영역을 선택하세요'
    : !selB || selB.size === 0 ? 'B에서 가져올 영역을 선택하세요'
    : ''

  return (
    <div className="merge-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="merge-modal">
        <div className="merge-header">
          <span>스킨 합치기</span>
          <button className="cr-close" onClick={onClose}>×</button>
        </div>

        <div className="merge-top">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3px' }}>
              결과 미리보기
            </span>
            <ResultCanvas merged={merged} />
          </div>
        </div>

        <div className="merge-bottom">
          <div className="merge-half">
            <div className="merge-half-label" style={{ background: 'rgba(60,120,255,0.18)', borderColor: 'rgba(60,120,255,0.4)' }}>스킨 A</div>
            <MiniCanvas
              skinCanvas={skinA} selection={selA} onSelectionChange={updateSelA}
              c1="rgba(80,150,255,0.95)" c2="rgba(0,0,0,0.6)"
            />
            <button className="mc-btn merge-upload-btn" onClick={() => inputARef.current?.click()}>
              {skinA ? '변경' : '불러오기'}
            </button>
            <input ref={inputARef} type="file" accept=".png" style={{ display: 'none' }}
              onChange={(e) => { const f=e.target.files?.[0]; if(f) { loadSkinFile(f, setSkinA); setSelA(null) } e.target.value='' }}
            />
          </div>

          <div className="merge-divider" />

          <div className="merge-half">
            <div className="merge-half-label" style={{ background: 'rgba(255,150,40,0.18)', borderColor: 'rgba(255,150,40,0.4)' }}>스킨 B</div>
            <MiniCanvas
              skinCanvas={skinB} selection={selB} onSelectionChange={updateSelB}
              c1="rgba(255,160,40,0.95)" c2="rgba(0,0,0,0.6)"
            />
            <button className="mc-btn merge-upload-btn" onClick={() => inputBRef.current?.click()}>
              {skinB ? '변경' : '불러오기'}
            </button>
            <input ref={inputBRef} type="file" accept=".png" style={{ display: 'none' }}
              onChange={(e) => { const f=e.target.files?.[0]; if(f) { loadSkinFile(f, setSkinB); setSelB(null) } e.target.value='' }}
            />
          </div>
        </div>

        <div className="merge-footer">
          <span className="merge-hint">{hint}</span>
          <button
            className="mc-btn"
            onClick={handleDownload}
            disabled={!merged}
            style={{ fontWeight: 700, fontSize: '0.75rem' }}
          >PNG 다운로드</button>
        </div>
      </div>
    </div>
  )
}
