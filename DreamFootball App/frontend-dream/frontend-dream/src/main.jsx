import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/userContext.jsx'
import { TeamProvider } from './context/teamContext.jsx'
import { AdminProvider } from './context/adminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <UserProvider>
        <TeamProvider>
          <App />
        </TeamProvider>
      </UserProvider>
    </AdminProvider>
  </StrictMode>,
)