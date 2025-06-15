import React from "react";

/**
 * get Image Url from an area in canvas
 * @param {HTMLCanvasElement} canvas - target canvas
 * @param {Number} [sx = 0] - start x
 * @param {Number} [sy = 0] - start y 
 * @param {Number} [width = canvas.width] - width of image
 * @param {Number} [height = canvas.height] - heigth of image
 */
export function getImageURLFromCanvas(canvas, sx = 0, sy = 0, width = canvas.width, height = canvas.height) {
    //get context 
    const ctx = canvas.getContext('2d')
    //get image data
    const imageData = ctx.getImageData(sx, sy, width, height)

    //get new canvas
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height

    //get context of new canvas
    const tempCtx = tempCanvas.getContext('2d')
    //fill background with white
    tempCtx.fillStyle = 'white'
    tempCtx.fillRect(0, 0, width, height)
    //put image data to new canvas
    tempCtx.putImageData(imageData, 0, 0)
    //convert to url of base64 imgage in png type 
    const url = tempCanvas.toDataURL('image/png')

    return url
}