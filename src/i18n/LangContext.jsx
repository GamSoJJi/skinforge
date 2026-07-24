import { createContext, useContext, useState } from 'react'
import { ko } from './ko'
import { en } from './en'

const LANGS = { ko, en }

const LangContext = createContext({ lang: 'ko', t: ko, setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang_] = useState(() => {
    const saved = localStorage.getItem('lang')
    return saved && LANGS[saved] ? saved : 'ko'
  })

  const setLang = (l) => {
    localStorage.setItem('lang', l)
    setLang_(l)
  }

  return (
    <LangContext.Provider value={{ lang, t: LANGS[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
