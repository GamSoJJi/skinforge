import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'galmuri/dist/galmuri.css'
import './index.css'
import App from './App.jsx'
import { LangProvider } from './i18n/LangContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
