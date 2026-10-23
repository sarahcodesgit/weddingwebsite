import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import WeddingEntrance from './components/WeddingEntrance'
import './styles.css'
import './opening-invitation.css'
import './wedding-entrance.css'

try {
  if (window.sessionStorage.getItem('sarah-jesus-opening-invitation-seen') === 'true') {
    document.documentElement.classList.add('invitation-seen')
  }
} catch {
  // Storage can be unavailable without affecting access to the site.
}

document.documentElement.classList.add('js')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WeddingEntrance><App /></WeddingEntrance>
  </StrictMode>,
)
