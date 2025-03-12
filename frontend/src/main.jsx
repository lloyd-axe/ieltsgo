import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import './styles/components.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />,
)

// REMOVE STRICT MODE
