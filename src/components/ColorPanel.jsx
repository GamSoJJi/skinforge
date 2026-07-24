import { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

function extractColors(skinCanvas) {
  if (!skinCanvas) return []
  const ctx = skinCanvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, 64, 64)
  const colorSet = new Set()
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] === 0) continue
    const hex = '#' + [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]
      .map((v) => v.toString(16).padStart(2, '0')).join('')
    colorSet.add(hex)
  }
  return [...colorSet]
}

export default function ColorPanel({
  color, onChange,
  skinCanvas, skinVersion, uploadCount,
  historyPalette, onHistoryAdd, onPinToggle,
}) {
  const [showPicker, setShowPicker] = useState(false)
  const [paletteMode, setPaletteMode] = useState('default')
  const [skinColors, setSkinColors] = useState([])

  useEffect(() => {
    if (uploadCount > 0) setPaletteMode('skin')
  }, [uploadCount])

  useEffect(() => {
    if (paletteMode === 'skin') {
      setSkinColors(extractColors(skinCanvas))
    }
  }, [paletteMode, skinCanvas, skinVersion])

  const handleSwatchClick = (c) => {
    onChange(c) // 색상 선택만, 히스토리 순서는 변경하지 않음
  }

  const handlePinToggle = (e, i) => {
    e.preventDefault()
    onPinToggle(i)
  }

  return (
    <div className="color-panel">
      <div className="current-color-row">
        <div
          className="current-swatch mc-slot"
          style={{ background: color }}
          onClick={() => setShowPicker((v) => !v)}
          title="색상 선택기 열기"
        />
        <input
          className="mc-input hex-input"
          value={color}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          maxLength={7}
          spellCheck={false}
        />
      </div>

      {showPicker && (
        <div className="picker-wrap">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}

      <div className="palette-tabs">
        <button
          className={`mc-btn tab-btn ${paletteMode === 'default' ? 'active' : ''}`}
          onClick={() => setPaletteMode('default')}
        >기록</button>
        <button
          className={`mc-btn tab-btn ${paletteMode === 'skin' ? 'active' : ''}`}
          onClick={() => setPaletteMode('skin')}
        >스킨</button>
      </div>

      <div className="palette-grid">
        {paletteMode === 'default' && historyPalette.map((slot, i) => (
          <div
            key={i}
            className={`mc-slot palette-swatch ${slot.pinned ? 'pinned' : ''}`}
            style={{ background: slot.color }}
            onClick={() => handleSwatchClick(slot.color)}
            onContextMenu={(e) => handlePinToggle(e, i)}
            title={slot.color}
          />
        ))}
        {paletteMode === 'skin' && (
          <>
            {skinColors.length === 0 && (
              <div className="palette-empty">스킨에서 색상 없음</div>
            )}
            {skinColors.map((c, i) => (
              <div
                key={`${c}-${i}`}
                className="mc-slot palette-swatch"
                style={{ background: c }}
                onClick={() => handleSwatchClick(c)}
                title={c}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
