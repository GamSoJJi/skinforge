import { useState, useCallback } from 'react'

const MERGE_TOOLS = new Set(['rect-select', 'magic-wand'])

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12"
       fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1.5 L10.5 4 L3.5 11 L1 11 L1 8.5 Z" />
    <path d="M6.5 3 L9 5.5" />
  </svg>
)
const EraserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12"
       fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="3" width="9" height="6" rx="0" />
    <path d="M6 3 L6 9" strokeWidth="0.8" strokeDasharray="1.5 1" />
  </svg>
)
const FillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12"
       fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 2 L7 6.5 Q8 7.5 7 8.5 L5.5 10 Q4.5 11 3.5 10 L2 8.5 Q1 7.5 2 6.5 Z" />
    <path d="M7 6.5 L9.5 4 L8 2.5" />
    <circle cx="10" cy="9.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const EyedropperIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12"
       fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="5" r="3.5" />
    <path d="M7.5 7.5 L11 11" strokeWidth="1.6" />
  </svg>
)
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 1 L6.7 5.3 L11 6 L6.7 6.7 L6 11 L5.3 6.7 L1 6 L5.3 5.3 Z" />
  </svg>
)

const TOOLS = [
  { id: 'pen',         label: '브러쉬',   icon: <PenIcon />,        shortcut: 'B' },
  { id: 'eraser',      label: '지우개',   icon: <EraserIcon />,     shortcut: 'E' },
  { id: 'fill',        label: '채우기',   icon: <FillIcon />,       shortcut: 'G' },
  { id: 'eyedropper',  label: '스포이드', icon: <EyedropperIcon />, shortcut: 'I' },
  null,
  { id: 'rect-select', label: '사각선택', icon: '⬚',               shortcut: 'M' },
  { id: 'magic-wand',  label: '마법봉',  icon: <StarIcon />,       shortcut: null },
]

export default function ToolPanel({ activeTool, onToolChange, mergeMode }) {
  const [tip, setTip] = useState(null)

  const showTip = useCallback((e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTip({ text, left: rect.right + 8, top: rect.top + rect.height / 2 })
  }, [])
  const hideTip = useCallback(() => setTip(null), [])

  return (
    <aside className="ps-toolbar">
      {TOOLS.map((tool, i) =>
        tool === null
          ? <div key={`sep-${i}`} className="toolbar-sep" />
          : (
            <button
              key={tool.id}
              className={`toolbar-btn${activeTool === tool.id && !(mergeMode && !MERGE_TOOLS.has(tool.id)) ? ' active' : ''}`}
              disabled={mergeMode && !MERGE_TOOLS.has(tool.id)}
              onClick={() => onToolChange(tool.id)}
              onMouseEnter={(e) => showTip(e, tool.shortcut ? `${tool.label}  ${tool.shortcut}` : tool.label)}
              onMouseLeave={hideTip}
            >
              {tool.icon}
            </button>
          )
      )}
      {tip && (
        <div className="js-tooltip" style={{ position: 'fixed', left: tip.left, top: tip.top, transform: 'translateY(-50%)' }}>
          {tip.text}
        </div>
      )}
    </aside>
  )
}
