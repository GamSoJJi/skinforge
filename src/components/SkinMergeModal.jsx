import { useCallback, useEffect, useRef, useState } from 'react'

const MS = 3           // mini scale (pixel per skin-pixel)
const MINI = 64 * MS   // 192
const RS = 4           // result scale
const RESULT = 64 * RS // 256

// ── Pure utilities ───────────────────────────────────────────────────────────

function buildPath(sel, scale) {
  const path = new Path2D()
  for (const k of sel) {
    const x = k % 64, y = Math.floor(k / 64)
    const x0=x*scale, y0=y*scale, x1=x0+scale, y1=y0+scale
    if (y===0  ||!sel.has((y-1)*64+x)){path.moveTo(x0,y0);path.lineTo(x1,y0)}
    if (y===63 ||!sel.has((y+1)*64+x)){path.moveTo(x0,y1);path.lineTo(x1,y1)}
    if (x===0  ||!sel.has(y*64+(x-1))){path.moveTo(x0,y0);path.lineTo(x0,y1)}
    if (x===63 ||!sel.has(y*64+(x+1))){path.moveTo(x1,y0);path.lineTo(x1,y1)}
  }
  return path
}

function drawStaticSel(ctx, sel, scale, color) {
  const size = 64 * scale
  ctx.clearRect(0, 0, size, size)
  if (!sel || sel.size === 0) return
  const path = buildPath(sel, scale)
  ctx.lineWidth = 1.2
  ctx.setLineDash([4, 3])
  ctx.strokeStyle = color
  ctx.stroke(path)
  ctx.setLineDash([])
}

function drawGrid(ctx, size, scale) {
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= 8; i++) {
    const p = i * 8 * scale
    ctx.beginPath(); ctx.moveTo(p, 0);    ctx.lineTo(p, size);    ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, p);    ctx.lineTo(size, p);    ctx.stroke()
  }
}

function magicWand(imgData, px, py) {
  const { data, width, height } = imgData
  const i0 = (py*width+px)*4
  const [tR,tG,tB,tA] = [data[i0],data[i0+1],data[i0+2],data[i0+3]]
  const sel = new Set(), queue = [[px,py]], vis = new Uint8Array(width*height)
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

// ── Custom hook: scroll-zoom + middle-button pan ─────────────────────────────

function useZoomPan(scrollRef) {
  const [zoom, setZoom_] = useState(1)
  const zoomRef = useRef(1)
  const setZoom = useCallback((v) => { zoomRef.current = v; setZoom_(v) }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const el = scrollRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const vx = e.clientX - rect.left, vy = e.clientY - rect.top
    const old = zoomRef.current
    const next = Math.max(0.5, Math.min(12, old * (e.deltaY < 0 ? 1.15 : 1/1.15)))
    const lx = (el.scrollLeft + vx) / old, ly = (el.scrollTop + vy) / old
    setZoom(next)
    requestAnimationFrame(() => {
      if (!scrollRef.current) return
      scrollRef.current.scrollLeft = lx * next - vx
      scrollRef.current.scrollTop  = ly * next - vy
    })
  }, [scrollRef, setZoom])

  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    const onDown = (e) => {
      if (e.button !== 1) return
      e.preventDefault()
      const s = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop }
      el.style.cursor = 'grabbing'
      const onMove = (e) => {
        el.scrollLeft = s.sl - (e.clientX - s.x)
        el.scrollTop  = s.st - (e.clientY - s.y)
      }
      const onUp = () => {
        el.style.cursor = ''
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }
    el.addEventListener('mousedown', onDown)
    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('mousedown', onDown)
    }
  }, [scrollRef, handleWheel])

  return zoom
}

// ── MiniCanvas ───────────────────────────────────────────────────────────────

