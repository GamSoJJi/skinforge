import { useEffect, useRef, useCallback, useState } from 'react'
import { getSkinLayout } from '../utils/skinLayout'

const SCALE = 8
const SIZE = 64 * SCALE

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b, 255]
}

function isInCircle(dx, dy, brushSize) {
  const half = Math.floor(brushSize / 2)
  if (brushSize % 2 === 1) {
    // 홀수: 중심 픽셀 기준 정확한 거리 → 사이즈3=십자5칸, 사이즈5=다이아몬드
    return dx * dx + dy * dy <= half * half
  } else {
    // 짝수: 픽셀 중심 오프셋 기준 → 사이즈2=4칸, 사이즈4=모서리 제거 사각형
    return (dx + 0.5) ** 2 + (dy + 0.5) ** 2 <= (brushSize / 2) ** 2
  }
}

function paintBrush(imageData, cx, cy, brushSize, brushShape, color, sel) {
  const { data, width, height } = imageData
  const [r, g, b, a] = color
  const half = Math.floor(brushSize / 2)
  for (let dy = -half; dy < brushSize - half; dy++) {
    for (let dx = -half; dx < brushSize - half; dx++) {
      if (brushShape === 'circle' && brushSize > 1) {
        if (!isInCircle(dx, dy, brushSize)) continue
      }
      const px = cx + dx, py = cy + dy
      if (px < 0 || px >= width || py < 0 || py >= height) continue
      if (sel && !sel.has(py * width + px)) continue
      const i = (py * width + px) * 4
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = a
    }
  }
}

function floodFill(imageData, startX, startY, fillColor, sel) {
  const { data, width, height } = imageData
  const idx = (x, y) => (y * width + x) * 4
  if (sel && !sel.has(startY * width + startX)) return
  const start = idx(startX, startY)
  const [targetR, targetG, targetB, targetA] = [data[start], data[start+1], data[start+2], data[start+3]]
  const [fr, fg, fb, fa] = fillColor
  if (targetR === fr && targetG === fg && targetB === fb && targetA === fa) return
  const queue = [[startX, startY]]
  const visited = new Uint8Array(width * height)
  while (queue.length > 0) {
    const [x, y] = queue.pop()
    if (x < 0 || x >= width || y < 0 || y >= height || visited[y * width + x]) continue
    if (sel && !sel.has(y * width + x)) continue
    const i = idx(x, y)
    if (data[i] !== targetR || data[i+1] !== targetG || data[i+2] !== targetB || data[i+3] !== targetA) continue
    visited[y * width + x] = 1
    data[i] = fr; data[i+1] = fg; data[i+2] = fb; data[i+3] = fa
    queue.push([x+1, y], [x-1, y], [x, y+1], [x, y-1])
  }
}

function magicWandSelect(imageData, px, py, contiguous) {
  const { data, width, height } = imageData
  const i = (py * width + px) * 4
  const tR = data[i], tG = data[i+1], tB = data[i+2], tA = data[i+3]
  const selected = new Set()
  if (contiguous) {
    const queue = [[px, py]]
    const visited = new Uint8Array(width * height)
    while (queue.length > 0) {
      const [x, y] = queue.pop()
      if (x < 0 || x >= width || y < 0 || y >= height || visited[y * width + x]) continue
      const j = (y * width + x) * 4
      if (data[j] !== tR || data[j+1] !== tG || data[j+2] !== tB || data[j+3] !== tA) continue
      visited[y * width + x] = 1
      selected.add(y * width + x)
      queue.push([x+1, y], [x-1, y], [x, y+1], [x, y-1])
    }
  } else {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const j = (y * width + x) * 4
        if (data[j] === tR && data[j+1] === tG && data[j+2] === tB && data[j+3] === tA) {
          selected.add(y * width + x)
        }
      }
    }
  }
  return selected
}

function buildSelectionPath(selection) {
  const path = new Path2D()
  for (const key of selection) {
    const x = key % 64, y = Math.floor(key / 64)
    const x0 = x * SCALE, y0 = y * SCALE, x1 = x0 + SCALE, y1 = y0 + SCALE
    if (y === 0  || !selection.has((y - 1) * 64 + x)) { path.moveTo(x0, y0); path.lineTo(x1, y0) }
    if (y === 63 || !selection.has((y + 1) * 64 + x)) { path.moveTo(x0, y1); path.lineTo(x1, y1) }
    if (x === 0  || !selection.has(y * 64 + (x - 1))) { path.moveTo(x0, y0); path.lineTo(x0, y1) }
    if (x === 63 || !selection.has(y * 64 + (x + 1))) { path.moveTo(x1, y0); path.lineTo(x1, y1) }
  }
  return path
}

