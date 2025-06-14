import React from "react";
import { Tool } from "./Tool";
import { useStrokeRef } from "../utils/strokesRef";
import { Stroke } from "../utils/Stroke";
import { Vector } from "../utils/Vector";
import { useDrawCanvas } from "../contexts/DrawCanvasContext";
import { useDrawStyle } from "../Instances/drawStyle";
import { CanvasAPI } from "../utils/CanvasAPI";

const CANVAS_WIDTH = screen.width
const CANVAS_HEIGHT = screen.height

export class PenTool extends Tool {
    /**
     * tool name
     */
    name = 'Pen'
    
    /**
     * cursor value
     */
    cursorValue = `url('../src/image/cursor/pen.png') 0 32, auto`

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
    }

    /**
     * stroke for pen
     * @type {Vector[]}
     */
    points = []

    /**
     * is mouse down?
     */
    isMouseDown = false

    /**
     * handle user mouse down
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D, canvasAPI: CanvasAPI}}
     */
    onMouseDown({rawEvent, ctx} = {}) {
        const x = rawEvent.offsetX
        const y = rawEvent.offsetY
        this.points = [new Vector(x, y)]
        ctx.beginPath()
        const drawStyle = useDrawStyle()
        Object.assign(ctx, drawStyle)
        ctx.moveTo(x, y)
        this.isMouseDown = true
    }

    /**
     * handle user mouse move
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D, canvasAPI: CanvasAPI}}
     */
    onMouseMove({rawEvent, ctx} = {}) {
        if(!this.isMouseDown) return
        const vector = new Vector(rawEvent.offsetX, rawEvent.offsetY)
        ctx.lineTo(vector.x, vector.y)
        ctx.stroke()
        this.points.push(vector)
    }

    /**
     * handle user mouse up
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D, canvasAPI: CanvasAPI}}
     */
    onMouseUp({rawEvent, ctx} = {}) {
        this.isMouseDown = false
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
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
     * handle final work (usually after onMouseUp)
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D, targetCanvasAPI: CanvasAPI}}
     */
    onFinalWork({rawEvent, ctx} = {}) {
        //get true points array
        /**@type {Vector[]} */
        let vectors = []
        const maxDist = 15
        let prevPoint = this.points[0]
        vectors.push(prevPoint)
        for(let i = 1; i < this.points.length; i++) {
            const currPoint = this.points[i]
            let d = this.dist(prevPoint, currPoint)
            const direction = currPoint.clone().normalize(prevPoint).multiply(maxDist)
            while(d > maxDist) {
                const tempPoint = prevPoint.clone().plus(direction)
                vectors.push(tempPoint)
                prevPoint = tempPoint
                d -= maxDist
            }
            vectors.push(currPoint)
            prevPoint = currPoint
        }
        //get stroke
        // const stroke = new Stroke(this.points)
        const stroke = new Stroke(vectors)
        //push stroke into strokeRef
        this.targetCanvasAPI.strokesRef.current.push(stroke)
        //re render
        this.targetCanvasAPI.drawCanvas()
        //commit history
        this.history.commit()
    }

    /**
     * clear all event listeners or reference that can cause bugs
     */
    cleanUp() {}
}