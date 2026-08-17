import { useState, useCallback } from 'react'
import { Pencil, Eraser, PaintBucket, Pipette, Replace, SquareDashed, Wand2, Shirt, FlipHorizontal2 } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'

const MERGE_TOOLS = new Set(['rect-select', 'magic-wand', 'merge'])
const ICON_PROPS = { size: 18, strokeWidth: 2 }

export default function ToolPanel({ activeTool, onToolChange, mergeMode, pickingActive }) {
  const { t } = useLang()
  const [tip, setTip] = useState(null)

  const TOOLS = [
    { id: 'pen',           label: t.tools.pen,          desc: t.toolDesc.pen,          icon: <Pencil {...ICON_PROPS} />,          shortcut: 'B' },
    { id: 'eraser',        label: t.tools.eraser,        desc: t.toolDesc.eraser,        icon: <Eraser {...ICON_PROPS} />,           shortcut: 'E' },
    { id: 'fill',          label: t.tools.fill,          desc: t.toolDesc.fill,          icon: <PaintBucket {...ICON_PROPS} />,      shortcut: 'G' },
    { id: 'eyedropper',    label: t.tools.eyedropper,    desc: t.toolDesc.eyedropper,    icon: <Pipette {...ICON_PROPS} />,          shortcut: 'I' },
    { id: 'color-replace', label: t.tools.colorReplace,  desc: t.toolDesc.colorReplace,  icon: <Replace {...ICON_PROPS} />,          shortcut: 'R' },
    null,
    { id: 'rect-select',   label: t.tools.rectSelect,    desc: t.toolDesc.rectSelect,    icon: <SquareDashed {...ICON_PROPS} />,     shortcut: 'M' },
    { id: 'magic-wand',    label: t.tools.magicWand,     desc: t.toolDesc.magicWand,     icon: <Wand2 {...ICON_PROPS} />,            shortcut: 'W' },
    null,
    { id: 'merge',         label: t.tools.merge,         desc: t.toolDesc.merge,         icon: <Shirt {...ICON_PROPS} />,            shortcut: null },
    null,
    { id: 'symmetry',      label: t.tools.symmetry,      desc: t.toolDesc.symmetry,      icon: <FlipHorizontal2 {...ICON_PROPS} />,  shortcut: null },
  ]

  const showTip = useCallback((e, tool) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTip({ tool, left: rect.right + 8, top: rect.top + rect.height / 2 })
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
              onMouseEnter={(e) => showTip(e, tool)}
              onMouseLeave={hideTip}
            >
              {tool.icon}
            </button>
          )
      )}
      {tip && (
        <div className="js-tooltip" style={{ position: 'fixed', left: tip.left, top: tip.top, transform: 'translateY(-50%)' }}>
          <span className="js-tooltip-name">{tip.tool.shortcut ? `${tip.tool.label}  ${tip.tool.shortcut}` : tip.tool.label}</span>
          {tip.tool.desc && <span className="js-tooltip-desc">{tip.tool.desc}</span>}
        </div>
      )}
    </aside>
  )
}
