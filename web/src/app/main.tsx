import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MainPage } from '@/pages/MainPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { XBlockProvider } from '@/entities/XBlock'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <XBlockProvider>
        <MainPage />
      </XBlockProvider>
    </QueryClientProvider>
  </StrictMode>,
)
