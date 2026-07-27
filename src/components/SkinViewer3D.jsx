import { useEffect, useRef, useState, useCallback } from 'react'
import * as skinview3d from 'skinview3d'
import { Footprints, PersonStanding, RotateCw, Image, ImageOff } from 'lucide-react'
import viewerBg from '../assets/viewer-background.webp'
import { useLang } from '../i18n/LangContext.jsx'

// Minecraft 비율 기준 (3배 스케일): viewBox 48×96
const PART_DEFS = [
  { name: 'head',     label: '머리',   x: 12, y: 0,  w: 24, h: 23 },
  { name: 'body',     label: '몸통',   x: 12, y: 24, w: 24, h: 35 },
  { name: 'rightArm', label: '오른팔', x: 0,  y: 24, w: 11, h: 35 },
  { name: 'leftArm',  label: '왼팔',   x: 37, y: 24, w: 11, h: 35 },
  { name: 'rightLeg', label: '오른다리', x: 12, y: 60, w: 11, h: 36 },
  { name: 'leftLeg',  label: '왼다리',   x: 25, y: 60, w: 11, h: 36 },
]

const INIT_PARTS    = { head: true, body: true, rightArm: true, leftArm: true, rightLeg: true, leftLeg: true }
const INIT_OVERLAYS = { head: true, body: true, rightArm: true, leftArm: true, rightLeg: true, leftLeg: true }

export default function SkinViewer3D({ skinCanvas, skinVersion, skinType }) {
  const canvasRef = useRef(null)
  const viewerRef = useRef(null)
  const [rotating, setRotating] = useState(true)
  const [walking, setWalking]   = useState(true)
  const [parts, setParts]       = useState(INIT_PARTS)
  const [overlays, setOverlays] = useState(INIT_OVERLAYS)
  const [showBg, setShowBg]     = useState(true)
  const { t } = useLang()

  useEffect(() => {
    if (!canvasRef.current) return
    const container = canvasRef.current.parentElement
    const viewer = new skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width: container?.clientWidth || 420,
      height: container?.clientHeight || 500,
      alpha: true,
    })
    viewer.background = null
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
      viewer.loadSkin(url, { model: skinType === 'slim' ? 'slim' : 'default' }).then(() => {
        URL.revokeObjectURL(url)
        setParts(prev => {
          Object.entries(prev).forEach(([name, visible]) => {
            const obj = viewer.playerObject?.skin?.[name]
            if (obj) obj.visible = visible
          })
          return prev
        })
        setOverlays(prev => {
          Object.entries(prev).forEach(([name, visible]) => {
            const obj = viewer.playerObject?.skin?.[name]
            if (obj?.outerLayer) obj.outerLayer.visible = visible
          })
          return prev
        })
      })
    })
  }, [skinVersion, skinCanvas, skinType])

  const togglePart = useCallback((name) => {
    setParts(prev => {
      const next = { ...prev, [name]: !prev[name] }
      const obj = viewerRef.current?.playerObject?.skin?.[name]
      if (obj) obj.visible = next[name]
      return next
    })
  }, [])

  const toggleOverlay = useCallback((name) => {
    setOverlays(prev => {
      const next = { ...prev, [name]: !prev[name] }
      const obj = viewerRef.current?.playerObject?.skin?.[name]
      if (obj?.outerLayer) obj.outerLayer.visible = next[name]
      return next
    })
  }, [])

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
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {showBg && <img src={viewerBg} className="viewer-bg" alt="" aria-hidden="true" />}
      <canvas ref={canvasRef} style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'block' }} />

      {/* 파츠 토글 — 좌하단 (스킨 / 오버레이 두 실루엣) */}
      <div className="viewer-parts-wrap">
        <svg viewBox="0 0 48 96" className="viewer-parts" xmlns="http://www.w3.org/2000/svg">
          {PART_DEFS.map(({ name, label, x, y, w, h }) => (
            <rect
              key={name}
              x={x} y={y} width={w} height={h}
              className={`viewer-part ${parts[name] ? 'on' : 'off'}`}
              onClick={() => togglePart(name)}
              rx={1.5}
            >
              <title>{label}</title>
            </rect>
          ))}
        </svg>
        <svg viewBox="0 0 48 96" className="viewer-parts" xmlns="http://www.w3.org/2000/svg">
          {PART_DEFS.map(({ name, label, x, y, w, h }) => (
            <rect
              key={name}
              x={x + 1} y={y + 1} width={w - 2} height={h - 2}
              className={`viewer-part-ol ${overlays[name] ? 'on' : 'off'}`}
              onClick={() => toggleOverlay(name)}
              rx={1.5}
            >
              <title>{label} 오버레이</title>
            </rect>
          ))}
        </svg>
      </div>

      <div className="viewer-controls">
        <button
          className={`viewer-btn ${showBg ? 'active' : ''}`}
          onClick={() => setShowBg(v => !v)}
          data-tip={showBg ? t.viewer.bgOn : t.viewer.bgOff}
        >
          {showBg ? <Image size={14} strokeWidth={1.8} /> : <ImageOff size={14} strokeWidth={1.8} />}
        </button>
        <button
          className={`viewer-btn ${walking ? 'active' : ''}`}
          onClick={toggleWalk}
          data-tip={walking ? t.viewer.walkOn : t.viewer.walkOff}
        >
          {walking ? <Footprints size={14} strokeWidth={1.8} /> : <PersonStanding size={14} strokeWidth={1.8} />}
        </button>
        <button
          className={`viewer-btn ${rotating ? 'active' : ''}`}
          onClick={toggleRotate}
          data-tip={rotating ? t.viewer.rotateOn : t.viewer.rotateOff}
        >
          <RotateCw size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
