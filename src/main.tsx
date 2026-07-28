import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import { AppProviders } from '@/app/providers'
import { ErrorBoundary } from '@/components/common/error-boundary'
import '@/styles/globals.css'
createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><AppProviders><App/></AppProviders></ErrorBoundary></StrictMode>)
