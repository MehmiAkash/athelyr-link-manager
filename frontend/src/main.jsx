import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import "react-toastify/dist/ReactToastify.css";
import { LinkProvider } from './context/LinkProvider.jsx'
import { GroupProvider } from './context/GroupProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
     <ThemeProvider>
       <LinkProvider>
        <GroupProvider>
          <BrowserRouter>
              <App />
          </BrowserRouter>
        </GroupProvider>
       </LinkProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
