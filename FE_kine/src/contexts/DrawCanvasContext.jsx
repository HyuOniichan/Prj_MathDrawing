import React, { createContext, useContext, useState, useRef } from 'react';
import { CanvasAPI } from '../utils/CanvasAPI';

export class DrawCanvasContextValue {
    /**
     * current focus canvas
     * @type {Number}
     */
    focusedLayer = 0
    /**
     * focus on another canvas
     * @param {Number} layerId
     */
    setFocusedLayer = (layerId) => {}
    /**
     * register a new canvas with API
     * @param {Number} layerId 
     * @param {CanvasAPI} api
     */
    registerCanvas = (layerId, api) => {}
    /**
     * get canvas API that is registered
     * @param {Number} layerId 
     * @returns {CanvasAPI}
     */
    getCanvasAPI = (layerId) => {}
}

/**@type {React.Context<DrawCanvasContextValue | null>} */
const DrawCanvasContext = createContext(null)

export function DrawCanvasProvider({ children }) {
    const [focusedLayer, setFocusedLayer] = useState(1) //default layer : 1
    const canvasRefs = useRef(new Map())

    const registerCanvas = (layerId, api) => {
        canvasRefs.current.set(layerId, api)
    }

    const getCanvasAPI = (layerId) => {
        return canvasRefs.current.get(layerId) || null
    }

    return (
        <DrawCanvasContext.Provider value={{
            focusedLayer: focusedLayer,
            setFocusedLayer: setFocusedLayer,
            registerCanvas: registerCanvas,
            getCanvasAPI: getCanvasAPI
        }}>
            {children}
        </DrawCanvasContext.Provider>
    )
}

/**
 * get the draw canvas layer
 * @returns {{
 * focusedLayer: Number,
 * setFocusedLayer: React.Dispatch<React.SetStateAction<Number>>,
 * registerCanvas: (layerId: Number, api: CanvasAPI) => void,
 * getCanvasAPI: (layerId: Number) => CanvasAPI
 * }}
 */
export function useDrawCanvas() {
    const ctx = useContext(DrawCanvasContext)
    if (!ctx) {
        console.error('No Canvas Found!')
    }
    return ctx
}