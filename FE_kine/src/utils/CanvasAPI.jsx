import React from "react";
import { Stroke } from "./Stroke";

/**
 * canvas API
 */
export class CanvasAPI {
    /**
     * @param {React.RefObject<HTMLCanvasElement>} canvasRef - canvas reference
     * @param {React.RefObject<Stroke[]>} strokesRef - strokes reference
     * @param {() => any} drawCanvas - draw function
     */
    constructor(canvasRef = null, strokesRef = null, drawCanvas = () => {}) {
        /**@type {React.RefObject<HTMLCanvasElement>} */
        this.canvasRef = canvasRef
        /**@type {React.RefObject<Stroke[]>} */
        this.strokesRef = strokesRef
        /**@type {() => any} */
        this.drawCanvas = drawCanvas
    }
}