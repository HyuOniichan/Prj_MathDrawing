import React, { createContext, ReactNode, useContext, useRef, useState, useEffect, createRef } from "react";
import { CanvasAPI } from "../utils/CanvasAPI";
import { useDrawCanvas } from "./DrawCanvasContext";
import { Stroke } from "../utils/Stroke";

export class HistoryContextValue {
    /**
     * commit current history to memory
     */
    commit = () => {}

    /**
     * undo history 
     */
    undo = () => {}

    /**
     * redo history
     */
    redo = () => {}
}

/**@type {React.Context<HistoryContextValue | null>} */
const HistoryContext = createContext(null)

export class History {
    /**
     * history interface
     * @param {number} focusedLayer - focus layer
     * @param {CanvasAPI} canvasAPI - canvas api
     */
    constructor(focusedLayer, canvasAPI ) {
        /**
         * draw canvas layer
         * @type {Number}
         */
        this.focusedLayer = focusedLayer

        /**
         * draw canvas API
         * @type {CanvasAPI}
         */
        this.canvasAPI = canvasAPI
    }
}

/**
 * History Provider
 * @param {{children: ReactNode}}
 * @returns {JSX.Element}
 */
export function HistoryProvider({children}) {
    /**
     * past histories
     * @type { React.RefObject<History[]> }
     */
    const past = useRef([])
    /**
     * current history
     * @type { React.RefObject<History> }
     */
    const present = useRef(null)
    /**
     * future history
     * @type { React.RefObject<History[]> }
     */
    const future = useRef([])

    /**
     * update state
     */
    const [_, update] = useState(0)

    /**
     * max history save
     */
    const maxHistorySave = 20

    const { focusedLayer, getCanvasAPI, setFocusedLayer, registerCanvas } = useDrawCanvas()

    useEffect(() => {
        if(!present.current) {
            commit()
        }
    },[focusedLayer])
    /**
     * clone a history variable
     * @param {History} history
     */
    function getCloneHistory(history) {
        const {canvasAPI, focusedLayer} = history
        const strokes = canvasAPI.strokesRef.current.map(stroke => {
            const points = stroke.points.map(vec => vec.clone())
            const style = stroke.style
            return new Stroke(points, style)
        })
        const strokesRef = createRef()
        strokesRef.current = strokes
        const api = new CanvasAPI(canvasAPI.canvasRef, strokesRef, canvasAPI.drawCanvas)
        return new History(focusedLayer, api)
    }

    /**
     * 
     * @param {History} history 
     */
    function changeHistory(history) {
        if (focusedLayer !== history.focusedLayer) {
            setFocusedLayer(history.focusedLayer)
        }

        registerCanvas(history.focusedLayer, history.canvasAPI)
        setTimeout(() => {
            const api = getCanvasAPI(history.focusedLayer)
            if(api) {
                api.drawCanvas()
            }
            update(n => n + 1)
        }, 0)
    }
  

    function commit() {

        const api = getCanvasAPI(focusedLayer)

        const history = new History(focusedLayer, api)

        if(present.current !== null) {
            past.current.push(getCloneHistory(present.current))
        }

        present.current = getCloneHistory(history)

        future.current = []

    }

    function undo() {

        if(past.current.length === 0) {
            console.log('no undo')
            return
        }

        const history = past.current.pop()

        future.current.push(getCloneHistory(present.current))

        present.current = getCloneHistory(history)

        while(future.current.length > maxHistorySave) {
            future.current.shift()
        }

        changeHistory(history)

    }

    function redo() {

        if(future.current.length === 0) {
            console.log('no redo')
            return
        }

        const history = future.current.pop()

        past.current.push(getCloneHistory(present.current))

        present.current = getCloneHistory(history)

        while(past.current.length > maxHistorySave) {
            past.current.shift()
        }

        changeHistory(history)

    }

    return (
        <HistoryContext.Provider value={{
            commit: commit,
            undo: undo,
            redo: redo
        }}
        >
            {children}
        </HistoryContext.Provider>
    )
}

/**
 * get app history
 */
export function useHistory() {
    return useContext(HistoryContext)
}