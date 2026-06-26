import { useCallback, useState, useEffect, useRef } from 'react'
import SkinViewer3D from './components/SkinViewer3D'
import PixelEditor from './components/PixelEditor'
import ToolPanel from './components/ToolPanel'
import ColorPanel from './components/ColorPanel'
import ColorReplacePanel from './components/ColorReplacePanel'
import './App.css'

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

const DEFAULT_PALETTE = [
  '#000000', '#ffffff', '#9d9d9d', '#474747',
  '#ff0000', '#ff7f00', '#ffff00', '#00ff00',
  '#00ffff', '#0000ff', '#8b00ff', '#ff00ff',
  '#cc8844', '#664422', '#ffccaa', '#336600',
  '#003366', '#660033', '#4a90d9', '#d4af37',
]

export default function App() {
  const [skinCanvas] = useState(() => new OffscreenCanvas(64, 64))
  const [skinVersion, setSkinVersion] = useState(0)
  const [activeTool, setActiveTool] = useState('pen')
  const [activeColor, setActiveColor] = useState('#cc8844')
  const [brushSize, setBrushSize] = useState(1)
  const [brushShape, setBrushShape] = useState('square')
  const [skinType, setSkinType] = useState('normal')
  const [selection, setSelection] = useState(null)
  const [contiguous, setContiguous] = useState(true)
  const [uploadCount, setUploadCount] = useState(0)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const [colorMenuOpen, setColorMenuOpen] = useState(false)
  const [historyPalette, setHistoryPalette] = useState(
    () => DEFAULT_PALETTE.map(c => ({ color: c, pinned: false }))
  )

  const fileMenuRef = useRef(null)
  const colorMenuRef = useRef(null)
  const fileInputRef = useRef(null)
  // 최신 값을 useCallback 클로저 없이 참조하기 위한 ref
  const activeColorRef = useRef(activeColor)
  const activeToolRef = useRef(activeTool)
  const pickingSlotRef = useRef(null)
  activeColorRef.current = activeColor
  activeToolRef.current = activeTool

  useEffect(() => {
    const handleClick = (e) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target)) setFileMenuOpen(false)
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target)) setColorMenuOpen(false)
    }
    if (fileMenuOpen || colorMenuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [fileMenuOpen, colorMenuOpen])

  const addToHistory = useCallback((newColor) => {
    if (!newColor || newColor.length !== 7) return
    setHistoryPalette(prev => {
      const nonPinnedIdx = prev.map((_, i) => i).filter(i => !prev[i].pinned)
      if (!nonPinnedIdx.length) return prev
      if (prev[nonPinnedIdx[0]]?.color === newColor) return prev
      const nonPinnedColors = nonPinnedIdx.map(i => prev[i].color)
      const filtered = nonPinnedColors.filter(c => c !== newColor)
      const updated = [newColor, ...filtered].slice(0, nonPinnedIdx.length)
      const next = [...prev]
      nonPinnedIdx.forEach((slotIdx, j) => {
        next[slotIdx] = { color: updated[j], pinned: false }
      })
      return next
    })
  }, [])

  const handlePinToggle = useCallback((index) => {
    setHistoryPalette(prev => {
      const next = [...prev]
      next[index] = { ...next[index], pinned: !next[index].pinned }
      return next
    })
  }, [])

  const undoStack = useRef([])
  const redoStack = useRef([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const pushUndo = useCallback(() => {
    const ctx = skinCanvas.getContext('2d')
    const snapshot = ctx.getImageData(0, 0, 64, 64)
    undoStack.current.push(snapshot)
    if (undoStack.current.length > 50) undoStack.current.shift()
    redoStack.current = []
    setCanUndo(true)
    setCanRedo(false)
  }, [skinCanvas])

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return
    const ctx = skinCanvas.getContext('2d')
    redoStack.current.push(ctx.getImageData(0, 0, 64, 64))
    ctx.putImageData(undoStack.current.pop(), 0, 0)
    setSkinVersion((v) => v + 1)
    setCanUndo(undoStack.current.length > 0)
    setCanRedo(true)
  }, [skinCanvas])

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return
    const ctx = skinCanvas.getContext('2d')
    undoStack.current.push(ctx.getImageData(0, 0, 64, 64))
    ctx.putImageData(redoStack.current.pop(), 0, 0)
    setSkinVersion((v) => v + 1)
    setCanUndo(true)
    setCanRedo(redoStack.current.length > 0)
  }, [skinCanvas])

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); undo()
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); redo()
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'r') {
        e.preventDefault(); setColorReplaceOpen(v => !v)
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'r') {
        e.preventDefault(); setColorReplaceOpen(v => !v)
      }
      if (e.key === 'Escape') {
        if (pickingSlotRef.current !== null) { setPickingSlot(null); return }
        setSelection(null); return
      }
      if (document.activeElement?.tagName === 'INPUT') return
      if (e.key === 'b') setActiveTool('pen')
      if (e.key === 'e') setActiveTool('eraser')
      if (e.key === 'i') setActiveTool('eyedropper')
      if (e.key === 'm') setActiveTool('rect-select')
      if (e.key === '[') setBrushSize((s) => Math.max(1, s - 1))
      if (e.key === ']') setBrushSize((s) => Math.min(16, s + 1))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  useEffect(() => {
    const img = new Image()
    img.src = '/skin_example.png'
    img.onload = () => {
      const ctx = skinCanvas.getContext('2d')
      ctx.clearRect(0, 0, 64, 64)
      ctx.drawImage(img, 0, 0)
      undoStack.current = []
      redoStack.current = []
      setSkinVersion((v) => v + 1)
    }
  }, [skinCanvas])

  // 실제 캔버스에 색을 칠한 순간 히스토리 추가 (지우개/선택 도구 제외)
  const handlePixelChange = useCallback(() => {
    setSkinVersion((v) => v + 1)
    const tool = activeToolRef.current
    if (tool === 'pen' || tool === 'fill') {
      addToHistory(activeColorRef.current)
    }
  }, [addToHistory])

  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const img = new Image()
      img.onload = () => {
        const ctx = skinCanvas.getContext('2d')
        ctx.clearRect(0, 0, 64, 64)
        ctx.drawImage(img, 0, 0)
        undoStack.current = []
        redoStack.current = []
        setSkinVersion((v) => v + 1)
        setUploadCount((c) => c + 1)
      }
      img.src = evt.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    setFileMenuOpen(false)
  }, [skinCanvas])

  const handleDownload = useCallback(() => {
    skinCanvas.convertToBlob({ type: 'image/png' }).then((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'my_skin.png'; a.click()
      URL.revokeObjectURL(url)
    })
  }, [skinCanvas])

  const handleColorPicked = useCallback((color) => {
    setActiveColor(color)
    setActiveTool('pen')
  }, [])

  const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform)
  const MOD = isMac ? '⌘' : 'Ctrl+'
  const SHIFT = isMac ? '⇧' : 'Shift+'
  const REDO_KEY = isMac ? `${MOD}${SHIFT}Z` : `${MOD}Y`

  const [showGuide, setShowGuide] = useState(true)
  // ─── Color Replace Modal ───────────────────────────────
  const [colorReplaceOpen, setColorReplaceOpen] = useState(false)
  const [replaceColors, setReplaceColors] = useState(['', ''])
  const [pickingSlot, setPickingSlot] = useState(null)
  pickingSlotRef.current = pickingSlot

  const handlePickStart = useCallback((slot) => {
    setPickingSlot(prev => prev === slot ? null : slot)
  }, [])

  const handleModalColorPick = useCallback((color) => {
    setReplaceColors(prev => { const n = [...prev]; n[pickingSlot] = color; return n })
    setPickingSlot(null)
  }, [pickingSlot])

  const handleReplaceColorChange = useCallback((slot, value) => {
    setReplaceColors(prev => { const n = [...prev]; n[slot] = value; return n })
  }, [])

  const handleColorReplace = useCallback((from, to) => {
    const f = hexToRgb(from), t = hexToRgb(to)
    pushUndo()
    const ctx = skinCanvas.getContext('2d')
    const img = ctx.getImageData(0, 0, 64, 64)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] === f.r && d[i+1] === f.g && d[i+2] === f.b && d[i+3] > 0) {
        d[i] = t.r; d[i+1] = t.g; d[i+2] = t.b
      }
    }
    ctx.putImageData(img, 0, 0)
    setSkinVersion(v => v + 1)
  }, [skinCanvas, pushUndo])

  const [viewerWidth, setViewerWidth] = useState(420)
  const [isDraggingViewer, setIsDraggingViewer] = useState(false)

  const handleResizeStart = useCallback((e) => {
    e.preventDefault()
    let lastX = e.clientX
    setIsDraggingViewer(true)
    document.body.classList.add('resizing-viewer')

    const onMove = (e) => {
      const delta = e.clientX - lastX
      lastX = e.clientX
      setViewerWidth(w => Math.max(180, Math.min(700, w + delta)))
    }
    const onUp = () => {
      setIsDraggingViewer(false)
      document.body.classList.remove('resizing-viewer')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  const [guideTip, setGuideTip] = useState(null)
  const showGuideTip = useCallback((e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setGuideTip({ text, left: rect.left + rect.width / 2, bottom: window.innerHeight - rect.top + 6 })
  }, [])
  const hideGuideTip = useCallback(() => setGuideTip(null), [])

  return (
    <>
    <div className="app">
      <header className="mc-header">
        <img src="/favicon-32.png" alt="logo" className="mc-logo" />
        <h1 className="mc-title">SkinForge</h1>
        <nav className="mc-nav">
          <div className="mc-menu-item" ref={fileMenuRef}>
            <button
              className={`mc-menu-btn ${fileMenuOpen ? 'active' : ''}`}
              onClick={() => setFileMenuOpen((v) => !v)}
            >파일</button>
            {fileMenuOpen && (
              <div className="mc-dropdown">
                <label className="mc-dropdown-item">
                  불러오기
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                  />
                </label>
                <button
                  className="mc-dropdown-item"
                  onClick={() => { handleDownload(); setFileMenuOpen(false) }}
                >내보내기</button>
              </div>
            )}
          </div>
          <div className="mc-menu-item" ref={colorMenuRef}>
            <button
              className={`mc-menu-btn ${colorMenuOpen ? 'active' : ''}`}
              onClick={() => setColorMenuOpen(v => !v)}
            >색상</button>
            {colorMenuOpen && (
              <div className="mc-dropdown">
                <button
                  className="mc-dropdown-item"
                  onClick={() => { setColorReplaceOpen(true); setColorMenuOpen(false) }}
                >
                  <span>색상 변경</span>
                  <span className="mc-dropdown-shortcut">{MOD}{SHIFT}R</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      <div className="workspace">
        <div className="viewer-panel" style={{ width: viewerWidth }}>
          <SkinViewer3D skinCanvas={skinCanvas} skinVersion={skinVersion} />
        </div>
        <div
          className={`resize-handle ${isDraggingViewer ? 'dragging' : ''}`}
          onMouseDown={handleResizeStart}
        />
        <div className="canvas-area">
          <PixelEditor
            skinCanvas={skinCanvas}
            skinVersion={skinVersion}
            onPixelChange={handlePixelChange}
            onBeforeEdit={pushUndo}
            activeTool={activeTool}
            activeColor={activeColor}
            onColorPicked={handleColorPicked}
            brushSize={brushSize}
            brushShape={brushShape}
            skinType={skinType}
            showGuide={showGuide}
            selection={selection}
            onSelectionChange={setSelection}
            contiguous={contiguous}
            modalPickingSlot={pickingSlot}
            onModalColorPick={handleModalColorPick}
          />
          <div className="guide-bar">
            <div className="guide-group">
              <span className="guide-bar-label">가이드</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showGuide}
                  onChange={(e) => setShowGuide(e.target.checked)}
                />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
              </label>
            </div>
            <div className="guide-divider" />
            <div className="guide-group">
              <span className={`guide-type-label ${skinType === 'normal' ? 'active' : ''}`}>노말</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={skinType === 'slim'}
                  onChange={(e) => setSkinType(e.target.checked ? 'slim' : 'normal')}
                />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
              </label>
              <span className={`guide-type-label ${skinType === 'slim' ? 'active' : ''}`}>슬림</span>
            </div>
            <div className="guide-bar-sep" />
            <div className="guide-group">
              <button
                className="mc-btn guide-bar-btn"
                onClick={undo}
                disabled={!canUndo}
                onMouseEnter={(e) => showGuideTip(e, `뒤로가기 : ${MOD}Z`)}
                onMouseLeave={hideGuideTip}
              >↩</button>
              <button
                className="mc-btn guide-bar-btn"
                onClick={redo}
                disabled={!canRedo}
                onMouseEnter={(e) => showGuideTip(e, `앞으로가기 : ${REDO_KEY}`)}
                onMouseLeave={hideGuideTip}
              >↪</button>
            </div>
            {guideTip && (
              <div className="js-tooltip guide-bar-tip" style={{ left: guideTip.left, bottom: guideTip.bottom }}>
                {guideTip.text}
              </div>
            )}
          </div>
        </div>
        <div className="side-panel">
          <ToolPanel
            activeTool={activeTool}
            onToolChange={setActiveTool}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            brushShape={brushShape}
            onBrushShapeChange={setBrushShape}
            contiguous={contiguous}
            onContiguousChange={setContiguous}
            hasSelection={selection !== null}
            onClearSelection={() => setSelection(null)}
          />
          <ColorPanel
            color={activeColor}
            onChange={setActiveColor}
            skinCanvas={skinCanvas}
            skinVersion={skinVersion}
            uploadCount={uploadCount}
            historyPalette={historyPalette}
            onHistoryAdd={addToHistory}
            onPinToggle={handlePinToggle}
          />
        </div>
      </div>
    </div>
    {colorReplaceOpen && (
      <ColorReplacePanel
        colors={replaceColors}
        pickingSlot={pickingSlot}
        onEyedropper={handlePickStart}
        onColorChange={handleReplaceColorChange}
        onApply={handleColorReplace}
        onClose={() => { setColorReplaceOpen(false); setPickingSlot(null) }}
      />
    )}
    </>
  )
}
