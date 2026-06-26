import { useRef, useState } from 'react'

function isValidHex(h) { return /^#[0-9a-fA-F]{6}$/.test(h) }

function Slot({ index, color, onPickStart, onColorChange }) {
  const filled = isValidHex(color)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        className="cr-slot"
        style={{
          background: filled ? color : undefined,
          borderStyle: filled ? 'solid' : 'dashed',
          cursor: filled ? 'default' : 'pointer',
        }}
        onClick={() => !filled && onPickStart(index)}
      >
        {!filled && <span className="cr-slot-plus">+</span>}
      </div>
      <input
        className="mc-input"
        value={color}
        onChange={(e) => onColorChange(index, e.target.value)}
        placeholder="#rrggbb"
        maxLength={7}
        style={{ width: 68, fontSize: '0.7rem', textAlign: 'center' }}
      />
    </div>
  )
}

export default function ColorReplaceModal({ onClose, onApply, pickingSlot, onPickStart, colors, onColorChange }) {
  const [pos, setPos] = useState(() => ({
    x: Math.max(40, window.innerWidth / 2 - 140),
    y: Math.max(40, window.innerHeight / 2 - 110),
  }))
  const dragRef = useRef(null)

  const handleHeaderMouseDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    dragRef.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y }
    const onMove = (e) => {
      if (!dragRef.current) return
      setPos({ x: e.clientX - dragRef.current.ox, y: e.clientY - dragRef.current.oy })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const isPicking = pickingSlot !== null
  const canApply = isValidHex(colors[0]) && isValidHex(colors[1])

  return (
    <div
      className="cr-modal"
      style={{ left: pos.x, top: pos.y, opacity: isPicking ? 0.4 : 1, pointerEvents: isPicking ? 'none' : 'auto' }}
    >
      <div className="cr-header" onMouseDown={handleHeaderMouseDown}>
        <span>색상 변경</span>
        <button className="cr-close" onClick={onClose}>×</button>
      </div>
      <div className="cr-body">
        <div className="cr-slots">
          <Slot index={0} color={colors[0]} onPickStart={onPickStart} onColorChange={onColorChange} />
          <span className="cr-arrow">→</span>
          <Slot index={1} color={colors[1]} onPickStart={onPickStart} onColorChange={onColorChange} />
        </div>
        <button
          className="mc-btn"
          onClick={() => onApply(colors[0], colors[1])}
          disabled={!canApply}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          적용
        </button>
      </div>
    </div>
  )
}
