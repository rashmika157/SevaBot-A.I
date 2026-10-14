import { createContext, useContext, useState, useEffect } from 'react'
import { translations, LANGUAGES, t as translateFn } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('lang')
      return saved === 'kn' || saved === 'hi' ? saved : 'en'
    } catch {
      return 'en'
    }
  })

  const setLang = (newLang) => {
    const valid = newLang === 'kn' || newLang === 'hi' ? newLang : 'en'
    setLangState(valid)
    try {
      localStorage.setItem('lang', valid)
    } catch {}
    document.documentElement.lang = valid
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => translateFn(key, lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
