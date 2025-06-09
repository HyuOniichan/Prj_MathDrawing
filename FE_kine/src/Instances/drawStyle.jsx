import React, { createRef } from "react";

/**
 * draw style reference
 * @type {React.RefObject<{
 * strokeStyle: String,
 * lineWidth: Number,
 * lineCap: String,
 * lineJoin: String,
 * globalCompositeOperation: String
 * }>}
 */
export const drawStyleRef = createRef()

drawStyleRef.current = {
    strokeStyle: 'black',
    lineWidth: 3,
    lineCap: 'round',
    lineJoin: 'round',
    globalCompositeOperation: 'source-over'
}

export function useDrawStyle() {
    return {...drawStyleRef.current}
}