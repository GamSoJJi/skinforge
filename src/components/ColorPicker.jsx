import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

const PALETTE = [
  '#000000', '#ffffff', '#888888', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#00ff88',
  '#ffccaa', '#cc8844', '#664422', '#336600', '#003366', '#660033',
]

export default function ColorPicker({ color, onChange, onPickedFromCanvas }) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="color-picker-panel">
      <div className="color-row">
        <div
          className="current-color"
          style={{ background: color }}
          onClick={() => setShowPicker((v) => !v)}
          title="Click to open color picker"
        />
        <input
          className="hex-input"
          value={color}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          maxLength={7}
        />
      </div>
      {showPicker && (
        <div className="picker-popup">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
      <div className="palette">
        {PALETTE.map((c) => (
          <div
            key={c}
            className="palette-swatch"
            style={{ background: c }}
            onClick={() => onChange(c)}
            title={c}
          />
        ))}
      </div>
    </div>
  )
}
