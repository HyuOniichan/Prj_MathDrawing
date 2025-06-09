import React, { useEffect, useRef, useState } from "react";
import { useStrokeRef } from "../utils/strokesRef";
import { useTool } from "../contexts/ToolContext";
import { useDrawCanvas } from "../contexts/DrawCanvasContext";
import { availableTools } from "../tools/availableTools";
import { Tool } from "../tools/Tool";
import { CanvasAPI } from "../utils/CanvasAPI";

const CANVAS_WIDTH = window.innerWidth
const CANVAS_HEIGHT = window.innerHeight

/**
 * tool canvas
 * @returns {JSX.Element}
 */
export function ToolCanvas({zIndex = 999}) {
    /**
     * all strokes on tool canvas
     */
    const strokesRef = useStrokeRef()
    
    /**
     * canvas reference
     * @type {React.RefObject<HTMLCanvasElement>}
     */
    const canvasRef = useRef(null)

    /**
     * canvas rendering context reference
     * @type {React.RefObject<CanvasRenderingContext2D>}
     */
    const ctxRef = useRef(null)

    /**
     * tool name
     */
    const { activeToolName } = useTool()

    /**
     * active tool
     * @type {Tool}
     */
    const activeTool = availableTools.get(activeToolName) || null

    //get tool canvas API
    const canvasAPI = new CanvasAPI(canvasRef, strokesRef)

    /* get target canvas API */
    // Get context
    const { focusedLayer, getCanvasAPI } = useDrawCanvas()

    // State store target canvas API
    /**@type {[CanvasAPI, React.Dispatch<React.SetStateAction<CanvasAPI>>]*/
    const [targetCanvasAPI, setTargetCanvasAPI] = useState(null)

    //layer handler
    useEffect(() => {
        console.log('focus layer =', focusedLayer)
        const api = getCanvasAPI(focusedLayer)
        setTargetCanvasAPI(api)
    }, [focusedLayer])

    // useEffect(() => {
    //     if (targetCanvasAPI) {
    //         console.log('Updated targetCanvasAPI:', targetCanvasAPI)
    //     }
    // }, [targetCanvasAPI])


    //tool handler
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctxRef.current = ctx

        canvasRef.current.width = CANVAS_WIDTH
        canvasRef.current.height = CANVAS_HEIGHT

        activeTool?.setUp?.(canvasAPI, targetCanvasAPI)

        /**
         * canvas on mouse down
         * @param {CanvasPointerEvent} e 
         */
        function handleMouseDown(e) {
            activeTool?.onMouseDown?.({rawEvent: e, ctx: ctx})
        }

        /**
         * canvas on mouse move
         * @param {CanvasPointerEvent} e 
         */
        function handleMouseMove(e) {
            activeTool?.onMouseMove?.({rawEvent: e, ctx: ctx})
        }

        /**
         * canvas on mouse up
         * @param {CanvasPointerEvent} e 
         */
        function handleMouseUp(e) {
            activeTool?.onMouseUp?.({rawEvent: e, ctx: ctx})
            requestAnimationFrame(() => {
                activeTool?.onFinalWork?.({rawEvent: e, ctx: ctx})
            })
        }

        canvas.addEventListener("mousedown", handleMouseDown)
        canvas.addEventListener("mousemove", handleMouseMove)
        canvas.addEventListener("mouseup", handleMouseUp)

        //before reload
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown)
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("mouseup", handleMouseUp)
            activeTool?.cleanUp?.()
        }
    }, [activeTool, targetCanvasAPI])

    return (
        <canvas ref={canvasRef}
            style={{
                position: "absolute",
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: zIndex
            }}
        ></canvas>
    )
}