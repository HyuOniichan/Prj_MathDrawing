import React from "react";
import { useTool } from "../contexts/ToolContext";

export function ToolSelector({zIndex = 999}) {
    return (
        <div 
            style={{
                position: 'absolute',
                width: '55px',
                height: 'auto',
                left: '20px',
                top: '50%',
                translate: '0 -50%',
                backgroundColor: 'white',
                border: '2px solid black',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2.5px',
                zIndex: zIndex
            }}
        >
            <ToolButton name={'Pen'} />
            <ToolButton name={'Eraser'} />
            <ToolButton name={'Select'} />
        </div>
    )
}

export function ToolButton({name}) {
    const {activeToolName, setActiveTool} = useTool()

    const imageSrc = `../src/image/tool/${name}.png`

    function switchTool() {
        setActiveTool(name)
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '50px',
                height: '50px',
                margin: '2.5px',
                backgroundColor: 'aqua'
            }}
        >
            <button 
                onClick={switchTool}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    filter: activeToolName === name ? 'brightness(0.8)' : 'none'
                }}  
            >
                <img src={imageSrc} style={{height: '100%', width: 'auto'}}></img>
            </button>
        </div>
    )
}