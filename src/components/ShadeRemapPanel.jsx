import { useRef, useState } from 'react'

function isValidHex(h) { return /^#[0-9a-fA-F]{6}$/.test(h) }

function Slot({ index, color, isPicking, onEyedropper, onHexChange, label }) {
  const valid = isValidHex(color)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.3px' }}>{label}</div>
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
          style={{ width: 26, height: 26, padding: 0, fontSize: '0.8rem', flexShrink: 0 }}
        >🖊</button>
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

export default function ShadeRemapPanel({
  onClose, onApply, pickingSlot, onEyedropper,
  colors, onColorChange, tolMinus, tolPlus, onTolMinusChange, onTolPlusChange,
  tolL, onTolLChange,
}) {
  const [pos, setPos] = useState(() => ({
    x: Math.max(40, window.innerWidth / 2 - 155),
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

  const canApply = isValidHex(colors[0]) && isValidHex(colors[1])

  return (
    <div className="cr-modal" style={{ left: pos.x, top: pos.y }}>
      <div className="cr-header" onMouseDown={handleHeaderMouseDown}>
        <span>색조 변경</span>
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
          <Slot index={0} color={colors[0]} label="소스"
            isPicking={pickingSlot === 0}
            onEyedropper={onEyedropper} onHexChange={onColorChange}
          />
          <span className="cr-arrow">→</span>
          <Slot index={1} color={colors[1]} label="대상"
            isPicking={pickingSlot === 1}
            onEyedropper={onEyedropper} onHexChange={onColorChange}
          />
        </div>
        <div className="shade-tolerance-section-label">색조 범위 (H)</div>
        <div className="shade-tolerance-row">
          <span className="shade-tolerance-side-label">−</span>
          <input
            type="range" min={0} max={90} step={5}
            value={tolMinus}
            onChange={(e) => onTolMinusChange(Number(e.target.value))}
            className="shade-slider"
          />
          <span className="shade-tolerance-label">{tolMinus}°</span>
        </div>
        <div className="shade-tolerance-row">
          <span className="shade-tolerance-side-label">+</span>
          <input
            type="range" min={0} max={90} step={5}
            value={tolPlus}
            onChange={(e) => onTolPlusChange(Number(e.target.value))}
            className="shade-slider"
          />
          <span className="shade-tolerance-label">{tolPlus}°</span>
        </div>
        <div className="shade-tolerance-section-label" style={{ marginTop: 6 }}>명도 범위 (L)</div>
        <div className="shade-tolerance-row">
          <span className="shade-tolerance-side-label">±</span>
          <input
            type="range" min={0} max={50} step={1}
            value={tolL}
            onChange={(e) => onTolLChange(Number(e.target.value))}
            className="shade-slider"
          />
          <span className="shade-tolerance-label">{tolL}%</span>
        </div>
        <button
          className="mc-btn"
          onClick={() => onApply(colors[0], colors[1], tolMinus, tolPlus, tolL)}
          disabled={!canApply}
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}
        >적용</button>
      </div>
    </div>
  )
}
