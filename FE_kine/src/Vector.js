export class Vector {
    /**
     * Create a vector2 , default is vector zero (0,0)
     * @param {Number} x - position x, default is 0
     * @param {Number} y - position y, default is 0
     */
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    /**
     * set position for vector
     * @param {Number} x 
     * @param {Number} y 
     */
    set(x, y) {
        this.x = x
        this.y = y
    }

    /**
     * copy another vector
     * @param {Vector} vector 
     */
    copy(vector) {
        Object.assign(this, {
            x: vector.x,
            y: vector.y
        })
    }

    /**
     * clone this vector
     * @returns {Vector}
     */
    clone() {
        return new Vector(this.x, this.y)
    }

    /**
     * turn vector into origin point (x = 0, y = 0, z = 0)
     */
    zero() {
        this.x = 0
        this.y = 0
    }

    /**
     * compare this position to another vector position
     * @param {Vector} vector 
     * @returns {Boolen}
     */
    isEqual(vector) {
        return this.x === vector.x && this.y === vector.y
    }

    /**
     * subtract this vector to a vector
     * @param {Vector} vector 
     * @param {number} [multiply=1] - default is 1
     * @returns {Vector}
     */
    subtract(vector, multiply = 1) {
        this.x -= vector.x * multiply
        this.y -= vector.y * multiply
        return this
    }

    /**
     * plus this vector with a vector
     * @param {Vector} vector 
     * @param {number} [multiply=1] - default is 1
     * @returns {Vector}
     */
    plus(vector, multiply = 1) {
        this.x += vector.x * multiply
        this.y += vector.y * multiply
        return this
    }
    
    /**
     * multiply x and y of vector
     * @param {Number} rate 
     * @returns {Vector}
     */
    multiply(rate) {
        this.x *= rate
        this.y *= rate
        return this
    }
    
    /**
     * divide x and y of vector
     * @param {Number} rate 
     * @returns {Vector}
     */
    divide(rate) {
        this.x /= rate
        this.y /= rate
        return this
    }

    /**@type {Vector | null} */
    #saveData = null

    /**
     * save vector
     */
    save() {
        this.#saveData = this.clone()
    }

    /**
     * restore vector
     */
    restore() {
        if(this.#saveData !== null) {
            this.copy(this.#saveData)
        }
    }

    /**
     * @returns {[x: Number, y: Number]}
     */
    toArray() {
        return [this.x, this.y]
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y
        }
    }
}