function MiniCanvas({ skinCanvas, selection, onSelectionChange, c1, activeTool }) {
  const scrollRef = useRef(null)
  const skinRef   = useRef(null)
  const selRef    = useRef(null)
  const dragStart = useRef(null)
  const isDragging = useRef(false)
  const selModeRef = useRef('replace')
  const selRef_ = useRef(selection)   // stable ref to latest selection
  selRef_.current = selection

  const zoom = useZoomPan(scrollRef)

  // Draw skin + grid
  useEffect(() => {
    const cv = skinRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    ctx.clearRect(0, 0, MINI, MINI)
    if (!skinCanvas) {
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, MINI, MINI)
    } else {
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(skinCanvas, 0, 0, MINI, MINI)
    }
    drawGrid(ctx, MINI, MS)
  }, [skinCanvas])

  // Draw static dashed selection
  useEffect(() => {
    const cv = selRef.current; if (!cv) return
    drawStaticSel(cv.getContext('2d'), selection, MS, c1)
  }, [selection, c1])

  const getCoords = useCallback((e) => {
    const rect = selRef.current.getBoundingClientRect()
    return [
      Math.max(0, Math.min(63, Math.floor(((e.clientX - rect.left) / rect.width)  * 64))),
      Math.max(0, Math.min(63, Math.floor(((e.clientY - rect.top)  / rect.height) * 64))),
    ]
  }, [])

  const applyMode = useCallback((newSel, mode) => {
    if (!newSel || newSel.size === 0) {
      if (mode === 'replace') onSelectionChange(null)
      return
    }
    const cur = selRef_.current
    if (mode === 'union' && cur) {
      onSelectionChange(new Set([...cur, ...newSel]))
    } else if (mode === 'diff' && cur) {
      const next = new Set(cur)
      for (const k of newSel) next.delete(k)
      onSelectionChange(next.size > 0 ? next : null)
    } else {
      onSelectionChange(newSel)
    }
  }, [onSelectionChange])

  const handleMouseDown = useCallback((e) => {
    if (e.button === 2) { onSelectionChange(null); return }
    if (e.button !== 0) return
    e.preventDefault()
    selModeRef.current = e.shiftKey ? 'union' : e.altKey ? 'diff' : 'replace'
    isDragging.current = false
    const [x, y] = getCoords(e)
    dragStart.current = { x, y }
  }, [getCoords, onSelectionChange])

  const handleMouseMove = useCallback((e) => {
    if (!dragStart.current || activeTool !== 'rect') return
    const [px, py] = getCoords(e)
    if (!isDragging.current &&
        (Math.abs(px - dragStart.current.x) > 0 || Math.abs(py - dragStart.current.y) > 0)) {
      isDragging.current = true
    }
    if (!isDragging.current) return
    const { x: sx, y: sy } = dragStart.current
    const ctx = selRef.current.getContext('2d')
    ctx.clearRect(0, 0, MINI, MINI)
    const cur = selRef_.current
    if (cur && cur.size > 0) {
      const path = buildPath(cur, MS)
      ctx.lineWidth = 1.2; ctx.setLineDash([4, 3])
      ctx.strokeStyle = c1; ctx.stroke(path); ctx.setLineDash([])
    }
    ctx.strokeStyle = c1; ctx.lineWidth = 1.2; ctx.setLineDash([4, 3])
    ctx.strokeRect(Math.min(sx,px)*MS, Math.min(sy,py)*MS, (Math.abs(px-sx)+1)*MS, (Math.abs(py-sy)+1)*MS)
    ctx.setLineDash([])
  }, [activeTool, c1, getCoords])

  const handleMouseUp = useCallback((e) => {
    if (e.button !== 0 || !dragStart.current) return
    const [px, py] = getCoords(e)
    const mode = selModeRef.current
    if (activeTool === 'rect' && isDragging.current) {
      const { x: sx, y: sy } = dragStart.current
      const newSel = new Set()
      for (let y = Math.min(sy,py); y <= Math.max(sy,py); y++)
        for (let x = Math.min(sx,px); x <= Math.max(sx,px); x++)
          newSel.add(y*64+x)
      applyMode(newSel, mode)
    } else if (skinCanvas) {
      const imgData = skinCanvas.getContext('2d').getImageData(0, 0, 64, 64)
      applyMode(
        activeTool === 'wand' ? magicWand(imgData, px, py) : new Set([py*64+px]),
        mode
      )
    }
    dragStart.current = null; isDragging.current = false
  }, [activeTool, getCoords, skinCanvas, applyMode])

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      drawStaticSel(selRef.current?.getContext('2d'), selRef_.current, MS, c1)
    }
    dragStart.current = null; isDragging.current = false
  }, [c1])

  const cursor = !skinCanvas ? 'default' : activeTool === 'wand' ? 'cell' : 'crosshair'

  return (
    <div ref={scrollRef} className="merge-canvas-scroll">
      <div style={{ width: MINI*zoom, height: MINI*zoom, position: 'relative', flexShrink: 0, margin: 'auto' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: MINI, height: MINI, transformOrigin: '0 0', transform: `scale(${zoom})` }}>
          <div style={{ position: 'relative', width: MINI, height: MINI }}>
            <canvas ref={skinRef} width={MINI} height={MINI}
              style={{ position: 'absolute', top: 0, left: 0, imageRendering: 'pixelated' }} />
            <canvas ref={selRef} width={MINI} height={MINI}
              style={{ position: 'absolute', top: 0, left: 0, cursor }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ResultCanvas ─────────────────────────────────────────────────────────────

function ResultCanvas({ merged }) {
  const scrollRef = useRef(null)
  const canvasRef = useRef(null)
  const zoom = useZoomPan(scrollRef)

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    ctx.clearRect(0, 0, RESULT, RESULT)
    if (!merged) {
      ctx.fillStyle = '#111'; ctx.fillRect(0, 0, RESULT, RESULT)
    } else {
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(merged, 0, 0, RESULT, RESULT)
    }
    drawGrid(ctx, RESULT, RS)
  }, [merged])

  return (
    <div ref={scrollRef} className="merge-canvas-scroll">
      <div style={{ width: RESULT*zoom, height: RESULT*zoom, position: 'relative', flexShrink: 0, margin: 'auto' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: RESULT, height: RESULT, transformOrigin: '0 0', transform: `scale(${zoom})` }}>
          <canvas ref={canvasRef} width={RESULT} height={RESULT}
            style={{ display: 'block', imageRendering: 'pixelated', cursor: 'not-allowed' }} />
        </div>
      </div>
    </div>
  )
}

