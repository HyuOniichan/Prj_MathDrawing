import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToolProvider } from './contexts/ToolContext'
import { DrawCanvasProvider } from './contexts/DrawCanvasContext'
import { DrawCanvas } from './components/DrawCanvas'
import { ToolCanvas } from './components/ToolCanvas'
import { useDrawCanvas } from './contexts/DrawCanvasContext'
import { ToolSelector } from './components/ToolSelector'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ToolProvider>
            <DrawCanvasProvider>
                <ToolSelector zIndex={1000}></ToolSelector>
                <DrawCanvas layerId={1}></DrawCanvas>
                <ToolCanvas zIndex={999}></ToolCanvas>
            </DrawCanvasProvider>
        </ToolProvider>
    </React.StrictMode>
)