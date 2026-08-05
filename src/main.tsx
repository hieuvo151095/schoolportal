import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ensureSchemaVersion } from './storage/schemaVersion'

// Phải chạy trước bất kỳ code nào khác đọc localStorage (session, hoSoTruong, ensureSeeded*...).
ensureSchemaVersion()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme} style={{ height: '100%' }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FluentProvider>
  </StrictMode>,
)
