import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToolProvider } from './contexts/ToolContext'
import { DrawCanvasProvider } from './contexts/DrawCanvasContext'
import { DrawCanvas } from './components/DrawCanvas'
import { ToolCanvas } from './components/ToolCanvas'
import { ToolSelector } from './components/ToolSelector'
import { FeatureButtons } from './components/FeatureButtons'
import { HistoryProvider } from './contexts/HistoryContext'
import { MathJaxContext} from "better-react-mathjax";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MathJaxContext>
            <ToolProvider>
                <DrawCanvasProvider>
                    <HistoryProvider>
                        <ToolSelector zIndex={1000}></ToolSelector>
                        <DrawCanvas layerId={1}></DrawCanvas>
                        <ToolCanvas zIndex={999}></ToolCanvas>
                        <FeatureButtons></FeatureButtons>
                    </HistoryProvider>
                </DrawCanvasProvider>
            </ToolProvider>
        </MathJaxContext>
    </React.StrictMode>
)