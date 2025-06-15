import { Vector } from "../utils/Vector";

/**
 * get minimum enclosing rectangle
 * @param {Vector[] | {x: Number, y: Number}[]} points 
 * @returns {{x:Number, y:Number, width:Number, height:Number}}
 */
export function getMER(points) {
    const minVec = new Vector(Infinity, Infinity)
    const maxVec = new Vector(-1, -1)

    for(let p of points) {
        minVec.x = Math.min(minVec.x, p.x)
        minVec.y = Math.min(minVec.y, p.y)
        maxVec.x = Math.max(maxVec.x, p.x)
        maxVec.y = Math.max(maxVec.y, p.y)
    }

    const wh = maxVec.subtract(minVec)

    return {
        x: minVec.x,
        y: minVec.y,
        width: wh.x,
        height: wh.y
    }
}