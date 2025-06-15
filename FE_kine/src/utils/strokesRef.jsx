import React, { useRef } from "react";
import { Stroke } from "../utils/Stroke";

/**
 * get new canvas strokes reference 
 * @returns {React.RefObject<Stroke[]>}
 */
export function useStrokeRef() {
    /**@type {React.RefObject<Stroke[]>} */
    const strokesRef = useRef([])
    return strokesRef
}