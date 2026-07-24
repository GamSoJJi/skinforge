import { useEffect, useRef, useState } from 'react'
import * as skinview3d from 'skinview3d'

export default function SkinViewer3D({ skinCanvas, skinVersion, skinType }) {
  const canvasRef = useRef(null)
  const viewerRef = useRef(null)
  const [rotating, setRotating] = useState(true)
  const [walking, setWalking] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return
    const container = canvasRef.current.parentElement
    const viewer = new skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width: container?.clientWidth || 420,
      height: container?.clientHeight || 500,
    })
    viewer.background = 0x2a2a2a
    viewer.autoRotate = true
    viewer.autoRotateSpeed = 1.2
    viewer.animation = new skinview3d.WalkingAnimation()
    viewer.animation.speed = 0.8
    viewer.zoom = 0.9
    viewerRef.current = viewer

    const observer = new ResizeObserver(() => {
      if (!container) return
      viewer.setSize(container.clientWidth, container.clientHeight)
    })
    if (container) observer.observe(container)

    return () => { observer.disconnect(); viewer.dispose() }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !skinCanvas) return
    skinCanvas.convertToBlob({ type: 'image/png' }).then((blob) => {
      const url = URL.createObjectURL(blob)
      viewer.loadSkin(url, { model: skinType === 'slim' ? 'slim' : 'default' }).then(() => URL.revokeObjectURL(url))
    })
  }, [skinVersion, skinCanvas, skinType])

  const toggleRotate = () => {
    const viewer = viewerRef.current
    if (!viewer) return
    const next = !rotating
    viewer.autoRotate = next
    setRotating(next)
  }

  const toggleWalk = () => {
    const viewer = viewerRef.current
    if (!viewer) return
    const next = !walking
    viewer.animation = next ? new skinview3d.WalkingAnimation() : null
    if (viewer.animation) viewer.animation.speed = 0.8
    setWalking(next)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div className="viewer-controls">
        <button
          className={`viewer-btn ${walking ? 'active' : ''}`}
          onClick={toggleWalk}
          title={walking ? '서기' : '걷기'}
        >
          {walking ? '🚶' : '🧍'}
        </button>
        <button
          className={`viewer-btn ${rotating ? 'active' : ''}`}
          onClick={toggleRotate}
          title={rotating ? '회전 정지' : '회전 시작'}
        >
          {rotating ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  )
}
