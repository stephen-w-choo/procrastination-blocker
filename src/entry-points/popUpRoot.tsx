import { createRoot } from 'react-dom/client'
import React from 'react'
import './styles.css'
import PopUp from '../view/PopUp';

const rootElement = document.getElementById("root")

if (rootElement !== null) {
    const root = createRoot(rootElement)
    root.render(<PopUp />)
}