// ── SkinMergeModal ────────────────────────────────────────────────────────────

export default function SkinMergeModal({ onClose }) {
  const [skinA, setSkinA] = useState(null)
  const [skinB, setSkinB] = useState(null)
  const [selA, setSelA]   = useState(null)
  const [selB, setSelB]   = useState(null)
  const [merged, setMerged] = useState(null)
  const [activeTool, setActiveTool] = useState('rect')
  const inputARef = useRef(null)
  const inputBRef = useRef(null)

  const updateSelA = useCallback((newSel) => {
    setSelA(newSel)
    if (newSel) setSelB(prev => {
      if (!prev) return prev
      const next = new Set(prev)
      for (const k of newSel) next.delete(k)
      return next.size > 0 ? next : null
    })
  }, [])

  const updateSelB = useCallback((newSel) => {
    setSelB(newSel)
    if (newSel) setSelA(prev => {
      if (!prev) return prev
      const next = new Set(prev)
      for (const k of newSel) next.delete(k)
      return next.size > 0 ? next : null
    })
  }, [])

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
    <div className="merge-view">
      <div className="merge-bar">
        <button className="mc-btn merge-back-btn" onClick={onClose}>← 에디터로</button>
        <span className="merge-bar-title">스킨 합치기</span>
        <div className="merge-bar-sep" />
        <div className="merge-tools">
          <button
            className={`mc-btn merge-tool-btn ${activeTool === 'rect' ? 'active' : ''}`}
            onClick={() => setActiveTool('rect')} title="사각 선택">⬜
          </button>
          <button
            className={`mc-btn merge-tool-btn ${activeTool === 'wand' ? 'active' : ''}`}
            onClick={() => setActiveTool('wand')} title="마법봉">🪄
          </button>
        </div>
        <div className="merge-mode-hints">
          <span>기본</span>
          <span><kbd>Shift</kbd> 합집합</span>
          <span><kbd>Alt</kbd> 차집합</span>
          <span><kbd>우클릭</kbd> 초기화</span>
        </div>
      </div>

      <div className="merge-top">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: '100%', height: '100%' }}>
          <span className="merge-section-label">결과 미리보기</span>
          <ResultCanvas merged={merged} />
        </div>
      </div>

      <div className="merge-bottom">
        <div className="merge-half">
          <span className="merge-section-label">
            <span className="merge-dot-a">●</span> 스킨 A <span style={{ opacity: 0.4 }}>(베이스)</span>
          </span>
          <MiniCanvas skinCanvas={skinA} selection={selA} onSelectionChange={updateSelA}
            c1="rgba(80,150,255,0.95)" activeTool={activeTool} />
          <button className="mc-btn merge-upload-btn" onClick={() => inputARef.current?.click()}>
            {skinA ? '변경' : '불러오기'}
          </button>
          <input ref={inputARef} type="file" accept=".png" style={{ display: 'none' }}
            onChange={(e) => { const f=e.target.files?.[0]; if(f){loadSkinFile(f,setSkinA);setSelA(null)} e.target.value='' }} />
        </div>

        <div className="merge-divider" />

        <div className="merge-half">
          <span className="merge-section-label">
            <span className="merge-dot-b">●</span> 스킨 B <span style={{ opacity: 0.4 }}>(선택 영역 덮어씀)</span>
          </span>
          <MiniCanvas skinCanvas={skinB} selection={selB} onSelectionChange={updateSelB}
            c1="rgba(255,160,40,0.95)" activeTool={activeTool} />
          <button className="mc-btn merge-upload-btn" onClick={() => inputBRef.current?.click()}>
            {skinB ? '변경' : '불러오기'}
          </button>
          <input ref={inputBRef} type="file" accept=".png" style={{ display: 'none' }}
            onChange={(e) => { const f=e.target.files?.[0]; if(f){loadSkinFile(f,setSkinB);setSelB(null)} e.target.value='' }} />
        </div>
      </div>

      <div className="merge-footer">
        <span className="merge-hint">{hint}</span>
        <button className="mc-btn" onClick={handleDownload} disabled={!merged}
          style={{ fontWeight: 700, fontSize: '0.75rem' }}>
          PNG 다운로드
        </button>
      </div>
    </div>
  )
}
