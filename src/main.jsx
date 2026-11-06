import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './index.css'
import App from './App.jsx'
import { ThemedToaster } from './components/common/ThemedToaster'
import { AppDataProvider } from './context/AppDataContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AppDataProvider>
        <App />
        <ThemedToaster />
      </AppDataProvider>
    </ThemeProvider>
  </StrictMode>,
)
