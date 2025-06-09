import React from "react";
import { Vector } from "./Vector";
import { drawStyleRef, useDrawStyle } from "../Instances/drawStyle";

/**
 * a draw by user 
 */
export class Stroke {
    /**
     * @param {Vector[]} points 
     */
    constructor(points = [], style = useDrawStyle()) {
        /**@type {Vector[]} */
        this.points = points
        /**@type {{}} */
        this.style = style

        this.getBounderBox()
    }

    bounderBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }

    /**
     * stroke bounder box (minimum enclosing rectangle)
     */
    getBounderBox() {
        const minVec = new Vector(Infinity, Infinity)
        const maxVec = new Vector(-1, -1)
        for(let p of this.points) {
            minVec.x = Math.min(minVec.x, p.x)
            minVec.y = Math.min(minVec.y, p.y)
            maxVec.x = Math.max(maxVec.x, p.x)
            maxVec.y = Math.max(maxVec.y, p.y)
        }
        const wh = maxVec.subtract(minVec)
        Object.assign(this.bounderBox, {
            x: minVec.x,
            y: minVec.y,
            width: wh.x,
            height: wh.y
        })

        return this.bounderBox
    }
}