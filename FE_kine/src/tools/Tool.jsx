import React from "react";
import { CanvasAPI } from "../utils/CanvasAPI";
import { useDrawStyle } from "../Instances/drawStyle";

export class Tool {
    /**
     * tool name
     */
    name = ''

    /**
     * cursor value
     */
    cursorValue = ``

    /**
     * set up the tool canvas
     * @param {CanvasAPI} canvasAPI 
     * @param {CanvasAPI} targetCanvasAPI
     */
    setUp(canvasAPI, targetCanvasAPI) {
        //declare variables
        this.canvasAPI = canvasAPI
        this.targetCanvasAPI = targetCanvasAPI

        //init 
        canvasAPI.canvasRef.current.style.cursor = this.cursorValue || 'default'
        const ctx = canvasAPI.canvasRef.current.getContext('2d')
        const drawStyle = useDrawStyle()
        Object.assign(ctx, drawStyle)
    }

    /**
     * is mouse down?
     */
    isMouseDown = false

    /**
     * handle user mouse down
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseDown({rawEvent, ctx} = {}) {}

    /**
     * handle user mouse move
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseMove({rawEvent, ctx} = {}) {}

    /**
     * handle user mouse up
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseUp({rawEvent, ctx} = {}) {}

    /**
     * handle final work (usually after onMouseUp)
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onFinalWork({rawEvent, ctx} = {}) {}

    /**
     * clear all event listeners or reference that can cause bugs
     */
    cleanUp() {}
}