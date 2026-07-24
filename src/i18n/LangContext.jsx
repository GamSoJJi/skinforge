import { createContext, useContext, useState } from 'react'
import { ko } from './ko'
import { en } from './en'

const LANGS = { ko, en }

const LangContext = createContext({ lang: 'ko', t: ko, setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ko')
  return (
    <LangContext.Provider value={{ lang, t: LANGS[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
