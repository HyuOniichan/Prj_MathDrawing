import React from "react";
import { useHistory } from "../contexts/HistoryContext";

export function HistoryModifier() {
    const history = useHistory()

    function back() {
        history.undo()
    }

    function forward() {
        history.redo()
    }

    return (
        <div 
            style={{
                position: 'absolute',
                bottom: '50px',
                left: '100px',
                height: '50px',
                width: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
            }}
        >
            <button 
                style={{
                    position: 'relative',
                    height: '100%',
                    aspectRatio: '1'
                }}
                onClick={back}
            >
                <img src="../src/image/feat/back.png" style={{height: '100%', width: 'auto'}}></img>
            </button>
            <button 
                style={{
                    position: 'relative',
                    height: '100%',
                    aspectRatio: '1'
                }}
                onClick={forward}
            >
                <img src="../src/image/feat/forward.png" style={{height: '100%', width: 'auto'}}></img>
            </button>
        </div>
    )
}