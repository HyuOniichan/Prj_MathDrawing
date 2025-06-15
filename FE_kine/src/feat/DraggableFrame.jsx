import React, { useRef, useState, ReactNode } from "react";
import Draggable, {DraggableCore} from 'react-draggable';
import { Vector } from "../utils/Vector";
import { MathJax } from "better-react-mathjax";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
/**
 * draggable frame with shadow when drag
 * @param {{x: Number, y:Number, width: Number, height:Number, children: String}} 
 * @returns {JSX.Element}
 */
export function DraggableFrame({x, y, width, height, children}) {
    /**
     * div position
     * @type {React.RefObject<Vector>}
     */
    const positionRef = useRef(new Vector(x, y))

    /**
     * shadow div position
     * @type {React.RefObject<Vector | null>}
     */
    const shadowPositionRef = useRef(null)

    /**
     * update
     * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
     */
    const [_, update] = useState(0)

    /**
     * div reference
     * @type {React.RefObject<HTMLDivElement>}
     */
    const divRef = useRef()

    function handleStart() {
        shadowPositionRef.current = positionRef.current.clone()
        update(n => n + 1)
    }

    function handleDrag(e, data) {
        positionRef.current = new Vector(data.x, data.y)
        shadowPositionRef.current = positionRef.current.clone()
    }

    function handleStop() {
        shadowPositionRef.current = null
        update(n => n + 1)
    }

    //features

    const isPinned = useRef(false)

    const isRemove = useRef(false)

    function changePin() {
        isPinned.current = !isPinned.current
        update(n => n + 1)
    }

    async function copyText() {
        try {
            await navigator.clipboard.writeText(children)
            alert('Copied!')
        } catch(e) {
            alert(`Failed to copy text: \n${children}`)
        }
    }

    function removeThis() {
        isRemove.current = true
        update(n => 0)
    }

    return !isRemove.current && (
        <div style={{
            zIndex: 1003,
            position: 'absolute',
            width: '0',
            height: '0'
        }}>
            {/*show only if shadowPosition not null*/}
            {shadowPositionRef.current && (
                <div
                    style={{
                        position: 'absolute',
                        left: shadowPositionRef.current.x,
                        top: shadowPositionRef.current.y,
                        backgroundColor: 'rgba(0,0,0, 0.3)',
                        width: width,
                        height: height,
                        pointerEvents: 'none',
                        border: '2px black'
                    }}
                ></div>
            )}
            <Draggable nodeRef={divRef}
                cancel=".no-drag"
                position={{ x: positionRef.current.x, y: positionRef.current.y }}
                onStart={handleStart}
                onDrag={handleDrag}
                onStop={handleStop}
            >
                <div ref={divRef} className={isPinned.current ? 'no-drag' : ''}
                    style={{
                    backgroundColor: 'white',
                    width: width,
                    height: height,
                    border: '2px black solid',
                    position: 'relative',
                    cursor: isPinned.current ? 'default' : 'move'
                }}>
                    <div className="" style={{
                        position: 'absolute',
                        top: '0',
                        left:'0',
                        height: '20%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        backgroundColor: 'rgba(0,0,0, 0.6)',
                        alignItems: 'center'
                    }}>
                        <BarButton 
                            imageSrc="../src/image/feat/pin.png"
                            style={{
                                backgroundColor: isPinned.current ? 'red' : 'transparent'
                            }}
                            onClick={changePin}
                        ></BarButton>
                        <BarButton
                            imageSrc="../src/image/feat/copy.png"
                            onClick={copyText}
                        ></BarButton>
                        <BarButton
                            imageSrc="../src/image/feat/cancel.png"
                            style={{
                                position: 'absolute',
                                right: '5px'
                            }}
                            onClick={removeThis}
                        ></BarButton>
                    </div>
                    <MathJax dynamic>
                        <div style={{
                            position: 'absolute',
                            top: '20%',
                            left:'0',
                            height: '80%',
                            width: '100%',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            overflowY: 'auto'
                        }}>
                            <ReactMarkdown children={children} remarkPlugins={[remarkGfm]} />
                        </div>
                    </MathJax>
                </div>
            </Draggable>
        </div>
    )
}

function BarButton({imageSrc = '', onClick = () => {}, style = {}}) {
    return (
        <button className="no-drag"
            style={{
                position: 'relative',
                height: '80%',
                aspectRatio: '1',
                border: 'none',
                margin: '10px',
                cursor: 'default',
                backgroundColor: 'transparent',
                ...style
            }}
            onClick={onClick}
        >
            <img src={imageSrc} style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: 'auto'
            }}></img>
        </button>
    )
}