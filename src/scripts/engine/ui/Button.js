import {Globals} from "../Globals";


export class Button {
    /**
     * Button class
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {String} text
     */
    constructor(x, y, width, height, text = null) {
        this.clicked = false;
        this.pressed = false;
        this.released = true;
        this.hovered = false;
        this.state = "normal";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this._haveImage = false;
        this._color = null;
        this._image = null;
        this._textColor = null;
    }


    /**
     * Set button images
     * @param {Sprite} normal
     * @param {Sprite} highlight
     * @param {Sprite} pressed
     * @param {Sprite} disabled
     */
    setImage(normal, highlight, pressed, disabled) {
        this._haveImage = true;
        this._image = { normal, highlight, pressed, disabled };
    }


    /**
     * Set button colors
     * @param {String} normal
     * @param {String} highlight
     * @param {String} pressed
     * @param {String} disabled
     */
    setColor(normal, highlight, pressed, disabled) {
        this._color = { normal, highlight, pressed, disabled };
    }


    /**
     * Set text colors
     * @param {String} normal
     * @param {String} disabled
     */
    setTextColor(normal, disabled) {
        this._textColor = { normal, disabled };
    }


    /**
     * Enable or not the button
     * @param enabled
     */
    enable(enabled) {
        if (enabled) {
            this.state = "normal";
        } else {
            this.state = "disabled";
        }
    }


    /**
     * Button state update
     * @param {Number} dt
     */
    update(dt) {
        if (this._haveImage) {
            for (let name in this._image) {
                let image = this._image[name];
                image.x = this.x;
                image.y = this.y;
            }
        }

        if (this.state === "disabled") {
            this.clicked = false;
            return;
        }

        const mouse = Globals.mouseMgr;
        const leftClick = mouse.button["left"];
        const x = this.x - this.width / 2;
        const y = this.y - this.height / 2;
        const inBounds = mouse.inBoundsRect(x, y, this.width, this.height);

        this.hovered = inBounds;

        this.pressed = false;
        if (inBounds && !leftClick) {
            this.state = "highlight";
        } else if (inBounds && leftClick) {
            this.state = "pressed";
            this.pressed = true;
        } else {
            this.state = "normal";
        }
        this.released = !this.pressed;

        this.clicked = mouse.state["left"] === "new_down" && inBounds;
    }


    /**
     * Draw button
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (this._haveImage) {
            this._image[this.state].draw(ctx);
        } else {
            ctx.fillStyle = this._color[this.state];
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        if (this.text !== null && this._textColor !== null) {
            ctx.fillStyle = this._textColor[this.state === "disabled" ? "disabled" : "normal"];
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.text, this.x, this.y);
        }
    }
}