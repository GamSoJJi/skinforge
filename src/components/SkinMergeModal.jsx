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

function magicWand(imgData, px, py, contiguous = true) {
  const { data, width, height } = imgData
  const i0 = (py*width+px)*4
  const [tR,tG,tB,tA] = [data[i0],data[i0+1],data[i0+2],data[i0+3]]
  if (!contiguous) {
    const sel = new Set()
    for (let i = 0; i < width*height; i++) {
      const j = i*4
      if (data[j]===tR && data[j+1]===tG && data[j+2]===tB && data[j+3]===tA) sel.add(i)
    }
    return sel
  }
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

function MiniCanvas({ skinCanvas, selection, onSelectionChange, c1, activeTool, selMode, contiguous }) {
  const scrollRef = useRef(null)
  const skinRef   = useRef(null)
  const selRef    = useRef(null)
  const dragStart = useRef(null)
  const isDragging = useRef(false)
  const selModeRef = useRef('replace')
  const selRef_ = useRef(selection)
  selRef_.current = selection
  const selModePropsRef = useRef(selMode || 'replace')
  useEffect(() => { selModePropsRef.current = selMode || 'replace' }, [selMode])
  const contiguousRef = useRef(contiguous)
  contiguousRef.current = contiguous

  const zoom = useZoomPan(scrollRef)

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
    selModeRef.current = e.shiftKey ? 'union' : e.altKey ? 'diff' : selModePropsRef.current
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
        activeTool === 'wand' ? magicWand(imgData, px, py, contiguousRef.current) : new Set([py*64+px]),
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

export default function SkinMergeModal({ onClose, onMerge, initialSkinA, activeTool, selMode, contiguous, onMergedChange, onHasSelChange, clearSelRef }) {
  const [skinA, setSkinA] = useState(() => {
    if (!initialSkinA) return null
    const copy = new OffscreenCanvas(64, 64)
    copy.getContext('2d').drawImage(initialSkinA, 0, 0)
    return copy
  })
  const [skinB, setSkinB] = useState(null)
  const [selA, setSelA]   = useState(null)
  const [selB, setSelB]   = useState(null)
  const [merged, setMerged] = useState(null)
  const inputARef = useRef(null)
  const inputBRef = useRef(null)
  const mergeViewRef  = useRef(null)
  const mergeBottomRef = useRef(null)

  const [tbSplit, setTbSplit_] = useState(60)
  const [abSplit, setAbSplit_] = useState(50)
  const tbSplitRef = useRef(60)
  const abSplitRef = useRef(50)
  const setTbSplit = useCallback((v) => { tbSplitRef.current = v; setTbSplit_(v) }, [])
  const setAbSplit = useCallback((v) => { abSplitRef.current = v; setAbSplit_(v) }, [])

  // rect-select → 'rect', magic-wand → 'wand', others → 'rect'
  const mergeActiveTool = activeTool === 'magic-wand' ? 'wand' : 'rect'

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

  // Notify App of merged canvas for 3D viewer
  useEffect(() => { onMergedChange?.(merged) }, [merged, onMergedChange])

  // Notify App whether any selection exists (for ToolPanel clear button)
  useEffect(() => {
    onHasSelChange?.(selA !== null || selB !== null)
  }, [selA, selB, onHasSelChange])

  // Expose clear function so ToolPanel's 선택해제 can clear both A and B
  useEffect(() => {
    if (!clearSelRef) return
    clearSelRef.current = () => { setSelA(null); setSelB(null) }
    return () => { clearSelRef.current = null }
  }, [clearSelRef])

  // Top/bottom resize (result vs A+B panels)
  const handleTBResizeStart = useCallback((e) => {
    e.preventDefault()
    const container = mergeViewRef.current; if (!container) return
    const rect = container.getBoundingClientRect()
    const startY = e.clientY
    const startSplit = tbSplitRef.current
    const onMove = (e) => {
      const pct = Math.max(15, Math.min(85, startSplit + ((e.clientY - startY) / rect.height) * 100))
      setTbSplit(pct)
    }
    const onUp = () => {
      document.body.classList.remove('resizing-row')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    document.body.classList.add('resizing-row')
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [setTbSplit])

  // Left/right resize (skin A vs skin B panels)
  const handleABResizeStart = useCallback((e) => {
    e.preventDefault()
    const container = mergeBottomRef.current; if (!container) return
    const rect = container.getBoundingClientRect()
    const startX = e.clientX
    const startSplit = abSplitRef.current
    const onMove = (e) => {
      const pct = Math.max(20, Math.min(80, startSplit + ((e.clientX - startX) / rect.width) * 100))
      setAbSplit(pct)
    }
    const onUp = () => {
      document.body.classList.remove('resizing-col')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    document.body.classList.add('resizing-col')
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [setAbSplit])

  const handleApply = () => {
    if (!merged) return
    onMerge(merged)
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const hint = !skinA ? '내 스킨을 먼저 불러오세요'
    : !skinB ? '입힐 스킨을 불러오세요'
    : !selB || selB.size === 0 ? '입힐 스킨에서 영역을 선택하세요'
    : ''

  return (
    <div className="merge-view" ref={mergeViewRef}>
      <div className="merge-bar">
        <button className="mc-btn merge-back-btn" onClick={onClose}>← 에디터로</button>
        <span className="merge-bar-title">옷입히기</span>
        <div className="merge-mode-hints">
          <span><kbd>우클릭</kbd> 선택 초기화</span>
        </div>
      </div>

      <div className="merge-top" style={{ flex: tbSplit }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: '100%', height: '100%' }}>
          <span className="merge-section-label">결과 미리보기</span>
          <ResultCanvas merged={merged} />
        </div>
      </div>

      <div className="merge-resize-h" onMouseDown={handleTBResizeStart} />

      <div className="merge-bottom" ref={mergeBottomRef} style={{ flex: 100 - tbSplit }}>
        <div className="merge-half" style={{ flex: abSplit }}>
          <span className="merge-section-label">
            <span className="merge-dot-a">●</span> 내 스킨 <span style={{ opacity: 0.4 }}>(베이스)</span>
          </span>
          <MiniCanvas skinCanvas={skinA} selection={selA} onSelectionChange={updateSelA}
            c1="rgba(80,150,255,0.95)" activeTool={mergeActiveTool} selMode={selMode} contiguous={contiguous} />
          <button className="mc-btn merge-upload-btn" onClick={() => inputARef.current?.click()}>
            {skinA ? '변경' : '불러오기'}
          </button>
          <input ref={inputARef} type="file" accept=".png" style={{ display: 'none' }}
            onChange={(e) => { const f=e.target.files?.[0]; if(f){loadSkinFile(f,setSkinA);setSelA(null)} e.target.value='' }} />
        </div>

        <div className="merge-resize-v" onMouseDown={handleABResizeStart} />

        <div className="merge-half" style={{ flex: 100 - abSplit }}>
          <span className="merge-section-label">
            <span className="merge-dot-b">●</span> 입힐 스킨 <span style={{ opacity: 0.4 }}>(선택 영역 덮어씀)</span>
          </span>
          <MiniCanvas skinCanvas={skinB} selection={selB} onSelectionChange={updateSelB}
            c1="rgba(255,160,40,0.95)" activeTool={mergeActiveTool} selMode={selMode} contiguous={contiguous} />
          <button className="mc-btn merge-upload-btn" onClick={() => inputBRef.current?.click()}>
            {skinB ? '변경' : '불러오기'}
          </button>
          <input ref={inputBRef} type="file" accept=".png" style={{ display: 'none' }}
            onChange={(e) => { const f=e.target.files?.[0]; if(f){loadSkinFile(f,setSkinB);setSelB(null)} e.target.value='' }} />
        </div>
      </div>

      <div className="merge-footer">
        <span className="merge-hint">{hint}</span>
        <button className="mc-btn primary" onClick={handleApply} disabled={!merged || !selB || selB.size === 0}>
          입히기
        </button>
      </div>
    </div>
  )
}
