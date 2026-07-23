import { useState, useCallback } from 'react'

const SEL_MODES = [
  { id: 'replace', label: '교체', icon: '⬚', desc: '매번 새로 선택', shortcut: null },
  { id: 'union',   label: '합집합', icon: '⊕', desc: '기존 선택에 추가', shortcut: 'Shift' },
  { id: 'diff',    label: '차집합', icon: '⊖', desc: '기존 선택에서 제거', shortcut: 'Alt' },
]

const MERGE_TOOLS = new Set(['rect-select', 'magic-wand'])

export default function ToolPanel({
  activeTool, onToolChange,
  brushSize, onBrushSizeChange,
  brushShape, onBrushShapeChange,
  contiguous, onContiguousChange,
  selMode, onSelModeChange, effectiveSelMode,
  hasSelection, onClearSelection,
  mergeMode,
}) {
  const [tip, setTip] = useState(null)

  const showTip = useCallback((e, text) => {
    if (!text) return
    const rect = e.currentTarget.getBoundingClientRect()
    setTip({ text, right: window.innerWidth - rect.left + 6, top: rect.top + rect.height / 2 })
  }, [])

  const hideTip = useCallback(() => setTip(null), [])

  const PenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
         fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5 L10.5 4 L3.5 11 L1 11 L1 8.5 Z" />
      <path d="M6.5 3 L9 5.5" />
    </svg>
  )
  const EraserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
         fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3" width="9" height="6" rx="1" />
      <path d="M6 3 L6 9" strokeWidth="0.8" strokeDasharray="1.5 1" />
    </svg>
  )
  const FillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
         fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 2 L7 6.5 Q8 7.5 7 8.5 L5.5 10 Q4.5 11 3.5 10 L2 8.5 Q1 7.5 2 6.5 Z" />
      <path d="M7 6.5 L9.5 4 L8 2.5" />
      <circle cx="10" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
  const EyedropperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
         fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="3.5" />
      <path d="M7.5 7.5 L11 11" strokeWidth="1.6" />
    </svg>
  )
  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
         fill="currentColor">
      <path d="M6 1 L6.7 5.3 L11 6 L6.7 6.7 L6 11 L5.3 6.7 L1 6 L5.3 5.3 Z" />
    </svg>
  )

  const tools = [
    { id: 'pen',         label: '브러쉬',  icon: <PenIcon />,        shortcut: 'B' },
    { id: 'eraser',      label: '지우개',  icon: <EraserIcon />,     shortcut: 'E' },
    { id: 'fill',        label: '채우기',  icon: <FillIcon />,       shortcut: 'G' },
    { id: 'eyedropper',  label: '스포이드', icon: <EyedropperIcon />, shortcut: 'I' },
    { id: 'rect-select', label: '사각선택', icon: '⬚',               shortcut: 'M' },
    { id: 'magic-wand',  label: '마법봉',  icon: <StarIcon />,       shortcut: null },
  ]

  const showBrush = (activeTool === 'pen' || activeTool === 'eraser') && !mergeMode
  const showWandOptions = activeTool === 'magic-wand'
  const showSelMode = activeTool === 'rect-select' || activeTool === 'magic-wand'

  const handleSizeKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onBrushSizeChange(Math.max(1, brushSize - 1))
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onBrushSizeChange(Math.min(16, brushSize + 1))
    }
  }

  return (
    <div className="tool-panel">
      <div className="panel-label">Tools</div>
      <div className="tool-grid">
        {tools.map((tool) => {
          const mergeDisabled = mergeMode && !MERGE_TOOLS.has(tool.id)
          return (
            <button
              key={tool.id}
              className={`mc-btn tool-btn ${activeTool === tool.id && !mergeDisabled ? 'active' : ''}`}
              disabled={mergeDisabled}
              onClick={() => onToolChange(tool.id)}
              onMouseEnter={(e) => showTip(e,
                mergeDisabled
                  ? '× 옷입히기 모드 비활성'
                  : (tool.shortcut ? `${tool.label} : ${tool.shortcut}` : tool.label)
              )}
              onMouseLeave={hideTip}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-label">{tool.label}</span>
            </button>
          )
        })}
      </div>

      {showBrush && (
        <div className="brush-settings">
          <div className="panel-label">Brush</div>
          <div className="brush-row">
            <span className="setting-label">Size</span>
            <button
              className="mc-btn size-arrow"
              onClick={() => onBrushSizeChange(Math.max(1, brushSize - 1))}
              onMouseEnter={(e) => showTip(e, '크기 감소 : [')}
              onMouseLeave={hideTip}
            >‹</button>
            <input
              type="number"
              className="mc-input size-input"
              min={1}
              max={16}
              value={brushSize}
              onChange={(e) => {
                const v = parseInt(e.target.value)
                if (!isNaN(v)) onBrushSizeChange(Math.max(1, Math.min(16, v)))
              }}
              onKeyDown={handleSizeKeyDown}
            />
            <button
              className="mc-btn size-arrow"
              onClick={() => onBrushSizeChange(Math.min(16, brushSize + 1))}
              onMouseEnter={(e) => showTip(e, '크기 증가 : ]')}
              onMouseLeave={hideTip}
            >›</button>
          </div>
          <div className="brush-row">
            <span className="setting-label">Shape</span>
            <div className="shape-btns">
              <button
                className={`mc-btn shape-btn ${brushShape === 'square' ? 'active' : ''}`}
                onClick={() => onBrushShapeChange('square')}
                title="Square"
              >■</button>
              <button
                className={`mc-btn shape-btn ${brushShape === 'circle' ? 'active' : ''}`}
                onClick={() => onBrushShapeChange('circle')}
                title="Round"
              >●</button>
            </div>
          </div>
          <div className="brush-preview-wrap">
            <div
              className="brush-preview"
              style={{
                width: Math.min(brushSize * 5, 44),
                height: Math.min(brushSize * 5, 44),
                borderRadius: brushShape === 'circle' ? '50%' : '2px',
              }}
            />
          </div>
        </div>
      )}

      {showWandOptions && (
        <div className="wand-settings">
          <div className="panel-label">Magic Wand</div>
          <label className="wand-option">
            <input
              type="checkbox"
              checked={contiguous}
              onChange={(e) => onContiguousChange(e.target.checked)}
            />
            <span>근접</span>
          </label>
        </div>
      )}

      {showSelMode && (
        <div className="sel-mode-settings">
          <div className="panel-label">Selection</div>
          <div className="sel-mode-btns">
            {SEL_MODES.map((m) => (
              <button
                key={m.id}
                className={`mc-btn sel-mode-btn ${effectiveSelMode === m.id ? 'active' : ''}`}
                onClick={() => onSelModeChange(m.id)}
                onMouseEnter={(e) => showTip(e,
                  m.shortcut ? `${m.label} — ${m.desc} : ${m.shortcut}` : `${m.label} — ${m.desc}`
                )}
                onMouseLeave={hideTip}
              >
                <span className="sel-mode-icon">{m.icon}</span>
                <span className="sel-mode-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasSelection && (
        <div className="selection-info">
          <button className="mc-btn sel-clear-btn" onClick={onClearSelection}>
            ✕ 선택해제
          </button>
        </div>
      )}

      {tip && (
        <div className="js-tooltip" style={{ right: tip.right, top: tip.top }}>
          {tip.text}
        </div>
      )}
    </div>
  )
}
