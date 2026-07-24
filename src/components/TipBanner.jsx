import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext.jsx'

export default function TipBanner() {
  const { t } = useLang()
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * t.tips.length))
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % t.tips.length)
        setVisible(true)
      }, 500)
    }, 30000)
    return () => clearInterval(id)
  }, [t.tips.length])

  return (
    <div className="tip-banner" style={{ opacity: visible ? 1 : 0 }}>
      <span className="tip-icon">💡</span>
      <span className="tip-text">{t.tips[idx]}</span>
    </div>
  )
}
