import { useEffect, useState } from 'react'

const TIPS = [
  "하단 토글로 가이드를 켜고 끌 수 있어요",
  "슬림/노말 팔 전환은 하단 메뉴에서",
  "마법봉 근접 옵션 해제 시 캔버스 전체 동일 색상 선택",
  "휠로 줌 조절, 중간 버튼 드래그로 캔버스 이동",
  "[ ] 키로 브러시 크기를 빠르게 조절해요",
  "마법봉 선택 중 [ ] 키로 허용치를 5씩 조절할 수 있어요",
  "팔레트 슬롯 우클릭으로 색상을 고정할 수 있어요",
  "스포이드(I)로 스킨에서 색상을 바로 가져와요",
  "색 교체(R)로 클릭한 색상을 현재 색으로 일괄 교체해요",
  "색 교체 옵션바에서 단색/색조 모드를 전환할 수 있어요",
  "선택 영역이 있을 때 색 교체는 선택 안에서만 적용돼요",
  "ESC 키로 선택 영역을 해제할 수 있어요",
  "파일 메뉴에서 PNG 스킨 파일을 불러올 수 있어요",
  "⌘Z / Ctrl+Z로 최대 50단계까지 실행 취소 가능",
  "사각선택(M)으로 영역을 지정하면 그 안에서만 그려져요",
  "옷입히기 모드에서 두 스킨을 합성할 수 있어요",
  "3D 뷰어 경계선을 드래그해 크기를 조절할 수 있어요",
]

export default function TipBanner() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * TIPS.length))
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % TIPS.length)
        setVisible(true)
      }, 500)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="tip-banner" style={{ opacity: visible ? 1 : 0 }}>
      <span className="tip-icon">💡</span>
      <span className="tip-text">{TIPS[idx]}</span>
    </div>
  )
}
