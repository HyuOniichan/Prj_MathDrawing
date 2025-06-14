import React from "react";
import { Tool } from "./Tool";
import { CanvasAPI } from "../utils/CanvasAPI";
import { useDrawStyle } from "../Instances/drawStyle";
import { Vector } from "../utils/Vector";
import { Stroke } from "../utils/Stroke";

const CANVAS_WIDTH = screen.width
const CANVAS_HEIGHT = screen.height

export class EraserTool extends Tool {
    /**
     * tool name
     */
    name = 'Eraser'

    /**
     * cursor value
     */
    cursorValue = `url('../src/image/cursor/eraser.png') 6 26, auto`

    /**
     * radius
     */
    eraserRadius = 10

    /**
     * is mouse down?
     */
    isMouseDown = false

    /**
     * count deleted strokes
     */
    deletedStrokes = 0

    /**
     * set up the tool canvas
     * @param {CanvasAPI} canvasAPI 
     * @param {CanvasAPI} targetCanvasAPI
     * @param {HistoryContextValue} history 
     */
    setUp(canvasAPI, targetCanvasAPI, history) {
        //declare variables
        this.canvasAPI = canvasAPI
        this.targetCanvasAPI = targetCanvasAPI
        this.history = history

        //init 
        canvasAPI.canvasRef.current.style.cursor = this.cursorValue || 'default'
        const ctx = canvasAPI.canvasRef.current.getContext('2d')
        const drawStyle = useDrawStyle()
        Object.assign(ctx, drawStyle)

        //add linewidth for accurate
        this.eraserRadius += ctx.lineWidth / 2
    }

    /**
     * get distance between 2 vectors
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Number}
     */
    dist(v1, v2) {
        return Math.hypot(...v1.clone().subtract(v2).toArray())
    }

    /**
     * handle user mouse down
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseDown({rawEvent, ctx} = {}) {
        this.deletedStrokes = this.targetCanvasAPI.strokesRef.current.length
        this.isMouseDown = true
        this.onMouseMove({rawEvent: rawEvent, ctx: ctx})
    }

    /**
     * handle user mouse move
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseMove({rawEvent, ctx} = {}) {
        if(!this.isMouseDown) return

        const cx = rawEvent.offsetX
        const cy = rawEvent.offsetY
        const center = new Vector(cx, cy)

        //get eraser bounder
        // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        // ctx.beginPath()
        // ctx.arc(cx, cy, this.eraserRadius, 0, 2 * Math.PI)
        // ctx.save()
        // ctx.lineWidth = 1
        // ctx.stroke()
        // ctx.restore()

        //check if any stroke got erase
        this.targetCanvasAPI.strokesRef.current = this.targetCanvasAPI.strokesRef.current.filter(stroke => {
            for(let p of stroke.points) {
                if(this.dist(p, center) - this.eraserRadius <= 1e-9) {
                    return false
                }
            }
            return true
        })
        this.targetCanvasAPI.drawCanvas()
    }

    /**
     * handle user mouse up
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseUp({rawEvent, ctx} = {}) {
        this.isMouseDown = false
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        //save history here (feature maybe ?)
        this.deletedStrokes -= this.targetCanvasAPI.strokesRef.current.length
        if(this.deletedStrokes > 0) {
            this.history.commit()
        }
    }

    /**
     * handle final work (usually after onMouseUp)
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onFinalWork({rawEvent, ctx} = {}) {
        this.targetCanvasAPI.drawCanvas()
    }

    /**
     * clear all event listeners or reference that can cause bugs
     */
    cleanUp() {}
}