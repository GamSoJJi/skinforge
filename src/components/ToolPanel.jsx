import { useState, useCallback } from 'react'

const MERGE_TOOLS = new Set(['rect-select', 'magic-wand'])

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
       fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
    <path d="M14 3 L16 5 L6 15 L2.5 15.5 L3 12 Z" />
  </svg>
)
const EraserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
       fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
    <path d="M2 12 L5 5 L16 5 L13 12 Z" />
    <line x1="1" y1="15.5" x2="17" y2="15.5" />
    <line x1="10" y1="5" x2="7" y2="12" strokeWidth="2" />
  </svg>
)
const FillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
       fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
    <path d="M6.5 5.5 Q9 1.5 11.5 5.5" />
    <path d="M3 5.5 L4.5 15 L13.5 15 L15 5.5 Z" />
    <path d="M13.5 15 Q15.5 17 13.5 17.5" />
  </svg>
)
const EyedropperIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
       fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
    <line x1="5" y1="13" x2="13" y2="5" strokeWidth="3" />
    <circle cx="14.5" cy="3.5" r="2.5" />
    <path d="M3.5 14.5 L5 13 L6 14.5" strokeWidth="2" />
    <circle cx="2.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)
const SelectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
       fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
    <rect x="1.5" y="1.5" width="15" height="15" rx="2" strokeDasharray="4 3" />
  </svg>
)
const WandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
       fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
    <line x1="3.5" y1="14.5" x2="10" y2="8" strokeWidth="3" />
    <path d="M12 2 L13.2 3.8 L15 5 L13.2 6.2 L12 8 L10.8 6.2 L9 5 L10.8 3.8 Z" fill="currentColor" stroke="none" />
    <line x1="16" y1="2" x2="17" y2="1" strokeWidth="2" />
    <line x1="17" y1="5.5" x2="17.5" y2="5" strokeWidth="2" />
    <line x1="14.5" y1="0.5" x2="14.5" y2="1.5" strokeWidth="2" />
  </svg>
)

const TOOLS = [
  { id: 'pen',         label: '브러쉬',   icon: <PenIcon />,        shortcut: 'B' },
  { id: 'eraser',      label: '지우개',   icon: <EraserIcon />,     shortcut: 'E' },
  { id: 'fill',        label: '채우기',   icon: <FillIcon />,       shortcut: 'G' },
  { id: 'eyedropper',  label: '스포이드', icon: <EyedropperIcon />, shortcut: 'I' },
  null,
  { id: 'rect-select', label: '사각선택', icon: <SelectionIcon />,  shortcut: 'M' },
  { id: 'magic-wand',  label: '마법봉',   icon: <WandIcon />,       shortcut: null },
]

export default function ToolPanel({ activeTool, onToolChange, mergeMode, pickingActive }) {
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
              className={`toolbar-btn${activeTool === tool.id && !(mergeMode && !MERGE_TOOLS.has(tool.id)) && !pickingActive ? ' active' : ''}`}
              disabled={(mergeMode && !MERGE_TOOLS.has(tool.id)) || pickingActive}
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
