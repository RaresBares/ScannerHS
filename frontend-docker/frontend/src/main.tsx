import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import PanelLayout from "./PanelLayout.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PanelLayout />
    </StrictMode>
)
