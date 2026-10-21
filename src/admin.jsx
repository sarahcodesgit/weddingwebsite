import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminDashboard from './components/AdminDashboard'
import './admin.css'

document.documentElement.classList.add('js')

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <AdminDashboard />
  </StrictMode>,
)
