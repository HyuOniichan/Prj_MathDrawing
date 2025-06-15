import React from "react";
import { Vector } from "./Vector";
import { drawStyleRef, useDrawStyle } from "../Instances/drawStyle";
import { getMER } from "../helper/getMER";

/**
 * a draw by user 
 */
export class Stroke {
    /**
     * @param {Vector[]} points 
     */
    constructor(points = [], style = useDrawStyle()) {
        /**
         * stroke points
         * @type {Vector[]} 
         */
        this.points = points
        /**@type {{}} */
        this.style = style
        /**
         * stroke bounder box (minimum enclosing rectangle)
         * @type {{x:Number, y:Number, width:Number, height:Number}}
         */
        this.bounderBox = getMER(this.points)
    }

    getBounderBox() {
        this.bounderBox = getMER(this.points)
        return this.bounderBox
    }
}