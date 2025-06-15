import React, { Children, useEffect, useRef, useState } from "react";
import { currentFocusedStrokes } from "../tools/SelectTool";
import { getImageURLFromCanvas } from "../helper/imageCreator";
import { useDrawCanvas } from "../contexts/DrawCanvasContext";
import { getMER } from "../helper/getMER";
import { solveMathImage } from "../../../BE_kine/gemini";
import { Vector } from "../utils/Vector";
import { DraggableFrame } from "./DraggableFrame";

/**
 * @description a button that will available when select strokes
 * @remark use only for asking AI about a MATH PROBLEM
 * @returns {JSX.Element}
 */
export function AskAIButton() {
    //get the current canvas
    const {focusedLayer, getCanvasAPI} = useDrawCanvas()
    /**@type {HTMLCanvasElement} */
    let canvas = null

    useEffect(() => {
        const canvasAPI = getCanvasAPI(focusedLayer)
        if(canvasAPI) {
            canvas = canvasAPI.canvasRef.current
        }
    })

    /**
     * answer frames
     * @type {[DraggableFrame[], React.Dispatch<React.SetStateAction<DraggableFrame[]>>]}
     */
    const [frames, setFrames] = useState([])

    function handleClick() {
        if(currentFocusedStrokes.current === null || canvas === null) return

        //get all selected points
        /**@type {Vector[]} */
        const points = currentFocusedStrokes.current.map(stroke => stroke.points).flat()

        //get the box that contains all selected strokes (MER)
        const box = getMER(points)

        //get start position of draggable frame
        const startPos = new Vector(box.x, box.y)

        //get image url
        const url = getImageURLFromCanvas(canvas, box.x, box.y, box.width, box.height)

        handleUrl(url, startPos)
    }

    /**
     * ask AI and 
     * @param {String} url 
     * @param {Vector} startPos 
     */
    async function handleUrl(url, startPos) {
        const res = await tryAskAI(url)

        const frameData = {
            id: crypto.randomUUID(),
            x: startPos.x,
            y: startPos.y,
            width: 500,
            height: 300,
            content: res
        }

        setFrames(prev => [...prev, frameData])
    }

    /**
     * try asking AI about math using image url
     * @param {String} url 
     * @returns {Promise<string>}
     */
    async function tryAskAI(url) {
        console.log('asking for AI...')
        //ask AI using url
        const res = await solveMathImage(url)
        console.log(res)
        return res
    }

    return (
        <>
            <span>
                {frames.map(frame => (
                    <DraggableFrame
                        key={frame.id}
                        x={frame.x}
                        y={frame.y}
                        width={frame.width}
                        height={frame.height}
                        children={frame.content}
                    ></DraggableFrame>
                ))}
            </span>

            <button onClick={handleClick}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '70px',
                    width: '50px',
                    height: '50px',
                    border: 'black 2px solid',
                    borderRadius: '25px',
                    backgroundColor: 'red',
                    color: 'blue',
                    zIndex: 10000
                }}
            >
            {'AI'}
            </button>
        </>
    )
}