const EventEmitter = require("events");


export class Sprite extends EventEmitter {
    /**
     * Sprite class
     * @param {String} url
     */
    constructor(url) {
        super();

        this._image = new Image();
        this._image.src = url;
        this.url = url;
        this._image.onload = () => this.emit("load", this);
        this._scale = { x: 1, y: 1 };
        this.x = 0;
        this.y = 0;
    }


    /**
     * Sprite set scale
     * @param {Number} sx
     * @param {Number} sy
     */
    setScale(sx, sy) {
        this._scale = { x: sx, y: sy };
    }


    /**
     * Sprite drawing
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        let x = this.x - (this._image.width / 2) * this._scale.x;
        let y = this.y - (this._image.height / 2) * this._scale.y;
        let w = this._image.width * this._scale.x;
        let h = this._image.height * this._scale.y;

        ctx.drawImage(this._image, x, y, w, h);
    }


    /**
     * Clone
     * @returns {Sprite}
     */
    clone() {
        return new Sprite(this.url);
    }
}