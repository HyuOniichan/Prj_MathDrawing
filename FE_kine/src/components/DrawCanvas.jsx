import React, { useEffect, useRef } from "react";
import { useDrawCanvas } from "../contexts/DrawCanvasContext";
import { useStrokeRef } from "../utils/strokesRef";
import { useDrawStyle } from "../Instances/drawStyle";
import { CanvasAPI } from "../utils/CanvasAPI";

const CANVAS_WIDTH = screen.width
const CANVAS_HEIGHT = screen.height

/**
 * draw canvas
 * @param {{layerId: Number, display: String, backgroundColor: String}}
 * @returns {JSX.Element}
 */
export function DrawCanvas({layerId = 1, display = 'block', backgroundColor = 'white'}) {
    /**
     * all strokes on draw canvas
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

    function draw(){
        //update api
        updateAPI()

        //draw strokes
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctxRef.current = ctx

        canvasRef.current.width = CANVAS_WIDTH
        canvasRef.current.height = CANVAS_HEIGHT

        //clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        //fill with background color
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        //get draw style
        const drawStyle = useDrawStyle()
        Object.assign(ctx, drawStyle)

        //redraw all strokes 
        ctx.save() //save ctx before modify draw styles
        strokesRef.current.forEach(stroke => {
            // {
            //     stroke.points.forEach(point => {
            //         ctx.beginPath()
            //         ctx.arc(...point.toArray(), 10, 0, 2 * Math.PI)
            //         ctx.fillStyle = 'red'
            //         ctx.fill()
            //     })
            // }
            ctx.beginPath()
            const len = stroke.points.length
            if(len <= 0) return
            //apply draw style
            Object.assign(ctx, stroke.style)
            //move to first point
            const start = stroke.points[0]
            ctx.moveTo(start.x, start.y)
            if(len < 3) {
                //straight line
                for(let i = 1; i < len; i++) {
                    const point = stroke.points[i]
                    ctx.lineTo(...point.toArray())

                }
                ctx.stroke()
            }
            else {
                //curve line (smooth line)
                for(let i = 1; i < len - 2; i++) {
                    const curr = stroke.points[i];
                    const next = stroke.points[i + 1];
                    const center = curr.clone().plus(next).divide(2)
                    ctx.quadraticCurveTo(curr.x, curr.y, center.x, center.y)
                }
                ctx.quadraticCurveTo(...stroke.points[len - 2].toArray(), ...stroke.points[len - 1].toArray())
                ctx.stroke()
            }
        })
        ctx.restore() //restore ctx
    }

    const { registerCanvas, getCanvasAPI } = useDrawCanvas()

    /**
     * Awake function
     */
    useEffect(draw)

    //register on new canvas
    useEffect(() => {
        //canvas API
        const api = new CanvasAPI(canvasRef, strokesRef, draw)
        registerCanvas(layerId, api)
    }, [layerId])

    function updateAPI() {
        const api = getCanvasAPI(layerId)
        if(api) {
            strokesRef.current = api.strokesRef.current
        }
    }

    return (
        <canvas ref={canvasRef}
            style={{
                backgroundColor: 'green',
                position: 'absolute',
                width: CANVAS_WIDTH + 'px',
                height: CANVAS_HEIGHT + 'px',
                left: '0',
                top: '0',
                zIndex: layerId,
                display: display
            }}
        ></canvas>
    )
}