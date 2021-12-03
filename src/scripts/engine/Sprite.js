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
        this._flipH = false;
        this._flipV = false;
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
     * Horizontal flip
     */
    flipH() {
        this._flipH = true;
    }


    /**
     * Vertical flip
     */
    flipV() {
        this._flipV = true;
    }


    /**
     * Sprite drawing
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const x1 = this.x - (this._image.width / 2) * this._scale.x;
        const x2 = -this.x - (this._image.width / 2) * this._scale.x;
        const y1 = this.y - (this._image.height / 2) * this._scale.y;
        const y2 = -this.y - (this._image.height / 2) * this._scale.y;
        const w = this._image.width * this._scale.x;
        const h = this._image.height * this._scale.y;

        if (this._flipH && !this._flipV) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this._image, x2, y1, w, h);
            ctx.restore();
        } else if(this._flipV && !this._flipH) {
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(this._image, x1, y2, w, h);
            ctx.restore();
        } else if(this._flipV && this._flipH) {
            ctx.save();
            ctx.scale(-1, -1);
            ctx.drawImage(this._image, x2, y2, w, h);
            ctx.restore();
        } else {
            ctx.drawImage(this._image, x1, y1, w, h);
        }
    }


    /**
     * Clone
     * @returns {Sprite}
     */
    clone() {
        return new Sprite(this.url);
    }
}