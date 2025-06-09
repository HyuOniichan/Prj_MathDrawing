import React from "react";
import { CanvasAPI } from "../utils/CanvasAPI";
import { useDrawStyle } from "../Instances/drawStyle";
import { Tool } from "./Tool";
import { Stroke } from "../utils/Stroke";
import { Vector } from "../utils/Vector";

const CANVAS_WIDTH = window.innerWidth
const CANVAS_HEIGHT = window.innerHeight

export class SelectTool extends Tool {
    /**
     * tool name
     */
    name = 'Select'

    /**
     * cursor value
     */
    cursorValue = `crosshair`

    /**
     * cursor radius for stroke pointer
     */
    cursorRadius = 10

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

        //add linewidth for accurate
        this.cursorRadius += ctx.lineWidth / 2
    }

    /**
     * is mouse down?
     */
    isMouseDown = false

    /**
     * stroke(s) that is currently focus
     * @type {Stroke[] | null}
     */
    focusedStrokes = null

    /**
     * point stroke
     * @type {Stroke | null}
     */
    pointStroke = null

    /**
     * previous grabbing point
     * @type {Vector | null}
     */
    prevGrabbingPoint = null

    /**
     * area select boolen
     */
    areaSelect = false

    /**
     * start point of selecting area
     * @type {Vector | null}
     */
    startSelectPoint = null

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
        this.isMouseDown = true
        this.onMouseMove({rawEvent: rawEvent, ctx: ctx})
        // if pointing to a stroke -> get focus strokes
        // else cancel the select and convert to area select
        if(this.pointStroke !== null) {
            this.canvasAPI.canvasRef.current.style.cursor = 'grabbing'
            //if point to another stroke
            if(this.focusedStrokes !== null && this.focusedStrokes.every(stroke => stroke !== this.pointStroke)) {
                this.focusedStrokes = [this.pointStroke]
            }
            //show chosen one
            this.showBounderBoxex(ctx)
        } 
        else {
            //reset all variables and clear ctx
            this.focusedStrokes = null
            this.prevGrabbingPoint = null
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            //start area select
            this.areaSelect = true
            this.startSelectPoint = new Vector(rawEvent.offsetX, rawEvent.offsetY)
        }
    }

    /**
     * show focused stroke bounder box
     * @param {CanvasRenderingContext2D} ctx 
     */
    showBounderBoxex(ctx) {
        //get bounder box visual
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.save()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'blue'
        for(let stroke of this.focusedStrokes) {
            const {x, y, width, height} = stroke.getBounderBox()
            ctx.strokeRect(x, y, width, height)
        }
        ctx.restore()
    }

    /**
     * handle user mouse move
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseMove({rawEvent, ctx} = {}) {
        /**
         * mouse pos
         * @type {Vector} 
         */
        const mouse = new Vector(rawEvent.offsetX, rawEvent.offsetY)

        //if area select
        if(this.areaSelect) {
            //clear 
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            //show chosen area
            ctx.save()
            ctx.lineWidth = 3
            ctx.setLineDash([5, 5])
            ctx.strokeStyle = 'red'
            ctx.strokeRect(...this.startSelectPoint.toArray(), ...mouse.clone().subtract(this.startSelectPoint).toArray())
            ctx.restore()
            return
        }

        //if there is any focus stroke => moving
        //else find one
        if(this.focusedStrokes !== null && this.isMouseDown) {
            //if prev grabbing is null, it's the first time stroke is select => =mouse
            if(this.prevGrabbingPoint === null) {
                this.prevGrabbingPoint = mouse
            }
            //calculate direction base on vector of current grabbing point vs prev grabbing point
            const direction = mouse.clone().subtract(this.prevGrabbingPoint)
            for(let stroke of this.focusedStrokes){
                //move all points in stroke to direction
                for(let p of stroke.points) {
                    p.plus(direction)
                }
            }
            //re render canvas
            this.targetCanvasAPI.drawCanvas()
            this.showBounderBoxex(ctx)

            //re declare prev grab
            this.prevGrabbingPoint = mouse
        }
        else {
            //reset point stroke
            this.pointStroke = null

            //reset prev grab pos
            this.prevGrabbingPoint = null

            //check if any stroke is under mouse
            for(let stroke of this.targetCanvasAPI.strokesRef.current) {
                for(let v of stroke.points) {
                    if(this.dist(v, mouse) <= this.cursorRadius) {
                        this.pointStroke = stroke
                        break
                    }
                }
                if(this.pointStroke !== null) break
            }

            //check if any bounding box is under mouse in case no stroke found
            if(this.pointStroke === null && this.focusedStrokes !== null) {
                for(let stroke of this.focusedStrokes) {
                    const {x, y, width, height} = stroke.bounderBox
                    if(mouse.x >= x && mouse.y >= y && mouse.x <= x + width && mouse.y <= y + height) {
                        this.pointStroke = stroke
                        break
                    }
                }
            }

            //if yes, turn to grab , prepare for grabbing, else default
            if(this.pointStroke !== null) {
                this.canvasAPI.canvasRef.current.style.cursor = 'grab'
            }
            else {
                this.canvasAPI.canvasRef.current.style.cursor = 'crosshair'
            }
        }
    }

    /**
     * handle user mouse up
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onMouseUp({rawEvent, ctx} = {}) {
        this.isMouseDown = false
        //handle select area
        if(this.areaSelect) {
            const mouse = new Vector(rawEvent.offsetX, rawEvent.offsetY)
            this.areaSelect = false
            this.focusedStrokes = []
            //check if any stroke is in select area
            for(let stroke of this.targetCanvasAPI.strokesRef.current) {
                for(let v of stroke.points) {
                    if(
                        v.x >= this.startSelectPoint.x && v.y >= this.startSelectPoint.y &&
                        v.x <= mouse.x && v.y <= mouse.y
                    ) {
                        this.focusedStrokes.push(stroke)
                        break
                    }
                }
            }
            //re render to show boxes
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            this.showBounderBoxex(ctx)
        }

        //re render canvas
        this.targetCanvasAPI.drawCanvas()
        //try finding new target
        this.onMouseMove({rawEvent: rawEvent, ctx: ctx})
    }

    /**
     * handle final work (usually after onMouseUp)
     * @param {{rawEvent: MouseEvent, ctx:CanvasRenderingContext2D}}
     */
    onFinalWork({rawEvent, ctx} = {}) {}

    /**
     * clear all event listeners or reference that can cause bugs
     */
    cleanUp() {
        const ctx = this.canvasAPI.canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
}