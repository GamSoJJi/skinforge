export default function Toolbar({
  activeTool, onToolChange,
  brushSize, onBrushSizeChange,
  brushShape, onBrushShapeChange,
  onUpload, onDownload,
}) {
  const tools = [
    { id: 'pen',        label: 'Pen',    icon: '✏️' },
    { id: 'eraser',     label: 'Eraser', icon: '⬜' },
    { id: 'fill',       label: 'Fill',   icon: '🪣' },
    { id: 'eyedropper', label: 'Pick',   icon: '💉' },
  ]

  const showBrush = activeTool === 'pen' || activeTool === 'eraser'

  return (
    <div className="toolbar">
      <div className="tool-group">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
          >
            <span>{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>

      {showBrush && (
        <div className="brush-group">
          <span className="brush-label">Size</span>
          <input
            type="range"
            min={1}
            max={8}
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="brush-slider"
            title={`Brush size: ${brushSize}px`}
          />
          <span className="brush-size-val">{brushSize}</span>

          <span className="brush-label">Shape</span>
          <div className="shape-group">
            <button
              className={`shape-btn ${brushShape === 'square' ? 'active' : ''}`}
              onClick={() => onBrushShapeChange('square')}
              title="Square brush"
            >▪</button>
            <button
              className={`shape-btn ${brushShape === 'circle' ? 'active' : ''}`}
              onClick={() => onBrushShapeChange('circle')}
              title="Round brush"
            >●</button>
          </div>

          <div
            className="brush-preview"
            title="Brush preview"
            style={{ '--brush-size': brushSize }}
          >
            <div className={`brush-dot ${brushShape}`} style={{
              width: brushSize * 6,
              height: brushSize * 6,
              borderRadius: brushShape === 'circle' ? '50%' : '2px',
            }} />
          </div>
        </div>
      )}

      <div className="file-group">
        <label className="tool-btn file-btn" title="Upload skin PNG">
          <span>↑</span>
          <span className="tool-label">Upload</span>
          <input
            type="file"
            accept=".png"
            style={{ display: 'none' }}
            onChange={onUpload}
          />
        </label>
        <button className="tool-btn" onClick={onDownload} title="Download skin PNG">
          <span>↓</span>
          <span className="tool-label">Save</span>
        </button>
      </div>
    </div>
  )
}
