import React from 'react';
import { useState, useRef, useEffect } from "react";
import { Vector } from './Vector.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, _chosen, _drawStyleRef} from './globalValues.jsx';

//main app
export default function WhiteBoard() {
    return (
        <div className='canvas_container' style={{width: CANVAS_WIDTH, height: CANVAS_HEIGHT}}>
            {/*<canvas className='mask_canvas'

            ></canvas>*/}
            <MyCanvas/>
        </div>
    )
}

function MyCanvas() {
    //elements
    const mouseRef = useRef({
        position: new Vector(),
        isOnCanvas: false,
        isMouseDown: false,
    })

    //canvas ref
    /**@type {React.RefObject<HTMLCanvasElement | null>} */
    const canvasRef = useRef(null)
    /**@type {React.RefObject<CanvasRenderingContext2D | null>} */
    const ctxRef = useRef(null)

    //point ref
    /**@type {React.RefObject<Map<Vector[], Boolen>} */
    const pointsRef = useRef(new Map())

    let _pointsGroup = []

    //start point ref
    const [startPoint, setStartPoint] = useState(new Vector())

    //draw style ref
    const drawStyleRef = useRef(_drawStyleRef)

    useEffect(() => {
        //get canvas
        /**@type {HTMLCanvasElement} */
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctxRef.current = ctx

        //apply current styles
        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT

        Object.assign(ctx, drawStyleRef.current)

        ctxRef.current.save()
        _getPrevDraw()
        ctxRef.current.restore()
    })

    function _getPrevDraw() {
        for(let [vectors, style] of pointsRef.current.entries()) {
            if(!style) {
                pointsRef.current.delete(vectors)
            }
            else {
                
                ctxRef.current.beginPath()
                Object.assign(ctxRef.current, style)

                ctxRef.current.moveTo(...vectors[0].toArray())
                for(let vec of vectors) {
                    ctxRef.current.lineTo(...vec.toArray())
                }
                ctxRef.current.stroke()
                
            }
        }
    }

    /**
     * update mouse on canvas boolen
     * @param {Boolen} isOnCanvas
     */
    function updateMouseOnCanvas(isOnCanvas) {
        mouseRef.current.isOnCanvas = isOnCanvas
        if(!isOnCanvas) {
            updateMouseDown(false)
        }
    }

    /**
     * update mouse down boolen
     * @param {Boolen} isMouseDown 
     */
    function updateMouseDown(isMouseDown) {
        mouseRef.current.isMouseDown = isMouseDown
        if(isMouseDown) {
            setStartPoint(mouseRef.current.position.clone())
            requestAnimationFrame(() => {
                ctxRef.current.beginPath()
                ctxRef.current.moveTo(...mouseRef.current.position.toArray())
            })
        }
        else {
            _handleMouseUp[_chosen.option || 'no-option']?.()
        }
    }

    _handleMouseUp = {
        'no-option': () => {
            if(_pointsGroup.length !== 0) {
                pointsRef.current.set(_pointsGroup, {...drawStyleRef.current})
            }
        },
        'selection': () => {
            
        }
    }

    /**
     * handle mouse move on canvas
     * @param {React.MouseEvent<HTMLCanvasElement>} e 
     */
    function handleMouseMove(e) {
        const x = e.nativeEvent.offsetX
        const y = e.nativeEvent.offsetY
        mouseRef.current.position.set(x, y)
        if(mouseRef.current.isMouseDown) {
            if(mouseRef.current.isOnCanvas) {
                _handleOption[_chosen.option || 'no-option']?.(x, y)
            }
        }
    }

    const _handleOption = {
        'no-option': (x, y) => {
            //draw if no option
            ctxRef.current.lineTo(x, y)
            ctxRef.current.stroke()
            _pointsGroup.push(new Vector(x, y))
        },
        'selection': (x, y) => {
            //select place to get image
            ctxRef.current.save()
            ctxRef.current.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT)
            _getPrevDraw()
            ctxRef.current.lineWidth = 2

            ctxRef.current.setLineDash([10, 5])
            ctxRef.current.strokeRect(...startPoint.toArray(), ...mouseRef.current.position.clone().subtract(startPoint).toArray())
            ctxRef.current.restore()
        }
    }

    return (
        <canvas className='canvas' ref={canvasRef}
            onMouseEnter={() => updateMouseOnCanvas(true)}
            onMouseLeave={() => updateMouseOnCanvas(false)}
            onMouseMove={handleMouseMove} 
            onMouseDown={() => updateMouseDown(true)}
            onMouseUp={() => updateMouseDown(false)}
        ></canvas>
    )
}