function strokeMarchingAnts(ctx, path, dashOffset) {
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.lineDashOffset = -dashOffset
  ctx.strokeStyle = 'white'
  ctx.stroke(path)
  ctx.lineDashOffset = -dashOffset + 4
  ctx.strokeStyle = 'rgba(0,0,0,0.75)'
  ctx.stroke(path)
  ctx.setLineDash([])
}

export default function PixelEditor({
  skinCanvas, skinVersion, onPixelChange, onBeforeEdit,
  activeTool, activeColor, onColorPicked,
  brushSize, brushShape, skinType, showGuide,
  selection, onSelectionChange, contiguous,
}) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const selectionCanvasRef = useRef(null)
  const cursorRef = useRef(null)
  const scrollRef = useRef(null)
  const isDragging = useRef(false)
  const hasPainted = useRef(false)
  const zoomRef = useRef(1)
  const lastPixelPos = useRef([0, 0])
  const [zoom, setZoomState] = useState(1)
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })
  const rectStartRef = useRef(null)
  const dashOffsetRef = useRef(0)
  const selAnimRef = useRef(null)

  const setZoom = (v) => { zoomRef.current = v; setZoomState(v) }

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    const fitZoom = Math.min(
      (scrollEl.clientWidth - 40) / SIZE,
      (scrollEl.clientHeight - 40) / SIZE
    )
    setZoom(Math.max(0.5, Math.min(12, fitZoom)))
  }, [])

  const redrawOverlay = useCallback(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const ctx = overlay.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)

    // Grid lines (always visible)
    ctx.lineWidth = 0.5
    for (let x = 0; x <= 64; x++) {
      ctx.strokeStyle = x % 8 === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
      ctx.beginPath(); ctx.moveTo(x * SCALE, 0); ctx.lineTo(x * SCALE, SIZE); ctx.stroke()
    }
    for (let y = 0; y <= 64; y++) {
      ctx.strokeStyle = y % 8 === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
      ctx.beginPath(); ctx.moveTo(0, y * SCALE); ctx.lineTo(SIZE, y * SCALE); ctx.stroke()
    }

    if (!showGuide) return

    const { parts, labels } = getSkinLayout(skinType === 'slim')

    for (const part of parts) {
      if (part.unused) continue
      ctx.fillStyle = part.color
      ctx.fillRect(part.x * SCALE, part.y * SCALE, part.w * SCALE, part.h * SCALE)
    }

    // Part borders
    ctx.lineWidth = 1.5
    for (const part of parts) {
      if (part.unused) continue
      ctx.strokeStyle = part.color.replace(/[\d.]+\)$/, '0.6)')
      ctx.strokeRect(part.x * SCALE + 0.5, part.y * SCALE + 0.5, part.w * SCALE - 1, part.h * SCALE - 1)
    }

    // Labels
    ctx.textBaseline = 'top'
    for (const label of labels) {
      const fs = 9
      ctx.font = `bold ${fs}px sans-serif`
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillText(label.name, label.x * SCALE + 3, label.y * SCALE + 3)
      ctx.fillStyle = label.color
      ctx.fillText(label.name, label.x * SCALE + 2, label.y * SCALE + 2)
    }
  }, [skinType, showGuide])

  const redrawSkin = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !skinCanvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(skinCanvas, 0, 0, SIZE, SIZE)
  }, [skinCanvas])

  const redrawCursor = useCallback((mx, my, color) => {
    const cursor = cursorRef.current
    if (!cursor) return
    const ctx = cursor.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)

    if (activeTool === 'pen' || activeTool === 'eraser') {
      const half = Math.floor(brushSize / 2)
      // 실제 칠해지는 픽셀 집합 계산 (paintBrush와 동일한 로직)
      const painted = new Set()
      for (let dy = -half; dy < brushSize - half; dy++) {
        for (let dx = -half; dx < brushSize - half; dx++) {
          if (brushShape === 'circle' && brushSize > 1 && !isInCircle(dx, dy, brushSize)) continue
          painted.add(`${dx},${dy}`)
        }
      }
      // 픽셀 아웃라인 그리기
      const drawOutline = (strokeStyle, lineWidth) => {
        ctx.strokeStyle = strokeStyle; ctx.lineWidth = lineWidth
        ctx.beginPath()
        for (const key of painted) {
          const [dx, dy] = key.split(',').map(Number)
          const px = (mx + dx) * SCALE, py = (my + dy) * SCALE
          if (!painted.has(`${dx},${dy - 1}`)) { ctx.moveTo(px, py);          ctx.lineTo(px + SCALE, py) }
          if (!painted.has(`${dx},${dy + 1}`)) { ctx.moveTo(px, py + SCALE);  ctx.lineTo(px + SCALE, py + SCALE) }
          if (!painted.has(`${dx - 1},${dy}`)) { ctx.moveTo(px, py);          ctx.lineTo(px, py + SCALE) }
          if (!painted.has(`${dx + 1},${dy}`)) { ctx.moveTo(px + SCALE, py);  ctx.lineTo(px + SCALE, py + SCALE) }
        }
        ctx.stroke()
      }
      drawOutline('rgba(0,0,0,0.65)', 2.5)
      drawOutline('rgba(255,255,255,0.95)', 1.2)
    } else if (activeTool === 'eyedropper') {
      const cx = mx * SCALE + SCALE / 2
      const cy = my * SCALE + SCALE / 2
      const len = SCALE * 1.8
      const drawLine = (style, lw, x1, y1, x2, y2) => {
        ctx.strokeStyle = style; ctx.lineWidth = lw
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
      }
      drawLine('rgba(0,0,0,0.7)', 2.5, cx - len, cy, cx + len, cy)
      drawLine('rgba(0,0,0,0.7)', 2.5, cx, cy - len, cx, cy + len)
      drawLine('rgba(255,255,255,0.95)', 1.2, cx - len, cy, cx + len, cy)
      drawLine('rgba(255,255,255,0.95)', 1.2, cx, cy - len, cx, cy + len)
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = color || '#ffffff'; ctx.fill()
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke()
      if (color) {
        ctx.fillStyle = color
        ctx.fillRect(cx + 6, cy + 6, SCALE, SCALE)
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1
        ctx.strokeRect(cx + 6, cy + 6, SCALE, SCALE)
      }
    } else if (activeTool === 'fill') {
      const cx = mx * SCALE + SCALE / 2
      const cy = my * SCALE + SCALE / 2
      const len = SCALE * 1.8
      const drawLine = (style, lw, x1, y1, x2, y2) => {
        ctx.strokeStyle = style; ctx.lineWidth = lw
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
      }
      drawLine('rgba(0,0,0,0.7)', 2.5, cx - len, cy, cx + len, cy)
      drawLine('rgba(0,0,0,0.7)', 2.5, cx, cy - len, cx, cy + len)
      drawLine('rgba(255,255,255,0.95)', 1.2, cx - len, cy, cx + len, cy)
      drawLine('rgba(255,255,255,0.95)', 1.2, cx, cy - len, cx, cy + len)
      ctx.font = `${SCALE * 1.4}px serif`
      ctx.textBaseline = 'top'; ctx.textAlign = 'left'
      ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1
      ctx.fillStyle = '#ffffff'
      ctx.fillText('🪣', cx + 5, cy + 5)
      ctx.shadowColor = 'transparent'
    }
    // rect-select and magic-wand use CSS cursor (no canvas drawing)
  }, [activeTool, brushSize, brushShape])

  // ── Selection overlay (marching ants) ────────────────────────────
  const drawSelectionOverlay = useCallback((sel) => {
    const canvas = selectionCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)
    if (!sel || sel.size === 0) return
    const path = buildSelectionPath(sel)
    strokeMarchingAnts(ctx, path, dashOffsetRef.current)
  }, [])

  // RAF marching ants animation
  useEffect(() => {
    const canvas = selectionCanvasRef.current
    if (!selection || selection.size === 0) {
      if (canvas) canvas.getContext('2d').clearRect(0, 0, SIZE, SIZE)
      if (selAnimRef.current) cancelAnimationFrame(selAnimRef.current)
      return
    }
    let running = true
    const tick = () => {
      if (!running) return
      dashOffsetRef.current = (dashOffsetRef.current + 0.35) % 8
      drawSelectionOverlay(selection)
      selAnimRef.current = requestAnimationFrame(tick)
    }
    selAnimRef.current = requestAnimationFrame(tick)
    return () => {
      running = false
      if (selAnimRef.current) cancelAnimationFrame(selAnimRef.current)
    }
  }, [selection, drawSelectionOverlay])

  // ── Rect-select drag preview ──────────────────────────────────────
  const drawRectPreview = useCallback((sx, sy, ex, ey) => {
    const canvas = selectionCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)
    const minX = Math.min(sx, ex), maxX = Math.max(sx, ex)
    const minY = Math.min(sy, ey), maxY = Math.max(sy, ey)
    const rx = minX * SCALE, ry = minY * SCALE
    const rw = (maxX - minX + 1) * SCALE, rh = (maxY - minY + 1) * SCALE
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.lineDashOffset = 0
    ctx.strokeStyle = 'white'
    ctx.strokeRect(rx, ry, rw, rh)
    ctx.lineDashOffset = 4
    ctx.strokeStyle = 'rgba(0,0,0,0.75)'
    ctx.strokeRect(rx, ry, rw, rh)
    ctx.setLineDash([])
  }, [])

  useEffect(() => { redrawSkin() }, [redrawSkin, skinVersion])
  useEffect(() => { redrawOverlay() }, [redrawOverlay])

  useEffect(() => {
    const [mx, my] = lastPixelPos.current
    redrawCursor(mx, my, null)
  }, [redrawCursor])

  const getPixelCoords = useCallback((e) => {
    const rect = cursorRef.current.getBoundingClientRect()
    const px = Math.floor(((e.clientX - rect.left) / rect.width) * 64)
    const py = Math.floor(((e.clientY - rect.top) / rect.height) * 64)
    return [Math.max(0, Math.min(63, px)), Math.max(0, Math.min(63, py))]
  }, [])

  const getHoveredColor = useCallback((px, py) => {
    if (!skinCanvas) return null
    const d = skinCanvas.getContext('2d').getImageData(px, py, 1, 1).data
    if (d[3] === 0) return null
    return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('')
  }, [skinCanvas])

  const applyTool = useCallback((e, sel) => {
    if (!skinCanvas) return
    const [px, py] = getPixelCoords(e)
    const ctx = skinCanvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, 64, 64)

    if (activeTool === 'eyedropper') {
      const i = (py * 64 + px) * 4
      if (imageData.data[i + 3] === 0) return
      onColorPicked('#' + [imageData.data[i], imageData.data[i+1], imageData.data[i+2]]
        .map(v => v.toString(16).padStart(2, '0')).join(''))
      return
    }
    if (activeTool === 'pen') {
      paintBrush(imageData, px, py, brushSize, brushShape, hexToRgba(activeColor), sel)
    } else if (activeTool === 'eraser') {
      paintBrush(imageData, px, py, brushSize, brushShape, [0, 0, 0, 0], sel)
    } else if (activeTool === 'fill') {
      floodFill(imageData, px, py, hexToRgba(activeColor), sel)
      ctx.putImageData(imageData, 0, 0)
      hasPainted.current = true
      onPixelChange(); return
    }
    ctx.putImageData(imageData, 0, 0)
    hasPainted.current = true
    redrawSkin()
  }, [skinCanvas, activeTool, activeColor, onColorPicked, onPixelChange, redrawSkin, brushSize, brushShape, getPixelCoords])

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return

    const [px, py] = getPixelCoords(e)

    if (activeTool === 'rect-select') {
      // Cancel previous marching ants animation while dragging
      if (selAnimRef.current) cancelAnimationFrame(selAnimRef.current)
      rectStartRef.current = { x: px, y: py }
      drawRectPreview(px, py, px, py)
      return
    }

    if (activeTool === 'magic-wand') {
      const ctx = skinCanvas.getContext('2d')
      const imageData = ctx.getImageData(0, 0, 64, 64)
      const newSel = magicWandSelect(imageData, px, py, contiguous)
      onSelectionChange(newSel.size > 0 ? newSel : null)
      return
    }

    isDragging.current = true
    hasPainted.current = false
    if (activeTool !== 'eyedropper') onBeforeEdit()
    applyTool(e, selection)
  }, [activeTool, getPixelCoords, skinCanvas, contiguous, onSelectionChange, onBeforeEdit, applyTool, selection, drawRectPreview])

  const handleMouseMove = useCallback((e) => {
    const [px, py] = getPixelCoords(e)
    lastPixelPos.current = [px, py]

    if (activeTool === 'rect-select') {
      if (rectStartRef.current) {
        drawRectPreview(rectStartRef.current.x, rectStartRef.current.y, px, py)
      }
      return
    }

    if (activeTool === 'magic-wand') return

    const hovColor = activeTool === 'eyedropper' ? getHoveredColor(px, py) : null
    redrawCursor(px, py, hovColor)
    if (!isDragging.current || activeTool === 'fill' || activeTool === 'eyedropper') return
    applyTool(e, selection)
  }, [activeTool, getPixelCoords, drawRectPreview, applyTool, selection, redrawCursor, getHoveredColor])

  const handleMouseUp = useCallback((e) => {
    if (activeTool === 'rect-select' && rectStartRef.current) {
      const [px, py] = getPixelCoords(e)
      const { x: sx, y: sy } = rectStartRef.current
      rectStartRef.current = null
      const minX = Math.min(sx, px), maxX = Math.max(sx, px)
      const minY = Math.min(sy, py), maxY = Math.max(sy, py)
      const newSel = new Set()
      for (let y = minY; y <= maxY; y++)
        for (let x = minX; x <= maxX; x++)
          newSel.add(y * 64 + x)
      onSelectionChange(newSel.size > 0 ? newSel : null)
      return
    }

    if (isDragging.current && hasPainted.current) { onPixelChange(); redrawSkin() }
    isDragging.current = false
  }, [activeTool, getPixelCoords, onSelectionChange, onPixelChange, redrawSkin])

  const handleMouseLeave = useCallback(() => {
    if (activeTool === 'rect-select') return  // keep preview while dragging
    if (isDragging.current && hasPainted.current) { onPixelChange(); redrawSkin() }
    isDragging.current = false
    cursorRef.current?.getContext('2d').clearRect(0, 0, SIZE, SIZE)
  }, [activeTool, onPixelChange, redrawSkin])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    const rect = scrollEl.getBoundingClientRect()
    const viewX = e.clientX - rect.left
    const viewY = e.clientY - rect.top
    const oldZoom = zoomRef.current
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
    const newZoom = Math.max(0.5, Math.min(12, oldZoom * factor))
    const logicalX = (scrollEl.scrollLeft + viewX) / oldZoom
    const logicalY = (scrollEl.scrollTop + viewY) / oldZoom
    setZoom(newZoom)
    requestAnimationFrame(() => {
      scrollEl.scrollLeft = logicalX * newZoom - viewX
      scrollEl.scrollTop = logicalY * newZoom - viewY
    })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onMouseDown = (e) => {
      if (e.button !== 1) return
      e.preventDefault()
      isPanning.current = true
      panStart.current = { x: e.clientX, y: e.clientY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop }
      el.style.cursor = 'grabbing'
    }
    const onMouseMove = (e) => {
      if (!isPanning.current) return
      e.preventDefault()
      el.scrollLeft = panStart.current.scrollLeft - (e.clientX - panStart.current.x)
      el.scrollTop = panStart.current.scrollTop - (e.clientY - panStart.current.y)
    }
    const onMouseUp = (e) => {
      if (e.button !== 1 || !isPanning.current) return
      isPanning.current = false
      el.style.cursor = ''
    }
    const onMouseLeave = () => {
      if (!isPanning.current) return
      isPanning.current = false
      el.style.cursor = ''
    }
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseLeave)
    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  const cursorStyle =
    activeTool === 'rect-select' ? 'crosshair' :
    activeTool === 'magic-wand'  ? 'cell' : 'none'

  return (
    <div className="pixel-editor-scroll" ref={scrollRef}>
      <div style={{ width: SIZE * zoom, height: SIZE * zoom, position: 'relative', flexShrink: 0, margin: 'auto' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: SIZE, height: SIZE, transformOrigin: '0 0', transform: `scale(${zoom})` }}>
          <div className="pixel-editor-wrap" style={{ width: SIZE, height: SIZE, position: 'relative' }}>
            {/* Layer 1: skin pixels */}
            <canvas ref={canvasRef} width={SIZE} height={SIZE}
              style={{ position: 'absolute', top: 0, left: 0, imageRendering: 'pixelated' }} />
            {/* Layer 2: grid + labels */}
            <canvas ref={overlayRef} width={SIZE} height={SIZE}
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', imageRendering: 'auto' }} />
            {/* Layer 3: selection (marching ants) */}
            <canvas ref={selectionCanvasRef} width={SIZE} height={SIZE}
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
            {/* Layer 4: cursor preview + mouse events */}
            <canvas ref={cursorRef} width={SIZE} height={SIZE}
              style={{ position: 'absolute', top: 0, left: 0, cursor: cursorStyle }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
