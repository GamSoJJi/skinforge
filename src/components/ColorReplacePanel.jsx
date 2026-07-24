import { useRef, useState } from 'react'

function isValidHex(h) { return /^#[0-9a-fA-F]{6}$/.test(h) }

function Slot({ index, color, isPicking, onEyedropper, onHexChange }) {
  const valid = isValidHex(color)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <div style={{
          width: 44, height: 44,

          background: valid ? color : 'transparent',
          border: `2px ${valid ? 'solid' : 'dashed'} ${isPicking ? '#6677dd' : '#666'}`,
          boxSizing: 'border-box',
          flexShrink: 0,
          boxShadow: isPicking ? '0 0 0 1px #6677dd' : 'none',
          transition: 'box-shadow 0.1s, border-color 0.1s',
        }} />
        <button
          className={`mc-btn ${isPicking ? 'active' : ''}`}
          onClick={() => onEyedropper(index)}
          title="캔버스에서 색상 선택"
          style={{ width: 26, height: 26, padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="5" r="3.5" />
            <path d="M7.5 7.5 L11 11" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <input
        className="mc-input"
        value={color}
        onChange={(e) => onHexChange(index, e.target.value)}
        placeholder="#rrggbb"
        maxLength={7}
        style={{ width: 74, fontSize: '0.68rem', textAlign: 'center' }}
      />
    </div>
  )
}

export default function ColorReplacePanel({ onClose, onApply, pickingSlot, onEyedropper, colors, onColorChange }) {
  const [pos, setPos] = useState(() => ({
    x: Math.max(40, window.innerWidth / 2 - 145),
    y: Math.max(40, window.innerHeight / 2 - 100),
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

  const canApply = isValidHex(colors[0]) && isValidHex(colors[1])

  return (
    <div className="cr-modal" style={{ left: pos.x, top: pos.y }}>
      <div className="cr-header" onMouseDown={handleHeaderMouseDown}>
        <span>색상 교체</span>
        <button className="cr-close" onClick={onClose}>×</button>
      </div>
      <div className="cr-body">
        {pickingSlot !== null && (
          <div style={{
            fontSize: '0.65rem', color: '#8899ee', textAlign: 'center',
            padding: '4px 0 2px', letterSpacing: '0.3px',
          }}>
            캔버스를 클릭해 색상을 선택하세요 &nbsp;(ESC 취소)
          </div>
        )}
        <div className="cr-slots">
          <Slot
            index={0} color={colors[0]}
            isPicking={pickingSlot === 0}
            onEyedropper={onEyedropper}
            onHexChange={onColorChange}
          />
          <span className="cr-arrow">→</span>
          <Slot
            index={1} color={colors[1]}
            isPicking={pickingSlot === 1}
            onEyedropper={onEyedropper}
            onHexChange={onColorChange}
          />
        </div>
        <button
          className="mc-btn"
          onClick={() => onApply(colors[0], colors[1])}
          disabled={!canApply}
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}
        >적용</button>
      </div>
    </div>
  )
}
