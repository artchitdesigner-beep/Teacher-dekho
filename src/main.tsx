import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './lib/auth-context'

console.log('Main.tsx executing...');
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('FATAL: Root element not found!');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
  console.log('React app mounted.');
}
