import { useCallback, useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Sun, Moon, Square, Circle, FolderOpen, Download, Undo2, Redo2, MessageSquare } from 'lucide-react'
const SkinViewer3D = lazy(() => import('./components/SkinViewer3D'))
import PixelEditor from './components/PixelEditor'
import ToolPanel from './components/ToolPanel'
import ColorPanel from './components/ColorPanel'
import SkinMergeModal from './components/SkinMergeModal'
import TipBanner from './components/TipBanner'
import { inferModelType } from 'skinview-utils'
import { useLang } from './i18n/LangContext.jsx'
import './App.css'

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return { h: h * 60, s, l }
}

function hslToRgb({ h, s, l }) {
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v } }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h / 360) * 255),
    b: Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255),
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
  const { lang, t, setLang } = useLang()
  const [skinCanvas] = useState(() => new OffscreenCanvas(64, 64))
  const [skinVersion, setSkinVersion] = useState(0)
  const [activeTool, setActiveTool] = useState('pen')
  const [activeColor, setActiveColor] = useState('#cc8844')
  const [brushSize, setBrushSize] = useState(1)
  const [brushShape, setBrushShape] = useState('square')
  const [skinType, setSkinType] = useState('normal')
  const [selection, setSelection] = useState(null)
  const selectionRef = useRef(null)
  selectionRef.current = selection
  const [contiguous, setContiguous] = useState(true)
  const [selMode, setSelMode] = useState('replace')
  const [shiftHeld, setShiftHeld] = useState(false)
  const [altHeld, setAltHeld] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [mergeOpen, setMergeOpen] = useState(false)
  const [mergedPreview, setMergedPreview] = useState(null)
  const [mergeVersion, setMergeVersion] = useState(0)
  const [mergeHasSel, setMergeHasSel] = useState(false)
  const clearMergeSelRef = useRef(null)
  const [historyPalette, setHistoryPalette] = useState(
    () => DEFAULT_PALETTE.map(c => ({ color: c, pinned: false }))
  )

  const fileInputRef = useRef(null)
  const activeColorRef = useRef(activeColor)
  const activeToolRef = useRef(activeTool)
  activeColorRef.current = activeColor
  activeToolRef.current = activeTool

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    document.title = lang === 'ko'
      ? 'MC스킨따오기 — 마인크래프트 스킨 에디터'
      : 'MCSkinPluck — Minecraft Skin Editor'
  }, [lang])


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
    undoStack.current.push({ imageData: snapshot, selection: selectionRef.current })
    if (undoStack.current.length > 50) undoStack.current.shift()
    redoStack.current = []
    setCanUndo(true)
    setCanRedo(false)
  }, [skinCanvas])

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return
    const ctx = skinCanvas.getContext('2d')
    redoStack.current.push({ imageData: ctx.getImageData(0, 0, 64, 64), selection: selectionRef.current })
    const { imageData, selection } = undoStack.current.pop()
    ctx.putImageData(imageData, 0, 0)
    setSelection(selection)
    setSkinVersion((v) => v + 1)
    setCanUndo(undoStack.current.length > 0)
    setCanRedo(true)
  }, [skinCanvas])

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return
    const ctx = skinCanvas.getContext('2d')
    undoStack.current.push({ imageData: ctx.getImageData(0, 0, 64, 64), selection: selectionRef.current })
    const { imageData, selection } = redoStack.current.pop()
    ctx.putImageData(imageData, 0, 0)
    setSelection(selection)
    setSkinVersion((v) => v + 1)
    setCanUndo(true)
    setCanRedo(redoStack.current.length > 0)
  }, [skinCanvas])

  const handleSelectionChange = useCallback((newSel) => {
    pushUndo()
    setSelection(newSel)
  }, [pushUndo])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') setShiftHeld(true)
      if (e.code === 'AltLeft'   || e.code === 'AltRight')   setAltHeld(true)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault(); undo()
      }
      if ((e.metaKey || e.ctrlKey) && (e.code === 'KeyY' || (e.code === 'KeyZ' && e.shiftKey))) {
        e.preventDefault(); redo()
      }
      if (e.key === 'Escape') {
        if (selectionRef.current !== null) handleSelectionChange(null); return
      }
      if (document.activeElement?.tagName === 'INPUT') return
      if (e.code === 'KeyB') setActiveTool('pen')
      if (e.code === 'KeyE') setActiveTool('eraser')
      if (e.code === 'KeyG') setActiveTool('fill')
      if (e.code === 'KeyI') setActiveTool('eyedropper')
      if (e.code === 'KeyR') setActiveTool('color-replace')
      if (e.code === 'KeyM') setActiveTool('rect-select')
      if (e.code === 'KeyW') setActiveTool('magic-wand')
      if (e.code === 'BracketLeft' || e.code === 'BracketRight') {
        const t = activeToolRef.current
        const dec = e.code === 'BracketLeft'
        if (t === 'pen' || t === 'eraser')
          setBrushSize((s) => Math.max(1, Math.min(16, s + (dec ? -1 : 1))))
        else if (t === 'magic-wand')
          setWandTolerance((s) => Math.max(0, Math.min(255, s + (dec ? -5 : 5))))
      }
    }
    const onKeyUp = (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') setShiftHeld(false)
      if (e.code === 'AltLeft'   || e.code === 'AltRight')   setAltHeld(false)
    }
    const onBlur = () => { setShiftHeld(false); setAltHeld(false) }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
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
        setSkinType(inferModelType(skinCanvas) === 'slim' ? 'slim' : 'normal')
      }
      img.src = evt.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [skinCanvas])

  const handleDownload = useCallback(() => {
    skinCanvas.convertToBlob({ type: 'image/png' }).then((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'my_skin.png'; a.click()
      URL.revokeObjectURL(url)
    })
  }, [skinCanvas])

  const handleMergeApply = useCallback((mergedCanvas) => {
    pushUndo()
    const ctx = skinCanvas.getContext('2d')
    ctx.clearRect(0, 0, 64, 64)
    ctx.drawImage(mergedCanvas, 0, 0)
    setSkinVersion((v) => v + 1)
    setMergeOpen(false)
    setMergedPreview(null)
    setMergeHasSel(false)
  }, [skinCanvas, pushUndo])

  const handleMergedChange = useCallback((canvas) => {
    setMergedPreview(canvas)
    setMergeVersion(v => v + 1)
  }, [])

  const handleColorPicked = useCallback((color) => {
    setActiveColor(color)
    setActiveTool('pen')
  }, [])

  const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform)
  const MOD = isMac ? '⌘' : 'Ctrl+'
  const SHIFT = isMac ? '⇧' : 'Shift+'
  const REDO_KEY = isMac ? `${MOD}${SHIFT}Z` : `${MOD}Y`

  const [showGuide, setShowGuide] = useState(true)
  // ─── Color Replace / Shade Remap ───────────────────────
  const [wandTolerance, setWandTolerance] = useState(0)
  const [colorReplaceMode, setColorReplaceMode] = useState('single')
  const [shadeToleranceMinus, setShadeToleranceMinus] = useState(30)
  const [shadeTolerancePlus, setShadeTolerancePlus] = useState(30)
  const [shadeLTolerance, setShadeLTolerance] = useState(50)

  const handleColorReplace = useCallback((from, to, sel) => {
    const f = hexToRgb(from), t = hexToRgb(to)
    pushUndo()
    const ctx = skinCanvas.getContext('2d')
    const img = ctx.getImageData(0, 0, 64, 64)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      if (sel && !sel.has(i / 4)) continue
      if (d[i] === f.r && d[i+1] === f.g && d[i+2] === f.b && d[i+3] > 0) {
        d[i] = t.r; d[i+1] = t.g; d[i+2] = t.b
      }
    }
    ctx.putImageData(img, 0, 0)
    setSkinVersion(v => v + 1)
  }, [skinCanvas, pushUndo])

  const handleShadeRemap = useCallback((sourceHex, targetHex, tolMinus, tolPlus, tolL, sel) => {
    const srcHsl = rgbToHsl(hexToRgb(sourceHex))
    const tgtHsl = rgbToHsl(hexToRgb(targetHex))
    const lOffset = tgtHsl.l - srcHsl.l
    pushUndo()
    const ctx = skinCanvas.getContext('2d')
    const img = ctx.getImageData(0, 0, 64, 64)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      if (sel && !sel.has(i / 4)) continue
      if (d[i + 3] === 0) continue
      const pHsl = rgbToHsl({ r: d[i], g: d[i + 1], b: d[i + 2] })
      if (Math.abs(pHsl.l - srcHsl.l) * 100 > tolL) continue
      let delta = pHsl.h - srcHsl.h
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360
      if (delta >= -tolMinus && delta <= tolPlus) {
        const newL = Math.max(0, Math.min(1, pHsl.l + lOffset))
        const { r, g, b } = hslToRgb({ h: tgtHsl.h, s: tgtHsl.s, l: newL })
        d[i] = r; d[i + 1] = g; d[i + 2] = b
      }
    }
    ctx.putImageData(img, 0, 0)
    setSkinVersion(v => v + 1)
  }, [skinCanvas, pushUndo])

  const handleToolColorReplace = useCallback((fromColor) => {
    if (colorReplaceMode === 'single') {
      handleColorReplace(fromColor, activeColor, selection || undefined)
    } else {
      handleShadeRemap(fromColor, activeColor, shadeToleranceMinus, shadeTolerancePlus, shadeLTolerance, selection || undefined)
    }
  }, [colorReplaceMode, handleColorReplace, handleShadeRemap, activeColor, selection, shadeToleranceMinus, shadeTolerancePlus, shadeLTolerance])

  const SEL_MODES = [
    { id: 'replace', label: t.opts.selReplace, icon: '⬚', shortcut: null },
    { id: 'union',   label: t.opts.selUnion,   icon: '⊕', shortcut: 'Shift' },
    { id: 'diff',    label: t.opts.selDiff,    icon: '⊖', shortcut: 'Alt' },
  ]

  const [optTip, setOptTip] = useState(null)
  const showOptTip = useCallback((e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setOptTip({ text, left: rect.left + rect.width / 2, top: rect.bottom + 6, above: false })
  }, [])
  const hideOptTip = useCallback(() => setOptTip(null), [])

  const [rightWidth, setRightWidth] = useState(240)
  const [viewerH, setViewerH] = useState(210)
  const [isRightResizing, setIsRightResizing] = useState(false)

  const handleRightResizeStart = useCallback((e) => {
    e.preventDefault()
    let lastX = e.clientX
    setIsRightResizing(true)
    document.body.classList.add('resizing-viewer')
    const onMove = (e) => {
      const delta = lastX - e.clientX
      lastX = e.clientX
      setRightWidth(w => Math.max(180, Math.min(500, w + delta)))
    }
    const onUp = () => {
      setIsRightResizing(false)
      document.body.classList.remove('resizing-viewer')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  const handleViewerHResizeStart = useCallback((e) => {
    e.preventDefault()
    let lastY = e.clientY
    document.body.classList.add('resizing-row')
    const onMove = (e) => {
      const delta = e.clientY - lastY
      lastY = e.clientY
      setViewerH(h => Math.max(80, Math.min(window.innerHeight - 160, h + delta)))
    }
    const onUp = () => {
      document.body.classList.remove('resizing-row')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  const effectiveSelMode = shiftHeld ? 'union' : altHeld ? 'diff' : selMode
  const handleToolChange = useCallback((toolId) => {
    if (toolId === 'merge') {
      setMergeOpen(v => {
        if (!v) setActiveTool('rect-select')
        return !v
      })
    } else {
      setActiveTool(toolId)
    }
  }, [])

  const showBrushOpts = !mergeOpen && (activeTool === 'pen' || activeTool === 'eraser')
  const showSelOpts = activeTool === 'rect-select' || activeTool === 'magic-wand'
  const showColorReplaceOpts = !mergeOpen && activeTool === 'color-replace'
  const hasSelectionActive = mergeOpen ? mergeHasSel : selection !== null

  return (
    <>
    <div className="app">

      {/* ── Menu Bar ── */}
      <header className="ps-menubar">
        <img src="/favicon-32.png" alt="logo" className="mc-logo" />
        <h1 className={`mc-title${lang === 'ko' ? ' mc-title-ko' : ''}`}>
          {lang === 'ko' ? 'MC스킨따오기' : 'MCSkinPluck'}
        </h1>
        <div className="lang-toggle">
          <button className={`lang-btn${lang === 'ko' ? ' active' : ''}`} onClick={() => setLang('ko')} data-tip="한국어">KO</button>
          <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')} data-tip="English">EN</button>
        </div>
        <a
          className="theme-btn"
          href="https://docs.google.com/forms/d/e/1FAIpQLSdcUsndHmB_y6NLjLuKH7QKMkaklh4SAHyDIN1J3IpApGL9jg/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          data-tip={lang === 'ko' ? '피드백 보내기' : 'Send feedback'}
        >
          <MessageSquare size={16} strokeWidth={1.5} />
        </a>
        <button className="theme-btn" onClick={() => setDarkMode(v => !v)} data-tip={darkMode ? t.opts.lightMode : t.opts.darkMode}>
          {darkMode ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
        </button>
      </header>

      {/* ── Tool Options Bar ── */}
      <div className="ps-options-bar">
        {showBrushOpts && (
          <div className="opt-group">
            <span className="opt-label">{t.opts.size}</span>
            <button className="mc-btn opt-btn" onClick={() => setBrushSize(s => Math.max(1, s - 1))}
              onMouseEnter={(e) => showOptTip(e, `${t.opts.sizeDown}  [`)} onMouseLeave={hideOptTip}>‹</button>
            <input type="number" className="mc-input opt-input" min={1} max={16} value={brushSize}
              onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setBrushSize(Math.max(1, Math.min(16, v))) }} />
            <button className="mc-btn opt-btn" onClick={() => setBrushSize(s => Math.min(16, s + 1))}
              onMouseEnter={(e) => showOptTip(e, `${t.opts.sizeUp}  ]`)} onMouseLeave={hideOptTip}>›</button>
            <div className="opt-divider" />
            <span className="opt-label">{t.opts.shape}</span>
            <button className={`mc-btn opt-btn${brushShape === 'square' ? ' active' : ''}`} onClick={() => setBrushShape('square')}>
              <Square size={10} strokeWidth={0} fill="currentColor" />
            </button>
            <button className={`mc-btn opt-btn${brushShape === 'circle' ? ' active' : ''}`} onClick={() => setBrushShape('circle')}>
              <Circle size={10} strokeWidth={0} fill="currentColor" />
            </button>
          </div>
        )}
        {showColorReplaceOpts && (
          <div className="opt-group">
            <button className={`mc-btn opt-btn${colorReplaceMode === 'single' ? ' active' : ''}`}
              onClick={() => setColorReplaceMode('single')}
              onMouseEnter={(e) => showOptTip(e, t.opts.solidMode)} onMouseLeave={hideOptTip}>{t.opts.solid}</button>
            <button className={`mc-btn opt-btn${colorReplaceMode === 'shade' ? ' active' : ''}`}
              onClick={() => setColorReplaceMode('shade')}
              onMouseEnter={(e) => showOptTip(e, t.opts.shadeMode)} onMouseLeave={hideOptTip}>{t.opts.shade}</button>
            {colorReplaceMode === 'shade' && (
              <>
                <div className="opt-divider" />
                <span className="opt-label">{t.opts.hue}</span>
                <span className="opt-shade-prefix">−</span>
                <input type="number" min={0} max={90}
                  value={shadeToleranceMinus}
                  onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setShadeToleranceMinus(Math.max(0, Math.min(90, v))) }}
                  onBlur={() => setShadeToleranceMinus(v => Math.max(0, Math.min(90, v)))}
                  className="mc-input opt-shade-num" />
                <input type="range" min={0} max={90} step={5}
                  value={shadeToleranceMinus}
                  onChange={e => setShadeToleranceMinus(Number(e.target.value))}
                  className="opt-shade-slider" />
                <span className="opt-shade-prefix" style={{ marginLeft: '6px' }}>+</span>
                <input type="number" min={0} max={90}
                  value={shadeTolerancePlus}
                  onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setShadeTolerancePlus(Math.max(0, Math.min(90, v))) }}
                  onBlur={() => setShadeTolerancePlus(v => Math.max(0, Math.min(90, v)))}
                  className="mc-input opt-shade-num" />
                <input type="range" min={0} max={90} step={5}
                  value={shadeTolerancePlus}
                  onChange={e => setShadeTolerancePlus(Number(e.target.value))}
                  className="opt-shade-slider" />
                <div className="opt-divider" />
                <span className="opt-label">{t.opts.lightness}</span>
                <span className="opt-shade-prefix">±</span>
                <input type="number" min={0} max={50}
                  value={shadeLTolerance}
                  onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setShadeLTolerance(Math.max(0, Math.min(50, v))) }}
                  onBlur={() => setShadeLTolerance(v => Math.max(0, Math.min(50, v)))}
                  className="mc-input opt-shade-num" />
                <input type="range" min={0} max={50} step={1}
                  value={shadeLTolerance}
                  onChange={e => setShadeLTolerance(Number(e.target.value))}
                  className="opt-shade-slider" />
              </>
            )}
          </div>
        )}
        {showSelOpts && (
          <div className="opt-group">
            <span className="opt-label">{t.opts.selection}</span>
            {SEL_MODES.map(m => (
              <button key={m.id}
                className={`mc-btn opt-btn${effectiveSelMode === m.id ? ' active' : ''}`}
                onClick={() => setSelMode(m.id)}
                onMouseEnter={(e) => showOptTip(e, m.shortcut ? `${m.label}  ${m.shortcut}` : m.label)}
                onMouseLeave={hideOptTip}
              >
                {m.icon}
              </button>
            ))}
            {activeTool === 'magic-wand' && (
              <>
                <div className="opt-divider" />
                <label className="opt-check">
                  <input type="checkbox" checked={contiguous} onChange={e => setContiguous(e.target.checked)} />
                  <span>{t.opts.contiguous}</span>
                </label>
                <div className="opt-divider" />
                <span className="opt-label">{t.opts.tolerance}</span>
                <button className="mc-btn opt-btn" onClick={() => setWandTolerance(v => Math.max(0, v - 5))}
                  onMouseEnter={(e) => showOptTip(e, t.opts.tolDown)} onMouseLeave={hideOptTip}>‹</button>
                <input type="number" className="mc-input opt-input" min={0} max={255} value={wandTolerance}
                  onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setWandTolerance(Math.max(0, Math.min(255, v))) }} />
                <button className="mc-btn opt-btn" onClick={() => setWandTolerance(v => Math.min(255, v + 5))}
                  onMouseEnter={(e) => showOptTip(e, t.opts.tolUp)} onMouseLeave={hideOptTip}>›</button>
              </>
            )}
            {hasSelectionActive && (
              <>
                <div className="opt-divider" />
                <button className="mc-btn opt-btn opt-clear" onClick={() => {
                  if (mergeOpen) clearMergeSelRef.current?.()
                  else handleSelectionChange(null)
                }}>{t.opts.selClear}</button>
              </>
            )}
            <div className="opt-divider" />
            <span className="opt-hint"><kbd>ESC</kbd> {t.opts.escHint}</span>
          </div>
        )}
        <div className="opt-file-actions">
          <button className="mc-btn opt-btn" onClick={undo} disabled={!canUndo}
            onMouseEnter={(e) => showOptTip(e, `${t.opts.undo}  ${MOD}Z`)} onMouseLeave={hideOptTip}>
            <Undo2 size={14} strokeWidth={2} />
          </button>
          <button className="mc-btn opt-btn" onClick={redo} disabled={!canRedo}
            onMouseEnter={(e) => showOptTip(e, `${t.opts.redo}  ${REDO_KEY}`)} onMouseLeave={hideOptTip}>
            <Redo2 size={14} strokeWidth={2} />
          </button>
          <div className="opt-divider" />
          <button className="mc-btn opt-btn" onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => showOptTip(e, t.opts.open)} onMouseLeave={hideOptTip}>
            <FolderOpen size={14} strokeWidth={2} />
          </button>
          <button className="mc-btn opt-btn" onClick={handleDownload}
            onMouseEnter={(e) => showOptTip(e, t.opts.export)} onMouseLeave={hideOptTip}>
            <Download size={14} strokeWidth={2} />
          </button>
          <input ref={fileInputRef} type="file" accept=".png" style={{ display: 'none' }} onChange={handleUpload} />
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <div className="ps-workspace">

        {/* Left vertical toolbar */}
        <ToolPanel
          activeTool={activeTool}
          onToolChange={handleToolChange}
          mergeMode={mergeOpen}
          pickingActive={false}
        />

        {/* Center canvas */}
        <div className="ps-canvas">
          {mergeOpen
            ? <SkinMergeModal
                onClose={() => { setMergeOpen(false); setMergedPreview(null); setMergeHasSel(false) }}
                onMerge={handleMergeApply}
                initialSkinA={skinCanvas}
                activeTool={activeTool}
                selMode={effectiveSelMode}
                contiguous={contiguous}
                onMergedChange={handleMergedChange}
                onHasSelChange={setMergeHasSel}
                clearSelRef={clearMergeSelRef}
              />
            : <>
                <PixelEditor
                  skinCanvas={skinCanvas}
                  skinVersion={skinVersion}
                  onPixelChange={handlePixelChange}
                  onBeforeEdit={pushUndo}
                  activeTool={activeTool}
                  activeColor={activeColor}
                  onColorPicked={handleColorPicked}
                  onColorReplace={handleToolColorReplace}
                  modalPickingSlot={null}
                  brushSize={brushSize}
                  brushShape={brushShape}
                  skinType={skinType}
                  showGuide={showGuide}
                  selection={selection}
                  onSelectionChange={handleSelectionChange}
                  contiguous={contiguous}
                  wandTolerance={wandTolerance}
                  selMode={selMode}
                  shadePreview={null}
                />
                <TipBanner />
              </>
          }
          <div className="ps-canvas-bar">
            <span className="opt-label">{t.opts.guide}</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={showGuide} onChange={e => setShowGuide(e.target.checked)} />
              <span className="toggle-track"><span className="toggle-thumb" /></span>
            </label>
            <div className="opt-divider" />
            <span className={`opt-label${skinType === 'normal' ? ' active' : ''}`}>{t.opts.normal}</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={skinType === 'slim'} onChange={e => setSkinType(e.target.checked ? 'slim' : 'normal')} />
              <span className="toggle-track"><span className="toggle-thumb" /></span>
            </label>
            <span className={`opt-label${skinType === 'slim' ? ' active' : ''}`}>{t.opts.slim}</span>
          </div>
        </div>

        {/* Right panel resize handle */}
        <div className={`resize-handle${isRightResizing ? ' dragging' : ''}`} onMouseDown={handleRightResizeStart} />

        {/* Right panel: 3D viewer + color */}
        <div className="ps-right-panel" style={{ width: rightWidth }}>
          <div className="ps-panel-section-header">Viewer</div>
          <div className="ps-viewer" style={{ height: viewerH }}>
            <Suspense fallback={<div className="viewer-loading" />}>
              <SkinViewer3D
                skinCanvas={mergeOpen && mergedPreview ? mergedPreview : skinCanvas}
                skinVersion={mergeOpen ? mergeVersion : skinVersion}
                skinType={skinType}
              />
            </Suspense>
          </div>
          <div className="ps-panel-resize" onMouseDown={handleViewerHResizeStart} />
          <div className="ps-panel-section-header">Color</div>
          <div className="ps-color-scroll">
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
    </div>

    {optTip && (
      <div className="js-tooltip" style={{ position: 'fixed', left: optTip.left, top: optTip.top, transform: optTip.above ? 'translateX(-50%) translateY(-100%)' : 'translateX(-50%)', zIndex: 9999 }}>
        {optTip.text}
      </div>
    )}

    </>
  )
}
