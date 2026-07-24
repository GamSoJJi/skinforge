import { useState, useCallback } from 'react'
import { Pencil, Eraser, PaintBucket, Pipette, Replace, SquareDashed, Wand2, Shirt } from 'lucide-react'

const MERGE_TOOLS = new Set(['rect-select', 'magic-wand', 'merge'])

const ICON_PROPS = { size: 18, strokeWidth: 2 }

const TOOLS = [
  { id: 'pen',           label: '브러쉬',   icon: <Pencil {...ICON_PROPS} />,        shortcut: 'B' },
  { id: 'eraser',        label: '지우개',   icon: <Eraser {...ICON_PROPS} />,         shortcut: 'E' },
  { id: 'fill',          label: '채우기',   icon: <PaintBucket {...ICON_PROPS} />,    shortcut: 'G' },
  { id: 'eyedropper',    label: '스포이드', icon: <Pipette {...ICON_PROPS} />,        shortcut: 'I' },
  { id: 'color-replace', label: '색 교체',  icon: <Replace {...ICON_PROPS} />,        shortcut: 'R' },
  null,
  { id: 'rect-select',   label: '사각선택', icon: <SquareDashed {...ICON_PROPS} />,   shortcut: 'M' },
  { id: 'magic-wand',    label: '마법봉',   icon: <Wand2 {...ICON_PROPS} />,          shortcut: 'W' },
  null,
  { id: 'merge',         label: '옷입히기', icon: <Shirt {...ICON_PROPS} />,          shortcut: null },
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
              className={`toolbar-btn${
                (tool.id === 'merge' ? mergeMode : activeTool === tool.id && !(mergeMode && !MERGE_TOOLS.has(tool.id)) && !pickingActive)
                  ? ' active' : ''}`}
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
